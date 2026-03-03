package com.renovabio.renovabioapi.repository;

import com.renovabio.renovabioapi.model.Recompensa;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RecompensaRepository extends JpaRepository<Recompensa, Long> {
    // métodos prontos --> save(), findAll(), findById(), deleteById()
}