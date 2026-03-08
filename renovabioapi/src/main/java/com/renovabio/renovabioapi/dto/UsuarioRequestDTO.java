package com.renovabio.renovabioapi.dto;

// recebe dados do cadastro
public class UsuarioRequestDTO {

    private String nome;
    private String email;
    private String senha;
    private Long cidadeId;

    // getters e setters
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getSenha() { return senha; }
    public void setSenha(String senha) { this.senha = senha; }

    public Long getCidadeId() { return cidadeId; }
    public void setCidadeId(Long cidadeId) { this.cidadeId = cidadeId;  }
}