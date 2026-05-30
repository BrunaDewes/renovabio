package com.renovabio.renovabioapi.repository;

import com.renovabio.renovabioapi.model.RecuperacaoSenha;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RecuperacaoSenhaRepository extends JpaRepository<RecuperacaoSenha, Long> {

    Optional<RecuperacaoSenha> findFirstByEmailAndUsadoFalseOrderByCriadoEmDesc(String email);
}
