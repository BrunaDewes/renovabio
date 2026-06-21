# Configuracao da API

Esta pasta concentra classes de infraestrutura da aplicacao.

## Arquivos

- `SecurityConfig.java`: configura Spring Security, regras de acesso, encoder de senhas e filtro de token.
- `TokenAuthenticationFilter.java`: le o token enviado nas requisicoes e prepara a autenticacao usada pela API.
- `WebConfig.java`: configura recursos web, como CORS e exposicao de arquivos estaticos.
- `ReceitaDataInitializer.java`: garante as categorias de receitas e atualiza ou insere as receitas do `data.sql` quando a API inicia.

## Casos de alteracao

Esta pasta concentra alteracoes de autorizacao de endpoints, politica de CORS, formato de autenticacao, criptografia de senha, forma de servir arquivos enviados e estrategia de inicializacao/atualizacao dos dados de receitas.
