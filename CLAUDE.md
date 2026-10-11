# Tap Talk

An AAC (augmentative and alternative communication) web app: people tap words and phrases, and the device speaks them. Users may have low vision, limited motor control, or be autistic, so accessibility rules below are product requirements, not polish.

## Commands

- `npm run dev`: start the dev server
- `npm run build`: type-check and build (run before committing)
- `npm test`: unit tests (Vitest)

## Structure

- `src/styles/index.css`: Greenhouse design tokens (`@theme`). The only place colors, fonts and radii are defined.
- `src/data/vocabulary.ts`: categories and words.
- `src/lib/`: React-free logic (message bar, storage, settings) plus `useSpeech`.
- `src/components/`: board pieces. `src/screens/`: one file per screen. `App.tsx` holds shared state.

## Design rules (Greenhouse)

- Use token classes only (`bg-sage`, `text-forest`, `rounded-tile`). Never raw hex, rgba or gradients in components.
- Forest (`#0f3e17`) is for headings, icons, primary actions and the selected tab. Tinted surfaces (keylime, mint, sage, slate) are backgrounds only, never text.
- Red (`help` tokens) appears only on the Help button and Help screen.
- No box-shadows. Depth comes from layered tints. Press feedback uses the `pressable` utility.
- Serif (`font-display`, weight 300) only at 26px and larger. Everything tappable uses the sans, 600 weight, 17px or larger on tiles.
- Radius: `rounded-tile` (14px) for tiles, cards and buttons; `rounded-full` for pills and tabs.
- Icons: `lucide-react` only. No emoji in UI.

## AAC rules

- The talk board never scrolls. Tiles stay in fixed positions (3x3), and empty slots stay empty rather than reflowing.
- Touch targets are at least 44px. Check layouts at 320x568 (iPhone SE) as well as 390x844.
- Never animate or scale selected states, and never use looping or pulsing animation.
- Focus styles use `:focus-visible` only.
- Never show a success message for something that didn't happen (for example, an alert that wasn't sent).
- The app must work offline: no runtime requests to font or icon CDNs. Storage can fail, so go through `src/lib/storage.ts`.
- Sentence case. Say "tap", not "click".
