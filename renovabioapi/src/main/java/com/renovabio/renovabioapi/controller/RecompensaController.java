package com.renovabio.renovabioapi.controller;

import com.renovabio.renovabioapi.model.Recompensa;
import com.renovabio.renovabioapi.model.TrocaRecompensa;
import com.renovabio.renovabioapi.repository.RecompensaRepository;
import com.renovabio.renovabioapi.service.TrocaRecompensaService;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/recompensas")
public class RecompensaController {

    private final RecompensaRepository recompensaRepository;
    private final TrocaRecompensaService trocaRecompensaService;

    public RecompensaController(
            RecompensaRepository recompensaRepository,
            TrocaRecompensaService trocaRecompensaService) {

        this.recompensaRepository = recompensaRepository;
        this.trocaRecompensaService = trocaRecompensaService;
    }

    // LISTAR RECOMPENSAS
    @GetMapping
    public List<Recompensa> listarRecompensas() {
        return recompensaRepository.findAll();
    }

    // TROCAR RECOMPENSA
    @PostMapping("/trocar")
    public TrocaRecompensa trocar(
            @RequestParam Long usuarioId,
            @RequestParam Long recompensaId) {

        return trocaRecompensaService.trocarRecompensa(usuarioId, recompensaId);
    }
}