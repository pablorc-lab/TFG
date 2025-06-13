package com.bearfrens.backend.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

import java.io.Serial;

@ResponseStatus(value = HttpStatus.CONFLICT)
public class ResourceConflictException extends RuntimeException {

  @Serial
  private static final long serialVersionUID = 1L;

  public ResourceConflictException(String message) {
    super(message);
  }
}