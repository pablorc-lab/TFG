package com.bearfrens.backend.service.valoraciones_conexiones;

import com.bearfrens.backend.entity.valoracione_conexiones.Likes;
import com.bearfrens.backend.repository.matches.MatchesRepository;
import com.bearfrens.backend.repository.valoraciones_conexiones.LikesRepository;
import com.bearfrens.backend.repository.valoraciones_conexiones.ValoracionesConexionesRepository;
import com.bearfrens.backend.service.GestorUsuarioService;
import org.springframework.stereotype.Service;

@Service
public class LikesService extends ValoracionesConexionesService<Likes>{
  public LikesService(GestorUsuarioService gestorUsuarioService, LikesRepository likesRepository, MatchesRepository matchesRepository) {
    super(gestorUsuarioService, likesRepository, matchesRepository);
  }
}
