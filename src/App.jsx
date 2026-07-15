import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { Check, ChevronDown, ChevronUp, Settings2, Flag, X, Sliders, GripVertical, PenLine, Clock, Ruler, Heart, RefreshCw, LogOut } from 'lucide-react'
import { buildPaces, equivTimes } from './paces.js'
import { buildPlan, fmtD, PHASE_META, WIGGLE, YOUR_PACES } from './plan.js'
import { useStrava } from './useStrava.js'
import { parseActivity } from './stravaUtils.js'
import StravaDetail from './StravaDetail.jsx'

const TYPE_STYLE = {
  REST:{bg:'#EDEAE3',fg:'#6B645A'}, E:{bg:'#E8F0EB',fg:'#2F6F4E'},
  T:{bg:'#FFF0E6',fg:'#B83D07'},   R:{bg:'#F3E8FF',fg:'#6B2FA0'},
  I:{bg:'#FFE8E8',fg:'#992222'},   LONG:{bg:'#E5EDF5',fg:'#2A4E6A'},
  RACE:{bg:'#20242B',fg:'#FFC53D'},
}
function Badge({ type }) {
  const s=TYPE_STYLE[type]||TYPE_STYLE.E
  return <span style={{ background:s.bg, color:s.fg, fontSize:10, fontWeight:700, padding:'2px 7px', borderRadius:5, fontFamily:"'IBM Plex Mono',monospace", letterSpacing:'0.04em' }}>{type==='RACE'?'RACE':type}</span>
}

function StravaCard({ activity, onViewDetail }) {
  const act=parseActivity(activity); if (!act) return null
  return (
    <div style={{ background:'#FFF4EE', border:'1.5px solid #FC4C02', borderRadius:10, padding:'10px 12px', marginTop:8 }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:6 }}>
        <div style={{ display:'flex', alignItems:'center', gap:6 }}><span style={{ fontSize:14 }}>🟠</span><span style={{ fontWeight:700, fontSize:12, color:'#FC4C02' }}>Synced from Strava</span></div>
        <button onClick={onViewDetail} style={{ background:'#FC4C02', color:'#fff', border:'none', borderRadius:7, padding:'4px 10px', fontSize:11, fontWeight:700, cursor:'pointer' }}>View details →</button>
      </div>
      <div style={{ fontSize:11, color:'#B06040', marginBottom:6, fontWeight:600 }}>{activity.name}</div>
      <div style={{ display:'flex', gap:12, fontFamily:"'IBM Plex Mono',monospace", fontSize:12, flexWrap:'wrap' }}>
        {act.miles&&<span><b>{act.miles}</b> mi</span>}
        {act.duration&&<span><b>{act.duration}</b></span>}
        {act.pace&&<span><b>{act.pace}</b></span>}
        {act.avgHr&&<span>❤️ <b>{act.avgHr}</b></span>}
        {act.elevGain&&<span>↑<b>{act.elevGain}ft</b></span>}
      </div>
    </div>
  )
}

