package com.bearfrens.backend.repository.biografias;

import com.bearfrens.backend.entity.biografias.Biografias;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BiografiasRepository extends JpaRepository<Biografias, Long> {
  // - Optional      → Variable que puede tener un valor asignado o que puede contener un valor null
  // - "findBy"      → Indica que se trata de una consulta de búsqueda en la base de datos.
  // - "UsuarioID"   → Busca registros donde la columna "usuarioID" coincida con el valor proporcionado.
  // - "And"         → Conecta dos condiciones (operador lógico "AND").
  // - "TipoUsuario" → También debe coincidir con el valor de la columna "tipo_usuario".
  // Capitaliza los registros pasados
  Optional<Biografias> findByUsuarioIDAndTipoUsuario(Long usuarioID, int tipoUsuario);
  List<Biografias> findAllByTipoUsuario(int tipoUsuario);
}
