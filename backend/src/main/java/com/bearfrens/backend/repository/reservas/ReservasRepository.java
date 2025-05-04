package com.bearfrens.backend.repository.reservas;

import com.bearfrens.backend.entity.reservas.Reservas;
import com.bearfrens.backend.entity.user.Anfitrion;
import com.bearfrens.backend.entity.user.Viajero;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ReservasRepository extends JpaRepository<Reservas, Long> {
  Reservas findByAnfitrionAndViajeroAndFechaInicioAndFechaFin(Anfitrion anfitrion, Viajero viajero, LocalDate fechaInicio, LocalDate fechaFin);

  // Método que busca las reservas de un usuario que se superpongan con el rango de fechas dado (pasar a inicio la fecha fin, y viceversa)
  List<Reservas> findByAnfitrionAndFechaInicioLessThanEqualAndFechaFinGreaterThanEqual(Anfitrion anfitrion, LocalDate fechaInicio, LocalDate fechaFin);
  List<Reservas> findByViajeroAndFechaInicioLessThanEqualAndFechaFinGreaterThanEqual(Viajero viajero, LocalDate fechaInicio, LocalDate fechaFin);
  List<Reservas> findByAnfitrionAndEstado(Anfitrion anfitrion, Reservas.ReservaType estado);
}

