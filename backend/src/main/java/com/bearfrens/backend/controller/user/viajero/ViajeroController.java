package com.bearfrens.backend.controller.user.viajero;

import com.bearfrens.backend.controller.user.BaseUserController;
import com.bearfrens.backend.entity.biografias.Biografias;
import com.bearfrens.backend.entity.contenido.Experiencias;
import com.bearfrens.backend.entity.user.Anfitrion;
import com.bearfrens.backend.entity.user.Viajero;
import com.bearfrens.backend.repository.contenido.ExperienciasRepository;
import com.bearfrens.backend.repository.user.ViajeroRepository;
import com.bearfrens.backend.repository.user.ViajeroSpecificationRepository;
import com.bearfrens.backend.service.biografias.BiografiasService;
import com.bearfrens.backend.specification.ViajeroSpecification;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

// Permitir que nuestra aplicación deje que react desde es enlace acceda a los datos
@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/viajeros")
public class ViajeroController extends BaseUserController<Viajero, ViajeroRepository, ExperienciasRepository, Experiencias> {

  @Autowired
  private ViajeroSpecificationRepository viajeroSpecificationRepository;

  @Autowired
  private BiografiasService biografiasService;

  public ViajeroController(ViajeroRepository repository, ExperienciasRepository experienciasRepository) {
    super(repository,"viajero", experienciasRepository, "experiencias");
  }

  /**
   * Devuelve una lista de viajeros que cumplen con los filtros especificados.
   *
   * @param filtros Objeto con los criterios de filtrado
   * @param pagina Número de página solicitada para la paginación.
   * @param tamanio Cantidad de elementos por página.
   * @return Un mapa con la lista de viajeros filtrados y un indicador de si hay más resultados.
   */
  @PostMapping("/filtrar/{pagina}/{tamanio}")
  public Map<String, Object> obtenerAnfitrionesFiltrados(@RequestBody FiltroViajeroDTO filtros, @PathVariable int pagina, @PathVariable int tamanio){
    // Crear la especificación de búsqueda con los parámetros recibidos
    ViajeroSpecification spec = new ViajeroSpecification(filtros.getGustos(), filtros.getTiempo_estancia());

    // Una vez obtenidos todos los anfitriones, filtrar por sus idiomas que se encuentra en la biografia de cada uno
    List<Viajero> viajeros = viajeroSpecificationRepository.findAll(spec);

    int start = pagina * tamanio;
    int end = Math.min(start + tamanio, viajeros.size());
    boolean hasMore = end < viajeros.size();
    viajeros = viajeros.subList(start, end);

    if(filtros.getIdiomas() != null && !filtros.getIdiomas().isEmpty()){
      viajeros = viajeros.stream().filter(viajero -> {
        Optional<Biografias> biografia = biografiasService.obtenerBiografia("viajeros", viajero.getId());
        if(biografia.isPresent() && !biografia.get().getIdiomas().isEmpty()){
          List<String> idiomas = Arrays.stream(biografia.get().getIdiomas().split(",")).map(String::trim).toList();

          for(String idiomaFiltro : filtros.getIdiomas()){
            if(idiomas.contains(idiomaFiltro)) return true;
          }
        }
        return false;
      }).toList();
    }

    Map<String, Object> response = new HashMap<>();
    response.put("data", viajeros);
    response.put("hasMore", hasMore);

    return response;
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
