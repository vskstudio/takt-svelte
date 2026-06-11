<svelte:options
  customElement={{
    props: {
      domain: { type: 'String' },
      endpoint: { type: 'String' },
      outbound: { type: 'Boolean' },
      files: { type: 'Boolean' },
      // String-typed (not Boolean): an ABSENT attribute must leave the JS
      // default `true` intact. With `{ type: 'Boolean' }`, absence coerces to
      // false, which would silently disable SPA + the privacy defaults. These
      // are opt-OUT via the explicit string value "false".
      spa: { type: 'String' },
      respectDnt: { type: 'String' },
      excludeLocalhost: { type: 'String' },
    },
  }}
/>

<script lang="ts">
  import { onMount } from 'svelte'
  import { createTakt } from '@vskstudio/takt-core'

  export let domain: string | undefined = undefined
  export let endpoint: string | undefined = undefined
  export let outbound = false
  // Web-component attributes are string/boolean only — unlike <Takt />, the
  // element cannot take a file-extension array; enableFiles() uses core defaults.
  export let files = false
  // String-or-boolean: default true, disabled only by the string "false".
  export let spa: unknown = true
  export let respectDnt: unknown = true
  export let excludeLocalhost: unknown = true

  // An absent string attribute leaves the JS default (`true`); an explicit
  // "false" (or 0 / "0" / false) disables. Anything else is truthy.
  const truthy = (v: unknown): boolean => v !== false && v !== 'false' && v !== 0 && v !== '0'

  onMount(() => {
    const takt = createTakt({
      domain,
      endpoint,
      respectDnt: truthy(respectDnt),
      excludeLocalhost: truthy(excludeLocalhost),
    })
    const disposers: Array<() => void> = []
    if (truthy(spa)) disposers.push(takt.enableSpa())
    if (outbound) disposers.push(takt.enableOutbound())
    if (files) disposers.push(takt.enableFiles())
    takt.pageview()
    return () => disposers.forEach((dispose) => dispose())
  })
</script>
