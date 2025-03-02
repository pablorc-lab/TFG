package com.bearfrens.backend.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.time.LocalDate;

//  @MappedSuperclass : indica que NO se creará una tabla usuario. Ya que cada tipo de usuario tiene una tabla distinta
@Getter
@Setter
@MappedSuperclass
public abstract class Usuario {
  /*
    - @Id : Clase primaria de la entidad
    - @GeneratedValue : Indica que su valor se generará automáticamente, normalmente como un número autoincrementable.
   */
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private long id;

  // @Column: Mapea el campo a la columna correspondiente de la tabla de la base de datos
  @Column(name = "privateID", length = 50)
  private String privateID;

  @Column(name = "email", length = 100, nullable = false)
  private String email;

  @Column(name = "password", nullable = false)
  private String password;

  @Column(name = "nombre", length = 50)
  private String nombre;

  @Column(name = "apellido", length = 50)
  private String apellido;

  @Column(name = "fecha_nacimiento")
  private LocalDate fecha_nacimiento;

  @Column(name = "profileImage")
  private String profileImage;

  // Constructor vacío necesario para JPA
  public Usuario() {}

  // Constructor con cifrado de contraseña
  public Usuario(String privateID, String nombre, String apellido, LocalDate fecha_nacimiento, String email, String password, String profileImage) {
    this.privateID = privateID;
    this.nombre = nombre;
    this.apellido = apellido;
    this.fecha_nacimiento = fecha_nacimiento;
    this.email = email;
    setPassword(password); // Ciframos la contraseña
    this.profileImage = (profileImage == null || profileImage.isEmpty()) ? null : profileImage;
  }
  
  // GETTERS and SETTERS
  // Cifrar la nueva contraseña
  public void setPassword(String newPassword) {
    BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
    this.password = encoder.encode(newPassword);
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

