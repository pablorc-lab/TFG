package com.bearfrens.backend.controller.valoraciones_conexiones;

import com.bearfrens.backend.entity.valoracione_conexiones.Valoraciones;
import com.bearfrens.backend.service.ValoracionesConexionesService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api")
@AllArgsConstructor
public class ValoracionesController {
  private final ValoracionesConexionesService<Valoraciones> valoracionesConexionesService;

  // Obtener todas las valoraciones de un usuario RECEPTOR
  @GetMapping("/{tipo_usuario}/{usuarioID}/valoraciones")
  public ResponseEntity<?> obtenerValoraciones(@PathVariable String tipo_usuario, @PathVariable Long usuarioID) {
    return valoracionesConexionesService.obtenerListaValoracionesConexiones(usuarioID, tipo_usuario);
  }

  // Crear una valoracion de un usuario dado su "emisorID", "tipo" y "receptorID"
  @PostMapping("/{tipo_usuario}/{emisorID}/valoraciones/{receptorID}")
  public ResponseEntity<?> crearValoracion(@PathVariable String tipo_usuario, @PathVariable Long emisorID, @PathVariable Long receptorID, @RequestBody Valoraciones valoracion) {
    return valoracionesConexionesService.crearValoracionesConexiones(tipo_usuario, emisorID, receptorID, valoracion);
  }

  // Eliminar todas las valoraciones de un usuario RECEPTOR
  @DeleteMapping("/{tipo_usuario}/{usuarioID}/valoraciones")
  public ResponseEntity<Map<String, Boolean>> eliminarValoraciones(@PathVariable String tipo_usuario, @PathVariable Long usuarioID) {
    return valoracionesConexionesService.eliminarValoracionesConexiones(usuarioID, tipo_usuario);
  }
}
