# RenovaBio Site

Painel web administrativo do RenovaBio, desenvolvido com React e Vite.

## Responsabilidades

- Exibir tela de login da prefeitura.
- Consumir a API local em `http://localhost:8080`.
- Mostrar metricas de usuarios, pontuacao, parceiros, recompensas, feedbacks e acoes sustentaveis.
- Permitir navegacao entre Inicio, Parceiros, Feedbacks e Configuracoes.
- Usar dados de fallback quando a API estiver indisponivel.

## Pastas principais

- `src`: codigo React do painel.
- `public`: imagens estaticas servidas pelo Vite.
- `dist`: build gerado pelo Vite, nao deve ser editado manualmente.
- `node_modules`: dependencias instaladas, nao deve ser editado manualmente.

## Arquivos principais

- `index.html`: HTML base da aplicacao.
- `styles.css`: estilos globais do painel.
- `vite.config.js`: configuracao do Vite.
- `package.json`: scripts e dependencias.

## Comandos uteis

```bash
npm install
npm run dev
npm run build
npm run preview
```
