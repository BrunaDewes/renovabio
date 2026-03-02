package com.renovabio.renovabioapi.model;

import java.io.Serializable;
import jakarta.persistence.*;

@Entity
@Table(name = "Categoria") //nome igual ao BD
public class Categoria implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idCategoria")
    private Long id;

    @Column(name = "nomeCategoria", length = 45, nullable = false)  
    private String nome;
    
    @Enumerated(EnumType.STRING)
    private TipoCategoria tipo; 

    // Construtores 
    public Categoria() {}

    public Categoria(String nome, TipoCategoria tipo) {
        this.nome = nome;
        this.tipo = tipo;
    }

    // Getters e Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public TipoCategoria getTipo() { return tipo; }
    public void setTipo(TipoCategoria tipo) { this.tipo = tipo; }
}
