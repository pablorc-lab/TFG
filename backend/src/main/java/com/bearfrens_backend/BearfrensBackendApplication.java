package com.bearfrens_backend;

import com.bearfrens_backend.entity.Viajero;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import static java.lang.System.*;

@SpringBootApplication
public class BearfrensBackendApplication {

	public static void main(String[] args) {
		//SpringApplication.run(BearfrensBackendApplication.class, args);
			Viajero viajero1 = new Viajero("idpablolab", "pablo", "ramblado", 72, "pablo@correo.es.example", "contraseniasincinfrar");
		System.out.println(viajero1.toString());
	}

}
