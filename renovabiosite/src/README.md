# Codigo React do painel

Esta pasta contem o codigo-fonte principal do painel web.

## Arquivos

- `main.jsx`: ponto de entrada React. Renderiza a aplicacao no elemento `root` do `index.html`.
- `App.jsx`: componente principal, telas de autenticacao, shell administrativo, chamadas para API, dados de fallback, metricas, graficos, parceiros, feedbacks e configuracoes.

## API

O painel usa a API publicada no Railway como URL base. Para usar outro ambiente, deve configurar `VITE_API_URL` ou alterar a constante `API_URL` em `App.jsx`.

Chamadas importantes feitas por `App.jsx`:

- `POST /usuarios/login`
- `POST /usuarios`
- `PATCH /usuarios/recuperar-senha`
- `PATCH /usuarios/me/email`
- `PATCH /usuarios/me/senha`
- `GET /usuarios`
- `GET /usuarios/{id}/acoes`
- `GET /parceiros`
- `POST /parceiros`
- `PUT /parceiros/{id}`
- `PATCH /parceiros/{id}/ativo`
- `DELETE /parceiros/{id}`
- `GET /recompensas`
- `GET /recompensas/trocas`
- `POST /recompensas`
- `PUT /recompensas/{id}`
- `PATCH /recompensas/{id}/ativo`
- `DELETE /recompensas/{id}`
- `GET /feedbacks`
- `GET /desafios`

## Padrao

Se o painel crescer, deve se separar componentes grandes de `App.jsx` em arquivos proprios dentro desta pasta.
