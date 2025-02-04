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

@Configuration
@EnableWebSecurity
public class WebSecurityConfig {

  // @Bean : Indica que un metodo devuelve un objeto que debe ser gestionado y utilizado como un componente dentro del contexto de Spring.
  // Definimos que solo ciertos usuarios tengan acceso a ciertas rutas de la api
  @Bean
  public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    // Solo permite acceso a usuarios con el rol "ADMIN"
    http.authorizeHttpRequests(request -> request.requestMatchers("/api/**").hasRole("ADMIN"))
        .httpBasic(Customizer.withDefaults())
        .csrf(csrf -> csrf.disable());
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