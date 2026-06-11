import { SvelteComponent } from 'svelte'

export interface TaktAnalyticsProps {
  domain?: string
  endpoint?: string
  outbound?: boolean
  files?: boolean
  spa?: boolean
  respectDnt?: boolean
  excludeLocalhost?: boolean
}

export default class TaktAnalytics extends SvelteComponent<TaktAnalyticsProps> {}
