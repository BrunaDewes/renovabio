package com.renovabio.renovabioapi.controller;

import com.renovabio.renovabioapi.model.Receita;
import com.renovabio.renovabioapi.service.ReceitaService;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/receitas")
public class ReceitaController {

    private final ReceitaService receitaService;

    public ReceitaController(ReceitaService receitaService) {
        this.receitaService = receitaService;
    }

    // LISTAR TODAS AS RECEITAS
    @GetMapping
    public List<Receita> listarReceitas() {
        return receitaService.listarReceitas();
    }

    // BUSCAR RECEITA POR ID
    @GetMapping("/{id}")
    public Receita buscarReceita(@PathVariable Long id) {
        return receitaService.buscarReceitaPorId(id);
    }

    // TESTAR RECEITA (GANHAR PONTOS)
    @PostMapping("/{id}/testar")
    public String testarReceita(
            @PathVariable Long id,
            @RequestParam Long usuarioId) {

        receitaService.testarReceita(usuarioId, id);

        return "Receita testada! Pontos adicionados.";
    }
}