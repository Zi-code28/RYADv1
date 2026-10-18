// scripts/build-data.js
// Uso: node scripts/build-data.js
// Lee content/productos/*.json y regenera js/data.js para el catálogo público.

const fs = require("fs");
const path = require("path");

const CONTENT_DIR = "content/productos";
const OUTPUT_FILE = "js/data.js";

// 1. Leer todos los JSONs, ordenados por nombre de archivo
//    (los prefijos numéricos "01-", "02-" mantienen el orden)
const files = fs
  .readdirSync(CONTENT_DIR)
  .filter((f) => f.endsWith(".json"))
  .sort();

// 2. Parsear cada uno y limpiar rutas de imágenes
//    Tina guarda "/images/foo.jpg", app.js espera "images/foo.jpg"
const products = files.map((file) => {
  const raw = fs.readFileSync(path.join(CONTENT_DIR, file), "utf8");
  const p = JSON.parse(raw);

  if (Array.isArray(p.imgs)) {
    p.imgs = p.imgs.map((i) => i.replace(/^\//, ""));
  }

  return p;
});

// 3. Construir el objeto CATALOG (sin pin, ya no hay admin en app.js)
const catalog = {
  rev: new Date().toISOString(),
  products,
};

// 4. Escribir el archivo en el formato original de tu app.js
const out =
  "/* Datos del catálogo. Generado automáticamente por scripts/build-data.js. No editar a mano. */\n" +
  "window.CATALOG = " +
  JSON.stringify(catalog, null, 1) +
  ";\n";

fs.writeFileSync(OUTPUT_FILE, out, "utf8");

console.log(`✅ js/data.js regenerado con ${products.length} productos`);