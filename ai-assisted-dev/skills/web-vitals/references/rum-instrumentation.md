# Production RUM instrumentation

Read this when adding or reviewing real-user Web Vitals collection. Adapt the transport and schema to the project's existing observability platform; do not introduce a second analytics system just for convenience.

## Decide the data contract first

Store one logical metric instance per navigation, not one unrelated row per callback. A useful allowlisted payload is:

| Field                                    | Purpose                                                                     |
|------------------------------------------|-----------------------------------------------------------------------------|
| `schema_version`                         | Allows migrations without silently mixing incompatible events               |
| `name`, `value`, `delta`, `rating`, `id` | Values reported by `web-vitals`; `id` is the deduplication/grouping key     |
| `navigation_type`, `navigation_id`       | Separates hard, soft, restore, prerender, and bfcache populations           |
| `page_type`                              | Stable route template such as `/products/:id`, never a raw personalized URL |
| `release`                                | Immutable deploy/build identifier used for regression comparison            |
| `timestamp`                              | Collection time for retention and rollout windows                           |
| `form_factor`                            | A coarse project-defined bucket; keep its definition stable                 |
| `effective_connection_type`              | Optional coarse network cohort when available; do not require it            |
| metric-specific attribution              | Only the safe scalar fields needed to explain the result                    |
| `sample_rate`                            | Required when sampling so downstream estimates can be weighted correctly    |

Do not attach cookies, stable user IDs, query strings, referrers with tokens, DOM text, full resource URLs containing parameters, raw event objects, or serialized `PerformanceEntry` arrays. Keep cardinality bounded: route templates and explicit `data-perf-id` values are safer than generated selectors.

## Install and initialize

1. Detect the package manager from the lockfile and inspect the installed `web-vitals` version and changelog before coding against its API.
2. Put observer registration in the earliest app-level module that executes once per document. The library uses buffered performance entries, so it normally does not need to compete with user-facing critical code for earliest execution.
3. Import only the metrics required. For diagnosis, use `web-vitals/attribution`; for a mature stable pipeline that does not use attribution, consider the standard build.
4. Register `onLCP`, `onINP`, and `onCLS` once. Do not re-register on every Vue mount, router navigation, React render, or analytics-consent callback without guarding initialization.
5. Do not assume all callbacks fire. INP requires an interaction, and browsers may omit metrics for unsupported or backgrounded cases. Missing is not zero.

## Normalize targets explicitly

When using the attribution build, provide `generateTarget` when the installed version supports it. Resolve the nearest allowlisted marker, for example `data-perf-id="checkout-submit"`, and return that stable value. If there is no marker, return a bounded component or element category or omit the target. Never fall back to `textContent`, input values, user-generated IDs, or a full ancestry selector in production telemetry.

Add `data-perf-id` only to elements that are genuinely useful diagnostic boundaries. Treat these values as a small controlled vocabulary reviewed like analytics event names.

## Extract only useful attribution

Select fields by metric instead of serializing the complete attribution object:

- **LCP:** element/target identifier, URL origin or sanitized asset key, TTFB, resource-load delay, resource-load duration, element-render delay, and load state when exposed by the installed version.
- **INP:** interaction target/type, input delay, processing duration, presentation delay, load state, and bounded Long Animation Frame/script attribution when available. Keep `includeProcessedEventEntries` off unless a short-lived diagnostic experiment proves it is necessary; it can add substantial memory and payload volume.
- **CLS:** largest shift target, time, value, and load state. Do not send the shifted node or all shift sources.

Cross-origin frames and unsupported browsers create observability gaps. Record coverage separately; do not invent replacement zeros or claim that JavaScript RUM exactly matches every CrUX visit.

## Transport and lifecycle

- Queue the latest payload by `(metric.id, metric.name)`. Replacing an earlier value prevents duplicate full-value reports in the same page lifecycle.
- Flush when the library reports a finalized value and when the document becomes hidden. Prefer `visibilitychange` over `unload`/`beforeunload`.
- Use the project's telemetry SDK if it correctly handles page termination. For a first-party endpoint, use `navigator.sendBeacon()` where appropriate and a small `fetch(..., {keepalive: true})` fallback. Do not block navigation or retry indefinitely.
- Cap batch bytes and event count. Validate request size, schema version, metric ranges, and accepted dimensions server-side; rate-limit the endpoint. A telemetry endpoint is public input.
- Make ingestion idempotent. For full values, upsert on the logical metric key and keep the latest value. For additive analytics systems, send `delta`, retain `id`, and reconstruct or group the metric before percentile calculation.
- Do not rely on an in-memory queue surviving crashes or mobile process termination. Accept a known loss rate and monitor receipt coverage; durable client storage usually adds more privacy and lifecycle complexity than Web Vitals warrants.

## Sampling

Use a stable unbiased decision for the primary metric stream so repeat callbacks for one navigation receive the same decision. Record the effective sample rate. If high-volume attribution is expensive, keep a representative base stream and sample detailed diagnostics separately; any oversampling of poor results must be labeled and weighted, never mixed into the primary p75 as if representative.

## Aggregation and dashboards

- Compute p75 from the final per-navigation values, partitioned by metric, normalized page type, form factor, and measurement methodology. Do not average values first.
- Show p75, good/needs-improvement/poor percentages, sample count, and data freshness together.
- Segment by release and navigation type for diagnosis, but avoid dashboards with so many dimensions that every cohort is noise. Roll low-volume routes up to meaningful page types.
- Define a minimum sample policy and confidence expectations before alerting. Compare equivalent time-of-week and traffic mixes when seasonality matters.
- Track ingestion coverage and schema errors. A sudden score improvement caused by unsupported clients or dropped poor events is a telemetry incident, not a performance win.

## SPA and soft navigations

Traditional Core Web Vitals cover the full document lifecycle even when an SPA changes routes. Do not manually reset metrics on router hooks and call the result standard Core Web Vitals.

With `web-vitals` v6 and browser support, `reportSoftNavs: true` can produce per-soft-navigation metrics. Roll this out as a parallel, explicitly labeled methodology:

1. Keep conventional observers for historical continuity.
2. Register a second stream with soft-navigation reporting enabled.
3. Use the metric's supplied `navigationURL`, `navigationId`, and `navigationType`; callbacks can arrive after the current route changed.
4. Keep hard and soft navigation distributions separate. Soft-navigation TTFB is zero by definition, and its LCP considers newly painted content rather than persistent page chrome.
5. Track browser support/coverage and false-positive or false-negative route detection before using the stream for gates.

## Acceptance checks

Before calling instrumentation production-ready, verify:

- observers register once and do not leak across route changes;
- values appear for a normal load, an actual interaction, a background/foreground transition, and a bfcache restore where supported;
- dynamic URLs and attribution targets are sanitized;
- repeated callbacks deduplicate or aggregate correctly;
- failed telemetry never breaks the app or navigation;
- endpoint validation rejects malformed or oversized payloads;
- dashboards calculate p75 from final logical instances and expose sample counts;
- the telemetry bundle/transport does not materially worsen the metrics it measures.

Re-check implementation details against the [official package README](https://github.com/GoogleChrome/web-vitals#readme) and [field-debugging guidance](https://web.dev/articles/debug-performance-in-the-field) when changing the integration.
