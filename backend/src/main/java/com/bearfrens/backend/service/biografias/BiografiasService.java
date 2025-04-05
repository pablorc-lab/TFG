package com.bearfrens.backend.service.biografias;

import com.bearfrens.backend.entity.biografias.Biografias;
import com.bearfrens.backend.exception.ResourceNotFoundException;
import com.bearfrens.backend.repository.biografias.BiografiasRepository;
import com.bearfrens.backend.service.GestorUsuarioService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class BiografiasService {

  private final BiografiasRepository biografiasRepository;
  private final GestorUsuarioService gestorUsuarioService;

  /**
   * Devuelve todas las biografías dado un tipo de usuario
   * @param tipo_usuario Tipo de usuario
   * @return Lista de biografías
   */
  public List<Biografias> obtenerTodasBiografia(String tipo_usuario) {
    int tipo = gestorUsuarioService.intTipoUsuario(tipo_usuario);
    return biografiasRepository.findAllByTipoUsuario(tipo);
  }

  /**
   * Obtiene una biografia
   * @param tipo_usuario Tipo de usuario (anfitriones o viajeros)
   * @param usuarioID ID del usuario
   * @return Optional de una Biografia
   */
  public Optional<Biografias> obtenerBiografia(String tipo_usuario, Long usuarioID) {
    int tipo = gestorUsuarioService.intTipoUsuario(tipo_usuario);
    return biografiasRepository.findByUsuarioIDAndTipoUsuario(usuarioID, tipo);
  }

  /**
   * Crea una biografía
   * @param tipo_usuario Tipo de usuario (anfitriones o viajeros)
   * @param usuarioID ID del usuario
   * @param biografia Detalles de la biografía a modificar
   * @return El cuerpo de la biografía creadad
   */
  public Biografias crearBiografia(String tipo_usuario, Long usuarioID, Biografias biografia) {
    if (!gestorUsuarioService.existeUsuario(tipo_usuario, usuarioID)) {
      throw new IllegalArgumentException("El usuario asociado debe existir");
    }

    int tipo = gestorUsuarioService.intTipoUsuario(tipo_usuario);
    if (biografiasRepository.findByUsuarioIDAndTipoUsuario(usuarioID, tipo).isPresent()) {
      throw new IllegalStateException("El usuario ya tiene una biografía asociada, solo puede modificarla");
    }

    biografia.setUsuarioID(usuarioID);
    biografia.setTipoUsuario(tipo);
    return biografiasRepository.save(biografia);
  }

  /**
   * Actualiza una biografia YA EXISTENTE
   * @param tipo_usuario Tipo de usuario (anfitriones o viajeros)
   * @param usuarioID ID del usuario
   * @param detallesBiografia Detalles de la biografía a modificar
   * @return El cuerpo de la biografia modificada
   */
  public Biografias actualizarBiografia(String tipo_usuario, Long usuarioID, Biografias detallesBiografia) {
    if (!gestorUsuarioService.existeUsuario(tipo_usuario, usuarioID)) {
      throw new IllegalArgumentException("El usuario asociado debe existir");
    }

    int tipo = gestorUsuarioService.intTipoUsuario(tipo_usuario);
    Biografias biografia = biografiasRepository.findByUsuarioIDAndTipoUsuario(usuarioID, tipo)
      .orElseThrow(() -> new ResourceNotFoundException("No se encontró la biografía del usuario"));

    biografia.setSobreMi(detallesBiografia.getSobreMi());
    biografia.setIdiomas(detallesBiografia.getIdiomas());
    biografia.setDescripcionExtra(detallesBiografia.getDescripcionExtra());

    return biografiasRepository.save(biografia);
  }

  /**
   * Elimina una biografia asociada a un usuario y tipo
   * @param tipo_usuario Tipo de usuario (anfitriones o viajeros)
   * @param usuarioID ID del usuario
   * @return Booleano indicando si se ha eliminado o no
   */
  public boolean eliminarBiografia(String tipo_usuario, Long usuarioID) {
    if (!gestorUsuarioService.existeUsuario(tipo_usuario, usuarioID)) {
      return false;
    }

    int tipo = gestorUsuarioService.intTipoUsuario(tipo_usuario);
    Optional<Biografias> biografia = biografiasRepository.findByUsuarioIDAndTipoUsuario(usuarioID, tipo);
    if (biografia.isEmpty()) {
      return false;
    }

    biografiasRepository.delete(biografia.get());
    return true;
  }
}
