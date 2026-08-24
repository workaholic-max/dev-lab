# Metric diagnostic playbooks

Read the relevant metric section after the failing field cohort is known. Attribution narrows the search; a DevTools trace confirms the causal work.

## LCP: decompose before optimizing

Break LCP into TTFB, resource-load delay, resource-load duration, and element-render delay. The dominant part determines the fix.

### TTFB is dominant

Inspect redirects, DNS/TLS, CDN cache status, server timing, personalization, database/backend latency, compression, and HTML streaming. Compare cached and uncached requests and authenticated versus anonymous traffic. Fix the responsible layer; image compression cannot repair slow HTML arrival.

### Resource-load delay is dominant

Confirm the LCP resource is discoverable from initial HTML or an early stylesheet, not created late by JavaScript or hidden behind a client-only data request. Check preload correctness, responsive-image selection, priority competition, and accidental `loading="lazy"` on the hero. Use `fetchpriority="high"` only on the actual high-priority candidate; excessive preloads and priorities create contention.

### Resource-load duration is dominant

Inspect transfer size, image dimensions/format, cache policy, CDN proximity, origin latency, and competing bandwidth. Serve an appropriately sized responsive asset. Do not celebrate a smaller file if decode/render delay or visual quality becomes unacceptable.

### Element-render delay is dominant

Look for render-blocking CSS, fonts that delay text, hydration or client data gates, main-thread long tasks, opacity/animation gates, and delayed component mounting. Server-rendering the LCP content can help only if the browser can display it without waiting on the same blocking resources.

Verify that the LCP element is stable across the affected cohort; aggregate LCP can hide several different candidates. Re-check warm/cold cache, mobile/desktop, and authenticated states.

## INP: use the phase breakdown

INP is the high-percentile interaction latency across the page lifecycle, not just the first input. Reproduce the actual interaction named by field attribution and record a Performance trace with the interaction marker.

### Input delay is dominant

The main thread was busy before the handler ran. Find the overlapping long task and its initiator: hydration, parsing/evaluation, analytics, timers, observers, or other event handlers. Reduce initial JavaScript, split or remove the responsible work, and schedule non-urgent work away from likely interactions. A `setTimeout` added blindly can merely move contention.

### Processing duration is dominant

Profile the handler and work it triggers. Reduce synchronous computation, repeated parsing, large reactive updates, unnecessary watchers/computeds, and broad state invalidation. For large lists, reduce DOM work with pagination or virtualization. Break genuinely deferrable work into tasks and yield to the browser; an `async` function that only chains resolved promises stays in the microtask queue and may not yield a paint.

### Presentation delay is dominant

Inspect style recalculation, layout, paint, DOM size, synchronous layout reads after writes, expensive component rerenders, and large visual updates. Batch DOM reads/writes, reduce the affected subtree, and render immediate feedback before secondary work. Avoid replacing responsive feedback with a spinner that appears only after the same long task.

Long Animation Frame attribution can point to scripts and phases, but confirm ownership in the trace; third-party attribution and minified bundles can be incomplete. TBT is a lab proxy for load-time main-thread pressure, never proof that an interaction's INP is fixed.

For Vue, inspect deep reactive objects, wide watcher dependencies, template work repeated across large lists, synchronous store fan-out, and unnecessary component invalidation. Use framework-specific optimizations only after the trace shows they touch the slow interaction.

## CLS: observe the full journey

CLS uses a session-windowed score across the page lifecycle. A load-only audit can miss shifts after scrolling, consent actions, route updates, ads, or delayed content.

Use field attribution to identify the largest shift target and time, then reproduce the sequence with DevTools layout-shift regions or a Performance trace. The element that moved is often the victim; inspect what was inserted, resized, removed, or restyled immediately before it.

Common causes and fixes:

- Images/video/iframes: provide intrinsic dimensions or `aspect-ratio` and responsive sizing.
- Ads, embeds, recommendations, and async components: reserve a realistic stable slot; define collapse behavior deliberately when content is absent.
- Late banners, notices, and validation: allocate space or overlay when appropriate instead of pushing existing content unexpectedly.
- Fonts: use appropriate preload/subsetting, fallback metric overrides where warranted, and a loading strategy whose visual trade-off is understood.
- Animations: prefer compositor-friendly transforms/opacity when the visual effect permits; layout-changing animation can shift surrounding content.
- Hydration: make server and client geometry agree; skeletons and final content should have compatible dimensions.

Do not eliminate a useful UI solely because it contributes to CLS. Stabilize its geometry and preserve accessibility. Check narrow viewports and translated/long content, where wrapping changes often reveal the real issue.

## Field/lab disagreement checklist

When the trace looks good but field p75 is poor, check:

- wrong URL scope: origin-level CrUX or Search Console grouping versus one tested page;
- traffic mix: mobile hardware, networks, geography, authentication, experiments, or older releases;
- lifecycle: bfcache restore, prerender, SPA route changes, long sessions, or background tabs;
- interaction coverage: lab never performed the slow interaction or scrolled far enough to trigger the shift;
- cache and CDN differences: local or repeat lab runs are warm while users are cold or miss cache;
- third parties and consent variants absent from the lab environment;
- candidate variance: different LCP elements, responsive assets, or personalized layouts;
- telemetry mistakes: duplicate full values, raw dynamic URLs, missing poor events, unsupported clients counted as zero, or mixed methodologies.

When lab is poor but field is good, check whether synthetic throttling, extensions, local development mode, disabled caching, source maps, or non-production builds are distorting the run. Still fix a real user-visible issue if the trace proves one; just do not claim it explains the field distribution without cohort evidence.

## Verification matrix

For the changed path, compare before and after using the same setup:

| Layer            | Evidence                                                                                   |
|------------------|--------------------------------------------------------------------------------------------|
| Local functional | The complete user flow still works; accessibility and console/network state are clean      |
| Lab metric       | Repeated equivalent runs or user flows, representative trace, metric and dominant subpart  |
| Delivery         | Asset priority/size/cache or server timing changed as intended, without new contention     |
| Production RUM   | Same cohort and release segmentation; p75, rating distribution, samples, and guardrails    |
| External field   | CrUX/PageSpeed/Search Console after its rolling window has had time to reflect the rollout |

Do not cherry-pick the fastest run. Report variability and any cohort that regressed. If only lab verification is currently possible, give the user the exact production signal and release window that still need monitoring.

Primary references: [optimize LCP](https://web.dev/articles/optimize-lcp), [optimize INP](https://web.dev/articles/optimize-inp), [optimize CLS](https://web.dev/articles/optimize-cls), and [debug field performance](https://web.dev/articles/debug-performance-in-the-field).
