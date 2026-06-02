# RenovaBio

Projeto de TGSI para incentivo, registro e acompanhamento de acoes sustentaveis relacionadas ao descarte e reaproveitamento de residuos organicos.

## Estrutura do projeto

- `renovabioapi`: API Spring Boot responsavel pelas regras de negocio, persistencia em MySQL, autenticacao por token e endpoints usados pelo app e pelo painel web.
- `renovabioapp`: aplicativo mobile feito com Expo/React Native, com telas para usuarios realizarem cadastro, login, desafios, receitas, recompensas, perfil e feedback.
- `renovabiosite`: painel web feito com React/Vite para uso administrativo, com login, metricas, parceiros, recompensas, feedbacks e configuracoes.
- Arquivos `.sql`, `.mwb` e imagens de modelagem: materiais de banco de dados e documentacao visual do projeto.

## Banco de dados

O projeto usa MySQL com o banco `bdrenovabio`. O arquivo `bdrenovabio.sql` contem a estrutura e dados usados na modelagem atual.

## Servicos externos

- Cloudinary: armazena fotos de perfil e comprovacoes dos desafios.

No ambiente publicado, as variaveis `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY` e `CLOUDINARY_API_SECRET` ficam configuradas no servico da API.

## Tipos de usuario

O sistema separa dois tipos de usuario:

- `CIDADAO`: usuario do aplicativo mobile. Realiza receitas, desafios, resgata recompensas, envia feedbacks e aparece nas estatisticas do painel.
- `PREFEITURA`: usuario do painel web. Acessa o site administrativo, gerencia parceiros/recompensas e acompanha estatisticas da propria cidade.

O app cadastra usuarios como `CIDADAO`. O site da prefeitura cadastra usuarios como `PREFEITURA`.

## Regra por cidade

As informacoes administrativas sempre respeitam a cidade da prefeitura logada:

- Prefeitura de Caibate ve e gerencia apenas dados de Caibate.
- Prefeitura de Mato Queimado ve e gerencia apenas dados de Mato Queimado.
- Parceiros e recompensas criados no painel sao associados automaticamente a cidade da prefeitura logada.
- Usuarios do tipo `PREFEITURA` nao entram nos rankings e metricas de cidadaos.

## Execucao local

Sequencia para rodar o projeto na maquina local.

1. Inicializacao do MySQL com o banco `bdrenovabio` disponivel. Para recriar a base, importacao do arquivo `bdrenovabio.sql`.

2. Execucao da API em `renovabioapi`:

```bash
cd renovabioapi
mvnw.cmd spring-boot:run
```

3. Execucao do app mobile em `renovabioapp`:

```bash
cd renovabioapp
npm install
npm start
```

Tambem é possível abrir direto por plataforma:

```bash
npm run android
npm run ios
npm run web
```

Observacao importante sobre APK:

- Sempre que houver mudanca apenas em telas, textos ou regras que nao adicionem modulo nativo novo, nao e necessario reinstalar o APK durante o desenvolvimento com Expo.
- Quando entrar uma dependencia nativa, permissao ou plugin novo no app, e necessario gerar e instalar uma nova build/APK para essa funcionalidade existir no aplicativo instalado.
- Revisao de textos antes da build final evita erros de escrita no APK distribuido.

4. Execucao do painel web em `renovabiosite`:

```bash
cd renovabiosite
npm install
npm run dev
```

Com a configuracao atual, a API local roda em `http://localhost:8080`. O painel web usa por padrao a API publicada no Railway; para apontar para a API local, a variavel `VITE_API_URL=http://localhost:8080` pode ser configurada.

Cada pasta principal possui seu proprio `README.md` com instrucoes e descricao dos arquivos internos.

## Publicacao da API no Railway

O Railway fica conectado ao repositorio GitHub e usa a branch `main`.

1. Salvamento e envio das alteracoes:

```bash
git add .
git commit -m "Mensagem do commit"
git push origin main
```

2. Conferencia do novo deploy da API no Railway. Se o deploy automatico nao iniciar, uso da opcao `Redeploy` no servico da API.

3. Variaveis de ambiente necessarias no servico da API:

```text
CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET
```

4. Publicacao do site apos a finalizacao do deploy da API, porque o site pode chamar endpoints novos.

## Publicacao do site no GitHub Pages

O site publicado fica no branch `gh-pages`. O codigo fonte fica no branch `main`.

1. Geracao do build do site:

```bash
cd renovabiosite
npm run build
cd ..
```

2. Adicao do build ao Git. A opcao `-f` e necessaria porque `dist` normalmente fica ignorado:

```bash
git add -f renovabiosite/dist
git commit -m "Build do site para GitHub Pages"
```

3. Publicacao do conteudo de `renovabiosite/dist` no branch `gh-pages`:

```bash
git subtree split --prefix renovabiosite/dist -b gh-pages-deploy
git push -f origin gh-pages-deploy:gh-pages
git branch -D gh-pages-deploy
```

4. URL publicada:

```text
https://brunadewes.github.io/renovabio/
```
