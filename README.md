# PROJECT 49

A scroll-driven sequence. The opening travels sideways; the chapters that
follow travel down. Each chapter is one looping clip and one line.

Two of the seven ideas are built: **01 / LIGHT** (three chapters) and
**02 / AIR** (two).

Deliberately **not** architectural renders. Showing a finished building anchors
a buyer to that building — the concept being sold here is light, hour and
shadow, so the backgrounds stay abstract.

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

## Two axes

The page deliberately changes direction once.

**The opening moves sideways.** Two full-width panels sit on a fixed rail that
the driver translates one viewport width at a time: the opening composition —
wordmark, line, and all seven names together on the dark hero — then the
**01 / LIGHT** card it travels into. The hero pans slower than the rail (7vw
against 100vw); that difference is the only depth cue, and it is what keeps
the opening from reading as slides.

**The chapters move down.** Once the rail is off screen the clips take over,
each rising as you pass it — `translateY` swings from about +3.5% to −3.5%
while the crossfade runs. The scale ramp stays ahead of that shift (starting
at 1.08, i.e. 4% headroom a side) so a moved clip can never expose an edge.

A chapter line is multiplied by `(1 - openingText)`, so the centre of the
screen is never contested — the opening panel clears before the first line
arrives, even though their curves overlap.

The seven names settle in on load with a CSS stagger; they are not tied to
scroll, because they are part of the opening composition rather than a beat
of their own.

### The hero still

`public/opening/hero.jpg` (1920 wide) and `public/opening/hero-1280.jpg` drive
the opening; the PNG masters live in `source/`. `HERO.tone` in
`src/data/opening.js` says whether that image is `'light'` or `'dark'`, and the
opening inverts wholesale to suit — ink on paper with pools of light, or ivory
over pools of shade. Set it when you swap the image; nothing else changes.

To swap:

```bash
ffmpeg -i source/your-hero.png -vf scale=1920:-2 -q:v 3 public/opening/hero.jpg
ffmpeg -i source/your-hero.png -vf scale=1280:-2 -q:v 4 public/opening/hero-1280.jpg
```

### Idea cards

`CARDS` in `src/data/scenes.js` announces a new idea mid-run. Each card's `at`
sits on a **half** unit of scene-space, which is the midpoint of a crossfade —
two clips dissolving, no chapter line up. The break lands in a gap the sequence
already has, so no extra scroll has to be invented for it, and the card takes
the centre from the lines while it is there. Idea 01 has no card: the
horizontal opening already delivers it.

## How a scene works

`src/hooks/useSequence.js` is the whole engine — it drives the opening and the chapters off one continuous `p`.

One fixed full-screen stage holds every clip as a stacked layer. The only
element in normal flow is `.scroller`, whose height is what there is to scroll.
Scroll position maps to a position `p` along the sequence, and each layer's
opacity comes from its distance from `p`.

The rhythm inside a scene is the point:

1. You arrive on a sharp, moving clip.
2. The line fades up, and the background blurs and darkens behind it.
3. As you scroll on, the line clears and the blur and darkening release — so
   the crossfade between two clips always happens while both are sharp and
   untexted.

Only clips currently on screen are playing; the rest are paused.

## Things in here that are load-bearing

Each of these was a real bug, and each is easy to reintroduce.

- **`body` must not have `overflow-x`.** It makes `<body>` the scroll
  container, and element scroll events do not bubble to `window`, so the
  scroll listener silently never fires and the sequence freezes on scene one.
  `.stage` does the clipping instead.
- **Progress is a fraction of the scrollable range, not pixels per segment.**
  A viewport briefly measured at zero height would otherwise send `p` past the
  end and hide every layer, leaving a black page.
- **The rAF latch is cleared on `visibilitychange`.** `onScroll` sets a
  `queued` flag and waits for `requestAnimationFrame`. A backgrounded tab
  starves rAF, so a scroll that lands while hidden leaves the flag stuck true
  and every later scroll is dropped.
- **The measure lives on `.line-text`, not `.line`.** `ch` resolves against the
  element's own font; on the wrapper it is still 16px Inter, which produced a
  ~220px column and broke every line into four rows.
- **`.veil-dark`'s centre alpha is set by measurement.** At 0.74 the shadow
  clip's sunlit wall sat at 2.99:1 against ivory. 0.80 puts every clip above
  the 3:1 large-text minimum. If you swap a clip for a brighter one, re-check
  it rather than trusting the number.
- **Small gold over video has to be `--gold-pale`.** `--gold` measured
  1.65–1.96:1 on the eyebrow labels across all five clips, and `--gold-lift`
  only reached ~2.5. `#ebdcc0` clears 3:1 and still reads warm. The darker
  golds are fine over the scrimmed hero, but not over footage.

## Adding a scene

1. Put the clip and a poster frame in `public/scenes/`.
2. Add a row to `src/data/scenes.js`.

Order in that array is the order you scroll.

### Preparing a clip

Source clips from an image/video generator generally do **not** loop — ours
were 13–15 dB end-to-start, which reads as a visible jump every few seconds.
Baking a ping-pong (forward, then reverse minus the duplicated boundary
frames) makes any clip loop by construction, and took ours to 38–42 dB:

```bash
ffmpeg -i in.mp4 \
  -filter_complex "[0:v]split[a][b];[b]reverse,trim=start_frame=1:end_frame=95,setpts=PTS-STARTPTS[r];[a][r]concat=n=2:v=1[v]" \
  -map "[v]" -an -c:v libx264 -preset slow -crf 24 -pix_fmt yuv420p \
  -movflags +faststart -profile:v main -level 4.0 out.mp4
```

`trim`'s frame numbers assume a 96-frame source; adjust to `n-1` for other
lengths. `-an` matters — an audio track blocks muted autoplay on some
browsers.

### On connecting frames

True match-cuts between clips need each clip generated **from the previous
one's final frame**. Independently generated clips do not join: measured
end-to-start across ours, every cross-pairing sat around 10 dB where a seamless
cut needs roughly 30. They are crossfaded instead, which reads fine — but if
you want real match-cuts, they have to be commissioned as a chain.

## Adding the other ideas

ART, ROOTS, EARTH, SILENCE and FUTURE follow the same two steps AIR did:

1. Append the clips to `SCENES` with their `idea` set.
2. Add a `CARDS` entry at the half unit where the new idea begins — that is
   `(index of its first scene) - 0.5` in scene-space.

The masthead reads the current idea off the active scene and numbers it by
order of first appearance, so it needs no updating.

Measured contrast for every new clip before shipping it — the check that
matters is ivory and `--gold-pale` against the brightest 2% of the band the
text occupies, under the 0.80 veil.
