package com.bearfrens.backend.entity.biografias;

import com.bearfrens.backend.entity.user.Usuario;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
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
  private int tipoUsuario; // 1 = Anfitrion, 2 = Viajero

  @Column(name = "usuario_id", nullable = false)
  private Long usuarioID;

  @Column(name = "sobre_mi", length = 500)
  private String sobreMi;

  @Column(length = 255)
  private String idiomas; // Almacena "Idioma_1,Idioma_2,Idioma_3" como string

  // Para anfitrion, será sobre la vivienda y para el viajero sobre sus viajes
  @Column(name = "descripcion_extra", length = 500)
  private String descripcionExtra;
}
