package com.bearfrens.backend.request;

import lombok.Getter;

// Información usada en el inicio de sesión
@Getter
public class LoginRequest {
  private String email;
  private String password;
}