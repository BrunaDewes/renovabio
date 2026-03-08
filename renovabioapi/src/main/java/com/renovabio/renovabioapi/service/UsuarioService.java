package com.renovabio.renovabioapi.service;

import com.renovabio.renovabioapi.dto.UsuarioRequestDTO;
import com.renovabio.renovabioapi.dto.UsuarioResponseDTO;
import com.renovabio.renovabioapi.model.Usuario;
import com.renovabio.renovabioapi.model.Cidade;
import com.renovabio.renovabioapi.repository.UsuarioRepository;
import com.renovabio.renovabioapi.repository.CidadeRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private CidadeRepository cidadeRepository;

    public UsuarioResponseDTO criarUsuario(UsuarioRequestDTO dto) {

        Cidade cidade = cidadeRepository.findById(dto.getCidadeId())
                .orElseThrow(() -> new RuntimeException("Cidade não encontrada"));

        Usuario usuario = new Usuario();
        usuario.setNome(dto.getNome());
        usuario.setEmail(dto.getEmail());
        usuario.setSenha(dto.getSenha());
        usuario.setCidade(cidade);

        Usuario salvo = usuarioRepository.save(usuario);

        UsuarioResponseDTO response = new UsuarioResponseDTO();
        response.setId(salvo.getidUsuario());
        response.setNome(salvo.getNome());
        response.setEmail(salvo.getEmail());
        response.setPontuacao(salvo.getPontuacaoAtual());

        return response;
    }

    public List<UsuarioResponseDTO> listarUsuarios() {

        return usuarioRepository.findAll().stream().map(usuario -> {

            UsuarioResponseDTO dto = new UsuarioResponseDTO();
            dto.setId(usuario.getidUsuario());
            dto.setNome(usuario.getNome());
            dto.setEmail(usuario.getEmail());
            dto.setPontuacao(usuario.getPontuacaoAtual());

            return dto;

        }).collect(Collectors.toList());
    }
}