import { buildPaces } from './paces.js'

export const YOUR_PACES = {
  E:  { low: '8:34', high: '9:49', desc: 'Zone 2 — comfortable, conversational, rhythmic breathing' },
  M:  { low: '7:30', high: '7:55', desc: 'Marathon goal pace' },
  T:  { low: '7:03', high: '7:25', desc: 'Threshold / comfortably hard (4:22–4:36/km)' },
  I:  { per1k: '4:04', perMile: '6:33', desc: 'Interval — hard effort' },
  R:  { per200: '46s', per400: '92s', desc: 'Rep pace — fast, controlled, full recovery' },
}

// ─── Weekly structure philosophy ────────────────────────────────
// Each week has exactly 7 slots: Mon Tue Wed Thu Fri Sat Sun
// Structure:  E  | QUALITY | E  | E  | E  | LONG/BIG | REST
// Mon = easy day (NOT 0 miles)
// Sun = rest day
// Sat = long run or bigger workout
// Tue = quality session (intervals, reps, threshold)
// Wed/Thu/Fri = easy days to hit weekly mileage goal
//
// Easy day mileage is distributed to hit the weekly target.
// Quality/long workout mileage is fixed per session type.
// The 4 easy days share whatever miles remain after quality + long.

// ─── Schedule from your spreadsheet (weeks 7–24) ───────────────
// [Mon, Tue, Wed, Thu, Fri, Sat, Sun]
// Mon=E or E+strides, Sun=REST (your preference)
export const SCHEDULE = [
  // wi=0  lead-in recovery week
  { miles: 35, days: ['E+strides', 'E+strides', 'E', 'E+strides', 'E', 'E+strides', 'REST'] },

  // wi=1  spreadsheet wk 7: 45 mi — R-1 Tue, TLT-1 Sat
  { miles: 45, days: ['E+strides', 'R-1',  'E', 'E+strides', 'E+strides', 'TLT-1', 'REST'] },

  // wi=2  spreadsheet wk 8: 45 mi — R-2 Tue, Ti-1 Fri, L Sat  ← EARLY QUALITY starts
  { miles: 45, days: ['E+strides', 'R-2',  'E', 'E+strides', 'Ti-1',      'L',     'REST'] },

  // wi=3  spreadsheet wk 9: 52 mi — R-3 Tue, MP Sat
  { miles: 52, days: ['E+strides', 'R-3',  'E', 'E+strides', 'E+strides', 'MP',    'REST'] },

  // wi=4  spreadsheet wk 10: 52 mi — R-4 Tue, TLT-2 Sat
  { miles: 52, days: ['E',         'R-4',  'E+strides', 'E+strides', 'E+strides', 'TLT-2', 'REST'] },

  // wi=5  spreadsheet wk 11: 52 mi — R-5 Tue, Ti-2 Fri, L Sat
  { miles: 52, days: ['E+strides', 'R-5',  'E', 'E+strides', 'Ti-2',      'L',     'REST'] },

  // wi=6  spreadsheet wk 12: 60 mi — R-1 Tue, TLT-1 Sat
  { miles: 60, days: ['E+strides', 'R-1',  'E', 'E+strides', 'E+strides', 'TLT-1', 'REST'] },

  // wi=7  spreadsheet wk 13: 60 mi — I-1 Tue, MP Sat
  { miles: 60, days: ['E',         'I-1',  'E+strides', 'E', 'E', 'MP',    'REST'] },

  // wi=8  spreadsheet wk 14: 60 mi — I-2 Tue, L Sat (16-18)
  { miles: 60, days: ['E',         'I-2',  'E+strides', 'E', 'E+strides', 'L', 'REST'] },

  // wi=9  spreadsheet wk 15: 68 mi — I-3 Tue, TLT-2 Sat
  { miles: 68, days: ['E',         'I-3',  'E+strides', 'E', 'E', 'TLT-2', 'REST'] },

  // wi=10 spreadsheet wk 16: 60 mi — I-4 Tue, L Sat (17-19)
  { miles: 60, days: ['E',         'I-4',  'E+strides', 'E', 'E', 'L',     'REST'] },

  // wi=11 spreadsheet wk 17: 68 mi — I-3 Tue, MP Sat
  { miles: 68, days: ['E',         'I-3',  'E+strides', 'E', 'E', 'MP',    'REST'] },

  // wi=12 spreadsheet wk 18: 60 mi — I-3 Tue, TL Sat
  { miles: 60, days: ['E',         'I-3',  'E+strides', 'E', 'E+strides', 'TL', 'REST'] },

  // wi=13 spreadsheet wk 19: 60 mi — Ti-1 Tue, TLT Sat
  { miles: 60, days: ['E',         'Ti-1', 'E', 'E', 'E', 'TLT',   'REST'] },

  // wi=14 spreadsheet wk 20: 60 mi — T-1 Tue, L-1 Sat (19-22)
  { miles: 60, days: ['E',         'T-1',  'E', 'E', 'E', 'L-1',   'REST'] },

  // wi=15 spreadsheet wk 21: 55 mi — Ti-2 Tue, MP Sat
  { miles: 55, days: ['E',         'Ti-2', 'E', 'E', 'E', 'MP',    'REST'] },

  // wi=16 spreadsheet wk 22: 50 mi — T-2 Tue, TL Sat
  { miles: 50, days: ['E',         'T-2',  'E', 'E', 'E', 'TL',    'REST'] },

  // wi=17 spreadsheet wk 23: 45 mi — Ti-2 Tue, L-2 Sat (13-15)
  { miles: 45, days: ['E',         'Ti-2', 'E', 'E', 'E', 'L-2',   'REST'] },

  // wi=18 spreadsheet wk 24: race week
  { miles: 26, days: ['E-1',       'Ti-3', 'E-1', 'E-2', 'E-3', 'REST', 'RACE'] },
]

