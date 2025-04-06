package com.bearfrens.backend.service;

import com.bearfrens.backend.repository.user.AnfitrionRepository;
import com.bearfrens.backend.repository.user.ViajeroRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

// Encapsula la lógica de negocio (verificación de email)
@Service
public class UsuarioService {

  @Autowired
  private ViajeroRepository viajeroRepository;

  @Autowired
  private AnfitrionRepository anfitrionRepository;

  public boolean existsByEmail(String email){
    return viajeroRepository.existsByEmail(email) || anfitrionRepository.existsByEmail(email);
  }
}
