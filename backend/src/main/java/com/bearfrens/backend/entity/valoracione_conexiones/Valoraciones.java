package com.bearfrens.backend.entity.valoracione_conexiones;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@Entity
@NoArgsConstructor
@AllArgsConstructor
// Un "emisor" no puede proporcionar la misma valoración a un mismo usuario
@Table(
  name = "valoraciones",
  uniqueConstraints = @UniqueConstraint(columnNames = {"emisor_id", "usuario_id", "tipo_usuario"}),
  indexes = {
    @Index(name = "idx_emisor", columnList = "emisor_id"),
    @Index(name = "idx_usuario_tipo", columnList = "usuario_id, tipo_usuario"),
    @Index(name = "idx_usuario", columnList = "usuario_id")
  }
)
public class Valoraciones extends ValoracionConexion {
  private String emisor_profile_img; // Imagen de perfil del emisor

  private String emisor_nombre;

  // 3 digitos, con 2 decimales (Ej : 4.7)
  @Column(precision = 3, scale = 1)
  private BigDecimal num_valoracion;

  @Column
  private LocalDate fecha;

  @Lob // Large Object
  @Column(columnDefinition = "TEXT")
  private String descripcion;
}
