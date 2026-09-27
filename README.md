# Maratona MCU do Muriloso

O projeto tem duas páginas:

- `/` — lista compartilhada para seus amigos verem.
- `/admin/` — área que pede sua senha para marcar, desmarcar e reiniciar a lista.

## Publicar na Netlify

1. Envie o conteúdo desta pasta para o repositório GitHub.
2. Na Netlify, use **Add new site** → **Import an existing project** → **GitHub**.
3. Escolha o repositório `1hnrq/maratonaMCUmuriloso`.
4. Mantenha **Build command** vazio e defina **Publish directory** como `public`.
5. Antes de publicar, em **Project configuration** → **Environment variables**, crie a variável `ADMIN_PASSWORD` com uma senha forte.
6. Publique. A Netlify cria automaticamente o armazenamento compartilhado da lista.

Não coloque a senha no GitHub. Ela só deve existir nas variáveis de ambiente da Netlify.

## Atualizações

Sempre que você enviar uma alteração ao repositório, a Netlify publica a nova versão. As marcações ficam preservadas porque são armazenadas fora dos arquivos do site.
