package com.bearfrens.backend.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name="anfitriones")
public class Anfitrion extends Usuario{
  private int reservas_realizadas = 0;

  // Constructores
  public Anfitrion() {
    super();
  }

  public Anfitrion(String privateID, String nombre, String apellido, LocalDate fecha_nacimiento, String email, String password, String profileImage, String profile_image_delete_url) {
    super(privateID, nombre, apellido, fecha_nacimiento, email, password, profileImage, profile_image_delete_url);
  }

  // GETTERS and SETTERS
  // GETTERS and SETTERS
  public int getReservas_realizadaseservas_realizadas() {return reservas_realizadas;}
  public void setReservas_realizadas() {this.reservas_realizadas += 1;} // Se incrementa la cantidad de reservas realizadas

  @Override
  public String toString() {
    return super.toString() + " reservas realizados=" + reservas_realizadas + '\'' + ",\n}";
  }

}
