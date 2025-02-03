package com.bearfrens_backend.entity;

import jakarta.persistence.*;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

//  @MappedSuperclass : indica que NO se creará una tabla usuario. Ya que cada tipo de usuario tiene una tabla distinta
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
  @Column(name = "privateID")
  private String privateID;

  @Column(name = "email")
  private String email;

  @Column(name = "password", nullable = false)
  private String password;

  @Column(name = "nombre")
  private String nombre;

  @Column(name = "apellido")
  private String apellido;

  @Column(name = "edad")
  private int edad;

  // Constructor vacío necesario para JPA
  public Usuario() {}

  // Constructor con cifrado de contraseña
  public Usuario(String privateID, String nombre, String apellido, int edad, String email, String password) {
    this.privateID = privateID;
    this.nombre = nombre;
    this.apellido = apellido;
    this.edad = edad;
    this.email = email;
    setPassword(password); // Ciframos la contraseña
  }
  
  // GETTERS and SETTERS
  public long getId() { return id; }
  public void setId(long id) { this.id = id; }
  public String getPrivateID() {return privateID; }
  public void setPrivateID(String privateID) { this.privateID = privateID; }
  public String getEmail() { return email; }
  public void setEmail(String email) { this.email = email; }
  public String getNombre() { return nombre; }
  public void setNombre(String nombre) { this.nombre = nombre; }
  public String getApellido() { return apellido; }
  public void setApellido(String apellido) { this.apellido = apellido; }
  public int getEdad() {return edad;}
  public void setEdad(int edad) { this.edad = edad;}
  public String getPassword() { return password; }

  // Cifrar la nueva contraseña
  public void setPassword(String newPassword) {
    BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
    this.password = encoder.encode(newPassword);
  }

  @Override
  public String toString() {
    return "Usuario{" + "\n" +
        " id=" + id + ",\n" +
        " email='" + email + '\'' + ",\n" +
        " password='" + password + '\'' + ",\n" +
        " nombre='" + nombre + '\'' + ",\n" +
        " apellido='" + apellido + '\'' + ",\n";
  }
}

