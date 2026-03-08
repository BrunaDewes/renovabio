package com.renovabio.renovabioapi.controller;

import com.renovabio.renovabioapi.model.Desafio;
import com.renovabio.renovabioapi.model.UsuarioDesafio;
import com.renovabio.renovabioapi.service.DesafioService;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/desafios")
public class DesafioController {

    private final DesafioService desafioService;

    public DesafioController(DesafioService desafioService) {
        this.desafioService = desafioService;
    }

    // LISTAR DESAFIOS
    @GetMapping
    public List<Desafio> listarDesafios() {
        return desafioService.listarDesafios();
    }

    // USUÁRIO PARTICIPAR DE UM DESAFIO
    @PostMapping("/{desafioId}/participar")
    public UsuarioDesafio participarDesafio(
            @PathVariable Long desafioId,
            @RequestParam Long usuarioId) {

        return desafioService.participarDesafio(usuarioId, desafioId);
    }

    // ATUALIZAR PROGRESSO
    @PutMapping("/progresso")
    public UsuarioDesafio atualizarProgresso(
            @RequestParam Long usuarioDesafioId,
            @RequestParam int progresso) {

        return desafioService.atualizarProgresso(usuarioDesafioId, progresso);
    }

    // CONCLUIR DESAFIO
    @PutMapping("/concluir")
    public UsuarioDesafio concluirDesafio(
            @RequestParam Long usuarioDesafioId) {

        return desafioService.concluirDesafio(usuarioDesafioId);
    }
}