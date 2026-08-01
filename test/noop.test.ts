import { describe, it, expect, vi, afterEach } from 'vitest'
import { createTakt } from '@vskstudio/takt-core'
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

describe('noopTakt', () => {
  afterEach(() => vi.restoreAllMocks())

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
