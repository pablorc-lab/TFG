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
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Arrays;
import java.util.Base64;
import java.util.Collections;

@Component
@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {

  private final JwtService jwtService;
  private final UserDetailsService userDetailsService;
  private final TokenRepository tokenRepository;
  private final UsuarioService usuarioService;

  // Por cada petición que no esté en "auth" comprobar los filtros para dejar pasar o no
  @Override
  protected void doFilterInternal(@NonNull HttpServletRequest request, @NonNull HttpServletResponse response, @NonNull FilterChain filterChain) throws ServletException, IOException {
    // Si se hace en "auth" terminar
    if (request.getServletPath().contains("/auth")){
      filterChain.doFilter(request, response);
      return;
    }

    // Si el header es nulo o no válido, terminar
    final String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);

    // Verificar si el header es Basic y permitir a un admin
    if (authHeader != null && authHeader.startsWith("Basic ")) {
      String basicAuth = authHeader.substring(6);  // Obtener el valor del Basic Auth (username:password en base64)

      // Decodificar las credenciales
      String decodedAuth = new String(Base64.getDecoder().decode(basicAuth));
      String[] credentials = decodedAuth.split(":");  // Separar el nombre de usuario y la contraseña
      if (credentials.length == 2) {
        String username = credentials[0];
        String password = credentials[1];

        // Verificar si el usuario es admin
        if (username.equals("admin@admin.com") && password.equals("admin123")) {
          // Representar que el admin se ha autenticado correctamente
          Authentication authentication = new UsernamePasswordAuthenticationToken(username, password, Collections.singletonList(new SimpleGrantedAuthority("ADMIN")));
          SecurityContextHolder.getContext().setAuthentication(authentication); // Aquí, el usuario es un admin, por lo que permitimos el acceso
          filterChain.doFilter(request, response);
          return;
        }
      }
    }

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

    // Obtener el usuario gracias al email, y si es null terminar
    final UserDetails userDetails = this.userDetailsService.loadUserByUsername(userEmail);
    final Usuario<?> usuario = usuarioService.findByEmail(userDetails.getUsername());
    if(usuario == null){
      filterChain.doFilter(request,response);
      return;
    }

    // Si el token no es válido, terminar
    final boolean isTokenValid = jwtService.isTokenValid(jwtToken, usuario);
    if(!isTokenValid){
      return;
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
