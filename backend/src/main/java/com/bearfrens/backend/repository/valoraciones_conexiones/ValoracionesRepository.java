package com.bearfrens.backend.repository.valoraciones_conexiones;

import com.bearfrens.backend.entity.valoracione_conexiones.Valoraciones;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ValoracionesRepository extends ValoracionesConexionesRepository<Valoraciones> {
  // - Optional      → Variable que puede tener un valor asignado o que puede contener un valor null
  // - "findBy"      → Indica que se trata de una consulta de búsqueda en la base de datos.
  // - "UsuarioID"   → Busca registros donde la columna "usuarioID" coincida con el valor proporcionado.
  // - "And"         → Conecta dos condiciones (operador lógico "AND").
  // - "TipoUsuario" → También debe coincidir con el valor de la columna "tipo_usuario".
  // Capitaliza los registros pasados
  Optional<Valoraciones> findByEmisorIDAndUsuarioIDAndTipoUsuario(Long emisorID, Long usuarioID, int tipoUsuario);
}
