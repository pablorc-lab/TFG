package com.bearfrens.backend.controller.user;

import com.bearfrens.backend.entity.experiencias.Experiencias;
import com.bearfrens.backend.entity.user.Anfitrion;
import com.bearfrens.backend.entity.user.Viajero;
import com.bearfrens.backend.exception.ResourceNotFoundException;
import com.bearfrens.backend.repository.experiencias.ExperienciasRepository;
import com.bearfrens.backend.repository.user.ViajeroRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.Map;


// Permitir que nuestra aplicación deje que react desde es enlace acceda a los datos
@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/viajeros")
public class ViajeroController extends BaseUserController<Viajero, ViajeroRepository> {

  private final ExperienciasRepository experienciasRepository;
  
  public ViajeroController(ViajeroRepository repository, ExperienciasRepository experienciasRepository) {
    super(repository,"viajero");
    this.experienciasRepository = experienciasRepository;
  }

  // ==============================
  // MANEJO DE LAS EXPERIENCIAS
  // ============================
  // Obtener recomendaciones
  @GetMapping("/{viajeroID}/experiencias")
  public List<Experiencias> obtenerExperiencias(@PathVariable Long viajeroID){
    Viajero viajero = repository.findById(viajeroID)
      .orElseThrow(() -> new ResourceNotFoundException("El viajero con ese ID no existe : " + viajeroID));

    return viajero.getExperiencias();
  }

  // Obtener una recomendacion en específico
  @GetMapping("/{viajeroID}/experiencias/{titulo}")
  public ResponseEntity<?> obtenerRecomendacion(@PathVariable Long viajeroID, @PathVariable String titulo){
    Viajero viajero = repository.findById(viajeroID)
      .orElseThrow(() -> new ResourceNotFoundException("El viajero con ese ID no existe : " + viajeroID));

    for(Experiencias experiencia : viajero.getExperiencias()) {
      if(experiencia.getTitulo().equalsIgnoreCase(titulo))
        return ResponseEntity.ok(experiencia);
    }
    return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No se encontró la experiencia con ese titulo");
  }

  // Crear recomendaciones
  @PostMapping("/{viajeroID}/experiencias/")
  public ResponseEntity<?> crearRecomendacion(@PathVariable Long viajeroID, @RequestBody Experiencias experiencia) {
    Viajero viajero = repository.findById(viajeroID)
      .orElseThrow(() -> new ResourceNotFoundException("El viajero con ese ID no existe : " + viajeroID));

    for(Experiencias experienciaUser : viajero.getExperiencias()) {
      if(experienciaUser.getTitulo().equalsIgnoreCase(experiencia.getTitulo()))
        return ResponseEntity.status(HttpStatus.CONFLICT).body("Ya existe una experiencia con ese titulo.");
    }

    experiencia.setViajero(viajero); // Asignar el viajero a la experiencia
    Experiencias nuevaExperiencia = experienciasRepository.save(experiencia);
    return ResponseEntity.status(HttpStatus.CREATED).body(nuevaExperiencia);
  }

  // Editar recomendacion
  @PutMapping("/{viajeroID}/experiencias/{titulo}")
  public ResponseEntity<?> editarRecomendacion(@PathVariable Long viajeroID, @PathVariable String titulo, @RequestBody Experiencias InfoExperiencia) {
    Viajero viajero = repository.findById(viajeroID)
      .orElseThrow(() -> new ResourceNotFoundException("El viajero con ese ID no existe : " + viajeroID));

    Experiencias experiencia = null;

    // Buscar esa recomendacion
    for(Experiencias experienciaUser : viajero.getExperiencias()) {
      if(experienciaUser.getTitulo().equalsIgnoreCase(titulo)){
        experiencia = experienciaUser;
        break;
      }
    }

    // Si la experiencia no existe
    if(experiencia == null){
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No existe una experiencia con ese titulo");
    }

    // El titulo es inmutable
    experiencia.setDescripcion(InfoExperiencia.getDescripcion());
    experiencia.setRecomendacion(InfoExperiencia.getRecomendacion());

    Experiencias experienciaActualizada = experienciasRepository.save(experiencia);
    return ResponseEntity.ok(experienciaActualizada);
  }

  // Eliminar una recomendacion
  @DeleteMapping("/{viajeroID}/experiencias/{titulo}")
  public ResponseEntity<Map<String, Boolean>> eliminarRecomendacion(@PathVariable Long viajeroID, @PathVariable String titulo) {
    Viajero viajero = repository.findById(viajeroID)
      .orElseThrow(() -> new ResourceNotFoundException("El viajero con ese ID no existe : " + viajeroID));

    Experiencias experiencia = null;

    // Buscar esa experiencia
    for(Experiencias experienciaUser : viajero.getExperiencias()) {
      if(experienciaUser.getTitulo().equalsIgnoreCase(titulo)){
        experiencia = experienciaUser;
        break;
      }
    }

    // Si la experiencia no existe
    if(experiencia == null){
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Collections.singletonMap("error", false));
    }

    experienciasRepository.delete(experiencia);
    return ResponseEntity.ok(Collections.singletonMap("delete", true));
  }
}
