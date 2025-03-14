package com.bearfrens.backend.repository.recomendaciones;

import com.bearfrens.backend.entity.recomendaciones.Recomendaciones;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RecomendacionesRepository extends JpaRepository<Recomendaciones, Long>{
}
