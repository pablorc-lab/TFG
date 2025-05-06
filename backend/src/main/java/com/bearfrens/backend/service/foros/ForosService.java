package com.bearfrens.backend.service.foros;

import com.bearfrens.backend.entity.foros.Foros;
import com.bearfrens.backend.entity.user.Usuario;
import com.bearfrens.backend.repository.foros.ForosRepository;
import com.bearfrens.backend.service.GestorUsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;

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
   * @param tipoUsuario el tipo de usuario que crea el foro (1 para anfitrión, 2 para viajero)
   * @param usuarioID el ID del usuario que crea el foro
   * @param descripcion el contenido del foro
   * @return una respuesta con el foro creado
   */
  public ResponseEntity<Foros> crearForo(int tipoUsuario, Long usuarioID, String descripcion) {
    Foros foro = new Foros();
    foro.setTipoUsuario(tipoUsuario);
    foro.setUsuarioID(usuarioID);
    foro.setDescripcion(descripcion);
    foro.setFecha(LocalDate.now()); // La fecha se estab

    return ResponseEntity.ok(forosRepository.save(foro));
  }

  /**
   * Obtiene una lista de foros anteriores a una fecha dada, ordenados de más reciente a más antiguo.
   *
   * @param tamanio    cantidad de elementos a devolver
   * @param ultimaFecha fecha del último foro cargado (puede ser null para la primera carga)
   * @return un mapa con la lista de foros y un booleano indicando si hay más
   */
  public Map<String, Object> obtenerForosPorCursor(int tamanio, LocalDate ultimaFecha) {
    PageRequest page = PageRequest.of(0, tamanio);
    List<Foros> foros;

    if (ultimaFecha != null) {
      foros = forosRepository.findByFechaLessThanEqualOrderByFechaDesc(ultimaFecha, page);
    }
    else {
      foros = forosRepository.findAllByOrderByFechaDesc(page);
    }

    // Obtener información de cada usuario
    for(Foros foro : foros){
      Usuario usuario = foro.getTipoUsuario() == 1
        ? gestorUsuarioService.obtenerAnfitrion(foro.getUsuarioID())
        : gestorUsuarioService.obtenerViajero(foro.getUsuarioID());

      if(usuario != null){
        foro.setUsuario_nombre(usuario.getNombre() + " " + usuario.getApellido().charAt(0));
        foro.setUsuario_profile_img(usuario.getProfileImage());
        foro.setUsuario_private_id(usuario.getPrivateID());
      }
    }

    boolean hasMore = false;
    LocalDate lastFecha = foros.getLast().getFecha();

    if (foros.size() == tamanio) {
      hasMore = forosRepository.existsByFechaLessThanEqual(lastFecha); // Verifica si hay más foros con fecha igual o anterior
    }

    Map<String, Object> response = new HashMap<>();
    response.put("data", foros);
    response.put("hasMore", hasMore);
    response.put("lastFecha", lastFecha);

    return response;
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
