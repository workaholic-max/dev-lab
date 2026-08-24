# PWA meta tags

*One of three sibling docs in this [`progressive-web-app`](README.md) entry — this one covers the `<head>` tags responsible for install presentation; see [`PLUGIN.md`](PLUGIN.md) for the build-time manifest & service-worker config, and [`SOCIAL-PREVIEW.md`](SOCIAL-PREVIEW.md) for the unrelated social-card tags that happen to live in the same file.*

The `<head>` tags a project has to hand-author so an installed progressive web app presents itself correctly — its own icon, its own title, a themed status bar and window — on iOS, Android, and Windows, in place of leaning on the build-generated `manifest.webmanifest` alone for every one of those details. Some of this a modern manifest genuinely does cover (name, theme color, display mode); some of it — iOS's status bar style being the clearest case — has no manifest field at all and exists only as one of these tags.

- **A themed, non-default iOS status bar** — `apple-mobile-web-app-capable` plus `apple-mobile-web-app-status-bar-style` are what get Safari to blend the status bar into the app once it's launched from the home screen; nothing in `manifest.webmanifest` reaches this, on any current iOS version.
- **An icon and title independent of the browser tab** — `apple-touch-icon` and `apple-mobile-web-app-title` are what iOS actually uses for the home-screen icon and the name under it, separate from the ordinary favicon `<link>` tags and separate from the manifest's own `name`.
- **The same presentation outside Safari** — `application-name` and `mobile-web-app-capable` carry the equivalent behavior to Windows/Edge tiles and to Android browsers that never read anything prefixed `apple-`.

## How it works

```html
<meta name="theme-color" content="#000000" />

<link rel="manifest" href="/manifest.webmanifest" />

<link rel="icon" href="/images/favicons/favicon.ico" />
<link rel="icon" type="image/png" sizes="32x32" href="/images/favicons/favicon-32x32.png" />
<link rel="icon" type="image/png" sizes="16x16" href="/images/favicons/favicon-16x16.png" />
<link rel="apple-touch-icon" sizes="180x180" href="/images/favicons/apple-touch-icon.png" />

<meta name="application-name" content="Dummy App" />
<meta name="mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
<meta name="apple-mobile-web-app-title" content="Dummy App" />
```

`theme-color` and the `manifest` link are the only two lines here that a generated manifest also expresses in its own way — this copy is what actually reaches plain browser chrome (an Android address bar, a pinned Windows tile) before or outside of an install, a separate moment from what the manifest's own `theme_color` controls once the app is installed. The three `favicon`/`icon` links are the ordinary tab-icon set any site needs regardless of PWA status; `apple-touch-icon` is the one iOS actually reads for its home-screen icon, and it has to be a real `<link>` tag — nothing in `manifest.webmanifest`'s `icons` array substitutes for it on iOS.

`apple-mobile-web-app-capable` is the tag that removes Safari's browser chrome once the app is launched from the home screen; without it, "Add to Home Screen" still creates an icon, but tapping it just opens a normal Safari tab with the address bar intact. `apple-mobile-web-app-status-bar-style` only does anything once that's set, and it's the one line here with no equivalent anywhere else — not in the manifest, not in another meta tag — which is exactly why it's the easiest one to forget.

`mobile-web-app-capable` and `application-name` exist because none of the `apple-*` tags above mean anything to a non-Safari browser: `mobile-web-app-capable` is the (now largely legacy, but still harmless to include) non-Apple equivalent of the capable flag, and `application-name` is what Windows/Edge reads for a pinned tile's label — the same job `apple-mobile-web-app-title` does for iOS.

## About: apple-mobile-web-app-status-bar-style

Three values, and they trade off differently. `default` renders a plain, light status bar and pushes page content below it. `black` does the same but dark. `black-translucent` is the one that actually lets the app's own content draw underneath the status bar instead of a solid bar sitting on top of it — which looks right for a full-bleed header, but only if the app itself then reserves that space with `env(safe-area-inset-top)` padding. Picking `black-translucent` without that padding is a common way to end up with real UI sitting underneath the status bar instead of blending with it.
