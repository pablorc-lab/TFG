package com.bearfrens.backend.entity.reservas;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
@Entity
@NoArgsConstructor
@AllArgsConstructor
// La combinación de las columnas debe ser única en la base de datos (1 reserva a un anfitrión por usuario en esa fecha).
@Table(name = "reservas", uniqueConstraints = @UniqueConstraint(columnNames = {"viajero_id", "anfitrion_id", "fechaInicio", "fechaFin"}))
public class Reservas {

  public enum ReservaType {
    PENDIENTE,     // Cuando la reserva está confirmada pero aún no ha comenzado.
    ACTIVA,        // Cuando está en proceso.
    FINALIZADA,    // Cuando la reserva ya se completó.
    CANCELADA      // Cuando fue cancelada.
  }

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "anfitrion_id", nullable = false)
  private Long anfitrionID;

  @Column(name = "viajero_id", nullable = false)
  private Long viajeroID;

  @Enumerated(EnumType.STRING)
  private ReservaType estado;

  @Column(nullable = false)
  private Date fechaInicio;

  @Column(nullable = false)
  private Date fechaFin;

  @Column
  private int precio_noche;

  @Column
  private int precio_total;

  @Column
  private String ubicacion;
}
