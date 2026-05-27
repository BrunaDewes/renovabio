package com.renovabio.renovabioapi.controller;

import com.renovabio.renovabioapi.dto.ComprovacaoDesafioDTO;
import com.renovabio.renovabioapi.model.Desafio;
import com.renovabio.renovabioapi.model.UsuarioDesafio;
import com.renovabio.renovabioapi.service.DesafioService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/desafios")
public class DesafioController {

    private final DesafioService desafioService;

    public DesafioController(DesafioService desafioService) {
        this.desafioService = desafioService;
    }

    @GetMapping
    public List<Desafio> listarDesafios() {
        return desafioService.listarDesafios();
    }

    @GetMapping("/usuario/{usuarioId}")
    public List<UsuarioDesafio> listarParticipacoesUsuario(@PathVariable Long usuarioId) {
        return desafioService.listarParticipacoesUsuario(usuarioId);
    }

    @PostMapping("/{desafioId}/participar")
    public UsuarioDesafio participarDesafio(@PathVariable Long desafioId, @RequestParam Long usuarioId) {
        return desafioService.participarDesafio(usuarioId, desafioId);
    }

    @PutMapping("/progresso")
    public UsuarioDesafio atualizarProgresso(@RequestParam Long usuarioDesafioId, @RequestParam int progresso) {
        return desafioService.atualizarProgresso(usuarioDesafioId, progresso);
    }

    @PutMapping("/concluir")
    public UsuarioDesafio concluirDesafio(@RequestParam Long usuarioDesafioId) {
        return desafioService.concluirDesafio(usuarioDesafioId);
    }

    @GetMapping("/comprovacoes/{usuarioDesafioId}")
    public List<ComprovacaoDesafioDTO> listarComprovacoes(@PathVariable Long usuarioDesafioId) {
        return desafioService.listarComprovacoes(usuarioDesafioId);
    }

    @PostMapping("/comprovacoes")
    public ComprovacaoDesafioDTO registrarComprovacao(
            @RequestParam Long usuarioDesafioId,
            @RequestParam("file") MultipartFile file) {
        return desafioService.registrarComprovacao(usuarioDesafioId, file);
    }

    @DeleteMapping("/comprovacoes/{comprovacaoId}")
    public UsuarioDesafio excluirComprovacao(@PathVariable Long comprovacaoId, Authentication authentication) {
        return desafioService.excluirComprovacao(comprovacaoId, (Long) authentication.getPrincipal());
    }
}
