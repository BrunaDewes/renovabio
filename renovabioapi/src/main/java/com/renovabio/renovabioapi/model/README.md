# Modelos de dominio

Esta pasta contem as entidades JPA e enums que representam as tabelas e conceitos principais do RenovaBio.

## Entidades

- Usuarios, cidades e perfil: `Usuario`, `Cidade`. `Usuario` tambem guarda o status `ativo`.
- Desafios: `Desafio`, `UsuarioDesafio`, `ComprovacaoDesafio`.
- Conteudos: `Categoria` classifica registros de `Receita` e `Desafio` sem um campo de tipo adicional.
- Receitas: `Receita`.
- Recompensas e parceiros: `Recompensa`, `Parceiro`, `TrocaRecompensa`.
- Historico e interacoes: `AcaoUsuario`, `Feedback`.

## Enums

- `TipoUsuario`
- `TipoAcao`
- `StatusDesafio`
- `StatusTroca`
- `DificuldadeReceita`

## Observacao

Mudanças nesta pasta normalmente impactam o banco de dados, repositories, services e DTOs. Antes de alterar nomes de campos ou chaves, deve-se revisar os relacionamentos JPA.
