package com.bearfrens.backend.entity.user;

import com.bearfrens.backend.entity.contenido.Experiencias;
import com.bearfrens.backend.entity.reservas.Reservas;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

// @Entity : Indica que esta clase es una entidad JPA y se mapeará a una tabla en la base de datos.
// @NoArgsConstructor : permite que JPA cree instancias de las entidades utilizando un constructor vacío, requerido para realizar la deserialización y la persistencia de objetos en la base de datos.
@Entity
@Getter
@Setter
@Table(name="viajeros")
public class Viajero extends Usuario<Experiencias>{

  @Column
  private int viajes_realizados = 0;

  @Column(length = 20)
  private String profesion;

  @Column(length = 15)
  String tiempo_estancia;

  @OneToMany(mappedBy = "viajero", cascade = CascadeType.ALL, orphanRemoval = true)
  private List<Experiencias> experiencias;

  @OneToMany(mappedBy = "viajero", cascade = CascadeType.ALL, orphanRemoval = false)
  @JsonIgnore
  private List<Reservas> reservas;

  @Column(nullable = true)
  private String imagen1;

  @Column(nullable = true)
  private String imagen2;

  @Column(nullable = true)
  private String imagen3;

  @Column(nullable = true)
  private String imagen4;

   // Constructor
  public Viajero() {
    super();
  }

  public Viajero(String privateID, String email, String nombre, String apellido, LocalDate fecha_nacimiento, String profileImage, BigDecimal valoracion_media, String descripcion, String gusto1, String gusto2, String gusto3, int num_valoraciones) {
    super(privateID, email, nombre, apellido, fecha_nacimiento, profileImage, valoracion_media, descripcion, gusto1, gusto2, gusto3, num_valoraciones);
  }

  // GETTERS and SETTERS
  public void incrementarViajesRealizados() {this.viajes_realizados += 1;} // Se incrementa la cantidad de viajes realizados
  public void decrementarViajesRealizados() { // Se decrementa la cantidad de viajes realizados (RESERVA CANCELADA)
    if (this.viajes_realizados > 0) {
      this.viajes_realizados -= 1;
    }
  }

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
