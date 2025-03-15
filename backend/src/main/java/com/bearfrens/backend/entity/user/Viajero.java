package com.bearfrens.backend.entity.user;

import com.bearfrens.backend.entity.experiencias.Experiencias;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Getter;

import java.time.LocalDate;
import java.util.List;

// @Entity : Indica que esta clase es una entidad JPA y se mapeará a una tabla en la base de datos.
// @NoArgsConstructor : permite que JPA cree instancias de las entidades utilizando un constructor vacío, requerido para realizar la deserialización y la persistencia de objetos en la base de datos.
@Entity
@Getter
@Table(name="viajeros")
public class Viajero extends Usuario{
  private int viajes_realizados = 0;

  @OneToMany(mappedBy = "viajero", cascade = CascadeType.ALL, orphanRemoval = true)
  private List<Experiencias> experiencias;

   // Constructor
  public Viajero() {
    super();
  }

  public Viajero(String privateID, String nombre, String apellido, LocalDate fecha_nacimiento, String email, String password, String profileImage) {
    super(privateID, nombre, apellido, fecha_nacimiento, email, password, profileImage);
  }

  // GETTERS and SETTERS
  public void setViajes_realizados() {this.viajes_realizados += 1;} // Se incrementa la cantidad de viajes realizados

  @Override
  public String toString() {
    return super.toString() + " viajes realizados=" + viajes_realizados + '\'' + ",\n}";
  }
}
