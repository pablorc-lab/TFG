package com.bearfrens.backend.repository.contenido;

import com.bearfrens.backend.entity.contenido.Recomendaciones;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RecomendacionesRepository extends JpaRepository<Recomendaciones, Long>{
}
