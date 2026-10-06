# Como contribuir

Use Node.js 24 e npm. Após clonar o repositório, execute na pasta do projeto:

```sh
npm ci
npm test
```

`npm ci` instala as versões registradas em `package-lock.json`. `npm test` verifica o catálogo e os controles da API usando armazenamento em memória, sem alterar a maratona publicada.

Um servidor estático pode mostrar o frontend, mas não executa as rotas `/api/*` das funções Netlify. Para conferir o progresso e o login no navegador, use um ambiente Netlify com as funções e variáveis configuradas, como uma prévia de implantação.

## Fluxo de trabalho

1. Crie uma branch para a alteração.
2. Faça uma mudança com objetivo claro e leia o guia correspondente abaixo.
3. Execute `npm test` e confira no navegador as páginas afetadas.
4. Revise o diff e envie um commit com uma descrição curta do que mudou.
5. Abra um pull request explicando o resultado e a validação feita.

Para mudanças visuais, uma captura de tela no pull request facilita a revisão. As páginas pública e administrativa compartilham JavaScript e CSS: uma mudança pode afetar as duas.

## Guias do projeto

- [Manutenção](docs/MAINTENANCE.md): catálogo, IDs permanentes, pôsteres e progresso.
- [Publicação](docs/DEPLOYMENT.md): configuração do Netlify e acompanhamento da implantação.
- [Revisão de 27/09/2026](docs/CHECKUP-2026-09-27.md): registro histórico das verificações realizadas.

Preserve os IDs dos títulos já existentes, mantenha a origem das novas imagens documentada e não inclua senhas ou tokens no repositório.
