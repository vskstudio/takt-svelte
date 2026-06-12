<script lang="ts">
  import { taktEvent, type TaktEventParams } from '../../src/lib/actions/taktEvent'

  // Reactive prop: changing it drives the action's update() through Svelte's
  // real reactivity, exercising the wiring a user relies on.
  let { params }: { params: TaktEventParams } = $props()
</script>

<button data-testid="btn" use:taktEvent={params}>go</button>
