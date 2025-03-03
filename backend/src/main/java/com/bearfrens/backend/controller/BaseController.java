package com.bearfrens.backend.controller;

import com.bearfrens.backend.entity.Usuario;
import com.bearfrens.backend.exception.ResourceNotFoundException;
import com.bearfrens.backend.service.ImgBBservice;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Objects;

// Controlador comun para ambos tipo de usuario
public abstract class BaseController<T extends Usuario, R extends JpaRepository<T, Long>> {
  protected final R repository;
  private final String userType;

  @Autowired
  private ImgBBservice imgBBService;

  // ==== CONSTRUCTOR ====
  // @Autowired : se utiliza para inyectar automáticamente una instancia en el controlador,
  // lo que permite acceder a los métodos del repositorio sin tener que crear manualmente su objeto.
  @Autowired
  public BaseController(R repository, String userType) {
    this.repository = repository;
    this.userType = userType;
  }

  @GetMapping("")
  public List<T> listarTodos() {
    return repository.findAll();
  }

  @GetMapping("/{id}")
  // @PathVariable : extrae el valor del parámetro id de la URL de la solicitud HTTP.
  public ResponseEntity<T> obtenerAnfitrionPorId(@PathVariable Long id){
    // findById() que busca un registro por la clave primaria (en este caso, id), que es la columna marcada como clave primaria en la base de datos.
    return ResponseEntity.ok(repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("El " + userType + " con ese ID no existe : " + id)));
  }

  // @RequestBody : convierte el cuerpo de la solicitud HTTP (JSON) en un objeto Java (Usuario) para ser procesado en el metodo.
  @PostMapping("")
  public T crearUsuario(@RequestBody T user){
    return repository.save(user);
  }

  // Subir la imagen de enviada y devolver su ruta
  @PostMapping("/upload")
  public ResponseEntity<Map<String,Object>> uploadImage(@RequestParam("image") MultipartFile image){
    if(image.isEmpty()){
      return ResponseEntity.badRequest().body(Collections.singletonMap("error", "No se ha enviado ninguna imagen"));
    }

    try {
      // Llamar al servicio para subir la imagen
      Map<String, Object> response = imgBBService.uploadImage(image);
      return ResponseEntity.ok(response); // Retornar el JSON
    }
    catch (Exception e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
        .body(Collections.singletonMap("error", "Error en la subida de imágen: " + e.getMessage()));
    }
  }

  // PUT :  actualizar un recurso existente
  @PutMapping("/{id}")
  public ResponseEntity<T> actualizarAnfitrion(@PathVariable Long id, @RequestBody T userRequest){
    T user = repository.findById(id)
      .orElseThrow(() -> new ResourceNotFoundException("El " + userType + " con ese ID no existe : " + id));

    // Actualizar los valores de cada campo
    user.setPrivateID(userRequest.getPrivateID());
    user.setEmail(userRequest.getEmail());
    user.setPassword(userRequest.getPassword());
    user.setNombre(userRequest.getNombre());
    user.setApellido(userRequest.getApellido());
    user.setFecha_nacimiento(userRequest.getFecha_nacimiento());
    user.setProfileImage(userRequest.getProfileImage());

    // Guardar el usuario actualizado
    T updated_User = repository.save(user);
    return ResponseEntity.ok(updated_User);
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Map<String,Boolean>> eliminarUsuario(@PathVariable Long id){
    T user = repository.findById(id)
      .orElseThrow(() -> new ResourceNotFoundException("El " + userType + " con ese ID no existe : " + id));

    repository.delete(user);

    // Devolvemos una respueta JSON ---> "delete" : true
    return ResponseEntity.ok(Collections.singletonMap("delete", true));
  }
}
