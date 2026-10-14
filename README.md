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
  <a href="docs/MAINTENANCE.md">🛠 Manutenção</a> ·
  <a href="docs/DEPLOYMENT.md">🚀 Publicação</a>
</p>

## Recursos

- **38 títulos:** filmes e as duas temporadas de Loki em ordem cronológica.
- **Cards com pôsteres:** arte de cada título e destaque verde nos assistidos.
- **Progresso compartilhado:** alterações do administrador aparecem para todos.
- **Busca sem acentos e filtros:** todos, para assistir e assistidos.
- **Próximo capítulo:** indica o primeiro título ainda não concluído.
- **Layout adaptável:** leitura no computador e no celular.

## Como usar

| Página | Público | Função |
| --- | --- | --- |
| [`/`](https://murilosomarvel.netlify.app/) | Comunidade | Consultar, buscar e filtrar |
| `/admin/` | Administrador | Entrar com senha, marcar títulos e reiniciar o progresso |

A área pública foi criada para a comunidade que acompanha o streamer Muriloso. A administração do catálogo e do progresso é restrita ao responsável pelo projeto. A página consulta o progresso a cada **5 segundos** enquanto está visível. A senha de administração fica nas variáveis de ambiente do Netlify.

## Tecnologias utilizadas

- HTML
- CSS
- JavaScript
- Node.js
- Netlify Functions
- Netlify Blobs

## Estrutura

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
docs/                      Guias e registro de revisão
.github/                   Banner e modelos de issues
netlify.toml               Configuração de publicação
```

## Como executar o projeto

Com **Node.js 24** e npm, na pasta do repositório:

```bash
npm ci
npm test
```

Os testes usam armazenamento em memória e não alteram o site publicado. Abrir somente o HTML localmente não reproduz a API, que depende das funções e do armazenamento do Netlify.

## Controle de alterações

Embora o repositório seja público para consulta e demonstração do projeto, ele não está aberto para que qualquer pessoa faça alterações. Mudanças no código, no catálogo e no progresso são realizadas somente pelo responsável pelo projeto.

## Guias

- [Manutenção: filmes, pôsteres e visual](docs/MAINTENANCE.md)
- [Publicação e administração](docs/DEPLOYMENT.md)
- [Como contribuir](CONTRIBUTING.md)
- [Revisão histórica de 27/09/2026](docs/CHECKUP-2026-09-27.md)
