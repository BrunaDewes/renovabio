# Configuracao da API

Esta pasta concentra classes de infraestrutura da aplicacao.

## Arquivos

- `SecurityConfig.java`: configura Spring Security, regras de acesso, encoder de senhas e filtro de token.
- `TokenAuthenticationFilter.java`: le o token enviado nas requisicoes e prepara a autenticacao usada pela API.
- `WebConfig.java`: configura recursos web, como CORS e exposicao de arquivos estaticos.
- `ReceitaDataInitializer.java`: atualiza ou insere as receitas do `data.sql` quando a API inicia, garantindo que bancos ja existentes recebam os ingredientes e modos de preparo mais recentes.

## Quando alterar

Esta pasta deve ser alterada quando precisar mudar autorizacao de endpoints, politica de CORS, formato de autenticacao, criptografia de senha, forma de servir arquivos enviados ou a estrategia de inicializacao/atualizacao dos dados de receitas.
