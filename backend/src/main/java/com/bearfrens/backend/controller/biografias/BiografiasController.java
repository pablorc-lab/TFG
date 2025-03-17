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
import java.util.Optional;

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

  // Obtener una biografía segun el "tipo" e "ID" del usuario
  @GetMapping("/{tipo_usuario}/{usuarioID}")
  public ResponseEntity<Biografias> obtenerBiografia(@PathVariable int tipo_usuario, @PathVariable Long usuarioID) {
    return ResponseEntity.ok(biografiasRepository.findByUsuarioIDAndTipoUsuario(usuarioID, tipo_usuario)
      .orElseThrow(() -> new ResourceNotFoundException("No se encontró la biografía asociada al usuario " + tipo_usuario + "con ID: " + usuarioID))
    );
  }

  // Crear una nueva biografía
  @PostMapping("/{tipo_usuario}/{usuarioID}")
  public ResponseEntity<?> crearBiografia(@RequestBody Biografias biografia, @PathVariable int tipo_usuario, @PathVariable Long usuarioID) {
    if(!existeUsuario(tipo_usuario, usuarioID)) {
      return ResponseEntity.badRequest().body("El usuario asociado debe existir");
    }

    // Comprobar si ya existe una biografia
    if(biografiasRepository.findByUsuarioIDAndTipoUsuario(usuarioID, tipo_usuario).isPresent()){
      return ResponseEntity.badRequest().body("El usuario ya tiene una biografia asociada, solo puede modificarla");
    }

    biografia.setUsuarioID(usuarioID);
    biografia.setTipoUsuario(tipo_usuario);

    Biografias nuevaBiografia = biografiasRepository.save(biografia);
    return ResponseEntity.status(HttpStatus.CREATED).body(nuevaBiografia);
  }


  // Actualizar una biografía existente (no se puede cambiar el tipo de usuario)
  @PutMapping("/{tipo_usuario}/{usuarioID}")
  public ResponseEntity<Biografias> actualizarBiografia(@PathVariable int tipo_usuario, @PathVariable Long usuarioID, @RequestBody Biografias detallesBiografia) {
    Biografias biografia = biografiasRepository.findByUsuarioIDAndTipoUsuario(usuarioID, tipo_usuario)
      .orElseThrow(() -> new ResourceNotFoundException("No se encontró la biografía asociada al usuario " + tipo_usuario + "con ID: " + usuarioID));

    biografia.setSobreMi(detallesBiografia.getSobreMi());
    biografia.setIdiomas(detallesBiografia.getIdiomas());
    biografia.setDescripcionExtra(detallesBiografia.getDescripcionExtra());

    Biografias biografiaActualizada = biografiasRepository.save(biografia);
    return ResponseEntity.ok(biografiaActualizada);
  }

  // Eliminar una biografía
  @DeleteMapping("/{tipo_usuario}/{usuarioID}")
  public ResponseEntity<Map<String, Boolean>> eliminarBiografia(@PathVariable int tipo_usuario, @PathVariable Long usuarioID) {
    Biografias biografia = biografiasRepository.findByUsuarioIDAndTipoUsuario(usuarioID, tipo_usuario)
      .orElseThrow(() -> new ResourceNotFoundException("No se encontró la biografía asociada al usuario " + tipo_usuario + "con ID: " + usuarioID));

    biografiasRepository.delete(biografia);
    return ResponseEntity.ok(Collections.singletonMap("deleted", true));
  }
}