function LogModal({ day, existing, stravaActivity, onSave, onClose }) {
  const act=parseActivity(stravaActivity)
  const [miles,setMiles]=useState(existing?.miles??act?.miles??day.miles??'')
  const [time,setTime]=useState(existing?.time??act?.duration??'')
  const [hr,setHr]=useState(existing?.hr??act?.avgHr??'')
  const [notes,setNotes]=useState(existing?.notes??'')
  const [feel,setFeel]=useState(existing?.feel??3)
  const fc=['','#C8312F','#E05A1C','#B8860B','#2F6F4E','#1A5C3A']
  const fl=['','Terrible','Rough','Okay','Good','Great']
  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.55)', display:'flex', alignItems:'flex-end', justifyContent:'center', zIndex:200 }} onClick={onClose}>
      <div style={{ background:'#fff', width:'100%', maxWidth:460, borderRadius:'20px 20px 0 0', padding:'22px 20px 32px', maxHeight:'88vh', overflowY:'auto' }} onClick={e=>e.stopPropagation()}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
          <div><div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:20 }}>Log Run</div><div style={{ fontSize:12, color:'#9A9489' }}>{day.name} · {day.date} · {day.label}</div></div>
          <button onClick={onClose} style={{ background:'none', border:'1px solid #E0DAD0', borderRadius:8, padding:'5px 7px', cursor:'pointer' }}><X size={16}/></button>
        </div>
        {act&&<div style={{ background:'#FFF4EE', border:'1.5px solid #FC4C02', borderRadius:10, padding:'10px 12px', marginBottom:14, fontSize:12, color:'#B06040' }}><b style={{ color:'#FC4C02' }}>🟠 Auto-filled from Strava</b> — "{stravaActivity?.name}"</div>}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:10, marginBottom:14 }}>
          {[{icon:<Ruler size={14}/>,label:'Miles',val:miles,set:setMiles,placeholder:day.miles,type:'number',step:'0.1'},{icon:<Clock size={14}/>,label:'Time',val:time,set:setTime,placeholder:'0:00:00',type:'text'},{icon:<Heart size={14}/>,label:'Avg HR',val:hr,set:setHr,placeholder:'—',type:'number'}].map((f,i)=>(
            <div key={i}>
              <div style={{ display:'flex', alignItems:'center', gap:4, fontSize:11, fontWeight:600, color:'#7a756a', marginBottom:5, textTransform:'uppercase', letterSpacing:'0.05em' }}>{f.icon}{f.label}</div>
              <input type={f.type} step={f.step} value={f.val} onChange={e=>f.set(e.target.value)} placeholder={String(f.placeholder||'')} style={{ width:'100%', border:'1.5px solid #E0DAD0', borderRadius:8, padding:'8px 9px', fontSize:13, fontFamily:"'IBM Plex Mono',monospace", outline:'none' }}/>
            </div>
          ))}
        </div>
        <div style={{ marginBottom:14 }}>
          <div style={{ fontSize:11, fontWeight:600, color:'#7a756a', textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:7 }}>How did it feel?</div>
          <div style={{ display:'flex', gap:8 }}>
            {[1,2,3,4,5].map(n=>(
              <button key={n} onClick={()=>setFeel(n)} style={{ flex:1, padding:'9px 0', borderRadius:9, border:`2px solid ${feel===n?fc[n]:'#E0DAD0'}`, background:feel===n?fc[n]+'18':'#fff', color:feel===n?fc[n]:'#9A9489', fontWeight:700, fontSize:12, cursor:'pointer' }}>
                <div style={{ fontSize:18 }}>{'😵😕😐😊🔥'[n-1]}</div>
                <div style={{ fontSize:10, marginTop:2 }}>{fl[n]}</div>
              </button>
            ))}
          </div>
        </div>
        <div style={{ marginBottom:18 }}>
          <div style={{ fontSize:11, fontWeight:600, color:'#7a756a', textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:7 }}>Notes</div>
          <textarea value={notes} onChange={e=>setNotes(e.target.value)} placeholder="How'd it go? Splits, conditions, how the legs felt…" rows={3} style={{ width:'100%', border:'1.5px solid #E0DAD0', borderRadius:10, padding:'10px 12px', fontSize:13, outline:'none', resize:'vertical', lineHeight:1.5 }}/>
        </div>
        <div style={{ display:'flex', gap:8 }}>
          <button onClick={onClose} style={{ background:'none', border:'1.5px solid #E0DAD0', borderRadius:10, padding:'12px 18px', cursor:'pointer', color:'#5c574d', fontSize:14 }}>Cancel</button>
          <button onClick={()=>onSave({miles:parseFloat(miles)||0,time,hr:parseInt(hr)||null,notes,feel})} style={{ flex:1, background:'#20242B', color:'#fff', border:'none', borderRadius:10, padding:'12px', fontWeight:700, fontSize:14, cursor:'pointer' }}>Save Run</button>
        </div>
      </div>
    </div>
  )
}

function WigglePicker({ value, onChange }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
      <div style={{ fontSize:11, fontWeight:600, color:'#7a756a', fontFamily:"'IBM Plex Mono',monospace", textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:2 }}>This week's effort level</div>
      {Object.entries(WIGGLE).map(([key,w])=>(
        <button key={key} onClick={()=>onChange(key)} style={{ display:'flex', alignItems:'center', gap:10, padding:'9px 12px', borderRadius:10, border:value===key?`2px solid ${w.color}`:'1.5px solid #e8e3d9', background:value===key?w.color+'12':'#fff', cursor:'pointer', textAlign:'left' }}>
          <span style={{ fontSize:18 }}>{w.icon}</span>
          <div>
            <div style={{ fontWeight:700, fontSize:13, color:value===key?w.color:'#20242B' }}>{w.label}</div>
            <div style={{ fontSize:11.5, color:'#7a756a', marginTop:1 }}>{w.tip}</div>
          </div>
        </button>
      ))}
    </div>
  )
}

