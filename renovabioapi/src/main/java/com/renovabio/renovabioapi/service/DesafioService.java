package com.renovabio.renovabioapi.service;

import com.renovabio.renovabioapi.dto.ComprovacaoDesafioDTO;
import com.renovabio.renovabioapi.model.AcaoUsuario;
import com.renovabio.renovabioapi.model.ComprovacaoDesafio;
import com.renovabio.renovabioapi.model.Desafio;
import com.renovabio.renovabioapi.model.StatusDesafio;
import com.renovabio.renovabioapi.model.TipoAcao;
import com.renovabio.renovabioapi.model.Usuario;
import com.renovabio.renovabioapi.model.UsuarioDesafio;
import com.renovabio.renovabioapi.repository.AcaoUsuarioRepository;
import com.renovabio.renovabioapi.repository.ComprovacaoDesafioRepository;
import com.renovabio.renovabioapi.repository.DesafioRepository;
import com.renovabio.renovabioapi.repository.UsuarioDesafioRepository;
import com.renovabio.renovabioapi.repository.UsuarioRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DesafioService {

    private final DesafioRepository desafioRepository;
    private final UsuarioRepository usuarioRepository;
    private final UsuarioDesafioRepository usuarioDesafioRepository;
    private final AcaoUsuarioRepository acaoUsuarioRepository;
    private final ComprovacaoDesafioRepository comprovacaoDesafioRepository;
    private final FileStorageService fileStorageService;

    public DesafioService(
            DesafioRepository desafioRepository,
            UsuarioRepository usuarioRepository,
            UsuarioDesafioRepository usuarioDesafioRepository,
            AcaoUsuarioRepository acaoUsuarioRepository,
            ComprovacaoDesafioRepository comprovacaoDesafioRepository,
            FileStorageService fileStorageService) {

        this.desafioRepository = desafioRepository;
        this.usuarioRepository = usuarioRepository;
        this.usuarioDesafioRepository = usuarioDesafioRepository;
        this.acaoUsuarioRepository = acaoUsuarioRepository;
        this.comprovacaoDesafioRepository = comprovacaoDesafioRepository;
        this.fileStorageService = fileStorageService;
    }

    public List<Desafio> listarDesafios() {
        return desafioRepository.findAll();
    }

    public List<UsuarioDesafio> listarParticipacoesUsuario(Long usuarioId) {
        return usuarioDesafioRepository.findByUsuarioIdUsuario(usuarioId);
    }

    public UsuarioDesafio participarDesafio(Long usuarioId, Long desafioId) {
        if (usuarioDesafioRepository.existsByUsuarioIdUsuarioAndDesafioIdDesafio(usuarioId, desafioId)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Usuario ja esta participando deste desafio");
        }

        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario nao encontrado"));

        Desafio desafio = desafioRepository.findById(desafioId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Desafio nao encontrado"));

        UsuarioDesafio usuarioDesafio = new UsuarioDesafio(usuario, desafio, StatusDesafio.EM_ANDAMENTO);
        return usuarioDesafioRepository.save(usuarioDesafio);
    }

    public ComprovacaoDesafioDTO registrarComprovacao(Long usuarioDesafioId, MultipartFile file) {
        UsuarioDesafio usuarioDesafio = usuarioDesafioRepository.findById(usuarioDesafioId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Registro nao encontrado"));

        if (usuarioDesafio.getStatus() == StatusDesafio.CONCLUIDO) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Desafio ja foi concluido");
        }

        String imagemUrl = fileStorageService.salvarImagem(file, "comprovacoes");
        ComprovacaoDesafio comprovacao = new ComprovacaoDesafio();
        comprovacao.setUsuarioDesafio(usuarioDesafio);
        comprovacao.setImagemUrl(imagemUrl);

        return toComprovacaoDTO(comprovacaoDesafioRepository.save(comprovacao));
    }

    public List<ComprovacaoDesafioDTO> listarComprovacoes(Long usuarioDesafioId) {
        return comprovacaoDesafioRepository.findByUsuarioDesafioIdOrderByDataEnvioAsc(usuarioDesafioId).stream()
                .map(this::toComprovacaoDTO)
                .collect(Collectors.toList());
    }

    public UsuarioDesafio atualizarProgresso(Long usuarioDesafioId, int progresso) {
        UsuarioDesafio usuarioDesafio = usuarioDesafioRepository.findById(usuarioDesafioId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Registro nao encontrado"));

        if (progresso > 100) {
            progresso = 100;
        }

        usuarioDesafio.setProgresso(progresso);
        return usuarioDesafioRepository.save(usuarioDesafio);
    }

    public UsuarioDesafio concluirDesafio(Long usuarioDesafioId) {
        UsuarioDesafio usuarioDesafio = usuarioDesafioRepository.findById(usuarioDesafioId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Registro nao encontrado"));

        if (usuarioDesafio.getStatus() == StatusDesafio.CONCLUIDO) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Desafio ja foi concluido");
        }

        usuarioDesafio.setStatus(StatusDesafio.CONCLUIDO);

        Usuario usuario = usuarioDesafio.getUsuario();
        Desafio desafio = usuarioDesafio.getDesafio();

        usuario.setPontuacaoAtual(usuario.getPontuacaoAtual() + desafio.getPontos());
        usuarioRepository.save(usuario);

        AcaoUsuario acao = new AcaoUsuario();
        acao.setUsuario(usuario);
        acao.setTipoAcao(TipoAcao.DESAFIO);
        acao.setPontosGerados(desafio.getPontos());
        acao.setIdReferencia(desafio.getId());
        acaoUsuarioRepository.save(acao);

        return usuarioDesafioRepository.save(usuarioDesafio);
    }

    private ComprovacaoDesafioDTO toComprovacaoDTO(ComprovacaoDesafio comprovacao) {
        ComprovacaoDesafioDTO dto = new ComprovacaoDesafioDTO();
        dto.setId(comprovacao.getId());
        dto.setImagemUrl(comprovacao.getImagemUrl());
        dto.setDataEnvio(comprovacao.getDataEnvio());
        dto.setUsuarioDesafioId(
                comprovacao.getUsuarioDesafio() != null ? comprovacao.getUsuarioDesafio().getId() : null
        );
        return dto;
    }
}
