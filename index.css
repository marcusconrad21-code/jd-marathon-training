export default async function handler(req, res) {
  const { refresh_token } = req.query || {}
  if (!refresh_token) return res.status(400).json({ error: 'Missing refresh_token' })

  const clientId     = process.env.STRAVA_CLIENT_ID
  const clientSecret = process.env.STRAVA_CLIENT_SECRET
  if (!clientId || !clientSecret) return res.status(500).json({ error: 'Missing Strava env vars' })

  try {
    const r = await fetch('https://www.strava.com/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id:     clientId,
        client_secret: clientSecret,
        refresh_token,
        grant_type:    'refresh_token',
      }),
    })
    const data = await r.json()
    if (!r.ok) return res.status(400).json({ error: 'Token refresh failed' })
    return res.status(200).json({
      access_token:  data.access_token,
      refresh_token: data.refresh_token,
      expires_at:    data.expires_at,
    })
  } catch (e) {
    return res.status(500).json({ error: e.message })
  }
}