function SettingsSheet({ vdot, peakMi, raceDate, strava, onSave, onClose }) {
  const [draft,setDraft]=useState({vdot,peakMi,raceDate})
  const {connected,athlete,syncing,error,connectStrava,syncActivities,disconnect}=strava
  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.52)', display:'flex', alignItems:'flex-end', justifyContent:'center', zIndex:100 }} onClick={onClose}>
      <div style={{ background:'#fff', width:'100%', maxWidth:440, borderRadius:'20px 20px 0 0', padding:'22px', maxHeight:'90vh', overflowY:'auto' }} onClick={e=>e.stopPropagation()}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:18 }}>
          <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:22 }}>Plan Settings</div>
          <button onClick={onClose} style={{ background:'none', border:'1px solid #E0DAD0', borderRadius:8, padding:'5px 7px', cursor:'pointer' }}><X size={16}/></button>
        </div>

        {/* Your pace reference */}
        <div style={{ background:'#F4F1EB', borderRadius:12, padding:'12px 14px', marginBottom:16 }}>
          <div style={{ fontWeight:700, fontSize:13, marginBottom:8 }}>Your Target Paces (from spreadsheet)</div>
          {[
            {label:'Easy',val:`${YOUR_PACES.E.low}–${YOUR_PACES.E.high}/mi`},
            {label:'Marathon',val:`${YOUR_PACES.M.low}–${YOUR_PACES.M.high}/mi`},
            {label:'Threshold',val:`${YOUR_PACES.T.low}–${YOUR_PACES.T.high}/mi`},
            {label:'Interval',val:`${YOUR_PACES.I.per1k}/km`},
            {label:'Reps',val:`200: ${YOUR_PACES.R.per200} / 400: ${YOUR_PACES.R.per400}`},
          ].map(p=>(
            <div key={p.label} style={{ display:'flex', justifyContent:'space-between', fontSize:12, marginBottom:4 }}>
              <span style={{ color:'#7a756a' }}>{p.label}</span>
              <span style={{ fontFamily:"'IBM Plex Mono',monospace", fontWeight:600, color:'#20242B' }}>{p.val}</span>
            </div>
          ))}
        </div>

        {[{label:'VDOT',key:'vdot',type:'number',step:'0.1'},{label:'Peak weekly mileage',key:'peakMi',type:'number',step:'1'},{label:'Race date',key:'raceDate',type:'date'}].map(f=>(
          <div key={f.key} style={{ marginBottom:14 }}>
            <label style={{ fontSize:11, fontWeight:700, color:'#7a756a', display:'block', marginBottom:5, textTransform:'uppercase', letterSpacing:'0.06em' }}>{f.label}</label>
            <input type={f.type} step={f.step} value={draft[f.key]} onChange={e=>setDraft(p=>({...p,[f.key]:e.target.value}))} style={{ width:'100%', border:'1.5px solid #E0DAD0', borderRadius:10, padding:'10px 12px', fontSize:14, fontFamily:"'IBM Plex Mono',monospace", outline:'none' }}/>
          </div>
        ))}

        <div style={{ background:connected?'#F0FFF4':'#FFF7EC', border:`1.5px solid ${connected?'#2F6F4E':'#FFD580'}`, borderRadius:12, padding:14, marginBottom:18 }}>
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:8 }}><span style={{ fontSize:22 }}>🟠</span><div style={{ fontWeight:700, fontSize:14, color:connected?'#2F6F4E':'#8A5A00' }}>{connected?`Connected — ${athlete?.firstname} ${athlete?.lastname}`:'Connect Strava'}</div></div>
          {!connected ? (
            <>{error&&<div style={{ background:'#FFE8E8', color:'#992222', fontSize:12, padding:'8px 10px', borderRadius:8, marginBottom:10 }}>{error}</div>}
            <div style={{ fontSize:12.5, color:'#7A5500', lineHeight:1.5, marginBottom:12 }}>Sync your runs automatically after each Strava activity.</div>
            <button onClick={connectStrava} style={{ width:'100%', background:'#FC4C02', color:'#fff', border:'none', borderRadius:9, padding:11, fontWeight:700, fontSize:14, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}><span>🟠</span> Connect with Strava</button></>
          ) : (
            <div style={{ display:'flex', gap:8 }}>
              <button onClick={syncActivities} disabled={syncing} style={{ flex:1, background:'#FC4C02', color:'#fff', border:'none', borderRadius:9, padding:'9px 12px', fontWeight:700, fontSize:13, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:6 }}><RefreshCw size={14} style={{ animation:syncing?'spin 1s linear infinite':'none' }}/>{syncing?'Syncing…':'Sync now'}</button>
              <button onClick={disconnect} style={{ background:'none', border:'1.5px solid #E0DAD0', borderRadius:9, padding:'9px 12px', cursor:'pointer', color:'#9A9489', display:'flex', alignItems:'center', gap:6, fontSize:13 }}><LogOut size={14}/> Disconnect</button>
            </div>
          )}
        </div>
        <div style={{ display:'flex', gap:8 }}>
          <button onClick={onClose} style={{ background:'none', border:'1.5px solid #E0DAD0', borderRadius:10, padding:'13px 18px', cursor:'pointer', color:'#5c574d', fontSize:14 }}>Cancel</button>
          <button onClick={()=>onSave(draft)} style={{ flex:1, background:'#20242B', color:'#fff', border:'none', borderRadius:10, padding:13, fontWeight:700, fontSize:14, cursor:'pointer' }}>Save & rebuild</button>
        </div>
      </div>
    </div>
  )
}

