import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render } from '@testing-library/svelte'

vi.mock('@vskstudio/takt-core', () => ({
  track: vi.fn(),
  init: vi.fn(),
  pageview: vi.fn(),
  optOut: vi.fn(),
  optIn: vi.fn(),
}))

import { taktEvent } from '../src/lib/actions/taktEvent'
import TaktEventFixture from './fixtures/TaktEventFixture.svelte'
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

  it('forwards revenue on click', () => {
    const node = document.createElement('button')
    taktEvent(node, { name: 'Purchase', revenue: { amount: '29.00', currency: 'EUR' } })
    node.click()
    expect(track).toHaveBeenCalledWith('Purchase', {
      revenue: { amount: '29.00', currency: 'EUR' },
    })
  })

  it('forwards both props and revenue', () => {
    const node = document.createElement('button')
    taktEvent(node, {
      name: 'Purchase',
      props: { plan: 'pro' },
      revenue: { amount: '29.00', currency: 'EUR' },
    })
    node.click()
    expect(track).toHaveBeenCalledWith('Purchase', {
      props: { plan: 'pro' },
      revenue: { amount: '29.00', currency: 'EUR' },
    })
  })

  it('reacts to parameter updates', () => {
    const node = document.createElement('button')
    const action = taktEvent(node, { name: 'A' })
    action.update({ name: 'B', props: { x: '1' } })
    node.click()
    expect(track).toHaveBeenCalledWith('B', { props: { x: '1' } })
  })

  it('reacts to reactive parameter changes through use: (real Svelte wiring)', async () => {
    const { getByTestId, rerender } = render(TaktEventFixture, {
      props: { params: { name: 'A' } },
    })
    const btn = getByTestId('btn')
    btn.click()
    expect(track).toHaveBeenLastCalledWith('A', undefined)

    await rerender({ params: { name: 'B', props: { x: '1' } } })
    btn.click()
    expect(track).toHaveBeenLastCalledWith('B', { props: { x: '1' } })
  })

  it('removes the listener on destroy', () => {
    const node = document.createElement('button')
    const action = taktEvent(node, { name: 'A' })
    action.destroy()
    node.click()
    expect(track).not.toHaveBeenCalled()
  })
})
