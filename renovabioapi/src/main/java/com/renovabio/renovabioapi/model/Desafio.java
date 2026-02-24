package com.renovabio.renovabioapi.model;

import java.io.Serializable;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "desafio") //só pra definir o nome da tabela
public class Desafio implements Serializable {  
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idDesafio")
    private Long idDesafio;
    
    @Column(nullable = false, length = 45) //tamanho igual ao BD - o nullable diz que o campo é obrigatório
    private String titulo;

    @Column(columnDefinition = "TEXT") 
    private String descricao;

    private Integer pontos;
    private Integer duracaoDias;
    private Boolean ativo = true;

    @ManyToOne
    @JoinColumn(name = "Categoria_idCategoria")
    private Categoria categoria;

    // --- Construtores ---
    public Desafio() { }   //evita que o sistema quebre ao criar um desafio sem passar os dados

    public Desafio(String titulo, String descricao, Integer pontos, Integer duracaoDias, Categoria categoria) {
        this.titulo = titulo;
        this.descricao = descricao;
        this.pontos = pontos;
        this.duracaoDias = duracaoDias;
        this.categoria = categoria;
    }

    // --- Getters e Setters ---

    public Long getId() {
        return idDesafio;
    }

    public void setId(Long id) {
        this.idDesafio = id;
    }

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public Integer getPontos() {
        return pontos;
    }

    public void setPontos(Integer pontos) {
        this.pontos = pontos;
    }

    public Integer getDuracaoDias() {
        return duracaoDias;
    }

    public void setDuracaoDias(Integer duracaoDias) {
        this.duracaoDias = duracaoDias;
    }

    public Boolean getAtivo() {
        return ativo;
    }

    public void setAtivo(Boolean ativo) {
        this.ativo = ativo;
    }

    public Categoria getCategoria() {
        return categoria;
    }

    public void setCategoria(Categoria categoria) {
        this.categoria = categoria;
    }

}
