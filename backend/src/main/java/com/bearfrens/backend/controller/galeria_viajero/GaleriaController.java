package com.bearfrens.backend.controller.galeria_viajero;

import com.bearfrens.backend.entity.user.Viajero;
import com.bearfrens.backend.service.galeria_viajero.GaleriaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/viajeros")
public class GaleriaController {

  @Autowired
  private GaleriaService galeriaService;

  @GetMapping("/galeria/{viajeroID}")
  public ResponseEntity<?> obtenerGaleria(@PathVariable Long viajeroID) {
    return galeriaService.obtenerGaleria(viajeroID);
  }

  @PostMapping("/galeria/crear/{viajeroID}")
  public ResponseEntity<?> crearGaleria(@PathVariable Long viajeroID, @RequestBody Viajero infoGaleria) {
    return galeriaService.crearGaleria(viajeroID, infoGaleria);
  }

  @PutMapping("/galeria/{viajeroID}")
  public ResponseEntity<?> editarGaleria(@PathVariable Long viajeroID, @RequestBody Viajero infoGaleria) {
    return galeriaService.editarGaleria(viajeroID, infoGaleria);
  }
}
