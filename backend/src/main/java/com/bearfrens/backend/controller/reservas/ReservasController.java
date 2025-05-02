package com.bearfrens.backend.controller.reservas;


import com.bearfrens.backend.entity.reservas.Reservas;
import com.bearfrens.backend.service.reservas.ReservasService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/reservas")
public class ReservasController {

  @Autowired
  private ReservasService reservasService;

  @GetMapping("/anfitrion/{id}/ingreso")
  public int obtenerIngresosTotalesAnfitrion(@PathVariable Long id) {
    return reservasService.obtenerIngresosTotalesAnfitrion(id);
  }

  @GetMapping("/viajero/{id}/gasto")
  public int obtenerGastosTotalesViajero(@PathVariable Long id) {
    return reservasService.obtenerGastosTotalesViajero(id);
  }

  @GetMapping("/anfitrion/{id}/{fecha}")
  public List<Reservas> obtenerReservasPorAnfitrion(@PathVariable Long id, @PathVariable String fecha) {
    return reservasService.obtenerReservasPorAnfitrion(id, fecha);
  }

  @GetMapping("/viajero/{id}/{fecha}")
  public List<Reservas> obtenerReservasPorViajero(@PathVariable Long id, @PathVariable String fecha) {
    return reservasService.obtenerReservasPorViajero(id, fecha);
  }

  @PostMapping("/crear/{anfitrionID}/{viajeroID}/{fechaInicio}/{fechaFin}")
  public ResponseEntity<Reservas> crearReserva(@PathVariable Long anfitrionID, @PathVariable Long viajeroID, @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaInicio, @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaFin){
    return ResponseEntity.ok(reservasService.crearReserva(anfitrionID, viajeroID, fechaInicio, fechaFin));
  }

  @PostMapping("/cancelar/{anfitrionID}/{viajeroID}/{fechaInicio}/{fechaFin}")
  public ResponseEntity<Reservas> cancelarReserva(@PathVariable Long anfitrionID, @PathVariable Long viajeroID, @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaInicio, @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaFin){
    return reservasService.cancelarReserva(anfitrionID, viajeroID, fechaInicio, fechaFin);
  }

  @DeleteMapping("/eliminar/{reservaID}") // SOLO ADMIN PANEL
  public ResponseEntity<Boolean> eliminarVivienda(@PathVariable Long reservaID){
    return reservasService.eliminarReserva(reservaID);
  }

  @GetMapping("/list")
  public List<Reservas> obtenerTodas() {
    return reservasService.obtenerTodasLasReservas();
  }
}

