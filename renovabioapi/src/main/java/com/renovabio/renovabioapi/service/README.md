# Services

Esta pasta concentra as regras de negocio da API.

## Services principais

- `UsuarioService.java`: cadastro, login, senha, perfil, foto e conversao para DTO.
- `TokenService.java`: geracao e validacao do token usado pelo app e painel.
- `FileStorageService.java`: validacao e gravacao de imagens enviadas por upload.
- `DesafioService.java`: fluxo de desafios, participacao, comprovacao e historico.
- `ReceitaService.java`: consultas e regras ligadas a receitas.
- `TrocaRecompensaService.java`: troca de pontos por recompensas e historico.
- `FeedbackService.java`: registro e consulta de feedbacks.

## Organização

Na pasta `service`, ficam as regras principais do sistema, como validações, cálculos e decisões de negócio. Os `controllers` não devem ter muita lógica; eles apenas recebem as requisições da API e chamam o service responsável.

