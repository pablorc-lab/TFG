package com.bearfrens.backend.repository.user;

import com.bearfrens.backend.entity.user.Viajero;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface ViajeroSpecificationRepository extends JpaRepository<Viajero, Long>, JpaSpecificationExecutor<Viajero>{
}
