---
name: Okkarhys Noir Intelligence
colors:
  background: '#030405'
  background-deep: '#000000'
  surface-lowest: '#070809'
  surface-low: '#0D0F11'
  surface: '#171A1E'
  surface-high: '#1D2125'
  surface-highest: '#252A2F'
  on-surface: '#E9EBED'
  on-surface-soft: '#C9CDD1'
  on-surface-muted: '#AEB4BA'
  on-surface-dim: '#777D85'
  outline: '#30363D'
  outline-strong: '#56636F'
  primary: '#56636F'
  on-primary: '#F4F5F6'
  primary-container: '#252C33'
  on-primary-container: '#D9DBDE'
  secondary: '#52565A'
  on-secondary: '#F4F5F6'
  secondary-container: '#1D2228'
  on-secondary-container: '#C9CDD1'
  tertiary: '#4B555D'
  on-tertiary: '#F4F5F6'
  focus-ring: '#AEB4BA'
  error: '#EF4444'
  warning: '#F59E0B'
  success: '#22C55E'
typography:
  display-xl:
    fontFamily: Plus Jakarta Sans
    fontSize: clamp(36px, 7.2vw, 128px)
    fontWeight: '700'
    lineHeight: '1.05'
    letterSpacing: '-0.03em'
  heading-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: clamp(30px, 5.4vw, 68px)
    fontWeight: '700'
    lineHeight: '1.08'
    letterSpacing: '-0.02em'
  heading-md:
    fontFamily: Plus Jakarta Sans
    fontSize: clamp(24px, 4vw, 38px)
    fontWeight: '700'
    lineHeight: '1.05'
    letterSpacing: '-0.01em'
  body-base:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.65'
    letterSpacing: '0'
  body-small:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.55'
    letterSpacing: '0'
  label-caps:
    fontFamily: ui-monospace
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1.4'
    letterSpacing: '0.14em'
rounded:
  sm: 8px
  md: 12px
  lg: 18px
  xl: 24px
  full: 999px
spacing:
  unit: 4px
  xs: 8px
  sm: 12px
  md: 20px
  lg: 28px
  xl: 40px
  section: clamp(56px, 9vw, 120px)
  gutter: clamp(18px, 4vw, 32px)
  maxWidth: 1240px
---

# Okkarhys Noir Intelligence Design System

## 1. Visual Theme & Atmosphere

Okkarhys is a **noir problem-solver brand**: mysterious without becoming vague,
intelligent without becoming sterile, and handsome without ornamental excess.
The atmosphere should feel like an advanced detective workspace at night: quiet,
precise, controlled, and capable.

Black is the environment, not a single flat paint. Depth comes from closely
related charcoal, graphite, steel, ash, oil, and obsidian layers. Silver light
reveals hierarchy. There is no pink, magenta, neon-purple, or candy gradient.
Colorful surfaces are inappropriate unless they communicate a real state such as
success, warning, or error.

The Aurora is a restrained noir phenomenon. It uses translucent Carbon, Steel,
Ash, and Obsidian curtains over near-black. It must remain behind the content,
never lower text contrast, and never resemble a colorful northern-lights effect.

## 2. Color Palette & Roles

### Semantic roles

- **Void / Midnight 0-3:** page background and deepest negative space.
- **Carbon / Graphite 2-6:** cards, navigation, inputs, modals, and panels.
- **Slate / Steel 4-9:** focus, selected states, links, controlled highlights.
- **Ash 5-9:** borders, quiet separators, disabled states, subtle sheen.
- **Smoke 3-7:** rare warm-neutral depth; never let it read brown or pink.
- **Oil / Obsidian 3-9:** Aurora layers, elevated dark surfaces, illustration fields.
- **#E9EBED:** primary text. **#C9CDD1:** strong secondary text and silver accents.
- **#AEB4BA:** supporting copy. **#777D85:** metadata and tertiary labels.
- Status colors are functional exceptions only; they are never decorative brand accents.

### The complete 100-color noir matrix

Each family contains ten ordered tones. Use neighboring tones to build depth;
do not attempt to display all 100 colors in one component.

| Level | Void | Midnight | Carbon | Graphite | Slate | Steel | Ash | Smoke | Oil | Obsidian |
|---:|---|---|---|---|---|---|---|---|---|---|
| 0 | `#030303` | `#030405` | `#050506` | `#060708` | `#050709` | `#070809` | `#080808` | `#080706` | `#040506` | `#050608` |
| 1 | `#060606` | `#06080A` | `#090A0B` | `#0A0C0E` | `#0A0E12` | `#0C0F12` | `#0D0D0E` | `#0D0C0B` | `#080A0C` | `#0A0C0F` |
| 2 | `#0A0A0A` | `#0A0D10` | `#0D0F11` | `#0F1214` | `#10151A` | `#12161A` | `#121314` | `#13110F` | `#0D1013` | `#101317` |
| 3 | `#0E0E0E` | `#0E1216` | `#121416` | `#15181B` | `#171D23` | `#181D22` | `#18191B` | `#191714` | `#12171B` | `#161A1F` |
| 4 | `#121212` | `#13181D` | `#171A1D` | `#1B1F23` | `#1E252C` | `#20262C` | `#1F2022` | `#201D19` | `#182024` | `#1D2228` |
| 5 | `#161616` | `#192026` | `#1D2125` | `#22272B` | `#263039` | `#283038` | `#26282A` | `#29251F` | `#20292E` | `#252C33` |
| 6 | `#1B1B1B` | `#202830` | `#24292E` | `#2A3035` | `#303B45` | `#323B44` | `#2F3134` | `#332E27` | `#29333A` | `#2E363E` |
| 7 | `#202020` | `#28323B` | `#2C3339` | `#343B41` | `#3A4651` | `#3D4751` | `#393C3F` | `#3F3930` | `#333F47` | `#39424B` |
| 8 | `#282828` | `#323E48` | `#374047` | `#3F474E` | `#46535F` | `#495560` | `#45484C` | `#4C453A` | `#3F4C55` | `#454F59` |
| 9 | `#303030` | `#3D4A56` | `#434D55` | `#4B555D` | `#53616E` | `#56636F` | `#52565A` | `#5A5145` | `#4C5A64` | `#52606B` |

