package com.renovabio.renovabioapi.dto;

import com.renovabio.renovabioapi.model.TipoUsuario;

// recebe dados do cadastro
public class UsuarioRequestDTO {

    private String nome;
    private String email;
    private String senha;
    private Long cidadeId;
    private TipoUsuario tipo;

    // getters e setters
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getSenha() { return senha; }
    public void setSenha(String senha) { this.senha = senha; }

    public Long getCidadeId() { return cidadeId; }
    public void setCidadeId(Long cidadeId) { this.cidadeId = cidadeId;  }

    public TipoUsuario getTipo() { return tipo; }
    public void setTipo(TipoUsuario tipo) { this.tipo = tipo; }
}