// Fixed miles for quality/long sessions (not scaled from daily fraction)
const QUALITY_MILES = {
  // Long runs & MP
  'L':    { wi_range: [[0,6], 13], default: 16 },  // handled per-week below
  'L-1':  22,
  'L-2':  14,
  'MP':   { wi_range: [[0,12], 10], default: 13 }, // handled per-week below
  'TL':   14,
  'TLT':  13,
  'TLT-1': 11,
  'TLT-2': 13,
  // Quality workouts (incl warm/cool)
  'R-1': 7, 'R-2': 7, 'R-3': 7, 'R-4': 7, 'R-5': 7,
  'I-1': 9, 'I-2': 9, 'I-3': 9, 'I-4': 9,
  'T-1': 8, 'T-2': 9,
  'Ti-1': 8, 'Ti-2': 9, 'Ti-3': 7,
  // Race week easy days
  'E-1': 8, 'E-2': 5, 'E-3': 3,
}

function qualityMiles(code, wi) {
  if (code === 'L') {
    if (wi <= 2) return 13
    if (wi <= 5) return 15
    if (wi <= 6) return 13
    if (wi === 8) return 17
    if (wi === 10) return 18
    return 16
  }
  if (code === 'MP') {
    if (wi <= 6) return 10   // 1hr @MP
    if (wi <= 12) return 13  // 1.5hr @MP
    return 15                // 2hr @MP
  }
  const v = QUALITY_MILES[code]
  return typeof v === 'number' ? v : 0
}

function isQualityCode(code) {
  return ['L','L-1','L-2','MP','TL','TLT','TLT-1','TLT-2',
          'R-1','R-2','R-3','R-4','R-5',
          'I-1','I-2','I-3','I-4',
          'T-1','T-2','Ti-1','Ti-2','Ti-3',
          'E-1','E-2','E-3','REST','RACE'].includes(code)
}

