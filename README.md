# PROJECT 49 — Idea 01 / Light

A scroll-driven walkthrough of the first of seven architectural ideas. Scroll
moves a camera through the house: street, courtyard, living spaces, up the
stairs, and out onto the terrace at sunset.

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

Vercel auto-detects Vite. If it asks, the settings are:

| Setting          | Value           |
| ---------------- | --------------- |
| Framework preset | Vite            |
| Build command    | `npm run build` |
| Output directory | `dist`          |
| Install command  | `npm install`   |

No environment variables and no serverless functions — it deploys as a static
site.

## How the walkthrough works

`src/hooks/useWalkthrough.js` is the whole engine.

One fixed full-screen stage holds every space as a stacked layer. The only
element in normal flow is `.scroller`, whose height is what there is to scroll.
Scroll position maps to a position `p` along the route, and each layer's
opacity and scale come from its distance from `p`. Because the scale runs
continuously upward through each space, it reads as walking forward rather than
as slides changing. At most two layers are composited at once.

Two things in there are load-bearing, and both are easy to undo by accident:

- **Progress is a fraction of the scrollable range, not pixels per segment.**
  A viewport briefly measured at zero height (backgrounded tab, thumbnail
  capture) would otherwise send `p` past the end and hide every layer, leaving
  a black page.
- **`body` must not have `overflow-x`.** Setting it makes `<body>` the scroll
  container, and element scroll events do not bubble to `window`, so the
  scroll listener silently never fires and the walkthrough freezes on its
  first frame. `.stage` does the clipping instead.

Scroll values are written straight to the DOM through refs rather than React
state — at 60fps, state would re-render every space on every tick. Only the
active index is state, and it changes once per space.

## Adding a space

1. Drop two sizes into `public/spaces/` — `sNN-1920.jpg` and `sNN-1280.jpg`.
2. Add a row to `src/data/spaces.js`.

Order in that array is the order you walk. Consecutive rows sharing a
`movement` collapse into one stop on the route rail, so the rail follows from
the data with nothing else to update. `lqip` is a tiny inlined blur shown until
the full render decodes, so the stage is never black.

## Adding the other ideas

This covers one home under Idea 01. The structure is per-home: to add Air, Art,
Roots, Land, Silence or Water, add a data file alongside `spaces.js` and a
route to pick between them.
