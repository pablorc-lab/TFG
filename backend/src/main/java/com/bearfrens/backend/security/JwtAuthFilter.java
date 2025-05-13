package com.bearfrens.backend.security;

import com.bearfrens.backend.entity.token.Token;
import com.bearfrens.backend.entity.user.Usuario;
import com.bearfrens.backend.repository.token.TokenRepository;
import com.bearfrens.backend.service.UsuarioService;
import com.bearfrens.backend.service.authentication.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {

  private final JwtService jwtService;
  private final UserDetailsService userDetailsService;
  private final TokenRepository tokenRepository;
  private final UsuarioService usuarioService;

  @Value("${ADMIN_EMAIL}")
  private String adminEmail;

  @Value("${ADMIN_PASSWORD}")
  private String adminPassword;

  // Por cada petición que no esté en "auth" comprobar los filtros
  @Override
  protected void doFilterInternal(@NonNull HttpServletRequest request, @NonNull HttpServletResponse response, @NonNull FilterChain filterChain) throws ServletException, IOException {
    // Si se hace en "auth" terminar
    if (request.getServletPath().contains("/auth")){
      filterChain.doFilter(request, response);
      return;
    }

    // Si el header es nulo o no válido, terminar
    final String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
    if (authHeader == null || !authHeader.startsWith(("Bearer "))){
      filterChain.doFilter(request,response);
      return;
    }

    // Si el email del token no es válido o hay alguien identificado actualmente, terminar
    final String jwtToken = authHeader.substring(7);
    final String userEmail = jwtService.extractUsername(jwtToken);
    if(userEmail == null || SecurityContextHolder.getContext().getAuthentication() != null){
      filterChain.doFilter(request,response);
      return;
    }

    // Si ese token no existe en la BD, o está expirado o revocado, terminado
    final Token token = tokenRepository.findByToken(jwtToken).orElse(null);
    if(token == null || token.isExpired() || token.isRevoked()){
      filterChain.doFilter(request,response);
      return;
    }

    // Realizar una accion sea admin o usuario
    final UserDetails userDetails;
    final Usuario<?> usuario;

    if (userEmail.equals(adminEmail)) {
      userDetails = User.builder()
        .username(adminEmail)
        .password(adminPassword)
        .roles("ADMIN")
        .build();

      // No hay usuario en la base de datos, por lo tanto es null
      usuario = null;

      if (!jwtService.isAdminTokenValid(jwtToken, adminEmail)) {
        filterChain.doFilter(request, response);
        return;
      }

    }

    // Obtener el usuario gracias al email, y si es null terminar
    else {
      userDetails = this.userDetailsService.loadUserByUsername(userEmail);
      usuario = usuarioService.findByEmail(userDetails.getUsername());

      // Si el token no es válido, terminar
      if (usuario == null || !jwtService.isTokenValid(jwtToken, usuario)) {
        filterChain.doFilter(request, response);
        return;
      }
    }

    final var authToken = new UsernamePasswordAuthenticationToken(
      userDetails,
      null,
      userDetails.getAuthorities()
    );
    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
    SecurityContextHolder.getContext().setAuthentication(authToken);

    filterChain.doFilter(request,response);
  }
}
