package com.bearfrens.backend.repository.user;

import com.bearfrens.backend.entity.user.Anfitrion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface AnfitrionSpecificationRepository extends JpaRepository<Anfitrion, Long>, JpaSpecificationExecutor<Anfitrion> {

}
