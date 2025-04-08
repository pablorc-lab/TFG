package com.bearfrens.backend.controller.authentication;

import com.bearfrens.backend.entity.user.Anfitrion;
import com.bearfrens.backend.entity.user.Viajero;
import com.bearfrens.backend.service.authentication.AuthService;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@NoArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/auth")
public class AuthController {

  @Getter
  public static class LoginRequest {
    // Información que se envia al iniciar sesión
    private String email;
    private String password;
  }

  @Autowired
  private AuthService authService;

  private static final BCryptPasswordEncoder decoder = new BCryptPasswordEncoder();

  /**
   * Obtiene el JSON con el tipo de usuario y un objeto con el mismo
   * @return Un token de inicio de sesión y el tipo de usuario
   */
  @PostMapping("/login")
  public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
    Map<String, Object> response = authService.obtenerUsuario(loginRequest.getEmail()).getBody();
    // Comprobar primero que el usuario exista
    if(response == null){
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No existe el usuario con el email : " + loginRequest.getEmail());
    }

    String tipo = (String) response.get("tipo");
    boolean passwordMatches = false;

    // Si es anfitrión verificar su contraseña
    if(tipo.equals("anfitrion")){

      Anfitrion anfitrion = (Anfitrion) response.get("usuario");
      passwordMatches = decoder.matches(loginRequest.getPassword(), anfitrion.getPassword());

      return ResponseEntity.ok("Match password : " + passwordMatches + "\nAnfitrión password : " + anfitrion.getPassword());
    }

    // Si es viajero
    Viajero viajero = (Viajero) response.get("usuario");
    passwordMatches = decoder.matches(loginRequest.getPassword(), viajero.getPassword());
    return ResponseEntity.ok("Match password : " + passwordMatches + "\nViajero password : " + viajero.getPassword());

  }
}
