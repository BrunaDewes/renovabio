# Controllers REST

Esta pasta contem os controllers que recebem requisicoes HTTP e chamam os services ou repositories necessarios.

## Controllers

- `UsuarioController.java`: cadastro, login, listagem, busca por ID, troca de senha autenticada, recuperacao simplificada, foto de perfil e acoes do usuario.
- `CidadeController.java`: consulta e cadastro de cidades usadas no perfil do usuario.
- `DesafioController.java`: listagem, detalhe, participacao e comprovacao de desafios.
- `ReceitaController.java`: listagem e detalhe de receitas sustentaveis.
- `RecompensaController.java`: listagem, detalhe e troca de recompensas.
- `FeedbackController.java`: envio e consulta de feedbacks.

## Padrao usado

Os controllers devem manter pouca regra de negocio. Validacoes, calculos, atualizacoes de pontuacao e acesso mais complexo ao banco devem ficar nos services.
