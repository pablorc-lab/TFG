package com.bearfrens.backend.service.authentication;

import com.bearfrens.backend.entity.contenido.Contenido;
import com.bearfrens.backend.entity.token.Token;
import com.bearfrens.backend.entity.user.Anfitrion;
import com.bearfrens.backend.entity.user.Usuario;
import com.bearfrens.backend.entity.user.Viajero;
import com.bearfrens.backend.repository.token.TokenRepository;
import com.bearfrens.backend.repository.user.AnfitrionRepository;
import com.bearfrens.backend.repository.user.ViajeroRepository;
import com.bearfrens.backend.request.LoginRequest;
import com.bearfrens.backend.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.*;

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

  @Value("${ADMIN_EMAIL}")
  private String adminEmail;

  @Value("${ADMIN_PASSWORD}")
  private String adminPassword;

  /**
   * Guarda un token para el administrador en la base de datos.
   *
   * @param adminEmail El correo electrónico del administrador (aunque no lo utilizamos directamente en este método, es parte del flujo)
   * @param jwtToken El token JWT generado para el administrador
   * @param refresh_token El refresh token generado para el administrador
   * @return Respuesta con los tokens generados (acceso y refresh) para el administrador
   */
  private ResponseEntity<Map<String, Object>> guardarTokenAdmin(String adminEmail, String jwtToken, String refresh_token) {
    Token token = new Token();

    // Crear el token para el admin (tipo 0)
    token.setToken(jwtToken);
    token.setTokenType(Token.TokenType.BEARER);
    token.setRevoked(false);
    token.setExpired(false);
    token.setUserID(0L);  // El admin no tiene un ID de usuario asociado
    token.setTipoUsuario(0);  // 0 representa el tipo Admin

    this.revokeAllUserToken(null, 0); // Solo un admin logeado a la vez
    tokenRepository.save(token);

    Map<String, Object> tokenResponse = new HashMap<>();
    tokenResponse.put("User", "Admin (0)");
    tokenResponse.put("acces_token", jwtToken);
    tokenResponse.put("refresh_token", refresh_token);

    return ResponseEntity.status(HttpStatus.ACCEPTED).body(tokenResponse);
  }


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
    tokenRepository.save(token);

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
   * Realiza el login para un admin
   *
   * @param loginRequest Información del login
   * @return Respuesta con el token
   */
  public ResponseEntity<Map<String, Object>> loginAdmin(LoginRequest loginRequest) {
    if(!adminPassword.equals(loginRequest.getPassword()) || !adminEmail.equals(loginRequest.getEmail())) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Collections.singletonMap("Error","Admin incorrecto"));
    }

    // Generar el token para el admin si las credenciales son las mismas
    String jwtToken = jwtService.generateAdminToken(loginRequest.getEmail());
    String refresh_token = jwtService.generateAdminRefreshToken(loginRequest.getEmail());

    return this.guardarTokenAdmin(adminEmail, jwtToken, refresh_token);
  }

  /**
   * Actualiza un token de acceso para el administrador
   *
   * @param authHeader Cabecera con la autorización del token
   * @return ResponseEntity con un nuevo token JWT para el administrador.
   */
  public ResponseEntity<Map<String, Object>> refreshTokenAdmin(final String authHeader) {
    if (authHeader == null || !authHeader.startsWith("Bearer ")) {
      throw new IllegalArgumentException("Invalid Bearer token");
    }

    final String refreshToken = authHeader.substring(7);
    final String tokenAdminEmail = jwtService.extractUsername(refreshToken);  // Extraemos el email del admin desde el token

    if (adminEmail == null || !adminEmail.equals(tokenAdminEmail)) {
      throw new IllegalArgumentException("Invalid Refresh token");
    }

    // Verificar si el token es válido para el admin
    if (!jwtService.isAdminTokenValid(refreshToken, tokenAdminEmail)) {
      throw new IllegalArgumentException("Invalid Refresh token");
    }

    // Generar nuevos tokens para el admin
    final String accesToken = jwtService.generateAdminToken(adminEmail);
    final String newRefreshToken = jwtService.generateAdminRefreshToken(adminEmail);

    // Guardar los nuevos tokens en la base de datos
    return guardarTokenAdmin(adminEmail, accesToken, newRefreshToken);
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
   * @param userType Tipo de usuario que devuelve el token
   * @param loginRequest Información del login
   * @return Booleano
   */
  public Boolean verify(String userType, LoginRequest loginRequest) {
    if(userType.equals("Anfitrion (1)")){
      Optional<Anfitrion> anfitrion = anfitrionRepository.findByEmail(loginRequest.getEmail());
      return anfitrion.filter(user -> decoder.matches(loginRequest.getPassword(), user.getPassword())).isPresent();
    }

    Optional<Viajero> viajero = viajeroRepository.findByEmail(loginRequest.getEmail());
    return viajero.filter(user -> decoder.matches(loginRequest.getPassword(), user.getPassword())).isPresent();
  }
}
