<svelte:options
  customElement={{
    props: {
      domain: { type: 'String' },
      endpoint: { type: 'String' },
      outbound: { type: 'Boolean' },
      files: { type: 'Boolean' },
      spa: { type: 'Boolean' },
      respectDnt: { type: 'Boolean' },
      excludeLocalhost: { type: 'Boolean' },
    },
  }}
/>

<script lang="ts">
  import { onMount } from 'svelte'
  import { createTakt } from '@vskstudio/takt-core'

  export let domain: string | undefined = undefined
  export let endpoint: string | undefined = undefined
  export let outbound = false
  export let files = false
  export let spa = true
  export let respectDnt = true
  export let excludeLocalhost = true

  onMount(() => {
    const takt = createTakt({ domain, endpoint, respectDnt, excludeLocalhost })
    const disposers: Array<() => void> = []
    if (spa) disposers.push(takt.enableSpa())
    if (outbound) disposers.push(takt.enableOutbound())
    if (files) disposers.push(takt.enableFiles())
    takt.pageview()
    return () => disposers.forEach((dispose) => dispose())
  })
</script>
