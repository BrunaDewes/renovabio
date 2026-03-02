package com.renovabio.renovabioapi.model;

import java.io.Serializable;
import jakarta.persistence.*;

@Entity
@Table(name = "Receita") //nome no BD
public class Receita implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idReceita") // nome exato da Chave Primária
    private Long id;

    @Column(name = "tituloReceita", length = 45, nullable = false)
    private String titulo;

    @Column(length = 500)
    private String descricao;

    // MEDIUMTEXT -> para os ingredientes
    @Column(columnDefinition = "MEDIUMTEXT", nullable = false) 
    private String ingredientes;

    // LONGTEXT -> para o modo de preparo
    @Column(columnDefinition = "LONGTEXT", nullable = false) 
    private String modoPreparo;

    private Integer tempoPreparo; // em minutos

    @Enumerated(EnumType.STRING)
    private DificuldadeReceita dificuldade; 

    private Integer pontos; //pontos que a receita vale

    // Relacionamento com Categoria
    @ManyToOne
    @JoinColumn(name = "Categoria_idCategoria") 
    private Categoria categoria;

    // Construtores
    public Receita() {
        // Construtor vazio obrigatório para o JPA
    }

    public Receita(String titulo, String descricao, String ingredientes, String modoPreparo, Integer tempoPreparo, DificuldadeReceita dificuldade, Integer pontos, Categoria categoria) {
        this.titulo = titulo;
        this.descricao = descricao;
        this.ingredientes = ingredientes;
        this.modoPreparo = modoPreparo;
        this.tempoPreparo = tempoPreparo;
        this.dificuldade = dificuldade;
        this.pontos = pontos;
        this.categoria = categoria;
    }

    // Getters e Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitulo() { return titulo; }
    public void setTitulo(String titulo) { this.titulo = titulo; }

    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }

    public String getIngredientes() { return ingredientes; }
    public void setIngredientes(String ingredientes) { this.ingredientes = ingredientes; }

    public String getModoPreparo() { return modoPreparo; }
    public void setModoPreparo(String modoPreparo) { this.modoPreparo = modoPreparo; }

    public Integer getTempoPreparo() { return tempoPreparo; }
    public void setTempoPreparo(Integer tempoPreparo) { this.tempoPreparo = tempoPreparo; }

    public DificuldadeReceita getDificuldade() { return dificuldade; }
    public void setDificuldade(DificuldadeReceita dificuldade) { this.dificuldade = dificuldade; }

    public Integer getPontos() { return pontos; }
    public void setPontos(Integer pontos) { this.pontos = pontos; }

    public Categoria getCategoria() { return categoria; }
    public void setCategoria(Categoria categoria) { this.categoria = categoria; }
}