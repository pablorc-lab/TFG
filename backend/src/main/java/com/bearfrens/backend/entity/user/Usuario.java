package com.bearfrens.backend.entity.user;
import com.bearfrens.backend.entity.biografias.Biografias;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import java.time.LocalDate;
import java.util.List;

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

  // Método genérico para obtener el contenido (Experiencias o Recomendaciones)
  @Transient // Indiicar que no se cree una columna "contenido"
  @JsonIgnore
  public abstract List<TC> getContenido();

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

