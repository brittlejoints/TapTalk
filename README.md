# Tap Talk

A calm, accessible AAC app: tap words to build a message, and Tap Talk says it out loud. It works offline, and speech uses the device's own voices, so nothing you say leaves the device.

## Run it

```sh
npm install
npm run dev
```

Then open the URL it prints. Other commands: `npm run build` (type-checks, then builds), `npm test`.

Your words, settings and contacts are stored only on the device. There are no accounts and no analytics.

## What's here

- **Talk board:** message bar (tap or type words), core words (Yes, No, Stop, More), five categories, and a fixed 3×3 tile grid that never scrolls or moves. It also works with a phone on its side.
- **Help:** emergency phrases that speak with one tap, and an alert that opens Messages ready to send to your emergency contacts, with your location. You always tap Send yourself; Tap Talk never sends anything.
- **Settings:** language (English and Spanish) and text size, emergency contacts, custom tiles (icon, emoji or photo), speak on tap, high-visibility tiles, playful touches, voice and speed, saved phrases, and app updates.

## Install it on a phone or tablet

Tap Talk is a web app you can add to your home screen. Once installed, it works with no internet connection.

- **iPhone or iPad (Safari):** tap Share, then **Add to Home Screen**.
- **Android (Chrome):** tap the menu, then **Install app** (or **Add to Home screen**).

The app needs to be served over HTTPS to install (for example, from GitHub Pages, Netlify or Vercel). Updates download in the background. When one is ready, Settings shows an **Update now** button; nothing reloads on its own, so an update never wipes a message in progress.

Design rules and conventions live in [CLAUDE.md](CLAUDE.md).
