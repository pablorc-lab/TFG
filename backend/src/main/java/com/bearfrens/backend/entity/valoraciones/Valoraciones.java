package com.bearfrens.backend.entity.valoraciones;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.Date;

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
public class Valoraciones {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "emisor_id", nullable = false) // Usuario que deja la valoración
  private Long emisorID;

  @Column(name = "tipo_usuario", nullable = false)
  private int tipoUsuario; // 1 = Anfitrión, 2 = Viajero (RECEPTOR)

  @Column(name = "usuario_id", nullable = false) // Usuario que recibe la valoración (RECEPTOR)
  private Long usuarioID;

  @Column
  private String user_profile_img;

  @Column
  private int num_valoracion;

  @Column
  private LocalDate fecha;

  @Column
  private String descripcion;
}
