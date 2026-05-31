package com.renovabio.renovabioapi.repository;

import com.renovabio.renovabioapi.model.TrocaRecompensa;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TrocaRecompensaRepository extends JpaRepository<TrocaRecompensa, Long> {
    List<TrocaRecompensa> findByUsuarioIdUsuarioOrderByDataTrocaDesc(Long usuarioId);

    List<TrocaRecompensa> findByRecompensaParceiroCidadeIdOrderByDataTrocaDesc(Long cidadeId);
}
