package com.renovabio.renovabioapi.dto;

//retorna dados para o cliente sem senha.
public class UsuarioResponseDTO {

    private Long id;
    private String nome;
    private String email;
    private Integer pontuacao;
    private String photoUri;
    private String token;

    // getters e setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public Integer getPontuacao() { return pontuacao; }
    public void setPontuacao(Integer pontuacao) { this.pontuacao = pontuacao; }

    public String getPhotoUri() { return photoUri; }
    public void setPhotoUri(String photoUri) { this.photoUri = photoUri; }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
}
