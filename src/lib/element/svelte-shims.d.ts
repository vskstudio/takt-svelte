// Ambient fallback so `vite-plugin-dts` can resolve the `.svelte` default
// import when emitting `dist/element/index.d.ts`. The element's public type
// surface is only `defineTaktElement()`; the component class itself is never
// part of the published `/element` types, so a minimal `any` default suffices.
declare module '*.svelte' {
  const component: unknown
  export default component
}
