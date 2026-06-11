import { describe, it, expect, beforeEach } from 'vitest'
import { get } from 'svelte/store'
import { taktStore, resolveTakt } from '../src/lib/store'
import { useTakt } from '../src/lib/useTakt'

describe('store / useTakt', () => {
  beforeEach(() => taktStore.set(null))

  it('resolveTakt returns null when nothing is provided and no module instance', () => {
    expect(resolveTakt()).toBeNull()
  })

  it('resolveTakt falls back to the module store', () => {
    const fake = { track: () => {} } as never
    taktStore.set(fake)
    expect(resolveTakt()).toBe(fake)
    expect(get(taktStore)).toBe(fake)
  })

  it('useTakt returns a never-throwing no-op when no instance exists', () => {
    const takt = useTakt()
    expect(() => takt.track('X')).not.toThrow()
    expect(() => takt.pageview()).not.toThrow()
    expect(() => takt.optOut()).not.toThrow()
    expect(() => takt.optIn()).not.toThrow()
  })

  it('useTakt returns the live module instance when present', () => {
    const fake = { track: () => {}, pageview: () => {}, optOut: () => {}, optIn: () => {} } as never
    taktStore.set(fake)
    expect(useTakt()).toBe(fake)
  })
})
