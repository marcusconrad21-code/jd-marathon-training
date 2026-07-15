import { buildPaces } from './paces.js'

// ─── Marcus's personal pace targets from DanielsTables spreadsheet ─
export const YOUR_PACES = {
  E:   { low: '8:34', high: '9:49', desc: 'Zone 2 — comfortable, rhythmic breathing, conversational' },
  M:   { low: '7:30', high: '7:55', desc: 'Marathon goal pace' },
  T:   { low: '7:03', high: '7:25', desc: 'Threshold / comfortably hard' },
  I:   { per1k: '4:04', perMile: '6:33', desc: 'Interval — hard effort' },
  R:   { per200: '46s', per400: '92s', desc: 'Rep pace — fast, controlled, full recovery' },
}

// ─── Plan B 18-week schedule (book codes) ──────────────────────
export const PLAN_B_WEEKS = [
  ['E','E+strides','E','E+strides','E','E','L'],
  ['E','E+strides','E','E+strides','E','E','L'],
  ['E','E+strides','E','R-1','E','E+strides','L'],
  ['E','E+strides','E','R-2','E','E+strides','L'],
  ['E','E+strides','E','R-3','E','E+strides','L'],
  ['E','E+strides','E','R-4','E','E+strides','TLT-1'],
  ['E','TLT-1','E','strides','E','E+strides','TLT-1'],    // wk7: Ti-1 Sat
  ['E','R-2','E','Ti-1','E','L','E+strides'],              // wk8: R-2 Tue, Ti-1 Thu, L Sat
  ['E','R-3','E','E+strides','E','MP','E'],                // wk9: R-3 Tue, MP Sat
  ['E','R-4','E+strides','E+strides','E+strides','TLT-2','E'], // wk10
  ['E','R-5','E','E+strides','Ti-2','L','E'],              // wk11: R-5 Tue, Ti-2 Fri, L Sat
  ['E','R-1','E','E+strides','E+strides','TLT-1','E'],     // wk12
  ['E','I-1','E+strides','E','E','MP','E+strides'],        // wk13
  ['E','I-2','E+strides','E','E+strides','L','E'],         // wk14
  ['E','I-3','E+strides','E','E','TLT-2','E+strides'],     // wk15
  ['E','I-4','E+strides','E','E','L','E+strides'],         // wk16
  ['E','I-3','E+strides','E','E','MP','E+strides'],        // wk17
  ['E','I-3','E+strides','E','E+strides','TL','E'],        // wk18
  // wk19 (wi=18 in 0-based, book wk 19 from spreadsheet)
  // ['E','Ti-1','E','E','E','TLT','E'],
  // wk20
  // ['E','T-1','E','E','E','L-1','E'],
  // Using standard taper for wks 19-24 since spreadsheet extends to 24
  // but our app is 19 weeks total (lead-in + 18). Race week:
]
// Note: Our app is lead-in (wi=0) + 18 Daniels weeks (wi=1-18) = 19 total.
// The spreadsheet goes wk7-24 (18 weeks of quality). We map:
// our wi=1..6 = spreadsheet early base (not in sheet, standard Plan B)
// our wi=6..18 = spreadsheet wk7..19 roughly

// ─── Marcus's goal mileage from spreadsheet (scaled by peakMi) ─
// Base peak = 68 mi (your max from spreadsheet wks 15 & 17)
export const BASE_PEAK = 68
export const YOUR_WEEK_MILES = [
  32,  // wi=0  lead-in recovery
  35,  // wi=1  book wk 1 - base build
  38,  // wi=2  book wk 2
  40,  // wi=3  book wk 3 R-1 starts
  42,  // wi=4  book wk 4
  44,  // wi=5  book wk 5
  45,  // wi=6  book wk 6 → your spreadsheet wk 7: 45 mi
  45,  // wi=7  → your wk 8: 45 mi
  52,  // wi=8  → your wk 9: 52 mi
  52,  // wi=9  → your wk 10: 52 mi
  52,  // wi=10 → your wk 11: 52 mi
  60,  // wi=11 → your wk 12: 60 mi
  60,  // wi=12 → your wk 13: 60 mi
  60,  // wi=13 → your wk 14: 60 mi
  68,  // wi=14 → your wk 15: 68 mi (peak)
  60,  // wi=15 → your wk 16: 60 mi
  68,  // wi=16 → your wk 17: 68 mi (peak)
  60,  // wi=17 → your wk 18: 60 mi
  26,  // wi=18 race week
]

