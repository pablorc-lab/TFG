package com.bearfrens.backend.service.matches;

import com.bearfrens.backend.entity.matches.Matches;
import com.bearfrens.backend.entity.user.Anfitrion;
import com.bearfrens.backend.entity.user.Viajero;
import com.bearfrens.backend.repository.matches.MatchesRepository;
import com.bearfrens.backend.service.GestorUsuarioService;
import com.bearfrens.backend.service.valoraciones_conexiones.LikesService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class MatchesService {

  private final MatchesRepository matchesRepository;
  private final GestorUsuarioService gestorUsuarioService;

  @Autowired
  private LikesService likesService;

  /**
   * Obtener todos los matches
   * @return Lista de matches
   */
  @GetMapping
  public List<Matches> obtenerTodos() {
    return matchesRepository.findAll();
  }

  /**
   * Devuelve el porcentaje de afinidad de un usuario con el resto de usuario segun los likes dados
   * @param tipoUsuarioEmisor Tipo usuario que busca
   * @param emisorID ID del usuario emisor
   * @return Porncetaje
   */
  public double porcentajeAfinidad(String tipoUsuarioEmisor, Long emisorID) {
    int likes =  likesService.contarLikes(tipoUsuarioEmisor, emisorID);

    int matches = tipoUsuarioEmisor.equals("anfitriones")
      ? matchesRepository.countByAnfitrionID(emisorID)
      : matchesRepository.countByViajeroID(emisorID);

    return (likes == 0) ? 0 : ((double) matches / likes) * 100;
  }

  /**
   * Obtener un match por ID
   * @param id ID del match
   * @return Match encontrado o error 404 si no existe
   */
  public ResponseEntity<Matches> obtenerPorId(Long id) {
    return ResponseEntity.ok(matchesRepository.findById(id)
      .orElseThrow(() -> new RuntimeException("No existe un match con el ID : " + id)));
  }

  /**
   * Busca si existe ese match entre dos usuario
   * @param anfitrionID ID del anfitrión
   * @param viajeroID ID del viajero
   * @return Match encontrado (true) o no hay match (false)
   */
  public Boolean existeMatchEntreAmbos(Long anfitrionID, Long viajeroID) {
    return matchesRepository.existsByAnfitrionIDAndViajeroID(anfitrionID, viajeroID);
  }

  /**
   * Obtener matches por ID de viajero
   * @param viajeroId ID del viajero
   * @return Lista de anfitriones del viajero
   */
  public Set<Anfitrion> obtenerPorViajero(Long viajeroId) {
    // Stream : Transformar elementos para realizar operaciones
    // Map : Funcion que se hace para cada match
    // Collect : Lo agrupa a modo de colección, lista concretamente
    return matchesRepository.findAllByViajeroID(viajeroId).stream()
      .map(match -> gestorUsuarioService.obtenerAnfitrion(match.getAnfitrionID()))
      .collect(Collectors.toSet());
  }

  /**
   * Obtener matches por ID de anfitrión
   * @param anfitrionId ID del anfitrión
   * @return Lista de viajeros del anfitrión con los que se ha hecho match
   */
  public Set<Viajero> obtenerPorAnfitrion(Long anfitrionId) {
    return matchesRepository.findAllByAnfitrionID(anfitrionId).stream()
      .map(match -> gestorUsuarioService.obtenerViajero(match.getViajeroID()))
      .collect(Collectors.toSet());
  }

  /**
   * Crea un match entre un anfitrion y viajero
   * @param viajeroId ID del viajero
   * @param anfitrionId ID del anfitrión
   * @return Respueta de la creación
   */
  @PostMapping("/crear/{viajeroId}-{anfitrionId}")
  public ResponseEntity<?> crearMatch(Long viajeroId, Long anfitrionId) {

    // Comprobar que ese match no exista
    if(matchesRepository.findByAnfitrionIDAndViajeroID(anfitrionId, viajeroId).isPresent()){
      return ResponseEntity.status(HttpStatus.CONFLICT).body(Collections.singletonMap("deleted", false));
    }

    // Crear el match
    Matches nuevo_match = new Matches();
    nuevo_match.setViajeroID(viajeroId);
    nuevo_match.setAnfitrionID(anfitrionId);
    nuevo_match.setFecha(LocalDate.now());

    matchesRepository.save(nuevo_match);

    return ResponseEntity.status(HttpStatus.CREATED).body(nuevo_match);
  }

  /**
   * Eliminar un match entre anfitrion y viajero
   * @param anfitrionId ID del anfitrión
   * @return Respueta de borrado
   */
  public ResponseEntity<Map<String,Boolean>> eliminarMatch(Long anfitrionId, Long viajeroId) {
    Optional<Matches> match = matchesRepository.findByAnfitrionIDAndViajeroID(anfitrionId, viajeroId);

    if(match.isPresent()){
      matchesRepository.delete(match.get());
      return ResponseEntity.ok(Collections.singletonMap("deleted", true));
    }

    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Collections.singletonMap("deleted", false));
  }

  /**
   * Eliminar un match entre anfitrión y viajero utilizando el ID del match
   * @param matchId ID del match
   * @return Respuesta de borrado
   */
  public ResponseEntity<Map<String, Boolean>> eliminarMatchID(Long matchId) {
    // Buscar el match por el ID
    Optional<Matches> match = matchesRepository.findById(matchId);

    // Verificar si el match existe
    if (match.isPresent()) {
      // Eliminar el match
      matchesRepository.delete(match.get());
      return ResponseEntity.ok(Collections.singletonMap("deleted", true));
    }

    // Si no se encuentra el match, devolver 404
    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Collections.singletonMap("deleted", false));
  }
}
