package com.renovabio.renovabioapi.model;

import java.io.Serializable;
import jakarta.persistence.*;

@Entity
@Table(name = "Parceiro") // Nome igual ao BD
public class Parceiro implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idParceiros") 
    private Long id;

    @Column(name = "nomeParceiro", length = 45, nullable = false)
    private String nome;

    @Column(length = 45)
    private String descricao;

    private Boolean ativo = true;

    // Todo parceiro pertence a uma cidade
    @ManyToOne
    @JoinColumn(name = "Cidade_idCidade") 
    private Cidade cidade;

    // --- Construtores ---
    public Parceiro() {}

    public Parceiro(String nome, String descricao, Cidade cidade) {
        this.nome = nome;
        this.descricao = descricao;
        this.cidade = cidade;
    }

    // --- Getters e Setters ---
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }

    public Boolean getAtivo() { return ativo; }
    public void setAtivo(Boolean ativo) { this.ativo = ativo; }

    public Cidade getCidade() { return cidade; }
    public void setCidade(Cidade cidade) { this.cidade = cidade; }
}