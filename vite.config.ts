import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import dts from 'vite-plugin-dts'

// Builds ONLY the self-contained custom-element bundle into dist/element.
// Entries A and C are produced by `svelte-package` (build:lib) and ship as
// source; this build runs second with emptyOutDir:false so it doesn't wipe them.
export default defineConfig({
  plugins: [
    svelte({ compilerOptions: { customElement: true } }),
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
    rollupOptions: {
      external: ['@vskstudio/takt-core'],
    },
  },
})
