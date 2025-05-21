package com.bearfrens.backend.controller.valoraciones_conexiones;

import com.bearfrens.backend.entity.matches.Matches;
import com.bearfrens.backend.entity.user.Usuario;
import com.bearfrens.backend.entity.user.Viajero;
import com.bearfrens.backend.entity.valoracione_conexiones.Likes;
import com.bearfrens.backend.repository.matches.MatchesRepository;
import com.bearfrens.backend.repository.valoraciones_conexiones.LikesRepository;
import com.bearfrens.backend.service.GestorUsuarioService;
import com.bearfrens.backend.service.valoraciones_conexiones.LikesService;
import lombok.AllArgsConstructor;
import org.springframework.cglib.core.Local;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api")
@AllArgsConstructor
public class LikesController{

  private final MatchesRepository matchesRepository;
  private final GestorUsuarioService gestorUsuarioService;
  private final LikesService likesService;
  private final LikesRepository likesRepository;

  // Obtener todos los likes existentes
  @GetMapping("/likes")
  public List<Likes> obtenerListaLikesTodos(){
    return likesRepository.findAllByOrderByFechaDesc();
  }

  // Devuelve si se ha dado like a ese usuario
  @GetMapping("/{tipo_usuario}/{emisorID}/likes/{receptorID}/existe")
  public ResponseEntity<Boolean> haDadoLike(@PathVariable String tipo_usuario, @PathVariable Long emisorID, @PathVariable Long receptorID) {
    boolean existe = likesService.haDadoLike(tipo_usuario, emisorID, receptorID);
    return ResponseEntity.ok(existe);
  }


  // Obtener la LISTA de VIAJEROS que han dado like a un RECEPTOR ANFITRIÓN id
  @GetMapping("/anfitriones/{receptorID}/likes/recibidos")
  public List<Map<String, Object>> obtenerListaLikes(@PathVariable Long receptorID) {
    Map<Viajero, LocalDate> viajeros = likesService.obtenerLikesViajerosPerfiles(receptorID);

   List<Map<String, Object>> info_viajeros = new LinkedList<>();

    // Añadir cada anfitrión al map con la información necesaria
    viajeros.forEach((viajero, fecha) -> {
      Map<String, Object> resumen = new HashMap<>();
      resumen.put("id", viajero.getId());
      resumen.put("nombre", viajero.getNombre());
      resumen.put("profileImage", viajero.getProfileImage());
      resumen.put("gusto1", viajero.getGusto1());
      resumen.put("gusto2", viajero.getGusto2());
      resumen.put("gusto3", viajero.getGusto3());
      resumen.put("descripcion", viajero.getDescripcion());
      resumen.put("fecha", fecha);

      info_viajeros.add(resumen);
    });

    return info_viajeros;
  }

  // Obtener la lista de likes dados por un usuario
  @GetMapping("/{tipo_usuario}/{usuarioID}/likes/enviados")
  public List<Likes> obtenerListaLikes(@PathVariable String tipo_usuario, @PathVariable Long usuarioID){
    return likesService.obtenerListaValoracionesConexionesEnviadas(usuarioID, tipo_usuario);
  }

  // Crear un like de un usuario a otro
  @PostMapping("/{tipo_usuario}/{usuarioID}/likes/{receptorID}")
  public ResponseEntity<?> crearLike(@PathVariable String tipo_usuario, @PathVariable Long usuarioID, @PathVariable Long receptorID) {
    return likesService.crearValoracionesConexiones(tipo_usuario, usuarioID, receptorID, new Likes());
  }

  // Eliminar todos los likes recibidos por un usuario (por ejemplo, si ELIMINAR su cuenta)
  @DeleteMapping("/{tipo_usuario}/{usuarioID}/likes")
  public ResponseEntity<Map<String, Boolean>> eliminarLikesDeReceptor(@PathVariable String tipo_usuario, @PathVariable Long usuarioID) {
    return likesService.eliminarValoracionesConexiones(usuarioID, tipo_usuario);
  }

  /**
   * Eliminar un like específico dado por un usuario a un receptor
   * @param tipo_usuario Tipo de usuario emisor en String
   * @param usuarioID ID del usuario emisor
   * @param receptorID ID del usuario receptor
   * @return Respuesta con el resultado de la operación
   */
  @DeleteMapping("/{tipo_usuario}/{usuarioID}/likes/{receptorID}")
  public ResponseEntity<?> eliminarLikeEspecifico(@PathVariable String tipo_usuario, @PathVariable Long usuarioID, @PathVariable Long receptorID) {
    if (gestorUsuarioService.NoExisteAmbosUsuario(tipo_usuario, usuarioID, receptorID)) {
      return ResponseEntity.badRequest().body("Los usuarios asociados debe existir");
    }

    // Comprobar si ya existe un like dado por el usuario Emisor
    int tipo_receptor = gestorUsuarioService.intTipoUsuario(tipo_usuario) == 1 ? 2 : 1;// Almacenar el tipo del RECEPTOR no del emisor
    Optional<Likes> like = likesRepository.findByEmisorIDAndUsuarioIDAndTipoUsuario(usuarioID,receptorID, tipo_receptor);

    if (like.isEmpty()) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No se encontró el like.");
    }

    // Eliminar el like y su match asociado
    likesRepository.delete(like.get());

    Optional<Matches> match = matchesRepository.findByAnfitrionIDAndViajeroID(
      tipo_receptor == 2 ? receptorID : usuarioID,
      tipo_receptor == 2 ? usuarioID : receptorID
    );

    match.ifPresent(matchesRepository::delete);

    return ResponseEntity.ok(Collections.singletonMap("deleted", true));
  }
}
