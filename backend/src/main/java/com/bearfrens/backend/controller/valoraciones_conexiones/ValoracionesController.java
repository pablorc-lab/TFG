package com.bearfrens.backend.controller.valoraciones_conexiones;

import com.bearfrens.backend.entity.valoracione_conexiones.Valoraciones;
import com.bearfrens.backend.service.valoraciones_conexiones.ValoracionesService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api")
@AllArgsConstructor
public class ValoracionesController {
  private final ValoracionesService valoracionesService;

  /**
   * Obtener todas las valoraciones de un usuario RECEPTOR
   * @param tipo_usuario Tipo de usuario emisor
   * @param usuarioID ID del usuario emisor
   * @return Listado con las valoraciones
   */
  @GetMapping("/{tipo_usuario}/{usuarioID}/valoraciones/enviadas")
  public List<?> obtenerValoracionesEnviadas(@PathVariable String tipo_usuario, @PathVariable Long usuarioID) {
    return valoracionesService.obtenerListaValoracionesConexionesEnviadas(usuarioID, tipo_usuario);
  }

  /**
   * Obtener todas las valoraciones de un usuario RECEPTOR
   * @param tipo_usuario Tipo de usuario emisor
   * @param usuarioID ID del usuario emisor
   * @return Listado con las valoraciones
   */
  @GetMapping("/{tipo_usuario}/{usuarioID}/valoraciones/recibidas")
  public List<?> obtenerValoraciones(@PathVariable String tipo_usuario, @PathVariable Long usuarioID) {
    return valoracionesService.obtenerListaValoracionesConexionesRecibidas(usuarioID, tipo_usuario);
  }

  /**
   * Crear una valoracion de un usuario dado su "emisorID", "tipo" y "receptorID"
   * @param tipo_usuario Tipo usuario del emisor
   * @param emisorID ID del emisor
   * @param receptorID ID del receptor
   * @param valoracion Contenido de la valoración
   * @return Contenido de la valoración si se ha creado correctamente
   */
  @PostMapping("/{tipo_usuario}/{emisorID}/valoraciones/{receptorID}")
  public ResponseEntity<?> crearValoracion(@PathVariable String tipo_usuario, @PathVariable Long emisorID, @PathVariable Long receptorID, @RequestBody Valoraciones valoracion) {
    return valoracionesService.crearValoracionesConexiones(tipo_usuario, emisorID, receptorID, valoracion);
  }

  /**
   * Eliminar todas las valoraciones de un usuario RECEPTOR
   * @param tipo_usuario Tipo usuario emisor
   * @param usuarioID ID del usuario emisor
   * @return Booleano indicando si se ha eliminado o no
   */
  @DeleteMapping("/{tipo_usuario}/{usuarioID}/valoraciones")
  public ResponseEntity<Map<String, Boolean>> eliminarValoraciones(@PathVariable String tipo_usuario, @PathVariable Long usuarioID) {
    return valoracionesService.eliminarValoracionesConexiones(usuarioID, tipo_usuario);
  }
}
