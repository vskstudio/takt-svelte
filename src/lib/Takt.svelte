<script lang="ts">
  import { onMount } from 'svelte'
  import { createTakt } from '@vskstudio/takt-core'
  import { provideTakt, taktStore } from './store'

  export let domain: string | undefined = undefined
  export let endpoint: string | undefined = undefined
  export let outbound = false
  export let files: boolean | string[] = false
  export let spa = true
  export let respectDnt = true
  export let excludeLocalhost = true

  // Set context synchronously during init; populated after mount (SSR-safe:
  // createTakt touches window, so it must only run in the browser via onMount).
  const contextStore = provideTakt()

  onMount(() => {
    const takt = createTakt({ domain, endpoint, respectDnt, excludeLocalhost })
    const disposers: Array<() => void> = []
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