export const PHASE_META = {
  0: { label: 'Lead-in',                    color: '#7C8B99', desc: 'Recovery week — shake out fatigue, establish the routine before the main block.' },
  1: { label: 'Phase I — Foundation',       color: '#3D6B52', desc: 'Weeks 7–12: Easy running, strides, and Rep workouts build raw speed and aerobic base.' },
  2: { label: 'Phase II — Early Quality',   color: '#4C6B8A', desc: 'Weeks 8–9: First quality sessions alongside reps. Ti-1 and MP work begin.' },
  3: { label: 'Phase III — Peak Quality',   color: '#C8312F', desc: 'Weeks 13–18: Peak mileage (68 mi). Intervals and threshold at full volume.' },
  4: { label: 'Phase IV — Sharpen & Taper', color: '#FF5A1F', desc: 'Weeks 19–23: Volume tapers, quality stays sharp. Trust the training.' },
  5: { label: 'Race Week',                  color: '#20242B', desc: 'Race week — stay loose, stay sharp. The hay is in the barn.' },
}

export const WIGGLE = {
  high:    { label: 'Pushing it',    mult: 1.05, color: '#C8312F', icon: '🔥', tip: 'Body feels strong, sleep is good. Add to easy day miles.' },
  normal:  { label: 'On plan',       mult: 1.00, color: '#2F6F4E', icon: '✓',  tip: 'Stick to the prescribed mileage.' },
  easy:    { label: 'Backing off',   mult: 0.90, color: '#4C6B8A', icon: '↓',  tip: 'Tired or stressed. Trim easy miles ~10%, keep quality.' },
  minimal: { label: 'Survival mode', mult: 0.75, color: '#8A4FB0', icon: '🛡', tip: 'Life is chaos. Cut to 75% — keep one quality session.' },
}

export function phaseFor(wi) {
  if (wi === 0)  return 0
  if (wi <= 1)   return 1   // wk 7 only — Foundation
  if (wi <= 2)   return 2   // wk 8 — Early Quality starts
  if (wi <= 6)   return 1   // wk 9–12 — back to Foundation (reps)
  if (wi <= 12)  return 3   // wk 13–18 — Peak Quality
  if (wi <= 17)  return 4   // wk 19–23 — Taper
  return 5                  // race week
}

export const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

function r5(m) { return Math.round(m * 2) / 2 }

