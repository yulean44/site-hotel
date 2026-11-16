import sharp from 'sharp';
import { readdir, mkdir, readFile, writeFile, stat } from 'node:fs/promises';
import { join, relative, dirname } from 'node:path';

const root = new URL('../', import.meta.url).pathname;
const imageRoot = join(root, 'assets/images');
const walk = async directory => {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.filter(entry => entry.name !== 'optimized').map(entry =>
    entry.isDirectory() ? walk(join(directory, entry.name)) : [join(directory, entry.name)]));
  return nested.flat();
};
const manifest = {};
for (const source of (await walk(imageRoot)).filter(path => /\.(?:jpe?g|webp)$/i.test(path))) {
  const destination = join(imageRoot, 'optimized', relative(imageRoot, source).replace(/\.webp$/i, '.source.webp').replace(/\.jpe?g$/i, '.webp'));
  await mkdir(dirname(destination), { recursive: true });
  const result = await sharp(source).rotate().resize({ width: 1440, withoutEnlargement: true }).webp({ quality: 74 }).toFile(destination);
  manifest[relative(root, source)] = { path: relative(root, destination), width: result.width, height: result.height, before: (await stat(source)).size, after: result.size };
}

// Keep source photos intact; pages and catalog modules use lighter copies.
const pageFiles = (await readdir(root)).filter(path => path.endsWith('.html'));
const templates = (await readdir(join(root, 'components'))).filter(path => path.endsWith('.html')).map(path => `components/${path}`);
const modules = ['scripts/rooms.js', 'scripts/wedding.js'];
for (const file of [...pageFiles, ...templates, ...modules]) {
  let content = await readFile(join(root, file), 'utf8');
  for (const [source, image] of Object.entries(manifest)) content = content.replaceAll(source, image.path);
  if (modules.includes(file)) content = content
    .replaceAll('assets/images/acomodacoes/', 'assets/images/optimized/acomodacoes/')
    .replaceAll('assets/images/noite-de-nupcias/', 'assets/images/optimized/noite-de-nupcias/')
    .replaceAll('.jpg`', '.webp`');
  if (!modules.includes(file)) {
    const tags = [...content.matchAll(/<img\b[^>]*>/g)];
    for (const [tag] of tags) {
      const src = tag.match(/\bsrc="([^"]+)"/)?.[1];
      if (!src || !src.startsWith('assets/')) continue;
      const metadata = await sharp(join(root, src)).metadata();
      let enhanced = tag.replace(/\s(?:width|height)="[^"]*"/g, '');
      enhanced = enhanced.replace(/\s*\/?>$/, ` width="${metadata.width}" height="${metadata.height}" decoding="async" />`).replace(/ decoding="async"(?=[\s\S]* decoding="async")/, '');
      const isHero = tag.includes('home-hero-slide') || (content.indexOf(tag) < content.indexOf('class="page-hero-copy"') && !tag.includes('logo-hotel'));
      if (isHero) enhanced = enhanced.replace(/ loading="[^"]*"/g, '').replace(/ fetchpriority="[^"]*"/g, '').replace(' />', ' fetchpriority="high" />');
      else if (!tag.includes('logo-hotel')) enhanced = enhanced.replace(/ loading="[^"]*"/g, '').replace(' />', ' loading="lazy" />');
      content = content.replace(tag, enhanced);
    }
  }
  await writeFile(join(root, file), content);
}
const totals = Object.values(manifest).reduce((sum, item) => ({ before: sum.before + item.before, after: sum.after + item.after }), { before: 0, after: 0 });
await writeFile(join(root, 'docs/image-optimization.json'), JSON.stringify({ count: Object.keys(manifest).length, ...totals, images: manifest }, null, 2) + '\n');
console.log(`${Object.keys(manifest).length} imagens: ${totals.before} → ${totals.after} bytes; originais preservados.`);
