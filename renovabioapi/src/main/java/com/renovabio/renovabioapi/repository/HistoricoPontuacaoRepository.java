package com.renovabio.renovabioapi.repository;

import com.renovabio.renovabioapi.model.HistoricoPontuacao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface HistoricoPontuacaoRepository extends JpaRepository<HistoricoPontuacao, Long> {
    // métodos prontos --> save(), findAll(), findById(), deleteById()
}