// ─── Workout descriptions ───────────────────────────────────────
export function describeWorkout(code, miles, wi) {
  const e   = `${YOUR_PACES.E.low}–${YOUR_PACES.E.high}/mi`
  const mp  = `${YOUR_PACES.M.low}–${YOUR_PACES.M.high}/mi`
  const t   = `${YOUR_PACES.T.low}–${YOUR_PACES.T.high}/mi`
  const ikm = YOUR_PACES.I.per1k
  const r2  = YOUR_PACES.R.per200
  const r4  = YOUR_PACES.R.per400

  switch (code) {
    case 'REST':
      return { type:'REST', label:'Rest', miles:0,
        desc:'Full rest. Recovery is training — use this day to recharge.' }
    case 'RACE':
      return { type:'RACE', label:'Race Day 🏁', miles:26.2,
        desc:`Charlotte Marathon! Goal pace ${mp}. The hay is in the barn — race smart and enjoy it.` }
    case 'E':
      return { type:'E', label:'Easy run', miles,
        desc:`${miles} mi easy @ ${e}. Conversational pace — you should be able to speak in full sentences. Adjust miles up or down to hit your weekly goal.` }
    case 'E+strides':
      return { type:'E', label:'Easy + strides', miles,
        desc:`${miles} mi easy @ ${e}, then 5–6 × 20–30 sec strides at comfortably-fast pace with quick light turnover. 1-min rest between strides. Don't sprint.` }
    case 'E-1':
      return { type:'E', label:'Easy E-1', miles,
        desc:`Lesser of 8 miles or 1 hour easy @ ${e}.` }
    case 'E-2':
      return { type:'E', label:'Easy E-2', miles:5,
        desc:`5 miles easy @ ${e}.` }
    case 'E-3':
      return { type:'E', label:'Easy E-3', miles:3,
        desc:`2–3 miles easy @ ${e}. May take the day off if travel to race takes too much time.` }

    case 'L':
      return { type:'LONG', label:'Long run', miles,
        desc:`${miles} mi long run, all easy @ ${e}. Wks 7–12: up to 25% of week's mileage or 2½ hours, whichever is less.` }
    case 'L-1':
      return { type:'LONG', label:'Long run (L-1)', miles,
        desc:`${miles} mi — lesser of 22 miles or 2½ hours at easy pace (${e}).` }
    case 'L-2':
      return { type:'LONG', label:'Long run (L-2)', miles,
        desc:`${miles} mi — lesser of 15 miles or 1¾ hours at easy pace (${e}).` }
    case 'MP': {
      const mpMi = wi <= 6 ? 10 : wi <= 12 ? 13 : 15
      return { type:'LONG', label:'Marathon Pace run', miles,
        desc:`${miles} mi total. Include ${mpMi} mi at goal MP (${mp}). Wks 7–12: up to 10 mi or 1 hr. Wks 13–18: up to 12–13 mi or 1½ hrs. Wks 19–24: up to 15 mi or 2 hrs.` }
    }
    case 'T-1':
      return { type:'T', label:'Threshold T-1', miles,
        desc:`20 min T (${t}) + 10 min easy + 20 min T. Warm up 1.5 mi E, cool down 1 mi E. ~${miles} mi total.` }
    case 'T-2':
      return { type:'T', label:'Threshold T-2', miles,
        desc:`20 min T (${t}) with 5-min rest + 2 × 10–12 min T with 2-min rests. Warm up 1.5 mi E, cool down 1 mi E. ~${miles} mi total.` }
    case 'Ti-1':
      return { type:'T', label:'Threshold Ti-1', miles,
        desc:`6 × 1-mile T (${t}) with 1-min rest. Warm up 1.5 mi E, cool down 1 mi E. ~${miles} mi total.` }
    case 'Ti-2':
      return { type:'T', label:'Threshold Ti-2', miles,
        desc:`Wks 7–12: 2–3 × 1-mi T (${t}) + 1-hr E + 2 × 1-mi T, all w/ 1-min rests. Wks 13–18: 3-mi T + 1-hr E + 3 × 1-mi T w/ 1-min rests. ~${miles} mi total.` }
    case 'Ti-3':
      return { type:'T', label:'Threshold Ti-3', miles,
        desc:`4 × 1000–1200 T (${t}) with full recoveries. Warm up 1.5 mi E, cool down 1 mi E. ~${miles} mi total.` }
    case 'TL':
      return { type:'T', label:'T-Long (TL)', miles,
        desc:`3 × 2-mi T (${t}) + lesser of 10 miles or 1½ hrs at E pace (${e}). Warm up 1.5 mi E. ~${miles} mi total.` }
    case 'TLT':
      return { type:'T', label:'T-Long-T', miles,
        desc:`20 min T (${t}) + 1-hour E (${e}) + 20 min T. Warm up 1 mi E, cool down 1 mi E. ~${miles} mi total.` }
    case 'TLT-1':
      return { type:'T', label:'TLT-1', miles,
        desc:`Wks 7–12: 4–5 × 1000 T (${t}) + 1-hr E + 3 × 1000 T, all w/ 1-min rests. Wks 13–18: 2 × 10-min T + 1-hr E + 10-min T, w/ 2-min rests. ~${miles} mi total.` }
    case 'TLT-2':
      return { type:'T', label:'TLT-2', miles,
        desc:`Wks 7–12: 2–3 × 1-mi T (${t}) + 1-hr E + 2 × 1-mi T, w/ 1-min rests. Wks 13–18: 3-mi T + 1-hr E + 3 × 1-mi T w/ 1-min rests. ~${miles} mi total.` }
    case 'R-1':
      return { type:'R', label:'Reps R-1', miles,
        desc:`5–6 sets of (2×200 + 1×400) @ R pace (200: ${r2}, 400: ${r4}) with full recoveries. Warm up 1.5 mi E + strides, cool down 1 mi E. ~${miles} mi total.` }
    case 'R-2':
      return { type:'R', label:'Reps R-2', miles,
        desc:`6×400 R (${r4}) + 6–10×200 R (${r2}) with full recoveries. Warm up 1.5 mi E + strides, cool down 1 mi E. ~${miles} mi total.` }
    case 'R-3':
      return { type:'R', label:'Reps R-3', miles,
        desc:`6×200 R (${r2}) + 6–8×400 R (${r4}) with full recoveries. Warm up 1.5 mi E, cool down 1 mi E. ~${miles} mi total.` }
    case 'R-4':
      return { type:'R', label:'Reps R-4', miles,
        desc:`16–20×200 R (${r2}) with full recoveries. Warm up 1.5 mi E + strides, cool down 1 mi E. ~${miles} mi total.` }
    case 'R-5':
      return { type:'R', label:'Reps R-5', miles,
        desc:`8–10×400 R (${r4}) with full recoveries. Warm up 1.5 mi E, cool down 1 mi E. ~${miles} mi total.` }
    case 'I-1':
      return { type:'I', label:'Intervals I-1', miles,
        desc:`6×1000–1200 m @ I pace (${ikm}/km) with 4-min easy recovery runs. Warm up 1.5 mi E + strides, cool down 1.5 mi E. ~${miles} mi total.` }
    case 'I-2':
      return { type:'I', label:'Intervals I-2', miles,
        desc:`4×1000 m to 1-mile @ I pace (${ikm}/km) with 5-min easy recovery runs. Warm up 1.5 mi E + strides, cool down 1.5 mi E. ~${miles} mi total.` }
    case 'I-3':
      return { type:'I', label:'Intervals I-3', miles,
        desc:`5×1000 m to 1-mile @ I pace (${ikm}/km) with 5-min easy recovery runs. Warm up 1.5 mi E + strides, cool down 1 mi E. ~${miles} mi total.` }
    case 'I-4':
      return { type:'I', label:'Intervals I-4', miles,
        desc:`7×4-min (1000–1200 m) @ I pace (${ikm}/km) with 4-min easy recovery runs. Warm up 1.5 mi E + strides, cool down 1.5 mi E. ~${miles} mi total.` }
    default:
      return { type:'E', label:'Easy run', miles,
        desc:`${miles} mi easy @ ${e}.` }
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

// ─── Build plan ─────────────────────────────────────────────────
export function buildPlan(vdot, peakMi, raceDateStr) {
  const P = buildPaces(vdot)
  const raceDate  = new Date(raceDateStr + 'T06:00:00')
  const raceMon   = monday(raceDate)
  const planStart = addDays(raceMon, -18 * 7)
  const scale     = peakMi / 68  // scale to user's chosen peak

  const weeks = SCHEDULE.map((sched, wi) => {
    const weekTarget = wi === 18 ? 26 : r5(sched.miles * scale)
    const startDate  = addDays(planStart, wi * 7)
    const endDate    = addDays(startDate, 6)
    const phase      = phaseFor(wi)
    const codes      = sched.days  // exactly 7 codes

    // Step 1: assign fixed miles to quality/long/rest days
    // Step 2: distribute remaining miles evenly across easy days
    const fixedMiles  = codes.map(c => isQualityCode(c) ? qualityMiles(c, wi) : null)
    const fixedTotal  = fixedMiles.reduce((s, m) => s + (m ?? 0), 0)
    const easySlots   = codes.reduce((arr, c, i) => { if (!isQualityCode(c)) arr.push(i); return arr }, [])
    const easyBudget  = Math.max(0, weekTarget - fixedTotal)
    const easyPerDay  = easySlots.length > 0 ? r5(easyBudget / easySlots.length) : 0

    const days = codes.map((code, di) => {
      const slotDate  = addDays(startDate, di)
      const miles     = fixedMiles[di] !== null ? fixedMiles[di] : Math.max(4, easyPerDay)
      return {
        ...describeWorkout(code, miles, wi),
        code,
        name:    DAY_NAMES[di],
        date:    fmtD(slotDate),
        isoDate: slotDate.toISOString().split('T')[0],
        slotIndex: di,
      }
    })

    const totalMiles = r5(days.reduce((s, d) => s + (d.miles || 0), 0))
    return { wi, weekNum: wi + 1, phase, startDate, endDate, totalMiles, days, weekTarget }
  })

  return { weeks, paces: P, yourPaces: YOUR_PACES, raceDate }
}
