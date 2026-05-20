# Terminal Portfolio

Single-page portfolio built with Astro and styled as an interactive terminal.

## Stack

- Astro
- TypeScript
- LESS
- self-hosted JetBrains Mono font

## Features

- mock-inspired terminal UI with macOS-style window chrome
- startup sequence that pre-renders `whoami`, `skills --list`, `projects --public`, and `contact`
- command input with history, tab autocomplete, clickable commands, and `clear`
- content managed from one file: `src/data/portfolio.ts`
- mobile-friendly layout with pinned input row

## Project Structure

```text
src/
├── components/
│   └── Terminal/
│       ├── Terminal.astro
│       ├── TerminalBody.astro
│       ├── renderer.ts
│       ├── terminal.client.ts
│       └── terminal.module.less
├── data/
│   └── portfolio.ts
├── layouts/
│   └── Base.astro
├── pages/
│   └── index.astro
└── styles/
    ├── global.less
    ├── reset.less
    └── variables.less
```

## Commands

- `npm install` installs dependencies
- `npm run dev` starts the local dev server
- `npm run build` builds the production site into `dist/`
- `npm run preview` previews the built site

## Content Updates

Edit `src/data/portfolio.ts` to update:

- profile summary
- startup commands
- skills and bar values
- projects and drill-down content
- contact links

## Notes

- the bundled font is loaded from `public/fonts/JetBrainsMono.woff2`
- `linkedin` and `email` are still placeholders until real values are added
