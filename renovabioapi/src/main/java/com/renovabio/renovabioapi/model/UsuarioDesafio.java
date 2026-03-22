package com.renovabio.renovabioapi.model;

import java.time.LocalDate;
import jakarta.persistence.*;

@Entity
@Table(name = "usuario_has_desafio") // nome igual do banco
public class UsuarioDesafio {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // RELACIONAMENTO COM USUÁRIO
    @ManyToOne
    @JoinColumn(name = "usuario_id_usuario") // Nome da coluna no banco
    private Usuario usuario;

    // RELACIONAMENTO COM DESAFIO
    @ManyToOne
    @JoinColumn(name = "desafio_id_desafio") // Nome da coluna no banco
    private Desafio desafio;

    // OUTROS CAMPOS 
    @Enumerated(EnumType.STRING)
    private StatusDesafio status;
    
    private Integer progresso; 
    
    private LocalDate dataInicio;
    private LocalDate dataFim;

    // Construtores
    public UsuarioDesafio() {}

    public UsuarioDesafio(Usuario usuario, Desafio desafio, StatusDesafio status) {
        this.usuario = usuario;
        this.desafio = desafio;
        this.status = status;
        this.progresso = 0;
        this.dataInicio = LocalDate.now(); // Define data atual automaticamente
    }

    // getters e setters
    public Long getId() { return id; }
    //não tem setId porque é auto gerado

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
