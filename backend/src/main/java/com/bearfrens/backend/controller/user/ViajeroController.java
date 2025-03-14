package com.bearfrens.backend.controller.user;

import com.bearfrens.backend.entity.user.Viajero;
import com.bearfrens.backend.repository.user.ViajeroRepository;
import org.springframework.web.bind.annotation.*;



// Permitir que nuestra aplicación deje que react desde es enlace acceda a los datos
@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/viajeros")
public class ViajeroController extends BaseUserController<Viajero, ViajeroRepository> {

  public ViajeroController(ViajeroRepository repository) {
    super(repository,"viajero");
  }
}
