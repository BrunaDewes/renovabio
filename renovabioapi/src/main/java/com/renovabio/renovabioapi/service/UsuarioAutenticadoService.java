package com.renovabio.renovabioapi.service;

import com.renovabio.renovabioapi.model.TipoUsuario;
import com.renovabio.renovabioapi.model.Usuario;
import com.renovabio.renovabioapi.repository.UsuarioRepository;
import java.util.Optional;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class UsuarioAutenticadoService {

    private final UsuarioRepository usuarioRepository;

    public UsuarioAutenticadoService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    public Optional<Usuario> getUsuarioAutenticado() {
        Object principal = SecurityContextHolder.getContext().getAuthentication() != null
                ? SecurityContextHolder.getContext().getAuthentication().getPrincipal()
                : null;

        if (principal instanceof Long usuarioId) {
            return usuarioRepository.findById(usuarioId);
        }

        return Optional.empty();
    }

    public Optional<Long> getCidadePrefeituraAutenticada() {
        return getUsuarioAutenticado()
                .filter(usuario -> usuario.getTipo() == TipoUsuario.PREFEITURA)
                .map(Usuario::getCidade)
                .map(cidade -> cidade != null ? cidade.getId() : null);
    }

    public boolean isPrefeituraAutenticada() {
        return getUsuarioAutenticado()
                .map(usuario -> usuario.getTipo() == TipoUsuario.PREFEITURA)
                .orElse(false);
    }

    public Long getCidadePrefeituraObrigatoria() {
        return getUsuarioAutenticado()
                .filter(usuario -> usuario.getTipo() == TipoUsuario.PREFEITURA)
                .map(Usuario::getCidade)
                .map(cidade -> cidade != null ? cidade.getId() : null)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.FORBIDDEN, "Cidade da prefeitura nao encontrada"));
    }

    public void validarCidadeDaPrefeitura(Long cidadeId) {
        Long cidadePrefeitura = getCidadePrefeituraObrigatoria();

        if (!cidadePrefeitura.equals(cidadeId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "A prefeitura so pode gerenciar dados da propria cidade");
        }
    }
}
