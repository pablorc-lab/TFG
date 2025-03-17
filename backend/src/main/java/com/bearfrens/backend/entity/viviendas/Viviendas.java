package com.bearfrens.backend.entity.viviendas;

import com.bearfrens.backend.entity.user.Anfitrion;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
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
@JsonPropertyOrder({"id", "anfitrion_id"}) // Ordenar los campos en el JSON
@Table(name = "viviendas")
public class Viviendas {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @OneToOne
  @JoinColumn(name = "anfitrion_id", unique = true, nullable = false)
  @JsonIgnore //Evitar que se imprima todo el anfitrión
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

  // Getter personalizado para mostrar solo el ID del anfitrion y NO todo el objeto del mismo
  @JsonProperty("anfitrion_id")
  public Long getAnfitrionId() { return anfitrion.getId();}
}
