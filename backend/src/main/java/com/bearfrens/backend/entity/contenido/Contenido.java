package com.bearfrens.backend.entity.contenido;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@MappedSuperclass
@Getter
@Setter
public abstract class Contenido{
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false, length = 60)
  private String titulo; // Titulo inmutable

  @Column(nullable = false, length = 500)
  private String descripcion;

  @Column(nullable = true)
  private String recomendacion;

  public abstract void setUsuario(Object user);
}
