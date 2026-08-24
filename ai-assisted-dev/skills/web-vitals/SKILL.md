---
name: web-vitals
description: Measure, instrument, diagnose, and improve production Core Web Vitals (LCP, INP, and CLS) using field data, attribution, lab traces, and verified rollouts. Use for CrUX, PageSpeed Insights, or Search Console regressions; RUM setup; metric-specific fixes; and Web Vitals budgets. Use performance-audit instead for bundle, memory, or compute work without a Web Vitals outcome.
---

# Web Vitals

Treat the production field distribution as the outcome. A local Lighthouse improvement is evidence for a candidate fix, not proof that real users improved.

## Targets

Judge each metric at the 75th percentile of page visits, segmented by mobile and desktop:

| Metric | Good        | Needs improvement | Poor       |
|--------|-------------|-------------------|------------|
| LCP    | <= 2,500 ms | <= 4,000 ms       | > 4,000 ms |
| INP    | <= 200 ms   | <= 500 ms         | > 500 ms   |
| CLS    | <= 0.10     | <= 0.25           | > 0.25     |

A page passes only when all three are good. Also track the percentage of visits in each rating and the sample count; a p75 without its population is easy to misread.

## Evidence contract

- Use field data to identify the affected population and lab tools to reproduce and explain it. Do not substitute one for the other.
- Compare the same route or page template, form factor, navigation type, release, and time window. Never compare a site-wide mobile field p75 with one desktop lab run.
- Prefer final per-navigation metric values. Do not average Web Vitals, calculate a percentile from pre-aggregated averages, treat missing browser data as zero, or combine hard and soft navigations without labeling them.
- CrUX is Chrome-only, eligibility-filtered, and aggregated over a rolling 28-day window. It is useful for external truth but too delayed and coarse for release attribution. Use first-party RUM when the task requires route-, release-, or interaction-level diagnosis.
- Respect consent and existing telemetry policy. Never send query strings, user-entered text, arbitrary DOM text, account identifiers, or unbounded CSS selectors as diagnostic dimensions.

## Workflow

1. **Define the failing cohort.** Record the metric, exact URL or normalized page type, mobile/desktop population, data source, date window, sample size, current p75/good rate, target, and suspected regression date. If the report is only an origin-level Search Console group, identify representative URLs before editing code.
2. **Inspect the delivery path.** Determine rendering mode, router behavior, CDN/cache path, critical assets, third-party scripts, existing analytics, release identifier, and the installed `web-vitals` version. Preserve the project's package manager and observability stack.
3. **Build a measurement stack.** Use CrUX/PageSpeed Insights/Search Console for the broad field signal, first-party RUM for cohort and attribution data, and a reproducible DevTools Performance or Lighthouse user-flow trace for causality. Capture a baseline before changing code. For an instrumentation task, read [references/rum-instrumentation.md](references/rum-instrumentation.md).
4. **Reproduce the affected journey.** Match the field cohort as closely as practical: route, viewport, CPU/network constraints, cache state, authentication state, and the interactions that expose INP or post-load CLS. Run enough repeated trials to see variability; retain representative traces rather than quoting the best run.
5. **Find the dominant subpart.** Read [references/diagnostic-playbooks.md](references/diagnostic-playbooks.md), use attribution plus the trace, and explain the causal chain from request/task/layout to the metric. A large number beside a generic audit suggestion is not a root cause.
6. **Fix the highest-impact proven cause.** Keep semantics, accessibility, and correctness intact. Do not hide content, defer required interaction work indefinitely, remove useful UI, or optimize solely for a synthetic test. Broad preloading, blanket lazy loading, and indiscriminate code splitting can make another cohort worse.
7. **Verify in layers.** Re-run the same lab protocol, exercise the functional path, check console/network errors, and compare relevant resource and main-thread timings. Then roll out with a release marker and verify production p75, rating distribution, and guardrails after enough representative samples. CrUX confirmation comes later because its window rolls slowly.
8. **Report honestly.** State the field cohort and baseline, lab reproduction, root cause, code/config change, same-method lab delta, production result if available, sample sizes, trade-offs, and what still cannot be concluded. If production data is not available yet, say `candidate fix deployed` rather than `fixed`.

## Production rules

- Initialize Web Vitals observers once per document, not from a component render or every route hook. Callbacks may fire more than once during a lifecycle and again after a back/forward-cache restore.
- Prefer the official `web-vitals` package. Use its attribution build when the diagnostic value justifies the small payload increase, and serialize only an allowlist of useful scalar fields rather than raw `PerformanceEntry` or DOM objects.
- Keep `metric.id`. If the backend stores full `value`, upsert the latest report for a metric instance; if the analytics sink is additive, send `delta` and group by `id`. Otherwise repeated callbacks inflate the distribution.
- Use the metric's reported `navigationURL` when the installed version supplies it, then normalize it to a route template. Reading `location.href` inside a late callback can assign an SPA metric to the wrong route.
- Keep `navigationType` as a dimension. Back/forward-cache, prerender, restore, hard navigation, and soft navigation populations behave differently.
- `reportAllChanges` is a debugging option, not the default production collection strategy. It does not report every layout shift or every interaction and increases event volume.
- TBT is a useful lab lead for main-thread contention but is not INP. A load-only Lighthouse run also misses later interactions and long-lived CLS.
- Do not regress one Core Web Vital while fixing another. Re-check all three, plus functional and business guardrails relevant to the changed path.

## Version-sensitive behavior

Check the installed package and the official changelog before using version-specific options. `web-vitals` v6 adds soft-navigation reporting on supporting browsers. During adoption, keep conventional lifecycle metrics as a separate stream, enable soft-navigation reporting only where supported, store the supplied navigation identity and URL, and compare the two methodologies before changing dashboards or alerts. Browser coverage and the meaning of soft-navigation LCP differ from hard navigation, so never splice both populations into one historical series.

Authoritative references: [Web Vitals thresholds](https://web.dev/articles/vitals), [official `web-vitals` package](https://github.com/GoogleChrome/web-vitals), [CrUX methodology](https://developer.chrome.com/docs/crux/methodology), and [soft-navigation measurement](https://developer.chrome.com/docs/web-platform/soft-navigations).
