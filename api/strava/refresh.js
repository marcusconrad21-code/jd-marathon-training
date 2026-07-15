export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })
  const { refresh_token } = req.query
  if (!refresh_token) return res.status(400).json({ error: 'Missing refresh_token' })
  const clientId     = process.env.STRAVA_CLIENT_ID
  const clientSecret = process.env.STRAVA_CLIENT_SECRET
  if (!clientId || !clientSecret) return res.status(500).json({ error: 'Strava credentials not configured' })
  try {
    const response = await fetch('https://www.strava.com/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ client_id: clientId, client_secret: clientSecret, refresh_token, grant_type: 'refresh_token' }),
    })
    if (!response.ok) return res.status(400).json({ error: 'Token refresh failed' })
    const data = await response.json()
    return res.status(200).json({ access_token: data.access_token, refresh_token: data.refresh_token, expires_at: data.expires_at })
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error' })
  }
}
