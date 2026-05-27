package com.renovabio.renovabioapi.dto;

public class ParceiroRequestDTO {

    private String nome;
    private String descricao;
    private Long cidadeId;
    private Boolean ativo;

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }

    public Long getCidadeId() { return cidadeId; }
    public void setCidadeId(Long cidadeId) { this.cidadeId = cidadeId; }

    public Boolean getAtivo() { return ativo; }
    public void setAtivo(Boolean ativo) { this.ativo = ativo; }
}
