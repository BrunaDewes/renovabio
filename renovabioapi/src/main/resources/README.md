# Resources da API

Esta pasta contem arquivos de configuracao e recursos carregados pelo Spring Boot.

## Arquivos e pastas

- `application.properties`: configura banco MySQL, JPA, porta do servidor, upload, Cloudinary, email SMTP e token.
- `static`: local reservado para arquivos estaticos servidos pela aplicacao, caso sejam usados futuramente.
- `templates`: local reservado para templates de servidor, caso sejam usados futuramente.

## Atencao

Credenciais reais devem ser configuradas por variaveis de ambiente, nao escritas diretamente em `application.properties`.
