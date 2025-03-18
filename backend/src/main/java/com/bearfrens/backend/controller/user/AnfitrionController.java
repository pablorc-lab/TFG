package com.bearfrens.backend.controller.user;

import com.bearfrens.backend.entity.contenido.Recomendaciones;
import com.bearfrens.backend.entity.user.Anfitrion;
import com.bearfrens.backend.entity.viviendas.Viviendas;
import com.bearfrens.backend.exception.ResourceNotFoundException;
import com.bearfrens.backend.repository.contenido.RecomendacionesRepository;
import com.bearfrens.backend.repository.user.AnfitrionRepository;
import com.bearfrens.backend.repository.viviendas.ViviendasRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.Map;

// Permitir que nuestra aplicación deje que react desde es enlace acceda a los datos
@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/anfitriones")
public class AnfitrionController extends BaseUserController<Anfitrion, AnfitrionRepository, RecomendacionesRepository, Recomendaciones> {

  private final ViviendasRepository viviendasRepository;

  public AnfitrionController(AnfitrionRepository repository, ViviendasRepository viviendasRepository, RecomendacionesRepository recomendacionesRepository) {
    super(repository, "anfitrion", recomendacionesRepository, "recomendaciones");
    this.viviendasRepository = viviendasRepository;
  }

  // ========================
  // MANEJO DE LAS VIVIENDAS
  // ========================
  // Obtener vivienda
  @GetMapping("/{anfitrionID}/vivienda")
  public ResponseEntity<?> obtenerVivienda(@PathVariable Long anfitrionID){
    Anfitrion anfitrion = repository.findById(anfitrionID)
      .orElseThrow(() -> new ResourceNotFoundException("El anfitrion con ese ID no existe : " + anfitrionID));

    Viviendas vivienda = anfitrion.getVivienda();

    return (vivienda == null)
      ? ResponseEntity.status(HttpStatus.NOT_FOUND).body("La vivienda asociada al anfitrión no existe")
      : ResponseEntity.ok(vivienda);
  }

  // Crear vivienda
  @PostMapping("/{anfitrionID}/vivienda")
  public ResponseEntity<?> crearVivienda(@PathVariable Long anfitrionID, @RequestBody Viviendas vivienda) {
    Anfitrion anfitrion = repository.findById(anfitrionID)
      .orElseThrow(() -> new ResourceNotFoundException("El anfitrion con ese ID no existe : " + anfitrionID));

    if(anfitrion.getVivienda() != null){
      ResponseEntity.status(HttpStatus.CONFLICT).body("Ya existe una vivienda asociada al anfitrión, solo puede modificarla");
    }

    vivienda.setAnfitrion(anfitrion); // Asignar el anfitrion a la vivienda
    Viviendas nuevaVivienda = viviendasRepository.save(vivienda);
    return ResponseEntity.status(HttpStatus.CREATED).body(nuevaVivienda);
  }

  // Editar vivienda
  @PutMapping("/{anfitrionID}/vivienda")
  public ResponseEntity<?> editarVivienda(@PathVariable Long anfitrionID, @RequestBody Viviendas InfoVivienda) {
    Anfitrion anfitrion = repository.findById(anfitrionID)
      .orElseThrow(() -> new ResourceNotFoundException("El anfitrion con ese ID no existe : " + anfitrionID));

    Viviendas vivienda = anfitrion.getVivienda();

    // Si la vivienda no está creada, guardar
    if(vivienda == null){
      return ResponseEntity.status(HttpStatus.CONFLICT).body("El anfitrión no tiene una vivienda asociada, creala primero.");
    }

    vivienda.setImagen1(InfoVivienda.getImagen1());
    vivienda.setImagen2(InfoVivienda.getImagen2());
    vivienda.setImagen3(InfoVivienda.getImagen3());
    vivienda.setImagen4(InfoVivienda.getImagen4());
    vivienda.setViajeros(InfoVivienda.getViajeros());
    vivienda.setHabitaciones(InfoVivienda.getHabitaciones());
    vivienda.setCamas(InfoVivienda.getCamas());
    vivienda.setBanios(InfoVivienda.getBanios());
    vivienda.setProvincia(InfoVivienda.getProvincia());
    vivienda.setCiudad(InfoVivienda.getCiudad());
    vivienda.setPrecio_noche(InfoVivienda.getPrecio_noche());

    Viviendas viviendaActualizada = viviendasRepository.save(vivienda);
    return ResponseEntity.ok(viviendaActualizada);
  }

  // Eliminar una vivienda
  @DeleteMapping("/{anfitrionID}/vivienda")
  public ResponseEntity<Map<String, Boolean>> eliminarVivienda(@PathVariable Long anfitrionID) {
    Anfitrion anfitrion = repository.findById(anfitrionID)
      .orElseThrow(() -> new ResourceNotFoundException("El anfitrion con ese ID no existe : " + anfitrionID));

    Viviendas vivienda = anfitrion.getVivienda();

    if (vivienda == null) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Collections.singletonMap("error", false));
    }

    // Desvincular simplemente la vivienda del anfitrión antes de eliminarla
    anfitrion.setVivienda(null);
    repository.save(anfitrion);
    return ResponseEntity.ok(Collections.singletonMap("delete", true));
  }

  // ==============================
  // MANEJO DE LAS RECOMENDACIONES
  // ==============================
  @GetMapping("/{userID}/recomendaciones")
  public List<Recomendaciones> obtenerRecomendaciones(@PathVariable Long userID){
   return obtenerContenidos(userID);
  }

  @GetMapping("/{userID}/recomendaciones/{titulo}")
  public ResponseEntity<?> obtenerRecomendacion(@PathVariable Long userID, @PathVariable String titulo) {
    return obtenerContenido(userID, titulo);
  }

  @PostMapping("/{userID}/recomendaciones")
  public ResponseEntity<?> crearRecomendacion(@PathVariable Long userID, @RequestBody Recomendaciones recomendacion) {
    return crearContenido(userID, recomendacion);
  }

  @PutMapping("/{userID}/recomendaciones/{titulo}")
  public ResponseEntity<?> editarRecomendacion(@PathVariable Long userID, @PathVariable String titulo, @RequestBody Recomendaciones infoRecomendacion) {
    return editarContenido(userID, titulo, infoRecomendacion);
  }

  @DeleteMapping("/{userID}/recomendaciones/{titulo}")
  public ResponseEntity<Map<String, Boolean>> eliminarRecomendacion(@PathVariable Long userID, @PathVariable String titulo) {
    return eliminarContenido(userID, titulo);
  }
}
