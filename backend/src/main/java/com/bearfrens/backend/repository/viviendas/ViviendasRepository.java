package com.bearfrens.backend.repository.viviendas;

import com.bearfrens.backend.entity.viviendas.Viviendas;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ViviendasRepository extends JpaRepository<Viviendas, Long> {
  List<Viviendas> findAllByCiudadAndProvincia(String ciudad, String provincia);
}
