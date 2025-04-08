package com.bearfrens.backend.service.authentication;

import com.bearfrens.backend.entity.user.Anfitrion;
import com.bearfrens.backend.entity.user.Viajero;
import com.bearfrens.backend.repository.user.AnfitrionRepository;
import com.bearfrens.backend.repository.user.ViajeroRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

@Service
public class AuthService {

  @Autowired
  private ViajeroRepository viajeroRepository;

  @Autowired
  private AnfitrionRepository anfitrionRepository;

  /**
   * Dado un email, busca al usuario correspondiente
   * @param email String del email del usuario
   * @return Map {tipo, usuario} si lo encuentra, en otro caso null
   */
  public ResponseEntity<Map<String, Object>> obtenerUsuario(String email){
    Anfitrion anfitrion = anfitrionRepository.findByEmail(email).orElse(null);

    Map<String, Object> response = new HashMap<>();
    if(anfitrion != null){
      // TODO: RESTO DEL CODIGO PARA ANFITRIÓN
      response.put("tipo", "anfitrion");
      response.put("usuario", anfitrion);
      return ResponseEntity.ok(response);
    }

    // Si es null, buscar en viajero
    Viajero viajero = viajeroRepository.findByEmail(email).orElse(null);

    if(viajero != null){
      // TODO: RESTO DEL CÓDIGO PARA VIAJERO
      response.put("tipo", "viajero");
      response.put("usuario", viajero);
      return ResponseEntity.ok(response);
    }

    // SI ES NULL PARA AMBOS, RETORNAR ERROR
    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
  }
}
