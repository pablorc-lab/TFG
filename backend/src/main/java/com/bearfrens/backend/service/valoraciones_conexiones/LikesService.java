package com.bearfrens.backend.service.valoraciones_conexiones;

import com.bearfrens.backend.entity.valoracione_conexiones.Likes;
import com.bearfrens.backend.repository.matches.MatchesRepository;
import com.bearfrens.backend.repository.valoraciones_conexiones.LikesRepository;
import com.bearfrens.backend.service.GestorUsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class LikesService extends ValoracionesConexionesService<Likes>{
  @Autowired
  private GestorUsuarioService gestorUsuarioService;

  @Autowired
  private LikesRepository likesRepository;

  public LikesService(GestorUsuarioService gestorUsuarioService, LikesRepository likesRepository, MatchesRepository matchesRepository) {
    super(gestorUsuarioService, likesRepository, matchesRepository);
  }

  public boolean haDadoLike(String tipoUsuarioEmisor, Long emisorID, Long receptorID) {
    int tipoReceptor = gestorUsuarioService.intTipoUsuario(tipoUsuarioEmisor) == 1 ? 2 : 1;
    return likesRepository.findByEmisorIDAndUsuarioIDAndTipoUsuario(emisorID, receptorID, tipoReceptor).isPresent();
  }

  public int contarLikes(String tipoUsuarioEmisor, Long emisorID){
    int tipoReceptor = gestorUsuarioService.intTipoUsuario(tipoUsuarioEmisor) == 1 ? 2 : 1;
    return likesRepository.countByEmisorIDAndTipoUsuario(emisorID, tipoReceptor);
  }
}
