package com.bearfrens.backend.controller;

import com.bearfrens.backend.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api")
public class UsuarioController {

  @Autowired
  private UsuarioService usuarioService;

  @GetMapping("/usuarios/existe/{email}")
  public ResponseEntity<Boolean> verificarEmail(@PathVariable String email) {
    boolean existe = usuarioService.existsByEmail(email);
    return ResponseEntity.ok(existe);
  }

}
