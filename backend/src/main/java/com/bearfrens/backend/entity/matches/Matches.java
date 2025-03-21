package com.bearfrens.backend.entity.matches;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(
  name = "matches",
  indexes = {
    @Index(name = "idx_viajero", columnList = "viajero_id"),
    @Index(name = "idx_anfitrion", columnList = "anfitrion_id"),
    @Index(name = "idx_viajero_anfitrion", columnList = "viajero_id, anfitrion_id", unique = true)
  }
)
public class Matches {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "viajero_id", nullable = false)
  private Long viajero_id;

  @Column(name = "anfitrion_id", nullable = false)
  private Long anfitrion_id;
}
