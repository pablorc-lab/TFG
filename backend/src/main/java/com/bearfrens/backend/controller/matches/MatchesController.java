package com.bearfrens.backend.controller.matches;

import com.bearfrens.backend.entity.matches.Matches;
import com.bearfrens.backend.repository.matches.MatchesRepository;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/matches")
@AllArgsConstructor
public class MatchesController {

  private final MatchesRepository matchesRepository;

  /**
   * Obtener todos los matches
   * @return Lista de matches
   */
  @GetMapping
  public ResponseEntity<List<Matches>> obtenerTodos() {
    return ResponseEntity.ok(matchesRepository.findAll());
  }

  /**
   * Obtener un match por ID
   * @param id ID del match
   * @return Match encontrado o error 404 si no existe
   */
  @GetMapping("/{id}")
  public ResponseEntity<Matches> obtenerPorId(@PathVariable Long id) {
    return ResponseEntity.ok(matchesRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("No existe un match con el ID : " + id)));
  }

  /**
   * Obtener matches por ID de viajero
   * @param viajeroId ID del viajero
   * @return Lista de matches del viajero
   */
  @GetMapping("/viajero/{viajeroId}")
  public ResponseEntity<List<Matches>> obtenerPorViajero(@PathVariable Long viajeroId) {
    return ResponseEntity.ok(matchesRepository.findByViajeroID(viajeroId));
  }

  /**
   * Obtener matches por ID de anfitrión
   * @param anfitrionId ID del anfitrión
   * @return Lista de matches del anfitrión
   */
  @GetMapping("/anfitrion/{anfitrionId}")
  public ResponseEntity<List<Matches>> obtenerPorAnfitrion(@PathVariable Long anfitrionId) {
    return ResponseEntity.ok(matchesRepository.findByAnfitrionID(anfitrionId));
  }
}
