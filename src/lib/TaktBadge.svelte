<script lang="ts">
  import { badgeUrl, type BadgeVariant, type BadgeGlyph, type WidgetLang } from '@vskstudio/takt-core'
  import type { HTMLImgAttributes } from 'svelte/elements'

  interface Props extends Omit<HTMLImgAttributes, 'src' | 'alt'> {
    /** Site identifier the badge reports stats for. */
    domain: string
    /** Visual variant of the badge. */
    variant?: BadgeVariant
    /** Glyph rendered on the badge. */
    glyph?: BadgeGlyph
    /** Badge label language. */
    lang?: WidgetLang
    /** Override the Takt host serving the badge. */
    host?: string
  }

  let { domain, variant, glyph, lang, host, ...rest }: Props = $props()

  const src = $derived(badgeUrl(domain, { variant, glyph, lang, host }))
</script>

<img alt="takt" loading="lazy" decoding="async" {...rest} {src} />
