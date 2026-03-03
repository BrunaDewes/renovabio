package com.renovabio.renovabioapi.repository;

import com.renovabio.renovabioapi.model.Parceiro;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ParceiroRepository extends JpaRepository<Parceiro, Long> {
    // métodos prontos --> save(), findAll(), findById(), deleteById()
}