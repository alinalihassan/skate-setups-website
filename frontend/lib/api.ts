import type { Setup, CurrentSetupsResponse, SetupsResponse } from './types'

export async function fetchCurrentSetups(): Promise<CurrentSetupsResponse> {
  try {
    const res = await fetch('/api/setups/current')
    if (!res.ok) return { skateboard: null, shoe: null }
    return (await res.json()) as CurrentSetupsResponse
  } catch (error) {
    console.error('Error fetching current setups:', error)
    return { skateboard: null, shoe: null }
  }
}

export async function fetchAllSetups(type?: string): Promise<SetupsResponse> {
  try {
    const url = type && type !== 'all' ? `/api/setups?type=${type}` : '/api/setups'
    const res = await fetch(url)
    if (!res.ok) return { setups: [], pagination: { page: 1, limit: 12, total: 0, pages: 0 } }
    return (await res.json()) as SetupsResponse
  } catch (error) {
    console.error('Error fetching setups:', error)
    return { setups: [], pagination: { page: 1, limit: 12, total: 0, pages: 0 } }
  }
}

export async function fetchSetupById(id: string): Promise<Setup | null> {
  try {
    const res = await fetch(`/api/setups/${id}`)
    if (!res.ok) return null
    return (await res.json()) as Setup
  } catch (error) {
    console.error('Error fetching setup:', error)
    return null
  }
}
