package com.bearfrens.backend.entity.contenido;

import com.bearfrens.backend.entity.user.Viajero;
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
@JsonPropertyOrder({"id", "viajero_id"}) // Ordenar los campos en el JSON
// Un usuario no puede escribir experiencias con el mismo titulo
@Table(name = "experiencias", uniqueConstraints = @UniqueConstraint(columnNames = {"viajero_id", "titulo"}))
public class Experiencias extends Contenido{

  @ManyToOne
  @JoinColumn(name = "viajero_id", nullable = false)
  @JsonIgnore
  private Viajero viajero;

  // Getter personalizado para mostrar solo el ID del viajero y NO todo el objeto del mismo
  @JsonProperty("viajero_id")
  public Long getViajeroId() { return viajero.getId();}

  @Override
  public void setUsuario(Object user){
    if (user instanceof Viajero) {
      this.viajero = (Viajero) user;
    }
    else {
      throw new IllegalArgumentException("El usuario debe ser un viajero");
    }
  };

}
