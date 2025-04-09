package com.bearfrens.backend.controller.authentication;

import com.bearfrens.backend.entity.token.Token;
import com.bearfrens.backend.entity.user.Anfitrion;
import com.bearfrens.backend.entity.user.Viajero;
import com.bearfrens.backend.repository.token.TokenRepository;
import com.bearfrens.backend.service.authentication.AuthService;
import com.bearfrens.backend.service.authentication.JwtService;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

@NoArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/auth")
public class AuthController {

  // Información que se envia al iniciar sesión
  @Getter
  public static class LoginRequest {
    private String email;
    private String password;
  }

  @Autowired
  private AuthService authService;

  @Autowired
  private TokenRepository tokenRepository;

  @Autowired
  private JwtService jwtService;

  private static final BCryptPasswordEncoder decoder = new BCryptPasswordEncoder();

  /**
   * Obtiene el JSON con el tipo de usuario y un objeto con el mismo
   * @return Respueta HTTP con un token JWT y el estado de autenticación
   */
  @PostMapping("/login")
  public ResponseEntity<Map<String, Object>> login(@RequestBody LoginRequest loginRequest) {
    Map<String, Object> response = authService.obtenerUsuario(loginRequest.getEmail()).getBody();
    // Comprobar primero que el usuario exista
    if(response == null){
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Collections.singletonMap("Error","Usuario no encontrado"));
    }

    Map<String, Object> tokenResponse = new HashMap<>();
    String tipo = (String) response.get("tipo");
    boolean passwordMatches = false;
    Token token = new Token();

    // Si es anfitrión verificar su contraseña
    if(tipo.equals("anfitrion")){

      Anfitrion anfitrion = (Anfitrion) response.get("usuario");
      passwordMatches = decoder.matches(loginRequest.getPassword(), anfitrion.getPassword());

      // Crear un token con el nombre, contraseña y tipo de usuario
      if(!passwordMatches) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Collections.singletonMap("Error","Contraseña incorrecta"));
      }

      String jwtToken = jwtService.generateTokenAnfitrion(anfitrion);
      String refresh_token = jwtService.generateRefreshTokenAnfitrion(anfitrion);

      token.setToken(jwtToken);
      token.setRevoked(false);
      token.setExpired(false);
      token.setUserID(anfitrion.getId());
      token.setTipo_usuario(1);
      //tokenRepository.save(token);

      tokenResponse.put("User", "Anfitrion (1)");
      tokenResponse.put("acces_token", jwtToken);
      tokenResponse.put("refresh_token", refresh_token);

      return ResponseEntity.status(HttpStatus.ACCEPTED).body(tokenResponse);
    }

    // Si es viajero
    Viajero viajero = (Viajero) response.get("usuario");
    passwordMatches = decoder.matches(loginRequest.getPassword(), viajero.getPassword());
    if(!passwordMatches) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Collections.singletonMap("Error","Contraseña incorrecta"));
    }

    String jwtToken = jwtService.generateTokenViajero(viajero);
    String refresh_token = jwtService.generateRefreshTokenViajero(viajero);

    token.setToken(jwtToken);
    token.setRevoked(false);
    token.setExpired(false);
    token.setUserID(viajero.getId());
    token.setTipo_usuario(2);
    //tokenRepository.save(token);

    tokenResponse.put("User", "Viajero (2)");
    tokenResponse.put("acces_token", jwtToken);
    tokenResponse.put("refresh_token", refresh_token);
    return ResponseEntity.status(HttpStatus.ACCEPTED).body(tokenResponse);
  }
}
