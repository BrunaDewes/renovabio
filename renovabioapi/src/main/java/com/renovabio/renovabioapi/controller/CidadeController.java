package com.renovabio.renovabioapi.controller;

import com.renovabio.renovabioapi.model.Cidade;
import com.renovabio.renovabioapi.repository.CidadeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/cidades")
public class CidadeController {

    @Autowired
    private CidadeRepository cidadeRepository;

    @GetMapping
    public List<Cidade> listarCidades() {
        return cidadeRepository.findAll(Sort.by(Sort.Direction.ASC, "nome"));
    }
}
