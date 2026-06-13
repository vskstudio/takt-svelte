<script lang="ts">
  import { embedUrl, type EmbedTheme, type WidgetLang } from '@vskstudio/takt-core'
  import type { HTMLIframeAttributes } from 'svelte/elements'

  interface Props extends Omit<HTMLIframeAttributes, 'src'> {
    /** Site identifier the embed reports stats for. */
    domain: string
    /** Color theme of the embedded dashboard. */
    theme?: EmbedTheme
    /** Embed language. */
    lang?: WidgetLang
    /** Override the Takt host serving the embed. */
    host?: string
    width?: number
    height?: number
    title?: string
  }

  let {
    domain,
    theme,
    lang,
    host,
    width = 404,
    height = 264,
    title = 'takt',
    ...rest
  }: Props = $props()

  const src = $derived(embedUrl(domain, { theme, lang, host }))
</script>

<iframe {src} {title} {width} {height} loading="lazy" style="border:0" {...rest}></iframe>
