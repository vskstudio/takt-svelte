import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/svelte'

import TaktBadge from '../src/lib/TaktBadge.svelte'

describe('<TaktBadge />', () => {
  it('renders an <img> whose src reflects domain and options', () => {
    const { container } = render(TaktBadge, {
      props: { domain: 'exemple.fr', variant: 'd', glyph: 'unplug', lang: 'fr' },
    })
    const img = container.querySelector('img')!
    expect(img).toBeTruthy()
    expect(img.getAttribute('alt')).toBe('takt')
    const url = new URL(img.src)
    expect(url.pathname).toContain('exemple.fr/badge.svg')
    expect(url.searchParams.get('variant')).toBe('d')
    expect(url.searchParams.get('glyph')).toBe('unplug')
  })

  it('passes through class via rest props', () => {
    const { container } = render(TaktBadge, { props: { domain: 'exemple.fr', class: 'badge' } })
    expect(container.querySelector('img')!.getAttribute('class')).toBe('badge')
  })
})
