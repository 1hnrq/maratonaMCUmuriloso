<p align="center">
  <img src=".github/assets/banner.svg" alt="Maratona MCU do Muriloso" width="960">
</p>

<p align="center">
  <strong>A maratona Marvel da comunidade, filme por filme.</strong><br>
  Projeto desenvolvido para acompanhar os reacts e a maratona do streamer Muriloso.
</p>

<p align="center">
  <a href="https://murilosomarvel.netlify.app/">🍿 Abrir o site</a> ·
  <a href="https://cinefy.gg/muriloso">▶ Ver os VODs</a> ·
  <a href="https://www.twitch.tv/muriloso">🔴 Lives na Twitch</a>
</p>

## Recursos

- **38 títulos:** filmes e as duas temporadas de Loki em ordem cronológica.
- **Cards com pôsteres:** arte de cada título e destaque verde nos assistidos.
- **Progresso compartilhado:** alterações do administrador aparecem para todos.
- **Busca sem acentos e filtros:** todos, para assistir e assistidos.
- **Próximo capítulo:** indica o primeiro título ainda não concluído.
- **Layout adaptável:** leitura no computador e no celular.

## Como utilizar

1. Acesse o site da Maratona MCU do Muriloso.
2. Consulte os títulos disponíveis, pesquise filmes ou séries e utilize os filtros.
3. Acompanhe o progresso da maratona, atualizado pelo administrador.
4. Assista aos VODs para acompanhar os reacts do streamer.

A área pública é destinada à comunidade que acompanha o streamer Muriloso. As alterações no catálogo e no progresso são restritas ao responsável pelo projeto.

## Tecnologias utilizadas

- HTML
- CSS
- JavaScript
- Node.js
- Netlify Functions
- Netlify Blobs

## Estrutura do projeto

```text
public/                    Site publicado
├── index.html             Página da comunidade
├── admin/index.html       Administração
├── app.js                 Catálogo, busca, filtros e progresso
├── readability.css        Ajustes visuais e cards com pôsteres
├── marvel-logo.svg        Marca-d’água bordô
└── posters/               Imagens por ID estável e fontes
netlify/functions/         Login e API de progresso
tests/                     Testes da API e do catálogo
docs/                      Documentação interna
.github/                   Banner e modelos de issues
netlify.toml               Configuração de publicação
```

## Controle de alterações

Embora o repositório seja público para consulta e demonstração do projeto, ele não está aberto para que qualquer pessoa faça alterações. Mudanças no código, no catálogo e no progresso são realizadas somente pelo responsável pelo projeto.
