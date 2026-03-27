package com.renovabio.renovabioapi.service;

/*usuario ganha pontos
↓
consulta recompensas
↓
troca pontos
↓
gera voucher */

import com.renovabio.renovabioapi.model.*;
import com.renovabio.renovabioapi.repository.*;

import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class TrocaRecompensaService {

    private final UsuarioRepository usuarioRepository;
    private final RecompensaRepository recompensaRepository;
    private final TrocaRecompensaRepository trocaRecompensaRepository;
    private final AcaoUsuarioRepository acaoUsuarioRepository;

    public TrocaRecompensaService(
            UsuarioRepository usuarioRepository,
            RecompensaRepository recompensaRepository,
            TrocaRecompensaRepository trocaRecompensaRepository,
            AcaoUsuarioRepository acaoUsuarioRepository) {

        this.usuarioRepository = usuarioRepository;
        this.recompensaRepository = recompensaRepository;
        this.trocaRecompensaRepository = trocaRecompensaRepository;
        this.acaoUsuarioRepository = acaoUsuarioRepository;
    }

    public TrocaRecompensa trocarRecompensa(Long usuarioId, Long recompensaId) {

        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        Recompensa recompensa = recompensaRepository.findById(recompensaId)
                .orElseThrow(() -> new RuntimeException("Recompensa não encontrada"));

        if (!recompensa.getAtivo()) {
            throw new RuntimeException("Recompensa não está ativa");
        }

        if (recompensa.getQuantidadeDisponivel() <= 0) {
            throw new RuntimeException("Recompensa esgotada");
        }

        if (usuario.getPontuacaoAtual() < recompensa.getPontosNecessarios()) {
            throw new RuntimeException("Pontos insuficientes");
        }

        // descontar pontos
        usuario.setPontuacaoAtual(
                usuario.getPontuacaoAtual() - recompensa.getPontosNecessarios()
        );

        usuarioRepository.save(usuario);

        // registrar ação do usuário
        AcaoUsuario acao = new AcaoUsuario();
        acao.setUsuario(usuario);
        acao.setTipoAcao(TipoAcao.TROCA_RECOMPENSA);
        acao.setPontosGerados(-recompensa.getPontosNecessarios());
        acao.setIdReferencia(recompensa.getId());

        acaoUsuarioRepository.save(acao);

        // diminuir estoque
        recompensa.setQuantidadeDisponivel(
                recompensa.getQuantidadeDisponivel() - 1
        );

        recompensaRepository.save(recompensa);

        // gerar voucher
        String voucher = UUID.randomUUID().toString().substring(0, 8);

        TrocaRecompensa troca = new TrocaRecompensa();
        troca.setUsuario(usuario);
        troca.setRecompensa(recompensa);
        troca.setStatus(StatusTroca.RESGATADO);
        troca.setCodigoVoucher(voucher);

        return trocaRecompensaRepository.save(troca);
    }
}
