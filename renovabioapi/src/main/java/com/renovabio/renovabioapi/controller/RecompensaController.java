package com.renovabio.renovabioapi.controller;

import com.renovabio.renovabioapi.model.Recompensa;
import com.renovabio.renovabioapi.model.TrocaRecompensa;
import com.renovabio.renovabioapi.repository.RecompensaRepository;
import com.renovabio.renovabioapi.service.TrocaRecompensaService;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import org.springframework.web.bind.annotation.*;

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
}
