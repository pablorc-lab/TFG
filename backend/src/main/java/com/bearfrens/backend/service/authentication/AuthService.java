package com.bearfrens.backend.service.authentication;

import com.bearfrens.backend.entity.token.Token;
import com.bearfrens.backend.entity.user.Anfitrion;
import com.bearfrens.backend.entity.user.Usuario;
import com.bearfrens.backend.repository.token.TokenRepository;
import com.bearfrens.backend.repository.user.AnfitrionRepository;
import com.bearfrens.backend.repository.user.ViajeroRepository;
import com.bearfrens.backend.request.LoginRequest;
import com.bearfrens.backend.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service

public class AuthService {
  private static final BCryptPasswordEncoder decoder = new BCryptPasswordEncoder();

  @Autowired
  private ViajeroRepository viajeroRepository;

  @Autowired
  private AnfitrionRepository anfitrionRepository;

  @Autowired
  private TokenRepository tokenRepository;

  @Autowired
  private JwtService jwtService;

  @Autowired
  private AuthenticationManager authenticationManager;

  @Autowired
  private UsuarioService usuarioService;

  /**
   * Guarda un token en la BD dado el ID y tipo de usuario
   *
   * @param userID ID del usuario
   * @param tipo_usuario Tipo del usuario
   * @param jwtToken TOken generado
   * @param refresh_token Refresh token generado
   * @return Respueta acceptada con los valores del token
   */
  private ResponseEntity<Map<String, Object>> guardarToken(Long userID, int tipo_usuario, String jwtToken, String refresh_token){
    Token token = new Token();

    // Crear un token con el nombre, contraseña y tipo de usuario
    token.setToken(jwtToken);
    token.setTokenType(Token.TokenType.BEARER);
    token.setRevoked(false);
    token.setExpired(false);
    token.setUserID(userID);
    token.setTipoUsuario(tipo_usuario);

    this.revokeAllUserToken(userID, tipo_usuario); // Solo 1 cliente logeado a la vez
    //tokenRepository.save(token);

    Map<String, Object> tokenResponse = new HashMap<>();
    tokenResponse.put("User", tipo_usuario == 1 ? "Anfitrion (1)" : "Viajero (2)");
    tokenResponse.put("acces_token", jwtToken);
    tokenResponse.put("refresh_token", refresh_token);

    return ResponseEntity.status(HttpStatus.ACCEPTED).body(tokenResponse);
  }


  /**
   * Procesa la autenticación de un usuario
   *
   * @param usuario Objeto usuariio
   * @param tipo_usuario Tipo de usuario que lo envia
   * @param loginRequest Información del login (email y contraseña)
   * @return Respues con el usuario, token y refresh token.
   */
  private ResponseEntity<Map<String, Object>> procesarAutenticacion(Usuario<?> usuario, int tipo_usuario, LoginRequest loginRequest) {
    if(!decoder.matches(loginRequest.getPassword(), usuario.getPassword())) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Collections.singletonMap("Error","Contraseña incorrecta"));
    }

    // Autenticar antes de nada, el usuario
    authenticationManager.authenticate(
      new UsernamePasswordAuthenticationToken(
        loginRequest.getEmail(),
        loginRequest.getPassword()
      ));

    String jwtToken = jwtService.generateToken(usuario, tipo_usuario);
    String refresh_token = jwtService.generateRefreshToken(usuario, tipo_usuario);

    return this.guardarToken(usuario.getId(), tipo_usuario, jwtToken, refresh_token);
  }


  /**
   * Marcar todos los tokens de un usuario como inactivos
   * @param userID ID del usuario
   * @param tipo_usuario Tipo del usuario
   */
  private void revokeAllUserToken(Long userID, int tipo_usuario){
    final List<Token> validUserTokens = tokenRepository.findExpiredIsFalseOrRevokedIsFalseByUserIDAndTipoUsuario(userID, tipo_usuario);

    if(!validUserTokens.isEmpty()){
      for(final Token token : validUserTokens){
        token.setExpired(true);
        token.setRevoked(true);
      }
      tokenRepository.saveAll(validUserTokens);
    }
  }

  /**
   * Realiza el login
   *
   * @param loginRequest Información del login
   * @return Respuesta con el token
   */
  public ResponseEntity<Map<String, Object>> login(LoginRequest loginRequest) {
    Usuario<?> usuario = usuarioService.findByEmail(loginRequest.getEmail());

    // Comprobar primero que el usuario exista
    if (usuario == null) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Collections.singletonMap("Error", "Usuario no encontrado"));
    }

    int tipo_usuario = usuario instanceof Anfitrion ? 1 : 2;

    // Retornar segun sea anfitrión o Viajero
    return this.procesarAutenticacion(usuario, tipo_usuario, loginRequest);
  }

  /**
   * Actualiza un token de acceso
   * @param authHeader Cabecera con la autorización del token
   * @return ResponseEntity con un nuevo token JWT.
   */
  public ResponseEntity<Map<String, Object>> refreshToken(final String authHeader){
    if (authHeader == null || !authHeader.startsWith("Bearer ")){
      throw new IllegalArgumentException("Invalid Bearer token");
    }

    final String refreshToken = authHeader.substring(7);
    final String userEmail = jwtService.extractUsername(refreshToken);

    if (userEmail == null){
      throw new IllegalArgumentException("Invalid Refresh token");
    }

    // Verificar si el token es valido
    final Usuario<?> usuario = usuarioService.findByEmail(userEmail);
    int tipo_usuario = usuario instanceof Anfitrion ? 1 : 2;
    if (!jwtService.isTokenValid(refreshToken, usuario)){
      throw new IllegalArgumentException("Invalid Refresh token");
    }

    final String accesToken = jwtService.generateToken(usuario, tipo_usuario);
    revokeAllUserToken(usuario.getId(), tipo_usuario);
    return guardarToken(usuario.getId(), tipo_usuario, accesToken, refreshToken);
  }

  /**
   * Verifica si una contraseña es correcta dado su email
   *
   * @param loginRequest Información del login
   * @return Booleano
   */
  public Boolean verify(LoginRequest loginRequest) {
    Usuario<?> usuario = usuarioService.findByEmail(loginRequest.getEmail());

    // Comprobar primero que el usuario exista
    if (usuario == null) {
      return false;
    }

    return(decoder.matches(loginRequest.getPassword(), usuario.getPassword()));
  }
}
