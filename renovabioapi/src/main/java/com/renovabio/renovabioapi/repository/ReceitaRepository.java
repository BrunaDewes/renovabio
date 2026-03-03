package com.renovabio.renovabioapi.repository;

import com.renovabio.renovabioapi.model.Receita;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReceitaRepository extends JpaRepository<Receita, Long> {
    // métodos prontos --> save(), findAll(), findById(), deleteById()
}