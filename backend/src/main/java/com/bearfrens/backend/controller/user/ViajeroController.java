package com.bearfrens.backend.controller.user;

import com.bearfrens.backend.entity.contenido.Experiencias;
import com.bearfrens.backend.entity.user.Viajero;
import com.bearfrens.backend.repository.contenido.ExperienciasRepository;
import com.bearfrens.backend.repository.user.ViajeroRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

// Permitir que nuestra aplicación deje que react desde es enlace acceda a los datos
@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/viajeros")
public class ViajeroController extends BaseUserController<Viajero, ViajeroRepository, ExperienciasRepository, Experiencias> {

  public ViajeroController(ViajeroRepository repository, ExperienciasRepository experienciasRepository) {
    super(repository,"viajero", experienciasRepository, "experiencias");
  }

  // Eliminar un viajero
  @DeleteMapping("/{userID}")
  public ResponseEntity<Map<String,Boolean>> eliminarViajero(@PathVariable Long userID){
    return eliminarUsuario(userID, "viajeros");
  }

  // ==============================
  // MANEJO DE LAS EXPERIENCIAS
  // ==============================
  @GetMapping("/{userID}/experiencias")
  public List<Experiencias> obtenerExperiencias(@PathVariable Long userID){
    return obtenerContenidos(userID);
  }

  @GetMapping("/{userID}/experiencias/{titulo}")
  public ResponseEntity<?> obtenerExperiencia(@PathVariable Long userID, @PathVariable String titulo) {
    return obtenerContenido(userID, titulo);
  }

  @PostMapping("/{userID}/experiencias")
  public ResponseEntity<?> crearExperiencia(@PathVariable Long userID, @RequestBody Experiencias experiencia) {
    return crearContenido(userID, experiencia);
  }

  @PutMapping("/{userID}/experiencias/{titulo}")
  public ResponseEntity<?> editarExperiencia(@PathVariable Long userID, @PathVariable String titulo, @RequestBody Experiencias infoExperiencia) {
    return editarContenido(userID, titulo, infoExperiencia);
  }

  @DeleteMapping("/{userID}/experiencias/{titulo}")
  public ResponseEntity<Map<String, Boolean>> eliminarExperiencia(@PathVariable Long userID, @PathVariable String titulo) {
    return eliminarContenido(userID, titulo);
  }
 }
