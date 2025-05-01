package com.bearfrens.backend.repository.user;

import com.bearfrens.backend.entity.user.Anfitrion;
import com.bearfrens.backend.entity.user.Viajero;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AnfitrionRepository extends JpaRepository<Anfitrion, Long> {
  // Spring se encarga de generar el metodo "EXISTS" asociado a encontrar ese campo
  boolean existsByEmail(String email);
  Optional<Anfitrion> findByEmail(String email);
  Optional<Anfitrion> findByPrivateID(String privateID);
}
