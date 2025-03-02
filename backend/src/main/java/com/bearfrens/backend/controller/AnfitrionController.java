package com.bearfrens.backend.controller;

import com.bearfrens.backend.entity.Anfitrion;
import com.bearfrens.backend.repository.AnfitrionRepository;
import org.springframework.web.bind.annotation.*;

// Permitir que nuestra aplicación deje que react desde es enlace acceda a los datos
@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/anfitriones")
public class AnfitrionController extends BaseController<Anfitrion, AnfitrionRepository> {

  public AnfitrionController(AnfitrionRepository repository) {
    super(repository, "anfitrion");
  }

//  @DeleteMapping("/{id}")
//  public ResponseEntity<Map<String,Boolean>> eliminarImagenDePerfil(@PathVariable Long id) {
//
//  }

}
