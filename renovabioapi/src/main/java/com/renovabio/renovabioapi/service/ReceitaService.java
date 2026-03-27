package com.renovabio.renovabioapi.service;

/*busca usuário
busca receita
↓
cria AcaoUsuario
↓
salva ação
↓
atualiza pontuação
↓
salva usuário */

import com.renovabio.renovabioapi.model.AcaoUsuario;
import com.renovabio.renovabioapi.model.Receita;
import com.renovabio.renovabioapi.model.TipoAcao;
import com.renovabio.renovabioapi.model.Usuario;
import com.renovabio.renovabioapi.repository.*;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ReceitaService {

    private final ReceitaRepository receitaRepository;
    private final UsuarioRepository usuarioRepository;
    private final AcaoUsuarioRepository acaoUsuarioRepository;

    public ReceitaService(ReceitaRepository receitaRepository, UsuarioRepository usuarioRepository, AcaoUsuarioRepository acaoUsuarioRepository) {
        this.receitaRepository = receitaRepository;
        this.usuarioRepository = usuarioRepository;
        this.acaoUsuarioRepository = acaoUsuarioRepository;
    }

    // LISTAR TODAS AS RECEITAS
    public List<Receita> listarReceitas() {
        return receitaRepository.findAll();
    }

    // BUSCAR RECEITA POR ID
    public Receita buscarReceitaPorId(Long id) {
        return receitaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Receita não encontrada"));
    }

    // TESTAR RECEITA (REGISTRAR AÇÃO DO USUÁRIO E GERAR PONTOS) 
    public void testarReceita(Long usuarioId, Long receitaId) {

        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        Receita receita = receitaRepository.findById(receitaId)
                .orElseThrow(() -> new RuntimeException("Receita não encontrada"));

        // registrar ação do usuário
        AcaoUsuario acao = new AcaoUsuario();
        acao.setUsuario(usuario);
        acao.setTipoAcao(TipoAcao.RECEITA);
        acao.setIdReferencia(receita.getId());
        acao.setPontosGerados(receita.getPontos());
        acao.setDataAcao(LocalDateTime.now());

        acaoUsuarioRepository.save(acao);

        // adicionar pontos ao usuário
        usuario.setPontuacaoAtual(
                usuario.getPontuacaoAtual() + receita.getPontos()
        );

        usuarioRepository.save(usuario);
    }
}