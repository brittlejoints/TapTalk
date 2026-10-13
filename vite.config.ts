/// <reference types="vitest/config" />
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';

/**
 * Content-Security-Policy for the published app: it may only load its own files,
 * plus photo and icon images made on the device (data: and blob: URLs). Nothing
 * can be fetched from or sent to another site, which backs up PRIVACY.md.
 * Build only: the dev server needs an inline script that this would block.
 */
const CSP = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  "connect-src 'self'",
  "worker-src 'self'",
  "manifest-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'none'",
].join('; ');

const contentSecurityPolicy: Plugin = {
  name: 'content-security-policy',
  apply: 'build',
  transformIndexHtml: () => [{ tag: 'meta', attrs: { 'http-equiv': 'Content-Security-Policy', content: CSP }, injectTo: 'head-prepend' }],
};

export default defineConfig({
  // Relative paths, so the app works from any folder (GitHub Pages serves it at /TapTalk/).
  base: './',
  plugins: [
    contentSecurityPolicy,
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
