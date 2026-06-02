# DTOs

Esta pasta guarda os objetos usados para transportar dados entre cliente e API sem expor diretamente todas as entidades do banco.

## Grupos principais

- Login, email e senha: `LoginRequestDTO`, `AtualizarSenhaRequestDTO`, `AtualizarEmailRequestDTO` e `RecuperarSenhaRequestDTO`.
- Usuario: `UsuarioRequestDTO` e `UsuarioResponseDTO`.
- Parceiros e recompensas: `ParceiroRequestDTO`, `RecompensaRequestDTO` e `HistoricoTrocaRecompensaDTO`.
- Desafios: `ComprovacaoDesafioDTO`.

## Campos importantes

`UsuarioResponseDTO` retorna `tipo`, `ativo` e `dataCadastro`, campos usados pelo painel da prefeitura para validar acesso e montar estatisticas.

`UsuarioRequestDTO` pode receber `tipo`. Quando o tipo nao e informado, a API assume `CIDADAO`; o site da prefeitura envia `PREFEITURA`.

## Boas praticas

DTOs sao usadas para controlar quais campos entram e saem da API.
