package com.bearfrens.backend.controller.authentication;

import com.bearfrens.backend.request.LoginRequest;
import com.bearfrens.backend.service.authentication.AuthService;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@NoArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/auth")
public class AuthController {

  @Autowired
  private AuthService authService;

  /**
   * Obtiene el JSON con el tipo de usuario y un objeto con el mismo
   * @return Respueta HTTP con un token JWT y el estado de autenticación
   */
  @PostMapping("/login")
  public ResponseEntity<Map<String, Object>> login(@RequestBody LoginRequest loginRequest) {
    return authService.login(loginRequest);
  }

  /**
   * Logeria a un usuario admin
   * @return Respueta HTTP con un token JWT y el estado de autenticación
   */
  @PostMapping("/login-admin")
  public ResponseEntity<Map<String, Object>> loginAdmin(@RequestBody LoginRequest loginRequest) {
    return authService.loginAdmin(loginRequest);
  }


  /**
   * Verifica si una contrasenia es correcta o no
   * @return Respueta booleana
   */
  @PostMapping("/verify/{userType}")
  public Boolean verify(@PathVariable String userType, @RequestBody LoginRequest loginRequest) {
    return authService.verify(userType, loginRequest);
  }

  /**
   * Endpoint para refrescar el token JWT del usuario.
   * Este método recibe el token actual en la cabecera Authorization, lo valida
   * y, si es válido y no está revocado o expirado, genera un nuevo token JWT.
   *
   * @param authHeader Cabecera Authorization que contiene el token actual (Bearer <token>)
   * @return ResponseEntity con un nuevo token JWT.
   */
  @PostMapping("/refresh")
  public ResponseEntity<Map<String, Object>> refreshToken(@RequestHeader(HttpHeaders.AUTHORIZATION) final String authHeader) {
    return authService.refreshToken(authHeader);
  }
}
