package com.bearfrens.backend.repository.user;

import com.bearfrens.backend.entity.user.Anfitrion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AnfitrionRepository extends JpaRepository<Anfitrion, Long> {
  // Spring se encarga de generar el metodo "EXISTS" asociado a encontrar ese campo
  boolean existsByEmail(String email);
  Optional<Anfitrion> findByEmail(String email);
  Optional<Anfitrion> findByPrivateID(String privateID);
}
