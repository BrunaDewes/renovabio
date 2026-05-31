package com.renovabio.renovabioapi.controller;

import com.renovabio.renovabioapi.dto.HistoricoTrocaRecompensaDTO;
import com.renovabio.renovabioapi.dto.RecompensaRequestDTO;
import com.renovabio.renovabioapi.model.Parceiro;
import com.renovabio.renovabioapi.model.Recompensa;
import com.renovabio.renovabioapi.model.TrocaRecompensa;
import com.renovabio.renovabioapi.repository.ParceiroRepository;
import com.renovabio.renovabioapi.repository.RecompensaRepository;
import com.renovabio.renovabioapi.service.TrocaRecompensaService;
import com.renovabio.renovabioapi.service.UsuarioAutenticadoService;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/recompensas")
public class RecompensaController {

    private final RecompensaRepository recompensaRepository;
    private final ParceiroRepository parceiroRepository;
    private final TrocaRecompensaService trocaRecompensaService;
    private final UsuarioAutenticadoService usuarioAutenticadoService;

    public RecompensaController(
            RecompensaRepository recompensaRepository,
            ParceiroRepository parceiroRepository,
            TrocaRecompensaService trocaRecompensaService,
            UsuarioAutenticadoService usuarioAutenticadoService) {

        this.recompensaRepository = recompensaRepository;
        this.parceiroRepository = parceiroRepository;
        this.trocaRecompensaService = trocaRecompensaService;
        this.usuarioAutenticadoService = usuarioAutenticadoService;
    }

    // LISTAR RECOMPENSAS
    @GetMapping
    public List<Recompensa> listarRecompensas() {
        if (usuarioAutenticadoService.isPrefeituraAutenticada()) {
            return recompensaRepository.findByParceiroCidadeId(usuarioAutenticadoService.getCidadePrefeituraObrigatoria());
        }

        return recompensaRepository.findAll();
    }

    @PostMapping
    public Recompensa criar(@RequestBody RecompensaRequestDTO dto) {
        Recompensa recompensa = new Recompensa();
        aplicarDados(recompensa, dto);
        return recompensaRepository.save(recompensa);
    }

    @PutMapping("/{id}")
    public Recompensa atualizar(@PathVariable Long id, @RequestBody RecompensaRequestDTO dto) {
        Recompensa recompensa = recompensaRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Recompensa nao encontrada"));

        validarRecompensaDaPrefeitura(recompensa);
        aplicarDados(recompensa, dto);
        return recompensaRepository.save(recompensa);
    }

    @PatchMapping("/{id}/ativo")
    public Recompensa alterarAtivo(@PathVariable Long id, @RequestParam Boolean ativo) {
        Recompensa recompensa = recompensaRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Recompensa nao encontrada"));

        validarRecompensaDaPrefeitura(recompensa);
        recompensa.setAtivo(ativo);
        return recompensaRepository.save(recompensa);
    }

    @DeleteMapping("/{id}")
    public void excluir(@PathVariable Long id) {
        Recompensa recompensa = recompensaRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Recompensa nao encontrada"));

        validarRecompensaDaPrefeitura(recompensa);
        recompensaRepository.delete(recompensa);
    }

    @GetMapping("/usuario/{usuarioId}/trocas")
    public List<HistoricoTrocaRecompensaDTO> listarTrocasUsuario(@PathVariable Long usuarioId) {
        return trocaRecompensaService.listarTrocasUsuario(usuarioId);
    }

    @GetMapping("/trocas")
    public List<HistoricoTrocaRecompensaDTO> listarTrocasPrefeitura() {
        return trocaRecompensaService.listarTrocasPorCidade(usuarioAutenticadoService.getCidadePrefeituraObrigatoria());
    }

    // TROCAR RECOMPENSA
    @PostMapping("/trocar")
    public Map<String, Object> trocar(
            @RequestParam Long usuarioId,
            @RequestParam Long recompensaId) {

        TrocaRecompensa troca = trocaRecompensaService.trocarRecompensa(usuarioId, recompensaId);
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("id", troca.getId());
        response.put("codigoVoucher", troca.getCodigoVoucher());
        response.put("status", troca.getStatus() != null ? troca.getStatus().name() : null);
        response.put("mensagem", "Recompensa resgatada com sucesso");
        return response;
    }

    private void aplicarDados(Recompensa recompensa, RecompensaRequestDTO dto) {
        if (dto.getDescricao() == null || dto.getDescricao().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Descricao da recompensa e obrigatoria");
        }

        if (dto.getParceiroId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Parceiro e obrigatorio");
        }

        Parceiro parceiro = parceiroRepository.findById(dto.getParceiroId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Parceiro nao encontrado"));

        Long cidadeParceiroId = parceiro.getCidade() != null ? parceiro.getCidade().getId() : null;
        usuarioAutenticadoService.validarCidadeDaPrefeitura(cidadeParceiroId);

        recompensa.setDescricao(dto.getDescricao().trim());
        recompensa.setPontosNecessarios(dto.getPontosNecessarios() != null ? dto.getPontosNecessarios() : 0);
        recompensa.setQuantidadeDisponivel(dto.getQuantidadeDisponivel() != null ? dto.getQuantidadeDisponivel() : 0);
        recompensa.setParceiro(parceiro);
        recompensa.setAtivo(dto.getAtivo() != null ? dto.getAtivo() : Boolean.TRUE);
    }

    private void validarRecompensaDaPrefeitura(Recompensa recompensa) {
        Long cidadeId = recompensa.getParceiro() != null && recompensa.getParceiro().getCidade() != null
                ? recompensa.getParceiro().getCidade().getId()
                : null;
        usuarioAutenticadoService.validarCidadeDaPrefeitura(cidadeId);
    }
}
