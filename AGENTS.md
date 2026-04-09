# Repository Guidelines

## Project Structure & Module Organization
This is a static website project (no framework runtime). Source files live under `src/`:

- `src/index.html`: main entry page.
- `src/styles/main.css`: global styling and base layout rules.
- `src/scripts/main.js`: client-side interactions.
- `src/assets/{img,icons,fonts}`: media and branding resources.
- `public/`: static files copied directly during build.
- `scripts/build.mjs`: build script.
- `dist/`: generated output from `npm run build` (do not edit manually).

## Build, Test, and Development Commands
- `npm install`: installs dependencies (currently `http-server`).
- `npm run dev` or `npm start`: serves `src/` at `http://localhost:3000`.
- `npm run build`: runs `scripts/build.mjs`, removes existing `dist/`, and copies `src/` into `dist/`.
- `npm run preview`: serves `dist/` at `http://localhost:4173`.

Typical local workflow: `npm install` → `npm run dev` for development → `npm run build` before release.

## Coding Style & Naming Conventions
- Keep formatting aligned with `.editorconfig`: UTF-8, LF line endings, 2-space indentation, final newline.
- Use simple, semantic HTML and avoid mixing script/style logic inline in markup.
- Group code by feature in `styles/` and `scripts/` folders when possible.
- New asset and file names should be lowercase and dash-separated (for example, `hero-banner.png`, `contact-form.css`).
- Trim trailing whitespace on code files and keep comments minimal and intentional.

## Testing Guidelines
- No automated test framework is configured.
- Validate manually:
  - Run `npm run build` and ensure it completes.
  - Confirm `dist/` contains expected files.
  - Open the site in at least one desktop and one mobile viewport via `npm run dev` and `npm run preview`.
  - Check critical links, forms, and media paths.
  - Verify there are no console errors.

## Commit & Pull Request Guidelines
- Existing history shows simple imperative messages; use concise verbs such as:
  - `feat: add new section`
  - `fix: correct image path`
- PRs should include a short summary of changed areas, manual verification steps, and visual checks (desktop/mobile if UI changes).
- Link related issue/ticket identifiers when available.

## Security & Configuration Tips
- Do not commit secrets, credentials, or API keys.
- Never commit `node_modules/` or `dist/` (both should remain in `.gitignore`).
- Optimize large images before placing them in `src/assets/img` to keep builds lightweight.
