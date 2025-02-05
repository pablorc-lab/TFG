package com.bearfrens.backend.controller;

import com.bearfrens.backend.entity.Anfitrion;
import com.bearfrens.backend.exception.ResourceNotFoundException;
import com.bearfrens.backend.repository.AnfitrionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.Map;

// Permitir que nuestra aplicación deje que react desde es enlace acceda a los datos
@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/anfitriones")
public class AnfitrionController {

  // @Autowired : se utiliza para inyectar automáticamente una instancia del AnfitrionRepository en el controlador, lo que permite acceder a los métodos del repositorio sin tener que crear manualmente su objeto.
  @Autowired
  private AnfitrionRepository anfitrionRepository;

  @GetMapping("")
  public List<Anfitrion> listarAnfitrions() {
    return anfitrionRepository.findAll();
  }

  // POST :  crear un nuevo recurso
  @PostMapping("")
  // @RequestBody : convierte el cuerpo de la solicitud HTTP (JSON) en un objeto Java (Anfitrion) para ser procesado en el metodo.
  public Anfitrion crearAnfitrion(@RequestBody Anfitrion anfitrion){
    return anfitrionRepository.save(anfitrion);
  }

  @GetMapping("/{id}")
  // @PathVariable : extrae el valor del parámetro id de la URL de la solicitud HTTP.
  public ResponseEntity<Anfitrion> obtenerAnfitrionPorId(@PathVariable Long id){
    // findById() que busca un registro por la clave primaria (en este caso, id), que es la columna marcada como clave primaria en la base de datos.
    return ResponseEntity.ok(anfitrionRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("El anfitrion con ese ID no existe : " + id)));
  }

  // PUT :  actualizar un recurso existente
  @PutMapping("/{id}")
  public ResponseEntity<Anfitrion> actualizarAnfitrion(@PathVariable Long id, @RequestBody Anfitrion anfitrionRequest){
    Anfitrion anfitrion = anfitrionRepository.findById(id)
        .orElseThrow(() -> new ResourceNotFoundException("El anfitrion con ese ID no existe : " + id));

    // Actualizar los valores de cada campo
    anfitrion.setPrivateID(anfitrionRequest.getPrivateID());
    anfitrion.setEmail(anfitrionRequest.getEmail());
    anfitrion.setPassword(anfitrionRequest.getPassword());
    anfitrion.setNombre(anfitrionRequest.getNombre());
    anfitrion.setApellido(anfitrionRequest.getApellido());
    anfitrion.setEdad(anfitrionRequest.getEdad());
    anfitrion.setProfileImage(anfitrionRequest.getProfileImage());

    // Guardar el anfitrión actualizado
    Anfitrion anfitrionActualizado = anfitrionRepository.save(anfitrion);
    return ResponseEntity.ok(anfitrionActualizado);
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Map<String,Boolean>> eliminarAnfitrion(@PathVariable Long id){
    Anfitrion anfitrion = anfitrionRepository.findById(id)
        .orElseThrow(() -> new ResourceNotFoundException("El anfitrion con ese ID no existe : " + id));

    anfitrionRepository.delete(anfitrion);
    // Devolvemos una respueta JSON ---> "delete" : true
    return ResponseEntity.ok(Collections.singletonMap("delete", true));
  }
}
