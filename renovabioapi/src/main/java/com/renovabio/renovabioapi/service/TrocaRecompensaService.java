package com.renovabio.renovabioapi.service;

import com.renovabio.renovabioapi.dto.HistoricoTrocaRecompensaDTO;
import com.renovabio.renovabioapi.model.Recompensa;
import com.renovabio.renovabioapi.model.StatusTroca;
import com.renovabio.renovabioapi.model.TrocaRecompensa;
import com.renovabio.renovabioapi.model.Usuario;
import com.renovabio.renovabioapi.repository.RecompensaRepository;
import com.renovabio.renovabioapi.repository.TrocaRecompensaRepository;
import com.renovabio.renovabioapi.repository.UsuarioRepository;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class TrocaRecompensaService {

    private final UsuarioRepository usuarioRepository;
    private final RecompensaRepository recompensaRepository;
    private final TrocaRecompensaRepository trocaRecompensaRepository;
    private final UsuarioAtividadeService usuarioAtividadeService;

    public TrocaRecompensaService(
            UsuarioRepository usuarioRepository,
            RecompensaRepository recompensaRepository,
            TrocaRecompensaRepository trocaRecompensaRepository,
            UsuarioAtividadeService usuarioAtividadeService) {

        this.usuarioRepository = usuarioRepository;
        this.recompensaRepository = recompensaRepository;
        this.trocaRecompensaRepository = trocaRecompensaRepository;
        this.usuarioAtividadeService = usuarioAtividadeService;
    }

    @Transactional
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
        usuarioAtividadeService.registrarAtividade(usuario);

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

    public List<HistoricoTrocaRecompensaDTO> listarTrocasUsuario(Long usuarioId) {
        if (!usuarioRepository.existsById(usuarioId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario nao encontrado");
        }

        return trocaRecompensaRepository.findByUsuarioIdUsuarioOrderByDataTrocaDesc(usuarioId).stream()
                .map(this::toHistoricoDTO)
                .collect(Collectors.toList());
    }

    public List<HistoricoTrocaRecompensaDTO> listarTrocasPorCidade(Long cidadeId) {
        return trocaRecompensaRepository.findByRecompensaParceiroCidadeIdOrderByDataTrocaDesc(cidadeId).stream()
                .map(this::toHistoricoDTO)
                .collect(Collectors.toList());
    }

    private HistoricoTrocaRecompensaDTO toHistoricoDTO(TrocaRecompensa troca) {
        HistoricoTrocaRecompensaDTO dto = new HistoricoTrocaRecompensaDTO();
        Recompensa recompensa = troca.getRecompensa();

        dto.setId(troca.getId());
        dto.setCodigoVoucher(troca.getCodigoVoucher());
        dto.setStatus(troca.getStatus() != null ? troca.getStatus().name() : null);
        dto.setDataTroca(troca.getDataTroca());

        if (recompensa != null) {
            dto.setRecompensaDescricao(recompensa.getDescricao());
            dto.setPontosUtilizados(recompensa.getPontosNecessarios());
            dto.setParceiroNome(recompensa.getParceiro() != null ? recompensa.getParceiro().getNome() : null);
        }

        return dto;
    }
}
