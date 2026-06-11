import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@vskstudio/takt-core', () => ({
  track: vi.fn(),
  init: vi.fn(),
  pageview: vi.fn(),
  optOut: vi.fn(),
  optIn: vi.fn(),
}))

import { taktEvent } from '../src/lib/actions/taktEvent'
import * as core from '@vskstudio/takt-core'

const track = vi.mocked(core.track)

describe('taktEvent action', () => {
  beforeEach(() => vi.clearAllMocks())

  it('tracks on click with the configured name and props', () => {
    const node = document.createElement('button')
    taktEvent(node, { name: 'Signup', props: { plan: 'pro' } })
    node.click()
    expect(track).toHaveBeenCalledWith('Signup', { props: { plan: 'pro' } })
  })

  it('reacts to parameter updates', () => {
    const node = document.createElement('button')
    const action = taktEvent(node, { name: 'A' })
    action.update?.({ name: 'B', props: { x: '1' } })
    node.click()
    expect(track).toHaveBeenCalledWith('B', { props: { x: '1' } })
  })

  it('removes the listener on destroy', () => {
    const node = document.createElement('button')
    const action = taktEvent(node, { name: 'A' })
    action.destroy?.()
    node.click()
    expect(track).not.toHaveBeenCalled()
  })
})
