package com.renovabio.renovabioapi.model;

import java.io.Serializable;

import jakarta.persistence.*;

@Entity
@Table(name = "Recompensa") //só pra definir o nome da tabela
public class Recompensa implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idRecompensa")
    private Long idRecompensa;

    @Column(name = "descricao", length = 200, nullable = false)
    private String descricao;
    
    private Integer pontosNecessarios;

    private Integer quantidadeDisponivel;

    private Boolean ativo = true;

    @ManyToOne
    @JoinColumn(name = "Parceiro_idParceiros")
    private Parceiro parceiro;

    // Construtores
    public Recompensa() { 
        // Obrigatório para o JPA/Hibernate pois ele exige um construtor sem argumentos 
        // para criar as instâncias a partir do banco de dados.
    }

    public Recompensa(String descricao, Integer pontosNecessarios, Integer quantidadeDisponivel, Parceiro parceiro) {
        this.descricao = descricao;
        this.pontosNecessarios = pontosNecessarios;
        this.quantidadeDisponivel = quantidadeDisponivel;
        this.parceiro = parceiro;
    }

    // getters e setters
    public Long getId() { return idRecompensa; }
    public void setId(Long id) { this.idRecompensa  = id; }

    public Parceiro getParceiro() { return parceiro; }
    public void setParceiro(Parceiro parceiro) { this.parceiro = parceiro; }

    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }

    public Integer getPontosNecessarios() { return pontosNecessarios; }
    public void setPontosNecessarios(Integer pontosNecessarios) { this.pontosNecessarios = pontosNecessarios; }

    public Integer getQuantidadeDisponivel() { return quantidadeDisponivel; }
    public void setQuantidadeDisponivel(Integer quantidadeDisponivel) { this.quantidadeDisponivel = quantidadeDisponivel; }

    public Boolean getAtivo() { return ativo; }
    public void setAtivo(Boolean ativo) { this.ativo = ativo; }
}
