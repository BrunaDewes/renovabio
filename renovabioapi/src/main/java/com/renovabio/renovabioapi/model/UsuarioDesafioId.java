package com.renovabio.renovabioapi.model;

import jakarta.persistence.Embeddable;
import java.io.Serializable;
import java.util.Objects;


// Classe auxiliar para representar a chave composta entre Usuario e Desafio - ou seja, 
// para poder informar quais desafios cada usuário tem, e quais usuários estão em cada desafio.

@Embeddable
public class UsuarioDesafioId implements Serializable {

    private Long usuarioId;
    private Long desafioId;

    // --- Construtores ---
    public UsuarioDesafioId() {}

    public UsuarioDesafioId(Long usuarioId, Long desafioId) {
        this.usuarioId = usuarioId;
        this.desafioId = desafioId;
    }

    // --- Getters e Setters ---
    public Long getUsuarioId() {
        return usuarioId;
    }

    public void setUsuarioId(Long usuarioId) {
        this.usuarioId = usuarioId;
    }

    public Long getDesafioId() {
        return desafioId;
    }

    public void setDesafioId(Long desafioId) {
        this.desafioId = desafioId;
    }

    // --- equals e hashCode (Obrigatórios para chave composta) ---
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        
        UsuarioDesafioId that = (UsuarioDesafioId) o;
        
        return Objects.equals(usuarioId, that.usuarioId) &&
               Objects.equals(desafioId, that.desafioId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(usuarioId, desafioId);
    }
}
