// tina/config.js
import { defineConfig } from "tinacms";

const branch = process.env.HEAD || process.env.GITHUB_REF_NAME || "main";

export default defineConfig({
  branch,
  clientId: process.env.TINA_PUBLIC_CLIENT_ID,
  token: process.env.TINA_TOKEN,
  build: {
    outputFolder: "admin",
    publicFolder: "./",
  },
  media: {
    tina: {
      mediaRoot: "images",
      publicFolder: "./",
    },
  },
  schema: {
    collections: [
      {
        name: "producto",
        label: "Productos",
        path: "content/productos",
        format: "json",
        fields: [
          {
            type: "string",
            name: "n",
            label: "Nombre del producto",
            isTitle: true,
            required: true,
          },
          {
            type: "string",
            name: "c",
            label: "Categoría",
            required: true,
            options: ["Zapatillas", "Ropa", "Accesorios", "Sunglasses"],
          },
          {
            type: "string",
            name: "w",
            label: "Público",
            required: true,
            options: [
              { value: "men", label: "Men's" },
              { value: "women", label: "Women's" },
              { value: "kids", label: "Kid's" },
              { value: "unisex", label: "Unisex" },
            ],
          },
          {
            type: "number",
            name: "p",
            label: "Precio (S/)",
            description: "Dejar vacío para mostrar 'Consultar precio'",
          },
          {
            type: "string",
            name: "tag",
            label: "Etiqueta",
            description: "Ej: Nuevo, Oferta, Últimas unidades",
          },
          {
            type: "string",
            name: "t",
            label: "Tallas",
            description: "Ej: 7.5 al 11",
          },
          {
            type: "string",
            name: "k",
            label: "Color",
            description: "Ej: Negro, Blanco",
          },
          {
            type: "string",
            name: "d",
            label: "Descripción",
            ui: { component: "textarea" },
          },
          {
            type: "image",
            name: "imgs",
            label: "Fotos (la primera es la principal)",
            list: true,
          },
          {
            type: "string",
            name: "i",
            label: "Icono (se usa si no hay foto)",
            options: [
              "polo",
              "zapatilla",
              "gorra",
              "cartera",
              "vestido",
              "lentes",
              "casaca",
              "reloj",
            ],
          },
          {
            type: "number",
            name: "h",
            label: "Tono del tile (0-360)",
            description: "Color de fondo si no hay foto. Por defecto: 120",
          },
        ],
      },
    ],
  },
});