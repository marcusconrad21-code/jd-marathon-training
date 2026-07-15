import { buildPaces } from './paces.js'

// ─── Marcus's pace targets from DanielsTables spreadsheet ──────
export const YOUR_PACES = {
  E:  { low: '8:34', high: '9:49', desc: 'Zone 2 — comfortable, conversational, rhythmic breathing' },
  M:  { low: '7:30', high: '7:55', desc: 'Marathon goal pace' },
  T:  { low: '7:03', high: '7:25', desc: 'Threshold / comfortably hard (4:22–4:36/km)' },
  I:  { per1k: '4:04', perMile: '6:33', desc: 'Interval — hard effort' },
  R:  { per200: '46s', per400: '92s', desc: 'Rep pace — fast, controlled, full recovery' },
}

// ─── YOUR EXACT SCHEDULE from "Training Plan 2026 Charlotte Ma" ─
// Spreadsheet weeks 7–24. Each row: [Mon, Tue, Wed, Thu, Fri, Sat, Sun]
// Dates in spreadsheet: wk7 starts 46216 = Jul 6 2026
// Our app has 19 total weeks (lead-in + 18). We map:
//   wi=0  → lead-in (recovery, before your spreadsheet starts)
//   wi=1  → your spreadsheet week 7  (45 mi)
//   wi=2  → your spreadsheet week 8  (45 mi)
//   wi=3  → your spreadsheet week 9  (52 mi)
//   wi=4  → your spreadsheet week 10 (52 mi)
//   wi=5  → your spreadsheet week 11 (52 mi)
//   wi=6  → your spreadsheet week 12 (60 mi)
//   wi=7  → your spreadsheet week 13 (60 mi)
//   wi=8  → your spreadsheet week 14 (60 mi)
//   wi=9  → your spreadsheet week 15 (68 mi)
//   wi=10 → your spreadsheet week 16 (60 mi)
//   wi=11 → your spreadsheet week 17 (68 mi)
//   wi=12 → your spreadsheet week 18 (60 mi)
//   wi=13 → your spreadsheet week 19 (60 mi)
//   wi=14 → your spreadsheet week 20 (60 mi)
//   wi=15 → your spreadsheet week 21 (55 mi)
//   wi=16 → your spreadsheet week 22 (50 mi)
//   wi=17 → your spreadsheet week 23 (45 mi)
//   wi=18 → your spreadsheet week 24 (race week)

export const SCHEDULE = [
  // wi=0 lead-in / recovery week (before your spreadsheet starts)
  { miles: 35, days: ['REST','E+strides','E','E+strides','E','E','L'] },

  // wi=1 spreadsheet wk 7: 45 mi
  { miles: 45, days: ['E+strides','R-1','E','E+strides','E+strides','TLT-1','E'] },

  // wi=2 spreadsheet wk 8: 45 mi
  { miles: 45, days: ['E+strides','R-2','E','E+strides','Ti-1','L','E+strides'] },

  // wi=3 spreadsheet wk 9: 52 mi
  { miles: 52, days: ['E+strides','R-3','E','E+strides','E+strides','MP','E'] },

  // wi=4 spreadsheet wk 10: 52 mi
  { miles: 52, days: ['E','R-4','E+strides','E+strides','E+strides','TLT-2','E'] },

  // wi=5 spreadsheet wk 11: 52 mi
  { miles: 52, days: ['E+strides','R-5','E','E+strides','Ti-2','L','E'] },

  // wi=6 spreadsheet wk 12: 60 mi
  { miles: 60, days: ['E+strides','R-1','E','E+strides','E+strides','TLT-1','E'] },

  // wi=7 spreadsheet wk 13: 60 mi
  { miles: 60, days: ['E','I-1','E+strides','E','E','MP','E+strides'] },

  // wi=8 spreadsheet wk 14: 60 mi
  { miles: 60, days: ['E','I-2','E+strides','E','E+strides','L','E'] },

  // wi=9 spreadsheet wk 15: 68 mi
  { miles: 68, days: ['E','I-3','E+strides','E','E','TLT-2','E+strides'] },

  // wi=10 spreadsheet wk 16: 60 mi
  { miles: 60, days: ['E','I-4','E+strides','E','E','L','E+strides'] },

  // wi=11 spreadsheet wk 17: 68 mi
  { miles: 68, days: ['E','I-3','E+strides','E','E','MP','E+strides'] },

  // wi=12 spreadsheet wk 18: 60 mi
  { miles: 60, days: ['E','I-3','E+strides','E','E+strides','TL','E'] },

  // wi=13 spreadsheet wk 19: 60 mi
  { miles: 60, days: ['E','Ti-1','E','E','E','TLT','E'] },

  // wi=14 spreadsheet wk 20: 60 mi
  { miles: 60, days: ['E','T-1','E','E','E','L-1','E'] },

  // wi=15 spreadsheet wk 21: 55 mi
  { miles: 55, days: ['E','Ti-2','E','E','E','MP','E'] },

  // wi=16 spreadsheet wk 22: 50 mi
  { miles: 50, days: ['E','T-2','E','E','E','TL','E'] },

  // wi=17 spreadsheet wk 23: 45 mi
  { miles: 45, days: ['E','Ti-2','E','E','E','L-2','E'] },

  // wi=18 spreadsheet wk 24: race week
  { miles: 26, days: ['E-1','Ti-3','E-1','E-2','E-3','REST','RACE'] },
]

