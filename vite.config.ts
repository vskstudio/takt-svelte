import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

// Builds ONLY the self-contained custom-element bundle into dist/element.
// Entries A and C are produced by `svelte-package` (build:lib) and ship as
// source; this build runs second with emptyOutDir:false so it doesn't wipe them.
// The element is a plain HTMLElement (no Svelte runtime), so no Svelte plugin is
// needed and the bundle stays tiny.
export default defineConfig({
  plugins: [
    dts({
      include: ['src/lib/element'],
      outDir: 'dist/element',
      entryRoot: 'src/lib/element',
    }),
  ],
  build: {
    emptyOutDir: false,
    outDir: 'dist/element',
    lib: {
      entry: 'src/lib/element/index.ts',
      formats: ['es'],
      fileName: () => 'index.js',
    },
    // Entry B is a no-build, framework-agnostic embed target: bundle core in so
    // `import '@vskstudio/takt-svelte/element'` resolves in a plain browser
    // without an import map. Nothing is externalized.
  },
})
