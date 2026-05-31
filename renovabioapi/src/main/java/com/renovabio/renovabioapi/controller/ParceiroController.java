package com.renovabio.renovabioapi.controller;

import com.renovabio.renovabioapi.dto.ParceiroRequestDTO;
import com.renovabio.renovabioapi.model.Cidade;
import com.renovabio.renovabioapi.model.Parceiro;
import com.renovabio.renovabioapi.repository.CidadeRepository;
import com.renovabio.renovabioapi.repository.ParceiroRepository;
import com.renovabio.renovabioapi.repository.RecompensaRepository;
import com.renovabio.renovabioapi.service.UsuarioAutenticadoService;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/parceiros")
public class ParceiroController {

    private final ParceiroRepository parceiroRepository;
    private final CidadeRepository cidadeRepository;
    private final RecompensaRepository recompensaRepository;
    private final UsuarioAutenticadoService usuarioAutenticadoService;

    public ParceiroController(
            ParceiroRepository parceiroRepository,
            CidadeRepository cidadeRepository,
            RecompensaRepository recompensaRepository,
            UsuarioAutenticadoService usuarioAutenticadoService) {
        this.parceiroRepository = parceiroRepository;
        this.cidadeRepository = cidadeRepository;
        this.recompensaRepository = recompensaRepository;
        this.usuarioAutenticadoService = usuarioAutenticadoService;
    }

    @GetMapping
    public List<Parceiro> listar() {
        if (usuarioAutenticadoService.isPrefeituraAutenticada()) {
            return parceiroRepository.findByCidadeId(usuarioAutenticadoService.getCidadePrefeituraObrigatoria());
        }

        return parceiroRepository.findAll();
    }

    @PostMapping
    public Parceiro criar(@RequestBody ParceiroRequestDTO dto) {
        Parceiro parceiro = new Parceiro();
        aplicarDados(parceiro, dto);
        return parceiroRepository.save(parceiro);
    }

    @PutMapping("/{id}")
    public Parceiro atualizar(@PathVariable Long id, @RequestBody ParceiroRequestDTO dto) {
        Parceiro parceiro = parceiroRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Parceiro nao encontrado"));

        validarParceiroDaPrefeitura(parceiro);
        aplicarDados(parceiro, dto);
        return parceiroRepository.save(parceiro);
    }

    @PatchMapping("/{id}/ativo")
    public Parceiro alterarAtivo(@PathVariable Long id, @RequestParam Boolean ativo) {
        Parceiro parceiro = parceiroRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Parceiro nao encontrado"));

        validarParceiroDaPrefeitura(parceiro);
        parceiro.setAtivo(ativo);
        return parceiroRepository.save(parceiro);
    }

    @DeleteMapping("/{id}")
    public void excluir(@PathVariable Long id) {
        Parceiro parceiro = parceiroRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Parceiro nao encontrado"));

        validarParceiroDaPrefeitura(parceiro);
        recompensaRepository.deleteAll(recompensaRepository.findByParceiroId(id));
        parceiroRepository.delete(parceiro);
    }

    private void aplicarDados(Parceiro parceiro, ParceiroRequestDTO dto) {
        if (dto.getNome() == null || dto.getNome().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Nome do parceiro e obrigatorio");
        }

        Long cidadeId = usuarioAutenticadoService.getCidadePrefeituraObrigatoria();

        Cidade cidade = cidadeRepository.findById(cidadeId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Cidade nao encontrada"));

        parceiro.setNome(dto.getNome().trim());
        parceiro.setDescricao(dto.getDescricao() != null ? dto.getDescricao().trim() : null);
        parceiro.setCidade(cidade);
        parceiro.setAtivo(dto.getAtivo() != null ? dto.getAtivo() : Boolean.TRUE);
    }

    private void validarParceiroDaPrefeitura(Parceiro parceiro) {
        Long cidadeId = parceiro.getCidade() != null ? parceiro.getCidade().getId() : null;
        usuarioAutenticadoService.validarCidadeDaPrefeitura(cidadeId);
    }
}
