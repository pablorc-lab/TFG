package com.bearfrens.backend.controller.user;

import com.bearfrens.backend.entity.biografias.Biografias;
import com.bearfrens.backend.entity.recomendaciones.Recomendaciones;
import com.bearfrens.backend.entity.user.Anfitrion;
import com.bearfrens.backend.entity.viviendas.Viviendas;
import com.bearfrens.backend.exception.ResourceNotFoundException;
import com.bearfrens.backend.repository.recomendaciones.RecomendacionesRepository;
import com.bearfrens.backend.repository.user.AnfitrionRepository;
import com.bearfrens.backend.repository.viviendas.ViviendasRepository;
import org.apache.coyote.Response;
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
public class AnfitrionController extends BaseUserController<Anfitrion, AnfitrionRepository> {

  private final ViviendasRepository viviendasRepository;
  private final RecomendacionesRepository recomendacionesRepository;

  public AnfitrionController(AnfitrionRepository repository, ViviendasRepository viviendasRepository, RecomendacionesRepository recomendacionesRepository) {
    super(repository, "anfitrion");
    this.viviendasRepository = viviendasRepository;
    this.recomendacionesRepository = recomendacionesRepository;
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

    viviendasRepository.delete(vivienda);
    return ResponseEntity.ok(Collections.singletonMap("delete", true));
  }

  // ==============================
  // MANEJO DE LAS RECOMENDACIONES
  // ============================
  // Obtener recomendaciones
  @GetMapping("/{anfitrionID}/recomendaciones")
  public List<Recomendaciones> obtenerRecomendaciones(@PathVariable Long anfitrionID){
    Anfitrion anfitrion = repository.findById(anfitrionID)
      .orElseThrow(() -> new ResourceNotFoundException("El anfitrion con ese ID no existe : " + anfitrionID));

    return anfitrion.getRecomendaciones();
  }

  // Obtener una recomendacion en específico
  @GetMapping("/{anfitrionID}/recomendaciones/{titulo}")
  public ResponseEntity<?> obtenerRecomendacion(@PathVariable Long anfitrionID, @PathVariable String titulo){
    Anfitrion anfitrion = repository.findById(anfitrionID)
      .orElseThrow(() -> new ResourceNotFoundException("El anfitrion con ese ID no existe : " + anfitrionID));

    for(Recomendaciones recomendacion : anfitrion.getRecomendaciones()) {
      if(recomendacion.getTitulo().equalsIgnoreCase(titulo))
        return ResponseEntity.ok(recomendacion);
    }
    return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No se encontró la recomendación con ese titulo");
  }

  // Crear recomendaciones
  @PostMapping("/{anfitrionID}/recomendaciones/")
  public ResponseEntity<?> crearRecomendacion(@PathVariable Long anfitrionID, @RequestBody Recomendaciones recomendacion) {
    Anfitrion anfitrion = repository.findById(anfitrionID)
      .orElseThrow(() -> new ResourceNotFoundException("El anfitrion con ese ID no existe : " + anfitrionID));

    for(Recomendaciones recomendacionUser : anfitrion.getRecomendaciones()) {
      if(recomendacionUser.getTitulo().equalsIgnoreCase(recomendacion.getTitulo()))
        return ResponseEntity.status(HttpStatus.CONFLICT).body("Ya existe una recomendación con ese titulo.");
    }

    recomendacion.setAnfitrion(anfitrion); // Asignar el anfitrion a la recomendación
    Recomendaciones nuevaRecomendacion = recomendacionesRepository.save(recomendacion);
    return ResponseEntity.status(HttpStatus.CREATED).body(nuevaRecomendacion);
  }

  // Editar recomendacion
  @PutMapping("/{anfitrionID}/recomendaciones/{titulo}")
  public ResponseEntity<?> editarRecomendacion(@PathVariable Long anfitrionID, @PathVariable String titulo, @RequestBody Recomendaciones InfoRecomendacion) {
    Anfitrion anfitrion = repository.findById(anfitrionID)
      .orElseThrow(() -> new ResourceNotFoundException("El anfitrion con ese ID no existe : " + anfitrionID));

    Recomendaciones recomendacion = null;

    // Buscar esa recomendacion
    for(Recomendaciones recomendacionUser : anfitrion.getRecomendaciones()) {
      if(recomendacionUser.getTitulo().equalsIgnoreCase(titulo)){
        recomendacion = recomendacionUser;
        break;
      }
    }

    // Si la recomendación no existe
    if(recomendacion == null){
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No existe una recomendación con ese titulo");
    }

    // El titulo es inmutable
    recomendacion.setDescripcion(InfoRecomendacion.getDescripcion());
    recomendacion.setUbicacion(InfoRecomendacion.getUbicacion());
    recomendacion.setRecomendacion(InfoRecomendacion.getRecomendacion());
    recomendacion.setTelefono(InfoRecomendacion.getTelefono());
    recomendacion.setHorarios(InfoRecomendacion.getHorarios());
    recomendacion.setAyuda(InfoRecomendacion.getAyuda());

    Recomendaciones recomendacionActualizada = recomendacionesRepository.save(recomendacion);
    return ResponseEntity.ok(recomendacionActualizada);
  }

  // Eliminar una recomendacion
  @DeleteMapping("/{anfitrionID}/recomendaciones/{titulo}")
  public ResponseEntity<Map<String, Boolean>> eliminarRecomendacion(@PathVariable Long anfitrionID, @PathVariable String titulo) {
    Anfitrion anfitrion = repository.findById(anfitrionID)
      .orElseThrow(() -> new ResourceNotFoundException("El anfitrion con ese ID no existe : " + anfitrionID));

    Recomendaciones recomendacion = null;

    // Buscar esa recomendacion
    for(Recomendaciones recomendacionUser : anfitrion.getRecomendaciones()) {
      if(recomendacionUser.getTitulo().equalsIgnoreCase(titulo)){
        recomendacion = recomendacionUser;
        break;
      }
    }

    // Si la recomendación no existe
    if(recomendacion == null){
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Collections.singletonMap("error", false));
    }

    recomendacionesRepository.delete(recomendacion);
    return ResponseEntity.ok(Collections.singletonMap("delete", true));
  }


//  @DeleteMapping("/{id}")
//  public ResponseEntity<Map<String,Boolean>> eliminarImagenDePerfil(@PathVariable Long id) {
//
//  }

}
