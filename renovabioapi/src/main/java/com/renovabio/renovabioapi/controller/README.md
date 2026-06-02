# Controllers REST

Esta pasta contem os controllers que recebem requisicoes HTTP e chamam os services ou repositories necessarios.

## Controllers

- `UsuarioController.java`: cadastro, login, listagem, busca por ID, troca de senha autenticada, alteracao do proprio email, recuperacao simplificada, foto de perfil e acoes do usuario.
- `CidadeController.java`: consulta e cadastro de cidades usadas no perfil do usuario.
- `DesafioController.java`: listagem, detalhe, participacao e comprovacao de desafios.
- `ReceitaController.java`: listagem e detalhe de receitas sustentaveis.
- `ParceiroController.java`: listagem, cadastro, edicao, ativacao/desativacao e exclusao de parceiros da cidade da prefeitura.
- `RecompensaController.java`: listagem, cadastro, edicao, ativacao/desativacao, exclusao, historico de trocas e troca de recompensas.
- `FeedbackController.java`: envio e consulta de feedbacks.

## Regras importantes

- Rotas administrativas usam token no header `Authorization: Bearer <token>`.
- Prefeitura so pode consultar e gerenciar dados da propria cidade.
- O cadastro de parceiro no painel usa automaticamente a cidade da prefeitura logada.
- Recuperacao de senha publica usa email e nova senha, sem envio de codigo por email.

## Padrao usado

Controllers mantem pouca regra de negocio. Validacoes, calculos, atualizacoes de pontuacao e acesso mais complexo ao banco ficam nos services.
