# Hotel Vila Nova do Príncipe

Código do site do Hotel Vila Nova do Príncipe, em Caetité, Bahia. Este repositório reúne os 220 arquivos recuperados da versão publicada no Sites, incluindo páginas, estilos, JavaScript, fotos, vídeos, cardápio e configuração de hospedagem.

Site publicado: https://hotel-vila-nova-principe.buzzy-coot-9350.chatgpt.site

## Estrutura atual

- `index.html`: página inicial.
- `o-hotel.html`, `acomodacoes.html`, `cafe-da-manha.html`, `noite-de-nupcias.html`, `galeria.html` e `localizacao.html`: páginas internas.
- `styles.css` e `script.js`: estilos e interações do site.
- `assets/`: imagens, vídeos e documentos, incluindo os arquivos originais disponíveis.
- `app/`: estrutura do App Router; a página inicial redireciona para `/index.html`.
- `build/prepare-public.mjs`: copia as páginas e os arquivos de mídia para `public/`.
- `worker/`, `vite.config.ts` e `build/sites-vite-plugin.ts`: integração Vinext/Cloudflare usada pela hospedagem.
- `.openai/hosting.json`: identificação e configuração do site existente no Sites.

Edite o conteúdo nas páginas HTML da raiz. Cabeçalho, rodapé e navegação compartilhados ficam em `components/`; execute `pnpm sync:layout` para propagá-los. Os links de reserva específicos de cada página ficam em `components/pages.json`.

Os estilos editáveis ficam em `styles/`: `legacy.css` preserva a base anterior e `refinements.css` concentra o refinamento visual atual. `styles.css` é compilado com `pnpm build:styles`. O build e o servidor de desenvolvimento também atualizam esse arquivo automaticamente.

`script.js` é o ponto de entrada. Menu, reservas, datas, acessibilidade dos diálogos e galerias ficam separados em `scripts/`. Apenas as interações presentes em cada página são carregadas.

As pastas `public/` e `dist/` são geradas; não as edite manualmente. A saída de produção inclui todos os módulos de `scripts/`.

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

## Verificações e imagens

```sh
pnpm check
pnpm test
```

As verificações conferem páginas, links, imagens, navegação compartilhada, sintaxe e imports. Os testes cobrem datas de reserva, viradas de mês/ano e horário de verão. A validação visual e os fluxos completos no navegador continuam necessários; veja `docs/revisao.md` para as verificações realizadas e seus limites.

Para recriar as cópias WebP otimizadas, mantendo as fotos originais:

```sh
pnpm optimize:images
pnpm sync:layout
```

As cópias ficam em `assets/images/optimized/`; dimensões e medições são registradas em `docs/image-optimization.json`. A otimização usa Sharp como dependência de desenvolvimento; não há processamento de imagens no navegador.

## Orientações para melhorar a estrutura com o Claude

Comece analisando as páginas HTML, `styles.css`, `script.js` e `package.json`. Proponha uma organização que reduza a repetição entre páginas e facilite a manutenção. Preserve o conteúdo em português, a identidade do hotel, os arquivos de mídia e os links de reserva e contato. Valide a navegação, a acessibilidade e o comportamento em telas pequenas após as alterações.

O repositório mantém a estrutura original para servir de ponto de partida. Um push no GitHub não atualiza automaticamente a publicação existente no Sites.
