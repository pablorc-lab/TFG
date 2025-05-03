package com.bearfrens.backend.service.valoraciones_conexiones;

import com.bearfrens.backend.entity.valoracione_conexiones.Valoraciones;
import com.bearfrens.backend.repository.matches.MatchesRepository;
import com.bearfrens.backend.repository.valoraciones_conexiones.ValoracionesRepository;
import com.bearfrens.backend.service.GestorUsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ValoracionesService extends ValoracionesConexionesService<Valoraciones> {
  public ValoracionesService(GestorUsuarioService gestorUsuarioService, ValoracionesRepository valoracionesRepository, MatchesRepository matchesRepository) {
    super(gestorUsuarioService, valoracionesRepository, matchesRepository);
  }

  @Autowired
  private GestorUsuarioService gestorUsuarioService;

  @Autowired
  private ValoracionesRepository valoracionesRepository;

  /**
   * Obtener la lista de tipo <T> dados por un usuario de una lista de receptores
   * @param tipo_usuario Tipo de usuario emisor en String (se convierte al del receptor)
   * @param usuarioID ID del usuario emisor
   * @param receptores ID de los usuarios a buscar
   * @return Lista de likes
   */
  public Map<Long, Boolean> obtenerValoracionEnviadasAUsuarios(Long usuarioID, String tipo_usuario, List<Long> receptores) {
    int tipo = gestorUsuarioService.intTipoUsuario(tipo_usuario);

    // Buscar todas las valoraciones enviadas por el usuario
    List<Valoraciones> valoraciones = valoracionesRepository.findAllByEmisorIDAndTipoUsuario(usuarioID, tipo == 1 ? 2 : 1);

    // Crear un mapa que almacene el ID del receptor y un valor booleano indicando si ha sido valorado
    Map<Long, Boolean> valoracionesMap = new HashMap<>();

    // Inicializar el mapa con false (no valorado) para cada receptor
    for (Long receptorID : receptores) {
      valoracionesMap.put(receptorID, false);
    }

    // Recorrer las valoraciones y actualizar el mapa con true donde haya valoraciones
    for (Valoraciones valoracion : valoraciones) {
      Long receptorID = valoracion.getUsuarioID();
      if (valoracionesMap.containsKey(receptorID)) {
        valoracionesMap.put(receptorID, true);
      }
    }

    return valoracionesMap;
  }
}
