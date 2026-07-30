import { cp, copyFile, mkdir } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const publicDir = resolve(root, "public");
const siteFiles = [
  "index.html",
  "o-hotel.html",
  "acomodacoes.html",
  "cafe-da-manha.html",
  "noite-de-nupcias.html",
  "galeria.html",
  "localizacao.html",
  "styles.css",
  "script.js",
];

await mkdir(publicDir, { recursive: true });
await Promise.all(
  siteFiles.map((file) => copyFile(resolve(root, file), resolve(publicDir, file))),
);
await cp(resolve(root, "assets"), resolve(publicDir, "assets"), {
  recursive: true,
  force: true,
});
await copyFile(
  resolve(root, "assets", "images", "og.png"),
  resolve(publicDir, "og.png"),
);
