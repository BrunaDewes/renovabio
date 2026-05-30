package com.renovabio.renovabioapi.service;

import com.renovabio.renovabioapi.dto.AtualizarSenhaRequestDTO;
import com.renovabio.renovabioapi.dto.LoginRequestDTO;
import com.renovabio.renovabioapi.dto.RecuperarSenhaRequestDTO;
import com.renovabio.renovabioapi.dto.UsuarioRequestDTO;
import com.renovabio.renovabioapi.dto.UsuarioResponseDTO;
import com.renovabio.renovabioapi.model.Cidade;
import com.renovabio.renovabioapi.model.TipoUsuario;
import com.renovabio.renovabioapi.model.Usuario;
import com.renovabio.renovabioapi.repository.CidadeRepository;
import com.renovabio.renovabioapi.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Locale;
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

    @Autowired
    private FileStorageService fileStorageService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private TokenService tokenService;

    public UsuarioResponseDTO criarUsuario(UsuarioRequestDTO dto) {
        if (usuarioRepository.findByEmail(dto.getEmail()).isPresent()) {
            throw new ResponseStatusException(CONFLICT, "Email ja cadastrado");
        }

        Cidade cidade = cidadeRepository.findById(dto.getCidadeId())
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Cidade nao encontrada"));

        Usuario usuario = new Usuario();
        usuario.setNome(dto.getNome());
        usuario.setEmail(dto.getEmail());
        usuario.setSenha(passwordEncoder.encode(dto.getSenha()));
        usuario.setCidade(cidade);
        usuario.setTipo(dto.getTipo() != null ? dto.getTipo() : TipoUsuario.CIDADAO);

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

        if (!senhaConfere(dto.getSenha(), usuario.getSenha())) {
            throw new ResponseStatusException(UNAUTHORIZED, "Email ou senha invalidos");
        }

        if (!usuario.getSenha().startsWith("$2")) {
            usuario.setSenha(passwordEncoder.encode(dto.getSenha()));
            usuarioRepository.save(usuario);
        }

        UsuarioResponseDTO response = toResponseDTO(usuario);
        response.setToken(tokenService.gerarToken(usuario.getidUsuario()));
        return response;
    }

    public List<UsuarioResponseDTO> listarUsuarios() {
        return usuarioRepository.findAll().stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    public List<UsuarioResponseDTO> listarUsuariosPorCidade(Long cidadeId) {
        return usuarioRepository.findByCidadeId(cidadeId).stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    public UsuarioResponseDTO buscarUsuario(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Usuario nao encontrado"));

        return toResponseDTO(usuario);
    }

    public void atualizarSenha(Long id, AtualizarSenhaRequestDTO dto) {
        if (dto.getNovaSenha() == null || dto.getNovaSenha().isBlank()) {
            throw new ResponseStatusException(BAD_REQUEST, "A nova senha e obrigatoria");
        }

        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Usuario nao encontrado"));

        usuario.setSenha(passwordEncoder.encode(dto.getNovaSenha()));
        usuarioRepository.save(usuario);
    }

    public void recuperarSenha(RecuperarSenhaRequestDTO dto) {
        if (dto.getEmail() == null || dto.getEmail().isBlank()) {
            throw new ResponseStatusException(BAD_REQUEST, "Email e obrigatorio");
        }

        if (dto.getNovaSenha() == null || dto.getNovaSenha().isBlank()) {
            throw new ResponseStatusException(BAD_REQUEST, "A nova senha e obrigatoria");
        }

        if (dto.getNovaSenha().trim().length() < 4) {
            throw new ResponseStatusException(BAD_REQUEST, "A nova senha precisa ter pelo menos 4 caracteres");
        }

        String email = normalizarEmail(dto.getEmail());
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Usuario nao encontrado"));

        usuario.setSenha(passwordEncoder.encode(dto.getNovaSenha().trim()));
        usuarioRepository.save(usuario);
    }

    public UsuarioResponseDTO atualizarFotoPerfil(Long id, MultipartFile file) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Usuario nao encontrado"));

        String fotoUrl = fileStorageService.salvarImagem(file, "perfil");
        usuario.setFotoPerfilUrl(fotoUrl);

        return toResponseDTO(usuarioRepository.save(usuario));
    }

    public UsuarioResponseDTO removerFotoPerfil(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Usuario nao encontrado"));

        usuario.setFotoPerfilUrl(null);
        return toResponseDTO(usuarioRepository.save(usuario));
    }

    private UsuarioResponseDTO toResponseDTO(Usuario usuario) {
        UsuarioResponseDTO dto = new UsuarioResponseDTO();
        dto.setId(usuario.getidUsuario());
        dto.setNome(usuario.getNome());
        dto.setEmail(usuario.getEmail());
        dto.setPontuacao(usuario.getPontuacaoAtual());
        dto.setPhotoUri(usuario.getFotoPerfilUrl());
        dto.setTipo(usuario.getTipo());
        return dto;
    }

    private boolean senhaConfere(String senhaDigitada, String senhaSalva) {
        if (senhaSalva == null) {
            return false;
        }

        if (senhaSalva.startsWith("$2")) {
            return passwordEncoder.matches(senhaDigitada, senhaSalva);
        }

        return senhaSalva.equals(senhaDigitada);
    }

    private String normalizarEmail(String email) {
        return email.trim().toLowerCase(Locale.ROOT);
    }
}
