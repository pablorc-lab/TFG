package com.bearfrens_backend.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.NoArgsConstructor;

@Entity
@NoArgsConstructor  // Necesario para JPA
@Table(name="anfitriones")
public class Anfitrion extends Usuario{

  // Constructor
  public Anfitrion(String privateID, String nombre, String apellido, int edad, String email, String password) {
    super(privateID, nombre, apellido, edad, email, password);
  }

  // GETTERS and SETTERS

}
