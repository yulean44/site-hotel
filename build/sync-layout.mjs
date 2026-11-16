import { readFile, writeFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const read = path => readFile(new URL(path, root), 'utf8');
const navigation = JSON.parse(await read('components/navigation.json'));
const pages = JSON.parse(await read('components/pages.json'));
const header = await read('components/header.html');
const footer = await read('components/footer.html');
const check = process.argv.includes('--check');

for (const page of pages) {
  const before = await read(page.file);
  const links = navigation.map(item => {
    const active = item.file === page.file ? ' class="active" aria-current="page"' : '';
    return `<a href="${item.file}"${active}><span>${item.label}</span><small>${item.detail}</small></a>`;
  }).join('');
  const secondaryLinks = navigation.map(item => `<a href="${item.file}"${item.file === page.file ? ' class="active" aria-current="page"' : ''}>${item.label}</a>`).join('');
  const secondary = `<!-- section-navigation:start --><nav class="section-navigation" aria-label="Seções do hotel">${secondaryLinks}</nav><!-- section-navigation:end -->`;
  let after = before
    .replace(/\s*<header class="site-header"[\s\S]*?<\/header>/, '\n' + header.trimEnd().replace('{{links}}', links).replace('{{reserveUrl}}', page.reserveUrl))
    .replace(/\s*<footer class="site-footer"[\s\S]*?<\/footer>/, '\n' + footer.trimEnd());
  if (!after.includes('class="skip-link"')) after = after.replace(/(<body[^>]*>)/, '$1\n  <a class="skip-link" href="#conteudo">Pular para o conteúdo</a>');
  if (after.includes('<!-- section-navigation:start -->')) after = after.replace(/<!-- section-navigation:start -->[\s\S]*?<!-- section-navigation:end -->/, secondary);
  else after = after.replace('</section>', `</section>\n${secondary}`);
  if (check && after !== before) throw new Error(`Layout desatualizado: ${page.file}. Execute pnpm sync:layout.`);
  if (!check) await writeFile(new URL(page.file, root), after);
}
