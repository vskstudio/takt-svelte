import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/svelte'

import TaktEmbed from '../src/lib/TaktEmbed.svelte'

describe('<TaktEmbed />', () => {
  it('renders an <iframe> whose src reflects domain and options', () => {
    const { container } = render(TaktEmbed, {
      props: { domain: 'exemple.fr', theme: 'dark', lang: 'fr' },
    })
    const iframe = container.querySelector('iframe')!
    expect(iframe).toBeTruthy()
    const url = new URL(iframe.src)
    expect(url.pathname).toContain('embed/exemple.fr')
    expect(url.searchParams.get('theme')).toBe('dark')
  })

  it('applies default width, height and title', () => {
    const { container } = render(TaktEmbed, { props: { domain: 'exemple.fr' } })
    const iframe = container.querySelector('iframe')!
    expect(iframe.getAttribute('width')).toBe('404')
    expect(iframe.getAttribute('height')).toBe('264')
    expect(iframe.getAttribute('title')).toBe('takt')
  })

  it('sets a default referrerpolicy', () => {
    const { container } = render(TaktEmbed, { props: { domain: 'exemple.fr' } })
    const iframe = container.querySelector('iframe')!
    expect(iframe.getAttribute('referrerpolicy')).toBe('strict-origin-when-cross-origin')
  })

  it('does not let a consumer-passed src override the built URL', () => {
    const { container } = render(TaktEmbed, {
      props: { domain: 'exemple.fr', src: 'https://evil.example/x' } as never,
    })
    const iframe = container.querySelector('iframe')!
    const url = new URL(iframe.src)
    expect(url.pathname).toContain('embed/exemple.fr')
    expect(iframe.src).not.toContain('evil.example')
  })
})