// Long run targets by week index (from spreadsheet descriptions)
const LONG_TARGETS = {
  0:  12,
  1:  11, // TLT-1
  2:  13, // L 11-13
  3:  10, // MP 1hr
  4:  12, // TLT-2
  5:  15, // L 13-15
  6:  11, // TLT-1
  7:  13, // MP 1.5hr
  8:  18, // L 16-18
  9:  16, // TLT-2
  10: 19, // L 17-19
  11: 13, // MP 1.5hr
  12: 14, // TL
  13: 13, // TLT
  14: 22, // L-1 19-22
  15: 15, // MP 2hr/15mi
  16: 14, // TL
  17: 15, // L-2 13-15
  18: 26.2,
}

export const PHASE_META = {
  0: { label: 'Lead-in',                    color: '#7C8B99', desc: 'Recovery week — shake out fatigue, establish the routine before the main block.' },
  1: { label: 'Phase I — Foundation',       color: '#3D6B52', desc: 'Weeks 7–12: Easy running, strides, and Rep workouts build raw speed and aerobic base.' },
  2: { label: 'Phase II — Early Quality',   color: '#4C6B8A', desc: 'Weeks 13–14: Intervals enter. MP long runs begin simulating race day.' },
  3: { label: 'Phase III — Peak Quality',   color: '#C8312F', desc: 'Weeks 15–18: Peak mileage. Intervals and threshold at full volume.' },
  4: { label: 'Phase IV — Sharpen & Taper', color: '#FF5A1F', desc: 'Weeks 19–23: Volume tapers, quality stays sharp. Trust the training.' },
  5: { label: 'Race Week',                  color: '#20242B', desc: 'Race week — stay loose, stay sharp. The hay is in the barn.' },
}

export const WIGGLE = {
  high:    { label: 'Pushing it',    mult: 1.05, color: '#C8312F', icon: '🔥', tip: 'Body feels strong, sleep is good. Add ~5% to easy runs.' },
  normal:  { label: 'On plan',       mult: 1.00, color: '#2F6F4E', icon: '✓',  tip: 'Stick to the prescribed mileage.' },
  easy:    { label: 'Backing off',   mult: 0.90, color: '#4C6B8A', icon: '↓',  tip: 'Tired or stressed. Trim easy miles ~10%, keep quality.' },
  minimal: { label: 'Survival mode', mult: 0.75, color: '#8A4FB0', icon: '🛡', tip: 'Life is chaos. Cut to 75% — keep one quality session.' },
}

export function phaseFor(wi) {
  if (wi === 0)  return 0
  if (wi <= 6)   return 1
  if (wi <= 8)   return 2
  if (wi <= 12)  return 3
  if (wi <= 17)  return 4
  return 5
}

