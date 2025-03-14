package com.bearfrens.backend.repository.viviendas;

import com.bearfrens.backend.entity.viviendas.Viviendas;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ViviendasRepository extends JpaRepository<Viviendas, Long> {
}
