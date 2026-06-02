# Telas e rotas do app

Esta pasta usa Expo Router. Cada arquivo `.tsx` representa uma rota ou tela do aplicativo.

## Telas principais

- `_layout.tsx`: configuracao global de navegacao.
- `index.tsx`: rota inicial.
- `login.tsx`, `cadastro.tsx`, `recuperar.tsx`: autenticacao e recuperacao simplificada de conta.
- `home.tsx`: tela inicial apos login.
- `perfil.tsx`: dados do usuario, foto e informacoes de conta.
- `desafios.tsx`, `desafio-detalhe.tsx`, `historico-desafios.tsx`: fluxo de desafios sustentaveis, comprovacao por camera, visualizacao e exclusao do comprovante de hoje.
- `receitas.tsx`, `receita-detalhe.tsx`: listagem e detalhe de receitas.
- `recompensas.tsx`, `historico-recompensas.tsx`: recompensas disponiveis e trocas realizadas.
- `compostagem.tsx`, `descarte.tsx`: telas educativas.
- `feedback.tsx`: envio de feedback para o sistema.

## Padrao

As telas podem consumir `context`, `utils` e `components`. Regras compartilhadas ficam fora desta pasta para evitar duplicacao.
