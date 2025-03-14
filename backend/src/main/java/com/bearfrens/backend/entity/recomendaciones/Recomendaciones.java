package com.bearfrens.backend.entity.recomendaciones;

import com.bearfrens.backend.entity.user.Anfitrion;
import com.bearfrens.backend.entity.user.Usuario;
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
// Un usuario no puede escribir recomendaciones con el mismo titulo
@Table(name = "recomendaciones", uniqueConstraints = @UniqueConstraint(columnNames = {"anfitrion_id", "titulo"}))
public class Recomendaciones {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne
  @JoinColumn(name = "anfitrion_id", nullable = false)
  private Anfitrion anfitrion;

  @Column(nullable = false)
  private String titulo; // Titulo inmutable

  @Column(nullable = false)
  private String descripcion;

  @Column(nullable = true) // Opcional
  private String ubicacion;

  @Column(nullable = true) // Opcional
  private String recomendacion;

  @Column(nullable = true) // Opcional
  private int telefono;

  @Column(nullable = true) // Opcional
  private String horarios;

  @Column(nullable = true) // Opcional
  private String ayuda;
}