function DraggableRow({ index, enabled, onDrop, children }) {
  const [isDragging,setIsDragging]=useState(false), [isOver,setIsOver]=useState(false)
  if (!enabled) return children
  return (
    <div draggable
      onDragStart={e=>{setIsDragging(true);e.dataTransfer.effectAllowed='move';e.dataTransfer.setData('text/plain',String(index))}}
      onDragEnd={()=>{setIsDragging(false);setIsOver(false)}}
      onDragOver={e=>{e.preventDefault();e.dataTransfer.dropEffect='move';setIsOver(true)}}
      onDragLeave={()=>setIsOver(false)}
      onDrop={e=>{e.preventDefault();const from=parseInt(e.dataTransfer.getData('text/plain'));onDrop(from,index);setIsOver(false)}}
      style={{ opacity:isDragging?0.4:1, outline:isOver&&!isDragging?'2px dashed #4C6B8A':'none', outlineOffset:'-2px', transition:'opacity 0.1s' }}>
      {children}
    </div>
  )
}

export default function App() {
  const [vdot,setVdot]=useState(47.4)
  const [peakMi,setPeakMi]=useState(68)
  const [raceDate,setRaceDate]=useState('2026-11-14')
  const [completed,setCompleted]=useState({})
  const [logs,setLogs]=useState({})
  const [wiggle,setWiggle]=useState({})
  const [workoutOrder,setWorkoutOrder]=useState({})
  const [expanded,setExpanded]=useState({})
  const [showSettings,setShowSettings]=useState(false)
  const [showWiggle,setShowWiggle]=useState(null)
  const [logTarget,setLogTarget]=useState(null)
  const [reorderMode,setReorderMode]=useState(null)
  const [stravaDetail,setStravaDetail]=useState(null)
  const [loaded,setLoaded]=useState(false)
  const strava=useStrava()

  useEffect(()=>{
    try {
      const s=JSON.parse(localStorage.getItem('plan:settings')||'null'); if(s){setVdot(s.vdot);setPeakMi(s.peakMi);setRaceDate(s.raceDate)}
      const c=JSON.parse(localStorage.getItem('plan:completed')||'null'); if(c)setCompleted(c)
      const l=JSON.parse(localStorage.getItem('plan:logs')||'null'); if(l)setLogs(l)
      const w=JSON.parse(localStorage.getItem('plan:wiggle')||'null'); if(w)setWiggle(w)
      const o=JSON.parse(localStorage.getItem('plan:wkorder')||'null'); if(o)setWorkoutOrder(o)
    } catch {}
    setLoaded(true)
  },[])

  const save=useCallback((key,val)=>{try{localStorage.setItem(key,JSON.stringify(val))}catch{}},[])
  const basePlan=useMemo(()=>buildPlan(vdot,peakMi,raceDate),[vdot,peakMi,raceDate])
  const equiv=useMemo(()=>equivTimes(vdot),[vdot])

  const plan=useMemo(()=>({
    ...basePlan,
    weeks:basePlan.weeks.map((wk,wi)=>{
      const order=workoutOrder[wi]; if(!order||order.length!==wk.days.length)return wk
      return{...wk,days:wk.days.map((slot,si)=>{const src=wk.days[order[si]];return{...src,name:slot.name,date:slot.date,isoDate:slot.isoDate}})}
    })
  }),[basePlan,workoutOrder])

  const today=useMemo(()=>{const d=new Date();d.setHours(0,0,0,0);return d},[])
  const todayWkIdx=plan.weeks.findIndex(w=>today>=w.startDate&&today<=w.endDate)
  const daysToRace=Math.max(0,Math.ceil((basePlan.raceDate-today)/86400000))

  useEffect(()=>{ if(loaded&&todayWkIdx>=0)setExpanded(p=>Object.keys(p).length?p:{[todayWkIdx]:true}) },[loaded,todayWkIdx])
  useEffect(()=>{ if(strava.connected&&strava.activities.length===0)strava.syncActivities() },[strava.connected])

  const toggleDone=useCallback(key=>{setCompleted(prev=>{const next={...prev,[key]:!prev[key]};save('plan:completed',next);return next})},[save])
  const saveLog=useCallback((wi,di,data)=>{
    const key=`${wi}-${di}`
    setLogs(prev=>{const next={...prev,[key]:data};save('plan:logs',next);return next})
    setCompleted(prev=>{const next={...prev,[key]:true};save('plan:completed',next);return next})
    setLogTarget(null)
  },[save])
  const setWeekWiggle=useCallback((wn,key)=>{setWiggle(prev=>{const next={...prev,[wn]:key};save('plan:wiggle',next);return next});setShowWiggle(null)},[save])
  const handleReorder=useCallback((wi,from,to)=>{
    if(from===to)return
    const cur=workoutOrder[wi]||basePlan.weeks[wi].days.map((_,i)=>i)
    const next=[...cur]; const [moved]=next.splice(from,1); next.splice(to,0,moved)
    setWorkoutOrder(prev=>{const n={...prev,[wi]:next};save('plan:wkorder',n);return n})
  },[basePlan,workoutOrder,save])
  const handleSaveSettings=useCallback(draft=>{
    const v=parseFloat(draft.vdot)||vdot,p=parseFloat(draft.peakMi)||peakMi,r=draft.raceDate||raceDate
    setVdot(v);setPeakMi(p);setRaceDate(r);setWorkoutOrder({});setShowSettings(false)
    save('plan:settings',{vdot:v,peakMi:p,raceDate:r});save('plan:wkorder',{})
  },[vdot,peakMi,raceDate,save])

  const totalPlanned=plan.weeks.reduce((s,w)=>s+w.totalMiles,0)
  const totalDone=plan.weeks.reduce((s,w,wi)=>s+w.days.reduce((s2,d,di)=>{const lg=logs[`${wi}-${di}`];return s2+(lg?(lg.miles||0):completed[`${wi}-${di}`]?d.miles:0)},0),0)
  const P=plan.paces
  const feelEmoji=['','😵','😕','😐','😊','🔥']

  return (
    <div style={{ background:'#F4F1EB', minHeight:'100vh', paddingBottom:60 }}>
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>

      {/* HERO */}
      <div style={{ background:'#20242B', color:'#F4F1EB', padding:'20px 18px 18px' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
          <div>
            <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:10.5, letterSpacing:'0.14em', color:'#FFC53D', textTransform:'uppercase', marginBottom:4 }}>Jack Daniels · Plan B · VDOT {vdot}</div>
            <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:800, fontSize:56, lineHeight:0.88, color:'#fff' }}>{daysToRace}</div>
            <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:11, color:'#8A8F96', marginTop:5 }}>days to the line · {basePlan.raceDate.toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'})}</div>
          </div>
          <div style={{ display:'flex', gap:8, alignItems:'center' }}>
            {strava.connected&&<button onClick={strava.syncActivities} disabled={strava.syncing} style={{ background:'#FC4C02', border:'none', color:'#fff', borderRadius:8, padding:'7px 10px', cursor:'pointer', display:'flex', alignItems:'center', gap:4, fontSize:12, fontWeight:700 }}><RefreshCw size={13} style={{ animation:strava.syncing?'spin 1s linear infinite':'none' }}/>{strava.syncing?'…':'Strava'}</button>}
            <button onClick={()=>setShowSettings(true)} style={{ background:'none', border:'1px solid #3A3F47', color:'#9AA1A8', borderRadius:8, padding:'7px 8px', cursor:'pointer' }}><Settings2 size={16}/></button>
          </div>
        </div>
        <div style={{ display:'flex', gap:10, marginTop:14, flexWrap:'wrap' }}>
          {equiv.map(e=><div key={e.label} style={{ background:'#2B3038', borderRadius:8, padding:'6px 11px' }}><div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:10, color:'#8A8F96', textTransform:'uppercase' }}>{e.label}</div><div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:20, color:'#fff', lineHeight:1.1 }}>{e.time}</div></div>)}
        </div>
        <div style={{ marginTop:14 }}>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:5 }}>
            <span style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:11, color:'#9AA1A8' }}>{Math.round(totalDone)} mi logged</span>
            <span style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:11, color:'#9AA1A8' }}>{Math.round(totalPlanned)} mi planned</span>
          </div>
          <div style={{ background:'#2B3038', borderRadius:6, height:6, overflow:'hidden' }}>
            <div style={{ background:'#FFC53D', height:'100%', width:`${Math.min(100,(totalDone/totalPlanned)*100)}%`, borderRadius:6, transition:'width 0.4s' }}/>
          </div>
        </div>
      </div>

      {/* PACES */}
      <div style={{ padding:'16px 16px 0' }}>
        <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:18, marginBottom:10 }}>Your Training Paces</div>
        <div style={{ display:'flex', gap:8, overflowX:'auto', paddingBottom:4 }}>
          {[
            {name:'EASY',val:`${YOUR_PACES.E.low}–${YOUR_PACES.E.high}`,sub:'/mi',color:'#2F6F4E'},
            {name:'MARATHON',val:`${YOUR_PACES.M.low}–${YOUR_PACES.M.high}`,sub:'/mi',color:'#3A5872'},
            {name:'THRESHOLD',val:`${YOUR_PACES.T.low}–${YOUR_PACES.T.high}`,sub:'/mi',color:'#B83D07'},
            {name:'INTERVAL',val:YOUR_PACES.I.per1k,sub:'/km',color:'#992222'},
            {name:'REPS 200',val:YOUR_PACES.R.per200,sub:'per 200m',color:'#6B2FA0'},
            {name:'REPS 400',val:YOUR_PACES.R.per400,sub:'per 400m',color:'#8A4FB0'},
          ].map(pc=>(
            <div key={pc.name} style={{ minWidth:96, background:'#fff', borderLeft:`4px solid ${pc.color}`, borderRadius:10, padding:'10px 12px', flexShrink:0 }}>
              <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:9, color:pc.color, fontWeight:600, letterSpacing:'0.06em' }}>{pc.name}</div>
              <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:20, lineHeight:1.1 }}>{pc.val}</div>
              <div style={{ fontSize:10, color:'#9A9489' }}>{pc.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* OVERVIEW */}
      <div style={{ padding:'16px 16px 0' }}>
        <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:18, marginBottom:10 }}>19-Week Overview</div>
        <div style={{ background:'#fff', border:'1px solid #E4DFD4', borderRadius:12, padding:'14px 14px 10px' }}>
          <div style={{ height:48, display:'flex', alignItems:'flex-end', gap:2 }}>
            {plan.weeks.map((wk,i)=>{
              const h=Math.max(6,(wk.totalMiles/(peakMi+6))*44),color=PHASE_META[wk.phase]?.color||'#999'
              return <div key={i} style={{ flex:1, height:h, background:color, opacity:i===todayWkIdx?1:0.7, borderRadius:'3px 3px 0 0', outline:i===todayWkIdx?'2px solid #20242B':'none', outlineOffset:1, cursor:'pointer' }} onClick={()=>setExpanded(p=>({...p,[i]:true}))}/>
            })}
          </div>
          <div style={{ display:'flex', justifyContent:'space-between', marginTop:8, fontFamily:"'IBM Plex Mono',monospace", fontSize:10.5, color:'#9A9489' }}>
            <span>{fmtD(plan.weeks[0].startDate)}</span>
            <span style={{ color:'#C8312F', fontWeight:600 }}>peak {peakMi} mi</span>
            <span style={{ display:'flex', alignItems:'center', gap:3 }}><Flag size={10}/>{fmtD(plan.weeks[plan.weeks.length-1].endDate)}</span>
          </div>
          <div style={{ display:'flex', gap:10, flexWrap:'wrap', marginTop:10 }}>
            {Object.values(PHASE_META).map((ph,i)=><span key={i} style={{ display:'flex', alignItems:'center', gap:4, fontSize:10.5, color:'#6B645A' }}><span style={{ width:8, height:8, borderRadius:2, background:ph.color, display:'inline-block' }}/>{ph.label}</span>)}
          </div>
        </div>
      </div>

      {/* WEEKS */}
      <div style={{ padding:'16px 16px 0' }}>
        <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:18, marginBottom:10 }}>Week-by-Week</div>
        {plan.weeks.map((wk,wi)=>{
          const isOpen=!!expanded[wi],isNow=wi===todayWkIdx
          const ph=PHASE_META[wk.phase],wKey=wk.weekNum
          const wWiggle=wiggle[wKey]||'normal',wInfo=WIGGLE[wWiggle]
          const adjMiles=Math.round(wk.totalMiles*wInfo.mult)
          const doneRuns=wk.days.filter((_,di)=>completed[`${wi}-${di}`]).length
          const totalRuns=wk.days.filter(d=>d.miles>0).length
          const isReorder=reorderMode===wi
          return (
            <div key={wi} style={{ background:'#fff', border:`1px solid ${isNow?ph.color:'#E4DFD4'}`, borderLeft:`${isNow?4:1}px solid ${isNow?ph.color:'#E4DFD4'}`, borderRadius:14, marginBottom:9, overflow:'hidden' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'13px 14px', cursor:'pointer' }} onClick={()=>setExpanded(p=>({...p,[wi]:!p[wi]}))}>
                <div>
                  <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:2, flexWrap:'wrap' }}>
                    <span style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:10.5, fontWeight:600, color:ph.color, textTransform:'uppercase', letterSpacing:'0.06em' }}>{ph.label}</span>
                    {isNow&&<span style={{ background:'#FFC53D', color:'#20242B', fontSize:9.5, fontWeight:800, padding:'1px 6px', borderRadius:5, fontFamily:"'IBM Plex Mono',monospace" }}>THIS WEEK</span>}
                    {wWiggle!=='normal'&&<span style={{ background:wInfo.color+'18', color:wInfo.color, fontSize:9.5, fontWeight:700, padding:'1px 6px', borderRadius:5, fontFamily:"'IBM Plex Mono',monospace" }}>{wInfo.icon} {wInfo.label}</span>}
                  </div>
                  <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:18 }}>Week {wk.weekNum} · {fmtD(wk.startDate)}–{fmtD(wk.endDate)}</div>
                  <div style={{ fontSize:11.5, color:'#9A9489', marginTop:2 }}>{doneRuns}/{totalRuns} runs logged</div>
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:8, flexShrink:0 }}>
                  <div style={{ textAlign:'right' }}>
                    <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:13, fontWeight:600 }}>{adjMiles} mi</div>
                    {wWiggle!=='normal'&&<div style={{ fontSize:10, color:'#9A9489' }}>base {wk.totalMiles}</div>}
                  </div>
                  {isOpen?<ChevronUp size={16} color="#9A9489"/>:<ChevronDown size={16} color="#9A9489"/>}
                </div>
              </div>

              {isOpen&&(
                <>
                  <div style={{ background:ph.color+'0E', borderTop:`1px solid ${ph.color}28`, padding:'8px 14px', fontSize:12, color:'#5c574d' }}>{ph.desc}</div>
                  <div style={{ borderTop:'1px solid #F0EBE1', padding:'8px 14px', display:'flex', alignItems:'center', gap:8, flexWrap:'wrap' }}>
                    <button onClick={e=>{e.stopPropagation();setShowWiggle(showWiggle===wKey?null:wKey)}} style={{ background:wInfo.color+'15', border:`1.5px solid ${wInfo.color}`, color:wInfo.color, borderRadius:8, padding:'5px 10px', fontSize:12, fontWeight:700, cursor:'pointer', fontFamily:"'IBM Plex Mono',monospace", display:'flex', alignItems:'center', gap:5 }}><Sliders size={12}/> {wInfo.icon} {wInfo.label}</button>
                    <button onClick={e=>{e.stopPropagation();setReorderMode(isReorder?null:wi)}} style={{ background:isReorder?'#20242B':'none', border:`1.5px solid ${isReorder?'#20242B':'#E0DAD0'}`, color:isReorder?'#fff':'#5c574d', borderRadius:8, padding:'5px 10px', fontSize:12, fontWeight:600, cursor:'pointer', display:'flex', alignItems:'center', gap:5 }}><GripVertical size={12}/>{isReorder?'Done reordering':'Reorder workouts'}</button>
                  </div>
                  {isReorder&&<div style={{ background:'#EDF4FF', borderTop:'1px solid #C8D8F0', padding:'8px 14px', fontSize:12, color:'#4C6B8A' }}>💡 Drag <b>≡</b> handles to move workouts. The day name and date stay fixed — only the workout content moves.</div>}
                  {showWiggle===wKey&&<div style={{ padding:'10px 14px 14px', borderTop:'1px solid #F0EBE1' }}><WigglePicker value={wWiggle} onChange={key=>setWeekWiggle(wKey,key)}/></div>}

                  {wk.days.map((d,di)=>{
                    const dKey=`${wi}-${di}`,isDone=!!completed[dKey],isRest=d.type==='REST'
                    const lg=logs[dKey],stravaAct=strava.connected?strava.matchActivity(d.isoDate):null
                    return (
                      <DraggableRow key={`${wi}-${di}`} index={di} enabled={isReorder} onDrop={(from,to)=>handleReorder(wi,from,to)}>
                        <div style={{ display:'flex', gap:10, padding:'11px 14px', borderTop:'1px solid #F0EBE1', alignItems:'flex-start', background:isDone?'#F8F6F1':'#fff' }}>
                          {isReorder&&<div style={{ color:'#C8C2B6', cursor:'grab', flexShrink:0, marginTop:4 }}><GripVertical size={16}/></div>}
                          {!isReorder&&<button disabled={isRest} onClick={()=>!isRest&&toggleDone(dKey)} style={{ width:26, height:26, borderRadius:8, border:`2px solid ${isDone?'#2F6F4E':'#D4CEC4'}`, background:isDone?'#2F6F4E':'#fff', flexShrink:0, marginTop:1, display:'flex', alignItems:'center', justifyContent:'center', cursor:isRest?'default':'pointer', opacity:isRest?0.25:1, transition:'all 0.12s' }}>{isDone&&<Check size={14} color="#fff"/>}{d.type==='RACE'&&!isDone&&<Flag size={13} color="#FFC53D"/>}</button>}
                          <div style={{ flex:1, minWidth:0 }}>
                            <div style={{ display:'flex', alignItems:'center', gap:7, flexWrap:'wrap' }}>
                              <span style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:12, fontWeight:600 }}>{d.name}</span>
                              <span style={{ fontSize:11, color:'#B0A898' }}>{d.date}</span>
                              <Badge type={d.type}/>
                              <span style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:10, color:'#B0A898', background:'#F4F1EB', padding:'1px 5px', borderRadius:4 }}>{d.code}</span>
                            </div>
                            <div style={{ fontWeight:600, fontSize:13, marginTop:3 }}>{d.label}</div>
                            <div style={{ fontSize:12, color:'#5c574d', marginTop:2, lineHeight:1.5 }}>{d.desc}</div>
                            {stravaAct&&!lg&&<StravaCard activity={stravaAct} onViewDetail={()=>setStravaDetail(stravaAct.id)}/>}
                            {lg&&<div style={{ background:'#F4F1EB', borderRadius:8, padding:'8px 10px', fontSize:12, color:'#5c574d', marginTop:6, lineHeight:1.5 }}>{lg.miles>0&&<span><b>{lg.miles} mi</b></span>}{lg.time&&<span> · ⏱ {lg.time}</span>}{lg.hr&&<span> · ❤️ {lg.hr} bpm</span>}{lg.feel&&<span> · {feelEmoji[lg.feel]}</span>}{lg.notes&&<div style={{ marginTop:4 }}>{lg.notes}</div>}</div>}
                            {!isRest&&!isReorder&&<button onClick={()=>setLogTarget({wi,di})} style={{ marginTop:7, background:'none', border:'1.5px solid #E0DAD0', borderRadius:8, padding:'5px 11px', fontSize:12, fontWeight:600, cursor:'pointer', color:'#5c574d', display:'inline-flex', alignItems:'center', gap:5 }}><PenLine size={12}/>{lg?'Edit log':stravaAct?'Save Strava run':'Log this run'}</button>}
                          </div>
                          {d.miles>0&&!isReorder&&<div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:11.5, color:'#9A9489', flexShrink:0, paddingTop:2 }}>{d.miles} mi</div>}
                        </div>
                      </DraggableRow>
                    )
                  })}
                </>
              )}
            </div>
          )
        })}
      </div>

      {showSettings&&<SettingsSheet vdot={vdot} peakMi={peakMi} raceDate={raceDate} strava={strava} onSave={handleSaveSettings} onClose={()=>setShowSettings(false)}/>}
      {logTarget&&(()=>{const{wi,di}=logTarget,day=plan.weeks[wi]?.days[di],stravaAct=strava.connected?strava.matchActivity(day?.isoDate):null;if(!day)return null;return<LogModal day={day} existing={logs[`${wi}-${di}`]} stravaActivity={stravaAct} onSave={data=>saveLog(wi,di,data)} onClose={()=>setLogTarget(null)}/>})()}
      {stravaDetail&&<StravaDetail activityId={stravaDetail} fetchDetail={strava.fetchDetail} onClose={()=>setStravaDetail(null)}/>}
    </div>
  )
}
