package com.bearfrens.backend.controller.user;

import com.bearfrens.backend.entity.biografias.Biografias;
import com.bearfrens.backend.entity.contenido.Contenido;
import com.bearfrens.backend.entity.contenido.Recomendaciones;
import com.bearfrens.backend.entity.user.Usuario;
import com.bearfrens.backend.exception.ResourceNotFoundException;
import com.bearfrens.backend.repository.biografias.BiografiasRepository;
import com.bearfrens.backend.service.ImgBBservice;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
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

  @Autowired
  private BiografiasRepository biografiasRepository;

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

  /**
   * Obtener todo el listado de usuarios
   * @return Listado array de usuarios
   */
  @GetMapping("")
  public List<T> listarTodos() {
    return repository.findAll();
  }


  /**
   * Listar todos los usuarios pero con sus datos
   * @return Respueta MAP en forma [{usuario, biografia}, {usuario, biografia} ... ]
   */
  @GetMapping("/datos")
  public ResponseEntity<?> listarTodosConDatos() {
    List<T> usuarios = repository.findAll();
    List<Map<String, Object>> resultado = new ArrayList<>();

    for(T user : usuarios){
      int tipo_user = userType.equals("anfitrion") ? 1 : 2;
      Biografias biografia = biografiasRepository.findByUsuarioIDAndTipoUsuario(user.getId(), tipo_user).orElse(null);

      resultado.add(Map.of(
        "usuario", user,
        "biografia", (biografia != null ? biografia : Map.of())
      ));
    }

    return ResponseEntity.ok(resultado);
  }

  /**
   * Funcion para obtener una biografia dado el Usuario ID y el tipo Usuario
   * @param usuarioID ID del usuario a buscar
   * @param tipoUsuario Tipo de usuario a buscar
   * @return Biografia específica, si no, null.
   */
  protected Biografias obtenerBiografia(Long usuarioID, int tipoUsuario){
    return biografiasRepository.findByUsuarioIDAndTipoUsuario(usuarioID, tipoUsuario).orElse(null);
  }

  /**
   * Obtiene un usuario a través de su ID y, si existe, también su biografía.
   * @param userID ID del usuario
   * @return ResponseEntity con el usuario encontrado y, si está disponible, su biografía.  Si no existe, lanza una excepción.
   */
  @GetMapping("/{userID}") // @PathVariable : extrae el valor del parámetro id de la URL de la solicitud HTTP.
  public ResponseEntity<?> obtenerUsuarioPorId(@PathVariable Long userID){
    // findById() que busca un registro por la clave primaria (en este caso, id), que es la columna marcada como clave primaria en la base de datos.
    T user = repository.findById(userID)
      .orElseThrow(() -> new ResourceNotFoundException("El " + userType + " con ese ID no existe : " + userID));

    int tipo_user = userType.equals("anfitrion") ? 1 : 2;
    Biografias biografia = biografiasRepository.findByUsuarioIDAndTipoUsuario(userID, tipo_user).orElse(null);

    return biografia == null ? ResponseEntity.ok(user) : ResponseEntity.ok(Map.of("usuario", user, "biografia", biografia));
  }

  /**
   * Crea un usuario
   * @param user Objeto usuario
   * @return Objeto usuario creado
   */
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
    user.setGusto1(userRequest.getGusto1());
    user.setGusto2(userRequest.getGusto2());
    user.setGusto3(userRequest.getGusto3());

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
  public List<TC> obtenerContenidos(Long userID){
    T user = repository.findById(userID)
      .orElseThrow(() -> new ResourceNotFoundException("El " + userType + " con ese ID no existe : " + userID));

    return user.getContenido();
  }

  // Obtener una Recomendacion o Experiencia en específico
  public ResponseEntity<?> obtenerContenido(Long userID, String titulo){
    T user = repository.findById(userID)
      .orElseThrow(() -> new ResourceNotFoundException("El " + userType + " con ese ID no existe : " + userID));

    for(TC contenido : user.getContenido()) {
      if(contenido.getTitulo().equalsIgnoreCase(titulo))
        return ResponseEntity.ok(contenido);
    }
    return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No se encontró " + contenidoType + " con ese titulo");
  }

  // Crear Experiencia o Recomendacion
  public ResponseEntity<?> crearContenido(Long userID, TC contenido) {
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
  public ResponseEntity<?> editarContenido(Long userID, String titulo, TC infoContenido) {
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
  public ResponseEntity<Map<String, Boolean>> eliminarContenido(Long userID, String titulo) {
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
