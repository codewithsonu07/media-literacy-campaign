# Design: Sift It

The shared Hallmark system for the media-literacy learning site and its interactive tools.

## System

- Genre: editorial
- Styling: Tailwind CSS 4 utilities in components; `app/tokens.css` is the token source, and global CSS is reserved for browser-wide foundations.

Shapes: Feature Stack (/), Long Document (/learn), Split Studio (/checker), Workbench (/quiz)

- Theme: Ink, with the existing Sift It palette retained as brand material
- Axes: light/grotesk-sans/chromatic-teal; restrained posture
- Signature: live headline scanner and working forensic tools
- Chrome: masthead navigation and a dark statement footer
- Surfaces: paper-led and flat by default; glass is limited to the working tool surfaces where it separates the interface from its surroundings.

## Tokens

`app/tokens.css` is the source of truth. Existing green, lime, coral, and teal values are preserved in OKLCH and used as restrained brand signals.

```css
:root {
  --color-paper: oklch(96.45% 0.0093 113.2);
  --color-paper-2: oklch(98.92% 0.0054 117.9);
  --color-paper-3: oklch(94% 0.009 124);
  --color-ink: oklch(24.3% 0.0194 167.2);
  --color-ink-2: oklch(35% 0.018 162);
  --color-muted: oklch(54.4% 0.0171 157.9);
  --color-rule: oklch(89.04% 0.0137 134.9);
  --color-accent: oklch(51.96% 0.0697 181);
  --color-lime: oklch(91.27% 0.1739 117.7);
  --color-coral: oklch(64.82% 0.1766 30.3);
  --font-display: "Epilogue", ui-sans-serif, system-ui, sans-serif;
  --font-body: var(--font-display);
  --font-outlier: var(--font-geist-mono), ui-monospace, monospace;
  --radius-card: 12px;
  --radius-input: 10px;
  --radius-pill: 999px;
  --rule-hair: 1px;
  --shadow-card: none;
}
```

## Controls

- Primary: teal fill with paired paper text · 10px radius · 48px minimum height
- Secondary: transparent paper with a rule · same radius and height
- Dark workbench controls: paper text on dark green; lime marks selected examples
- Focus: instant 3px teal outline

## Motion

- Character: restrained; state transitions only; reduced-motion ends immediately.

## Exports

`app/tokens.css` in this project.
