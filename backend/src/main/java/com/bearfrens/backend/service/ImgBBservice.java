package com.bearfrens.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Collections;
import java.util.Map;

@Service
public class ImgBBservice {

  @Value("${IMGBB_API_KEY}")
  private String imgBB_Api_Key;

  public Map<String, Object> uploadImage(MultipartFile image) throws IOException {
    String url = "https://api.imgbb.com/1/upload?key=" + imgBB_Api_Key;

    // Crear el recurso de la imagen como un ByteArrayResource para enviarlo como formulario
    ByteArrayResource imageResource = new ByteArrayResource(image.getBytes()) {
      @Override
      public String getFilename() {
        return image.getOriginalFilename();
      }
    };

    // Configurar el cuerpo
    MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
    body.add("image", imageResource);

    // Configurar los headers
    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.MULTIPART_FORM_DATA); // Indica que se envia un archivo

    // Crear la solicitud HTTP (combinando body y header)
    HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);

    // Enviar la solicitud HTTP POST a ImgBB
    RestTemplate restTemplate = new RestTemplate();
    ResponseEntity<Map> response = restTemplate.postForEntity(url, requestEntity, Map.class);

    // Verificar que la respuesta no sea nula y tenga el formato correcto
    if (response.getStatusCode() == HttpStatus.OK) {
      return response.getBody(); // Cast explícito
    }

    return Collections.singletonMap("error", "Error al subir la imagen");
  }
}
