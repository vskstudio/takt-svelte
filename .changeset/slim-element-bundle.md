---
'@vskstudio/takt-svelte': patch
---

Slim down the self-contained `/element` bundle: the `<takt-analytics>` custom
element is now authored as a plain `HTMLElement` instead of a Svelte custom
element, dropping the bundled Svelte runtime. The element only wired core
imperatively on mount/unmount and rendered nothing, so no behavior or attribute
changes (the hyphenated `respect-dnt` / `exclude-localhost` spellings are now
accepted alongside the historical lowercase ones) — the bundle shrinks from
~16 kB to ~3.5 kB gzipped.
