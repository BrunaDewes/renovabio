package com.renovabio.renovabioapi.repository;

import com.renovabio.renovabioapi.model.TrocaRecompensa;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TrocaRecompensaRepository extends JpaRepository<TrocaRecompensa, Long> {
    // métodos prontos --> save(), findAll(), findById(), deleteById()
}