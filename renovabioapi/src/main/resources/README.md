# Resources da API

Esta pasta contem arquivos de configuracao e recursos carregados pelo Spring Boot.

## Arquivos e pastas

- `application.properties`: configura banco MySQL, JPA, porta do servidor, upload, Cloudinary e token.
- `data.sql`: dados de referencia de cidades, categorias, receitas, desafios, parceiros e recompensas. O inicializador atual utiliza o bloco de receitas desse arquivo.
- `static`: local reservado para arquivos estaticos servidos pela aplicacao, caso sejam usados futuramente.
- `templates`: local reservado para templates de servidor, caso sejam usados futuramente.

## Atencao

Credenciais reais ficam em variaveis de ambiente, nao escritas diretamente em `application.properties`.

No Railway, as variaveis do Cloudinary ficam no servico da API. O fluxo atual de recuperacao de senha e simplificado e nao depende de SMTP.
