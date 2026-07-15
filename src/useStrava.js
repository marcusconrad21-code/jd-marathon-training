import { useState, useEffect, useCallback } from 'react'
const CLIENT_ID   = import.meta.env.VITE_STRAVA_CLIENT_ID || ''
const REDIRECT    = `${window.location.origin}/api/strava/callback`
const K_TOKEN     = 'strava_access_token'
const K_REFRESH   = 'strava_refresh_token'
const K_EXPIRY    = 'strava_token_expiry'
const K_ATHLETE   = 'strava_athlete'
const K_ACTS      = 'strava_acts_cache'

export function useStrava() {
  const [connected,   setConnected]   = useState(false)
  const [athlete,     setAthlete]     = useState(null)
  const [activities,  setActivities]  = useState([])
  const [detailCache, setDetailCache] = useState({})
  const [syncing,     setSyncing]     = useState(false)
  const [error,       setError]       = useState(null)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const code   = params.get('code')
    if (code) { exchangeCode(code); window.history.replaceState({},document.title,window.location.pathname); return }
    const token  = localStorage.getItem(K_TOKEN)
    const expiry = parseInt(localStorage.getItem(K_EXPIRY)||'0')
    const saved  = localStorage.getItem(K_ATHLETE)
    const cache  = localStorage.getItem(K_ACTS)
    if (token && expiry > Date.now()/1000) {
      setConnected(true)
      if (saved) setAthlete(JSON.parse(saved))
      if (cache) setActivities(JSON.parse(cache))
    } else if (localStorage.getItem(K_REFRESH)) { refreshToken() }
  }, [])

  const connectStrava = useCallback(() => {
    if (!CLIENT_ID) { setError('Add VITE_STRAVA_CLIENT_ID to Vercel environment variables.'); return }
    const url = new URL('https://www.strava.com/oauth/authorize')
    url.searchParams.set('client_id', CLIENT_ID)
    url.searchParams.set('redirect_uri', REDIRECT)
    url.searchParams.set('response_type', 'code')
    url.searchParams.set('approval_prompt', 'auto')
    url.searchParams.set('scope', 'read,activity:read_all')
    window.location.href = url.toString()
  }, [])

  const exchangeCode = useCallback(async (code) => {
    setSyncing(true); setError(null)
    try {
      const res = await fetch(`/api/strava/exchange?code=${code}`)
      if (!res.ok) throw new Error()
      const data = await res.json()
      saveToken(data); setConnected(true); setAthlete(data.athlete)
    } catch { setError('Could not connect to Strava. Please try again.') }
    finally   { setSyncing(false) }
  }, [])

  const refreshToken = useCallback(async () => {
    const rt = localStorage.getItem(K_REFRESH); if (!rt) return
    try {
      const res = await fetch(`/api/strava/refresh?refresh_token=${rt}`)
      if (!res.ok) throw new Error()
      const data = await res.json(); saveToken(data); setConnected(true)
    } catch { disconnect() }
  }, [])

  const syncActivities = useCallback(async () => {
    const token = localStorage.getItem(K_TOKEN); if (!token) return
    setSyncing(true); setError(null)
    try {
      const after = Math.floor((Date.now()-180*24*60*60*1000)/1000)
      const res   = await fetch(`https://www.strava.com/api/v3/athlete/activities?per_page=100&after=${after}`,{headers:{Authorization:`Bearer ${token}`}})
      if (!res.ok) { if(res.status===401){await refreshToken();return} throw new Error() }
      const all  = await res.json()
      const runs = all.filter(a=>a.type==='Run'||a.sport_type==='Run')
      setActivities(runs); localStorage.setItem(K_ACTS,JSON.stringify(runs))
    } catch { setError('Could not fetch Strava activities.') }
    finally   { setSyncing(false) }
  }, [refreshToken])

  const fetchDetail = useCallback(async (id) => {
    if (detailCache[id]) return detailCache[id]
    const token = localStorage.getItem(K_TOKEN); if (!token) return null
    try {
      const [dRes,zRes] = await Promise.all([
        fetch(`https://www.strava.com/api/v3/activities/${id}?include_all_efforts=true`,{headers:{Authorization:`Bearer ${token}`}}),
        fetch(`https://www.strava.com/api/v3/activities/${id}/zones`,{headers:{Authorization:`Bearer ${token}`}}),
      ])
      const detail = dRes.ok ? await dRes.json() : null
      const zones  = zRes.ok ? await zRes.json() : null
      if (detail) { const full={...detail,zones}; setDetailCache(p=>({...p,[id]:full})); return full }
    } catch {}
    return null
  }, [detailCache])

  const matchActivity = useCallback((isoDate) => {
    return activities.find(a=>a.start_date_local?.startsWith(isoDate))||null
  }, [activities])

  const disconnect = useCallback(() => {
    [K_TOKEN,K_REFRESH,K_EXPIRY,K_ATHLETE,K_ACTS].forEach(k=>localStorage.removeItem(k))
    setConnected(false); setAthlete(null); setActivities([]); setDetailCache({})
  }, [])

  return { connected, athlete, activities, syncing, error, connectStrava, syncActivities, matchActivity, fetchDetail, disconnect }
}

function saveToken(data) {
  localStorage.setItem(K_TOKEN,  data.access_token)
  localStorage.setItem(K_REFRESH,data.refresh_token)
  localStorage.setItem(K_EXPIRY, data.expires_at)
  if (data.athlete) localStorage.setItem(K_ATHLETE,JSON.stringify(data.athlete))
}
