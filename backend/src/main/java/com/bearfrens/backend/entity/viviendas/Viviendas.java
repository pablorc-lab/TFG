package com.bearfrens.backend.entity.viviendas;

import com.bearfrens.backend.entity.user.Anfitrion;
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
@Table(name = "viviendas")
public class Viviendas {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @OneToOne
  @JoinColumn(name = "anfitrion_id", unique = true, nullable = false)
  private Anfitrion anfitrion;

  @Column(nullable = true)
  private String imagen1;

  @Column(nullable = true)
  private String imagen2;

  @Column(nullable = true)
  private String imagen3;

  @Column(nullable = true)
  private String imagen4;

  @Column
  int viajeros;

  @Column
  int habitaciones;

  @Column
  int camas;

  @Column
  int banios; // Baños

  @Column
  String provincia;

  @Column
  String ciudad;

  @Column
  int precio_noche;
}
