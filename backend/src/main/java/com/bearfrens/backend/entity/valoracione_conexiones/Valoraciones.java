package com.bearfrens.backend.entity.valoracione_conexiones;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

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
  @Column
  private String user_profile_img;

  @Column
  private int num_valoracion;

  @Column
  private LocalDate fecha;

  @Column
  private String descripcion;
}
