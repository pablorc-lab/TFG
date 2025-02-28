package com.bearfrens.backend.controller;

import com.bearfrens.backend.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

  @Autowired
  private UsuarioService usuarioService;

  @GetMapping("/existe/{email}")
  public ResponseEntity<Boolean> verificarEmail(@PathVariable String email) {
    boolean existe = usuarioService.existsByEmail(email);
    return ResponseEntity.ok(existe);
  }
}