// ─── Daily mile fractions ───────────────────────────────────────
const DAILY_FRAC = [0.00, 0.17, 0.14, 0.15, 0.12, 0.12, 0.30]
export const DAY_NAMES = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']

function r5(m) { return Math.round(m * 2) / 2 }

// ─── Workout descriptions using your exact pace targets ─────────
export function describeWorkout(code, targetMiles, weekMiles, wi) {
  const e   = `${YOUR_PACES.E.low}–${YOUR_PACES.E.high}/mi`
  const mp  = `${YOUR_PACES.M.low}–${YOUR_PACES.M.high}/mi`
  const t   = `${YOUR_PACES.T.low}–${YOUR_PACES.T.high}/mi`
  const ikm = YOUR_PACES.I.per1k
  const r2  = YOUR_PACES.R.per200
  const r4  = YOUR_PACES.R.per400
  const longMi = LONG_TARGETS[wi] || 14

  switch (code) {
    case 'REST':
      return { type:'REST', label:'Rest', miles:0,
        desc:'Full rest or easy cross-training / mobility. Recovery is training.' }
    case 'RACE':
      return { type:'RACE', label:'Race Day 🏁', miles:26.2,
        desc:`Charlotte Marathon! Goal pace ${mp}. The hay is in the barn — race smart and enjoy it.` }

    case 'E':
      return { type:'E', label:'Easy run', miles:targetMiles,
        desc:`${targetMiles} mi easy @ ${e}. ${YOUR_PACES.E.desc}. Flexible — adjust to hit week's goal.` }
    case 'E+strides':
    case 'strides':
      return { type:'E', label:'Easy + strides', miles:targetMiles,
        desc:`${targetMiles} mi easy @ ${e}, then 5–6 × 20–30 sec strides at comfortably-fast pace with quick light turnover. 1-min rests between. Don't sprint.` }
    case 'E-1':
      return { type:'E', label:'Easy E-1', miles: Math.max(targetMiles, 8),
        desc:`Lesser of 8 miles or 1-hour easy @ ${e}.` }
    case 'E-2':
      return { type:'E', label:'Easy E-2', miles:5,
        desc:`5-mile easy @ ${e}.` }
    case 'E-3':
      return { type:'E', label:'Easy E-3', miles:3,
        desc:`2–3 miles easy @ ${e}. May take the day completely off if travel to race takes too much time out of schedule.` }

    // ── Long runs ───────────────────────────────────────────────
    case 'L':
      return { type:'LONG', label:'Long run', miles:longMi,
        desc:`Long run — ${longMi} mi all @ easy pace (${e}). Wks 7–12: up to 25% of week's mileage or 2½ hrs, whichever is less.` }
    case 'L-1':
      return { type:'LONG', label:'Long run L-1', miles:Math.min(22, longMi),
        desc:`${Math.min(22, longMi)} mi — lesser of 22 miles or 2½ hours at E pace (${e}).` }
    case 'L-2':
      return { type:'LONG', label:'Long run L-2', miles:Math.min(15, longMi),
        desc:`${Math.min(15, longMi)} mi — lesser of 15 miles or 1¾ hours at E pace (${e}).` }

    // ── Marathon pace ───────────────────────────────────────────
    case 'MP': {
      const mpMi = wi <= 6 ? 10 : 13
      return { type:'LONG', label:'Marathon pace run', miles:longMi,
        desc:`${longMi} mi total with ${mpMi} mi at MP (${mp}). Wks 7–12: lesser of 10 mi or 1 hour. Wks 13–18: lesser of 12–13 mi or 1½ hours. Wks 19–24: up to 15 mi or 2 hours at MP.` }
    }

    // ── Threshold ───────────────────────────────────────────────
    case 'T-1':
      return { type:'T', label:'Threshold T-1', miles:targetMiles,
        desc:`20 min T (${t}) + 10 min easy + 20 min T. Warm up 1.5 mi E, cool down 1 mi E. ~${targetMiles} mi total.` }
    case 'T-2':
      return { type:'T', label:'Threshold T-2', miles:targetMiles,
        desc:`20 min T (${t}) with 5-min rest + 2 × 10–12 min T with 2-min rests. Warm up 1.5 mi E, cool down 1 mi E. ~${targetMiles} mi total.` }
    case 'Ti-1':
      return { type:'T', label:'Threshold Ti-1', miles:targetMiles,
        desc:`6 × 1-mile T (${t}) with 1-min rest. Warm up 1.5 mi E, cool down 1 mi E. ~${targetMiles} mi total.` }
    case 'Ti-2':
      return { type:'T', label:'Threshold Ti-2', miles:targetMiles,
        desc:`Wks 7–12: 2–3 × 1-mile T (${t}) + 1-hr E + 2 × 1-mile T, all w/ 1-min rests. Wks 13–18: 3-mile T + 1-hr E + 3 × 1-mile T w/ 1-min rests. ~${targetMiles} mi total.` }
    case 'Ti-3':
      return { type:'T', label:'Threshold Ti-3', miles:targetMiles,
        desc:`4 × 1000–1200 T (${t}) with full recoveries. Warm up 1.5 mi E, cool down 1 mi E. ~${targetMiles} mi total.` }
    case 'TL':
      return { type:'T', label:'T-Long (TL)', miles:longMi,
        desc:`3 × 2-mile T (${t}) + lesser of 10 miles or 1½ hrs at E pace (${e}). Warm up 1.5 mi E. ~${longMi} mi total.` }
    case 'TLT':
      return { type:'T', label:'T-Long-T', miles:longMi,
        desc:`20 min T (${t}) + 1-hour E (${e}) + 20 min T. Warm up 1 mi E, cool down 1 mi E. ~${longMi} mi total.` }
    case 'TLT-1':
      return { type:'T', label:'TLT-1', miles:longMi,
        desc:`Wks 7–12: 4–5 × 1000 T (${t}) + 1-hr E + 3 × 1000 T, all w/ 1-min rests. Wks 13–18: 2 × 10-min T + 1-hr E + 10-min T, w/ 2-min rests. ~${longMi} mi total.` }
    case 'TLT-2':
      return { type:'T', label:'TLT-2', miles:longMi,
        desc:`Wks 7–12: 2–3 × 1-mile T (${t}) + 1-hr E + 2 × 1-mile T, w/ 1-min rests. Wks 13–18: 3-mile T + 1-hr E + 3 × 1-mile T w/ 1-min rests. ~${longMi} mi total.` }

    // ── Reps (your exact spreadsheet descriptions) ──────────────
    case 'R-1':
      return { type:'R', label:'Reps R-1', miles:targetMiles,
        desc:`5–6 sets of (2 × 200 + 1 × 400) @ R pace (200: ${r2}, 400: ${r4}) with full recoveries. Warm up 1.5 mi E + strides, cool down 1 mi E. ~${targetMiles} mi total.` }
    case 'R-2':
      return { type:'R', label:'Reps R-2', miles:targetMiles,
        desc:`6 × 400 R (${r4}) + 6–10 × 200 R (${r2}) with full recoveries. Warm up 1.5 mi E + strides, cool down 1 mi E. ~${targetMiles} mi total.` }
    case 'R-3':
      return { type:'R', label:'Reps R-3', miles:targetMiles,
        desc:`6 × 200 R (${r2}) + 6–8 × 400 R (${r4}) with full recoveries. Warm up 1.5 mi E, cool down 1 mi E. ~${targetMiles} mi total.` }
    case 'R-4':
      return { type:'R', label:'Reps R-4', miles:targetMiles,
        desc:`16–20 × 200 R (${r2}) with full recoveries. Warm up 1.5 mi E + strides, cool down 1 mi E. ~${targetMiles} mi total.` }
    case 'R-5':
      return { type:'R', label:'Reps R-5', miles:targetMiles,
        desc:`8–10 × 400 R (${r4}) with full recoveries. Warm up 1.5 mi E, cool down 1 mi E. ~${targetMiles} mi total.` }

    // ── Intervals (your exact spreadsheet descriptions) ─────────
    case 'I-1':
      return { type:'I', label:'Intervals I-1', miles:targetMiles,
        desc:`6 × 1000–1200 m @ I pace (${ikm}/km) with 4-min easy runs for recovery. Warm up 1.5 mi E + strides, cool down 1.5 mi E. ~${targetMiles} mi total.` }
    case 'I-2':
      return { type:'I', label:'Intervals I-2', miles:targetMiles,
        desc:`4 × 1000 m to 1-mile @ I pace (${ikm}/km) with 5-min easy runs for recovery. Warm up 1.5 mi E + strides, cool down 1.5 mi E. ~${targetMiles} mi total.` }
    case 'I-3':
      return { type:'I', label:'Intervals I-3', miles:targetMiles,
        desc:`5 × 1000 m to 1-mile @ I pace (${ikm}/km) with 5-min easy runs for recovery. Warm up 1.5 mi E + strides, cool down 1 mi E. ~${targetMiles} mi total.` }
    case 'I-4':
      return { type:'I', label:'Intervals I-4', miles:targetMiles,
        desc:`7 × 4-min (1000–1200 m) @ I pace (${ikm}/km) with 4-min easy runs for recovery. Warm up 1.5 mi E + strides, cool down 1.5 mi E. ~${targetMiles} mi total.` }

    default:
      return { type:'E', label:'Easy run', miles:targetMiles,
        desc:`${targetMiles} mi easy @ ${e}.` }
  }
}

