package com.bearfrens.backend.service.valoraciones_conexiones;

import com.bearfrens.backend.entity.matches.Matches;
import com.bearfrens.backend.entity.user.Anfitrion;
import com.bearfrens.backend.entity.user.Usuario;
import com.bearfrens.backend.entity.user.Viajero;
import com.bearfrens.backend.entity.valoracione_conexiones.Likes;
import com.bearfrens.backend.entity.valoracione_conexiones.ValoracionConexion;
import com.bearfrens.backend.entity.valoracione_conexiones.Valoraciones;
import com.bearfrens.backend.repository.matches.MatchesRepository;
import com.bearfrens.backend.repository.valoraciones_conexiones.ValoracionesConexionesRepository;
import com.bearfrens.backend.service.GestorUsuarioService;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;

// Servirá como base para las "valoraciones", "likes" y "matches"
// <T> puede ser Valoraciones, Likes o Matches
@AllArgsConstructor
public abstract class ValoracionesConexionesService<T extends ValoracionConexion> {
  @Autowired
  private final GestorUsuarioService gestorUsuarioService;

  private final ValoracionesConexionesRepository<T> repository;
  private final MatchesRepository matchesRepository;


  public List<T> obtenerTodo(){
    List<T> lista = repository.findAll();

    // SI es una valoración, hay que obtener la imagen de perfil y nombre del usuario
    if(!lista.isEmpty() && lista.getFirst() instanceof Valoraciones){


      for(Valoraciones valoracion : (List<Valoraciones>) lista){
        int tipo_emisor = valoracion.getTipoUsuario() == 1 ? 2 : 1;
        Usuario emisor;

        if(tipo_emisor == 1){
          emisor = gestorUsuarioService.obtenerAnfitrion(valoracion.getEmisorID());
        } else{
          emisor = gestorUsuarioService.obtenerViajero(valoracion.getEmisorID());
        }

        valoracion.setEmisor_profile_img(emisor.getProfileImage());
        valoracion.setEmisor_nombre(emisor.getNombre() + " " + emisor.getApellido().charAt(0));
      }
    }
    return lista;
  }
  /**
   * Devuelve una lista de viajeros, dado el ID del anfitrión receptor
   * @param receptorID ID del anfitrión receptor
   * @return Lista de viajeros
   */
  public Map<Viajero, LocalDate> obtenerLikesViajerosPerfiles(Long receptorID){
    List<Likes> likes_dados = (List<Likes>) repository.findAllByUsuarioIDAndTipoUsuario(receptorID, 1);

    Map<Long, LocalDate> viajeros_ids = new HashMap<>();
    List<Long> lista_ids = new ArrayList<>();

    for(Likes like : likes_dados){
      viajeros_ids.put(like.getEmisorID(), like.getFecha());
      lista_ids.add(like.getEmisorID());
    }

    List<Viajero> viajeros = gestorUsuarioService.obtenerListaViajeros(lista_ids);

    Map<Viajero, LocalDate> resultado = new HashMap<>();
    for (Viajero viajero : viajeros) {
      resultado.put(viajero, viajeros_ids.get(viajero.getId()));
    }

    return resultado;
  }

  /**
   * Obtener la lista de tipo <T> dados por un usuario
   * @param tipo_usuario Tipo de usuario emisor en String (se convierte al del receptor)
   * @param usuarioID ID del usuario emisor
   * @return Lista de likes
   */
  public List<T> obtenerListaValoracionesConexionesEnviadas(Long usuarioID, String tipo_usuario){
    int tipo = gestorUsuarioService.intTipoUsuario(tipo_usuario);
    return repository.findAllByEmisorIDAndTipoUsuario(usuarioID,tipo == 1 ? 2 : 1);
  }

  /**
   * Obtener la lista de tipo <T> recibidas por un usuario
   * @param tipo_usuario Tipo de usuario emisor en String (se convierte al del receptor)
   * @param usuarioID ID del usuario emisor
   * @return Lista de likes
   */
  public List<T> obtenerListaValoracionesConexionesRecibidas(Long usuarioID, String tipo_usuario){
    int tipo = gestorUsuarioService.intTipoUsuario(tipo_usuario);
    List<T> lista = repository.findAllByUsuarioIDAndTipoUsuario(usuarioID,tipo);

    // SI es una valoración, hay que obtener la imagen de perfil y nombre del usuario
    if(!lista.isEmpty() && lista.getFirst() instanceof Valoraciones){
      int tipo_emisor = tipo == 1 ? 2 : 1;

      for(Valoraciones valoracion : (List<Valoraciones>) lista){
        Usuario emisor;

        if(tipo_emisor == 1){
          emisor = gestorUsuarioService.obtenerAnfitrion(valoracion.getEmisorID());
        } else{
          emisor = gestorUsuarioService.obtenerViajero(valoracion.getEmisorID());
        }

        valoracion.setEmisor_profile_img(emisor.getProfileImage());
        valoracion.setEmisor_nombre(emisor.getNombre() + " " + emisor.getApellido().charAt(0));
      }
    }

    return lista;
  }

