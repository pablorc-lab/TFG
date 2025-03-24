package com.bearfrens.backend.entity.user;

import com.bearfrens.backend.entity.contenido.Experiencias;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

// @Entity : Indica que esta clase es una entidad JPA y se mapeará a una tabla en la base de datos.
// @NoArgsConstructor : permite que JPA cree instancias de las entidades utilizando un constructor vacío, requerido para realizar la deserialización y la persistencia de objetos en la base de datos.
@Entity
@Getter
@Table(name="viajeros")
public class Viajero extends Usuario<Experiencias>{
  private int viajes_realizados = 0;

  @OneToMany(mappedBy = "viajero", cascade = CascadeType.ALL, orphanRemoval = true)
  private List<Experiencias> experiencias;

   // Constructor
  public Viajero() {
    super();
  }

  public Viajero(String privateID, String email, String nombre, String password, String apellido, LocalDate fecha_nacimiento, String profileImage, BigDecimal valoracion_media, String descripcion, String gusto1, String gusto2, String gusto3, int num_valoraciones) {
    super(privateID, email, nombre, password, apellido, fecha_nacimiento, profileImage, valoracion_media, descripcion, gusto1, gusto2, gusto3, num_valoraciones);
  }

  // GETTERS and SETTERS
  public void setViajes_realizados() {this.viajes_realizados += 1;} // Se incrementa la cantidad de viajes realizados

  @Override
  public String toString() {
    return super.toString() + " viajes realizados=" + viajes_realizados + '\'' + ",\n}";
  }

  @Override
  @Transient // Indiicar que no se cree una columna "contenido"
  public List<Experiencias> getContenido(){
    return experiencias;
  }
}
