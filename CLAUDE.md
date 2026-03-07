# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A static GitHub Pages site — a countdown timer to a yearly cider house ("sidreria") visit, with a 3-day weather forecast fetched from the AEMET (Spanish meteorological agency) API.

No build system, no package manager, no tests. Deploy by pushing to `main` (GitHub Pages serves directly from the branch).

## Development

Open `index.html` directly in a browser, or serve locally:

```bash
python3 -m http.server 8080
```

## Architecture

Single-page app with three files:

- **`index.html`** — Structure. Bootstrap 5.2.3 (vendored in `css/bootstrap-5.2.3-dist/`), custom font (Bebas Neue), countdown `#counter` div, weather `#infoclima` div.
- **`js/main.js`** — IIFE with two responsibilities:
  1. **Countdown**: `getEventDate()` computes the next occurrence of the target date (currently `May 2 at 14:00`). Runs a `setInterval` every second; on completion shows "Bon Sant Joan!" with a CSS flip animation.
  2. **Weather**: `get_data()` calls the AEMET two-step API — first fetches a metadata URL that returns a `datos` URL, then fetches actual forecast data for municipality code `20052` (Legorreta, Gipuzkoa). Displays 3 days of min/max temps and precipitation probability.
- **`css/main.css`** — Custom styles. Background image is loaded from an external URL.

## Environment Variable

The AEMET API key is read as `process.env.API_KEY` in `js/main.js` and must be injected at runtime or build time. The `.env.local` file (gitignored) holds the key locally.

## Updating the Event

To change the countdown target, edit `js/main.js:22` — the date string in `getEventDate()`:

```js
const candidate = new Date(`${year}-05-02T14:00`);
```