  /**
   * Crear un <T> de un usuario a otro
   * @param tipo_usuario Tipo de usuario emisor en String
   * @param usuarioID ID del usuario emisor
   * @param receptorID ID del usuario receptor
   * @return <T> creado o mensaje de error si ya existe
   */
  @Transactional
  public ResponseEntity<?> crearValoracionesConexiones(String tipo_usuario, Long usuarioID, Long receptorID, T nuevoElemento) {
    if(gestorUsuarioService.NoExisteAmbosUsuario(tipo_usuario, usuarioID, receptorID)) {
      return ResponseEntity.badRequest().body("Los usuarios asociados debe existir");
    }

    // Comprobar si ya existe un like/valoracion dado por el usuario Emisor
    int tipo_receptor = gestorUsuarioService.intTipoUsuario(tipo_usuario) == 1 ? 2 : 1;// Almacenar el tipo del RECEPTOR no del emisor
    if(repository.findByEmisorIDAndUsuarioIDAndTipoUsuario(usuarioID, receptorID, tipo_receptor).isPresent()){
      return ResponseEntity.badRequest().body("Ya se ha dado like/valoración al receptor con id = " + receptorID);
    }

    nuevoElemento.setEmisorID(usuarioID);
    nuevoElemento.setTipoUsuario(tipo_receptor);
    nuevoElemento.setUsuarioID(receptorID);
    nuevoElemento.setFecha(LocalDate.now());

    // Si es un like comprobar si es recíproco para guardarlo en la tabla "matches"
    if(nuevoElemento instanceof Likes){
      Optional<T> likeReciproco = repository.findByEmisorIDAndUsuarioIDAndTipoUsuario(receptorID, usuarioID, tipo_receptor == 1 ? 2 : 1);

      if(likeReciproco.isPresent()){
        Matches nuevoMatch = new Matches();
        nuevoMatch.setAnfitrionID(tipo_receptor == 1 ? receptorID : usuarioID); // Si el receptor es el anfitrion, guardar el id correspondiente
        nuevoMatch.setViajeroID(tipo_receptor == 1 ? usuarioID : receptorID); // Si el receptor es anfitrion, guardar el id contrario
        matchesRepository.save(nuevoMatch);
      }
    }

    // Si es una valoración añadir imagen de perfil del emisor
    else if(nuevoElemento instanceof Valoraciones) {

      //Actualizar la nota media del usuario receptor
      if (tipo_receptor == 1) {
        Anfitrion receptor = gestorUsuarioService.obtenerAnfitrion(receptorID);
        receptor.setValoracion_media(((Valoraciones) nuevoElemento).getNum_valoracion());
        gestorUsuarioService.guardarAnfitrion(receptor);
      }

      else{
        Viajero receptor = gestorUsuarioService.obtenerViajero(receptorID);
        receptor.setValoracion_media(((Valoraciones) nuevoElemento).getNum_valoracion());
        gestorUsuarioService.guardarViajero(receptor);
      }
    }

    repository.save(nuevoElemento);
    return ResponseEntity.status(HttpStatus.CREATED).body(nuevoElemento);
  }

  /**
   * Elimina todos los valores de tipo <T> recibidos/enviadas por un usuario (por ejemplo, si ELIMINAR su cuenta)
   * @param tipo_usuario Tipo de usuario receptor en String
   * @param usuarioID ID del usuario receptor
   * @return Respuesta con el resultado de la operación
   */
  @Transactional
  public ResponseEntity<Map<String, Boolean>> eliminarValoracionesConexiones(Long usuarioID, String tipo_usuario) {
    if (!gestorUsuarioService.existeUsuario(tipo_usuario, usuarioID)) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Collections.singletonMap("deleted", false));
    }

    int tipo = gestorUsuarioService.intTipoUsuario(tipo_usuario);
    List<T> recibidos = repository.findAllByUsuarioIDAndTipoUsuario(usuarioID, tipo);
    List<T> enviados = repository.findAllByEmisorIDAndTipoUsuario(usuarioID, tipo == 1 ? 2 : 1);

    if (!recibidos.isEmpty() && recibidos.getFirst() instanceof Valoraciones) {
      // Eliminar nota media
      if(tipo == 1){
        Anfitrion anfitrion = gestorUsuarioService.obtenerAnfitrion(usuarioID);
        anfitrion.setDeleteValoracion_media(BigDecimal.ZERO);
        anfitrion.setNum_valoraciones(0);
        gestorUsuarioService.guardarAnfitrion(anfitrion);
      }

      else{
        Viajero viajero = gestorUsuarioService.obtenerViajero(usuarioID);
        viajero.setDeleteValoracion_media(BigDecimal.ZERO);
        viajero.setNum_valoraciones(0);
        gestorUsuarioService.guardarViajero(viajero);
      }
    }

    List<T> totales = new ArrayList<>();
    totales.addAll(recibidos);
    totales.addAll(enviados);

    if (totales.isEmpty()) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Collections.singletonMap("deleted", false));
    }

    repository.deleteAll(totales);
    return ResponseEntity.ok(Collections.singletonMap("deleted", true));
  }
}
