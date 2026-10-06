<p align="center">
  <img src=".github/assets/banner.svg" alt="Maratona MCU do Muriloso" width="960">
</p>

<p align="center">
  <strong>A maratona Marvel da comunidade, filme por filme.</strong><br>
  Pôsteres, busca e progresso compartilhado para acompanhar os reacts do Muriloso.
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

A página consulta o progresso a cada **5 segundos** enquanto está visível. A senha de administração fica nas variáveis de ambiente do Netlify.

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

## Desenvolvimento

Com **Node.js 24** e npm, na pasta do repositório:

```bash
npm ci
npm test
```

Os testes usam armazenamento em memória e não alteram o site publicado. Abrir somente o HTML localmente não reproduz a API, que depende das funções e do armazenamento do Netlify.

## Guias

- [Manutenção: filmes, pôsteres e visual](docs/MAINTENANCE.md)
- [Publicação e administração](docs/DEPLOYMENT.md)
- [Como contribuir](CONTRIBUTING.md)
- [Revisão histórica de 27/09/2026](docs/CHECKUP-2026-09-27.md)

## Preservar o progresso

Cada título tem um **ID estável**, separado de sua posição na tela. Reordenar a lista não deve mudar os IDs, pois eles vinculam as marcações e os pôsteres.

O progresso fica no **Netlify Blobs**, separado dos arquivos do site. Um deploy preserva os dados. O botão de reiniciar limpa as marcações compartilhadas.

## Limites conhecidos

- Recomenda-se um administrador editando em um aparelho por vez; gravações simultâneas podem se sobrepor.
- As sessões duram até 12 horas. Alterar a senha não revoga automaticamente sessões abertas.
- A sequência é a seleção desta maratona, não um catálogo completo de todas as produções Marvel.

Os pôsteres e a marca Marvel pertencem aos respectivos titulares. Consulte [as fontes](public/posters/SOURCES.md); a presença das imagens no projeto não concede licença de redistribuição.

---

<sub>Desenvolvido com auxílio do OpenAI Codex.</sub>
