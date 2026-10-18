// scripts/migrate.js
// Uso: node scripts/migrate.js
const fs = require("fs");
const path = require("path");

// 1. Leer js/data.js y extraer el objeto CATALOG
const dataJs = fs.readFileSync("js/data.js", "utf8");
const jsonPart = dataJs
  .replace(/^[\s\S]*?window\.CATALOG\s*=\s*/, "")
  .replace(/;\s*$/, "")
  .trim();
const catalog = JSON.parse(jsonPart);

// 2. Crear carpetas
fs.mkdirSync("content/productos", { recursive: true });
fs.mkdirSync("images", { recursive: true });

// 3. Convertir cada producto
let count = 0;
catalog.products.forEach((p, idx) => {
  // 3a. Imagen base64 → archivo real en images/
  if (p.img && p.img.startsWith("data:image/")) {
    const match = p.img.match(/^data:image\/([a-zA-Z]+);base64,(.+)$/);
    if (match) {
      const ext = match[1] === "jpeg" ? "jpg" : match[1];
      const buffer = Buffer.from(match[2], "base64");
      const filename = `images/migrated-${String(idx + 1).padStart(2, "0")}.${ext}`;
      fs.writeFileSync(filename, buffer);
      p.imgs = [filename];
      console.log(
        `  → imagen base64 guardada como ${filename} (${(buffer.length / 1024).toFixed(0)} KB)`
      );
    }
    delete p.img;
  }

  // 3b. Normalizar rutas de imágenes (quitar "/" inicial)
  if (p.imgs) {
    p.imgs = p.imgs.map((i) => i.replace(/^\//, ""));
  }

  // 3c. Generar nombre de archivo único
  const slug = (p.n || "producto")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  const filename = `${String(idx + 1).padStart(2, "0")}-${slug}.json`;

  // 3d. Escribir JSON
  fs.writeFileSync(
    path.join("content/productos", filename),
    JSON.stringify(p, null, 2)
  );
  console.log(`✓ ${filename}`);
  count++;
});

console.log(`\n✅ ${count} productos migrados a content/productos/`);