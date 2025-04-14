package com.bearfrens.backend.entity.reservas;

import com.bearfrens.backend.entity.user.Anfitrion;
import com.bearfrens.backend.entity.user.Viajero;
import com.fasterxml.jackson.annotation.JsonIgnore;
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
@Table(name = "reservas", uniqueConstraints = @UniqueConstraint(columnNames = {"viajero_id", "anfitrion_id", "fecha_inicio", "fecha_fin"}))
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

  @ManyToOne
  @JoinColumn(name = "anfitrion_id", nullable = false)
  @JsonIgnore //Evitar que se imprima todo el anfitrión
  private Anfitrion anfitrion;

  @ManyToOne
  @JoinColumn(name = "viajero_id", nullable = false)
  @JsonIgnore //Evitar que se imprima todo el anfitrión
  private Viajero viajero;

  @Enumerated(EnumType.STRING)
  private ReservaType estado;

  @Column(name = "fecha_inicio", nullable = false)
  private Date fechaInicio;

  @Column(name = "fecha_fin", nullable = false)
  private Date fechaFin;

  @Column
  private int precio_noche;

  @Column
  private int precio_total;

  @Column
  private String ubicacion;

  @Column
  private boolean viajero_eliminado = false;

  @Column
  private boolean anfitrion_eliminado = false;
}
