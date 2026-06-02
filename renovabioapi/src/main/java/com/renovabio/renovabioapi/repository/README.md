# Repositories

Esta pasta contem interfaces Spring Data JPA usadas para consultar e persistir entidades no MySQL.

## Responsabilidade

- Fornecer operacoes CRUD padrao.
- Declarar consultas por nome de metodo, como buscas por email, usuario, desafio ou status.
- Isolar o acesso ao banco para que controllers e services nao dependam de SQL manual.

## Como usar

Services chamam repositories para buscar e salvar dados. Acesso direto por controllers fica restrito a casos simples e pontuais.
