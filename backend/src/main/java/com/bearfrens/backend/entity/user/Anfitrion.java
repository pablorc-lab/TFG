package com.bearfrens.backend.entity.user;

import com.bearfrens.backend.entity.recomendaciones.Recomendaciones;
import com.bearfrens.backend.entity.viviendas.Viviendas;
import jakarta.persistence.*;
import lombok.Getter;

import java.time.LocalDate;
import java.util.List;

@Entity
@Getter
@Table(name="anfitriones")
public class Anfitrion extends Usuario{
  private int reservas_realizadas = 0;

  @OneToOne(mappedBy = "anfitrion", cascade = CascadeType.ALL, orphanRemoval = true)
  private Viviendas vivienda;

  // orphanRemoval = elimina las recomendaciones huérfanas (sin usuario).
  @OneToMany(mappedBy = "anfitrion", cascade = CascadeType.ALL, orphanRemoval = true)
  private List<Recomendaciones> recomendaciones;

  // Constructores
  public Anfitrion() {
    super();
  }

  public Anfitrion(String privateID, String nombre, String apellido, LocalDate fecha_nacimiento, String email, String password, String profileImage) {
    super(privateID, nombre, apellido, fecha_nacimiento, email, password, profileImage);
  }

  // GETTERS and SETTERS
  public int getReservas_realizadaseservas_realizadas() {return reservas_realizadas;}
  public void setReservas_realizadas() {this.reservas_realizadas += 1;} // Se incrementa la cantidad de reservas realizadas

  @Override
  public String toString() {
    return super.toString() + " reservas realizados=" + reservas_realizadas + '\'' + ",\n}";
  }

}
