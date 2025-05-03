package com.bearfrens.backend.service.reservas;

import com.bearfrens.backend.entity.reservas.Reservas;
import com.bearfrens.backend.entity.user.Anfitrion;
import com.bearfrens.backend.entity.user.Viajero;
import com.bearfrens.backend.repository.reservas.ReservasRepository;
import com.bearfrens.backend.service.GestorUsuarioService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.*;

@Service
public class ReservasService {

  @Autowired
  private GestorUsuarioService gestorUsuarioService;

  @Autowired
  private ReservasRepository reservasRepository;

  /**
   * Devuelve los ingresos totales de un anfitrión
   * @param id ID del anfitrión
   * @return Sumatoria de los ingresos
   */
  public int obtenerIngresosTotalesAnfitrion(Long id){
    Anfitrion anfitrion = gestorUsuarioService.obtenerAnfitrion(id);
    return anfitrion.getReservas().stream().mapToInt(Reservas::getPrecio_total).sum();
  }

  /**
   * Devuelve los gastos totales de un viajero
   * @param id ID del viajero
   * @return Sumatoria de los gastos
   */
  public int obtenerGastosTotalesViajero(Long id){
    Viajero viajero = gestorUsuarioService.obtenerViajero(id);
    return viajero.getReservas().stream().mapToInt(Reservas::getPrecio_total).sum();
  }

  /**
   * Crear una nueva reserva.
   *
   * @param anfitrionID ID del anfitrión
   * @param viajeroID ID del viajero
   * @return La reserva creada.
   */
  @Transactional
  public Reservas crearReserva(Long anfitrionID, Long viajeroID, LocalDate fecha_inicio, LocalDate fecha_fin) {
    Anfitrion anfitrion = gestorUsuarioService.obtenerAnfitrion(anfitrionID);
    Viajero viajero = gestorUsuarioService.obtenerViajero(viajeroID);

    // Validar que la fecha de inicio no sea posterior a la de fin
    if (fecha_inicio.isAfter(fecha_fin)) {
      throw new IllegalArgumentException("La fecha de inicio no puede ser posterior a la fecha de fin.");
    }

    // Antes de nada, cada usuario debe incrementar en uno el número de reservas / viajes realizados
    anfitrion.incrementarReservasRealizadas();
    viajero.incrementarViajesRealizados();
    gestorUsuarioService.guardarAnfitrion(anfitrion);
    gestorUsuarioService.guardarViajero(viajero);

    // Crear una nueva reserva entre dos usuarios
    Reservas reserva = new Reservas();
    reserva.setAnfitrion(anfitrion);
    reserva.setViajero(viajero);

    // Calcular el precio total
    int precio_noche = anfitrion.getVivienda().getPrecio_noche();
    int dias = (int) ChronoUnit.DAYS.between(fecha_inicio, fecha_fin);
    int precio_total = precio_noche * dias;

    reserva.setFechaInicio(fecha_inicio);
    reserva.setFechaFin(fecha_fin);
    reserva.setPrecio_noche(precio_noche);
    reserva.setPrecio_total(precio_total);
    reserva.setUbicacion(anfitrion.getVivienda().getCiudad() + "," + anfitrion.getVivienda().getProvincia());
    reserva.setEstado(Reservas.ReservaType.PENDIENTE);

    // Guardar la reserva
    return reservasRepository.save(reserva);
  }

  /**
   * Actualizdo el estado de la reserva
   * @param reservas Lista de reservas
   */
  private void actualizarEstadoReservas(List<Reservas> reservas) {
    LocalDate fechaActual = LocalDate.now();

    for (Reservas reserva : reservas) {
      if(!reserva.getEstado().equals(Reservas.ReservaType.CANCELADA)){
        // Ver si está finalizada
        if (reserva.getFechaFin().isBefore(fechaActual)) {
          reserva.setEstado(Reservas.ReservaType.FINALIZADA);
        }

        // Ver si está activa
        else if ((reserva.getFechaInicio().isBefore(fechaActual) || reserva.getFechaInicio().isEqual(fechaActual)) && (reserva.getFechaFin().isAfter(fechaActual) || reserva.getFechaFin().isEqual(fechaActual))) {
          reserva.setEstado(Reservas.ReservaType.ACTIVA);
        }

      }
    }

    reservasRepository.saveAll(reservas);
  }


