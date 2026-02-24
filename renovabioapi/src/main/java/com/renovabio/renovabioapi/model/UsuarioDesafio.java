package com.renovabio.renovabioapi.model;

import java.io.Serializable;
import java.util.Objects;

public class UsuarioDesafio implements Serializable {
    private Long usuarioId;
    private Long desafioId;

    // Construtores
    public UsuarioDesafio() {}

    public UsuarioDesafio(Long usuarioId, Long desafioId) {
        this.usuarioId = usuarioId;
        this.desafioId = desafioId;
    }

    // getters e setters
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

    // hashCode e equals para garantir a unicidade da chave composta
    @Override
    public int hashCode() {
        return Objects.hash(usuarioId, desafioId);   //gera um hash code baseado nos ids do usuario e do desafio pra garantir a unicidade da chave composta
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;                                      //compara com ele mesmo
        if (obj == null || getClass() != obj.getClass()) return false;     //ve se o objeto é nulo ou de classe diferente, se for, é falso
 
        UsuarioDesafio that = (UsuarioDesafio) obj; 

        return usuarioId.equals(that.usuarioId) && desafioId.equals(that.desafioId);   //compara os ids do usuário e do desafio para verificar se são iguais
    }
}
