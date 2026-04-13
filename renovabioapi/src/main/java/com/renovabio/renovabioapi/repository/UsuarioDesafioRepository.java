package com.renovabio.renovabioapi.repository;

import com.renovabio.renovabioapi.model.UsuarioDesafio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UsuarioDesafioRepository extends JpaRepository<UsuarioDesafio, Long> {
    boolean existsByUsuarioIdUsuarioAndDesafioIdDesafio(Long usuarioId, Long desafioId);
    List<UsuarioDesafio> findByUsuarioIdUsuario(Long usuarioId);
}
