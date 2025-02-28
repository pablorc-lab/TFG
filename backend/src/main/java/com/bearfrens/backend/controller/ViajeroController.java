package com.bearfrens.backend.controller;

import com.bearfrens.backend.entity.Viajero;
import com.bearfrens.backend.exception.ResourceNotFoundException;
import com.bearfrens.backend.repository.ViajeroRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

// Permitir que nuestra aplicación deje que react desde es enlace acceda a los datos
@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/viajeros")
public class ViajeroController {

  // @Autowired : se utiliza para inyectar automáticamente una instancia del ViajeroRepository en el controlador,
  // lo que permite acceder a los métodos del repositorio sin tener que crear manualmente su objeto.
  @Autowired
  private ViajeroRepository viajeroRepository;

  @GetMapping("")
  public List<Viajero> listarViajeros() {
    return viajeroRepository.findAll();
  }

  // POST :  crear un nuevo recurso
  // @RequestBody : convierte el cuerpo de la solicitud HTTP (JSON) en un objeto Java (Viajero) para ser procesado en el metodo.
  @PostMapping("")
  public Viajero crearViajero(@RequestBody Viajero viajero){
    return viajeroRepository.save(viajero);
  }

  @GetMapping("/{id}")
  // @PathVariable : extrae el valor del parámetro id de la URL de la solicitud HTTP.
  public ResponseEntity<Viajero> obtenerViajeroPorId(@PathVariable Long id){
    // findById() que busca un registro por la clave primaria (en este caso, id), que es la columna marcada como clave primaria en la base de datos.
    return ResponseEntity.ok(viajeroRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("El viajero con ese ID no existe: " + id)));
  }

  // PUT :  actualizar un recurso existente
  @PutMapping("/{id}")
  public ResponseEntity<Viajero> actualizarViajero(@PathVariable Long id, @RequestBody Viajero viajeroRequest){
    Viajero viajero = viajeroRepository.findById(id)
        .orElseThrow(() -> new ResourceNotFoundException("El viajero con ese ID no existe : " + id));

    // Actualizar los valores de cada campo
    viajero.setPrivateID(viajeroRequest.getPrivateID());
    viajero.setEmail(viajeroRequest.getEmail());
    viajero.setPassword(viajeroRequest.getPassword());
    viajero.setNombre(viajeroRequest.getNombre());
    viajero.setApellido(viajeroRequest.getApellido());
    viajero.setFecha_nacimiento(viajeroRequest.getFecha_nacimiento());
    viajero.setProfileImage(viajeroRequest.getProfileImage());

    // Guardar el viajero actualizado
    Viajero viajeroActualizdo = viajeroRepository.save(viajero);
    return ResponseEntity.ok(viajeroActualizdo);
  }


  @DeleteMapping("/{id}")
  public ResponseEntity<Map<String,Boolean>> eliminarViajero(@PathVariable Long id){
    Viajero viajero = viajeroRepository.findById(id)
        .orElseThrow(() -> new ResourceNotFoundException("El viajero con ese ID no existe : " + id));

    viajeroRepository.delete(viajero);
    // Devolvemos una respueta JSON ---> "delete" : true
    return ResponseEntity.ok(Collections.singletonMap("delete", true));
  }
}
