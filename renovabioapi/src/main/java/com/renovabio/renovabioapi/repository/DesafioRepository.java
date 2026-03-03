package com.renovabio.renovabioapi.repository;

import com.renovabio.renovabioapi.model.Desafio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DesafioRepository extends JpaRepository<Desafio, Long> {
    // métodos prontos --> save(), findAll(), findById(), deleteById()
}