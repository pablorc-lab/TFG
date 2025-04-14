package com.bearfrens.backend.controller.reservas;


import com.bearfrens.backend.entity.reservas.Reservas;
import com.bearfrens.backend.service.reservas.ReservasService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/reservas")
public class ReservasController {

  @Autowired
  private ReservasService reservasService;

  @GetMapping("/crear/{anfitrionID}/{viajeroID}/{fechaInicio}/{fechaFin}")
  public ResponseEntity<Reservas> crearReserva(@PathVariable Long anfitrionID, @PathVariable Long viajeroID, @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date fechaInicio, @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date fechaFin){
    return ResponseEntity.ok(reservasService.crearReserva(anfitrionID, viajeroID, fechaInicio, fechaFin));
  }

  @GetMapping("/anfitrion/{id}")
  public List<Reservas> obtenerReservasPorAnfitrion(@PathVariable Long id) {
    return reservasService.obtenerReservasPorAnfitrion(id);
  }

  @GetMapping("/viajero/{id}")
  public List<Reservas> obtenerReservasPorViajero(@PathVariable Long id) {
    return reservasService.obtenerReservasPorViajero(id);
  }

  @PostMapping("/cancelar/{anfitrionID}/{viajeroID}/{fechaInicio}/{fechaFin}")
  public ResponseEntity<Reservas> cancelarReserva(@PathVariable Long anfitrionID, @PathVariable Long viajeroID, @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date fechaInicio, @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date fechaFin){
    return reservasService.cancelarReserva(anfitrionID, viajeroID, fechaInicio, fechaFin);
  }

  @GetMapping("/todas")
  public List<Reservas> obtenerTodas() {
    return reservasService.obtenerTodasLasReservas();
  }
}

