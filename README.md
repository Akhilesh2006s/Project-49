# PROJECT 49

A hub, not a scroll. **PROJECT 49** opens over the hero; scrolling lets the
wordmark go and brings the seven ideas up in its place — LIGHT · AIR · ART ·
ROOTS · EARTH · SILENCE · FUTURE — risen and enlarged into a list. Each idea
opens out of its own name into a run of film, one looping clip and one line
per chapter, and folds back to the list when the run is done.

All seven ideas are live. The experience uses fifteen distinct scene films,
with ROOTS intentionally reusing approved imagery to surface seventeen scene
entries across the seven idea journeys.

The visual system avoids generic whole-building sales renders. It uses owned,
resolved architectural thresholds, rooms and courtyards as well as atmospheric
fragments of light, material, air, water and shadow.

Vite + React, no other runtime dependencies.

## Running it

```bash
npm install
npm run dev
```

Build and check the production output locally:

```bash
npm run build
npm run preview
```

## Deploying to Vercel

Vercel auto-detects Vite. If it asks:

| Setting          | Value           |
| ---------------- | --------------- |
| Framework preset | Vite            |
| Build command    | `npm run build` |
| Output directory | `dist`          |
| Install command  | `npm install`   |

No environment variables, no serverless functions — a static site.

## How it moves

Everything lives in `src/hooks/useJourney.js`. Four modes:

- **intro** — the wordmark over the hero. Scroll is one screen's worth; the
  wordmark fades and lifts, the menu rises and scales into place behind it.
- **menu** — the seven, four across and three centred beneath. Clicking a
  name opens it.
- **collaboration** — a static footer credits Ayra × Anxa for architecture and
  digital experience. The older tab data remains in `src/data/collab.js` but is
  not rendered by the current interface.
- **idea** — the page's scroll now belongs to that idea's chapters. Past the
  last chapter there is a short tail of travel, and then it closes itself and
  puts you back on the list where you left it. `Esc` and CLOSE do the same
  from anywhere in the run.

Opening and closing is a FLIP: the panel is first placed on the exact rect of
the name you clicked — translated and scaled down to it — and then released to
full screen over 900ms, so it grows out of the word rather than appearing over
it. Closing runs the same path backwards. It is done synchronously with a
forced reflow, not `requestAnimationFrame`, so a tab that is backgrounded mid-
transition still lands in a coherent state.

Inside an idea the driver is the usual damped follow: the scroll fraction maps
to a position `p` across the chapters, each clip crossfades on `|p - i|`, and
its statement is fully out by the midpoint between chapters so two lines are
never up at once. The blur and darkening behind the type follow the statement
in, so the footage is only softened while there are words to read.

### Adding an idea

1. Drop the looped clips and posters in `public/scenes/`.
2. Add a scene per chapter to `src/data/scenes.js` with its `idea` set to the
   name — it will appear in that idea's run in array order, and the name
   becomes clickable on the menu.
3. Optionally draw a logotype and register it in `MARKS` in
   `src/data/opening.js`; it replaces the typeset name on both the menu and
   the concept title.

### The hero still

`public/opening/hero.jpg` (1920 wide) and `public/opening/hero-1280.jpg` sit
behind everything; the PNG masters live in `source/`. To swap:

```bash
ffmpeg -i source/your-hero.png -vf scale=1920:-2 -q:v 3 public/opening/hero.jpg
ffmpeg -i source/your-hero.png -vf scale=1280:-2 -q:v 4 public/opening/hero-1280.jpg
```

## September 2026 redesign

The page is now one scroll with the film experience on top of it:
opening → the equation (7 × 7 = 49) → the seven ideas (sticky preview +
list; opening one starts the film run) → the forty-nine (a 7 × 7 grid,
one row per idea, status per house) → how we build → Hyderabad → a private
conversation (contact form) → footer.

- `src/App.jsx` — the page sections. `src/Cinema.jsx` — the film experience.
- `src/data/houses.js` — the 49 houses. Edit `OVERRIDES` to set a house's
  status (`In design` · `Under construction` · `Built`) or give it a name.
- `src/data/contact.js` — fill `email` (or a form `endpoint`), `whatsapp`,
  `instagram`, and later the RERA line. The form appears once there is
  somewhere for it to go.
- Sound rules are unchanged: no sound on the home page, each film has its
  own bed, SILENCE is silent.
