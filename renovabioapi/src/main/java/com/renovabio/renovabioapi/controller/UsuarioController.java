package com.renovabio.renovabioapi.controller;

import com.renovabio.renovabioapi.dto.AtualizarSenhaRequestDTO;
import com.renovabio.renovabioapi.dto.ConfirmarRecuperacaoSenhaRequestDTO;
import com.renovabio.renovabioapi.dto.LoginRequestDTO;
import com.renovabio.renovabioapi.dto.SolicitarRecuperacaoSenhaRequestDTO;
import com.renovabio.renovabioapi.dto.UsuarioRequestDTO;
import com.renovabio.renovabioapi.dto.UsuarioResponseDTO;
import com.renovabio.renovabioapi.model.AcaoUsuario;
import com.renovabio.renovabioapi.model.Usuario;
import com.renovabio.renovabioapi.repository.AcaoUsuarioRepository;
import com.renovabio.renovabioapi.repository.UsuarioRepository;
import com.renovabio.renovabioapi.service.UsuarioService;
import com.renovabio.renovabioapi.service.UsuarioAutenticadoService;
import org.springframework.http.HttpStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/usuarios")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private AcaoUsuarioRepository acaoUsuarioRepository;

    @Autowired
    private UsuarioAutenticadoService usuarioAutenticadoService;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @PostMapping
    public UsuarioResponseDTO criarUsuario(@RequestBody UsuarioRequestDTO dto) {
        return usuarioService.criarUsuario(dto);
    }

    @PostMapping("/login")
    public UsuarioResponseDTO login(@RequestBody LoginRequestDTO dto) {
        return usuarioService.login(dto);
    }

    @GetMapping
    public List<UsuarioResponseDTO> listarUsuarios() {
        if (usuarioAutenticadoService.isPrefeituraAutenticada()) {
            return usuarioService.listarUsuariosPorCidade(usuarioAutenticadoService.getCidadePrefeituraObrigatoria());
        }

        return usuarioService.listarUsuarios();
    }

    @GetMapping("/{id}")
    public UsuarioResponseDTO buscarUsuario(@PathVariable Long id) {
        validarAcessoAoUsuario(id);
        return usuarioService.buscarUsuario(id);
    }

    @PatchMapping("/{id}/senha")
    public void atualizarSenha(@PathVariable Long id, @RequestBody AtualizarSenhaRequestDTO dto) {
        usuarioService.atualizarSenha(id, dto);
    }

    @PostMapping("/recuperar-senha/codigo")
    public void solicitarCodigoRecuperacao(@RequestBody SolicitarRecuperacaoSenhaRequestDTO dto) {
        usuarioService.solicitarCodigoRecuperacao(dto);
    }

    @PostMapping("/recuperar-senha/confirmar")
    public void confirmarRecuperacaoSenha(@RequestBody ConfirmarRecuperacaoSenhaRequestDTO dto) {
        usuarioService.confirmarRecuperacaoSenha(dto);
    }

    @PostMapping("/{id}/foto")
    public UsuarioResponseDTO atualizarFotoPerfil(@PathVariable Long id, @RequestParam("file") MultipartFile file) {
        return usuarioService.atualizarFotoPerfil(id, file);
    }

    @DeleteMapping("/{id}/foto")
    public UsuarioResponseDTO removerFotoPerfil(@PathVariable Long id) {
        return usuarioService.removerFotoPerfil(id);
    }

    @GetMapping("/{id}/acoes")
    public List<AcaoUsuario> listarAcoesUsuario(@PathVariable Long id) {
        validarAcessoAoUsuario(id);
        return acaoUsuarioRepository.findByUsuarioIdUsuario(id);
    }

    private void validarAcessoAoUsuario(Long usuarioId) {
        if (!usuarioAutenticadoService.isPrefeituraAutenticada()) {
            return;
        }

        Long cidadeId = usuarioAutenticadoService.getCidadePrefeituraObrigatoria();
        Usuario alvo = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario nao encontrado"));

        if (alvo.getCidade() == null || !cidadeId.equals(alvo.getCidade().getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "A prefeitura so pode consultar usuarios da propria cidade");
        }
    }
}
