# RenovaBio

Projeto de TGSI para incentivo, registro e acompanhamento de acoes sustentaveis relacionadas ao descarte e reaproveitamento de residuos organicos.

## Estrutura do projeto

- `renovabioapi`: API Spring Boot responsavel pelas regras de negocio, persistencia em MySQL, autenticacao por token e endpoints usados pelo app e pelo painel web.
- `renovabioapp`: aplicativo mobile feito com Expo/React Native, com telas para usuarios realizarem cadastro, login, desafios, receitas, recompensas, perfil e feedback.
- `renovabiosite`: painel web feito com React/Vite para uso administrativo, com login, metricas, parceiros, recompensas, feedbacks e configuracoes.
- `uploads`: pasta usada para armazenar arquivos enviados, como imagens de perfil ou comprovacoes.
- Arquivos `.sql`, `.mwb` e imagens de modelagem: materiais de banco de dados e documentacao visual do projeto.

## Banco de dados

O projeto usa MySQL com o banco `bdrenovabio`. O arquivo `bdrenovabio.sql` contem a estrutura e dados usados na modelagem atual.

## Como executar localmente

Estes passos sao para rodar o projeto na maquina local.

1. Inicie o MySQL e garanta que o banco `bdrenovabio` esteja disponivel. Se precisar recriar a base, importe o arquivo `bdrenovabio.sql`.

2. Execute a API em `renovabioapi`:

```bash
cd renovabioapi
mvnw.cmd spring-boot:run
```

3. Execute o app mobile em `renovabioapp`:

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
- Quando entrar uma dependencia nativa nova no app, como aconteceu com `expo-notifications`, e necessario gerar e instalar uma nova build/APK para essa funcionalidade existir no aplicativo instalado.
- Antes da build final, vale revisar os textos e corrigir erros de escrita para nao carregar isso para o APK distribuido.

4. Execute o painel web em `renovabiosite`:

```bash
cd renovabiosite
npm install
npm run dev
```

Com a configuracao atual, a API local roda em `http://localhost:8080` e o painel web usa essa URL para buscar os dados.

Cada pasta principal possui seu proprio `README.md` com instrucoes e descricao dos arquivos internos.
