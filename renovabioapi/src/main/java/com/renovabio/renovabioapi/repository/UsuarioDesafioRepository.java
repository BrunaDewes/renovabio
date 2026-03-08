package com.renovabio.renovabioapi.repository;

import com.renovabio.renovabioapi.model.UsuarioDesafio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UsuarioDesafioRepository extends JpaRepository<UsuarioDesafio, Long> {
    // métodos prontos --> save(), findAll(), findById(), deleteById()
    boolean existsByUsuarioIdUsuarioAndDesafioIdDesafio(Long usuarioId, Long desafioId); 
    // |_ verifica se um usuário já está participando de um desafio específico
}