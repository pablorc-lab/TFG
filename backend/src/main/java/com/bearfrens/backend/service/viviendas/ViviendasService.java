package com.bearfrens.backend.service.viviendas;

import com.bearfrens.backend.entity.user.Anfitrion;
import com.bearfrens.backend.entity.viviendas.Viviendas;
import com.bearfrens.backend.exception.ResourceNotFoundException;
import com.bearfrens.backend.repository.user.AnfitrionRepository;
import com.bearfrens.backend.repository.viviendas.ViviendasRepository;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Map;

@Service
@AllArgsConstructor
public class ViviendasService {

  private final ViviendasRepository viviendasRepository;
  private final AnfitrionRepository anfitrionRepository;

  /**
   * Obtiene la vivienda de un anfitrión.
   * @param anfitrionID ID del anfitrión
   * @return La vivienda si existe, o un mensaje de error si no tiene una asociada.
   */
  public ResponseEntity<?> obtenerVivienda(Long anfitrionID) {
    Anfitrion anfitrion = anfitrionRepository.findById(anfitrionID)
      .orElseThrow(() -> new ResourceNotFoundException("El anfitrion con ese ID no existe : " + anfitrionID));

    Viviendas vivienda = anfitrion.getVivienda();
    return (vivienda == null)
      ? ResponseEntity.status(HttpStatus.NOT_FOUND).body("La vivienda asociada al anfitrión no existe")
      : ResponseEntity.ok(vivienda);
  }

  /**
   * Obtiene la lista de anfitriones según la ubicación de su vivienda.
   * @param ciudad Nombre de la ciudad
   * @param provincia Nombre de la provincia
   * @return Lista de anfitriones que tienen viviendas en la ubicación especificada.
   */
  public ResponseEntity<?> listarViviendasPorDatos(String ciudad, String provincia) {
    List<Viviendas> viviendas = viviendasRepository.findAllByCiudadAndProvincia(ciudad, provincia);
    List<Anfitrion> anfitriones = viviendas.stream().map(Viviendas::getAnfitrion).toList();
    return ResponseEntity.ok(anfitriones);
  }

  /**
   * Crea una vivienda para un anfitrión.
   * @param anfitrionID ID del anfitrión
   * @param vivienda Datos de la vivienda a crear
   * @return La vivienda creada o un mensaje de error si el anfitrión ya tiene una.
   */
  public ResponseEntity<?> crearVivienda(Long anfitrionID, Viviendas vivienda) {
    Anfitrion anfitrion = anfitrionRepository.findById(anfitrionID)
      .orElseThrow(() -> new ResourceNotFoundException("El anfitrion con ese ID no existe : " + anfitrionID));

    if(anfitrion.getVivienda() != null){
      return ResponseEntity.status(HttpStatus.CONFLICT).body("Ya existe una vivienda asociada al anfitrión, solo puede modificarla");
    }

    vivienda.setAnfitrion(anfitrion);
    Viviendas nuevaVivienda = viviendasRepository.save(vivienda);
    return ResponseEntity.status(HttpStatus.CREATED).body(nuevaVivienda);
  }

  /**
   * Edita la vivienda de un anfitrión.
   * @param anfitrionID ID del anfitrión
   * @param infoVivienda Nuevos datos de la vivienda
   * @return La vivienda actualizada o un mensaje de error si no tiene una asociada.
   */
  public ResponseEntity<?> editarVivienda(Long anfitrionID, Viviendas infoVivienda) {
    Anfitrion anfitrion = anfitrionRepository.findById(anfitrionID)
      .orElseThrow(() -> new ResourceNotFoundException("El anfitrion con ese ID no existe : " + anfitrionID));

    Viviendas vivienda = anfitrion.getVivienda();

    if(vivienda == null){
      return ResponseEntity.status(HttpStatus.CONFLICT).body("El anfitrión no tiene una vivienda asociada, créala primero.");
    }

    vivienda.setImagen1(infoVivienda.getImagen1());
    vivienda.setImagen2(infoVivienda.getImagen2());
    vivienda.setImagen3(infoVivienda.getImagen3());
    vivienda.setImagen4(infoVivienda.getImagen4());
    vivienda.setViajeros(infoVivienda.getViajeros());
    vivienda.setHabitaciones(infoVivienda.getHabitaciones());
    vivienda.setCamas(infoVivienda.getCamas());
    vivienda.setBanios(infoVivienda.getBanios());
    vivienda.setProvincia(infoVivienda.getProvincia());
    vivienda.setCiudad(infoVivienda.getCiudad());
    vivienda.setPrecio_noche(infoVivienda.getPrecio_noche());

    Viviendas viviendaActualizada = viviendasRepository.save(vivienda);
    return ResponseEntity.ok(viviendaActualizada);
  }

  /**
   * Elimina una vivienda
   * @param anfitrionID ID del anfitrion
   * @return Map indicando si se ha eliminado la vivienda
   */
  public ResponseEntity<Map<String, Boolean>> eliminarVivienda(Long anfitrionID) {
    Anfitrion anfitrion = anfitrionRepository.findById(anfitrionID)
      .orElseThrow(() -> new ResourceNotFoundException("El anfitrion con ese ID no existe : " + anfitrionID));

    Viviendas vivienda = anfitrion.getVivienda();

    if (vivienda == null) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Collections.singletonMap("error", false));
    }

    // Desvincular simplemente la vivienda del anfitrión antes de eliminarla
    anfitrion.setVivienda(null);
    anfitrionRepository.save(anfitrion);
    return ResponseEntity.ok(Collections.singletonMap("delete", true));
  }
}

