package com.bearfrens.backend.controller.valoraciones_conexiones;

import com.bearfrens.backend.entity.valoracione_conexiones.Likes;
import com.bearfrens.backend.repository.valoraciones_conexiones.LikesRepository;
import com.bearfrens.backend.service.GestorUsuarioService;
import com.bearfrens.backend.service.valoraciones_conexiones.LikesService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api")
@AllArgsConstructor
public class LikesController{

  private final GestorUsuarioService gestorUsuarioService;
  private final LikesService likesService;
  private final LikesRepository likesRepository;

  // Obtener la lista de likes dados por un usuario
  @GetMapping("/{tipo_usuario}/{usuarioID}/likes")
  public ResponseEntity<?> obtenerListaLikes(@PathVariable String tipo_usuario, @PathVariable Long usuarioID){
    return likesService.obtenerListaValoracionesConexiones(usuarioID, tipo_usuario);
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
    if (!gestorUsuarioService.existeAmbosUsuario(tipo_usuario, usuarioID, receptorID)) {
      return ResponseEntity.badRequest().body("Los usuarios asociados debe existir");
    }

    // Comprobar si ya existe un like dado por el usuario Emisor
    int tipo_receptor = gestorUsuarioService.intTipoUsuario(tipo_usuario) == 1 ? 2 : 1;// Almacenar el tipo del RECEPTOR no del emisor
    Optional<Likes> like = likesRepository.findByEmisorIDAndUsuarioIDAndTipoUsuario(usuarioID,receptorID, tipo_receptor);

    if (like.isEmpty()) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No se encontró el like.");
    }

    // Eliminar el like
    likesRepository.delete(like.get());
    return ResponseEntity.ok(Collections.singletonMap("deleted", true));
  }
}
