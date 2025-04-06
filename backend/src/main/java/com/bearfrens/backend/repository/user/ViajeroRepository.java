package com.bearfrens.backend.repository.user;

import com.bearfrens.backend.entity.user.Viajero;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

// @Repository  : La marca como un componente de acceso a datos, permitiendo que Spring la detecte y la gestione automáticamente
@Repository
/*
  Al extender JpaRepository<Viajero, Long>, la interfaz hereda métodos CRUD
  - Viajero: Entidad sobre la cual este repositorio operará, la tabla en la base de datos que representa.
  - Long: Es el tipo de dato de la clave primaria (id) de la entidad Viajero.
 */
public interface ViajeroRepository  extends JpaRepository<Viajero, Long> {
  // Spring se encarga de generar el metodo "EXISTS" asociado a encontrar ese campo
  boolean existsByEmail(String email);

  // Encontrar todos los viajeros dado sus id
  List<Viajero> findAllByIdIn(List<Long> ids);

  Optional<Viajero> findByPrivateID(String privateID);
}

