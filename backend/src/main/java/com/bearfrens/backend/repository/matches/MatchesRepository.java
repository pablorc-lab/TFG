package com.bearfrens.backend.repository.matches;

import com.bearfrens.backend.entity.matches.Matches;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MatchesRepository extends JpaRepository<Matches, Long> {
  List<Matches> findByViajeroID(Long viajeroId);
  List<Matches> findByAnfitrionID(Long anfitrionId);
}
