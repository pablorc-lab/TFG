package com.bearfrens.backend.entity.valoracione_conexiones;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@MappedSuperclass
public abstract class ValoracionConexion {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "emisor_id", nullable = false) // ID Usuario que da el like o deja la valoracion
  private Long emisorID;

  @Column(name = "tipo_usuario", nullable = false) // Tipo de usuario que recibe el like/valoracion (RECEPTOR)
  private int tipoUsuario; // 1 = Anfitrión, 2 = Viajero

  @Column
  private LocalDate fecha;

  @Column(name = "usuario_id", nullable = false) // ID Usuario que recibe el like/valoracion (RECEPTOR)
  private Long usuarioID;
}
