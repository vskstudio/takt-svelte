<div align="center">

<img src="https://raw.githubusercontent.com/sveltejs/branding/master/svelte-logo.svg" alt="Svelte" width="80" height="80" />

# @vskstudio/takt-svelte


> 📚 **Documentation** — [taktlytics.com/docs/wrappers/svelte](https://taktlytics.com/docs/wrappers/svelte)
**Idiomatic [Svelte](https://svelte.dev) wrapper for [Takt](https://github.com/vskstudio/takt-core) privacy-friendly analytics.**

[![npm version](https://img.shields.io/npm/v/@vskstudio/takt-svelte?color=ff3e00&logo=npm)](https://www.npmjs.com/package/@vskstudio/takt-svelte)
[![Svelte](https://img.shields.io/badge/Svelte-5.19%2B-ff3e00?logo=svelte&logoColor=white)](https://svelte.dev)
[![bundle size](https://img.shields.io/bundlephobia/minzip/@vskstudio/takt-svelte?color=ff3e00&label=element%20gzip)](https://bundlephobia.com/package/@vskstudio/takt-svelte)
[![license](https://img.shields.io/npm/l/@vskstudio/takt-svelte?color=ff3e00)](./LICENSE)

</div>

---

A thin, SSR-safe Svelte 5 layer over [`@vskstudio/takt-core`](https://www.npmjs.com/package/@vskstudio/takt-core). Built with runes; it changes nothing about the wire payload or privacy logic — it just makes the core feel native in a Svelte app.

- **SSR-safe** — the browser SDK only initializes in `onMount`, so there is no server-side `window` access and no hydration mismatch.
- **Automatic SPA pageviews** — client-side navigations are tracked out of the box.
- **Three integration styles** — a component, a framework-agnostic web component, and a Svelte action — pick what fits.
- **Privacy inherited from core** — Do Not Track, opt-out, localhost/private-IP exclusion, and query-string scrubbing all come from `@vskstudio/takt-core`.

## Install

```bash
pnpm add @vskstudio/takt-svelte @vskstudio/takt-core
```

`@vskstudio/takt-core` (`>=0.5.0`) and `svelte` (`^5.19.0`) are peer dependencies.

## Choosing a style

| Style | Import | Use it when |
| --- | --- | --- |
| **A — Component** | `@vskstudio/takt-svelte` | You're in a Svelte / SvelteKit app and want the idiomatic path. |
| **B — Web component** | `@vskstudio/takt-svelte/element` | You're in plain HTML or a non-Svelte framework. |
| **C — Action** | `@vskstudio/takt-svelte/actions` | You want to wire `init()` yourself and track events declaratively. |

## A — Idiomatic component

Place `<Takt />` once (e.g. in `+layout.svelte`):

```svelte
<script>
  import { Takt } from '@vskstudio/takt-svelte'
</script>

<Takt domain="exemple.fr" outbound files />
```

Track custom events anywhere with `useTakt()`:

```svelte
<script>
  import { useTakt } from '@vskstudio/takt-svelte'
  const takt = useTakt()
</script>

<button onclick={() => takt.track('Signup', { props: { plan: 'pro' } })}>
  S'inscrire
</button>

<button
  onclick={() =>
    takt.track('Purchase', {
      props: { plan: 'pro' },
      revenue: { amount: '29.00', currency: 'EUR' },
    })}
>
  Acheter
</button>
```

`useTakt()` never throws — before `<Takt />` mounts it returns a no-op instance.

### `<Takt />` props

| Prop | Type | Default | Effect |
| --- | --- | --- | --- |
| `domain` | `string` | `location.hostname` | Site id |
| `endpoint` | `string` | `/api/event` | Ingestion URL |
| `scriptOrigin` | `string` | – | First-party origin to derive the endpoint from (`{origin}/api/event`) — a custom domain you proxy through to dodge ad-blockers (endpoint wins over it) |
| `outbound` | `boolean` | `false` | Track outbound link clicks |
| `files` | `boolean \| string[]` | `false` | Track file downloads (optional ext list) |
| `spa` | `boolean` | `true` | Auto pageview on client navigation |
| `track404` | `boolean` | `false` | Report a `404` event on error pages (`[data-takt-404]` / `<meta name="takt:404">` marker, or a 404 HTTP status) |
| `respectDnt` | `boolean` | `true` | Honour Do Not Track |
| `excludeLocalhost` | `boolean` | `true` | Skip localhost / private IPs |
| `enabled` | `boolean` | – | Master on/off switch — set to `false` to disable all tracking |
| `sampleRate` | `number` | – | Fraction of sessions to sample (0–1) |
| `trackQuery` | `boolean` | – | Preserve the query string in page URLs |
| `queryParams` | `string[]` | – | Query params to preserve when `trackQuery` is false (allowlist) |
| `exclude` | `string[]` | – | Path prefixes never tracked, e.g. `['/app', '/account']` (segment-bounded, checked at send time) |
| `scrubUrl` | `(url: string) => string` | – | Transform each URL before it is sent (function prop / config only — not available as an element attribute) |
| `tagged` | `boolean` | `false` | Call `enableTagged()` to auto-track `[data-takt-event]` elements |

## B — Web component

For plain HTML or non-Svelte frameworks:

```js
import '@vskstudio/takt-svelte/element'
```

```html
<takt-analytics domain="exemple.fr" outbound files></takt-analytics>
```

Importing the subpath registers `<takt-analytics>` automatically; `defineTaktElement()` is also exported for explicit, guarded registration.

Attributes mirror the `<Takt />` props with a few differences:

- `files` is boolean-only (no extension array — use `<Takt />` or the actions API for that).
- `spa`, `respectDnt`, `excludeLocalhost`, and `enabled` default to their JS defaults and are opted out with the explicit string value `"false"` (e.g. `spa="false"`, `enabled="false"`).
- `sample-rate` (kebab-case) accepts a numeric string: `sample-rate="0.5"`.
- `track-query` (kebab-case) is a boolean attribute.
- `query-params` (kebab-case) accepts a comma-separated list: `query-params="utm_source, utm_medium"`.
- `exclude` accepts a comma-separated list of path prefixes: `exclude="/app,/account"`.
- `tagged` is a boolean attribute — presence enables `[data-takt-event]` auto-tracking.
- `scrubUrl` is not available as an element attribute (functions can't be passed as HTML attributes — use `<Takt />` or the actions API).

## C — Functional / actions

Wire init yourself and track declaratively:

```svelte
<script>
  import { init, taktEvent } from '@vskstudio/takt-svelte/actions'
  init({ domain: 'exemple.fr' })
</script>

<button use:taktEvent={{ name: 'Signup', props: { plan: 'pro' } }}>
  S'inscrire
</button>

<button
  use:taktEvent={{
    name: 'Purchase',
    props: { plan: 'pro' },
    revenue: { amount: '29.00', currency: 'EUR' },
  }}
>
  Acheter
</button>
```

The action re-reads its parameter on every change, so a reactive `name`, `props`, or `revenue` is always tracked with its latest value; the click listener is removed automatically when the node is destroyed.

| `taktEvent` parameter | Type | Required | Effect |
| --- | --- | --- | --- |
| `name` | `string` | yes | Event name sent on click |
| `props` | `Record<string, string>` | no | Custom properties |
| `revenue` | `{ amount: string; currency: string }` | no | Revenue attached to the event |

## Widgets

Thin wrappers over Takt's server-rendered widgets. `<TaktBadge />` is an `<img>`
pointing at the badge SVG; `<TaktEmbed />` is an `<iframe>` for the embed page.
Both accept `host` to target a self-hosted Takt and pass through extra
attributes (`class`, `style`, …); the controlled `src` cannot be overridden.
`host` must be an absolute `http(s)` URL (validated by core, which reduces it to
its origin, dropping any path or query). An empty `host` means same-origin.

The badge's `alt` defaults to `"takt"` but is overridable. The embed `<iframe>`
is security-hardened: it is `sandbox`ed (`allow-scripts allow-same-origin`) and
pinned to `referrerpolicy="strict-origin-when-cross-origin"`. Both are applied
after the pass-through attributes, so a consumer cannot weaken them.

```svelte
<script>
  import { TaktBadge, TaktEmbed } from '@vskstudio/takt-svelte'
</script>

<TaktBadge domain="exemple.fr" variant="d" glyph="unplug" />
<TaktEmbed domain="exemple.fr" theme="dark" />
```

For raw numbers, `createStats` is re-exported from core:

```ts
import { createStats } from '@vskstudio/takt-svelte'

const stats = createStats({ domain: 'exemple.fr' })
const summary = await stats.summary({ period: '7d' })
```

## Svelte version support

Entries **A** (`<Takt />`, `useTakt()`) and **C** (`./actions`) ship as Svelte
source built with runes and require `svelte@^5.19.0`. Entry **B** (`./element`)
ships as a pre-compiled, self-contained bundle, so it works regardless of the
host's Svelte version (or with no Svelte at all). CI builds against the 5.19
floor and the latest release.

## License

MIT