// Long run targets per week (from your spreadsheet descriptions)
export const LONG_CAP = [
  12, 13, 14, 13, 15, 16, 16,
  13, // wk8:  L 11-13 mi
  10, // wk9:  MP 1hr ≈ 8-10 mi
  16, // wk10: TLT-2
  15, // wk11: L 13-15 mi
  11, // wk12: TLT-1
  13, // wk13: MP 1.5hr ≈ 12-13 mi
  18, // wk14: L 16-18 mi
  16, // wk15: TLT-2
  19, // wk16: L 17-19 mi
  13, // wk17: MP 1.5hr ≈ 12-13 mi
  16, // wk18: TL
  26.2,
]

export const DAILY_FRAC = [0.00, 0.17, 0.14, 0.15, 0.12, 0.12, 0.30]
export const DAY_NAMES  = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']

export const PHASE_META = {
  0: { label: 'Lead-in',                    color: '#7C8B99', desc: 'Recovery & base — shake out any fatigue, establish the routine.' },
  1: { label: 'Phase I — Foundation',       color: '#3D6B52', desc: 'Weeks 1–6: Easy runs, strides, and Rep workouts build raw speed and aerobic base.' },
  2: { label: 'Phase II — Early Quality',   color: '#4C6B8A', desc: 'Weeks 7–10: Threshold work enters. TL & TUT sessions build lactate capacity.' },
  3: { label: 'Phase III — Peak Quality',   color: '#C8312F', desc: 'Weeks 11–14: Intervals peak. MP long runs simulate race day at 60 mi/wk.' },
  4: { label: 'Phase IV — Sharpen & Taper', color: '#FF5A1F', desc: 'Weeks 15–18: Volume tapers, quality sharpens. Trust the training.' },
}

export const WIGGLE = {
  high:    { label: 'Pushing it',    mult: 1.05, color: '#C8312F', icon: '🔥', tip: 'Body feels strong, sleep is good. Add ~5% to easy runs.' },
  normal:  { label: 'On plan',       mult: 1.00, color: '#2F6F4E', icon: '✓',  tip: 'Stick to the prescribed mileage.' },
  easy:    { label: 'Backing off',   mult: 0.90, color: '#4C6B8A', icon: '↓',  tip: 'Tired or stressed. Trim easy miles ~10%, keep quality.' },
  minimal: { label: 'Survival mode', mult: 0.75, color: '#8A4FB0', icon: '🛡', tip: 'Life is chaos. Cut to 75% — keep one quality session.' },
}

export function phaseFor(wi) {
  if (wi === 0) return 0
  if (wi <= 6)  return 1
  if (wi <= 10) return 2
  if (wi <= 14) return 3
  return 4
}

function r5(m) { return Math.round(m * 2) / 2 }

