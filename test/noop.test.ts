import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { createTakt, isOptedOut } from '@vskstudio/takt-core'
import { noopTakt } from '../src/lib/noop'

// Surface publique réelle d'une instance du cœur, lue sur le prototype : toute
// méthode ajoutée côté cœur doit exister sur le no-op, sinon l'appeler avant le
// montage de <Takt /> lève un TypeError au lieu d'être inerte.
function corePublicMethods(): string[] {
  const instance = createTakt({ domain: 'exemple.fr' })
  const proto = Object.getPrototypeOf(instance) as object
  return Object.getOwnPropertyNames(proto).filter(
    (name) => name !== 'constructor' && !name.startsWith('_'),
  )
}

function memoryStorage(): Pick<Storage, 'getItem' | 'setItem' | 'removeItem'> {
  const entries = new Map<string, string>()
  return {
    getItem: (key) => entries.get(key) ?? null,
    setItem: (key, value) => void entries.set(key, String(value)),
    removeItem: (key) => void entries.delete(key),
  }
}

describe('noopTakt', () => {
  beforeEach(() => vi.stubGlobal('localStorage', memoryStorage()))
  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
  })

  it('couvre toute la surface publique du cœur', () => {
    const takt = noopTakt() as unknown as Record<string, unknown>
    for (const name of corePublicMethods()) {
      expect(typeof takt[name], `noopTakt() ne fournit pas ${name}()`).toBe('function')
    }
  })

  it('expose enableTagged() et le rend inerte', () => {
    const takt = noopTakt()
    expect(() => takt.enableTagged()).not.toThrow()
    expect(typeof takt.enableTagged()).toBe('function')
    expect(() => takt.enableTagged()()).not.toThrow()
  })

  it('chaque activation renvoie un disposer inerte', () => {
    const takt = noopTakt()
    for (const enable of [
      takt.enableSpa,
      takt.enableOutbound,
      takt.enableFiles,
      takt.enable404,
      takt.enableTagged,
    ]) {
      expect(() => enable()()).not.toThrow()
    }
  })

  it('les émetteurs ne lèvent jamais', () => {
    const takt = noopTakt()
    expect(() => takt.track('Evt', { props: { plan: 'pro' } })).not.toThrow()
    expect(() => takt.pageview()).not.toThrow()
    expect(() => takt.optOut()).not.toThrow()
    expect(() => takt.optIn()).not.toThrow()
  })

  it('optOut() et optIn() écrivent le consentement du cœur avant tout montage', () => {
    const takt = noopTakt()
    takt.optOut()
    expect(isOptedOut()).toBe(true)
    expect(takt.isOptedOut()).toBe(true)
    takt.optIn()
    expect(isOptedOut()).toBe(false)
    expect(takt.isOptedOut()).toBe(false)
  })

  it('isOptedOut() lit le consentement du cœur', () => {
    localStorage.setItem('takt_ignore', '1')
    expect(noopTakt().isOptedOut()).toBe(true)
    localStorage.removeItem('takt_ignore')
    expect(noopTakt().isOptedOut()).toBe(false)
  })

  it('avertit une seule fois en console', async () => {
    // Registre de modules neuf : le drapeau « déjà averti » vit au niveau module.
    vi.resetModules()
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const { noopTakt: fresh } = await import('../src/lib/noop')
    fresh()
    fresh()
    expect(warn).toHaveBeenCalledTimes(1)
    expect(String(warn.mock.calls[0]?.[0])).toContain('[takt]')
  })
})
