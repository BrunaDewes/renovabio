package com.renovabio.renovabioapi.controller;

import com.renovabio.renovabioapi.dto.UsuarioRequestDTO;
import com.renovabio.renovabioapi.dto.UsuarioResponseDTO;
import com.renovabio.renovabioapi.service.UsuarioService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/usuarios")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    @PostMapping
    public UsuarioResponseDTO criarUsuario(@RequestBody UsuarioRequestDTO dto) {
        return usuarioService.criarUsuario(dto);
    }

    @GetMapping
    public List<UsuarioResponseDTO> listarUsuarios() {
        return usuarioService.listarUsuarios();
    }
}