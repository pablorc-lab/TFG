package com.bearfrens.backend.service.valoraciones_conexiones;

import com.bearfrens.backend.entity.valoracione_conexiones.Valoraciones;
import com.bearfrens.backend.repository.matches.MatchesRepository;
import com.bearfrens.backend.repository.valoraciones_conexiones.ValoracionesRepository;
import com.bearfrens.backend.service.GestorUsuarioService;
import org.springframework.stereotype.Service;

@Service
public class ValoracionesService extends ValoracionesConexionesService<Valoraciones> {
  public ValoracionesService(GestorUsuarioService gestorUsuarioService, ValoracionesRepository valoracionesRepository, MatchesRepository matchesRepository) {
    super(gestorUsuarioService, valoracionesRepository, matchesRepository);
  }
}
