<div align="center">

<img src="https://raw.githubusercontent.com/sveltejs/branding/master/svelte-logo.svg" alt="Svelte" width="80" height="80" />

# @vskstudio/takt-svelte

**Idiomatic [Svelte](https://svelte.dev) wrapper for [Takt](https://github.com/uyangx/takt-core) privacy-friendly analytics.**

[![npm version](https://img.shields.io/npm/v/@vskstudio/takt-svelte?color=ff3e00&logo=npm)](https://www.npmjs.com/package/@vskstudio/takt-svelte)
[![Svelte](https://img.shields.io/badge/Svelte-4%20%7C%7C%205-ff3e00?logo=svelte&logoColor=white)](https://svelte.dev)
[![bundle size](https://img.shields.io/bundlephobia/minzip/@vskstudio/takt-svelte?color=ff3e00&label=element%20gzip)](https://bundlephobia.com/package/@vskstudio/takt-svelte)
[![license](https://img.shields.io/npm/l/@vskstudio/takt-svelte?color=ff3e00)](./LICENSE)

</div>

---

SSR-safe, automatic SPA pageviews, three integration styles. A thin layer over `@vskstudio/takt-core` — it changes nothing about the wire payload or privacy logic.

## Install

```bash
pnpm add @vskstudio/takt-svelte @vskstudio/takt-core
```

`@vskstudio/takt-core` and `svelte` (`^4 || ^5`) are peer dependencies.

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

<button on:click={() => takt.track('Signup', { props: { plan: 'pro' } })}>
  S'inscrire
</button>
```

`useTakt()` never throws — before `<Takt />` mounts it returns a no-op instance.

### `<Takt />` props

| Prop | Type | Default | Effect |
| --- | --- | --- | --- |
| `domain` | `string` | `location.hostname` | Site id |
| `endpoint` | `string` | `/api/event` | Ingestion URL |
| `outbound` | `boolean` | `false` | Track outbound link clicks |
| `files` | `boolean \| string[]` | `false` | Track file downloads (optional ext list) |
| `spa` | `boolean` | `true` | Auto pageview on client navigation |
| `respectDnt` | `boolean` | `true` | Honour Do Not Track |
| `excludeLocalhost` | `boolean` | `true` | Skip localhost / private IPs |

## B — Web component

For plain HTML or non-Svelte frameworks:

```js
import '@vskstudio/takt-svelte/element'
```

```html
<takt-analytics domain="exemple.fr" outbound files></takt-analytics>
```

Importing the subpath registers `<takt-analytics>` automatically; `defineTaktElement()` is also exported for explicit, guarded registration.

Attributes mirror the `<Takt />` props, with two differences: `files` is boolean-only (the element can't take an extension array — for a custom list use `<Takt />` or the actions API), and the privacy flags (`spa`, `respectDnt`, `excludeLocalhost`) default to `true` and are opted out with the explicit string value `"false"` (e.g. `spa="false"`).

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

## Svelte version support

Entries **A** (`<Takt />`, `useTakt()`) and **C** (`./actions`) ship as Svelte
source built with runes and require `svelte@^5.19.0`. Entry **B** (`./element`)
ships as a pre-compiled, self-contained bundle, so it works regardless of the
host's Svelte version (or with no Svelte at all). CI builds against the 5.19
floor and the latest release.

## License

MIT
