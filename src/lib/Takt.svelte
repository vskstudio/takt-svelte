<script lang="ts">
  import { onMount } from 'svelte'
  import { createTakt } from '@vskstudio/takt-core'
  import { provideTakt, taktStore } from './store'

  interface Props {
    domain?: string
    endpoint?: string
    outbound?: boolean
    files?: boolean | string[]
    spa?: boolean
    respectDnt?: boolean
    excludeLocalhost?: boolean
  }

  let {
    domain,
    endpoint,
    outbound = false,
    files = false,
    spa = true,
    respectDnt = true,
    excludeLocalhost = true,
  }: Props = $props()

  const contextStore = provideTakt()

  onMount(() => {
    const takt = createTakt({ domain, endpoint, respectDnt, excludeLocalhost })
    const disposers: VoidFunction[] = []
    if (spa) disposers.push(takt.enableSpa())
    if (outbound) disposers.push(takt.enableOutbound())
    if (files) disposers.push(takt.enableFiles(Array.isArray(files) ? files : undefined))
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
