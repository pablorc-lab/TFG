package com.bearfrens.backend.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.NoArgsConstructor;

@Entity
@Table(name="anfitriones")
public class Anfitrion extends Usuario{


  // Constructores
  public Anfitrion() {
    super();
  }

  public Anfitrion(String privateID, String nombre, String apellido, int edad, String email, String password, String profileImage) {
    super(privateID, nombre, apellido, edad, email, password, profileImage);
  }

  // GETTERS and SETTERS

}
