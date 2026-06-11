<script lang="ts">
  import { taktEvent, type TaktEventParams } from '../../src/lib/actions/taktEvent'

  // `params` is a reactive prop: changing it drives the action's update()
  // through Svelte's real reactivity, exercising the wiring a user relies on
  // (not the manual action.update() call a unit test would fake).
  export let params: TaktEventParams
</script>

<button data-testid="btn" use:taktEvent={params}>go</button>
