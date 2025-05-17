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
import org.springframework.web.bind.annotation.PathVariable;

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
  public double obtenerIngresosTotalesAnfitrion(Long id){
    Anfitrion anfitrion = gestorUsuarioService.obtenerAnfitrion(id);
    int total = anfitrion.getReservas().stream().mapToInt(Reservas::getPrecio_total).sum();

    // Al total restarle la comisión del 10%
    return total * 0.9;
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

  // Dado un listado de reservas devuelve las reservadas
  private static List<LocalDate> getFechasReservadas(int num_viajeros, List<Reservas> reservas) {
    List<LocalDate> fechasReservadas = new ArrayList<>();
    Map<LocalDate, Integer> conteoFechas = new HashMap<>(); // Está reservada si el num es >= al num de viajeros

    for (Reservas reserva : reservas) {
      if(reserva.getEstado().equals(Reservas.ReservaType.ACTIVA) || reserva.getEstado().equals(Reservas.ReservaType.PENDIENTE)){
        LocalDate fecha = reserva.getFechaInicio();
        // Mientras la fecha actual no sea mayor o igiaul que la fecha fin, se añade a la lista
        while (fecha.isBefore(reserva.getFechaFin())) {
          conteoFechas.put(fecha, conteoFechas.getOrDefault(fecha, 0) + 1);
          fecha = fecha.plusDays(1);
        }
      }
    }

    // Devolver todas las fechas QUE NO PASAN EL NÚMERO DE VIAJEROS
    for(Map.Entry<LocalDate, Integer> entrada : conteoFechas.entrySet()){
      if(entrada.getValue() >= num_viajeros){
        fechasReservadas.add(entrada.getKey());
      }
    }
    return fechasReservadas;
  }

  /**
   * Devulve un listado de fechas ya reservadas
   * @param anfitrionId ID del anfitrión
   * @return Lista de fechas
   */
  public List<LocalDate> obtenerFechasYaReservadas(Long anfitrionId) {
    Anfitrion anfitrion = gestorUsuarioService.obtenerAnfitrion(anfitrionId);

    LocalDate actual = LocalDate.now();
    List<Reservas> reservas = reservasRepository.findByAnfitrionAndEstadoAndFechaFinGreaterThanEqual(anfitrion, Reservas.ReservaType.ACTIVA,actual);
    reservas.addAll(reservasRepository.findByAnfitrionAndEstadoAndFechaFinGreaterThanEqual(anfitrion, Reservas.ReservaType.PENDIENTE, actual));

    actualizarEstadoReservas(reservas); // Actualizar por si a alguna no se le ha actualizado la fecha

    return getFechasReservadas(anfitrion.getVivienda().getViajeros(), reservas);
  }

  /**
   * Devulve un listado de fechas ya reservadas de un viajero
   * @param viajeroID ID del viajero
   * @return Lista de fechas
   */
  public List<LocalDate> obtenerFechasReservadasViajero(Long viajeroID) {
    Viajero viajero = gestorUsuarioService.obtenerViajero(viajeroID);

    LocalDate actual = LocalDate.now();
    List<Reservas> reservas = reservasRepository.findByViajeroAndEstadoAndFechaFinGreaterThanEqual(viajero, Reservas.ReservaType.ACTIVA, actual);
    reservas.addAll(reservasRepository.findByViajeroAndEstadoAndFechaFinGreaterThanEqual(viajero, Reservas.ReservaType.PENDIENTE, actual));

    actualizarEstadoReservas(reservas); // Actualizar por si a alguna no se le ha actualizado la fecha

    List<LocalDate> fechasReservadas = new ArrayList<>();
    for (Reservas reserva : reservas) {
      if(reserva.getEstado().equals(Reservas.ReservaType.ACTIVA) || reserva.getEstado().equals(Reservas.ReservaType.PENDIENTE)){
        LocalDate fecha = reserva.getFechaInicio();
        // Mientras la fecha actual no sea mayor o igual que la fecha fin, se añade a la lista
        while (fecha.isBefore(reserva.getFechaFin())) {
          fechasReservadas.add(fecha);
          fecha = fecha.plusDays(1);
        }
      }
    }

    return fechasReservadas;
  }

   /**
   * Verifica si un anfitrión tiene hueco en su vivienda
   *
   * @param anfitrion Anfitrión que tiene la vivienda
   * @param fechaInicio Fecha de inicio
   * @param fechaFin Fecha de fin
   * @return La reserva creada.
   */
  public boolean hayHuecoDisponible(Anfitrion anfitrion, LocalDate fechaInicio, LocalDate fechaFin) {
    LocalDate actual = LocalDate.now();
    List<Reservas> reservas = reservasRepository.findByAnfitrionAndEstadoAndFechaFinGreaterThanEqual(anfitrion, Reservas.ReservaType.ACTIVA,actual);
    reservas.addAll(reservasRepository.findByAnfitrionAndEstadoAndFechaFinGreaterThanEqual(anfitrion, Reservas.ReservaType.PENDIENTE, actual));

    Map<LocalDate, Integer> conteoFechas = new HashMap<>(); // Mapa para contar las reservas por fecha

    // Iteramos sobre las reservas activas y pendientes
    for (Reservas reserva : reservas) {
      if (reserva.getEstado().equals(Reservas.ReservaType.ACTIVA) || reserva.getEstado().equals(Reservas.ReservaType.PENDIENTE)) {
        LocalDate fecha = reserva.getFechaInicio();

        // Solo consideramos las reservas dentro del rango de fechas proporcionado
        while (!fecha.isAfter(reserva.getFechaFin()) && !fecha.isBefore(fechaInicio)) {
          // Si la fecha está dentro del rango entre fechaInicio y fechaFin, incrementamos el conteo
          if (!fecha.isBefore(fechaInicio) && !fecha.isAfter(fechaFin)) {
            conteoFechas.put(fecha, conteoFechas.getOrDefault(fecha, 0) + 1);
          }
          fecha = fecha.plusDays(1);
        }
      }
    }

    // Comprobamos si alguna fecha en el rango tiene un número de reservas mayor o igual al número de viajeros
    int max_viajeros = anfitrion.getVivienda().getViajeros();
    for (Map.Entry<LocalDate, Integer> entrada : conteoFechas.entrySet()) {
      if (entrada.getValue() >= max_viajeros) {
        return false; // Si alguna fecha tiene suficientes reservas, no hay hueco
      }
    }

    return true; // Si no hay ninguna fecha con el número de reservas suficiente, hay hueco disponible
  }


  /**
   * Crear una nueva reserva.
   *
   * @param anfitrionID ID del anfitrión
   * @param viajeroID ID del viajero
   * @param fecha_inicio Fecha de inicio
   * @param fecha_fin Fecha de fin
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

    if (!hayHuecoDisponible(anfitrion, fecha_inicio, fecha_fin)) {
      throw new IllegalArgumentException("No hay disponibilidad en las fechas seleccionadas.");
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
