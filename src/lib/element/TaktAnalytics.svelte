<svelte:options
  customElement={{
    props: {
      domain: { type: 'String' },
      endpoint: { type: 'String' },
      scriptOrigin: { type: 'String', attribute: 'script-origin' },
      outbound: { type: 'Boolean' },
      files: { type: 'Boolean' },
      // String, not Boolean: an absent attribute must keep the JS default `true`.
      // Boolean coerces absence to false, silently disabling the privacy defaults.
      spa: { type: 'String' },
      respectDnt: { type: 'String' },
      excludeLocalhost: { type: 'String' },
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
    spa?: boolean | string
    respectDnt?: boolean | string
    excludeLocalhost?: boolean | string
  }

  let {
    domain,
    endpoint,
    scriptOrigin,
    outbound = false,
    files = false,
    spa = true,
    respectDnt = true,
    excludeLocalhost = true,
  }: Props = $props()

  const truthy = (v: boolean | string) => v !== false && v !== 'false' && v !== '0'

  onMount(() => {
    const takt = createTakt({
      domain,
      endpoint,
      scriptOrigin,
      respectDnt: truthy(respectDnt),
      excludeLocalhost: truthy(excludeLocalhost),
    })
    const disposers: VoidFunction[] = []
    if (truthy(spa)) disposers.push(takt.enableSpa())
    if (outbound) disposers.push(takt.enableOutbound())
    if (files) disposers.push(takt.enableFiles())
    takt.pageview()
    return () => disposers.forEach((dispose) => dispose())
  })
</script>
