# Terminal Portfolio

Single-page portfolio built with Astro and styled as an interactive terminal.

## Stack

- Astro
- TypeScript
- LESS
- self-hosted JetBrains Mono font

## Features

- terminal UI with macOS-style window decorations
- startup sequence that pre-renders `whoami`, `skills --list`, `projects --public`, and `contact`
- command input with history, tab autocomplete, clickable commands, and `clear`
- EN/UA locale toggle in the header that retranslates existing terminal output
- content managed from `src/data/portfolio.ts` with shared locale helpers in `src/data/i18n.ts`
- mobile-friendly layout with inline terminal prompt

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
│   ├── formatters.ts
│   ├── i18n.ts
│   ├── portfolio.ts
│   └── types.ts
├── layouts/
│   └── Base.astro
├── pages/
│   ├── 404.astro
│   ├── index.astro
│   └── robots.txt.ts
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

Localized text can be stored as plain strings or `{ en, ua }` objects. Commands stay in English; only the displayed content is translated.

## Notes

- set `siteUrl` in `src/data/seo.ts` when you know the production domain to enable canonical and full social URL metadata

## License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.
