package com.bearfrens.backend.repository.valoraciones_conexiones;

import com.bearfrens.backend.entity.valoracione_conexiones.Likes;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LikesRepository extends ValoracionesConexionesRepository<Likes> {
  // Devolver el número de likes enviados
  int countByEmisorIDAndTipoUsuario(Long emisorID, int tipoUsuario);
  List<Likes> findAllByOrderByFechaDesc();
}
