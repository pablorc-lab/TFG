package com.bearfrens.backend.controller.user;

import com.bearfrens.backend.entity.contenido.Recomendaciones;
import com.bearfrens.backend.entity.user.Anfitrion;
import com.bearfrens.backend.entity.viviendas.Viviendas;
import com.bearfrens.backend.exception.ResourceNotFoundException;
import com.bearfrens.backend.repository.contenido.RecomendacionesRepository;
import com.bearfrens.backend.repository.user.AnfitrionRepository;
import com.bearfrens.backend.service.viviendas.ViviendasService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;


// Permitir que nuestra aplicación deje que react desde es enlace acceda a los datos
@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/anfitriones")
public class AnfitrionController extends BaseUserController<Anfitrion, AnfitrionRepository, RecomendacionesRepository, Recomendaciones> {

  @Autowired
  private ViviendasService viviendasService;

  public AnfitrionController(AnfitrionRepository repository, RecomendacionesRepository recomendacionesRepository) {
    super(repository, "anfitrion", recomendacionesRepository, "recomendaciones");
  }

  // Obtener anfitriones por la ubicación de su vivienda
  @GetMapping("/viviendas/{ciudad}-{provincia}")
  public ResponseEntity<?> listarViviendasPorDatos(@PathVariable String ciudad, @PathVariable String provincia) {
    return viviendasService.listarViviendasPorDatos(ciudad, provincia);
  }

  // Eliminar un anfitrion
  @DeleteMapping("/{userID}")
  public ResponseEntity<Map<String,Boolean>> eliminarAnfitrion(@PathVariable Long userID){
    return eliminarUsuario(userID, "anfitriones");
  }

  // ========================
  // MANEJO DE LAS VIVIENDAS
  // ========================
  // Obtener vivienda
  @GetMapping("/{anfitrionID}/vivienda")
  public ResponseEntity<?> obtenerVivienda(@PathVariable Long anfitrionID){
    return viviendasService.obtenerVivienda(anfitrionID);
  }

  // Crear vivienda
  @PostMapping("/{anfitrionID}/vivienda")
  public ResponseEntity<?> crearVivienda(@PathVariable Long anfitrionID, @RequestBody Viviendas vivienda) {
    return viviendasService.crearVivienda(anfitrionID, vivienda);
  }

  // Editar vivienda
  @PutMapping("/{anfitrionID}/vivienda")
  public ResponseEntity<?> editarVivienda(@PathVariable Long anfitrionID, @RequestBody Viviendas infoVivienda) {
    return viviendasService.editarVivienda(anfitrionID, infoVivienda);
  }

  // Eliminar una vivienda
  @DeleteMapping("/{anfitrionID}/vivienda")
  public ResponseEntity<Map<String, Boolean>> eliminarVivienda(@PathVariable Long anfitrionID) {
    return viviendasService.eliminarVivienda(anfitrionID);
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
