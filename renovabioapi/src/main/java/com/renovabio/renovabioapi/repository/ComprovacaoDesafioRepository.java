package com.renovabio.renovabioapi.repository;

import com.renovabio.renovabioapi.model.ComprovacaoDesafio;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ComprovacaoDesafioRepository extends JpaRepository<ComprovacaoDesafio, Long> {
    List<ComprovacaoDesafio> findByUsuarioDesafioIdOrderByDataEnvioAsc(Long usuarioDesafioId);

    boolean existsByUsuarioDesafioIdAndDataEnvioBetween(
            Long usuarioDesafioId,
            LocalDateTime inicioDoDia,
            LocalDateTime fimDoDia
    );
}
