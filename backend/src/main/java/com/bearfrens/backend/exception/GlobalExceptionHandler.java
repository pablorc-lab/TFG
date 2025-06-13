package com.bearfrens.backend.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

  @ExceptionHandler(ResourceNotFoundException.class)
  public ResponseEntity<Map<String, Object>> handleResourceNotFoundException(ResourceNotFoundException ex) {
    Map<String, Object> errorBody = new LinkedHashMap<>();
    errorBody.put("timestamp", LocalDateTime.now());
    errorBody.put("status", HttpStatus.NOT_FOUND.value());
    errorBody.put("error", "Not Found");
    errorBody.put("message", ex.getMessage());
    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorBody);
  }

  @ExceptionHandler(ResourceConflictException.class)
  public ResponseEntity<Map<String, Object>> handleResourceConflictException(ResourceConflictException ex) {
    Map<String, Object> errorBody = new LinkedHashMap<>();
    errorBody.put("timestamp", LocalDateTime.now());
    errorBody.put("status", HttpStatus.CONFLICT.value());
    errorBody.put("error", "Conflict");
    errorBody.put("message", ex.getMessage());
    return ResponseEntity.status(HttpStatus.CONFLICT).body(errorBody);
  }

}
