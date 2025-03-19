package com.bearfrens.backend.controller.valoraciones;

import com.bearfrens.backend.entity.valoraciones.Valoraciones;
import com.bearfrens.backend.repository.user.AnfitrionRepository;
import com.bearfrens.backend.repository.user.ViajeroRepository;
import com.bearfrens.backend.repository.valoraciones.ValoracionesRepository;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.*;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api")
@AllArgsConstructor
public class ValoracionesController {

  private final ValoracionesRepository valoracionesRepository;
  private final AnfitrionRepository anfitrionRepository;
  private final ViajeroRepository viajeroRepository;

  // Transforma el string del tipo de usuario a su respectivo valor numérico
  private int intTipoUsuario(String tipoUsuario) {
    return switch (tipoUsuario) {
      case "anfitriones" -> 1;
      case "viajeros" -> 2;
      default -> throw new IllegalArgumentException("Tipo de usuario inválido: " + tipoUsuario);
    };
  }

  // Funcion para comprobar que el tipo de usuario y el mismo, existan
  private boolean existeUsuario(String tipoUsuario, Long userID){
    if (!"anfitriones".equals(tipoUsuario) && !"viajeros".equals(tipoUsuario)) {
      throw new IllegalArgumentException("Tipo de usuario inválido (Debe ser `anfitriones` o `viajeros`)");
    }

    // Comprobar que exista el usuario
    return ("anfitriones".equals(tipoUsuario))
      ? anfitrionRepository.existsById(userID) // Anfitrion
      : viajeroRepository.existsById(userID); // Viajero
  }

  // Funcion para comprobar que dos usuarios, emisor y receptor existan
  private boolean existeAmbosUsuario(String tipoUsuarioEmisor, Long emisorID, Long receptorID){
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

    return emisorExiste && receptorExiste;
  }

  // Obtener todas las valoraciones de un usuario RECEPTOR
  @GetMapping("/{tipo_usuario}/{usuarioID}/valoraciones")
  public ResponseEntity<List<Valoraciones>> obtenerValoraciones(@PathVariable String tipo_usuario, @PathVariable Long usuarioID) {
    return ResponseEntity.ok(valoracionesRepository.findAllByUsuarioIDAndTipoUsuario(usuarioID, intTipoUsuario(tipo_usuario)));
  }

  // Crear una valoracion de un usuario dado su "emisorID", "tipo" y "receptorID"
  @PostMapping("/{tipo_usuario}/{emisorID}/valoraciones/{receptorID}")
  public ResponseEntity<?> crearValoracion(@PathVariable String tipo_usuario, @PathVariable Long emisorID, @PathVariable Long receptorID, @RequestBody Valoraciones valoracion) {
    if(!existeAmbosUsuario(tipo_usuario, emisorID, receptorID)) {
      return ResponseEntity.badRequest().body("Los usuarios asociados debe existir");
    }

    // Comprobar si ya existe una valoracion dada por el usuario Emisor
    int tipo = intTipoUsuario(tipo_usuario) == 1 ? 2 : 1;// Almacenar el tipo del RECEPTOR no del emisor
    if(valoracionesRepository.findByEmisorIDAndUsuarioIDAndTipoUsuario(emisorID, receptorID, tipo).isPresent()){
      return ResponseEntity.badRequest().body("Ya has enviado una valoración al receptor con id = " + receptorID);
    }

    valoracion.setEmisorID(emisorID);
    valoracion.setTipoUsuario(tipo);
    valoracion.setUsuarioID(receptorID);
    valoracion.setFecha(LocalDate.now());

    Valoraciones nuevaValoracion = valoracionesRepository.save(valoracion);
    return ResponseEntity.status(HttpStatus.CREATED).body(nuevaValoracion);
  }

  // Eliminar todas las valoraciones de un usuario RECEPTOR
  @DeleteMapping("/{tipo_usuario}/{usuarioID}/valoraciones")
  public ResponseEntity<Map<String, Boolean>> eliminarValoraciones(@PathVariable String tipo_usuario, @PathVariable Long usuarioID) {
    if(!existeUsuario(tipo_usuario, usuarioID)) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Collections.singletonMap("deleted", false));
    }

    // Obtener valoraciones recibidas
    List<Valoraciones> valoracionesRecibidas = valoracionesRepository.findAllByUsuarioIDAndTipoUsuario(usuarioID, intTipoUsuario(tipo_usuario));

    // Obtener valoraciones enviadas
    List<Valoraciones> valoracionesEnviadas = valoracionesRepository.findAllByEmisorIDAndTipoUsuario(usuarioID, intTipoUsuario(tipo_usuario) == 1 ? 2 : 1);

    // Unir ambos tipos de valoraciones
    List<Valoraciones> valoracionesTotales = new ArrayList<>();
    valoracionesTotales.addAll(valoracionesRecibidas);
    valoracionesTotales.addAll(valoracionesEnviadas);

    if(valoracionesTotales.isEmpty()){
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Collections.singletonMap("deleted", false));
    }

    // Eliminar todas
    valoracionesRepository.deleteAll(valoracionesTotales);
    return ResponseEntity.ok(Collections.singletonMap("deleted", true));
  }
}
