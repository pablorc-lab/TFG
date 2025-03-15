package com.bearfrens.backend.repository.experiencias;

import com.bearfrens.backend.entity.experiencias.Experiencias;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ExperienciasRepository extends JpaRepository<Experiencias, Long> {
}