// ─── Date helpers ───────────────────────────────────────────────
function monday(d) {
  const dt = new Date(d); dt.setHours(0,0,0,0)
  const day = dt.getDay()
  dt.setDate(dt.getDate() - (day === 0 ? 6 : day - 1))
  return dt
}
export function addDays(d, n) { const dt = new Date(d); dt.setDate(dt.getDate() + n); return dt }
export function fmtD(d) { return d.toLocaleDateString('en-US', { month:'short', day:'numeric' }) }

// ─── Build the full 19-week plan ────────────────────────────────
export function buildPlan(vdot, peakMi, raceDateStr) {
  const P = buildPaces(vdot)
  const raceDate  = new Date(raceDateStr + 'T06:00:00')
  const raceMon   = monday(raceDate)
  const planStart = addDays(raceMon, -18 * 7)

  // Scale mileage if user changes peakMi from default 68
  const scale = peakMi / 68

  const weeks = SCHEDULE.map((sched, wi) => {
    const weekTarget = wi === 18 ? 26 : r5(sched.miles * scale)
    const startDate  = addDays(planStart, wi * 7)
    const endDate    = addDays(startDate, 6)
    const phase      = phaseFor(wi)

    const days = sched.days.map((code, di) => {
      // Quality workouts (long runs, MP, intervals, threshold) get their
      // mileage from LONG_TARGETS or fixed amounts; easy runs fill the rest
      const isQuality = ['L','L-1','L-2','MP','TL','TLT','TLT-1','TLT-2','RACE'].includes(code)
      const isMedium  = ['T-1','T-2','Ti-1','Ti-2','Ti-3','I-1','I-2','I-3','I-4','R-1','R-2','R-3','R-4','R-5'].includes(code)
      let targetMiles
      if (isQuality) {
        targetMiles = LONG_TARGETS[wi] || 14
      } else if (isMedium) {
        targetMiles = r5(weekTarget * 0.15)
      } else {
        targetMiles = r5(weekTarget * DAILY_FRAC[di])
      }
      targetMiles = Math.max(0, targetMiles)

      const workout = describeWorkout(code, targetMiles, weekTarget, wi)
      return {
        ...workout,
        code,
        // Slots: day name and ISO date are stored per slot position (0=Mon..6=Sun)
        slotIndex: di,
        name: DAY_NAMES[di],
        date: fmtD(addDays(startDate, di)),
        isoDate: addDays(startDate, di).toISOString().split('T')[0],
      }
    })

    const totalMiles = r5(days.reduce((s, d) => s + (d.miles || 0), 0))
    return { wi, weekNum: wi + 1, phase, startDate, endDate, totalMiles, days, weekTarget }
  })

  return { weeks, paces: P, yourPaces: YOUR_PACES, raceDate }
}
