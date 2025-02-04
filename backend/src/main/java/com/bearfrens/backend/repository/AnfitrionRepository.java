package com.bearfrens.backend.repository;

import com.bearfrens.backend.entity.Anfitrion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AnfitrionRepository extends JpaRepository<Anfitrion, Long> {
}