### Contrast discipline

Primary reading text stays silver-white against Void or Midnight. Metadata may
use muted silver but must remain legible. Borders should usually be white at
6-12% opacity or a neighboring solid noir tone. Never use color alone to convey
state; pair it with a label or icon.

## 3. Typography Rules

**Plus Jakarta Sans** is the public and admin interface family, loaded locally
at weights 400, 500, 600, 700, and 800. Large headings are bold, tightly tracked,
and balanced across lines. Body copy is calmer and uses generous line height.

Use a system monospace stack for uppercase kickers, categories, indices, and
technical metadata. Keep these labels small with 0.12-0.18em tracking. The blog
card headline may use Georgia as an editorial exception; do not spread this
serif treatment across the core product UI. The logo wordmark uses Archivo Black
or Arial Black as a fallback and is not a general heading style.

## 4. Component Stylings

### Header and navigation

Use a fixed, black 72px desktop header and 56px mobile header with a restrained
1px divider. Active navigation is a dark pill with a silver outline. Mobile
navigation becomes a full-viewport index rather than a compressed desktop row.

### Buttons and chips

Buttons are compact pills with solid charcoal fill, silver text, and subtle
one-pixel borders. Hover raises the control by no more than 1px and slightly
brightens the surface. Avoid luminous glows. Focus must be visible with a silver
ring. Mobile primary buttons expand to full width.

### Cards

Cards use 14-18px radii, 1px quiet borders, and adjacent noir tones for
separation. Hover may rise 2px. Shadows are black ambient depth, not colored
glow. Blog art uses a unique line icon for each post on a distinct dark surface;
icons must not repeat within the rendered collection.

### Inputs

Inputs are 44px high on desktop, never smaller than 38px on mobile, with a 12px
radius and Carbon background. Keep mobile text at a zoom-safe size. Focus uses
Steel, not pink or cyan.

### Logo and iconography

The Okkarhys symbol contains a ten-stop noir gradient. Preserve its exact
geometry; the diagonal tail must join precisely. Interface icons are thin,
geometric Lucide line icons, normally 1.35-2px stroke. The favicon uses a white
background so the dark mark remains visible at small sizes.

### Aurora backdrop

Desktop may render Canvas curtains and filaments at roughly 30fps. Touch or
mobile devices use the lighter CSS fallback. Pause nonessential motion while
scrolling and honor `prefers-reduced-motion`. The Aurora is always decorative,
non-interactive, fixed behind content, and composed only from the noir matrix.

## 5. Layout Principles

The public content wrapper is fluid up to **1240px**, centered with a responsive
18-32px gutter and safe-area support. Section spacing scales from 56px to 120px.
Long reading copy stays near **68ch**. Use a 4px baseline rhythm with practical
steps of 8, 12, 20, 28, and 40px.

Primary responsive breakpoints:

- **1100px:** reduce five-column process grids.
- **900px:** switch desktop navigation and complex two-column layouts.
- **820/720px:** simplify grids, section spacing, and detail layouts.
- **640/560px:** mobile controls, smaller header, and tighter card rhythm.
- **480/420px:** single-column content and compact typography.

Never solve a dense mobile layout by shrinking text below readable sizes.
Reflow, stack, or allow controlled horizontal scrolling for category rails.

## 6. Design System Notes for Stitch Generation

When generating an Okkarhys screen in Stitch, use this direction:

> Create a cinematic noir interface for Okkarhys, an intelligent digital
> problem solver. Use layered near-black Carbon, Graphite, Steel, Ash, Oil, and
> Obsidian surfaces with silver typography. The result should feel mysterious,
> exact, technically capable, and handsome. Use restrained geometric line icons,
> thin borders, confident whitespace, balanced large headings, and subtle dark
> Aurora depth. Do not use pink, magenta, purple, neon colors, colorful gradients,
> excessive glow, playful illustration, or generic startup-blue UI.

For every generated screen:

1. Start with the semantic tokens in the frontmatter.
2. Choose only 3-6 neighboring noir tones per section; the 100-color matrix is a
   vocabulary, not a requirement to show all colors simultaneously.
3. Preserve high contrast and clear action hierarchy.
4. Keep layout compatible with the existing React/Vite structure and reusable
   CSS class architecture.
5. Provide desktop and mobile states, plus reduced-motion behavior for animation.
6. Treat source uploads and external generation as an explicit, separate action;
   this local design document alone does not authorize either.
