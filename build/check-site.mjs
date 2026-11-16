import assert from 'node:assert/strict';
import { readFile, access, readdir } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';

const root = new URL('../', import.meta.url);
const pages = JSON.parse(await readFile(new URL('components/pages.json', root), 'utf8'));
const files = new Map(await Promise.all(pages.map(async ({ file }) => [file, await readFile(new URL(file, root), 'utf8')])));
let images = 0;
let links = 0;
for (const [file, html] of files) {
  assert.match(html, /<html lang="pt-BR">/, `${file}: idioma`);
  assert.equal([...html.matchAll(/<h1\b/g)].length, 1, `${file}: título principal único`);
  assert.match(html, /class="skip-link" href="#conteudo"/, `${file}: pular para conteúdo`);
  assert.match(html, /aria-controls="menu-principal"/, `${file}: controle de menu`);
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  assert.equal(new Set(ids).size, ids.length, `${file}: IDs duplicados`);
  for (const [tag] of html.matchAll(/<img\b[^>]*>/g)) {
    assert.match(tag, /\balt="[^"]*"/, `${file}: imagem sem alt`);
    assert.match(tag, /\bwidth="[1-9]\d*"/, `${file}: largura da imagem`);
    assert.match(tag, /\bheight="[1-9]\d*"/, `${file}: altura da imagem`);
    assert.match(tag, /\bsrc="[^"]+"/, `${file}: imagem vazia`);
    images++;
  }
  for (const match of html.matchAll(/\b(?:src|href)=["']([^"']*)["']/g)) {
    const value = match[1];
    assert.ok(value && value !== '#', `${file}: link vazio`);
    if (/^(?:https?:|mailto:|tel:|data:)/.test(value)) continue;
    const url = new URL(value, new URL(file, 'https://hotel.local/'));
    const path = url.pathname.slice(1);
    await access(new URL(path, root));
    if (url.hash && files.has(path)) assert.ok(files.get(path).includes(`id="${decodeURIComponent(url.hash.slice(1))}"`), `${file}: âncora ausente ${value}`);
    links++;
  }
}
for (const file of ['script.js', ...(await readdir(new URL('scripts/', root))).filter(file => file.endsWith('.js')).map(file => `scripts/${file}`)]) {
  execFileSync(process.execPath, ['--check', new URL(file, root).pathname]);
  const source = await readFile(new URL(file, root), 'utf8');
  for (const match of source.matchAll(/(?:from\s*|import\s*|import\()\s*['"](\.[^'"]+)['"]/g)) await access(new URL(match[1], new URL(file, root)));
}
// Use the CSS parser already present in the project's Vite toolchain.
const requireVite = createRequire(import.meta.resolve('vite'));
const { transform } = requireVite('esbuild');
await transform(await readFile(new URL('styles.css', root), 'utf8'), { loader: 'css', logLevel: 'error' });
console.log(`${pages.length} páginas, ${images} imagens e ${links} referências locais verificadas; JS e CSS válidos.`);
