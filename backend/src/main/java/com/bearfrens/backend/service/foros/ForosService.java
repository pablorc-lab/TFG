package com.bearfrens.backend.service.foros;

import com.bearfrens.backend.entity.foros.Foros;
import com.bearfrens.backend.entity.user.Usuario;
import com.bearfrens.backend.repository.foros.ForosRepository;
import com.bearfrens.backend.service.GestorUsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class ForosService {

  @Autowired
  private ForosRepository forosRepository;

  @Autowired
  private GestorUsuarioService gestorUsuarioService;

  /**
   * Crea un nuevo foro con los parámetros proporcionados y lo guarda en la base de datos.
   *
   * @param foroData Objeto foro con la informacion
   * @return una respuesta con el foro creado
   */
  public ResponseEntity<Foros> crearForo(Foros foroData) {
    Foros foro = new Foros();
    foro.setForoPadre(null);
    foro.setNum_respuestas(0); // Cuando se crea el número de respuesta es 0
    foro.setTipoUsuario(foroData.getTipoUsuario());
    foro.setUsuarioID(foroData.getUsuarioID());
    foro.setDescripcion(foroData.getDescripcion());
    foro.setFecha(LocalDate.now()); // La fecha se estab

    return ResponseEntity.ok(forosRepository.save(foro));
  }

  /**
   * Crea una respuesta a un foro existente usando los datos proporcionados.
   *
   * @param foroPadreID el ID del foro al que se responde
   * @param foroData objeto que contiene la información del usuario y la descripción de la respuesta
   * @return una respuesta con la entidad Foros creada como respuesta
   */
  public ResponseEntity<Foros> crearRespuesta(Long foroPadreID, Foros foroData) {
    Foros foroPadre = forosRepository.findById(foroPadreID)
      .orElseThrow(() -> new RuntimeException("Foro no encontrado"));

    Foros respuesta = new Foros();
    respuesta.setForoPadre(foroPadre);
    respuesta.setNum_respuestas(null);
    respuesta.setTipoUsuario(foroData.getTipoUsuario());
    respuesta.setUsuarioID(foroData.getUsuarioID());
    respuesta.setDescripcion(foroData.getDescripcion());
    respuesta.setFecha(LocalDate.now());

    foroPadre.setNum_respuestas(foroPadre.getNum_respuestas() + 1);
    forosRepository.save(foroPadre);

    return ResponseEntity.ok(forosRepository.save(respuesta));
  }

  /**
   * Obtiene una lista de foros anteriores a una fecha dada, ordenados de más reciente a más antiguo.
   *
   * @param tamanio  cantidad de elementos a devolver
   * @param ultimaFecha fecha del último foro cargado (puede ser null para la primera carga)
   * @param paginaInicial Número de página donde se empiezan a cargar los datos
   * @return un mapa con la lista de foros y un booleano indicando si hay más
   */
  public Map<String, Object> obtenerForosPorCursor(int tamanio, LocalDate ultimaFecha, int paginaInicial) {
    PageRequest page = PageRequest.of(paginaInicial, tamanio);
    List<Foros> foros;

    if (ultimaFecha != null) {
      // Para no repetir foros con ese id, los ordenamos por ID de forma ascendente
      foros = forosRepository.findAllByForoPadreIsNullAndFechaLessThanEqualOrderByFechaDescIdAsc(ultimaFecha, page);
    }
    else {
      foros = forosRepository.findAllByForoPadreIsNullOrderByFechaDesc(page);
    }


    // Obtener información de cada usuario
    for(Foros foro : foros){
      Usuario usuario = foro.getTipoUsuario() == 1
        ? gestorUsuarioService.obtenerAnfitrion(foro.getUsuarioID())
        : gestorUsuarioService.obtenerViajero(foro.getUsuarioID());

      if(usuario == null){
        foro.setUsuario_nombre("Usuario eliminado");
        foro.setUsuario_private_id("undefined");
      }
      else {
        foro.setUsuario_nombre(usuario.getNombre() + " " + usuario.getApellido().charAt(0));
        foro.setUsuario_profile_img(usuario.getProfileImage());
        foro.setUsuario_private_id(usuario.getPrivateID());
      }
    }

    boolean hasMore = false;
    LocalDate lastFecha = foros.getLast().getFecha();

    if (foros.size() == tamanio) { // Verifica si hay más foros con fecha igual o anterior
      hasMore = forosRepository.existsByFechaLessThanEqualAndIdNot(lastFecha, foros.getLast().getId());
    }

    Map<String, Object> response = new HashMap<>();
    response.put("data", foros);
    response.put("hasMore", hasMore);
    response.put("lastFecha", lastFecha);

    return response;
  }


  // Suponiendo que usas Spring para tu API
  public ResponseEntity<List<Foros>> obtenerRespuestas(Long foroPadreID) {
    List<Foros> respuestas = forosRepository.findByForoPadreId(foroPadreID);

    // Obtener información de cada usuario de la respuesta
    for(Foros respuesta : respuestas){
      Usuario usuario = respuesta.getTipoUsuario() == 1
        ? gestorUsuarioService.obtenerAnfitrion(respuesta.getUsuarioID())
        : gestorUsuarioService.obtenerViajero(respuesta.getUsuarioID());

      if(usuario == null){
        respuesta.setUsuario_nombre("Usuario eliminado");
        respuesta.setUsuario_private_id("undefined");
      }

      else {
        respuesta.setUsuario_nombre(usuario.getNombre() + " " + usuario.getApellido().charAt(0));
        respuesta.setUsuario_profile_img(usuario.getProfileImage());
        respuesta.setUsuario_private_id(usuario.getPrivateID());
      }
    }

    return ResponseEntity.ok(respuestas);
  }

  /**
   * Elimina un foro dado su ID.
   *
   * @param id identificador del foro a eliminar
   * @return true si se eliminó correctamente, false si no se encontró
   */
  public boolean eliminarForo(Long id) {
    Optional<Foros> foro = forosRepository.findById(id);
    if (foro.isPresent()) {
      forosRepository.deleteById(id);
      return true;
    }
    return false;
  }
}
