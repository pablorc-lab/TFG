package com.bearfrens.backend;

import io.jsonwebtoken.Jwts;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.util.Date;
import java.util.Map;

@SpringBootApplication
public class BearfrensBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(BearfrensBackendApplication.class, args);
		System.out.println(
			Jwts.builder()
			.id("Anfitrión-") // ID único para el token
			.claims(Map.of("nombre", "pedro")) // Agregar el nombre como claim
			.subject("email@ejemplo") // El email como el sujeto del token
			.issuedAt(new Date(System.currentTimeMillis())) // Fecha de emisión del token
			.expiration(new Date(System.currentTimeMillis())) // Fecha de expiración del token
			.compact()// Generar y devolver el token JWT);
		);
	}

}