/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  // Relative paths, so the app works from any folder (GitHub Pages serves it at /TapTalk/).
  base: './',
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      // Updates download in the background; the user applies them from Settings.
      // Never reload automatically: it would wipe a message mid-sentence.
      registerType: 'prompt',
      injectRegister: false,
      includeAssets: ['icons/apple-touch-icon.png', 'icons/icon.svg'],
      manifest: {
        name: 'Tap Talk',
        short_name: 'Tap Talk',
        description: 'Tap words to build a message, and Tap Talk says it out loud.',
        start_url: '.',
        scope: '.',
        display: 'standalone',
        orientation: 'any',
        background_color: '#fffefc',
        theme_color: '#fffefc',
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        // Everything the app needs to run with no connection. Only modern
        // woff2 fonts are cached; browsers never request the woff fallbacks.
        globPatterns: ['**/*.{js,css,html,woff2,png,svg}'],
        navigateFallback: 'index.html',
      },
    }),
  ],
  test: {
    environment: 'jsdom',
  },
});
