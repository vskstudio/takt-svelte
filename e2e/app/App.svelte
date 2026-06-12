<script lang="ts">
  import { Takt } from '@vskstudio/takt-svelte'
  import { taktEvent } from '@vskstudio/takt-svelte/actions'

  // excludeLocalhost is forced off: the e2e server runs on localhost, where core
  // otherwise suppresses every event. Takt is headless (no slot), so the tracked
  // elements sit alongside it and reach core via the global instance it registers.
</script>

<Takt domain="example.com" endpoint="/api/event" excludeLocalhost={false} />

<h1>Takt Svelte e2e</h1>
<button id="signup" use:taktEvent={{ name: 'Signup', props: { plan: 'pro' } }}>
  Sign up
</button>
<a
  id="nav"
  href="/about"
  on:click|preventDefault={() => history.pushState({}, '', '/about')}
>
  About
</a>
