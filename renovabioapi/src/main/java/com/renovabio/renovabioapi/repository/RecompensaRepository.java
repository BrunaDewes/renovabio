package com.renovabio.renovabioapi.repository;

import com.renovabio.renovabioapi.model.Recompensa;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RecompensaRepository extends JpaRepository<Recompensa, Long> {
    List<Recompensa> findByParceiroCidadeId(Long cidadeId);

    List<Recompensa> findByParceiroId(Long parceiroId);
}
