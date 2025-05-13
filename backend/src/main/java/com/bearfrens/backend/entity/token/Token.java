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
  public Long id;

  @Column(unique = true)
  public String token;

  @Enumerated(EnumType.STRING)
  public TokenType tokenType = TokenType.BEARER;

  public boolean revoked;

  public boolean expired;

  @Column(nullable = false)
  public Long userID;

  @Column(name = "tipo_usuario", nullable = false)
  public int tipoUsuario; // 0: Admin, 1 : Anfitrión, 2 : Viajero
}
