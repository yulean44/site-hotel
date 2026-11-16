import { readFile, writeFile } from 'node:fs/promises';

const sources = ['styles/legacy.css', 'styles/refinements.css'];
const css = await Promise.all(sources.map(path => readFile(new URL(`../${path}`, import.meta.url), 'utf8')));
await writeFile(new URL('../styles.css', import.meta.url), '/* Gerado por build/compile-styles.mjs. Edite styles/. */\n' + css.join('\n'));
