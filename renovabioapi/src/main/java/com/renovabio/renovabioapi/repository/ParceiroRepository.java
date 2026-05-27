package com.renovabio.renovabioapi.repository;

import com.renovabio.renovabioapi.model.Parceiro;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ParceiroRepository extends JpaRepository<Parceiro, Long> {
    List<Parceiro> findByCidadeId(Long cidadeId);
}
