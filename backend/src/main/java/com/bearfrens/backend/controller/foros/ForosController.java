package com.bearfrens.backend.controller.foros;

import com.bearfrens.backend.entity.foros.Foros;
import com.bearfrens.backend.service.foros.ForosService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cglib.core.Local;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/foros")
public class ForosController {

  @Autowired
  private ForosService forosService;

  // Crear foro
  @PostMapping("/crear")
  public ResponseEntity<Foros> crearForo(@RequestBody Foros foroData) {
    return forosService.crearForo(foroData);
  }

  // Crear respuesta
  @PostMapping("/crear/respuesta/padre/{foroPadreID}")
  public ResponseEntity<Foros> crearRespuesta(@PathVariable Long foroPadreID, @RequestBody Foros foroData) {
    return forosService.crearRespuesta(foroPadreID, foroData);
  }


  // Obtener foros por paginación
  @GetMapping("/paginacion/{paginaInicial}/{tamanio}")
  public Map<String, Object> obtenerForosPorCursor(@PathVariable int paginaInicial, @PathVariable int tamanio, @RequestParam(required = false) String ultimaFecha) {
    LocalDate fecha = ultimaFecha == null ? null : LocalDate.parse(ultimaFecha);
    return forosService.obtenerForosPorCursor(tamanio, fecha, paginaInicial);
  }

  // Obtener respuestas
  @GetMapping("/respuestas/{foroPadreID}")
  public ResponseEntity<List<Foros>> obtenerRespuestas(@PathVariable Long foroPadreID) {
    return forosService.obtenerRespuestas(foroPadreID);
  }

  // Borrar un foro
  @DeleteMapping("/{id}")
  public boolean eliminarForo(@PathVariable Long id) {
    return forosService.eliminarForo(id);
  }
}