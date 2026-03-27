package com.renovabio.renovabioapi.controller;

import com.renovabio.renovabioapi.model.Feedback;
import com.renovabio.renovabioapi.service.FeedbackService;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/feedbacks")
public class FeedbackController {

    private final FeedbackService feedbackService;

    public FeedbackController(FeedbackService feedbackService) {
        this.feedbackService = feedbackService;
    }

    // LISTAR
    @GetMapping
    public List<Feedback> listar() {
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