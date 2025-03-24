package com.bearfrens.backend.entity.user;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.List;
import java.util.Objects;

@Getter
@Setter
@MappedSuperclass // NO se creará una tabla usuario. Ya que cada tipo de usuario tiene una tabla distinta
public abstract class Usuario<TC>{

  @Id // Clase primaria de la entidad
  @GeneratedValue(strategy = GenerationType.IDENTITY) // Su valor se generará automáticamente, normalmente como un número autoincrementable.
  private long id;

  // @Column: Mapea el campo a la columna correspondiente de la tabla de la base de datos
  @Column(length = 50)
  private String privateID;

  @Column(length = 100, nullable = false, unique = true)
  private String email;

  @Column(nullable = false)
  private String password;

  @Column(length = 50)
  private String nombre;

  @Column(length = 50)
  private String apellido;

  @Column
  private LocalDate fecha_nacimiento;

  @Column
  private String profileImage;

  // 3 digitos, con 2 decimales (Ej : 4.7)
  @Column(precision = 3, scale = 1)
  private BigDecimal valoracion_media;

  @Column(nullable = false)
  private int num_valoraciones = 0;

  @Column(length = 100)
  private String descripcion;

  @Column(length = 50)
  private String gusto1;

  @Column(length = 50)
  private String gusto2;

  @Column(length = 50)
  private String gusto3;

  // Método genérico para obtener el contenido (Experiencias o Recomendaciones)
  @Transient // Indiicar que no se cree una columna "contenido"
  @JsonIgnore
  public abstract List<TC> getContenido();

  // Constructor vacío necesario para JPA
  public Usuario() {}

  // Constructor con cifrado de contraseña
  public Usuario(String privateID, String email, String nombre, String password, String apellido, LocalDate fecha_nacimiento,
                 String profileImage, BigDecimal valoracion_media, String descripcion, String gusto1, String gusto2, String gusto3, int num_valoraciones) {
    this.privateID = privateID;
    this.email = email;
    this.nombre = nombre;
    setPassword(password); // Ciframos la contraseña
    this.apellido = apellido;
    this.fecha_nacimiento = fecha_nacimiento;
    this.profileImage = (profileImage == null || profileImage.isEmpty()) ? null : profileImage;
    this.valoracion_media = valoracion_media;
    this.num_valoraciones = Math.max(num_valoraciones, 0);
    this.descripcion = descripcion;
    this.gusto1 = gusto1;
    this.gusto2 = gusto2;
    this.gusto3 = gusto3;
  }

  // GETTERS and SETTERS
  // Cifrar la nueva contraseña
  public void setPassword(String newPassword) {
    BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
    this.password = encoder.encode(newPassword);
  }

  // Calcular la nueva media
  public void setValoracion_media(BigDecimal nuevaValoracion) {
    if (nuevaValoracion == null) return;

    // Si es la primera valoración, simplemente asignamos la nueva valoración
    if (this.num_valoraciones == 0) {
      this.valoracion_media = nuevaValoracion.setScale(1, RoundingMode.HALF_UP);
      this.num_valoraciones = 1;
    }

    else {
      // Calculamos la nueva media ponderada
      BigDecimal totalValoraciones = this.valoracion_media.multiply(BigDecimal.valueOf(this.num_valoraciones));
      totalValoraciones = totalValoraciones.add(nuevaValoracion);

      // Aumentamos el número de valoraciones
      this.num_valoraciones++;

      // Calculamos la media final y la redondeamos a 2 decimales
      this.valoracion_media = totalValoraciones.divide(BigDecimal.valueOf(this.num_valoraciones), 1, RoundingMode.HALF_UP);
    }
  }


  @Override
  public String toString() {
    return "Usuario{" + "\n" +
        " ID=" + id + ",\n" +
        " Email='" + email + '\'' + ",\n" +
        " Password='" + password + '\'' + ",\n" +
        " Nombre='" + nombre + '\'' + ",\n" +
        " Apellido='" + apellido + '\'' + ",\n" +
        " Fecha de nacimiento='" + fecha_nacimiento + '\'' + ",\n" +
        " URL profile image='" + profileImage + '\'' + ",\n";
  }
}

