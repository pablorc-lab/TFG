package com.bearfrens.backend.repository.matches;

import com.bearfrens.backend.entity.matches.Matches;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MatchesRepository extends JpaRepository<Matches, Long> {
  List<Matches> findAllByViajeroID(Long viajeroId);
  List<Matches> findAllByAnfitrionID(Long anfitrionId);
  Optional<Matches> findByAnfitrionIDAndViajeroID(Long anfitrionId, Long viajeroId);
}
