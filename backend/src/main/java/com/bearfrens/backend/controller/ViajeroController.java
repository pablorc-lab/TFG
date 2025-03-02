package com.bearfrens.backend.controller;

import com.bearfrens.backend.entity.Viajero;
import com.bearfrens.backend.repository.ViajeroRepository;
import org.springframework.web.bind.annotation.*;



// Permitir que nuestra aplicación deje que react desde es enlace acceda a los datos
@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/viajeros")
public class ViajeroController extends BaseController<Viajero, ViajeroRepository> {

  public ViajeroController(ViajeroRepository repository) {
    super(repository,"viajero");
  }
}
