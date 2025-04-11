package com.bearfrens.backend.repository.token;

import com.bearfrens.backend.entity.token.Token;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TokenRepository extends JpaRepository<Token, Long> {
  List<Token> findAllByUserIDAndTipoUsuario(Long userID, int tipo_usuario);
  List<Token> findExpiredIsFalseOrRevokedIsFalseByUserIDAndTipoUsuario(Long userID, int tipo_usuario);
  Optional<Token> findByToken(String token);
}
