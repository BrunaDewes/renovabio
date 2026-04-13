package com.renovabio.renovabioapi.controller;

import com.renovabio.renovabioapi.dto.AtualizarSenhaRequestDTO;
import com.renovabio.renovabioapi.dto.LoginRequestDTO;
import com.renovabio.renovabioapi.dto.UsuarioRequestDTO;
import com.renovabio.renovabioapi.dto.UsuarioResponseDTO;
import com.renovabio.renovabioapi.model.AcaoUsuario;
import com.renovabio.renovabioapi.repository.AcaoUsuarioRepository;
import com.renovabio.renovabioapi.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/usuarios")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private AcaoUsuarioRepository acaoUsuarioRepository;

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
        return usuarioService.listarUsuarios();
    }

    @GetMapping("/{id}")
    public UsuarioResponseDTO buscarUsuario(@PathVariable Long id) {
        return usuarioService.buscarUsuario(id);
    }

    @PatchMapping("/{id}/senha")
    public void atualizarSenha(@PathVariable Long id, @RequestBody AtualizarSenhaRequestDTO dto) {
        usuarioService.atualizarSenha(id, dto);
    }

    @GetMapping("/{id}/acoes")
    public List<AcaoUsuario> listarAcoesUsuario(@PathVariable Long id) {
        return acaoUsuarioRepository.findByUsuarioIdUsuario(id);
    }
}
