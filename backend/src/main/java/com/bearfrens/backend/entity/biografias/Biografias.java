package com.bearfrens.backend.entity.biografias;

import com.bearfrens.backend.entity.user.Usuario;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Entity
@NoArgsConstructor
@AllArgsConstructor
// La combinación de las columnas debe ser única en la base de datos (1 biografía por Usuario).
// Esto es debido a que puede haber dos usuarios con el mismo id pero ser de distinto tipo
@Table(name = "biografias", uniqueConstraints = @UniqueConstraint(columnNames = {"usuario_id", "tipo_usuario"}))
public class Biografias {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "tipo_usuario", nullable = false)
  private int tipoUsuario; // Anfitrion = 1, Viajero = 2

  @OneToOne // Indica una relación 1 a 1 entre Biografias y Usuario
  // Crea una columna 'usuario_id' que actúa como clave foránea apuntando al 'id' de la tabla 'usuarios'.
  @JoinColumn(name = "usuario_id", nullable = false)
  private Usuario usuario;

  @Column(name = "sobre_mi", length = 500)
  private String sobreMi;

  @Column(length = 255)
  private String idiomas; // Almacena "Idioma_1,Idioma_2,Idioma_3" como string

  @Column(name = "descripcion_extra", length = 500)
  private String descripcionExtra;
}
