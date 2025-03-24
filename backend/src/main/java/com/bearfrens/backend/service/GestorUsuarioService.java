package com.bearfrens.backend.service;

import com.bearfrens.backend.entity.user.Anfitrion;
import com.bearfrens.backend.entity.user.Viajero;
import com.bearfrens.backend.repository.user.AnfitrionRepository;
import com.bearfrens.backend.repository.user.ViajeroRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

// Esta clase se encarga de crear funcion comunes a otros controladore respecto
// la gestion del tipo de usuario o si ambos existen
@Service
@AllArgsConstructor
public class GestorUsuarioService {

  private final AnfitrionRepository anfitrionRepository;
  private final ViajeroRepository viajeroRepository;

  public Anfitrion obtenerAnfitrion(Long anfitrionID){ return anfitrionRepository.findById(anfitrionID).get();  }
  public Viajero obtenerViajero(Long viajeroID){ return viajeroRepository.findById(viajeroID).get();  }
  public void guardarAnfitrion(Anfitrion anfitrion) { anfitrionRepository.save(anfitrion);}
  public void guardarViajero(Viajero viajero) { viajeroRepository.save(viajero); }

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
