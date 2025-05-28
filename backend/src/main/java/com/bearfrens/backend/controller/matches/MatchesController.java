package com.bearfrens.backend.controller.matches;

import com.bearfrens.backend.entity.matches.Matches;
import com.bearfrens.backend.entity.user.Anfitrion;
import com.bearfrens.backend.entity.user.Viajero;
import com.bearfrens.backend.service.matches.MatchesService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/matches")
@AllArgsConstructor
public class MatchesController {

  private final MatchesService matchesService;

  @GetMapping
  public List<Matches> obtenerTodos() {
    return matchesService.obtenerTodos();
  }


  @GetMapping("/{id}")
  public ResponseEntity<Matches> obtenerPorId(@PathVariable Long id) {
    return matchesService.obtenerPorId(id);
  }

  @GetMapping("/afinidad/{tipoUsuarioEmisor}/{emisorID}")
  public double porcentajeAfinidad(@PathVariable String tipoUsuarioEmisor, @PathVariable Long emisorID) {
    return matchesService.porcentajeAfinidad(tipoUsuarioEmisor, emisorID);
  }

  @GetMapping("/anfitrion/{anfitrionID}/viajero/{viajeroID}")
  public Boolean existeMatchEntreAmbos(@PathVariable Long anfitrionID, @PathVariable Long viajeroID) {
    return matchesService.existeMatchEntreAmbos(anfitrionID, viajeroID);
  }

  @GetMapping("/viajero/{viajeroId}")
  public Set<Anfitrion> obtenerPorViajero(@PathVariable Long viajeroId) {
    return matchesService.obtenerPorViajero(viajeroId);
  }

  @GetMapping("/viajero/size/{viajeroId}")
  public int obtenerCantidadPorViajero(@PathVariable Long viajeroId) {
    return matchesService.obtenerCantidadPorViajero(viajeroId);
  }

  @GetMapping("/anfitrion/{anfitrionId}")
  public Set<Viajero> obtenerPorAnfitrion(@PathVariable Long anfitrionId) {
    return matchesService.obtenerPorAnfitrion(anfitrionId);
  }

  @GetMapping("/anfitrion/size/{anfitrionId}")
  public int obtenerCantidadPorAnfitrion(@PathVariable Long anfitrionId) {
    return matchesService.obtenerCantidadPorAnfitrion(anfitrionId);
  }

  @PostMapping("/crear/{viajeroId}-{anfitrionId}")
  public ResponseEntity<?> crearMatch(@PathVariable Long viajeroId, @PathVariable Long anfitrionId) {
    return matchesService.crearMatch(viajeroId, anfitrionId);
  }

  @DeleteMapping("/eliminar/{viajeroId}-{anfitrionId}")
  public ResponseEntity<Map<String,Boolean>> eliminarMatch(@PathVariable Long anfitrionId, @PathVariable Long viajeroId) {
    return matchesService.eliminarMatch(anfitrionId, viajeroId);
  }

  @DeleteMapping("/eliminar/{matchId}")
  public ResponseEntity<Map<String, Boolean>> eliminarMatchID(@PathVariable Long matchId) {
    return matchesService.eliminarMatchID(matchId);
  }
}
