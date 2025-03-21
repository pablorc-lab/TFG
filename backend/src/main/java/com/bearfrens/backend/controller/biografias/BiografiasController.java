package com.bearfrens.backend.controller.biografias;

import com.bearfrens.backend.entity.biografias.Biografias;
import com.bearfrens.backend.exception.ResourceNotFoundException;
import com.bearfrens.backend.repository.biografias.BiografiasRepository;
import com.bearfrens.backend.service.GestorUsuarioService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api")
@AllArgsConstructor
public class BiografiasController {

  private final BiografiasRepository biografiasRepository;
  private final GestorUsuarioService gestorUsuarioService;

    // Obtener una biografía segun el "tipo" e "ID" del usuario
  @GetMapping("/{tipo_usuario}/{usuarioID}/biografia")
  public ResponseEntity<?> obtenerBiografia(@PathVariable String tipo_usuario, @PathVariable Long usuarioID) {
    int tipo = gestorUsuarioService.intTipoUsuario(tipo_usuario);
    return ResponseEntity.ok(biografiasRepository.findByUsuarioIDAndTipoUsuario(usuarioID, tipo)
      .orElseThrow(() -> new ResourceNotFoundException("No se encontró la biografía asociada al usuario " + tipo_usuario + "con ID: " + usuarioID))
    );
  }

  // Crear una nueva biografía
  @PostMapping("/{tipo_usuario}/{usuarioID}/biografia")
  public ResponseEntity<?> crearBiografia(@RequestBody Biografias biografia, @PathVariable String tipo_usuario, @PathVariable Long usuarioID) {
    if(!gestorUsuarioService.existeUsuario(tipo_usuario, usuarioID)) {
      return ResponseEntity.badRequest().body("El usuario asociado debe existir");
    }

    // Comprobar si ya existe una biografia
    int tipo = gestorUsuarioService.intTipoUsuario(tipo_usuario);
    if(biografiasRepository.findByUsuarioIDAndTipoUsuario(usuarioID, tipo).isPresent()){
      return ResponseEntity.badRequest().body("El usuario ya tiene una biografia asociada, solo puede modificarla");
    }

    biografia.setUsuarioID(usuarioID);
    biografia.setTipoUsuario(tipo);

    Biografias nuevaBiografia = biografiasRepository.save(biografia);
    return ResponseEntity.status(HttpStatus.CREATED).body(nuevaBiografia);
  }


  // Actualizar una biografía existente (no se puede cambiar el tipo de usuario)
  @PutMapping("/{tipo_usuario}/{usuarioID}/biografia")
  public ResponseEntity<?> actualizarBiografia(@PathVariable String tipo_usuario, @PathVariable Long usuarioID, @RequestBody Biografias detallesBiografia) {
    if(!gestorUsuarioService.existeUsuario(tipo_usuario, usuarioID)) {
      return ResponseEntity.badRequest().body("El usuario asociado debe existir");
    }

    int tipo = gestorUsuarioService.intTipoUsuario(tipo_usuario);
    Biografias biografia = biografiasRepository.findByUsuarioIDAndTipoUsuario(usuarioID, tipo)
      .orElseThrow(() -> new ResourceNotFoundException("No se encontró la biografía asociada al usuario " + tipo_usuario + "con ID: " + usuarioID));

    biografia.setSobreMi(detallesBiografia.getSobreMi());
    biografia.setIdiomas(detallesBiografia.getIdiomas());
    biografia.setDescripcionExtra(detallesBiografia.getDescripcionExtra());

    Biografias biografiaActualizada = biografiasRepository.save(biografia);
    return ResponseEntity.ok(biografiaActualizada);
  }

  // Eliminar una biografía
  @DeleteMapping("/{tipo_usuario}/{usuarioID}/biografia")
  public ResponseEntity<Map<String, Boolean>> eliminarBiografia(@PathVariable String tipo_usuario, @PathVariable Long usuarioID) {
    if(!gestorUsuarioService.existeUsuario(tipo_usuario, usuarioID)) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Collections.singletonMap("deleted", false));
    }

    int tipo = gestorUsuarioService.intTipoUsuario(tipo_usuario);
    Optional<Biografias> biografia = biografiasRepository.findByUsuarioIDAndTipoUsuario(usuarioID, tipo);
    if(biografia.isEmpty()){
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Collections.singletonMap("deleted", false));
    }

    biografiasRepository.delete(biografia.get());
    return ResponseEntity.ok(Collections.singletonMap("deleted", true));
  }
}
