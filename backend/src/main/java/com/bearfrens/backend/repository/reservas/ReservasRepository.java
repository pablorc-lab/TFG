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
  List<Reservas> findByAnfitrion(Anfitrion anfitrion);
  List<Reservas> findByViajero(Viajero viajero);
  Reservas findByAnfitrionAndViajeroAndFechaInicioAndFechaFin(Anfitrion anfitrion, Viajero viajero, LocalDate fechaInicio, LocalDate fechaFin);
}
