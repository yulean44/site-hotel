# Hotel Vila Nova do Príncipe

Código do site do Hotel Vila Nova do Príncipe, em Caetité, Bahia. Este repositório reúne os 220 arquivos recuperados da versão publicada no Sites, incluindo páginas, estilos, JavaScript, fotos, vídeos, cardápio e configuração de hospedagem.

Site publicado: https://hotel-vila-nova-principe.buzzy-coot-9350.chatgpt.site

## Estrutura atual

- `index.html`: página inicial.
- `o-hotel.html`, `acomodacoes.html`, `cafe-da-manha.html`, `noite-de-nupcias.html`, `galeria.html` e `localizacao.html`: páginas internas.
- `site.css` e `site.js`: estilos e interações de todas as páginas (cabeçalho, menu, fotos do topo, apartamentos, reserva pelo WhatsApp, fotos ampliadas e transição entre páginas).
- `assets/images/web/`: versões leves das fotos em WebP (`t/` 900 px, `f/` 1800 px, `hero/` 2400 px). As páginas usam só essas versões.
- `assets/`: imagens, vídeos e documentos, incluindo os arquivos originais disponíveis.
- `app/`: estrutura do App Router; a página inicial redireciona para `/index.html`.
- `build/prepare-public.mjs`: copia as páginas e os arquivos de mídia para `public/`.
- `worker/`, `vite.config.ts` e `build/sites-vite-plugin.ts`: integração Vinext/Cloudflare usada pela hospedagem.
- `.openai/hosting.json`: identificação e configuração do site existente no Sites.

Edite as páginas HTML, `site.css`, `site.js` e `assets/` na raiz. A pasta `public/` é gerada e não deve ser editada manualmente.

## Executar localmente

Para visualizar as páginas estáticas sem instalar dependências:

```sh
python3 -m http.server 8000
```

Abra http://localhost:8000/index.html.

Para usar o ambiente completo, instale Node.js 22.13 ou superior e pnpm:

```sh
pnpm install --frozen-lockfile
pnpm dev
```

Para compilar:

```sh
pnpm build
```

`public/`, `dist/` e `node_modules/` são gerados localmente e estão no `.gitignore`.

## Orientações para melhorar a estrutura com o Claude

Comece analisando as páginas HTML, `site.css`, `site.js` e `package.json`. Proponha uma organização que reduza a repetição entre páginas e facilite a manutenção. Preserve o conteúdo em português, a identidade do hotel, os arquivos de mídia e os links de reserva e contato. Valide a navegação, a acessibilidade e o comportamento em telas pequenas após as alterações.

O repositório mantém a estrutura original para servir de ponto de partida. Um push no GitHub não atualiza automaticamente a publicação existente no Sites.
