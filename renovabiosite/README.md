# RenovaBio Site

Painel web administrativo do RenovaBio, desenvolvido com React e Vite.

## Responsabilidades

- Exibir tela de login da prefeitura.
- Consumir a API publicada no Railway.
- Mostrar metricas de usuarios, pontuacao, parceiros, recompensas, feedbacks e acoes sustentaveis.
- Permitir navegacao entre Inicio, Parceiros e recompensas, Feedbacks e Configuracoes.
- Gerenciar parceiros e recompensas da cidade da prefeitura logada.
- Alterar email e senha da prefeitura autenticada.
- Recuperar senha antes do login usando email e nova senha.

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

## API

A URL base da API fica em `src/App.jsx`:

```text
https://renovabio-production.up.railway.app
```

Para usar outra API sem editar o codigo, configure a variavel:

```text
VITE_API_URL
```

Exemplo:

```bash
VITE_API_URL=http://localhost:8080 npm run dev
```

## Login e permissao

O painel e exclusivo para usuarios do tipo `PREFEITURA`. Usuarios `CIDADAO` devem usar o aplicativo mobile.

Todas as telas administrativas usam o token retornado por `POST /usuarios/login`. A prefeitura so ve e gerencia dados da propria cidade.

## Funcionalidades do painel

Inicio:

- Usuarios cadastrados e ativos da cidade.
- Parceiros e recompensas ativos.
- Novos usuarios no mes.
- Acoes sustentaveis no mes.
- Total de acoes sustentaveis.
- Pontuacao total gerada.
- Grafico de acoes por tipo.
- Ranking dos 5 usuarios com maior pontuacao.
- Desafios mais realizados.
- Recompensas mais resgatadas.

Parceiros e recompensas:

- Criar, editar, ativar/desativar e excluir parceiros.
- Criar, editar, ativar/desativar e excluir recompensas.
- A cidade do parceiro e definida automaticamente pela prefeitura logada.
- A busca funciona para parceiros e recompensas.

Feedbacks:

- Lista feedbacks reais enviados pelos cidadaos da cidade da prefeitura.

Configuracoes:

- Atualiza email da prefeitura.
- Altera senha da prefeitura logada.

## Publicacao no GitHub Pages

O Vite esta configurado com `base: "/renovabio/"` em `vite.config.js`, necessario para o GitHub Pages deste repositorio.

1. Gere o build:

```bash
cd renovabiosite
npm run build
cd ..
```

2. Adicione o build ao Git:

```bash
git add -f renovabiosite/dist
git commit -m "Build do site para GitHub Pages"
```

3. Publique a pasta `dist` no branch `gh-pages`:

```bash
git subtree split --prefix renovabiosite/dist -b gh-pages-deploy
git push -f origin gh-pages-deploy:gh-pages
git branch -D gh-pages-deploy
```

4. Acesse:

```text
https://brunadewes.github.io/renovabio/
```

Antes de publicar o site, confirme que a API no Railway ja foi atualizada. Isso evita erros quando o site chama endpoints novos.
