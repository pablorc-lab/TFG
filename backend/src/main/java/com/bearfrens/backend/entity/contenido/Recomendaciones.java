package com.bearfrens.backend.entity.contenido;

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
// Un usuario no puede escribir recomendaciones con el mismo titulo
@Table(name = "recomendaciones", uniqueConstraints = @UniqueConstraint(columnNames = {"anfitrion_id", "titulo"}))
public class Recomendaciones extends Contenido {

  @ManyToOne
  @JoinColumn(name = "anfitrion_id", nullable = false)
  @JsonIgnore //Evitar que se imprima todo el anfitrión
  private Anfitrion anfitrion;

  @Column(nullable = true) // Opcional
  private String ubicacion;

  @Column(nullable = true) // Opcional
  private int telefono;

  @Column(nullable = true, length = 150) // Opcional
  private String horarios;

  @Column(nullable = true) // Opcional
  private String ayuda;

  // GETTER y SETTERS
  // Getter personalizado para mostrar solo el ID del anfitrion y NO todo el objeto del mismo
  @JsonProperty("anfitrion_id")
  public Long getAnfitrionId() { return anfitrion.getId();}

  @Override
  public void setUsuario(Object user){
    if (user instanceof Anfitrion) {
      this.anfitrion = (Anfitrion) user;
    }
    else {
      throw new IllegalArgumentException("El usuario debe ser un anfitrión");
    }
  };
}
