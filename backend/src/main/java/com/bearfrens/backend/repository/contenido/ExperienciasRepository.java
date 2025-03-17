package com.bearfrens.backend.repository.contenido;

import com.bearfrens.backend.entity.contenido.Experiencias;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ExperienciasRepository extends JpaRepository<Experiencias, Long> {
}
