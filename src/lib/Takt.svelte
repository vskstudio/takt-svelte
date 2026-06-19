<script lang="ts">
  import { onMount } from 'svelte'
  import { createTakt } from '@vskstudio/takt-core'
  import { provideTakt, taktStore } from './store'

  interface Props {
    /** Site identifier sent with every event. Defaults to `location.hostname`. */
    domain?: string
    /** Ingestion endpoint. Defaults to `/api/event`. */
    endpoint?: string
    /** First-party origin to derive the endpoint from (`{origin}/api/event`). Endpoint wins over it. */
    scriptOrigin?: string
    /** Auto-track outbound link clicks. */
    outbound?: boolean
    /** Auto-track file downloads. Pass an array to restrict to those extensions. */
    files?: boolean | string[]
    /** Track SPA navigations (history pushState/replaceState + popstate). */
    spa?: boolean
    /** Report a `404` event when the page is an error page (`[data-takt-404]` / `<meta name="takt:404">` marker, or a 404 HTTP status). */
    track404?: boolean
    /** Suppress events when the browser's Do Not Track is enabled. */
    respectDnt?: boolean
    /** Suppress events on localhost and private IP ranges. */
    excludeLocalhost?: boolean
    /** Master on/off switch — set to `false` to disable all tracking. */
    enabled?: boolean
    /** Fraction of sessions to sample (0–1). */
    sampleRate?: number
    /** Preserve the query string in page URLs. */
    trackQuery?: boolean
    /** Query params to preserve when `trackQuery` is false (allowlist). */
    queryParams?: string[]
    /** Transform each URL before it is sent (dev-controlled; function prop only). */
    scrubUrl?: (url: string) => string
    /** Call `enableTagged()` to auto-track `[data-takt-event]` elements. */
    tagged?: boolean
  }

  let {
    domain,
    endpoint,
    scriptOrigin,
    outbound = false,
    files = false,
    spa = true,
    track404 = false,
    respectDnt = true,
    excludeLocalhost = true,
    enabled,
    sampleRate,
    trackQuery,
    queryParams,
    scrubUrl,
    tagged = false,
  }: Props = $props()

  const contextStore = provideTakt()

  onMount(() => {
    const takt = createTakt({ domain, endpoint, scriptOrigin, respectDnt, excludeLocalhost, enabled, sampleRate, trackQuery, queryParams, scrubUrl })
    const disposers: VoidFunction[] = []
    if (spa) disposers.push(takt.enableSpa())
    if (outbound) disposers.push(takt.enableOutbound())
    if (files) disposers.push(takt.enableFiles(Array.isArray(files) ? files : undefined))
    if (track404) disposers.push(takt.enable404())
    if (tagged) disposers.push(takt.enableTagged())
    takt.pageview()

    contextStore.set(takt)
    taktStore.set(takt)

    return () => {
      disposers.forEach((dispose) => dispose())
      contextStore.set(null)
      taktStore.set(null)
    }
  })
</script>
