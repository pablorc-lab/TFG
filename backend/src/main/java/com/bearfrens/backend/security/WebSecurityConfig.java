package com.bearfrens.backend.security;

import com.bearfrens.backend.entity.token.Token;
import com.bearfrens.backend.repository.token.TokenRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class WebSecurityConfig {

  private final AuthenticationProvider authenticationProvider;
  private final JwtAuthFilter jwtAuthFilter;
  private final TokenRepository tokenRepository;

  @Bean
  public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();
    configuration.setAllowedOrigins(List.of("http://localhost:3000"));
    configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE"));
    configuration.setAllowedHeaders(List.of("Authorization", "Content-Type"));
    configuration.setAllowCredentials(true);
    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", configuration);
    return source;
  }

  // FILTRO DE SEGURIDAD
  @Bean
  public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    http
      .csrf(AbstractHttpConfigurer::disable) // Desactiva la protección CSRF
      .cors(cors -> cors.configurationSource(corsConfigurationSource())) // Habilita la configuración CORS
      .authorizeHttpRequests(req -> req
            .requestMatchers("/api/auth/login", "/api/auth/logout", "/api/anfitriones/auth/register", "/api/viajeros/auth/register").permitAll() // Permite el acceso sin autenticación a estas rutas
            .anyRequest().authenticated()
        )
      .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)) // Define que no se usarán sesiones, se trabaja con JWT
        .authenticationProvider(authenticationProvider) // Usa el proveedor de autenticación definido (donde se carga el usuario y se verifica contraseña)
        .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)  // Añade el filtro JWT antes del filtro estándar de autenticación por usuario y contraseña
          .logout(logout -> // Configura el proceso de logout
            logout.logoutUrl("/api/auth/logout")  // Ruta para hacer logout
              .addLogoutHandler((request, response, authentication) -> { // Obtiene el token
                final var authHeader = request.getHeader(HttpHeaders.AUTHORIZATION); // Llama al método personalizado para invalidar el token
                logout(authHeader); // Llama al método personalizado para invalidar el token
              })
              .logoutSuccessHandler(((request, response, authentication) -> // Limpia el contexto de seguridad tras logout
                SecurityContextHolder.clearContext()))
            );

    return http.build(); // Construye la cadena de filtros
  }

  private void logout(final String token){
    if (token == null || !token.startsWith("Bearer ")){
      throw new IllegalArgumentException("Invalid Bearer token");
    }

    final String jwtToken = token.substring(7);
    final Token foundToken = tokenRepository.findByToken(jwtToken)
      .orElseThrow(() -> new IllegalArgumentException("Invalid token"));
    foundToken.setExpired(true);
    foundToken.setRevoked(true);
    tokenRepository.save(foundToken);
  }
}