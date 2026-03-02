package com.renovabio.renovabioapi.model;

import java.io.Serializable;
import java.time.LocalDateTime;
import jakarta.persistence.*;

@Entity
@Table(name = "HistoricoPontuacao")
public class HistoricoPontuacao implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idHistoricoPontuacao")
    private Long id;

    @Enumerated(EnumType.STRING)
    private TipoPontuacao tipoPontuacao;

    private Integer quantidade;

    @Column(length = 45)
    private String descricao;

    private LocalDateTime dataRegistro = LocalDateTime.now();

    @ManyToOne
    @JoinColumn(name = "Usuario_idusuario")
    private Usuario usuario;

    // Construtores
    public HistoricoPontuacao() {}

    public HistoricoPontuacao(TipoPontuacao tipoPontuacao, Integer quantidade, String descricao, Usuario usuario) {
        this.tipoPontuacao = tipoPontuacao;
        this.quantidade = quantidade;
        this.descricao = descricao;
        this.usuario = usuario;
    }

    // Getters e Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public TipoPontuacao getTipoPontuacao() { return tipoPontuacao; }
    public void setTipoPontuacao(TipoPontuacao tipoPontuacao) { this.tipoPontuacao = tipoPontuacao; }

    public Integer getQuantidade() { return quantidade; }
    public void setQuantidade(Integer quantidade) { this.quantidade = quantidade; }

    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }

    public LocalDateTime getDataRegistro() { return dataRegistro; }
    public void setDataRegistro(LocalDateTime dataRegistro) { this.dataRegistro = dataRegistro; }

    public Usuario getUsuario() { return usuario; }
    public void setUsuario(Usuario usuario) { this.usuario = usuario; }
}