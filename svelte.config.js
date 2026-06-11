import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'

export default {
  preprocess: vitePreprocess(),
  // Applying `customElement: true` here silences svelte-check's "Did you forget
  // the customElement compile option?" warning for the element's
  // `<svelte:options customElement>`. This affects svelte-check/IDE static
  // analysis only; the real builds set compile mode per entry (vite for
  // /element, svelte-package ships A/C as source for consumers to compile).
  compilerOptions: { customElement: true },
}
