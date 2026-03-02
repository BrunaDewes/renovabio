package com.renovabio.renovabioapi.model;

import java.io.Serializable;
import java.time.LocalDate;
import jakarta.persistence.*;

@Entity
@Table(name = "Usuario_has_Desafio") // nome igual do banco
public class UsuarioDesafio implements Serializable {
    //essa é a chave composta (classe auxiliar)
    @EmbeddedId
    private UsuarioDesafioId id = new UsuarioDesafioId();

    // RELACIONAMENTO COM USUÁRIO
    @ManyToOne
    @MapsId("usuarioId") // Conecta com o ID dentro da chave composta
    @JoinColumn(name = "Usuario_idusuario") // Nome da coluna no banco
    private Usuario usuario;

    // RELACIONAMENTO COM DESAFIO
    @ManyToOne
    @MapsId("desafioId") // Conecta com o ID dentro da chave composta
    @JoinColumn(name = "Desafio_idDesafio") // Nome da coluna no banco
    private Desafio desafio;

    // OUTROS CAMPOS 
    @Enumerated(EnumType.STRING)
    private StatusDesafio status;
    
    private Integer progresso; 
    
    @Column(columnDefinition = "DATE")
    private LocalDate dataInicio;

    @Column(columnDefinition = "DATE")
    private LocalDate dataFim;

    // Construtores
    public UsuarioDesafio() {}

    public UsuarioDesafio(Usuario usuario, Desafio desafio, StatusDesafio status) {
        this.usuario = usuario;
        this.desafio = desafio;
        this.status = status;
        this.id = new UsuarioDesafioId(usuario.getIdUsuario(), desafio.getId());
        this.dataInicio = LocalDate.now(); // Define data atual automaticamente
    }

    // getters e setters
    public UsuarioDesafioId getId() { return id; }
    public void setId(UsuarioDesafioId id) { this.id = id; }

    public Usuario getUsuario() { return usuario; }
    public void setUsuario(Usuario usuario) { this.usuario = usuario; }

    public Desafio getDesafio() { return desafio; }
    public void setDesafio(Desafio desafio) { this.desafio = desafio; }

    public StatusDesafio getStatus() { return status; }
    public void setStatus(StatusDesafio status) { this.status = status; }

    public Integer getProgresso() { return progresso; }
    public void setProgresso(Integer progresso) { this.progresso = progresso; }

    public LocalDate getDataInicio() { return dataInicio; }
    public void setDataInicio(LocalDate dataInicio) { this.dataInicio = dataInicio; }

    public LocalDate getDataFim() { return dataFim; }
    public void setDataFim(LocalDate dataFim) { this.dataFim = dataFim; }
}
