package com.renovabio.renovabioapi.dto;

import java.time.LocalDateTime;

public class HistoricoTrocaRecompensaDTO {

    private Long id;
    private String recompensaDescricao;
    private String parceiroNome;
    private Integer pontosUtilizados;
    private String codigoVoucher;
    private String status;
    private LocalDateTime dataTroca;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getRecompensaDescricao() {
        return recompensaDescricao;
    }

    public void setRecompensaDescricao(String recompensaDescricao) {
        this.recompensaDescricao = recompensaDescricao;
    }

    public String getParceiroNome() {
        return parceiroNome;
    }

    public void setParceiroNome(String parceiroNome) {
        this.parceiroNome = parceiroNome;
    }

    public Integer getPontosUtilizados() {
        return pontosUtilizados;
    }

    public void setPontosUtilizados(Integer pontosUtilizados) {
        this.pontosUtilizados = pontosUtilizados;
    }

    public String getCodigoVoucher() {
        return codigoVoucher;
    }

    public void setCodigoVoucher(String codigoVoucher) {
        this.codigoVoucher = codigoVoucher;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getDataTroca() {
        return dataTroca;
    }

    public void setDataTroca(LocalDateTime dataTroca) {
        this.dataTroca = dataTroca;
    }
}
