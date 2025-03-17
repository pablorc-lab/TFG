package com.bearfrens.backend.controller.user;

import com.bearfrens.backend.entity.contenido.Contenido;
import com.bearfrens.backend.entity.contenido.Recomendaciones;
import com.bearfrens.backend.entity.user.Anfitrion;
import com.bearfrens.backend.entity.user.Usuario;
import com.bearfrens.backend.exception.ResourceNotFoundException;
import com.bearfrens.backend.service.ImgBBservice;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Collections;
import java.util.List;
import java.util.Map;

// Controlador comun para ambos tipo de usuario
// T -> Tipo de usuario (anfitrion o viajero)
// R -> Repositorio del tipo de usuario
// C -> Repositorio del contenido (recomendaciones o experiencias)
// TC -> Tipo del contenido
@RequiredArgsConstructor
public abstract class BaseUserController<T extends Usuario<TC>, R extends JpaRepository<T, Long>, C extends JpaRepository<TC, Long>, TC extends Contenido> {
  protected final R repository;
  protected final C contenidoRepository;
  private final String userType;
  private final String contenidoType;

  @Autowired
  private ImgBBservice imgBBService;

  // Constructor "protected" para que solo las clases hijas lo usen
  protected BaseUserController(R repository, String userType, C contenidoRepository, String contenidoType) {
    this.repository = repository;
    this.contenidoRepository = contenidoRepository;
    this.userType = userType;
    this.contenidoType = contenidoType;
  }

  @GetMapping("")
  public List<T> listarTodos() {
    return repository.findAll();
  }


