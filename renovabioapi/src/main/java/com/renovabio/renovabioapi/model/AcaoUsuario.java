package com.renovabio.renovabioapi.model;

import java.io.Serializable;
import java.time.LocalDateTime;
import jakarta.persistence.*;

@Entity
@Table(name = "AcaoUsuario")
public class AcaoUsuario implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idAcaoUsuario")
    private Long id;

    @Enumerated(EnumType.STRING)
    private TipoAcao tipoAcao;

    private Integer pontosGerados;

    @Column(length = 100)
    private String comprovante; // Caminho/URL da foto enviada

    private LocalDateTime dataAcao = LocalDateTime.now();

    private Long idReferencia; // Guarda o ID do Desafio ou Receita que gerou os pontos

    @ManyToOne
    @JoinColumn(name = "Usuario_idUsuario")
    private Usuario usuario;

    // Construtores 
    public AcaoUsuario() {}

    public AcaoUsuario(TipoAcao tipoAcao, Integer pontosGerados, String comprovante, Long idReferencia, Usuario usuario) {
        this.tipoAcao = tipoAcao;
        this.pontosGerados = pontosGerados;
        this.comprovante = comprovante;
        this.idReferencia = idReferencia;
        this.usuario = usuario;
    }

    // Getters e Setters 
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public TipoAcao getTipoAcao() { return tipoAcao; }
    public void setTipoAcao(TipoAcao tipoAcao) { this.tipoAcao = tipoAcao; }

    public Integer getPontosGerados() { return pontosGerados; }
    public void setPontosGerados(Integer pontosGerados) { this.pontosGerados = pontosGerados; }

    public String getComprovante() { return comprovante; }
    public void setComprovante(String comprovante) { this.comprovante = comprovante; }

    public LocalDateTime getDataAcao() { return dataAcao; }
    public void setDataAcao(LocalDateTime dataAcao) { this.dataAcao = dataAcao; }

    public Long getIdReferencia() { return idReferencia; }
    public void setIdReferencia(Long idReferencia) { this.idReferencia = idReferencia; }

    public Usuario getUsuario() { return usuario; }
    public void setUsuario(Usuario usuario) { this.usuario = usuario; }
}
