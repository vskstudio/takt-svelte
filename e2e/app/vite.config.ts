import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { resolve } from 'node:path'

// Resolve the package to its built output so the e2e exercises the real
// published artifact (entries A/C ship as source, compiled by the plugin).
export default defineConfig({
  plugins: [svelte()],
  resolve: {
    alias: {
      '@vskstudio/takt-svelte/actions': resolve(__dirname, '../../dist/actions/index.js'),
      '@vskstudio/takt-svelte': resolve(__dirname, '../../dist/index.js'),
    },
  },
})
