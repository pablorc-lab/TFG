package com.bearfrens.backend.controller.user;

import com.bearfrens.backend.entity.biografias.Biografias;
import com.bearfrens.backend.entity.contenido.Contenido;
import com.bearfrens.backend.entity.contenido.Recomendaciones;
import com.bearfrens.backend.entity.token.Token;
import com.bearfrens.backend.entity.user.Anfitrion;
import com.bearfrens.backend.entity.user.Usuario;
import com.bearfrens.backend.entity.user.Viajero;
import com.bearfrens.backend.entity.valoracione_conexiones.Valoraciones;
import com.bearfrens.backend.exception.ResourceNotFoundException;
import com.bearfrens.backend.repository.token.TokenRepository;
import com.bearfrens.backend.service.GestorUsuarioService;
import com.bearfrens.backend.service.UsuarioService;
import com.bearfrens.backend.service.biografias.BiografiasService;
import com.bearfrens.backend.service.ImgBBservice;
import com.bearfrens.backend.service.reservas.ReservasService;
import com.bearfrens.backend.service.valoraciones_conexiones.LikesService;
import com.bearfrens.backend.service.valoraciones_conexiones.ValoracionesService;
import com.bearfrens.backend.service.viviendas.ViviendasService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;

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
  private BiografiasService biografiasService;

  @Autowired
  private GestorUsuarioService gestorUsuarioService;

  @Autowired
  private ViviendasService viviendasService;

  @Autowired
  private ValoracionesService valoracionesService;

  @Autowired
  private UsuarioService usuarioService;

  @Autowired
  private LikesService likesService;

  @Autowired
  private ReservasService reservasService;

  @Autowired
  private ImgBBservice imgBBService;

  private TokenRepository tokenRepository;

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
   * Obtener todo el listado de usuarios con paginación
   * @return Listado array de usuarios
   */
  @GetMapping("/paginacion/{pagina}/{tamanio}")
  public ResponseEntity<?> listarTodosPaginacion(@PathVariable int pagina, @PathVariable int tamanio) {
    PageRequest pages = PageRequest.of(pagina, tamanio);
    Page<T> usuarios = repository.findAll(pages);
    List<Map<String, Object>> resultado = new ArrayList<>();

    for(T user : usuarios){
      String tipo_user = userType.equals("anfitrion") ? "anfitriones" : "viajeros";
      Biografias biografia = biografiasService.obtenerBiografia(tipo_user, user.getId()).orElse(null);
      resultado.add(Map.of(
        "usuario", user,
        "biografia", (biografia != null ? biografia : Map.of())
      ));
    }

    return ResponseEntity.ok(resultado);
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
      String tipo_user = userType.equals("anfitrion") ? "anfitriones" : "viajeros";
      Biografias biografia = biografiasService.obtenerBiografia(tipo_user, user.getId()).orElse(null);
      resultado.add(Map.of(
        "usuario", user,
        "biografia", (biografia != null ? biografia : Map.of())
      ));
    }

    return ResponseEntity.ok(resultado);
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

    String tipo_user = userType.equals("anfitrion") ? "anfitriones" : "viajeros";
    Biografias biografia = biografiasService.obtenerBiografia(tipo_user, userID).orElse(null);
    List<Valoraciones> valoraciones = valoracionesService.obtenerListaValoracionesConexionesRecibidas(userID, tipo_user);

    Map<String, Object> respuesta = Map.of(
      "usuario", user,
      "biografia", biografia != null ? biografia : new Biografias(),
      "valoraciones" , valoraciones
    );

    return ResponseEntity.ok(respuesta);
  }

  /**
   * Obtiene un usuario a través de su ID privado y, si existe, también su biografía.
   * @param privateID ID privado del usuario
   * @return ResponseEntity con el usuario encontrado y, si está disponible, su biografía. Si no existe, lanza una excepción.
   */
  @GetMapping("/private-id/{privateID}")
  public ResponseEntity<?> obtenerUsuarioPorPrivateID(@PathVariable String privateID) {
    T user;

    if (userType.equals("anfitrion")) {
      user = (T) gestorUsuarioService.obtenerAnfitrionPorIDPrivado(privateID)
        .orElseThrow(() -> new ResourceNotFoundException("El " + userType + " con ese ID Privado no existe : " + privateID));
    } else {
      user = (T) gestorUsuarioService.obtenerViajeroPorIDPrivado(privateID)
        .orElseThrow(() -> new ResourceNotFoundException("El " + userType + " con ese ID Privado no existe : " + privateID));
    }

    String tipo_user = userType.equals("anfitrion") ? "anfitriones" : "viajeros";
    Biografias biografia = biografiasService.obtenerBiografia(tipo_user, user.getId()).orElse(null);
    List<Valoraciones> valoraciones = valoracionesService.obtenerListaValoracionesConexionesRecibidas(user.getId(), tipo_user);

    Map<String, Object> respuesta = Map.of(
      "usuario", user,
      "biografia", biografia != null ? biografia : new Biografias(),
      "valoraciones", valoraciones
    );

    return ResponseEntity.ok(respuesta);
  }


  /**
   * Crea un usuario
   * @param user Objeto usuario
   * @return Objeto usuario creado
   */
  // @RequestBody : convierte el cuerpo de la solicitud HTTP (JSON) en un objeto Java (Usuario) para ser procesado en el metodo.
  @PostMapping("")
  public T crearUsuario(@RequestBody T user){
    if(usuarioService.existsByEmail(user.getEmail()) || user.getEmail().isEmpty()){
      return null;
    }

    // Filtramos su contraseña enviada
    user.setFiltrarPasword(user.getPassword());
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


  /**
   * Actualiza un usuario existente
   * @param userID ID del usuario a modificar
   * @param userRequest Contenido del nuevo usuario
   * @return Response Entity, en caso de ser ok, devuelve el usuario modificado
   */
  @PutMapping("/{userID}")
  public ResponseEntity<T> actualizarUsuario(@PathVariable Long userID, @RequestBody T userRequest){
    T user = repository.findById(userID)
      .orElseThrow(() -> new ResourceNotFoundException("El " + userType + " con ese ID no existe : " + userID));

    // Actualizar los valores de cada campo que no sean null
    Optional.ofNullable(userRequest.getPrivateID()).ifPresent(user::setPrivateID);
    Optional.ofNullable(userRequest.getEmail()).ifPresent(user::setEmail);
    Optional.ofNullable(userRequest.getPassword()).ifPresent(user::setFiltrarPasword);
    Optional.ofNullable(userRequest.getNombre()).ifPresent(user::setNombre);
    Optional.ofNullable(userRequest.getApellido()).ifPresent(user::setApellido);
    Optional.ofNullable(userRequest.getFecha_nacimiento()).ifPresent(user::setFecha_nacimiento);
    Optional.ofNullable(userRequest.getProfileImage()).ifPresent(user::setProfileImage);
    Optional.ofNullable(userRequest.getGusto1()).ifPresent(user::setGusto1);
    Optional.ofNullable(userRequest.getGusto2()).ifPresent(user::setGusto2);
    Optional.ofNullable(userRequest.getGusto3()).ifPresent(user::setGusto3);
    Optional.ofNullable(userRequest.getDescripcion()).ifPresent(user::setDescripcion);

    // Almacenar valores distintos si es viajero
    if(user instanceof Viajero){
      Optional.ofNullable(((Viajero) userRequest).getProfesion()).ifPresent(((Viajero) user)::setProfesion);
      Optional.ofNullable(((Viajero) userRequest).getTiempo_estancia()).ifPresent(((Viajero) user)::setTiempo_estancia);
    }

    // Guardar el usuario actualizado
    T updated_user = repository.save(user);
    return ResponseEntity.ok(updated_user);
  }

  /**
   * Eliminar un usuario y todo lo asociado a él
   * @param userID ID del usuario a eliminar
   * @return Mensaje deleted, indicando con booleano si se ha borrado o no
   */
  public ResponseEntity<Map<String,Boolean>> eliminarUsuario(Long userID, String tipo_usuario){
    T user = repository.findById(userID)
      .orElseThrow(() -> new ResourceNotFoundException("El " + userType + " con ese ID no existe : " + userID));

    Map<String, Boolean> respuesta = new HashMap<>();

    // Eliminar todo lo asociado al usuario
    String tipo_user = userType.equals("anfitrion") ? "anfitriones" : "viajeros";
    respuesta.put("Contenido delete ", this.eliminarTodoContenido(userID).getBody().get("delete")); // Contenido asociado (Recomendaciones/Experiencias)
    respuesta.put("Biografia delete", biografiasService.eliminarBiografia(tipo_usuario, userID)); // Biografia asociada
    respuesta.put("Valoraciones delete ", valoracionesService.eliminarValoracionesConexiones(userID, tipo_user).getBody().get("delete")); // Valoraciones recibidas y dadas
    respuesta.put("Likes delete ", likesService.eliminarValoracionesConexiones(userID, tipo_user).getBody().get("delete")); // Likes recibidas y dadas

    // Eliminar vivienda y reservas que haya con el si es anfitrion
    if(user instanceof Anfitrion){
      respuesta.put("Vivienda delete ", viviendasService.eliminarVivienda(userID).getBody().get("delete")); // Contenido asociado (Recomendaciones/Experiencias)

      respuesta.put("Reservas delelete ", reservasService.eliminarReservasPorAnfitrion(user.getId()).getBody().get("delete"));
    }

    // Eliminar el usuario y su token creado
    Optional<Token> token = tokenRepository.findByUserIDTipoUsuario(user.getId(), userType.equals("anfitrion") ? 0 : 1);
    token.ifPresent(tokenValue -> tokenRepository.delete(tokenValue));

    repository.delete(user);

    respuesta.put("User delete ", true);

    // Devolvemos una respueta JSON ---> "delete" : true
    return ResponseEntity.ok(respuesta);
  }


  // ============================================
  // MANEJO DE LAS RECOMENDACIONES O EXPERIENCIAS
  // ============================================

  /**
   * Obtener Recomendaciones o Experiencias
   * @param userID ID del usuario
   * @return Listado de Recomendaciones o Experiencias
   */
  public List<TC> obtenerContenidos(Long userID){
    T user = repository.findById(userID)
      .orElseThrow(() -> new ResourceNotFoundException("El " + userType + " con ese ID no existe : " + userID));

    return user.getContenido();
  }


  /**
   * Obtener una Recomendacion o Experiencia en específico
   * @param userID ID del usuario
   * @param titulo Titulo del contenido
   * @return Recomendacion o Experiencia en específico
   */
  public ResponseEntity<?> obtenerContenido(Long userID, String titulo){
    T user = repository.findById(userID)
      .orElseThrow(() -> new ResourceNotFoundException("El " + userType + " con ese ID no existe : " + userID));

    for(TC contenido : user.getContenido()) {
      if(contenido.getTitulo().equalsIgnoreCase(titulo))
        return ResponseEntity.ok(contenido);
    }
    return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No se encontró " + contenidoType + " con ese titulo");
  }

  /**
   * Crear Experiencia o Recomendacion
   * @param userID ID del usuario
   * @param contenido Objeto con el contenido de la recomendacion/experiencia
   * @return Objeto creado
   */
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

  /**
   * Editar Recomendacion o Experiencia
   * @param userID ID del usuario
   * @param titulo Titulo del contenido
   * @param infoContenido Información del contenido a editar
   * @return Objeto editado
   */
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
    Optional.ofNullable(infoContenido.getDescripcion()).ifPresent(contenido::setDescripcion);
    Optional.ofNullable(infoContenido.getRecomendacion()).ifPresent(contenido::setRecomendacion);

    if(contenido instanceof Recomendaciones){
      Optional.ofNullable(((Recomendaciones) infoContenido).getUbicacion()).ifPresent(((Recomendaciones) contenido)::setUbicacion);
      Optional.of(((Recomendaciones) infoContenido).getTelefono()).ifPresent(((Recomendaciones) contenido)::setTelefono);
      Optional.ofNullable(((Recomendaciones) infoContenido).getHorarios()).ifPresent(((Recomendaciones) contenido)::setHorarios);
      Optional.ofNullable(((Recomendaciones) infoContenido).getAyuda()).ifPresent(((Recomendaciones) contenido)::setAyuda);

    }

    TC contenidoActualizado = contenidoRepository.save(contenido);
    return ResponseEntity.ok(contenidoActualizado);
  }

  /**
   * Eliminar una Experiencia o Recomendacion
   * @param userID ID del usuario
   * @param titulo Titulo del contenido
   * @return Booleanos indicando si se ha eliminado no
   */
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

  /**
   * Eliminar todas las Experiencias o Recomendaciones de un usuario
   * @param userID ID del usuario
   * @return Booleano indicando si se han eliminado
   */
  public ResponseEntity<Map<String, Boolean>> eliminarTodoContenido(Long userID) {
    T user = repository.findById(userID)
      .orElseThrow(() -> new ResourceNotFoundException("El " + userType + " con ese ID no existe: " + userID));

    if (user.getContenido().isEmpty()) { // Si no hay contenido que eliminar
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Collections.singletonMap("error", false));
    }

    user.getContenido().clear(); // Al borrar la experiencia, se desvinculan y se eliminar de su tabla
    repository.save(user);
    return ResponseEntity.ok(Collections.singletonMap("delete", true));
  }

  //  @DeleteMapping("/{id}")
  //  public ResponseEntity<Map<String,Boolean>> eliminarImagenDePerfil(@PathVariable Long id) {
  //
  //  }
}
