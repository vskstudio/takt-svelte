import { getContext, setContext } from 'svelte'
import { writable, get, type Writable } from 'svelte/store'
import type { createTakt } from '@vskstudio/takt-core'

/** The Analytics instance type, derived from the core factory (core does not export it). */
export type TaktInstance = ReturnType<typeof createTakt>

const CONTEXT_KEY = Symbol('takt')

/**
 * Module-level fallback store. Lets `useTakt()` resolve the instance even from
 * modules outside the component subtree. Mirrors the value set on context.
 */
export const taktStore: Writable<TaktInstance | null> = writable(null)

/**
 * Called once during `<Takt />` init (synchronously, not in onMount): publishes
 * an empty store into context that `<Takt />` populates after mount.
 */
export function provideTakt(): Writable<TaktInstance | null> {
  const store = writable<TaktInstance | null>(null)
  setContext(CONTEXT_KEY, store)
  return store
}

/** Resolve the live instance: context store first, then the module fallback. */
export function resolveTakt(): TaktInstance | null {
  let ctx: Writable<TaktInstance | null> | undefined
  try {
    ctx = getContext<Writable<TaktInstance | null>>(CONTEXT_KEY)
  } catch {
    // getContext throws when called outside component init (e.g. a utility module).
    ctx = undefined
  }
  return (ctx ? get(ctx) : null) ?? get(taktStore)
}
