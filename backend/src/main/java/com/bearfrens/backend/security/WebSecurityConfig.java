package com.bearfrens.backend.security;

import com.bearfrens.backend.entity.token.Token;
import com.bearfrens.backend.repository.token.TokenRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;

import java.util.List;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class WebSecurityConfig {

  private final AuthenticationProvider authenticationProvider;
  private final JwtAuthFilter jwtAuthFilter;
  private final TokenRepository tokenRepository;


  // FILTRO DE SEGURIDAD)
  @Bean
  public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    http
      .csrf(AbstractHttpConfigurer::disable) // Desactiva la protección CSRF
//        .authorizeHttpRequests(req -> req
//            .requestMatchers("/api/auth/login", "/api/anfitriones/auth/register", "/api/viajeros/auth/register") // Permite el acceso sin autenticación a estas rutas
//            .permitAll()
//            .anyRequest() // El resto de rutas
//            .authenticated() // Requieren autenticación
//        )
      .authorizeHttpRequests(req -> req
        .anyRequest().permitAll()
      )
      .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)) // Define que no se usarán sesiones, se trabaja con JWT
        .authenticationProvider(authenticationProvider) // Usa el proveedor de autenticación definido (donde se carga el usuario y se verifica contraseña)
        .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)  // Añade el filtro JWT antes del filtro estándar de autenticación por usuario y contraseña
          .logout(logout -> // Configura el proceso de logout
            logout.logoutUrl("/auth/logout")  // Ruta para hacer logout
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
    final Token foundToken = tokenRepository.findByToken(token)
      .orElseThrow(() -> new IllegalArgumentException("Invalid token"));
    foundToken.setExpired(true);
    foundToken.setRevoked(true);
    tokenRepository.save(foundToken);
  }
}