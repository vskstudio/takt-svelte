<svelte:options
  customElement={{
    props: {
      domain: { type: 'String' },
      endpoint: { type: 'String' },
      scriptOrigin: { type: 'String', attribute: 'script-origin' },
      outbound: { type: 'Boolean' },
      files: { type: 'Boolean' },
      track404: { type: 'Boolean', attribute: 'track-404' },
      // String, not Boolean: an absent attribute must keep the JS default `true`.
      // Boolean coerces absence to false, silently disabling the privacy defaults.
      spa: { type: 'String' },
      respectDnt: { type: 'String' },
      excludeLocalhost: { type: 'String' },
      enabled: { type: 'String' },
      sampleRate: { type: 'String', attribute: 'sample-rate' },
      trackQuery: { type: 'String', attribute: 'track-query' },
      queryParams: { type: 'String', attribute: 'query-params' },
      tagged: { type: 'Boolean' },
    },
  }}
/>

<script lang="ts">
  import { onMount } from 'svelte'
  import { createTakt } from '@vskstudio/takt-core'

  interface Props {
    domain?: string
    endpoint?: string
    scriptOrigin?: string
    outbound?: boolean
    files?: boolean
    track404?: boolean
    spa?: boolean | string
    respectDnt?: boolean | string
    excludeLocalhost?: boolean | string
    enabled?: boolean | string
    sampleRate?: string
    trackQuery?: boolean | string
    queryParams?: string
    tagged?: boolean
  }

  let {
    domain,
    endpoint,
    scriptOrigin,
    outbound = false,
    files = false,
    track404 = false,
    spa = true,
    respectDnt = true,
    excludeLocalhost = true,
    enabled,
    sampleRate,
    trackQuery,
    queryParams,
    tagged = false,
  }: Props = $props()

  const truthy = (v: boolean | string) => v !== false && v !== 'false' && v !== '0'

  onMount(() => {
    const parsedEnabled = enabled !== undefined ? truthy(enabled) : undefined
    const parsed = sampleRate !== undefined ? parseFloat(sampleRate) : NaN
    const parsedSampleRate = Number.isFinite(parsed) ? parsed : undefined
    const parsedTrackQuery = trackQuery !== undefined ? truthy(trackQuery) : undefined
    const parsedQueryParams =
      queryParams !== undefined
        ? queryParams.split(',').map((s) => s.trim()).filter(Boolean)
        : undefined

    const takt = createTakt({
      domain,
      endpoint,
      scriptOrigin,
      respectDnt: truthy(respectDnt),
      excludeLocalhost: truthy(excludeLocalhost),
      enabled: parsedEnabled,
      sampleRate: parsedSampleRate,
      trackQuery: parsedTrackQuery,
      queryParams: parsedQueryParams,
    })
    const disposers: VoidFunction[] = []
    if (truthy(spa)) disposers.push(takt.enableSpa())
    if (outbound) disposers.push(takt.enableOutbound())
    if (files) disposers.push(takt.enableFiles())
    if (track404) disposers.push(takt.enable404())
    if (tagged) disposers.push(takt.enableTagged())
    takt.pageview()
    return () => disposers.forEach((dispose) => dispose())
  })
</script>
