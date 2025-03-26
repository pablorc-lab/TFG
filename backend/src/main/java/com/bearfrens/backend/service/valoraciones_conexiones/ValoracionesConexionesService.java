package com.bearfrens.backend.service.valoraciones_conexiones;

import com.bearfrens.backend.entity.matches.Matches;
import com.bearfrens.backend.entity.user.Anfitrion;
import com.bearfrens.backend.entity.user.Viajero;
import com.bearfrens.backend.entity.valoracione_conexiones.Likes;
import com.bearfrens.backend.entity.valoracione_conexiones.ValoracionConexion;
import com.bearfrens.backend.entity.valoracione_conexiones.Valoraciones;
import com.bearfrens.backend.repository.matches.MatchesRepository;
import com.bearfrens.backend.repository.valoraciones_conexiones.ValoracionesConexionesRepository;
import com.bearfrens.backend.service.GestorUsuarioService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.time.LocalDate;
import java.util.*;

// Servirá como base para las "valoraciones", "likes" y "matches"
// <T> puede ser Valoraciones, Likes o Matches
@AllArgsConstructor
public abstract class ValoracionesConexionesService<T extends ValoracionConexion> {
  private final GestorUsuarioService gestorUsuarioService;
  private final ValoracionesConexionesRepository<T> repository;
  private final MatchesRepository matchesRepository;

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
    return repository.findAllByUsuarioIDAndTipoUsuario(usuarioID,tipo);
  }

  /**
   * Crear un <T> de un usuario a otro
   * @param tipo_usuario Tipo de usuario emisor en String
   * @param usuarioID ID del usuario emisor
   * @param receptorID ID del usuario receptor
   * @return <T> creado o mensaje de error si ya existe
   */
  public ResponseEntity<?> crearValoracionesConexiones(String tipo_usuario, Long usuarioID, Long receptorID, T nuevoElemento) {
    if(gestorUsuarioService.NoExisteAmbosUsuario(tipo_usuario, usuarioID, receptorID)) {
      return ResponseEntity.badRequest().body("Los usuarios asociados debe existir");
    }

    // Comprobar si ya existe un like dado por el usuario Emisor
    int tipo_receptor = gestorUsuarioService.intTipoUsuario(tipo_usuario) == 1 ? 2 : 1;// Almacenar el tipo del RECEPTOR no del emisor
    if(repository.findByEmisorIDAndUsuarioIDAndTipoUsuario(usuarioID, receptorID, tipo_receptor).isPresent()){
      return ResponseEntity.badRequest().body("Ya se ha dado like/valoración al receptor con id = " + receptorID);
    }

    nuevoElemento.setEmisorID(usuarioID);
    nuevoElemento.setTipoUsuario(tipo_receptor);
    nuevoElemento.setUsuarioID(receptorID);

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

    // Si es una valoración añadir fecha e imagen de perfil del emisor
    else if(nuevoElemento instanceof Valoraciones) {
      ((Valoraciones) nuevoElemento).setFecha(LocalDate.now());

      // Al crear una valoracion, se actualiza la media del usuario
      List<Valoraciones> response = (List<Valoraciones>) repository.findAllByEmisorIDAndTipoUsuario(usuarioID, tipo_receptor);

      //Actualizar la nota media del usuario receptor
      if (tipo_receptor == 1) {
        Anfitrion anfitrion = gestorUsuarioService.obtenerAnfitrion(receptorID);
        anfitrion.setValoracion_media(((Valoraciones) nuevoElemento).getNum_valoracion());
        gestorUsuarioService.guardarAnfitrion(anfitrion);
        ((Valoraciones) nuevoElemento).setEmisor_profile_img(anfitrion.getProfileImage());
      }

      else{
        Viajero viajero = gestorUsuarioService.obtenerViajero(receptorID);
        viajero.setValoracion_media(((Valoraciones) nuevoElemento).getNum_valoracion());
        gestorUsuarioService.guardarViajero(viajero);
        ((Valoraciones) nuevoElemento).setEmisor_profile_img(viajero.getProfileImage());
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
  public ResponseEntity<Map<String, Boolean>> eliminarValoracionesConexiones(Long usuarioID, String tipo_usuario) {
    if (!gestorUsuarioService.existeUsuario(tipo_usuario, usuarioID)) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Collections.singletonMap("deleted", false));
    }

    int tipo = gestorUsuarioService.intTipoUsuario(tipo_usuario);
    List<T> recibidos = repository.findAllByUsuarioIDAndTipoUsuario(usuarioID, tipo);
    List<T> enviados = repository.findAllByEmisorIDAndTipoUsuario(usuarioID, tipo == 1 ? 2 : 1);

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
