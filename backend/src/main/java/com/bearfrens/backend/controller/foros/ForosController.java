package com.bearfrens.backend.controller.foros;

import com.bearfrens.backend.entity.foros.Foros;
import com.bearfrens.backend.service.foros.ForosService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/foros")
public class ForosController {

  @Autowired
  private ForosService forosService;

  @PostMapping("/crear/tipo/{tipoUsuario}/id/{usuarioID}")
  public ResponseEntity<Foros> crearForo(@PathVariable int tipoUsuario, @PathVariable Long usuarioID, @RequestBody String descripcion) {
    return forosService.crearForo(tipoUsuario, usuarioID, descripcion);
  }

  @GetMapping("/paginacion/{tamanio}")
  public Map<String, Object> obtenerForosPorCursor(@PathVariable int tamanio, @RequestParam(required = false) String ultimaFecha) {
    LocalDate fecha = ultimaFecha == null ? null : LocalDate.parse(ultimaFecha);
    return forosService.obtenerForosPorCursor(tamanio, fecha);
  }

  @DeleteMapping("/{id}")
  public boolean eliminarForo(@PathVariable Long id) {
    return forosService.eliminarForo(id);
  }
}