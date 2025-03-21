package com.bearfrens.backend.repository.matches;

import com.bearfrens.backend.entity.matches.Matches;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MatchesRepository extends JpaRepository<Matches, Long> {
  List<Matches> findByViajeroId(Long viajeroId);
  List<Matches> findByAnfitrionId(Long anfitrionId);
}
