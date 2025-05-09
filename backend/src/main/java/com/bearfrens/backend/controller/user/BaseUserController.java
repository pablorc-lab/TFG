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
import com.bearfrens.backend.repository.reservas.ReservasRepository;
import com.bearfrens.backend.repository.token.TokenRepository;
import com.bearfrens.backend.service.GestorUsuarioService;
import com.bearfrens.backend.service.UsuarioService;
import com.bearfrens.backend.service.biografias.BiografiasService;
import com.bearfrens.backend.service.ImgBBservice;
import com.bearfrens.backend.service.valoraciones_conexiones.LikesService;
import com.bearfrens.backend.service.valoraciones_conexiones.ValoracionesService;
import jakarta.transaction.Transactional;
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
  private ValoracionesService valoracionesService;

  @Autowired
  private UsuarioService usuarioService;

  @Autowired
  private LikesService likesService;

  @Autowired
  private ImgBBservice imgBBService;

  @Autowired
  private TokenRepository tokenRepository;

  @Autowired
  private ReservasRepository reservasRepository;

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
   * Obtener todo el listado de usuarios con paginación e indica si hay posteriores a él
   * @param pagina Número de página donde se empieza a obtener
   * @param tamanio Cantidad de elementos a obtener
   * @return Listado array de usuarios
   */
  @GetMapping("/paginacion/{pagina}/{tamanio}")
  public Map<String, Object> listarTodosPaginacion(@PathVariable int pagina, @PathVariable int tamanio) {
    PageRequest pages = PageRequest.of(pagina, tamanio);
    Page<T> result = repository.findAll(pages);

    Map<String, Object> response = new HashMap<>();
    response.put("data", result.getContent());  // Datos de la página actual
    response.put("hasMore", result.hasNext());  // Si hay más elementos en la base de datos

    return response;
  }

  /**
   * Listar todos los usuarios pero con sus datos
   * @return Respueta MAP en forma [{usuario, biografia}, {usuario, biografia} ... ]
   */
  @GetMapping("/datos")
  public ResponseEntity<List<Map<String, Object>>> listarTodosConDatos() {
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
  @GetMapping("/id/{userID}") // @PathVariable : extrae el valor del parámetro id de la URL de la solicitud HTTP.
  public ResponseEntity<Map<String, Object>> obtenerUsuarioPorId(@PathVariable Long userID){
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
   * Obtiene un usuario a través de su email y, si existe, también su biografía.
   * @param email ID del usuario
   * @return ResponseEntity con el usuario encontrado y, si está disponible, su biografía.  Si no existe, lanza una excepción.
   */
  @GetMapping("/email/{email}")
  public ResponseEntity<Map<String, Object>> obtenerUsuarioPorId(@PathVariable String email){
    String tipo_user = userType.equals("anfitrion") ? "anfitriones" : "viajeros";

    Map<String, Object> respuesta = new HashMap<>();
    long userID;

    if(tipo_user.equals("anfitriones")){
      Anfitrion anfitrion = gestorUsuarioService.obtenerAnfitrionPorEmail(email)
        .orElseThrow(() -> new ResourceNotFoundException("El " + userType + " con ese email no existe : " + email));
      respuesta.put("usuario", anfitrion);
      userID = anfitrion.getId();
    }
    else{
      Viajero viajero = gestorUsuarioService.obtenerViajeroPorEmail(email)
        .orElseThrow(() -> new ResourceNotFoundException("El " + userType + " con ese email no existe : " + email));
      respuesta.put("usuario", viajero);
      userID = viajero.getId();
    }

    Biografias biografia = biografiasService.obtenerBiografia(tipo_user, userID).orElse(null);
    List<Valoraciones> valoraciones = valoracionesService.obtenerListaValoracionesConexionesRecibidas(userID, tipo_user);

    respuesta.put("biografia", biografia != null ? biografia : new Biografias());
    respuesta.put("valoraciones" , valoraciones);

    return ResponseEntity.ok(respuesta);
  }

  /**
   * Obtiene un usuario a través de su ID privado y, si existe, también su biografía.
   * @param privateID ID privado del usuario
   * @return ResponseEntity con el usuario encontrado y, si está disponible, su biografía. Si no existe, lanza una excepción.
   */
  @GetMapping("/private-id/{privateID}")
  public ResponseEntity<Map<String, Object>> obtenerUsuarioPorPrivateID(@PathVariable String privateID) {
    String tipo_user = userType.equals("anfitrion") ? "anfitriones" : "viajeros";
    Map<String, Object> respuesta = new HashMap<>();

    if(tipo_user.equals("anfitriones")){
      Anfitrion anfitrion = gestorUsuarioService.obtenerAnfitrionPorIDPrivado(privateID)
        .orElseThrow(() -> new ResourceNotFoundException("El " + userType + " con ese privateID no existe : " + privateID));

      respuesta.put("usuario", anfitrion);
    }

    else {
      Viajero viajero = gestorUsuarioService.obtenerViajeroPorIDPrivado(privateID)
        .orElseThrow(() -> new ResourceNotFoundException("El " + userType + " con ese privateID no existe : " + privateID));

      respuesta.put("usuario", viajero);
    }
    return ResponseEntity.ok(respuesta);
  }


  /**
   * Crea un usuario
   * @param user Objeto usuario
   * @return Objeto usuario creado
   */
  // @RequestBody : convierte el cuerpo de la solicitud HTTP (JSON) en un objeto Java (Usuario) para ser procesado en el metodo.
  @PostMapping("/auth/register")
  @Transactional
  public T crearUsuario(@RequestBody T user){
    if(user == null || usuarioService.existsByEmail(user.getEmail()) || user.getEmail().isBlank() || user.getTelefono() == null || !user.getTelefono().matches("\\d{9}")){
      return null;
    }

    // Ciframos su contraseña enviada
    user.setCifrarPasword(user.getPassword());
    return repository.save(user);
  }

  // Subir la imagen enviada a ImgBB y devolver su ruta de acceso
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
  @Transactional
  public ResponseEntity<T> actualizarUsuario(@PathVariable Long userID, @RequestBody T userRequest){
    T user = repository.findById(userID)
      .orElseThrow(() -> new ResourceNotFoundException("El " + userType + " con ese ID no existe : " + userID));

    // Actualizar los valores de cada campo que no sean null
    Optional.ofNullable(userRequest.getPrivateID()).ifPresent(user::setPrivateID);
    Optional.ofNullable(userRequest.getEmail()).ifPresent(user::setEmail);
    Optional.ofNullable(userRequest.getTelefono()).filter( t -> t.matches("\\d{9}")).ifPresent(user::setTelefono);
    Optional.ofNullable(userRequest.getPassword()).ifPresent(user::setCifrarPasword);
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
  @Transactional
  public ResponseEntity<Map<String,Boolean>> eliminarUsuario(Long userID, String tipo_usuario){
    T user = repository.findById(userID)
      .orElseThrow(() -> new ResourceNotFoundException("El " + userType + " con ese ID no existe : " + userID));

    Map<String, Boolean> respuesta = new HashMap<>();

    if(user instanceof Viajero){
      ((Viajero) user).getReservas().forEach(reserva -> reserva.setViajero_eliminado(true));
      reservasRepository.saveAll( ((Viajero) user).getReservas());
    }

    // Eliminar vivienda y reservas que haya con el si es anfitrion
    else if(user instanceof Anfitrion){
      ((Anfitrion) user).setVivienda(null);
      respuesta.put("Vivienda delete ", true); // Contenido asociado (Recomendaciones/Experiencias)
      ((Anfitrion) user).getReservas().forEach(reserva -> reserva.setAnfitrion_eliminado(true));
      reservasRepository.saveAll( ((Anfitrion) user).getReservas());
    }

    repository.save(user); // Guardar los cambios de la reserva
    respuesta.put("Reservas delelete ", true);

    // Eliminar todo lo asociado al usuario
    String tipo_user = userType.equals("anfitrion") ? "anfitriones" : "viajeros";
    respuesta.put("Contenido delete ", this.eliminarTodoContenido(userID).getBody().get("delete")); // Contenido asociado (Recomendaciones/Experiencias)
    respuesta.put("Biografia delete", biografiasService.eliminarBiografia(tipo_usuario, userID)); // Biografia asociada
    respuesta.put("Valoraciones delete ", valoracionesService.eliminarValoracionesConexiones(userID, tipo_user).getBody().get("delete")); // Valoraciones recibidas y dadas
    respuesta.put("Likes delete ", likesService.eliminarValoracionesConexiones(userID, tipo_user).getBody().get("delete")); // Likes recibidas y dadas

    // Eliminar el usuario y su token creado
    List<Token> token = tokenRepository.findAllByUserIDAndTipoUsuario(user.getId(), userType.equals("anfitrion") ? 0 : 1);
    if(!token.isEmpty()){
      tokenRepository.deleteAll(token);
    }

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
  @Transactional
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

    // Buscar si hay un cotenido con el nuevo titulo (en ese caso lanzar excepción)
    for (TC contenidoUser : user.getContenido()) {
      if (!contenidoUser.equals(contenido) && contenidoUser.getTitulo().equalsIgnoreCase(infoContenido.getTitulo())) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body("Ya existe una " + contenidoType + " con ese titulo");
      }
    }

    // Modificar valores (los importantes deben ser no nulos)
    Optional.ofNullable(infoContenido.getTitulo()).ifPresent(contenido::setTitulo);
    Optional.ofNullable(infoContenido.getDescripcion()).ifPresent(contenido::setDescripcion);
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

  /**
   * Eliminar una Experiencia o Recomendacion
   * @param userID ID del usuario
   * @param titulo Titulo del contenido
   * @return Booleanos indicando si se ha eliminado no
   */
  @Transactional
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
  @Transactional
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
