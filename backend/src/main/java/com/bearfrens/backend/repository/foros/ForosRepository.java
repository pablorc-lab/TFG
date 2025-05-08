package com.bearfrens.backend.repository.foros;

import com.bearfrens.backend.entity.foros.Foros;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ForosRepository extends JpaRepository<Foros, Long> {
  List<Foros> findAllByForoPadreIsNullOrderByFechaDesc(Pageable pageable);
  List<Foros> findAllByForoPadreIsNullAndFechaLessThanEqualOrderByFechaDesc(LocalDate fecha, Pageable pageable);
  boolean existsByFechaLessThanEqual(LocalDate fecha);
  boolean existsByFechaLessThanEqualAndIdNot(LocalDate fecha, Long id);
  List<Foros> findByForoPadreId(Long foroPadreID);
}