// ─── Workout descriptions using Marcus's pace targets ───────────
export function describeWorkout(code, targetMiles, weekMiles, longCap) {
  const e   = `${YOUR_PACES.E.low}–${YOUR_PACES.E.high}/mi`
  const mp  = `${YOUR_PACES.M.low}–${YOUR_PACES.M.high}/mi`
  const t   = `${YOUR_PACES.T.low}–${YOUR_PACES.T.high}/mi`
  const ikm = YOUR_PACES.I.per1k
  const r2  = YOUR_PACES.R.per200
  const r4  = YOUR_PACES.R.per400

  switch (code) {
    case 'REST':
      return { type:'REST', label:'Rest', miles:0,
        desc:'Full rest or easy cross-training / mobility. Recovery is part of training.' }
    case 'RACE':
      return { type:'RACE', label:'Race Day 🏁', miles:26.2,
        desc:`Marathon! Goal pace ${mp}. You've put in every mile — race smart and enjoy it.` }
    case 'E':
      return { type:'E', label:'Easy run', miles:targetMiles,
        desc:`${targetMiles} mi @ ${e}. ${YOUR_PACES.E.desc}. Amount flexible — adjust to hit week's goal.` }
    case 'strides':
    case 'E+strides':
      return { type:'E', label:'Easy + strides', miles:targetMiles,
        desc:`${targetMiles} mi easy @ ${e}, then 5–6 × 20–30 sec strides at comfortably-fast pace with quick, light turnover. Take 1-min rests. Don't sprint.` }

    // ── Long & MP runs ──────────────────────────────────────────
    case 'L': {
      const lm = r5(Math.min(longCap, Math.max(10, weekMiles * 0.28)))
      return { type:'LONG', label:'Long run', miles:lm,
        desc:`Up to 25% of week's mileage or 2½ hours, whichever is less. Today: ${lm} mi all @ easy pace (${e}).` }
    }
    case 'L-1': {
      const lm = r5(Math.min(22, longCap))
      return { type:'LONG', label:'Long run (L-1)', miles:lm,
        desc:`Lesser of 22 miles or 2½ hours at E pace. Target: ${lm} mi @ ${e}.` }
    }
    case 'L-2': {
      const lm = r5(Math.min(15, longCap))
      return { type:'LONG', label:'Long run (L-2)', miles:lm,
        desc:`Lesser of 15 miles or 1¾ hours at E pace. Target: ${lm} mi @ ${e}.` }
    }
    case 'MP': {
      const lm = r5(Math.min(longCap, Math.max(8, weekMiles * 0.20)))
      return { type:'LONG', label:'Marathon Pace run', miles:lm,
        desc:`${lm} mi at goal MP (${mp}). Wks 7–12: lesser of 10 mi or 1 hour. Wks 13–18: lesser of 12–13 mi or 1½ hours. Start easy, settle into race pace effort.` }
    }

    // ── Threshold (your exact descriptions from spreadsheet) ────
    case 'T-1':
      return { type:'T', label:'Threshold T-1', miles:targetMiles,
        desc:`20 min T (${t}) + 10 min easy + 20 min T. Warm up 1.5 mi E, cool down 1 mi E. ~${targetMiles} mi total.` }
    case 'T-2':
      return { type:'T', label:'Threshold T-2', miles:targetMiles,
        desc:`20 min T (${t}) w/ 5-min rest + 2 × 10–12 min T w/ 2-min rests. Warm up 1.5 mi E, cool down 1 mi E. ~${targetMiles} mi total.` }
    case 'Ti-1':
      return { type:'T', label:'Threshold Ti-1', miles:targetMiles,
        desc:`Wks 7–12: 6 × 1-mile T (${t}) w/ 1-min rest. Wks 19–24: 10 × 800–1000 at T pace w/ 30-sec rests. Warm up 1.5 mi E, cool down 1 mi E. ~${targetMiles} mi total.` }
    case 'Ti-2':
      return { type:'T', label:'Threshold Ti-2', miles:targetMiles,
        desc:`Wks 7–12: 2–3 × 1-mi T (${t}) w/ 1-min rests + 1-hr E + 2 × 1-mi T w/ 1-min rests. Wks 13–18: 3-mi T + 1-hr E + 3 × 1-mi T w/ 1-min rests. ~${targetMiles} mi total.` }
    case 'Ti-3':
      return { type:'T', label:'Threshold Ti-3', miles:targetMiles,
        desc:`4 × 1000–1200 T (${t}) with full recoveries. Warm up 1.5 mi E, cool down 1 mi E. ~${targetMiles} mi total.` }
    case 'TL':
      return { type:'T', label:'T-Long (TL)', miles:targetMiles,
        desc:`3 × 2-mi T (${t}) + lesser of 10 mi or 1½ hrs at E pace. Warm up 1.5 mi E. ~${targetMiles} mi total.` }
    case 'TUT':
      return { type:'T', label:'T-Up-Tempo (TUT)', miles:targetMiles,
        desc:`20 min T (${t}), 5-min rest, 2 × 10 min T w/ 2-min rests, cool down 1 mi E. ~${targetMiles} mi total.` }
    case 'TLT':
      return { type:'T', label:'T-Long-T', miles:targetMiles,
        desc:`20 min T (${t}) + 1-hour E + 20 min T. Warm up 1 mi E, cool down 1 mi E. ~${targetMiles} mi total.` }
    case 'TLT-1':
      return { type:'T', label:'TLT-1', miles:targetMiles,
        desc:`Wks 7–12: 4–5 × 1000 T (${t}) w/ 1-min rests + 1-hr E + 3 × 1000 T w/ 1-min rests. Wks 13–18: 2 × 10-min T w/ 2-min rests + 1-hr E + 10-min T. ~${targetMiles} mi total.` }
    case 'TLT-2':
      return { type:'T', label:'TLT-2', miles:targetMiles,
        desc:`Wks 7–12: 2–3 × 1-mi T (${t}) w/ 1-min rests + 1-hr E + 2 × 1-mi T. Wks 13–18: 3-mi T + 1-hr E + 3 × 1-mi T w/ 1-min rests. ~${targetMiles} mi total.` }

    // ── Reps (your exact pace targets from spreadsheet) ─────────
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

    // ── Intervals (your exact descriptions) ─────────────────────
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
function addDays(d, n) { const dt = new Date(d); dt.setDate(dt.getDate() + n); return dt }
export function fmtD(d) { return d.toLocaleDateString('en-US', { month:'short', day:'numeric' }) }

// ─── Build full 19-week plan ────────────────────────────────────
export function buildPlan(vdot, peakMi, raceDateStr) {
  const P         = buildPaces(vdot)
  const raceDate  = new Date(raceDateStr + 'T06:00:00')
  const raceMon   = monday(raceDate)
  const planStart = addDays(raceMon, -18 * 7)
  const weeks     = []

  for (let wi = 0; wi < 19; wi++) {
    // Scale your spreadsheet mileage if user adjusts peakMi from default 68
    const scale      = peakMi / BASE_PEAK
    const weekTarget = r5(YOUR_WEEK_MILES[wi] * scale)
    const longCap    = LONG_CAP[Math.min(wi, LONG_CAP.length - 1)]
    const startDate  = addDays(planStart, wi * 7)
    const endDate    = addDays(startDate, 6)
    const phase      = phaseFor(wi)
    const codes      = wi === 0
      ? ['REST','E+strides','E','E+strides','E','E','L']
      : PLAN_B_WEEKS[Math.min(wi - 1, PLAN_B_WEEKS.length - 1)]

    const days = codes.map((code, di) => {
      const raw         = r5(weekTarget * DAILY_FRAC[di])
      const targetMiles = Math.max(0, Math.min(raw, 16))
      return {
        ...describeWorkout(code, targetMiles, weekTarget, longCap),
        code,
        name:    DAY_NAMES[di],
        date:    fmtD(addDays(startDate, di)),
        isoDate: addDays(startDate, di).toISOString().split('T')[0],
      }
    })

    const totalMiles = r5(days.reduce((s, d) => s + (d.miles || 0), 0))
    weeks.push({ wi, weekNum:wi+1, phase, startDate, endDate, totalMiles, days, weekTarget })
  }

  return { weeks, paces:P, yourPaces:YOUR_PACES, raceDate }
}
