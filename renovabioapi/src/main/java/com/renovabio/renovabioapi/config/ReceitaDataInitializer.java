package com.renovabio.renovabioapi.config;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;
import org.springframework.util.StreamUtils;

@Component
public class ReceitaDataInitializer implements ApplicationRunner {

    private final JdbcTemplate jdbcTemplate;

    public ReceitaDataInitializer(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public void run(ApplicationArguments args) throws IOException {
        garantirCategorias();
        atualizarReceitas();
    }

    private void garantirCategorias() {
        jdbcTemplate.execute("""
                INSERT INTO categoria (id_categoria, nome_categoria) VALUES
                (1, 'Doces'),
                (6, 'Salgados'),
                (7, 'Bebidas')
                ON DUPLICATE KEY UPDATE
                nome_categoria = VALUES(nome_categoria)
                """);
    }

    private void atualizarReceitas() throws IOException {
        var resource = new ClassPathResource("data.sql");
        var script = StreamUtils.copyToString(resource.getInputStream(), StandardCharsets.UTF_8);

        var inicio = script.indexOf("INSERT INTO receita");
        var fim = script.indexOf("INSERT INTO desafio", inicio);

        if (inicio < 0 || fim < 0) {
            throw new IllegalStateException("Bloco de receitas nao encontrado em data.sql.");
        }

        var insertReceitas = script.substring(inicio, fim).trim();
        var upsertReceitas = insertReceitas.replaceFirst(";\\s*$", """
                ON DUPLICATE KEY UPDATE
                titulo_receita = VALUES(titulo_receita),
                descricao = VALUES(descricao),
                ingredientes = VALUES(ingredientes),
                modo_preparo = VALUES(modo_preparo),
                tempo_preparo = VALUES(tempo_preparo),
                dificuldade = VALUES(dificuldade),
                pontos = VALUES(pontos),
                categoria_id_categoria = VALUES(categoria_id_categoria)
                """);

        jdbcTemplate.execute(upsertReceitas);
    }
}
