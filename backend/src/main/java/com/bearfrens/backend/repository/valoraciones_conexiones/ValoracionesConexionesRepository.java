package com.bearfrens.backend.repository.valoraciones_conexiones;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.NoRepositoryBean;

import java.util.List;
import java.util.Optional;

// Repositorio común
@NoRepositoryBean
public interface ValoracionesConexionesRepository<T> extends JpaRepository<T, Long> {
  // - Optional      → Variable que puede tener un valor asignado o que puede contener un valor null
  // - "findBy"      → Indica que se trata de una consulta de búsqueda en la base de datos.
  // - "UsuarioID"   → Busca registros donde la columna "usuarioID" coincida con el valor proporcionado.
  // - "And"         → Conecta dos condiciones (operador lógico "AND").
  // - "TipoUsuario" → También debe coincidir con el valor de la columna "tipo_usuario".
  // Capitaliza los registros pasados
  List<T> findAllByEmisorIDAndTipoUsuario(Long emisorID, int tipoUsuario);
  List<T> findAllByUsuarioIDAndTipoUsuario(Long usuarioID, int tipoUsuario);
  Optional<T> findByEmisorIDAndUsuarioIDAndTipoUsuario(Long emisorID, Long usuarioID, int tipoUsuario);
}
