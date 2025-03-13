package com.bearfrens.backend.repository.biografias;

import com.bearfrens.backend.entity.biografias.Biografias;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BiografiasRepository extends JpaRepository<Biografias, Long> {
}
