package com.renovabio.renovabioapi.service;

import com.renovabio.renovabioapi.dto.AtualizarSenhaRequestDTO;
import com.renovabio.renovabioapi.dto.ConfirmarRecuperacaoSenhaRequestDTO;
import com.renovabio.renovabioapi.dto.LoginRequestDTO;
import com.renovabio.renovabioapi.dto.SolicitarRecuperacaoSenhaRequestDTO;
import com.renovabio.renovabioapi.dto.UsuarioRequestDTO;
import com.renovabio.renovabioapi.dto.UsuarioResponseDTO;
import com.renovabio.renovabioapi.model.Cidade;
import com.renovabio.renovabioapi.model.RecuperacaoSenha;
import com.renovabio.renovabioapi.model.TipoUsuario;
import com.renovabio.renovabioapi.model.Usuario;
import com.renovabio.renovabioapi.repository.CidadeRepository;
import com.renovabio.renovabioapi.repository.RecuperacaoSenhaRepository;
import com.renovabio.renovabioapi.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;

import static org.springframework.http.HttpStatus.BAD_REQUEST;
import static org.springframework.http.HttpStatus.CONFLICT;
import static org.springframework.http.HttpStatus.NOT_FOUND;
import static org.springframework.http.HttpStatus.UNAUTHORIZED;

@Service
public class UsuarioService {

    private static final int MINUTOS_VALIDADE_CODIGO = 30;
    private static final SecureRandom RANDOM = new SecureRandom();

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

    @Autowired
    private RecuperacaoSenhaRepository recuperacaoSenhaRepository;

    @Autowired
    private JavaMailSender mailSender;

    @Value("${renovabio.mail.from:}")
    private String mailFrom;

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

    public void solicitarCodigoRecuperacao(SolicitarRecuperacaoSenhaRequestDTO dto) {
        if (dto.getEmail() == null || dto.getEmail().isBlank()) {
            throw new ResponseStatusException(BAD_REQUEST, "Email e obrigatorio");
        }

        String email = normalizarEmail(dto.getEmail());
        usuarioRepository.findByEmail(email).ifPresent(usuario -> {
            String codigo = gerarCodigoRecuperacao();
            RecuperacaoSenha recuperacao = new RecuperacaoSenha();
            recuperacao.setEmail(email);
            recuperacao.setCodigoHash(passwordEncoder.encode(codigo));
            recuperacao.setExpiraEm(LocalDateTime.now().plusMinutes(MINUTOS_VALIDADE_CODIGO));
            recuperacao.setUsado(false);
            recuperacaoSenhaRepository.save(recuperacao);
            enviarCodigoRecuperacao(email, codigo);
        });
    }

    public void confirmarRecuperacaoSenha(ConfirmarRecuperacaoSenhaRequestDTO dto) {
        if (dto.getEmail() == null || dto.getEmail().isBlank()) {
            throw new ResponseStatusException(BAD_REQUEST, "Email e obrigatorio");
        }

        if (dto.getCodigo() == null || dto.getCodigo().isBlank()) {
            throw new ResponseStatusException(BAD_REQUEST, "Codigo e obrigatorio");
        }

        if (dto.getNovaSenha() == null || dto.getNovaSenha().isBlank()) {
            throw new ResponseStatusException(BAD_REQUEST, "A nova senha e obrigatoria");
        }

        if (dto.getNovaSenha().trim().length() < 4) {
            throw new ResponseStatusException(BAD_REQUEST, "A nova senha precisa ter pelo menos 4 caracteres");
        }

        String email = normalizarEmail(dto.getEmail());
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(BAD_REQUEST, "Codigo invalido ou expirado"));

        RecuperacaoSenha recuperacao = recuperacaoSenhaRepository
                .findFirstByEmailAndUsadoFalseOrderByCriadoEmDesc(email)
                .orElseThrow(() -> new ResponseStatusException(BAD_REQUEST, "Codigo invalido ou expirado"));

        if (recuperacao.getExpiraEm().isBefore(LocalDateTime.now())
                || !passwordEncoder.matches(dto.getCodigo().trim(), recuperacao.getCodigoHash())) {
            throw new ResponseStatusException(BAD_REQUEST, "Codigo invalido ou expirado");
        }

        usuario.setSenha(passwordEncoder.encode(dto.getNovaSenha().trim()));
        usuarioRepository.save(usuario);

        recuperacao.setUsado(true);
        recuperacaoSenhaRepository.save(recuperacao);
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

    private String gerarCodigoRecuperacao() {
        return String.format(Locale.ROOT, "%06d", RANDOM.nextInt(1_000_000));
    }

    private void enviarCodigoRecuperacao(String email, String codigo) {
        try {
            SimpleMailMessage mensagem = new SimpleMailMessage();
            if (mailFrom != null && !mailFrom.isBlank()) {
                mensagem.setFrom(mailFrom);
            }
            mensagem.setTo(email);
            mensagem.setSubject("Codigo de recuperacao RenovaBio");
            mensagem.setText(
                    "Seu codigo de recuperacao do RenovaBio e: " + codigo + "\n\n"
                            + "Ele expira em " + MINUTOS_VALIDADE_CODIGO + " minutos.\n"
                            + "Se voce nao solicitou essa recuperacao, ignore este email."
            );
            mailSender.send(mensagem);
        } catch (MailException exception) {
            throw new ResponseStatusException(BAD_REQUEST, "Nao foi possivel enviar o codigo por email");
        }
    }

    private String normalizarEmail(String email) {
        return email.trim().toLowerCase(Locale.ROOT);
    }
}
