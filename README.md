# MC Marathon Training App

Jack Daniels Plan B · VDOT 47.4 · Charlotte Marathon Nov 14 2026

## Quick Deploy to Vercel

1. Upload all files to GitHub (drag into your repo on github.com)
2. Go to vercel.com → your project → Settings → General:
   - Root Directory: leave BLANK
   - Framework Preset: Vite
   - Build Command: `npm install && npm run build`
   - Output Directory: `dist`
3. Settings → Environment Variables — add:
   | Name | Value |
   |------|-------|
   | `STRAVA_CLIENT_ID` | your number from strava.com/settings/api |
   | `STRAVA_CLIENT_SECRET` | your secret from strava.com/settings/api |
   | `VITE_STRAVA_CLIENT_ID` | same number as above |
4. Deployments → Redeploy
5. Update strava.com/settings/api → Authorization Callback Domain → your vercel domain

## Add to iPhone Home Screen
1. Open your Vercel URL in Safari on iPhone
2. Tap Share (↑) → Add to Home Screen
3. Done — opens full-screen like a native app

## Your Paces (from spreadsheet)
- Easy: 8:34–9:49/mi
- Marathon: 7:30–7:55/mi  
- Threshold: 7:03–7:25/mi
- Interval: 4:04/km
- Reps: 46s/200m · 92s/400m
