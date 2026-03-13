# Niebla Sound Branding

Proyecto web estatico organizado para escalar, sin frameworks adicionales.

## Estructura

```text
.
|-- src/
|   |-- index.html
|   |-- assets/
|   |   |-- img/
|   |   |-- icons/
|   |   `-- fonts/
|   |-- styles/
|   |   `-- main.css
|   `-- scripts/
|       `-- main.js
|-- public/
|-- dist/
|-- scripts/
|   `-- build.mjs
|-- index.html
|-- package.json
`-- .gitignore
```

## Ejecutar local

### Opcion 1: abrir HTML directo
Abrir `src/index.html` o `index.html` en el navegador.

### Opcion 2: servidor local (recomendado)
1. Instalar dependencias:
   ```bash
   npm install
   ```
2. Levantar entorno de desarrollo:
   ```bash
   npm run dev
   ```

## Build y preview
1. Generar `dist`:
   ```bash
   npm run build
   ```
2. Previsualizar build:
   ```bash
   npm run preview
   ```
