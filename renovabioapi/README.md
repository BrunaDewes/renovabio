# RenovaBio API

API REST do sistema RenovaBio, desenvolvida com Spring Boot, Java 21, Spring MVC, Spring Security, Spring Data JPA e MySQL.

## Responsabilidades

- Expor endpoints para usuarios, cidades, desafios, receitas, recompensas e feedbacks.
- Persistir dados do dominio no banco MySQL `bdrenovabio`.
- Gerar e validar token simples para autenticacao do app.
- Receber imagens de perfil e comprovacoes, armazenando os arquivos no Cloudinary.
- Permitir recuperacao simplificada de senha pelo app.
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

## Recuperacao de senha

O fluxo de recuperacao de senha esta simplificado para o escopo do TCC: o usuario informa email e nova senha. Como melhoria futura, recomenda-se usar codigo temporario enviado por email, com expiracao e validacao no servidor.

Rotas publicas:

```text
PATCH /usuarios/recuperar-senha
```

## Imagens

Novas fotos de perfil e comprovacoes sao enviadas ao Cloudinary e a URL HTTPS retornada e salva no banco. A rota `/uploads/**` permanece apenas para compatibilidade com arquivos antigos locais.

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
