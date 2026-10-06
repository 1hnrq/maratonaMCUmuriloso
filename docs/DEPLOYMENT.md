# Publicação no Netlify

O site publicado é [murilosomarvel.netlify.app](https://murilosomarvel.netlify.app/). A integração com o GitHub publica a branch `main`.

## Configuração do projeto

O arquivo `netlify.toml` define:

| Opção | Valor |
| --- | --- |
| Diretório publicado | `public` |
| Funções | `netlify/functions` |
| Empacotador das funções | `esbuild` |
| Comando de build | Nenhum |

O frontend é HTML, CSS e JavaScript direto: não há etapa de compilação. As funções usam `@netlify/blobs`, instalado pelas dependências do projeto. Use Node.js 24 para desenvolvimento e configure essa mesma versão no ambiente do Netlify.

## Senha de administrador

Configure `ADMIN_PASSWORD` nas variáveis de ambiente do site no Netlify, com disponibilidade para as funções. A senha não deve entrar no código, em commits nem em arquivos publicados.

Se a variável não estiver configurada, o login responde que a senha ainda não foi definida. Depois de alterar as variáveis, faça uma nova implantação para que as funções recebam a configuração.

As sessões já criadas podem continuar válidas até expirarem ou o administrador sair, mesmo depois de trocar a senha.

## Publicar uma alteração

1. Instale as dependências com `npm ci` e execute `npm test`.
2. Revise o diff para confirmar os arquivos e a mudança desejada.
3. Envie o commit para `main`, ou abra um pull request e integre-o nessa branch após a revisão.
4. No Netlify, acompanhe a implantação vinculada ao commit. Espere a conclusão antes de conferir a página publicada.
5. Abra o site e confirme a alteração, os pôsteres e o carregamento do progresso. Confira também `/admin/` se a mudança o afetar.

## Proteção de contribuições externas

As prévias automáticas de pull requests estão desativadas no painel do Netlify: **Developer settings → Branches and deploy contexts → Deploy Previews → None**. A branch de produção continua sendo `main`; outras branches também não são publicadas automaticamente. Essa configuração fica no painel, não em `netlify.toml`.

Com isso, abrir um pull request não executa automaticamente o código proposto em uma prévia com variáveis do projeto. A senha administrativa continua armazenada no Netlify e marcada como valor secreto, fora do repositório.

Se futuramente habilitar prévias, confira **Environment variables → Site policies → Sensitive variable policy** e exija aprovação de deploys não confiáveis. Revise o código antes de aprovar; nunca use a opção de liberar contribuições externas sem restrições. A política está disponível quando o repositório vinculado é público. Consulte a [documentação Netlify](https://docs.netlify.com/build/environment-variables/get-started/#sensitive-variable-policy).

Use variáveis e dados separados para testes; não compartilhe a senha de produção com ambientes de contribuições externas.

## Quando a alteração não aparece

- Confira se o commit foi enviado para `main` e se a implantação dele terminou.
- Leia o log da implantação com falha no Netlify.
- Atualize a página e confira o endereço aberto: uma prévia pode mostrar uma versão diferente da produção.
- Verifique se os arquivos destinados aos visitantes estão dentro de `public`.
- Para erro no progresso ou login, confira os logs das funções e a configuração de `ADMIN_PASSWORD`.

O armazenamento do progresso é separado dos arquivos publicados. Voltar a uma implantação anterior reverte o código e as imagens daquela versão, mas não desfaz automaticamente marcações ou um reinício da maratona.
