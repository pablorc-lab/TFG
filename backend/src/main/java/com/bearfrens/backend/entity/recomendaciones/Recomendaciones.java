package com.bearfrens.backend.entity.recomendaciones;

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
public class Recomendaciones {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne
  @JoinColumn(name = "usuario_id", nullable = false)
  private Usuario usuario;

  @Column(nullable = false)
  private String titulo;

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
