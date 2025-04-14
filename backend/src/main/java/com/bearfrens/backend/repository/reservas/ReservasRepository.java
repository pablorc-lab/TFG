package com.bearfrens.backend.repository.reservas;


import com.bearfrens.backend.entity.reservas.Reservas;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface ReservasRepository extends JpaRepository<Reservas, Long> {
  List<Reservas> findByAnfitrionId(Long anfitrionId);
  List<Reservas> findByViajeroId(Long viajeroId);
  Reservas findByAnfitrionIdAndViajeroIdAndFechaInicioAndFechaFin(Long anfitrionId, Long viajeroId, Date fechaInicio, Date fechaFin);
}
