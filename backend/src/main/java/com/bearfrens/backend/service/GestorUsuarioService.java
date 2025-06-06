package com.bearfrens.backend.service;

import com.bearfrens.backend.entity.user.Anfitrion;
import com.bearfrens.backend.entity.user.Viajero;
import com.bearfrens.backend.repository.user.AnfitrionRepository;
import com.bearfrens.backend.repository.user.ViajeroRepository;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

// Esta clase se encarga de crear funcion comunes a otros controladore respecto
// la gestion del tipo de usuario o si ambos existen
@Service
@AllArgsConstructor
public class GestorUsuarioService {

  private final AnfitrionRepository anfitrionRepository;
  private final ViajeroRepository viajeroRepository;

  // FUNCIONES PARA AMBOS USUARIOS
  public Anfitrion obtenerAnfitrion(Long anfitrionID){
    return anfitrionRepository.findById(anfitrionID).orElse(null);
  }
  public Viajero obtenerViajero(Long viajeroID){
    return viajeroRepository.findById(viajeroID).orElse(null);
  }

  public Optional<Anfitrion> obtenerAnfitrionPorIDPrivado(String privateID){
    return anfitrionRepository.findByPrivateID(privateID);
  }

  public Optional<Viajero> obtenerViajeroPorIDPrivado(String privateID){
    return viajeroRepository.findByPrivateID(privateID);
  }

  public Optional<Anfitrion> obtenerAnfitrionPorEmail(String email){
    return anfitrionRepository.findByEmail(email);
  }

  public Optional<Viajero> obtenerViajeroPorEmail(String email){
    return viajeroRepository.findByEmail(email);
  }

  public List<Viajero> obtenerListaViajeros(List<Long> viajeros_IDs){
    return viajeroRepository.findAllByIdIn(viajeros_IDs);
  }

  // No es necesario comprobar si ya existe en la BD, ya que solo se usa cuando hay que modificar
  // campos de un usuario cuya existencia ya ha sido validada previamente.
  @Transactional
  public void guardarAnfitrion(Anfitrion anfitrion) {
    anfitrionRepository.save(anfitrion);
  }

  // No es necesario comprobar si ya existe en la BD, ya que solo se usa cuando hay que modificar
  // campos de un usuario cuya existencia ya ha sido validada previamente.
  @Transactional
  public void guardarViajero(Viajero viajero) {
    viajeroRepository.save(viajero);
  }

  /**
   * Transforma el string del tipo de usuario a su respectivo valor numérico
   * @param tipoUsuario Tipo del usuario en formato string
   * @return Valor entero del tipo de usuario
   */
  public int intTipoUsuario(String tipoUsuario) {
    return switch (tipoUsuario) {
      case "anfitriones" -> 1;
      case "viajeros" -> 2;
      default -> throw new IllegalArgumentException("Tipo de usuario inválido: " + tipoUsuario);
    };
  }

  /**
   * Comprobar que el tipo de usuario y el mismo, existan
   * @param tipoUsuario Tipo del usuario en formato string
   * @param userID Identificador único del usuario
   * @return Booleano con la existencia de usuario
   */
  public boolean existeUsuario(String tipoUsuario, Long userID){
    if (!"anfitriones".equals(tipoUsuario) && !"viajeros".equals(tipoUsuario)) {
      throw new IllegalArgumentException("Tipo de usuario inválido (Debe ser `anfitriones` o `viajeros`)");
    }

    // Comprobar que exista el usuario
    return ("anfitriones".equals(tipoUsuario))
      ? anfitrionRepository.existsById(userID) // Anfitrion
      : viajeroRepository.existsById(userID); // Viajero
  }


  /**
   * Comprobar que dos usuarios, emisor y receptor existan
   * @param tipoUsuarioEmisor Tipo del usuario en formato string
   * @param emisorID Identificador único del usuario emisor
   * @param receptorID Identificador único del receptor
   * @return Booleanos con la existencia de ambos tipos de usuario
   */
  public boolean NoExisteAmbosUsuario(String tipoUsuarioEmisor, Long emisorID, Long receptorID){
    if (!"anfitriones".equals(tipoUsuarioEmisor) && !"viajeros".equals(tipoUsuarioEmisor)) {
      throw new IllegalArgumentException("Tipo de usuario inválido (Debe ser `anfitriones` o `viajeros`)");
    }

    // Determinar los repositorios correctos según el tipo de usuario
    boolean emisorExiste = "anfitriones".equals(tipoUsuarioEmisor)
      ? anfitrionRepository.existsById(emisorID)
      : viajeroRepository.existsById(emisorID);

    boolean receptorExiste = "anfitriones".equals(tipoUsuarioEmisor)
      ? viajeroRepository.existsById(receptorID)
      : anfitrionRepository.existsById(receptorID);

    return !emisorExiste || !receptorExiste;
  }
}
