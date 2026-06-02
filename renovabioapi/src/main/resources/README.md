# Resources da API

Esta pasta contem arquivos de configuracao e recursos carregados pelo Spring Boot.

## Arquivos e pastas

- `application.properties`: configura banco MySQL, JPA, porta do servidor, upload, Cloudinary e token.
- `data.sql`: dados iniciais usados quando a aplicacao carrega scripts SQL.
- `static`: local reservado para arquivos estaticos servidos pela aplicacao, caso sejam usados futuramente.
- `templates`: local reservado para templates de servidor, caso sejam usados futuramente.

## Atencao

Credenciais reais devem ser configuradas por variaveis de ambiente, nao escritas diretamente em `application.properties`.

No Railway, configure as variaveis do Cloudinary no servico da API. O fluxo atual de recuperacao de senha e simplificado e nao depende de SMTP.
