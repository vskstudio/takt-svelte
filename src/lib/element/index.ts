import TaktAnalytics from './TaktAnalytics.svelte'

const TAG = 'takt-analytics'

let defined = false

/**
 * Registers <takt-analytics>. Idempotent and SSR-safe (no-op when
 * customElements is unavailable or the tag is already defined).
 */
export function defineTaktElement(): void {
  if (defined || typeof customElements === 'undefined') return
  if (!customElements.get(TAG)) {
    customElements.define(TAG, TaktAnalytics as unknown as CustomElementConstructor)
  }
  defined = true
}

// Side-effect registration on import (the documented default usage).
defineTaktElement()
