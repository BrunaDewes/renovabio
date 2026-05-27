package com.renovabio.renovabioapi.dto;

public class RecompensaRequestDTO {

    private String descricao;
    private Integer pontosNecessarios;
    private Integer quantidadeDisponivel;
    private Long parceiroId;
    private Boolean ativo;

    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }

    public Integer getPontosNecessarios() { return pontosNecessarios; }
    public void setPontosNecessarios(Integer pontosNecessarios) { this.pontosNecessarios = pontosNecessarios; }

    public Integer getQuantidadeDisponivel() { return quantidadeDisponivel; }
    public void setQuantidadeDisponivel(Integer quantidadeDisponivel) { this.quantidadeDisponivel = quantidadeDisponivel; }

    public Long getParceiroId() { return parceiroId; }
    public void setParceiroId(Long parceiroId) { this.parceiroId = parceiroId; }

    public Boolean getAtivo() { return ativo; }
    public void setAtivo(Boolean ativo) { this.ativo = ativo; }
}
