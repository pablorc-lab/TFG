package com.bearfrens.backend;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class BearfrensBackendApplication {
	private static String imgBBApiKey;

	@Value("${IMGBB_API_KEY}")
	public void setImgBBApiKey(String apiKey) {
		imgBBApiKey = apiKey;
	}

	public static void main(String[] args) {
		SpringApplication.run(BearfrensBackendApplication.class, args);
		System.out.println("API Key: " + imgBBApiKey);
	}

}
