package com.bearfrens.backend.entity.valoracione_conexiones;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(
  name = "likes",
  indexes = {
    @Index(name = "idx_emisor", columnList = "emisor_id"),
    @Index(name = "idx_usuarior", columnList = "usuario_id"),
    @Index(name = "idx_usuario_tipo", columnList = "emisor_id, tipo_usuario"),
    @Index(name = "idx_emisor_usuario", columnList = "emisor_id, usuario_id")
  }
)
public class Likes extends ValoracionConexion {
}