  @GetMapping("/{userID}")
  // @PathVariable : extrae el valor del parámetro id de la URL de la solicitud HTTP.
  public ResponseEntity<T> obtenerUsuarioPorId(@PathVariable Long userID){
    // findById() que busca un registro por la clave primaria (en este caso, id), que es la columna marcada como clave primaria en la base de datos.
    return ResponseEntity.ok(repository.findById(userID)
      .orElseThrow(() -> new ResourceNotFoundException("El " + userType + " con ese ID no existe : " + userID))
    );
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
  @PutMapping("/{userID}")
  public ResponseEntity<T> actualizarUsuario(@PathVariable Long userID, @RequestBody T userRequest){
    T user = repository.findById(userID)
      .orElseThrow(() -> new ResourceNotFoundException("El " + userType + " con ese ID no existe : " + userID));

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


  @DeleteMapping("/{userID}")
  public ResponseEntity<Map<String,Boolean>> eliminarUsuario(@PathVariable Long userID){
    T user = repository.findById(userID)
      .orElseThrow(() -> new ResourceNotFoundException("El " + userType + " con ese ID no existe : " + userID));

    repository.delete(user);

    // Devolvemos una respueta JSON ---> "delete" : true
    return ResponseEntity.ok(Collections.singletonMap("delete", true));
  }


  // ============================================
  // MANEJO DE LAS RECOMENDACIONES O EXPERIENCIAS
  // ============================================
  // Obtener Recomendaciones o Experiencias
  @GetMapping("/{userID}/{contenidoType}")
  public List<TC> obtenerContenidos(@PathVariable Long userID){
    T user = repository.findById(userID)
      .orElseThrow(() -> new ResourceNotFoundException("El " + userType + " con ese ID no existe : " + userID));

    return user.getContenido();
  }


  // Obtener una Recomendacion o Experiencia en específico
  @GetMapping("/{userID}/{contenidoType}/{titulo}")
  public ResponseEntity<?> obtenerContenido(@PathVariable Long userID, @PathVariable String titulo){
    T user = repository.findById(userID)
      .orElseThrow(() -> new ResourceNotFoundException("El " + userType + " con ese ID no existe : " + userID));

    for(TC contenido : user.getContenido()) {
      if(contenido.getTitulo().equalsIgnoreCase(titulo))
        return ResponseEntity.ok(contenido);
    }
    return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No se encontró " + contenidoType + " con ese titulo");
  }


  // Crear Experiencia o Recomendacion
  @PostMapping("/{userID}/{contenidoType}")
  public ResponseEntity<?> crearContenido(@PathVariable Long userID, @RequestBody TC contenido) {
    T user = repository.findById(userID)
      .orElseThrow(() -> new ResourceNotFoundException("El " + userType + " con ese ID no existe : " + userID));

    for(TC contenidoUser : user.getContenido()) {
      if(contenidoUser.getTitulo().equalsIgnoreCase(contenido.getTitulo()))
        return ResponseEntity.status(HttpStatus.CONFLICT).body("Ya existe " + contenidoType + " con ese titulo, solo puede modificarla.");
    }

    contenido.setUsuario(user); // Asignar el Anfitrion o Viajero a la recomendación
    TC nuevoContenido = contenidoRepository.save(contenido);
    return ResponseEntity.status(HttpStatus.CREATED).body(nuevoContenido);
  }


  // Editar Recomendacion o Experiencia
  @PutMapping("/{userID}/{contenidoType}/{titulo}")
  public ResponseEntity<?> editarContenido(@PathVariable Long userID, @PathVariable String titulo, @RequestBody TC infoContenido) {
    T user = repository.findById(userID)
      .orElseThrow(() -> new ResourceNotFoundException("El " + userType + " con ese ID no existe : " + userID));

    TC contenido = null;

    // Buscar el contenido a editar
    for (TC contenidoUser : user.getContenido()) {
      if (contenidoUser.getTitulo().equalsIgnoreCase(titulo)) {
        contenido = contenidoUser;
        break;
      }
    }

    // Si la recomendación no existe
    if(contenido == null){
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No existe " + contenidoType + " con ese titulo");
    }

    // El titulo es inmutable
    contenido.setDescripcion(infoContenido.getDescripcion());
    contenido.setRecomendacion(infoContenido.getRecomendacion());

    if(contenido instanceof Recomendaciones){
      ((Recomendaciones) contenido).setUbicacion(((Recomendaciones) infoContenido).getUbicacion());
      ((Recomendaciones) contenido).setTelefono(((Recomendaciones) infoContenido).getTelefono());
      ((Recomendaciones) contenido).setHorarios(((Recomendaciones) infoContenido).getHorarios());
      ((Recomendaciones) contenido).setAyuda(((Recomendaciones) infoContenido).getAyuda());
    }

    TC contenidoActualizado = contenidoRepository.save(contenido);
    return ResponseEntity.ok(contenidoActualizado);
  }


  // Eliminar una Experiencia o Recomendacion
  @DeleteMapping("/{userID}/{contenidoType}/{titulo}")
  public ResponseEntity<Map<String, Boolean>> eliminarContenido(@PathVariable Long userID, @PathVariable String titulo) {
    T user = repository.findById(userID)
      .orElseThrow(() -> new ResourceNotFoundException("El " + userType + " con ese ID no existe : " + userID));

    TC contenidoAEliminar = null;
    for(TC contenido : user.getContenido()) { // Buscar esa recomendacion/experiencia
      if(contenido.getTitulo().equalsIgnoreCase(titulo)){
        contenidoAEliminar = contenido;
        break;
      }
    }

    if(contenidoAEliminar == null){ // Si la recomendación/experiencia no existe
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Collections.singletonMap("error", false));
    }

    // Desvincular simplemente la recomendacion/experiencia del anfitrión antes de eliminarla
    user.getContenido().remove(contenidoAEliminar);
    repository.save(user);
    return ResponseEntity.ok(Collections.singletonMap("delete", true));
  }

  //  @DeleteMapping("/{id}")
  //  public ResponseEntity<Map<String,Boolean>> eliminarImagenDePerfil(@PathVariable Long id) {
  //
  //  }
}
