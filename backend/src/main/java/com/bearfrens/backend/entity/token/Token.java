package com.bearfrens.backend.entity.token;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Token {

  public enum TokenType{
    BEARER
  }

  @Id
  @GeneratedValue
  private Long id;

  @Column(unique = true)
  private String token;

  @Enumerated(EnumType.STRING)
  private TokenType tokenType = TokenType.BEARER;

  private boolean revoked;

  private boolean expired;

  @Column(nullable = false)
  private Long userID;

  @Column(name = "tipo_usuario", nullable = false)
  private int tipoUsuario; // 0: Admin, 1 : Anfitrión, 2 : Viajero
}
