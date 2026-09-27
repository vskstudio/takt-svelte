---
'@vskstudio/takt-svelte': minor
---

New `redactRoutes`, `routeTemplates` and `routeTemplate` props on `<Takt>`, forwarded to `createTakt`, and a comma-separated `redact-routes` attribute on `<takt-analytics>`. Sensitive routes such as `/verify/[token]` are sent as their pattern instead of the real path; in SvelteKit, `routeTemplate={() => page.route.id}` sends every page as its route template, with route groups removed. Requires `@vskstudio/takt-core` 0.10.0.
