package com.renovabio.renovabioapi.repository;

import com.renovabio.renovabioapi.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> { //fazendo extends JpaRepository<Usuario, Long>
// digo pro spring --> crie todos os métodos de salvar, deletar, buscar por ID e listar todos para a classe Usuario, na qual o ID é do tipo Long
    
    // esse método é a chave pro login funcionar, ele vai buscar o usuário no banco de dados pelo email, 
    // e o Spring Boot vai criar a query automaticamente.
    Optional<Usuario> findByEmail(String email);
}