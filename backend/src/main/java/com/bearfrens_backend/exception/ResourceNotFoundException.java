package com.bearfrens_backend.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

import java.io.Serial;

// @ResponseStatus : Cuando sea lanzada, la aplicación responderá automáticamente con un código de estado HTTP 404 (Not Found).
@ResponseStatus(value = HttpStatus.NOT_FOUND)
public class ResourceNotFoundException extends RuntimeException{

  // Garantiza la compatibilidad de la serialización evitando errores al deserializar una clase modificada.
  @Serial
  private static final long serialVersionUID = 1L;

  // Recibe un mensaje y lo pasa a la clase RuntimeException
  public ResourceNotFoundException(String message) {
    super(message);
  }
}
