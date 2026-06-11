# @vskstudio/takt-svelte

Idiomatic [Svelte](https://svelte.dev) wrapper for [Takt](https://github.com/uyangx/takt-core) privacy-friendly analytics. SSR-safe, automatic SPA pageviews, three integration styles. Thin layer over `@vskstudio/takt-core` — it changes nothing about the wire payload or privacy logic.

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
```

## License

MIT
