package com.renovabio.renovabioapi.service;

import com.renovabio.renovabioapi.model.Feedback;
import com.renovabio.renovabioapi.model.Usuario;
import com.renovabio.renovabioapi.repository.FeedbackRepository;
import com.renovabio.renovabioapi.repository.UsuarioRepository;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class FeedbackService {

    private final FeedbackRepository feedbackRepository;
    private final UsuarioRepository usuarioRepository;
    private final UsuarioAtividadeService usuarioAtividadeService;

    public FeedbackService(
            FeedbackRepository feedbackRepository,
            UsuarioRepository usuarioRepository,
            UsuarioAtividadeService usuarioAtividadeService) {

        this.feedbackRepository = feedbackRepository;
        this.usuarioRepository = usuarioRepository;
        this.usuarioAtividadeService = usuarioAtividadeService;
    }

    // LISTAR TODOS OS FEEDBACKS
    public List<Feedback> listarFeedbacks() {
        return feedbackRepository.findAll();
    }

    public List<Feedback> listarFeedbacksPorCidade(Long cidadeId) {
        return feedbackRepository.findByUsuarioCidadeId(cidadeId);
    }

    // CRIAR FEEDBACK
    public Feedback criarFeedback(Long usuarioId, String mensagem) {

        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        Feedback feedback = new Feedback();
        feedback.setUsuario(usuario);
        feedback.setMensagem(mensagem);
        feedback.setDataEnvio(LocalDateTime.now());

        usuarioAtividadeService.registrarAtividade(usuario);

        return feedbackRepository.save(feedback);
    }
}
