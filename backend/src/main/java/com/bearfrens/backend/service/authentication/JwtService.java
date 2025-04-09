package com.bearfrens.backend.service.authentication;

import com.bearfrens.backend.entity.user.Anfitrion;
import com.bearfrens.backend.entity.user.Viajero;
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
   * Crea un token para un anfitrión
   * @param anfitrion Objeto del Anfitrión
   * @return Token para el anfitrión
   */
  public String generateTokenAnfitrion(Anfitrion anfitrion) {
    return buildTokenAnfitrion(anfitrion, jwtExpiration);
  }

  /**
   * Crea un token refresh para un anfitrión
   * @param anfitrion Objeto del Anfitrión
   * @return Token para el anfitrión
   */
  public String generateRefreshTokenAnfitrion(Anfitrion anfitrion) {
    return buildTokenAnfitrion(anfitrion, refreshExpiration);
  }

  /**
   * Genera un token para un Anfitrion
   * @param anfitrion Objeto del Anfitrión
   * @param expiration Tiempo de expiracíón desde la emisión
   * @return Token Jwts
   */
  private String buildTokenAnfitrion(Anfitrion anfitrion, final long expiration) {
    return Jwts.builder()
      .id("Anfitrión-"+anfitrion.getId()) // ID único para el token
      .claims(Map.of("nombre", anfitrion.getNombre())) // Agregar el nombre como claim
      .subject(anfitrion.getEmail()) // El email como el sujeto del token
      .issuedAt(new Date(System.currentTimeMillis())) // Fecha de emisión del token
      .expiration(new Date(System.currentTimeMillis() + expiration)) // Fecha de expiración del token
      .signWith(getSignInKey())  // Firmar el token con la clave secreta
      .compact(); // Generar y devolver el token JWT
  }

  /**
   * Crea un token para un viajero
   * @param viajero Objeto del viajero
   * @return Token para el viajero
   */
  public String generateTokenViajero(Viajero viajero) {
    return buildTokenViajero(viajero, jwtExpiration);
  }

  /**
   * Crea un token refresh para un viajero
   * @param viajero Objeto del viajero
   * @return Token para el viajero
   */
  public String generateRefreshTokenViajero(Viajero viajero) {
    return buildTokenViajero(viajero, refreshExpiration);
  }

  /**
   * Genera un token para un Viajero
   * @param viajero Objeto del Viajero
   * @param expiration Tiempo de expiracíón desde la emisión
   * @return Token Jwts
   */
  private String buildTokenViajero(Viajero viajero, final long expiration) {
    return Jwts.builder()
      .id("Viajero-" + viajero.getId())
      .claims(Map.of("nombre", viajero.getNombre()))
      .subject(viajero.getEmail())
      .issuedAt(new Date(System.currentTimeMillis()))
      .expiration(new Date(System.currentTimeMillis() + expiration))
      .signWith(getSignInKey())
      .compact();
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
