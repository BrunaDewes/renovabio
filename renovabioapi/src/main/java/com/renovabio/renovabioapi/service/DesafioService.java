package com.renovabio.renovabioapi.service;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.renovabio.renovabioapi.model.AcaoUsuario;

// listar desafios
// usuário participar de desafio
// atualizar progresso
// concluir desafio
// gerar pontuação

//centraliza a lógica de negócios relacionada aos desafios. 
// Ele controla a participação dos usuários, atualização de progresso e conclusão dos desafios, 
// além de gerar pontuação automaticamente quando um desafio é finalizado.
import com.renovabio.renovabioapi.model.Desafio;
import com.renovabio.renovabioapi.model.StatusDesafio;
import com.renovabio.renovabioapi.model.TipoAcao;
import com.renovabio.renovabioapi.model.Usuario;
import com.renovabio.renovabioapi.model.UsuarioDesafio;
import com.renovabio.renovabioapi.repository.AcaoUsuarioRepository;
import com.renovabio.renovabioapi.repository.DesafioRepository;
import com.renovabio.renovabioapi.repository.UsuarioDesafioRepository;
import com.renovabio.renovabioapi.repository.UsuarioRepository;

@Service
public class DesafioService {

    private final DesafioRepository desafioRepository;
    private final UsuarioRepository usuarioRepository;
    private final UsuarioDesafioRepository usuarioDesafioRepository;
    private final AcaoUsuarioRepository acaoUsuarioRepository;

    public DesafioService(
            DesafioRepository desafioRepository,
            UsuarioRepository usuarioRepository,
            UsuarioDesafioRepository usuarioDesafioRepository,
            AcaoUsuarioRepository acaoUsuarioRepository) {

        this.desafioRepository = desafioRepository;
        this.usuarioRepository = usuarioRepository;
        this.usuarioDesafioRepository = usuarioDesafioRepository;
        this.acaoUsuarioRepository = acaoUsuarioRepository;
    }

    public List<Desafio> listarDesafios() {
        return desafioRepository.findAll();
    }

    public UsuarioDesafio participarDesafio(Long usuarioId, Long desafioId) {

        if(usuarioDesafioRepository.existsByUsuarioIdUsuarioAndDesafioIdDesafio(usuarioId, desafioId)){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Usuário já está participando deste desafio");
        }

        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado"));

        Desafio desafio = desafioRepository.findById(desafioId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado"));

        UsuarioDesafio usuarioDesafio = new UsuarioDesafio(usuario, desafio, StatusDesafio.EM_ANDAMENTO);

        return usuarioDesafioRepository.save(usuarioDesafio);
    }

    public UsuarioDesafio atualizarProgresso(Long usuarioDesafioId, int progresso) {

        UsuarioDesafio usuarioDesafio = usuarioDesafioRepository.findById(usuarioDesafioId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Registro não encontrado"));

        if(progresso > 100){
            progresso = 100;
        }

        usuarioDesafio.setProgresso(progresso);

        return usuarioDesafioRepository.save(usuarioDesafio);
    }

    public UsuarioDesafio concluirDesafio(Long usuarioDesafioId) {

        UsuarioDesafio usuarioDesafio = usuarioDesafioRepository.findById(usuarioDesafioId)
                .orElseThrow(() -> new RuntimeException("Registro não encontrado"));

        if(usuarioDesafio.getStatus() == StatusDesafio.CONCLUIDO){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Desafio já foi concluído");
        }

        usuarioDesafio.setStatus(StatusDesafio.CONCLUIDO);

        Usuario usuario = usuarioDesafio.getUsuario();
        Desafio desafio = usuarioDesafio.getDesafio();

        usuario.setPontuacaoAtual(
                usuario.getPontuacaoAtual() + desafio.getPontos()
        );

        usuarioRepository.save(usuario);

        //aqui entra a AcaoUsuario
        AcaoUsuario acao = new AcaoUsuario();
        acao.setUsuario(usuario);
        acao.setTipoAcao(TipoAcao.DESAFIO);
        acao.setPontosGerados(desafio.getPontos());
        acao.setIdReferencia(desafio.getId());

        acaoUsuarioRepository.save(acao);

        return usuarioDesafioRepository.save(usuarioDesafio);
    }
}