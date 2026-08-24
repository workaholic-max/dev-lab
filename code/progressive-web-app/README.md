# Progressive web app

Everything a Vite-built app needs to behave like a well-presented, installable progressive web app: a build-time plugin that generates the manifest and service worker, plus the `<head>` tags a generated manifest can't express on its own — for platform presentation and for how a shared link previews — in place of hand-authoring each piece from scratch, or leaving them as separate, undocumented conventions that drift out of sync with each other over time.

## How it works

The three pieces here don't share a mechanism, which is why each is documented on its own rather than folded into one file: [`PLUGIN.md`](PLUGIN.md) runs at build time and produces real output files — `manifest.webmanifest`, the service worker — while [`META-TAGS.md`](META-TAGS.md) and [`SOCIAL-PREVIEW.md`](SOCIAL-PREVIEW.md) are static markup with no build step involved at all, hand-written once into `index.html` and left alone. What ties the three together is only that they all live in, or are produced for, the same build's `index.html` — not that they work the same way, so read whichever one below actually matches what you're trying to do.

## Files

- [`PLUGIN.md`](PLUGIN.md) — the `vite-plugin-pwa` config: what turns the build into an installable, offline-capable app through a generated manifest and a Workbox service worker.
- [`META-TAGS.md`](META-TAGS.md) — the `<head>` tags responsible for install presentation across iOS/Android/Windows — icon, title, themed status bar — that the generated manifest doesn't reach on its own.
- [`SOCIAL-PREVIEW.md`](SOCIAL-PREVIEW.md) — the Open Graph and Twitter Card tags that give a shared link its own preview card. Not PWA-specific — any site benefits from these — but kept here because they live in the same `index.html` `<head>` as the other two.