  /**
   * Obtener todas las reservas asociadas a un anfitrión.
   *
   * @param anfitrionId ID del anfitrión.
   * @param fecha Fecha de la reserva estilo YYYY-MM
   * @return Lista de reservas correspondientes al anfitrión.
   */
  public List<Reservas> obtenerReservasPorAnfitrion(Long anfitrionId, String fecha) {
    Anfitrion anfitrion = gestorUsuarioService.obtenerAnfitrion(anfitrionId);
    LocalDate inicioMes = LocalDate.parse(fecha + "-01"); // Convierte la cadena YYYY-MM en formato YYYY-MM-01
    LocalDate finMes = inicioMes.withDayOfMonth(inicioMes.lengthOfMonth()); // Trasnforma al último dia del mes

    List<Reservas> reservas = reservasRepository
      .findByAnfitrionAndFechaInicioLessThanEqualAndFechaFinGreaterThanEqual(anfitrion, finMes, inicioMes);

    this.actualizarEstadoReservas(reservas);
    return reservas;
  }

  /**
   * Obtener todas las reservas asociadas a un viajero.
   *
   * @param viajeroId ID del viajero.
   * @param fecha Fecha de la reserva estilo YYYY-MM
   * @return Lista de reservas correspondientes al viajero.
   */
  public List<Reservas> obtenerReservasPorViajero(Long viajeroId, String fecha) {
    Viajero viajero = gestorUsuarioService.obtenerViajero(viajeroId);
    LocalDate inicioMes = LocalDate.parse(fecha + "-01"); // Convierte la cadena YYYY-MM en formato YYYY-MM-01
    LocalDate finMes = inicioMes.withDayOfMonth(inicioMes.lengthOfMonth()); // Trasnforma al último dia del mes

    List<Reservas> reservas = reservasRepository
      .findByViajeroAndFechaInicioLessThanEqualAndFechaFinGreaterThanEqual(viajero, finMes, inicioMes);

    this.actualizarEstadoReservas(reservas);
    return reservas;
  }

  /**
   * Cancela una reserva existente siempre que su estado sea PENDIENTE o ACTIVA.
   * La reserva no se elimina, únicamente se actualiza su estado a CANCELADA.
   *
   * @param anfitrionId ID del anfitrión asociado a la reserva.
   * @param viajeroId ID del viajero asociado a la reserva.
   * @param fechaInicio Fecha de inicio de la reserva.
   * @param fechaFin Fecha de fin de la reserva.
   * @return La reserva actualizada con estado CANCELADA, o null si no se encuentra o no puede ser cancelada.
   */
  @Transactional
  public ResponseEntity<Reservas> cancelarReserva(Long anfitrionId, Long viajeroId, LocalDate fechaInicio, LocalDate fechaFin) {
    Anfitrion anfitrion = gestorUsuarioService.obtenerAnfitrion(anfitrionId);
    Viajero viajero = gestorUsuarioService.obtenerViajero(viajeroId);

    Reservas reserva = reservasRepository.findByAnfitrionAndViajeroAndFechaInicioAndFechaFin(anfitrion, viajero, fechaInicio, fechaFin);

    // La reserva tiene que tener un estado adecuado
    if (reserva != null && reserva.getEstado().equals(Reservas.ReservaType.PENDIENTE)) {
      reserva.setEstado(Reservas.ReservaType.CANCELADA);

      // Decrementar los contadores de reservas y viajes
      anfitrion.decrementarReservasRealizadas();
      viajero.decrementarViajesRealizados();

      // Guardar los cambios en el anfitrion y el viajero
      gestorUsuarioService.guardarAnfitrion(anfitrion);
      gestorUsuarioService.guardarViajero(viajero);

      // Guardar la reserva con el nuevo estado
      return ResponseEntity.ok(reservasRepository.save(reserva));
    }

    return ResponseEntity.status(HttpStatus.CONFLICT).body(null);
  }

  /**
   * Obtener todas las reservas.
   *
   * @return Lista de todas las reservas.
   */
  public List<Reservas> obtenerTodasLasReservas() {
    List<Reservas> reservas = reservasRepository.findAll();
    this.actualizarEstadoReservas(reservas);
    return reservas;
  }

  /**
   * Elimina una reserva (SOLO ADMIN PANEL, ESTAS NO SE PUEDEN BORRAR SOLO CANCELAR)
   * @param reservaID ID de la reserva
   * @return Respuesta indicando que se ha borrado
   */
  @Transactional
  public ResponseEntity<Boolean> eliminarReserva(Long reservaID){
    Reservas reserva = reservasRepository.findById(reservaID)
      .orElseThrow(() -> new RuntimeException("Reserva no encontrada"));
    reservasRepository.deleteById(reservaID);
    return ResponseEntity.ok(true);
  }
}
