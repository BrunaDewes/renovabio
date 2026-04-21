package com.renovabio.renovabioapi.repository;

import com.renovabio.renovabioapi.model.ComprovacaoDesafio;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ComprovacaoDesafioRepository extends JpaRepository<ComprovacaoDesafio, Long> {
    List<ComprovacaoDesafio> findByUsuarioDesafioIdOrderByDataEnvioAsc(Long usuarioDesafioId);
}
