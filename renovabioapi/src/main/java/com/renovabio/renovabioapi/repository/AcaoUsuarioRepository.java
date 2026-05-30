package com.renovabio.renovabioapi.repository;

import com.renovabio.renovabioapi.model.AcaoUsuario;
import com.renovabio.renovabioapi.model.TipoAcao;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AcaoUsuarioRepository extends JpaRepository<AcaoUsuario, Long> {
    // métodos prontos --> save(), findAll(), findById(), deleteById()

    List<AcaoUsuario> findByUsuarioIdUsuario(Long usuarioId);  //LISTAR AÇÕES DE UM USUÁRIO
    Optional<AcaoUsuario> findFirstByUsuarioIdUsuarioAndTipoAcaoAndIdReferenciaOrderByDataAcaoDesc(
            Long usuarioId,
            TipoAcao tipoAcao,
            Long idReferencia
    );
}
