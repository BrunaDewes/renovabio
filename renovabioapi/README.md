# RenovaBio API

API REST do sistema RenovaBio, desenvolvida com Spring Boot, Java 21, Spring MVC, Spring Security, Spring Data JPA e MySQL.

## Responsabilidades

- Expor endpoints para usuarios, cidades, desafios, receitas, recompensas e feedbacks.
- Persistir dados do dominio no banco MySQL `bdrenovabio`.
- Gerar e validar token simples para autenticacao do app.
- Receber imagens de perfil e comprovacoes, armazenando os arquivos no Cloudinary.
- Permitir recuperacao simplificada de senha pelo app e pelo painel web.
- Marcar usuarios como inativos apos 2 meses sem acoes registradas e reativar automaticamente quando voltam a usar o app.
- Separar dados administrativos por cidade da prefeitura logada.
- Centralizar regras de negocio usadas pelo aplicativo mobile e pelo painel web.

## Pastas principais

- `src/main/java/com/renovabio/renovabioapi/config`: configuracoes de seguranca, CORS e filtros de autenticacao.
- `src/main/java/com/renovabio/renovabioapi/controller`: controllers REST e mapeamento das rotas HTTP.
- `src/main/java/com/renovabio/renovabioapi/dto`: objetos de entrada e saida usados nas requisicoes.
- `src/main/java/com/renovabio/renovabioapi/model`: entidades JPA e enums do dominio.
- `src/main/java/com/renovabio/renovabioapi/repository`: interfaces Spring Data JPA para acesso ao banco.
- `src/main/java/com/renovabio/renovabioapi/service`: regras de negocio, validacoes, tokens e armazenamento de arquivos.
- `src/main/resources`: configuracoes da aplicacao.
- `src/test`: testes automatizados.

## Configuracao

As principais configuracoes ficam em `src/main/resources/application.properties`:

- URL do banco: `jdbc:mysql://localhost:3306/bdrenovabio`
- Porta da API: `8080`
- Estrategia JPA: `spring.jpa.hibernate.ddl-auto=update`
- Limite de upload: `8MB`
- Segredo e expiracao do token da aplicacao.

## Variaveis de ambiente

Em producao, configure estas variaveis no servico da API:

```text
CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET
```

O site publicado usa a API do Railway. Depois de alterar endpoints usados pelo painel, publique a API antes de publicar o GitHub Pages.

## Autenticacao e tipos de usuario

A API usa token simples enviado no header:

```text
Authorization: Bearer <token>
```

Tipos de usuario:

- `CIDADAO`: usuario do app mobile.
- `PREFEITURA`: usuario do painel web.

O login retorna `tipo`, `token`, `ativo`, `dataCadastro` e demais dados do usuario. O painel web so permite acesso a usuarios `PREFEITURA`.

## Escopo por cidade

Quando uma prefeitura esta autenticada, as consultas e operacoes administrativas ficam restritas a cidade vinculada a essa prefeitura.

Exemplos:

- `GET /usuarios` retorna usuarios da cidade da prefeitura logada.
- `GET /parceiros` retorna parceiros da cidade da prefeitura logada.
- `GET /recompensas` retorna recompensas de parceiros da cidade da prefeitura logada.
- `GET /feedbacks` retorna feedbacks de usuarios da cidade da prefeitura logada.
- Criar parceiro usa automaticamente a cidade da prefeitura logada.
- Editar, ativar/desativar ou excluir parceiro/recompensa valida se o registro pertence a cidade da prefeitura.

## Recuperacao de senha

O fluxo de recuperacao de senha esta simplificado para o escopo do TCC: o usuario informa email e nova senha. Como melhoria futura, recomenda-se usar codigo temporario enviado por email, com expiracao e validacao no servidor.

Rotas publicas:

```text
PATCH /usuarios/recuperar-senha
```

## Endpoints usados pelo painel web

Autenticacao e prefeitura:

```text
POST /usuarios/login
POST /usuarios
PATCH /usuarios/recuperar-senha
PATCH /usuarios/me/email
PATCH /usuarios/me/senha
```

Estatisticas e dados:

```text
GET /usuarios
GET /usuarios/{id}/acoes
GET /desafios
GET /feedbacks
GET /parceiros
GET /recompensas
GET /recompensas/trocas
```

Parceiros:

```text
POST /parceiros
PUT /parceiros/{id}
PATCH /parceiros/{id}/ativo?ativo=true|false
DELETE /parceiros/{id}
```

Recompensas:

```text
POST /recompensas
PUT /recompensas/{id}
PATCH /recompensas/{id}/ativo?ativo=true|false
DELETE /recompensas/{id}
```

## Imagens

Novas fotos de perfil e comprovacoes sao enviadas ao Cloudinary e a URL HTTPS retornada e salva no banco. A rota `/uploads/**` permanece apenas para compatibilidade com arquivos antigos locais.

## Atividade de usuarios

O campo `ativo` do usuario e atualizado pela API com base na ultima acao registrada em `AcaoUsuario`. Usuarios sem acoes ha mais de 2 meses sao marcados como inativos nas consultas e em uma verificacao diaria as 03:00 no fuso `America/Sao_Paulo`. Se ainda nao houver acoes, a API usa `dataCadastro` como referencia. Ao fazer login ou executar acoes como desafio, receita, recompensa, feedback, troca de senha, email ou foto, a API marca o usuario como ativo novamente.

## Comandos uteis

```bash
./mvnw spring-boot:run
./mvnw test
./mvnw clean package
```

No Windows, tambem pode ser usado:

```bash
mvnw.cmd spring-boot:run
mvnw.cmd test
```

## Deploy no Railway

1. Envie as alteracoes para o GitHub:

```bash
git add .
git commit -m "Mensagem do commit"
git push origin main
```

2. No Railway, confira se o servico da API iniciou um novo deploy da branch `main`.

3. Se nao iniciou, use `Redeploy` no servico da API.

4. Aguarde o deploy finalizar antes de publicar o site no GitHub Pages.
