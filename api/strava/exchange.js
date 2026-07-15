export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })
  const { code } = req.query
  if (!code) return res.status(400).json({ error: 'Missing code' })
  const clientId     = process.env.STRAVA_CLIENT_ID
  const clientSecret = process.env.STRAVA_CLIENT_SECRET
  if (!clientId || !clientSecret) return res.status(500).json({ error: 'Strava credentials not configured in Vercel environment variables.' })
  try {
    const response = await fetch('https://www.strava.com/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ client_id: clientId, client_secret: clientSecret, code, grant_type: 'authorization_code' }),
    })
    if (!response.ok) { const err = await response.text(); return res.status(400).json({ error: 'Strava rejected the code', detail: err }) }
    const data = await response.json()
    return res.status(200).json({ access_token: data.access_token, refresh_token: data.refresh_token, expires_at: data.expires_at, athlete: data.athlete })
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error' })
  }
}
