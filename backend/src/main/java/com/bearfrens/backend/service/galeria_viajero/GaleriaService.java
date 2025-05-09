package com.bearfrens.backend.service.galeria_viajero;

import com.bearfrens.backend.entity.user.Viajero;
import com.bearfrens.backend.exception.ResourceNotFoundException;
import com.bearfrens.backend.repository.user.ViajeroRepository;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@AllArgsConstructor
public class GaleriaService {
  private final ViajeroRepository viajeroRepository;


  /**
   * Obtiene las imágenes de la galería personal de un viajero.
   * @param viajeroID ID del viajero
   * @return Un mapa con las imágenes o un mensaje de error si el viajero no existe
   */
  public ResponseEntity<?> obtenerGaleria(Long viajeroID) {
    Viajero viajero = viajeroRepository.findById(viajeroID)
      .orElseThrow(() -> new ResourceNotFoundException("El viajero con ese ID no existe: " + viajeroID));

    Map<String, String> galeria = Map.of(
      "imagen1", viajero.getImagen1(),
      "imagen2", viajero.getImagen2(),
      "imagen3", viajero.getImagen3(),
      "imagen4", viajero.getImagen4()
    );

    return ResponseEntity.ok(galeria);
  }

  /**
   * Crea las imágenes de la galería personal de un viajero.
   * @param viajeroID ID único del viajero al que se le creará la galería de imágenes.
   * @param infoGaleria Objeto Viajero que contiene las imágenes para agregar a la galería.
   * @return El viajero con la nueva galería creada o un mensaje de error si no existe.
   */
  public ResponseEntity<?> crearGaleria(Long viajeroID, Viajero infoGaleria) {
    // Buscar el viajero por su ID
    Viajero viajero = viajeroRepository.findById(viajeroID)
      .orElseThrow(() -> new ResourceNotFoundException("El viajero con ese ID no existe: " + viajeroID));

    // Crear la galería de imágenes para el viajero
    viajero.setImagen1(infoGaleria.getImagen1());
    viajero.setImagen2(infoGaleria.getImagen2());
    viajero.setImagen3(infoGaleria.getImagen3());
    viajero.setImagen4(infoGaleria.getImagen4());

    // Guardar el viajero con la nueva galería de imágenes
    Viajero nuevoViajero = viajeroRepository.save(viajero);

    // Devolver el viajero con la galería de imágenes creada
    return ResponseEntity.status(HttpStatus.CREATED).body(nuevoViajero);
  }


  /**
   * Edita las imágenes de la galería personal de un viajero.
   * @param viajeroID ID del viajero
   * @param infoGaleria Objeto Viajero con los nuevos datos de las imágenes
   * @return El viajero actualizado con las nuevas imágenes o un mensaje de error si no existe
   */
  public ResponseEntity<?> editarGaleria(Long viajeroID, Viajero infoGaleria) {
    Viajero viajero = viajeroRepository.findById(viajeroID)
      .orElseThrow(() -> new ResourceNotFoundException("El viajero con ese ID no existe: " + viajeroID));

    viajero.setImagen1(infoGaleria.getImagen1());
    viajero.setImagen2(infoGaleria.getImagen2());
    viajero.setImagen3(infoGaleria.getImagen3());
    viajero.setImagen4(infoGaleria.getImagen4());

    Viajero actualizado = viajeroRepository.save(viajero);
    return ResponseEntity.ok(actualizado);
  }

}
