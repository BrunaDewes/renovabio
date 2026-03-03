package com.renovabio.renovabioapi.repository;

import com.renovabio.renovabioapi.model.AcaoUsuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AcaoUsuarioRepository extends JpaRepository<AcaoUsuario, Long> {
    // métodos prontos --> save(), findAll(), findById(), deleteById()
}