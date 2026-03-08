package com.renovabio.renovabioapi.model;


import java.io.Serializable;
import java.time.LocalDateTime;
import jakarta.persistence.*;

@Entity
public class Usuario implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idUsuario;

    @Column(name = "nome", length = 45, nullable = false)
    private String nome;

    @Column(name = "email", length = 45, nullable = false)
    private String email;

    @Column(name = "senha", length = 100, nullable = false)
    private String senha;

    @Column(name = "pontuacaoAtual")
    private Integer pontuacaoAtual = 0;
    
    @Enumerated(EnumType.STRING)
    private TipoUsuario tipo;

    @ManyToOne
    @JoinColumn(name = "Cidade_idCidade")
    private Cidade cidade;

    private LocalDateTime dataCadastro = LocalDateTime.now();

    private Boolean ativo = true;


    // getters e setters
    public Long getidUsuario() {
        return idUsuario;
    }   

    public void setidUsuario(Long id) {
        this.idUsuario = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getSenha() {
        return senha;
    }

    public void setSenha(String senha) {
        this.senha = senha;
    }

    public Cidade getCidade() {
        return cidade;
    }

    public void setCidade(Cidade cidade) {
        this.cidade = cidade;
    }

    public Integer getPontuacaoAtual() {
        return pontuacaoAtual;
    }

    public void setPontuacaoAtual(Integer pontuacaoAtual) {
        this.pontuacaoAtual = pontuacaoAtual;
    }

    public TipoUsuario getTipo() {
        return tipo;
    }

    public void setTipo(TipoUsuario tipo) {
        this.tipo = tipo;
    }

    public LocalDateTime getDataCadastro() {
        return dataCadastro;
    }

    public void setDataCadastro(LocalDateTime dataCadastro) {
        this.dataCadastro = dataCadastro;
    }

    public Boolean getAtivo() {
        return ativo;
    }

    public void setAtivo(Boolean ativo) {
        this.ativo = ativo;
    }
}
