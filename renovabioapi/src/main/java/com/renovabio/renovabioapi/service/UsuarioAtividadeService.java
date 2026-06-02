package com.renovabio.renovabioapi.service;

import com.renovabio.renovabioapi.model.AcaoUsuario;
import com.renovabio.renovabioapi.model.Usuario;
import com.renovabio.renovabioapi.repository.AcaoUsuarioRepository;
import com.renovabio.renovabioapi.repository.UsuarioRepository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
public class UsuarioAtividadeService {

    private static final int MESES_INATIVIDADE = 2;

    private final UsuarioRepository usuarioRepository;
    private final AcaoUsuarioRepository acaoUsuarioRepository;

    public UsuarioAtividadeService(
            UsuarioRepository usuarioRepository,
            AcaoUsuarioRepository acaoUsuarioRepository) {

        this.usuarioRepository = usuarioRepository;
        this.acaoUsuarioRepository = acaoUsuarioRepository;
    }

    public Usuario registrarAtividade(Usuario usuario) {
        if (usuario == null) {
            return null;
        }

        usuario.setAtivo(true);
        return usuarioRepository.save(usuario);
    }

    public Usuario atualizarStatusPorInatividade(Usuario usuario) {
        if (usuario == null) {
            return null;
        }

        LocalDateTime referencia = buscarUltimaAcaoOuCadastro(usuario);
        boolean deveFicarInativo = referencia != null
                && referencia.isBefore(LocalDateTime.now().minusMonths(MESES_INATIVIDADE));

        if (deveFicarInativo && !Boolean.FALSE.equals(usuario.getAtivo())) {
            usuario.setAtivo(false);
            return usuarioRepository.save(usuario);
        }

        return usuario;
    }

    public List<Usuario> atualizarStatusPorInatividade(List<Usuario> usuarios) {
        return usuarios.stream()
                .map(this::atualizarStatusPorInatividade)
                .collect(Collectors.toList());
    }

    @Scheduled(cron = "0 0 3 * * *", zone = "America/Sao_Paulo")
    public void inativarUsuariosSemAtividade() {
        atualizarStatusPorInatividade(usuarioRepository.findAll());
    }

    private LocalDateTime buscarUltimaAcaoOuCadastro(Usuario usuario) {
        if (usuario.getidUsuario() != null) {
            return acaoUsuarioRepository.findFirstByUsuarioIdUsuarioOrderByDataAcaoDesc(usuario.getidUsuario())
                    .map(AcaoUsuario::getDataAcao)
                    .orElse(usuario.getDataCadastro());
        }

        return usuario.getDataCadastro();
    }
}
