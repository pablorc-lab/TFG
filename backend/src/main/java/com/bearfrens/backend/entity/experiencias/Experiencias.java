package com.bearfrens.backend.entity.experiencias;

import com.bearfrens.backend.entity.user.Viajero;
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
// Un usuario no puede escribir experiencias con el mismo titulo
@Table(name = "experiencias", uniqueConstraints = @UniqueConstraint(columnNames = {"viajero_id", "titulo"}))
public class Experiencias {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne
  @JoinColumn(name = "viajero_id", nullable = false)
  private Viajero viajero;

  @Column(nullable = false)
  private String titulo; // Titulo inmutable

  @Column(nullable = false)
  private String descripcion;

  @Column(nullable = false)
  private String recomendacion;
}
