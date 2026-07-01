# @vskstudio/takt-svelte

## 0.6.2

### Patch Changes

- 891974e: Slim down the self-contained `/element` bundle: the `<takt-analytics>` custom
  element is now authored as a plain `HTMLElement` instead of a Svelte custom
  element, dropping the bundled Svelte runtime. The element only wired core
  imperatively on mount/unmount and rendered nothing, so no behavior or attribute
  changes (the hyphenated `respect-dnt` / `exclude-localhost` spellings are now
  accepted alongside the historical lowercase ones) — the bundle shrinks from
  ~16 kB to ~3.5 kB gzipped.

## 0.5.1

### Patch Changes

- Require takt-core >=0.6.0, whose default ingest endpoint and stats/widget host are now the hosted Takt origin (https://taktlytics.com). Docs updated to match; no wrapper code change.

## 0.5.0

### Minor Changes

- 2b2f987: Expose advanced tracker options: enabled, sampleRate, trackQuery, queryParams,
  scrubUrl (function prop / config only) and tagged. Peer dep raised to takt-core >=0.5.0.

## 0.3.1

### Patch Changes

- Lock the controlled widget `src` so a consumer-passed `src` can no longer override the built URL, and add a default iframe `referrerpolicy`.

## 0.3.0

### Minor Changes

- Add native `TaktBadge` and `TaktEmbed` widget components and re-export the public stats client (`createStats`) and widget URL builders from `@vskstudio/takt-core`. Requires `@vskstudio/takt-core` >= 0.3.0.

## 0.2.2

### Patch Changes

- TSDoc on the public API (`<Takt />` props, `taktEvent` action, `TaktEventParams`) for IDE hover, plus package metadata (`author`, `engines.node`, top-level `types`, `unpkg`/`jsdelivr` for the custom-element bundle). No runtime change.

## 0.2.1

### Patch Changes

- Derive `TaktEventParams` from core's `TrackOptions` so the action's prop/revenue shape stays in sync with `@vskstudio/takt-core`.

## 0.2.0

### Minor Changes

- Add `revenue` support to the `taktEvent` action and migrate components to Svelte 5 runes.

  - `taktEvent` now forwards an optional `revenue: { amount, currency }` alongside `props`.
  - `<Takt />` and `<TaktAnalytics>` use `$props()` instead of `export let`.
  - Peer dependency is now `svelte@^5.19.0` (runes; the custom-element compiler is broken below 5.19). CI builds against the floor and the latest release.

## 0.1.0

### Minor Changes

- fc496f7: Initial release: Svelte wrapper for `@vskstudio/takt-core` with three entry points — idiomatic `<Takt />` component + `useTakt()`, `<takt-analytics>` web component (`/element`), and the functional `taktEvent` action (`/actions`).
