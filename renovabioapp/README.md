# RenovaBio App

Aplicativo mobile do RenovaBio desenvolvido com Expo, React Native, TypeScript e Expo Router.

## Responsabilidades

- Permitir cadastro, login e recuperacao de senha.
- Exibir home, perfil, receitas, desafios, recompensas e historicos.
- Enviar feedbacks e comprovacoes para a API.
- Consumir a API do RenovaBio e montar URLs de imagens enviadas.
- Manter contexto de autenticacao e dados do usuario no app.

## Pastas principais

- `app`: telas e rotas do Expo Router.
- `components`: componentes reutilizaveis de interface.
- `components/ui`: componentes visuais de apoio e adaptacoes por plataforma.
- `constants`: tokens de tema, cores e valores compartilhados.
- `context`: providers e estados globais, como autenticacao.
- `hooks`: hooks reutilizaveis de tema e plataforma.
- `utils`: funcoes de API, dados auxiliares e formatacao usada nas telas.
- `assets`: imagens usadas pelo aplicativo.
- `scripts`: scripts auxiliares do projeto Expo.

## Comandos uteis

```bash
npm install
npm start
npm run android
npm run ios
npm run web
npm run lint
```

## Observacao sobre notificacoes e APK

- O app passou a usar `expo-notifications` para lembretes diarios locais.
- Como isso e uma dependencia nativa, depois dessa mudanca e necessario gerar e instalar uma nova build/APK para testar notificacoes no aplicativo instalado.
- Se a mudanca for apenas de texto, layout ou regra de tela, normalmente nao precisa reinstalar APK por causa disso sozinho.
- Antes da build final, revise os textos do app para corrigir erros de escrita e evitar que eles aparecam na versao instalada.

## API

A URL base consumida pelo app fica em `utils/api.ts`. Atualmente ela aponta para a API publicada em Railway.
