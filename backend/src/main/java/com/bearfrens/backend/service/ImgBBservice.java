package com.bearfrens.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Base64;
import java.util.Collections;
import java.util.Map;

// Este service enviará la imagen a la API de ImgBB usando la Key privada
@Service
public class ImgBBservice {

  @Value("${IMGBB_API_KEY}")
  private String imgBB_Api_Key;

  public Map<String, Object> uploadImage(MultipartFile image) throws IOException {
    String url = "https://api.imgbb.com/1/upload?key=" + imgBB_Api_Key;

    // Convertir la imagen a base64
    String imageBase64 = Base64.getEncoder().encodeToString(image.getBytes());

    // Configurar el cuerpo de la solicitud para enviar la imagen en base64
    MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
    body.add("image", imageBase64); // Agregar la imagen como cadena base64

    // Configurar los headers
    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.MULTIPART_FORM_DATA); // El tipo es multipart/form-data

    // Crear la solicitud HTTP (combinando body y header)
    HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);

    // Enviar la solicitud HTTP POST a ImgBB
    RestTemplate restTemplate = new RestTemplate();
    ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
      url, HttpMethod.POST, requestEntity, new ParameterizedTypeReference<Map<String, Object>>() {}
    );

    // Verificar que la respuesta no sea nula y tenga el formato correcto
    return response.getStatusCode().is2xxSuccessful()
      ? response.getBody()
      : Collections.singletonMap("error", "Error al subir la imagen");
    }
}
