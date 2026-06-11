import TaktAnalytics from './TaktAnalytics.svelte'

const TAG = 'takt-analytics'

// Svelte 5 compiles a `<svelte:options customElement>` component WITHOUT a
// `tag` into a plain render function and attaches the actual HTMLElement
// subclass on its `.element` property (via `create_custom_element`). The render
// function itself is NOT a valid custom-element constructor — registering it
// makes `new` throw `component_api_invalid_new`. Register `.element` instead.
const TaktAnalyticsElement = (TaktAnalytics as unknown as { element?: CustomElementConstructor })
  .element as CustomElementConstructor

let defined = false

/**
 * Registers <takt-analytics>. Idempotent and SSR-safe (no-op when
 * customElements is unavailable or the tag is already defined).
 */
export function defineTaktElement(): void {
  if (defined || typeof customElements === 'undefined') return
  if (!customElements.get(TAG) && TaktAnalyticsElement) {
    customElements.define(TAG, TaktAnalyticsElement)
  }
  defined = true
}

// Side-effect registration on import (the documented default usage).
defineTaktElement()
