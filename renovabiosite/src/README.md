# Codigo React do painel

Esta pasta contem o codigo-fonte principal do painel web.

## Arquivos

- `main.jsx`: ponto de entrada React. Renderiza a aplicacao no elemento `root` do `index.html`.
- `App.jsx`: componente principal, telas de autenticacao, shell administrativo, chamadas para API, dados de fallback, metricas, graficos, parceiros, feedbacks e configuracoes.

## API

O painel usa a API publicada no Railway como URL base. Para usar outro ambiente, configure `VITE_API_URL` ou altere a constante `API_URL` em `App.jsx`.

## Padrao

Se o painel crescer, separe componentes grandes de `App.jsx` em arquivos proprios dentro desta pasta.
