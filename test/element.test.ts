import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@vskstudio/takt-core', () => ({
  createTakt: vi.fn(() => ({
    enableSpa: vi.fn(() => vi.fn()),
    enableOutbound: vi.fn(() => vi.fn()),
    enableFiles: vi.fn(() => vi.fn()),
    pageview: vi.fn(),
    track: vi.fn(),
    optOut: vi.fn(),
    optIn: vi.fn(),
  })),
}))

describe('<takt-analytics> registration', () => {
  beforeEach(() => vi.clearAllMocks())

  it('defineTaktElement registers the custom element and is idempotent', async () => {
    const { defineTaktElement } = await import('../src/lib/element/index')
    expect(() => defineTaktElement()).not.toThrow()
    expect(customElements.get('takt-analytics')).toBeTruthy()
  })
})
