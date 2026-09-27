import { describe, it, expect } from 'vitest'
import * as core from '@vskstudio/takt-core'
import * as root from '../src/lib/index'
import * as actions from '../src/lib/actions/index'

describe('réexports du consentement', () => {
  it('la racine réexporte optOut, optIn et isOptedOut du cœur', () => {
    expect(root.optOut).toBe(core.optOut)
    expect(root.optIn).toBe(core.optIn)
    expect(root.isOptedOut).toBe(core.isOptedOut)
  })

  it('le sous-chemin actions réexporte isOptedOut à côté de optOut et optIn', () => {
    expect(actions.optOut).toBe(core.optOut)
    expect(actions.optIn).toBe(core.optIn)
    expect(actions.isOptedOut).toBe(core.isOptedOut)
  })
})
