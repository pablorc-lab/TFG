package com.bearfrens.backend.controller.biografias;

import com.bearfrens.backend.entity.biografias.Biografias;
import com.bearfrens.backend.exception.ResourceNotFoundException;
import com.bearfrens.backend.service.biografias.BiografiasService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.Map;
@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api")
@AllArgsConstructor
public class BiografiasController {

  @Autowired
  private final BiografiasService biografiasService;

  @GetMapping("/{tipo_usuario}/biografias/list")
  public List<Biografias> obtenerTodasBiografia(@PathVariable String tipo_usuario) {
    return biografiasService.obtenerTodasBiografia(tipo_usuario);
  }

  @GetMapping("/{tipo_usuario}/{usuarioID}/biografia")
  public ResponseEntity<?> obtenerBiografia(@PathVariable String tipo_usuario, @PathVariable Long usuarioID) {
    return ResponseEntity.ok(biografiasService.obtenerBiografia(tipo_usuario, usuarioID)
      .orElseThrow(() -> new ResourceNotFoundException("No se encontró la biografía del usuario " + tipo_usuario + " con ID: " + usuarioID)));
  }

  @PostMapping("/{tipo_usuario}/{usuarioID}/biografia")
  public ResponseEntity<?> crearBiografia(@RequestBody Biografias biografia, @PathVariable String tipo_usuario, @PathVariable Long usuarioID) {
    return ResponseEntity.status(HttpStatus.CREATED).body(biografiasService.crearBiografia(tipo_usuario, usuarioID, biografia));
  }

  @PutMapping("/{tipo_usuario}/{usuarioID}/biografia")
  public ResponseEntity<?> actualizarBiografia(@PathVariable String tipo_usuario, @PathVariable Long usuarioID, @RequestBody Biografias detallesBiografia) {
    return ResponseEntity.ok(biografiasService.actualizarBiografia(tipo_usuario, usuarioID, detallesBiografia));
  }

  @DeleteMapping("/{tipo_usuario}/{usuarioID}/biografia")
  public ResponseEntity<Map<String, Boolean>> eliminarBiografia(@PathVariable String tipo_usuario, @PathVariable Long usuarioID) {
    boolean eliminado = biografiasService.eliminarBiografia(tipo_usuario, usuarioID);
    return ResponseEntity.ok(Collections.singletonMap("deleted", eliminado));
  }
}

