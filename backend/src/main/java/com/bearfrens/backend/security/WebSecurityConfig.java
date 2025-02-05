package com.bearfrens.backend.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;

import java.util.List;

@Configuration
@EnableWebSecurity
public class WebSecurityConfig {

  // @Bean : Indica que un metodo devuelve un objeto que debe ser gestionado y utilizado como un componente dentro del contexto de Spring.
  // Definimos que solo ciertos usuarios tengan acceso a ciertas rutas de la api
  /*
  @Bean
  public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    http.cors(cors -> cors.configurationSource(request -> {
      CorsConfiguration config = new CorsConfiguration();
      config.setAllowedOrigins(List.of("http://localhost:3000")); // Permitir frontend local
      config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE"));
      config.setAllowedHeaders(List.of("Authorization", "Content-Type"));
      config.setAllowCredentials(true);
      return config;
     }))
      .authorizeHttpRequests(request -> request.requestMatchers("/api/anfitriones/**").hasRole("ADMIN")) // Solo Admins acceden
      .csrf(csrf -> csrf.disable()) // Desactiva CSRF si usas JWT
      .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)) // Sin sesiones
      .addFilterBefore(jwtAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class);

     return http.build();
    }
    */

  // Versión SIN Seguridad (SOLO PARA DESARROLLO)
  @Bean
  public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    http.cors(cors -> cors.configurationSource(request -> {
          CorsConfiguration config = new CorsConfiguration();
          config.setAllowedOrigins(List.of("http://localhost:3000")); // Permitir frontend local
          config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE"));
          config.setAllowedHeaders(List.of("*")); // Permitir todos los headers temporalmente
          config.setAllowCredentials(true);
          return config;
        }))
        .authorizeHttpRequests(request -> request.anyRequest().permitAll()) // Permitir todas las solicitudes
        .csrf(csrf -> csrf.disable()) // Desactivar CSRF solo en desarrollo
        .httpBasic(Customizer.withDefaults()); // Permitir autenticación básica pero sin exigirla

    return http.build();
  }


  // Creamos un usuario en memoria con nombre, password y rol
  @Bean
  public UserDetailsService testUser(PasswordEncoder passwordEncoder) {
    User.UserBuilder user = User.builder();
    UserDetails user1 = user.username("pablo")
        .password(passwordEncoder.encode("adminpablo"))
        .roles("ADMIN")
        .build();
    return new InMemoryUserDetailsManager(user1); // gestiona los detalles de los usuarios almacenados temporalmente en memoria.
  }

  @Bean
  public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
  }
}