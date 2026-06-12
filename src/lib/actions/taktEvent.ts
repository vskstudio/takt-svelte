import { track } from '@vskstudio/takt-core'
import type { ActionReturn } from 'svelte/action'

export interface TaktEventParams {
  name: string
  props?: Record<string, string>
  revenue?: { amount: string; currency: string }
}

// Svelte action: tracks a custom event on click. Reactive — updating the
// parameter changes the tracked name/props/revenue; cleaned up on destroy.
export function taktEvent(
  node: HTMLElement,
  params: TaktEventParams,
): ActionReturn<TaktEventParams> & { update(next: TaktEventParams): void; destroy(): void } {
  let current = params
  const handler = (): void => {
    const opts =
      current.props || current.revenue
        ? { props: current.props, revenue: current.revenue }
        : undefined
    track(current.name, opts)
  }
  node.addEventListener('click', handler)
  return {
    update(next: TaktEventParams): void {
      current = next
    },
    destroy(): void {
      node.removeEventListener('click', handler)
    },
  }
}
