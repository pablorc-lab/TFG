package com.bearfrens.backend.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name="anfitriones")
public class Anfitrion extends Usuario{


  // Constructores
  public Anfitrion() {
    super();
  }

  public Anfitrion(String privateID, String nombre, String apellido, LocalDate fecha_nacimiento, String email, String password, String profileImage) {
    super(privateID, nombre, apellido, fecha_nacimiento, email, password, profileImage);
  }

  // GETTERS and SETTERS

}
