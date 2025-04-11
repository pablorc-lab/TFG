package com.bearfrens.backend.service;

import com.bearfrens.backend.entity.user.Anfitrion;
import com.bearfrens.backend.entity.user.Usuario;
import com.bearfrens.backend.entity.user.Viajero;
import com.bearfrens.backend.exception.ResourceNotFoundException;
import com.bearfrens.backend.repository.user.AnfitrionRepository;
import com.bearfrens.backend.repository.user.ViajeroRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

// Encapsula la lógica de negocio (verificación de email)
@Service
@Transactional
public class UsuarioService {

  @Autowired
  private ViajeroRepository viajeroRepository;

  @Autowired
  private AnfitrionRepository anfitrionRepository;

  public boolean existsByEmail(String email){
    return viajeroRepository.existsByEmail(email) || anfitrionRepository.existsByEmail(email);
  }

  public Usuario<?> findByEmail(String email) {
    Viajero viajero = viajeroRepository.findByEmail(email).orElse(null);
    if (viajero != null) return viajero;

    return anfitrionRepository.findByEmail(email).
      orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));
  }

}
