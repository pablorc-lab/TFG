package com.bearfrens.backend.controller.biografias;

import com.bearfrens.backend.entity.biografias.Biografias;
import com.bearfrens.backend.exception.ResourceNotFoundException;
import com.bearfrens.backend.repository.biografias.BiografiasRepository;
import com.bearfrens.backend.repository.user.AnfitrionRepository;
import com.bearfrens.backend.repository.user.ViajeroRepository;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/biografias")
@AllArgsConstructor
public class BiografiasController {

  private final BiografiasRepository biografiasRepository;
  private final AnfitrionRepository anfitrionRepository;
  private final ViajeroRepository viajeroRepository;

  // Funcion para comprobar que el tipo de usuario y el mismo, existan
  private boolean existeUsuario(int tipoUsuario, Long userID){
    if (tipoUsuario != 1 && tipoUsuario != 2) {
      throw new IllegalArgumentException("Tipo de usuario inválido (Debe ser `1` o `2`)");
    }

    // Comprobar que exista el usuario
    return (tipoUsuario == 1)
      ? anfitrionRepository.existsById(userID) // Anfitrion
      : viajeroRepository.existsById(userID); // Viajero
  }

  // Obtener una biografía segun el tipo e ID del usuario
  @GetMapping("/{biografiaID}")
  public ResponseEntity<Biografias> obtenerBiografia(@PathVariable Long biografiaID) {
    return ResponseEntity.ok(biografiasRepository.findById(biografiaID)
      .orElseThrow(() -> new ResourceNotFoundException("No se encontró la biografía con ID: " + biografiaID))
    );
  }

  // Crear una nueva biografía
  @PostMapping("")
  public ResponseEntity<?> crearBiografia(@RequestBody Biografias biografia) {
    int tipo_user = biografia.getTipoUsuario();
    Long user_id = biografia.getUsuario().getId();

    if(!existeUsuario(tipo_user, user_id)) {
      return ResponseEntity.badRequest().body("El usuario asociado debe existir");
    }

    Biografias nuevaBiografia = biografiasRepository.save(biografia);
    return ResponseEntity.status(HttpStatus.CREATED).body(nuevaBiografia);
  }

  // Actualizar una biografía existente (no se puede cambiar el tipo de usuario)
  @PutMapping("/{biografiaID}")
  public ResponseEntity<Biografias> actualizarBiografia(@PathVariable Long biografiaID, @RequestBody Biografias detallesBiografia) {
    Biografias biografia = biografiasRepository.findById(biografiaID)
      .orElseThrow(() -> new ResourceNotFoundException("No se encontró la biografía con ID: " + biografiaID));

    biografia.setSobreMi(detallesBiografia.getSobreMi());
    biografia.setIdiomas(detallesBiografia.getIdiomas());
    biografia.setDescripcionExtra(detallesBiografia.getDescripcionExtra());

    Biografias biografiaActualizada = biografiasRepository.save(biografia);
    return ResponseEntity.ok(biografiaActualizada);
  }

  // Eliminar una biografía
  @DeleteMapping("/{biografiaID}")
  public ResponseEntity<Map<String, Boolean>> eliminarBiografia(@PathVariable Long biografiaID) {
    Biografias biografia = biografiasRepository.findById(biografiaID)
      .orElseThrow(() -> new ResourceNotFoundException("No se encontró la biografía con ID: " + biografiaID));

    biografiasRepository.delete(biografia);
    return ResponseEntity.ok(Collections.singletonMap("deleted", true));
  }
}
