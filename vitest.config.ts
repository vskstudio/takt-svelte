import { defineConfig } from 'vitest/config'
import { svelte } from '@sveltejs/vite-plugin-svelte'

export default defineConfig({
  plugins: [
    svelte({
      hot: false,
      // Compile the element with `customElement: true` so it produces a real
      // HTMLElement subclass (exposed on `Component.element`) that can boot in
      // jsdom. The jsdom environment already drives Vitest's web/client
      // transform, so no extra transformMode tweaking is needed.
      dynamicCompileOptions({ filename }) {
        if (filename.includes('/element/')) return { customElement: true }
      },
    }),
  ],
  resolve: {
    conditions: ['browser'],
  },
  test: {
    environment: 'jsdom',
    globals: true,
    // Unit tests live in test/; e2e/*.spec.ts belongs to Playwright.
    include: ['test/**/*.test.ts'],
    setupFiles: ['./test/setup.ts'],
    environmentOptions: { jsdom: { url: 'https://example.com/' } },
  },
})
