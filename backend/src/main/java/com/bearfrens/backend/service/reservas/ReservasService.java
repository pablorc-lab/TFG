package com.bearfrens.backend.service.reservas;

import com.bearfrens.backend.entity.reservas.Reservas;
import com.bearfrens.backend.repository.reservas.ReservasRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.*;

@Service
public class ReservasService {

  private ReservasRepository reservasRepository;

  /**
   * Crear una nueva reserva.
   *
   * @param reservaInfo Objeto que contiene la información de la reserva.
   * @return La reserva creada.
   */
  public Reservas crearReserva(@RequestBody Reservas reservaInfo) {
    // Crear una nueva reserva utilizando los datos del request
    Reservas reserva = new Reservas();
    reserva.setViajeroID(reservaInfo.getViajeroID());
    reserva.setAnfitrionID(reservaInfo.getAnfitrionID());
    reserva.setFechaInicio(reservaInfo.getFechaInicio());
    reserva.setFechaFin(reservaInfo.getFechaFin());
    reserva.setEstado(Reservas.ReservaType.PENDIENTE);

    // Guardar la reserva
    return reservasRepository.save(reserva);
  }

  /**
   * Obtener una reserva por su ID.
   *
   * @param id ID de la reserva a obtener.
   * @return La reserva correspondiente, o null si no se encuentra.
   */
  public Reservas obtenerReserva(Long id) {
    return reservasRepository.findById(id).orElse(null);
  }

  /**
   * Cancelar una reserva. Solo se puede cancelar una reserva que esté pendiente o activa. Y no se eliminan
   *
   * @param id ID de la reserva que se desea cancelar.
   * @return La reserva cancelada o null si no se encuentra o no es cancelable.
   */
  public Reservas cancelarReserva(Long id) {
    Reservas reserva = obtenerReserva(id);
    if (reserva != null && (reserva.getEstado() == Reservas.ReservaType.PENDIENTE || reserva.getEstado() == Reservas.ReservaType.ACTIVA)) {
      reserva.setEstado(Reservas.ReservaType.CANCELADA);
      return reservasRepository.save(reserva);
    }
    return null;  // No se puede cancelar si no es de tipo PENDIENTE o ACTIVA.
  }

  /**
   * Eliminar todas las reservas asociadas a un anfitrión dado su ID.
   *
   * @param anfitrionId ID del anfitrión cuyas reservas deben ser eliminadas.
   */
  public ResponseEntity<Map<String, Boolean>> eliminarReservasPorAnfitrion(Long anfitrionId) {
    // Verificamos si existen reservas asociadas al anfitrión
    List<Reservas> reservas = reservasRepository.findAllByAnfitrionID(anfitrionId);

    if (!reservas.isEmpty()) {
      reservasRepository.deleteAll(reservas);
      return ResponseEntity.ok(Collections.singletonMap("delete", true));
    }

    // Si no se encontraron reservas para eliminar
    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Collections.singletonMap("delete", false));  // Respondemos con 404 Not Found si no se encuentran reservas
  }


  /**
   * Obtener todas las reservas.
   *
   * @return Lista de todas las reservas.
   */
  public List<Reservas> obtenerTodasLasReservas() {
    return reservasRepository.findAll();
  }


}
