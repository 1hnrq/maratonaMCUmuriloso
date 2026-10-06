# Manutenção do site

## Onde editar

| Alteração | Arquivo |
| --- | --- |
| Títulos, ordem, busca e progresso na tela | `public/app.js` |
| Página dos visitantes | `public/index.html` |
| Página de administração | `public/admin/index.html` |
| Aparência dos cards, pôsteres e fundo | `public/readability.css` |
| Logo de fundo | `public/marvel-logo.svg` |
| Imagens dos títulos | `public/posters/<id>.jpg` |
| Leitura e gravação do progresso, sessões | `netlify/functions/api.mjs` |
| Rota de login e limite de tentativas | `netlify/functions/login.mjs` |

As duas páginas usam o mesmo `app.js` e `readability.css`. Confira ambas ao mudar a apresentação. Os estilos base ainda estão no HTML; as regras de `readability.css` são carregadas depois e ajustam o visual final.

## IDs são permanentes

Cada título tem três valores: `[título, ano, id]`. O ID liga o filme ao progresso salvo e ao seu pôster; ele não é o número mostrado no card.

- Os 37 títulos originais mantêm os IDs de `0` a `36`.
- Homem-Formiga (2015) usa o ID `37` e o pôster `public/posters/37.jpg`.
- `items.splice(12, 0, ["Homem-Formiga", "2015", 37])` coloca o filme na posição 13, depois de Era de Ultron e antes de Guerra Civil.

Não renumere IDs existentes ao inserir ou reorganizar a lista: isso associaria as marcações e imagens a outros títulos. O catálogo original recebe IDs pela posição no `.map(...)`; por isso, inserir um filme no meio desse array também muda os IDs posteriores. Para uma inclusão simples, use um ID novo e insira a entrada depois do `.map(...)`, como foi feito com Homem-Formiga.

## Adicionar um título

1. Escolha um ID ainda não utilizado. O próximo disponível atualmente é `38`.
2. Inclua `[título, ano, id]` em `public/app.js` na posição desejada, preservando todos os IDs existentes.
3. Adicione um JPEG otimizado em `public/posters/<id>.jpg` e registre a origem da imagem em [Fontes dos pôsteres](../public/posters/SOURCES.md).
4. Atualize o maior ID aceito em `netlify/functions/api.mjs`. Atualmente a API aceita IDs de `0` a `37`.
5. Atualize o total inicial `0/38` nas duas páginas HTML. Depois do carregamento, o total é calculado pelo JavaScript.
6. Ajuste `tests/catalog.test.mjs` e os limites de IDs em `tests/api.test.mjs`; execute `npm test`.
7. Confira ordem, pôster, busca e filtros nas páginas pública e administrativa, incluindo uma tela pequena.

A numeração visível, o percentual e o próximo capítulo seguem a ordem de `items`. O nome do arquivo do pôster sempre segue o ID. Se uma imagem falhar, ela é removida do card e o título permanece visível.

## Progresso e administração

O progresso compartilhado fica no Netlify Blobs, no armazenamento `maratona-mcu`, sob a chave `progress`. Não é salvo no GitHub nem no navegador. Uma publicação do código não reinicia a maratona.

A leitura em `/api/progress` é pública. Marcar títulos e reiniciar a lista exige uma sessão de administrador; a senha é definida pela variável `ADMIN_PASSWORD` no Netlify. A sessão dura até 12 horas e o botão **Sair** revoga seu acesso no servidor.

O botão **Reiniciar maratona** limpa o progresso para todos. Não o use para testar uma alteração visual no site publicado. Os testes automatizados utilizam armazenamento em memória e não alteram o progresso real.

## Verificação antes de publicar

- Execute `npm test` com Node.js 24 e dependências instaladas por `npm ci`.
- Confira a lista completa e os totais, além de busca com e sem acentos e filtros.
- Verifique a leitura dos títulos sobre os pôsteres e a largura móvel, sem rolagem horizontal.
- Confira `/admin/` e seu formulário de login; valide gravações em um ambiente de teste se houver mudança na API.

O registro de revisão em [CHECKUP-2026-09-27.md](CHECKUP-2026-09-27.md) descreve a situação naquela data, não substitui a validação de uma alteração nova.
