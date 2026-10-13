# Tap Talk

An AAC (augmentative and alternative communication) web app: people tap words and phrases, and the device speaks them. Users may have low vision, limited motor control, or be autistic, so accessibility rules below are product requirements, not polish.

## Commands

- `npm run dev`: start the dev server
- `npm run build`: type-check and build (run before committing)
- `npm test`: unit tests (Vitest)

## Structure

- `src/styles/index.css`: Greenhouse design tokens (`@theme`). The only place colors, fonts and radii are defined.
- `src/data/vocabulary.ts`: categories and words. `src/data/colors.ts` and `src/data/icons.ts`: what custom tiles can use (stored by id).
- Custom tiles: `src/lib/customTiles.ts` (validated, stored locally; photos resized by `src/lib/image.ts`), edited in `src/screens/TileEditorScreen.tsx`.
- `src/lib/`: React-free logic (message bar, storage, settings) plus `useSpeech`.
- `src/components/`: board pieces. `src/screens/`: one file per screen. `App.tsx` holds shared state.

## Design rules (Greenhouse)

- Use token classes only (`bg-sage`, `text-forest`, `rounded-tile`). Never raw hex, rgba or gradients in components.
- Forest (`#0f3e17`) is for headings, icons, primary actions and the selected tab. Tinted surfaces (keylime, mint, sage, slate) are backgrounds only, never text.
- Red (`help` tokens) appears only on the Help button and Help screen.
- Tiles use the light tile palette (`bg-tile-keylime`, `-mint`, `-sea`, `-mist`, `-lilac`, `-butter`, `-peach`, `-sand`) via `src/data/colors.ts`, plus the `tile-edge` hairline so they stay visible on cream. Never add pink or red tile colors.
- Category defaults follow the Fitzgerald Key where it fits: People butter, Needs peach, Feelings mist, Medical lilac, Saved keylime.
- No box-shadows for elevation. Depth comes from layered tints. Press feedback uses the `pressable` utility.
- Serif (`font-display`, weight 300) only at 26px and larger. Everything tappable uses the sans, 600 weight, 17px or larger on tiles.
- Radius: `rounded-tile` (14px) for tiles, cards and buttons; `rounded-full` for pills and tabs.
- Icons: `lucide-react` only. No emoji in UI chrome; emoji appear only as pictures users choose for custom tiles (`src/data/emoji.ts`, drawn with the device's emoji font via the `.emoji` class).
- Custom tile pictures: icons by id (`src/data/icons.ts`, grouped in `ICON_GROUPS`; never rename or remove an id), emoji, or a resized photo. Keep every icon in exactly one group (tested).
- Logo: `src/components/Wordmark.tsx`, a hand-drawn SVG (one 11-unit rounded stroke; the "l" is the icon's sound bars). Never replace it with live text, and keep its grid (see the component comment) if you edit it.
- Illustrations: `src/components/illustrations/`. Each is a flat SVG on a `0 0 112 112` viewBox, fills with `--color-tile-*` tints, strokes with `--color-forest` at `strokeWidth="2"`–`2.5"`. Keep the botanical/garden vocabulary (sprout, pot, fern, bubbles). Growing parts use the shared `.grow-stem`, `.grow-leaf.left/.right`, `.fern-leaf`, `.sparkle` classes so they animate in once, only when `.playful` is on and reduced motion is off. Empty states on the board (`Pot`), the "My words" page (`Fern`), the no-contacts prompt (`TwoBubbles`) the error screen (`TippedPot`), Settings' empty "Your tiles" (`SeedPacket`), the "no speech on this device" message (`QuietBubble`) and the app update or ready-offline notice (`WateringCan`) each pair one illustration with a one-sentence serif heading and a shorter sans hint.

## AAC rules

- The talk board never scrolls. Tiles stay in fixed positions (3x3), and empty slots stay empty rather than reflowing. Each category has 8 built-in words; slot 9 is always navigation ("My words", then "More"/"Back" on the user's own pages), so custom tiles never move built-in words (`src/lib/boardPages.ts`).
- Touch targets are at least 44px. Check layouts at 320x568 (iPhone SE) as well as 390x844.
- Never animate or scale selected states, and never use looping or pulsing animation.
- The message bar has a fixed height (it scrolls internally) so a long message never moves the tiles. Typing goes into a draft owned by `BoardScreen`; it becomes words on Enter, Speak or a tile tap, and the caret always stays at the end.
- Playful touches (CSS in `index.css`, JS in `src/lib/delight.ts`) must confirm a user action, play once, and run only when `.playful` is set and reduced motion is off.
- Focus styles use `:focus-visible` only.
- Never show a success message for something that didn't happen (for example, an alert that wasn't sent).
- The app must work offline: no runtime requests to font or icon CDNs. Storage can fail, so go through `src/lib/storage.ts`.
- Sentence case. Say "tap", not "click".
- Emergency alerts open the Messages app via an `sms:` link (`src/lib/alert.ts`); the user taps Send. Copy must say so and never claim an alert was sent.
- Any crash renders `src/components/ErrorBoundary.tsx` instead of a blank screen; the whole app is wrapped in it.
- Greeting (`src/lib/greeting.ts`): shows "Good morning/afternoon/evening" with the user's name on welcome, and once per day as the empty-bar placeholder on the board.
- Translations live in `src/data/strings.ts` (one block per language) and are consumed through `useI18n()`. Built-in tiles use keys; user content (custom tiles, saved phrases) stays untouched when language changes. Add a language by copying the English block and translating every value — never rename or remove keys.
- Text size: `settings.textSize` sets `size-large`/`size-x-large` on `<html>`. Tiles (`.text-tile`, `.phrase-tile-label`), the message bar (`.message-chip`) and the core row (`.core-label`) scale; the fixed 3x3 grid does not.
- Long words must never be cut off: tile, Help-tile and tab labels use `FitText`, which shrinks the font (never below its floor) until the whole word fits. Do not rely on `break-words` or ellipsis for tile labels. Anything tappable is at least 44px in both directions, including chips in pickers.
- Category tabs show `tabs` strings (short names, e.g. Spanish "Frases", "Cosas", "Siento"); the full `categories` name is the tab's aria-label and is used everywhere else. Every language needs a `tabs` block, each name short enough to fit a fifth of 320px.
- Message bar in compact mode (under 360px wide, or extra-large text; the `compact:` variant in `index.css`): Save and Clear fold into a "More actions" tray (`MessageBar.tsx`) so the words keep room; Delete and Speak stay one tap. Otherwise Save and Clear stay inline.
- Help, Settings and the tile editor are history entries (`open()` and `back()` in `App.tsx`), so the phone's Back button or swipe goes back one screen instead of leaving the app. Use `open()` to go to a screen and `back()` to leave it; only the board is the root.
- Backup (`src/lib/backup.ts`, `BackupSection.tsx`): one versioned JSON file with settings (minus the device voice), custom tiles, saved phrases and contacts. Restore validates every entry with the same parsers the app uses to load storage, always asks before replacing, and only says "restored" if every save succeeded. Bump `BACKUP_VERSION` if the shape changes; newer files are refused, never half-read.
- Nothing is dropped silently. A word that doesn't fit the 12-word message, or a new phrase when Saved holds 9, is refused with a short on-screen notice (`notice` on `MessageBar`) and a screen-reader status. `savePhrase` never pushes an old phrase out.
- Every user-visible string on the board, Help and Settings comes from `src/data/strings.ts` in both languages, including the whole Help screen. This includes the tile editor, picture picker, contact form and crash screen (which reads the saved language itself, since it sits outside the provider). Validation helpers in `src/lib` return codes (e.g. `phoneProblem`, photo errors), never sentences; the screen translates them. Known gap: emoji and icon search keywords and the emoji/icon cell names are English only, so the search boxes say so.
- Short screens (a phone on its side, under 500px tall) use the `short:` variant: the board and Help move the tiles to a right-hand column, and the message bar goes compact. Tiles must stay at least 44px tall there; check 568x320 and 667x375.
- The welcome pill shows a tiny sun, sunrise or moon (`DayGlyph`) chosen by `periodFor()` in `src/lib/greeting.ts`; use that helper instead of re-deriving morning/afternoon/evening.
- `useSpeech` takes a `language` and prefers a matching voice, so Spanish words are read with a Spanish voice.

## Installable app (PWA)

- Configured in `vite.config.ts` with `vite-plugin-pwa`. Icons live in `public/icons/` (source: `icon.svg`).
- `registerType: 'prompt'` is deliberate: never auto-reload, because it would wipe a message mid-sentence. `useRegisterSW` in `App.tsx` (so `injectRegister` is `false`) feeds an "App" section in Settings: "ready offline" once after first install, and "A fresh version is ready" with an Update now button the user taps. Never show update UI over the board.
- Everything must work offline. Bundle new assets locally and keep them inside the precache `globPatterns`.
