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

    // Construtores 
    public Categoria() {}

    public Categoria(String nome) {
        this.nome = nome;
    }

    // Getters e Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
}
