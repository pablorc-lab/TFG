package com.bearfrens.backend.repository.valoraciones;

import com.bearfrens.backend.entity.valoraciones.Valoraciones;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ValoracionesRepository extends JpaRepository<Valoraciones, Long> {
  // - Optional      → Variable que puede tener un valor asignado o que puede contener un valor null
  // - "findBy"      → Indica que se trata de una consulta de búsqueda en la base de datos.
  // - "UsuarioID"   → Busca registros donde la columna "usuarioID" coincida con el valor proporcionado.
  // - "And"         → Conecta dos condiciones (operador lógico "AND").
  // - "TipoUsuario" → También debe coincidir con el valor de la columna "tipo_usuario".
  // Capitaliza los registros pasados
  Optional<Valoraciones> findByEmisorIDAndUsuarioIDAndTipoUsuario(Long emisorID, Long usuarioID, int tipoUsuario);
  List<Valoraciones> findAllByEmisorIDAndTipoUsuario(Long emisorID, int tipoUsuario);
  List<Valoraciones> findAllByUsuarioIDAndTipoUsuario(Long usuarioID, int tipoUsuario);
}
