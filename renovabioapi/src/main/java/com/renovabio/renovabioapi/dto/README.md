# DTOs

Esta pasta guarda os objetos usados para transportar dados entre cliente e API sem expor diretamente todas as entidades do banco.

## Grupos principais

- Login e senha: `LoginRequestDTO`, `AtualizarSenhaRequestDTO` e `RecuperarSenhaRequestDTO`.
- Usuario: `UsuarioRequestDTO` e `UsuarioResponseDTO`.
- Desafios e recompensas: `ComprovacaoDesafioDTO` e `HistoricoTrocaRecompensaDTO`.

## Boas praticas

DTOs são usadas para controlar quais campos entram e saem da API. 
