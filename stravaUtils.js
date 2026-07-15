export default async function handler(req, res) {
  const { code } = req.query || {}

  if (!code) {
    return res.status(400).json({ error: 'Missing code' })
  }

  const clientId     = process.env.STRAVA_CLIENT_ID
  const clientSecret = process.env.STRAVA_CLIENT_SECRET

  if (!clientId || !clientSecret) {
    return res.status(500).json({
      error: `Missing env vars: ${!clientId ? 'STRAVA_CLIENT_ID ' : ''}${!clientSecret ? 'STRAVA_CLIENT_SECRET' : ''}`
    })
  }

  try {
    const r = await fetch('https://www.strava.com/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id:     clientId,
        client_secret: clientSecret,
        code,
        grant_type:    'authorization_code',
      }),
    })
    const data = await r.json()
    if (!r.ok) {
      return res.status(400).json({ error: data.message || 'Strava token exchange failed', detail: data })
    }
    return res.status(200).json({
      access_token:  data.access_token,
      refresh_token: data.refresh_token,
      expires_at:    data.expires_at,
      athlete:       data.athlete,
    })
  } catch (e) {
    return res.status(500).json({ error: e.message })
  }
}
