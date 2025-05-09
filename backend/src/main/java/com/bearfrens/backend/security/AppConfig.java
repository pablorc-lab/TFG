package com.bearfrens.backend.security;

import com.bearfrens.backend.entity.user.Usuario;
import com.bearfrens.backend.service.UsuarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Configuration
@RequiredArgsConstructor
public class AppConfig {

  private final UsuarioService usuarioService;

  /**
   * Método que configura el servicio que Spring Security utiliza para cargar los detalles del
   * usuario    * durante el proceso de autenticación. Este servicio buscará un usuario por su
   * email y devolverá  un objeto que contiene la información necesaria para la autenticación
   * y autorización del usuario.
   *
   * @return Un servicio de detalles de usuario (UserDetailsService) que devuelve un objeto
   * UserDetails basado en el email del usuario.
   */
  @Bean
  public UserDetailsService userDetailsService() {
    return username -> {
      if (username.equals("admin@admin.com")) {
        return org.springframework.security.core.userdetails.User.builder()
          .username("admin@admin.com")
          .password(new BCryptPasswordEncoder().encode("admin123")) // Usa una contraseña segura en proyectos reales
          .roles("ADMIN")
          .build();
      }

      final Usuario<?> usuario = usuarioService.findByEmail(username);
      return org.springframework.security.core.userdetails.User.builder()
        .username(usuario.getEmail())
        .password(usuario.getPassword())
        .build();
    };
  }

  /**
   * Configura y expone un AuthenticationProvider como bean para el contexto de Spring Security.
   * Este proveedor usará la lógica definida en userDetailsService() y BCrypt para verificar contraseñas.
   *
   * @return AuthenticationProvider configurado.
   */
  @Bean
  public AuthenticationProvider authenticationProvider(){
    DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
    authProvider.setUserDetailsService(userDetailsService());
    authProvider.setPasswordEncoder(new BCryptPasswordEncoder());
    return authProvider;
  }

  /**
   * Crear un bean de AuthenticationManager necesario para la autenticación en Spring Security.
   * Este método obtiene una instancia del AuthenticationManager configurada automáticamente
   * por Spring a partir de la configuración de seguridad definida, incluyendo el proveedor
   * de autenticación y el UserDetailsService.
   *
   * @param config configuración de autenticación de Spring
   * @return instancia del AuthenticationManager
   * @throws Exception si no puede obtenerse el AuthenticationManager
   */
  @Bean
  public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
    return config.getAuthenticationManager();
  }
}
