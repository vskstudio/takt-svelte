import { track } from '@vskstudio/takt-core'
import type { TrackOptions } from '@vskstudio/takt-core'
import type { ActionReturn } from 'svelte/action'

// Derives props/revenue from core's TrackOptions so the wire shape stays in sync.
export interface TaktEventParams extends TrackOptions {
  name: string
}

// Svelte action: tracks a custom event on click. Reactive — updating the
// parameter changes the tracked name/props/revenue; cleaned up on destroy.
export function taktEvent(
  node: HTMLElement,
  params: TaktEventParams,
): ActionReturn<TaktEventParams> & { update(next: TaktEventParams): void; destroy(): void } {
  let current = params
  const handler = (): void => {
    const opts: TrackOptions = {}
    if (current.props) opts.props = current.props
    if (current.revenue) opts.revenue = current.revenue
    track(current.name, Object.keys(opts).length ? opts : undefined)
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
