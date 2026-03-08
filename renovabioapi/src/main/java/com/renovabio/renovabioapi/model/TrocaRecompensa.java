package com.renovabio.renovabioapi.model;

import java.io.Serializable;
import java.time.LocalDateTime;
import jakarta.persistence.*;

@Entity
@Table(name = "TrocaRecompensa")
public class TrocaRecompensa implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idTrocaRecompensa")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "Usuario_idUsuario")
    private Usuario usuario;

    @ManyToOne
    @JoinColumn(name = "Recompensa_idRecompensas")
    private Recompensa recompensa;

    private LocalDateTime dataTroca = LocalDateTime.now();

    @Enumerated(EnumType.STRING)
    private StatusTroca status;

    @Column(length = 45)
    private String codigoVoucher; // O código que o usuário vai mostrar no mercado parceiro

    // --- Construtores ---
    public TrocaRecompensa() {}

    public TrocaRecompensa(Usuario usuario, Recompensa recompensa, StatusTroca status, String codigoVoucher) {
        this.usuario = usuario;
        this.recompensa = recompensa;
        this.status = status;
        this.codigoVoucher = codigoVoucher;
    }

    // --- Getters e Setters ---
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Usuario getUsuario() { return usuario; }
    public void setUsuario(Usuario usuario) { this.usuario = usuario; }

    public Recompensa getRecompensa() { return recompensa; }
    public void setRecompensa(Recompensa recompensa) { this.recompensa = recompensa; }

    public LocalDateTime getDataTroca() { return dataTroca; }
    public void setDataTroca(LocalDateTime dataTroca) { this.dataTroca = dataTroca; }

    public StatusTroca getStatus() { return status; }
    public void setStatus(StatusTroca status) { this.status = status; }

    public String getCodigoVoucher() { return codigoVoucher; }
    public void setCodigoVoucher(String codigoVoucher) { this.codigoVoucher = codigoVoucher; }
}