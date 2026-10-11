# Tap Talk

A calm, accessible AAC app: tap words to build a message, and Tap Talk says it out loud. It works offline, and speech uses the device's own voices, so nothing you say leaves the device.

## Run it

```sh
npm install
npm run dev
```

Then open the URL it prints. Other commands: `npm run build`, `npm test`.

## What's here

- **Talk board:** message bar, core words (Yes, No, Stop, More), five categories, and a fixed 3×3 tile grid.
- **Help:** emergency phrases that speak with one tap, and an alert that opens Messages ready to send to your emergency contacts, with your location.
- **Settings:** emergency contacts, custom tiles, speak on tap, high-visibility tiles, voice and speed, and saved phrases.

## Install it on a phone or tablet

Tap Talk is a web app you can add to your home screen. Once installed, it works with no internet connection.

- **iPhone or iPad (Safari):** tap Share, then **Add to Home Screen**.
- **Android (Chrome):** tap the menu, then **Install app** (or **Add to Home screen**).

The app needs to be served over HTTPS to install (for example, from GitHub Pages, Netlify or Vercel). Updates download in the background and apply the next time the app opens, so an update never interrupts a conversation.

Design rules and conventions live in [CLAUDE.md](CLAUDE.md).
