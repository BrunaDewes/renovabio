package com.renovabio.renovabioapi.service;

import com.renovabio.renovabioapi.model.AcaoUsuario;
import com.renovabio.renovabioapi.model.Recompensa;
import com.renovabio.renovabioapi.model.StatusTroca;
import com.renovabio.renovabioapi.model.TipoAcao;
import com.renovabio.renovabioapi.model.TrocaRecompensa;
import com.renovabio.renovabioapi.model.Usuario;
import com.renovabio.renovabioapi.repository.AcaoUsuarioRepository;
import com.renovabio.renovabioapi.repository.RecompensaRepository;
import com.renovabio.renovabioapi.repository.TrocaRecompensaRepository;
import com.renovabio.renovabioapi.repository.UsuarioRepository;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

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
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario nao encontrado"));

        Recompensa recompensa = recompensaRepository.findById(recompensaId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Recompensa nao encontrada"));

        if (Boolean.FALSE.equals(recompensa.getAtivo())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Recompensa nao esta ativa");
        }

        if (recompensa.getQuantidadeDisponivel() == null || recompensa.getQuantidadeDisponivel() <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Recompensa esgotada");
        }

        if (usuario.getPontuacaoAtual() == null || usuario.getPontuacaoAtual() < recompensa.getPontosNecessarios()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Pontos insuficientes");
        }

        usuario.setPontuacaoAtual(usuario.getPontuacaoAtual() - recompensa.getPontosNecessarios());
        usuarioRepository.save(usuario);

        AcaoUsuario acao = new AcaoUsuario();
        acao.setUsuario(usuario);
        acao.setTipoAcao(TipoAcao.TROCA_RECOMPENSA);
        acao.setPontosGerados(-recompensa.getPontosNecessarios());
        acao.setIdReferencia(recompensa.getId());
        acaoUsuarioRepository.save(acao);

        recompensa.setQuantidadeDisponivel(recompensa.getQuantidadeDisponivel() - 1);
        recompensaRepository.save(recompensa);

        String voucher = UUID.randomUUID().toString().substring(0, 8);

        TrocaRecompensa troca = new TrocaRecompensa();
        troca.setUsuario(usuario);
        troca.setRecompensa(recompensa);
        troca.setStatus(StatusTroca.RESGATADO);
        troca.setCodigoVoucher(voucher);

        return trocaRecompensaRepository.save(troca);
    }
}
