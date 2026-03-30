package com.renovabio.renovabioapi.service;

import com.renovabio.renovabioapi.dto.AtualizarSenhaRequestDTO;
import com.renovabio.renovabioapi.dto.LoginRequestDTO;
import com.renovabio.renovabioapi.dto.UsuarioRequestDTO;
import com.renovabio.renovabioapi.dto.UsuarioResponseDTO;
import com.renovabio.renovabioapi.model.Cidade;
import com.renovabio.renovabioapi.model.Usuario;
import com.renovabio.renovabioapi.repository.CidadeRepository;
import com.renovabio.renovabioapi.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

import static org.springframework.http.HttpStatus.BAD_REQUEST;
import static org.springframework.http.HttpStatus.CONFLICT;
import static org.springframework.http.HttpStatus.NOT_FOUND;
import static org.springframework.http.HttpStatus.UNAUTHORIZED;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private CidadeRepository cidadeRepository;

    public UsuarioResponseDTO criarUsuario(UsuarioRequestDTO dto) {
        if (usuarioRepository.findByEmail(dto.getEmail()).isPresent()) {
            throw new ResponseStatusException(CONFLICT, "Email ja cadastrado");
        }

        Cidade cidade = cidadeRepository.findById(dto.getCidadeId())
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Cidade nao encontrada"));

        Usuario usuario = new Usuario();
        usuario.setNome(dto.getNome());
        usuario.setEmail(dto.getEmail());
        usuario.setSenha(dto.getSenha());
        usuario.setCidade(cidade);

        Usuario salvo = usuarioRepository.save(usuario);
        return toResponseDTO(salvo);
    }

    public UsuarioResponseDTO login(LoginRequestDTO dto) {
        if (dto.getEmail() == null || dto.getEmail().isBlank() || dto.getSenha() == null || dto.getSenha().isBlank()) {
            throw new ResponseStatusException(BAD_REQUEST, "Email e senha sao obrigatorios");
        }

        Usuario usuario = usuarioRepository.findByEmail(dto.getEmail())
                .orElseThrow(() -> new ResponseStatusException(UNAUTHORIZED, "Email ou senha invalidos"));

        if (!Boolean.TRUE.equals(usuario.getAtivo())) {
            throw new ResponseStatusException(UNAUTHORIZED, "Usuario inativo");
        }

        if (!usuario.getSenha().equals(dto.getSenha())) {
            throw new ResponseStatusException(UNAUTHORIZED, "Email ou senha invalidos");
        }

        return toResponseDTO(usuario);
    }

    public List<UsuarioResponseDTO> listarUsuarios() {
        return usuarioRepository.findAll().stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    public void atualizarSenha(Long id, AtualizarSenhaRequestDTO dto) {
        if (dto.getNovaSenha() == null || dto.getNovaSenha().isBlank()) {
            throw new ResponseStatusException(BAD_REQUEST, "A nova senha e obrigatoria");
        }

        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Usuario nao encontrado"));

        usuario.setSenha(dto.getNovaSenha());
        usuarioRepository.save(usuario);
    }

    private UsuarioResponseDTO toResponseDTO(Usuario usuario) {
        UsuarioResponseDTO dto = new UsuarioResponseDTO();
        dto.setId(usuario.getidUsuario());
        dto.setNome(usuario.getNome());
        dto.setEmail(usuario.getEmail());
        dto.setPontuacao(usuario.getPontuacaoAtual());
        return dto;
    }
}
