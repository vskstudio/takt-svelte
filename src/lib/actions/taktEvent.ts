import { track } from '@vskstudio/takt-core'

export interface TaktEventParams {
  name: string
  props?: Record<string, string>
}

/**
 * Svelte action: tracks a custom event on click. Reactive — updating the
 * parameter changes the tracked name/props; the listener is cleaned up on destroy.
 */
export function taktEvent(node: HTMLElement, params: TaktEventParams) {
  let current = params
  const handler = (): void => track(current.name, { props: current.props })
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
