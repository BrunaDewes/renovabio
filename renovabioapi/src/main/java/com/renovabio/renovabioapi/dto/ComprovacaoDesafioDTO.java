package com.renovabio.renovabioapi.dto;

import java.time.LocalDateTime;

public class ComprovacaoDesafioDTO {

    private Long id;
    private Long usuarioDesafioId;
    private String imagemUrl;
    private LocalDateTime dataEnvio;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUsuarioDesafioId() {
        return usuarioDesafioId;
    }

    public void setUsuarioDesafioId(Long usuarioDesafioId) {
        this.usuarioDesafioId = usuarioDesafioId;
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
