# Social preview meta tags

*One of three sibling docs in this [`progressive-web-app`](README.md) entry. Unlike [`PLUGIN.md`](PLUGIN.md) and [`META-TAGS.md`](META-TAGS.md), nothing here is actually PWA-specific — these tags matter for any shared link, installable or not — they're kept in this entry because they live in the same `index.html` `<head>` block the rest of this entry documents.*

The Open Graph and Twitter Card `<head>` tags that give a shared link its own preview card — a title, an image, a description — when it's pasted into Slack, iMessage, LinkedIn, or X, in place of the bare title-and-URL line a scraper falls back to rendering when none of these tags exist.

- **A real card instead of a bare link** — `og:title`, `og:description`, and `og:image` (plus its `type`/`width`/`height`/`alt`) are what Slack's, iMessage's, and LinkedIn's unfurlers actually read to build a preview card; skip them and the same link renders as plain text with nothing but the raw URL.
- **X gets its own explicit copy instead of a fallback** — `twitter:card` plus `twitter:title`/`twitter:description`/`twitter:image` mean X's scraper doesn't have to fall back to interpreting the Open Graph tags above, which it doesn't do reliably for every field.

## How it works

```html
<meta property="og:title" content="Dummy App — one line describing what it does" />
<meta property="og:type" content="website" />
<meta property="og:locale" content="en_US" />
<meta property="og:url" content="https://example.com/" />
<meta property="og:image" content="https://example.com/images/og/social-preview.png" />
<meta property="og:image:type" content="image/png" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:image:alt" content="Dummy App" />
<meta property="og:description" content="A longer description of what the app does and why it's worth clicking through." />

<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="Dummy App — one line describing what it does" />
<meta name="twitter:description" content="A longer description of what the app does and why it's worth clicking through." />
<meta name="twitter:image" content="https://example.com/images/og/social-preview.png" />
```

`og:url` has to be the page's real, absolute URL — the Open Graph spec defines it that way, and a relative value like `/` is invalid regardless of how forgiving any one scraper happens to be about it. It's the single easiest field in the block to get wrong, because unlike a broken image it fails silently: the card still renders, just pointing at the wrong, or no, canonical URL. `og:image`'s `width`/`height` aren't decorative either — Facebook's and Slack's unfurlers use them to reserve layout space before the image itself loads, and getting them wrong, or omitting them, is a common way for a card to flash or resize as the real image arrives.

`twitter:card` set to `summary_large_image` is what asks X for the big, image-forward card layout instead of the small square-thumbnail one `summary` produces. The `twitter:*` fields underneath it are optional in the sense that X does fall back to the matching `og:*` field when one's missing, but that fallback isn't guaranteed field-by-field — which is the actual reason to write them explicitly rather than lean on it.
