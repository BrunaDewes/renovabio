package com.renovabio.renovabioapi.controller;

import com.renovabio.renovabioapi.model.Feedback;
import com.renovabio.renovabioapi.service.FeedbackService;
import com.renovabio.renovabioapi.service.UsuarioAutenticadoService;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/feedbacks")
public class FeedbackController {

    private final FeedbackService feedbackService;
    private final UsuarioAutenticadoService usuarioAutenticadoService;

    public FeedbackController(FeedbackService feedbackService, UsuarioAutenticadoService usuarioAutenticadoService) {
        this.feedbackService = feedbackService;
        this.usuarioAutenticadoService = usuarioAutenticadoService;
    }

    // LISTAR
    @GetMapping
    public List<Feedback> listar() {
        if (usuarioAutenticadoService.isPrefeituraAutenticada()) {
            return feedbackService.listarFeedbacksPorCidade(usuarioAutenticadoService.getCidadePrefeituraObrigatoria());
        }

        return feedbackService.listarFeedbacks();
    }

    // CRIAR
    @PostMapping
    public Feedback criar(
            @RequestParam Long usuarioId,
            @RequestParam String mensagem) {

        return feedbackService.criarFeedback(usuarioId, mensagem);
    }
}
