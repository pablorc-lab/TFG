package com.bearfrens.backend.entity.valoracione_conexiones;

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
@Table(
  name = "likes",
  indexes = {
    @Index(name = "idx_emisor", columnList = "usuario_id"),
    @Index(name = "idx_receptor", columnList = "receptor_id"),
    @Index(name = "idx_usuario_tipo", columnList = "usuario_id, tipo_usuario"),
    @Index(name = "idx_usuario_receptor", columnList = "usuario_id, receptor_id")
  }
)
public class Likes extends ValoracionConexion {
}
