package com.bearfrens.backend.entity.user;

import com.bearfrens.backend.entity.contenido.Recomendaciones;
import com.bearfrens.backend.entity.reservas.Reservas;
import com.bearfrens.backend.entity.viviendas.Viviendas;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Entity
@Getter
@Setter
@Table(name="anfitriones")
public class Anfitrion extends Usuario<Recomendaciones>{
  private int reservas_realizadas = 0;

  @OneToOne(mappedBy = "anfitrion", cascade = CascadeType.ALL, orphanRemoval = true)
  private Viviendas vivienda;

  // orphanRemoval = elimina las recomendaciones huérfanas (sin usuario).
  // Esto significa que para eliminarla simplemente debemos desvincular la recomendacion con el anfitrion
  @OneToMany(mappedBy = "anfitrion", cascade = CascadeType.ALL, orphanRemoval = true)
  private List<Recomendaciones> recomendaciones;

  @OneToMany(mappedBy = "anfitrion", cascade = CascadeType.ALL, orphanRemoval = false)
  private List<Reservas> reservas;

  // Constructores
  public Anfitrion() {
    super();
  }

  public Anfitrion(String privateID, String email, String nombre, String apellido, LocalDate fecha_nacimiento, String profileImage, BigDecimal valoracion_media, String descripcion, String gusto1, String gusto2, String gusto3, int num_valoraciones) {
    super(privateID, email, nombre, apellido, fecha_nacimiento, profileImage, valoracion_media, descripcion, gusto1, gusto2, gusto3, num_valoraciones);
  }

  // GETTERS and SETTERSs
  public void setReservas_realizadas() {this.reservas_realizadas += 1;} // Se incrementa la cantidad de reservas realizadas

  @Override
  public String toString() {
    return super.toString() + " reservas realizados=" + reservas_realizadas + '\'' + ",\n}";
  }

  @Override
  @Transient // Indicar que no se cree una columna "contenido"
  public List<Recomendaciones> getContenido(){
    return recomendaciones;
  }
}
