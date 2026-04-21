package com.renovabio.renovabioapi.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "ComprovacaoDesafio")
public class ComprovacaoDesafio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "UsuarioDesafio_id")
    private UsuarioDesafio usuarioDesafio;

    @Column(length = 255, nullable = false)
    private String imagemUrl;

    private LocalDateTime dataEnvio = LocalDateTime.now();

    public Long getId() {
        return id;
    }

    public UsuarioDesafio getUsuarioDesafio() {
        return usuarioDesafio;
    }

    public void setUsuarioDesafio(UsuarioDesafio usuarioDesafio) {
        this.usuarioDesafio = usuarioDesafio;
    }

    public String getImagemUrl() {
        return imagemUrl;
    }

    public void setImagemUrl(String imagemUrl) {
        this.imagemUrl = imagemUrl;
    }

    public LocalDateTime getDataEnvio() {
        return dataEnvio;
    }

    public void setDataEnvio(LocalDateTime dataEnvio) {
        this.dataEnvio = dataEnvio;
    }
}
