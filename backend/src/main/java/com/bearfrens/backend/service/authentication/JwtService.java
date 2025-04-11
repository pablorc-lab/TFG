package com.bearfrens.backend.service.authentication;

import com.bearfrens.backend.entity.user.Usuario;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.Map;

@Service
public class JwtService {

  @Value("${JWT_SECRET_KEY}")
  private String secretKey;

  @Value("${JWT_EXPIRATION}")
  private long jwtExpiration;

  @Value("${JWT_REFRESH_EXPIRATION}")
  private long refreshExpiration;

  /**
   * Obtener la caducidad de un token
   * @param token String del token
   * @return Caducidad
   */
  public Date extractExpiration(final String token){
    final Claims jwtToken = Jwts.parser()
      .verifyWith(getSignInKey()) // Verificar con la clave
      .build() // Construir
      .parseSignedClaims(token) // Parsear el JWT
      .getPayload(); // Información que contiene el codigo

    return jwtToken.getExpiration();
  }

  /**
   * Obtener el email de un token
   * @param token Token a construir
   * @return Email
   */
  public String extractUsername(final String token){
    final Claims jwtToken = Jwts.parser()
      .verifyWith(getSignInKey()) // Verificar con la clave
      .build() // Construir
      .parseSignedClaims(token) // Parsear el JWT
      .getPayload(); // Información que contiene el codigo

    return jwtToken.getSubject();
  }

  /**
   * Genera un token
   * @param usuario Objeto usuario
   * @param tipo_usuario Int indicando el tipo de usuario (1 o 2)
   * @return Token generado
   */
  public String generateToken(Usuario<?> usuario, int tipo_usuario) {
    return buildToken(usuario, tipo_usuario, jwtExpiration);
  }

  /**
   * Genera un refresh token
   * @param usuario Objeto usuario
   * @param tipo_usuario Int indicando el tipo de usuario (1 o 2)
   * @return Token generado
   */
  public String generateRefreshToken(Usuario<?> usuario, int tipo_usuario) {
    return buildToken(usuario, tipo_usuario, refreshExpiration);
  }

  /**
   * Comprobar si un Token es valido
   * @param token String del token
   * @param usuario Usuario objeto
   * @return Booleano indicandolo
   */
  public boolean isTokenValid(final String token, Usuario<?> usuario){
    final  String username = extractUsername(token);
    boolean isTokenExpired = extractExpiration(token).before(new Date());
    return(username.equals((usuario.getEmail())) && !isTokenExpired);
  }

  /**
   * Construye el token de JWT
   * @param usuario Objeto usuario
   * @param tipo_usuario Int indicando el tipo de usuario (1 o 2)
   * @param expiration Tiempo que tarda en caducar el token
   * @return Token construido
   */
  private String buildToken(Usuario<?> usuario, int tipo_usuario, final long expiration) {
    return Jwts.builder()
      .id(String.valueOf(usuario.getId())) // ID para el token
      .claims(Map.of("nombre", usuario.getNombre(),"tipo", tipo_usuario == 1 ? "anfitrión" : "viajero")) // Agregar el nombre como claim
      .subject(usuario.getEmail()) // El email como el sujeto del token
      .issuedAt(new Date(System.currentTimeMillis())) // Fecha de emisión del token
      .expiration(new Date(System.currentTimeMillis() + expiration)) // Fecha de expiración del token
      .signWith(getSignInKey())  // Firmar el token con la clave secreta
      .compact(); // Generar y devolver el token JWT
  }


  /**
   * Este método obtiene la clave secreta para la firma de JWT.
   * La clave secreta se espera que esté en formato base64, y se convierte
   * a su representación binaria para ser utilizada en la firma.
   *
   * @return La clave secreta generada para la firma de JWT
   */
  private SecretKey getSignInKey() {
    // Decodifica la clave en formato base64 a un arreglo de bytes (clave en formato binario)
    byte[] keyBytes = Decoders.BASE64.decode(secretKey);

    // Crea y retorna una clave secreta adecuada para usar con el algoritmo HMAC-SHA,
    // que se utilizará para la firma del JWT
    return Keys.hmacShaKeyFor(keyBytes);
  }

}
