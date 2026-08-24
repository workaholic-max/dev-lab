# PWA manifest & service worker

*One of three sibling docs in this [`progressive-web-app`](README.md) entry — this one covers the build-time manifest and service-worker config; see [`META-TAGS.md`](META-TAGS.md) for the install-presentation `<head>` tags and [`SOCIAL-PREVIEW.md`](SOCIAL-PREVIEW.md) for the social-card tags.*

A `vite-plugin-pwa` configuration that turns the built app into an installable, offline-capable progressive web app — a generated web manifest plus a Workbox-backed service worker that precaches the built app shell — in place of hand-authoring a manifest file and a service worker script from scratch.

- **Installable app shell** — the generated `manifest.webmanifest` (name, icons, `standalone` display) is what lets a browser or OS offer "install" / "add to home screen," instead of the app staying a bare browser tab with no home-screen icon or dedicated window.
- **App shell available offline** — the service worker Workbox generates precaches every build-output file matching `globPatterns` the moment it installs, so the shell keeps loading with no network instead of failing outright the instant connectivity drops.
- **Updates apply themselves** — a new deploy takes over every already-open tab on its own, instead of waiting for the user to close and reopen the app or interrupting them with an update prompt.

## How it works

The plugin is [`vite-plugin-pwa`](https://www.npmjs.com/package/vite-plugin-pwa) from npm — `^1.2.0` at the time of writing, paired with Vite 7. Its config shape has shifted across major versions before, so check the package's own changelog against anything much older or newer rather than assuming the object below still matches exactly. It runs at build time, driven entirely by its own config object — `configuration/vite/plugins/pwa.js` in this project, wired into `vite.config.ts` alongside the app's other Vite plugins. `name` / `short_name` / `description` and the theme colors below are dummy placeholders standing in for whatever a specific project actually brands itself as; the favicon and icon paths, and everything below `workbox`, are the real shape a config like this needs:

```ts
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

// Import `vite-plugin-pwa` with `require`, not ESM `import` — importing it the
// normal way breaks IDE (WebStorm) alias resolution across the rest of the
// project. The build itself works fine either way; this is purely an IDE
// workaround, and worth dropping the moment that resolution bug is fixed upstream.
const { VitePWA } = require('vite-plugin-pwa');

export const pwaPlugin = () =>
    VitePWA({
        registerType: 'autoUpdate',
        injectRegister: 'auto',

        includeAssets: [
            'images/favicons/favicon.ico',
            'images/favicons/favicon-16x16.png',
            'images/favicons/favicon-32x32.png',
            'images/favicons/apple-touch-icon.png',
        ],

        manifest: {
            id: '/',
            name: 'Dummy App',
            short_name: 'Dummy App',
            description: 'Dummy description of what this app does and why it is installable.',
            theme_color: '#000000',
            background_color: '#ffffff',
            display: 'standalone',
            display_override: ['standalone', 'minimal-ui'],
            scope: '/',
            start_url: '/',
            icons: [
                {
                    src: '/images/icons/icon-192x192.png',
                    sizes: '192x192',
                    type: 'image/png',
                },
                {
                    src: '/images/icons/icon-512x512.png',
                    sizes: '512x512',
                    type: 'image/png',
                },
                {
                    src: '/images/icons/icon-192x192.png',
                    sizes: '192x192',
                    type: 'image/png',
                    purpose: 'maskable',
                },
                {
                    src: '/images/icons/icon-512x512.png',
                    sizes: '512x512',
                    type: 'image/png',
                    purpose: 'maskable',
                },
            ],
        },

        workbox: {
            globPatterns: ['**/*.{html,css,js,ico,woff2,png,svg}'],
            globIgnores: ['**/vendor/**'],
            cleanupOutdatedCaches: true,
            clientsClaim: true,
            skipWaiting: true,
        },

        devOptions: {
            enabled: false,
        },
    });
```

`manifest` is the source of truth for `manifest.webmanifest`, generated fresh on every build rather than hand-maintained as a static file: `name` / `short_name` / `description` and `theme_color` / `background_color` control how the installed app presents itself, `display: 'standalone'` — with `minimal-ui` as the `display_override` fallback — is what actually makes it open in its own window instead of a browser tab, and the `icons` list covers both a plain and a `maskable` variant at 192 and 512px. The `maskable` pair exists because Android adaptively crops and masks home-screen icons into different shapes, and an icon with no safe-zone-aware maskable variant gets cropped unpredictably instead of rendering as designed. `includeAssets` sits outside the manifest for a reason: the favicons it lists are real files the built `index.html` links to directly (`<link rel="icon">`, `apple-touch-icon`) but that nothing in the JS/CSS build graph ever imports, so without listing them here Workbox has no way to know they exist and they'd be missing from the precache the moment the app runs offline.

`workbox.globPatterns` is what actually decides what gets precached — every build-output file matching one of those extensions is fetched and cached the moment the service worker installs, which is what "available offline" means concretely here: not a proxy deciding per-request whether to hit the network, but a fixed manifest of files fetched once upfront. `cleanupOutdatedCaches: true` deletes the previous version's precache the moment a new one activates, so that cache doesn't grow with every deploy. `devOptions.enabled: false` keeps all of this — the generated service worker included — out of the dev server entirely; it only exists in a production build, so local iteration never has a stale worker serving cached assets underneath it.

## Pairs with

- [`ensure-service-worker-activated`](../ensure-service-worker-activated) — `autoUpdate` plus `skipWaiting` / `clientsClaim` is exactly the scenario that entry exists for: because a new worker can take over an already-open tab mid-session with no prompt, the app needs something that notices a `controllerchange` firing after the fact and forces a reload, rather than continuing to run a frontend build that may no longer match the API contract the now-active service worker's cached assets were built against.
- [`pull-to-refresh`](../pull-to-refresh) — `display: 'standalone'` in the manifest above is what actually puts an iOS home-screen install into the standalone mode that drops Safari's native pull-to-refresh gesture; that entry is the hand-rolled replacement for the one this configuration takes away.
