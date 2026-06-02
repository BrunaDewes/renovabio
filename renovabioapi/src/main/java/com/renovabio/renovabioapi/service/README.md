# Services

Esta pasta concentra as regras de negocio da API.

## Services principais

- `UsuarioService.java`: cadastro, login, senha, email, recuperacao simplificada, perfil, foto e conversao para DTO.
- `UsuarioAtividadeService.java`: inativacao apos 2 meses sem acoes registradas e reativacao quando o usuario volta a interagir.
- `UsuarioAutenticadoService.java`: identifica o usuario pelo token e valida a cidade da prefeitura autenticada.
- `TokenService.java`: geracao e validacao do token usado pelo app e painel.
- `FileStorageService.java`: validacao, envio de imagens para Cloudinary e exclusao remota quando aplicavel.
- `DesafioService.java`: fluxo de desafios, participacao, comprovacao e historico.
- `ReceitaService.java`: consultas e regras ligadas a receitas.
- `TrocaRecompensaService.java`: troca de pontos por recompensas, historico do usuario e historico por cidade para o painel da prefeitura.
- `FeedbackService.java`: registro e consulta de feedbacks.

## Regras usadas pelo painel

- `UsuarioAutenticadoService` identifica a prefeitura pelo token e fornece a cidade vinculada a ela.
- Services e controllers administrativos validam a cidade da prefeitura antes de alterar parceiros, recompensas ou consultar dados sensiveis.
- Atividades relevantes reativam o usuario; a inativacao considera a ultima acao registrada em `AcaoUsuario` ou `dataCadastro`.

## Organizacao

Na pasta `service`, ficam as regras principais do sistema, como validacoes, calculos e decisoes de negocio. Controllers recebem as requisicoes da API e chamam o service responsavel.
