package com.bearfrens.backend.repository.token;

import com.bearfrens.backend.entity.token.Token;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TokenRepository extends JpaRepository<Token, Long> {
}
