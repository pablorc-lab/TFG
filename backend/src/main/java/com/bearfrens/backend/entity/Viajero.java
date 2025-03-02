package com.bearfrens.backend.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

// @Entity : Indica que esta clase es una entidad JPA y se mapeará a una tabla en la base de datos.
// @NoArgsConstructor : permite que JPA cree instancias de las entidades utilizando un constructor vacío, requerido para realizar la deserialización y la persistencia de objetos en la base de datos.
@Entity
@Table(name="viajeros")
public class Viajero extends Usuario{
  private int viajes_realizados = 0;

   // Constructor
  public Viajero() {
    super();
  }

  public Viajero(String privateID, String nombre, String apellido, LocalDate fecha_nacimiento, String email, String password, String profileImage, String profile_image_delete_url) {
    super(privateID, nombre, apellido, fecha_nacimiento, email, password, profileImage, profile_image_delete_url);
  }

  // GETTERS and SETTERS
  public int getViajes_realizados() {return viajes_realizados;}
  public void setViajes_realizados() {this.viajes_realizados += 1;} // Se incrementa la cantidad de viajes realizados

  @Override
  public String toString() {
    return super.toString() + " viajes realizados=" + viajes_realizados + '\'' + ",\n}";
  }
}
