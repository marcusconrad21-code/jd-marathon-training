import { useState, useEffect, useRef } from 'react'
import { X, ExternalLink, TrendingUp, Heart, Zap, Award, ChevronDown, ChevronUp } from 'lucide-react'
import { decodePolyline, fmtDuration, fmtPace, fmtFeet, fmtMiles, parseActivity, buildSplits, ZONE_COLORS, ZONE_LABELS } from './stravaUtils.js'

function Stat({ label, value, sub, color }) {
  return (
    <div style={{ background:'#F8F6F1', borderRadius:10, padding:'10px 12px', flex:1, minWidth:80 }}>
      <div style={{ fontSize:10, fontWeight:700, color:color||'#9A9489', textTransform:'uppercase', letterSpacing:'0.06em', fontFamily:"'IBM Plex Mono',monospace" }}>{label}</div>
      <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:22, lineHeight:1.1, color:'#20242B', marginTop:2 }}>{value??'—'}</div>
      {sub && <div style={{ fontSize:10.5, color:'#9A9489', marginTop:1 }}>{sub}</div>}
    </div>
  )
}

function HRZoneBar({ zones }) {
  const hrZone = zones?.find(z=>z.type==='heartrate')
  if (!hrZone?.distribution_buckets?.length) return null
  const buckets = hrZone.distribution_buckets
  const total   = buckets.reduce((s,b)=>s+b.time,0)
  if (!total) return null
  return (
    <div>
      <div style={{ fontWeight:700, fontSize:13, marginBottom:8, display:'flex', alignItems:'center', gap:6 }}><Heart size={14} color="#E84040"/> Heart Rate Zones</div>
      <div style={{ display:'flex', borderRadius:8, overflow:'hidden', height:14, marginBottom:10 }}>
        {buckets.map((b,i)=>{const pct=(b.time/total)*100;if(pct<1)return null;return <div key={i} title={`Z${i+1}: ${Math.round(pct)}%`} style={{ width:`${pct}%`, background:ZONE_COLORS[i+1]||'#ccc' }}/>})}
      </div>
      {buckets.map((b,i)=>{
        const pct=Math.round((b.time/total)*100)
        return <div key={i} style={{ display:'flex', alignItems:'center', gap:8, marginBottom:5 }}>
          <div style={{ width:10, height:10, borderRadius:3, background:ZONE_COLORS[i+1], flexShrink:0 }}/>
          <span style={{ fontSize:12, color:'#5c574d', flex:1 }}>{ZONE_LABELS[i+1]}</span>
          <span style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:11, color:'#20242B', fontWeight:600 }}>{fmtDuration(b.time)}</span>
          <span style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:11, color:'#9A9489', width:32, textAlign:'right' }}>{pct}%</span>
        </div>
      })}
    </div>
  )
}

function ElevationProfile({ splits }) {
  if (!splits?.length) return null
  let cum=0; const points=splits.map(s=>{cum+=(s.elevation_difference??0);return cum})
  const min=Math.min(...points),max=Math.max(...points),range=max-min||1
  const W=300,H=60
  const pts=points.map((v,i)=>`${(i/(points.length-1||1))*W},${H-((v-min)/range)*(H-8)-4}`).join(' ')
  return (
    <div>
      <div style={{ fontWeight:700, fontSize:13, marginBottom:8, display:'flex', alignItems:'center', gap:6 }}><TrendingUp size={14} color="#4C6B8A"/> Elevation Profile</div>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width:'100%', height:60 }} preserveAspectRatio="none">
        <defs><linearGradient id="eg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#4C6B8A" stopOpacity="0.4"/><stop offset="100%" stopColor="#4C6B8A" stopOpacity="0.05"/></linearGradient></defs>
        <polyline points={pts} fill="none" stroke="#4C6B8A" strokeWidth="2" strokeLinejoin="round"/>
        <polygon points={`0,${H} ${pts} ${W},${H}`} fill="url(#eg)"/>
      </svg>
    </div>
  )
}

function SplitsTable({ laps, splits_standard }) {
  const rows = laps?.length ? buildSplits(laps) : (splits_standard||[]).map((s,i)=>({ lap:i+1, miles:fmtMiles(s.distance), pace:fmtPace(s.average_speed), hr:s.average_heartrate?Math.round(s.average_heartrate):null, elev:s.elevation_difference?fmtFeet(Math.abs(s.elevation_difference)):0, duration:fmtDuration(s.moving_time) }))
  if (!rows.length) return null
  const paces=rows.map(r=>{const[m,s]=r.pace.replace('/mi','').split(':').map(Number);return m*60+(s||0)})
  const minP=Math.min(...paces),maxP=Math.max(...paces),pRange=maxP-minP||1
  return (
    <div>
      <div style={{ fontWeight:700, fontSize:13, marginBottom:8, display:'flex', alignItems:'center', gap:6 }}><Zap size={14} color="#B83D07"/> Mile Splits</div>
      <div style={{ overflowX:'auto' }}>
        <table style={{ width:'100%', borderCollapse:'collapse', fontSize:12, fontFamily:"'IBM Plex Mono',monospace" }}>
          <thead><tr style={{ borderBottom:'2px solid #E8E3D9' }}>{['Mi','Pace','HR','Elev','Time'].map(h=><th key={h} style={{ textAlign:'left', padding:'4px 8px 6px', fontSize:10, fontWeight:700, color:'#9A9489', textTransform:'uppercase', letterSpacing:'0.06em' }}>{h}</th>)}</tr></thead>
          <tbody>
            {rows.map((r,i)=>{
              const [m,s]=r.pace.replace('/mi','').split(':').map(Number)
              const ps=m*60+(s||0),rel=(ps-minP)/pRange
              const color=`hsl(${120-rel*120},60%,48%)`
              return <tr key={i} style={{ borderBottom:'1px solid #F0EBE1', background:i%2===0?'#FAFAF7':'#fff' }}>
                <td style={{ padding:'6px 8px', fontWeight:600 }}>{r.lap}</td>
                <td style={{ padding:'6px 8px' }}><div style={{ display:'flex', alignItems:'center', gap:6 }}><div style={{ width:4, height:16, borderRadius:2, background:color, flexShrink:0 }}/>{r.pace}</div></td>
                <td style={{ padding:'6px 8px', color:r.hr?'#E84040':'#9A9489' }}>{r.hr?`${r.hr}♥`:'—'}</td>
                <td style={{ padding:'6px 8px', color:'#4C6B8A' }}>{r.elev?`+${r.elev}ft`:'—'}</td>
                <td style={{ padding:'6px 8px', color:'#5c574d' }}>{r.duration}</td>
              </tr>
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function Segments({ segments }) {
  const [open,setOpen]=useState(false)
  if (!segments?.length) return null
  const shown=open?segments:segments.slice(0,3)
  return (
    <div>
      <div style={{ fontWeight:700, fontSize:13, marginBottom:8, display:'flex', alignItems:'center', gap:6 }}><Award size={14} color="#8A4FB0"/> Segments ({segments.length})</div>
      {shown.map((seg,i)=>{
        const isKom=seg.achievements?.some(a=>a.type==='overall'),isPr=seg.pr_rank===1
        return <div key={i} style={{ display:'flex', alignItems:'center', gap:10, padding:'8px 10px', background:i%2===0?'#FAFAF7':'#fff', borderRadius:8, marginBottom:4 }}>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontSize:12, fontWeight:600, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{isKom&&<span style={{ color:'#FFD700', marginRight:4 }}>👑</span>}{isPr&&<span style={{ color:'#8A4FB0', marginRight:4 }}>🏆</span>}{seg.name}</div>
            <div style={{ fontSize:11, color:'#9A9489', fontFamily:"'IBM Plex Mono',monospace", marginTop:2 }}>{fmtMiles(seg.distance)} mi · {fmtDuration(seg.moving_time)} · {fmtPace(seg.distance/seg.moving_time)}</div>
          </div>
          {seg.pr_rank&&<div style={{ fontSize:10, fontWeight:700, color:'#8A4FB0', background:'#F3E8FF', padding:'2px 7px', borderRadius:5, flexShrink:0 }}>PR #{seg.pr_rank}</div>}
        </div>
      })}
      {segments.length>3&&<button onClick={()=>setOpen(o=>!o)} style={{ width:'100%', background:'none', border:'1.5px solid #E0DAD0', borderRadius:8, padding:7, fontSize:12, cursor:'pointer', color:'#5c574d', marginTop:4, display:'flex', alignItems:'center', justifyContent:'center', gap:4 }}>{open?<><ChevronUp size={13}/>Show less</>:<><ChevronDown size={13}/>Show {segments.length-3} more</>}</button>}
    </div>
  )
}

function RouteMap({ polyline }) {
  const mapRef=useRef(null), mapObj=useRef(null)
  useEffect(()=>{
    if (!polyline||!mapRef.current||mapObj.current) return
    const coords=decodePolyline(polyline); if (!coords.length) return
    function initMap(coords){
      if (mapObj.current) return
      const map=window.L.map(mapRef.current,{zoomControl:true,attributionControl:false})
      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map)
      const line=window.L.polyline(coords,{color:'#FC4C02',weight:4,opacity:0.85}).addTo(map)
      window.L.circleMarker(coords[0],{radius:7,color:'#fff',fillColor:'#2F6F4E',fillOpacity:1,weight:2}).addTo(map)
      window.L.circleMarker(coords[coords.length-1],{radius:7,color:'#fff',fillColor:'#C8312F',fillOpacity:1,weight:2}).addTo(map)
      map.fitBounds(line.getBounds(),{padding:[16,16]}); mapObj.current=map
    }
    if (!window.L){
      const link=document.createElement('link'); link.rel='stylesheet'; link.href='https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'; document.head.appendChild(link)
      const script=document.createElement('script'); script.src='https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'; script.onload=()=>initMap(coords); document.head.appendChild(script)
    } else { initMap(coords) }
    return ()=>{ if(mapObj.current){mapObj.current.remove();mapObj.current=null} }
  },[polyline])
  if (!polyline) return <div style={{ background:'#F0EBE1', borderRadius:10, height:160, display:'flex', alignItems:'center', justifyContent:'center', color:'#9A9489', fontSize:12 }}>No GPS data available</div>
  return <div ref={mapRef} style={{ height:200, borderRadius:10, overflow:'hidden', zIndex:0 }}/>
}

export default function StravaDetail({ activityId, fetchDetail, onClose }) {
  const [detail,setDetail]=useState(null), [loading,setLoading]=useState(true)
  useEffect(()=>{ setLoading(true); fetchDetail(activityId).then(d=>{setDetail(d);setLoading(false)}) },[activityId])
  const act=detail?parseActivity(detail):null
  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.6)', display:'flex', alignItems:'flex-end', justifyContent:'center', zIndex:300 }} onClick={onClose}>
      <div style={{ background:'#fff', width:'100%', maxWidth:480, borderRadius:'20px 20px 0 0', maxHeight:'92vh', overflowY:'auto', paddingBottom:32 }} onClick={e=>e.stopPropagation()}>
        <div style={{ position:'sticky', top:0, background:'#fff', padding:'16px 18px 12px', borderBottom:'1px solid #F0EBE1', zIndex:10, display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:8 }}><span style={{ fontSize:18 }}>🟠</span><div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:20 }}>{loading?'Loading…':act?.name}</div></div>
            {act&&<div style={{ fontSize:12, color:'#9A9489', marginTop:2 }}>{act.date}</div>}
          </div>
          <div style={{ display:'flex', gap:8, alignItems:'center' }}>
            {act&&<a href={act.url} target="_blank" rel="noopener noreferrer" style={{ background:'#FC4C02', color:'#fff', border:'none', borderRadius:8, padding:'6px 10px', fontSize:12, fontWeight:700, textDecoration:'none', display:'flex', alignItems:'center', gap:4 }}><ExternalLink size={12}/> Strava</a>}
            <button onClick={onClose} style={{ background:'none', border:'1px solid #E0DAD0', borderRadius:8, padding:'6px 8px', cursor:'pointer' }}><X size={16}/></button>
          </div>
        </div>
        {loading&&<div style={{ padding:40, textAlign:'center', color:'#9A9489', fontSize:13 }}>Fetching activity data…</div>}
        {act&&(
          <div style={{ padding:'16px 18px', display:'flex', flexDirection:'column', gap:20 }}>
            <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
              <Stat label="Distance" value={`${act.miles} mi`}/>
              <Stat label="Time" value={act.duration}/>
              <Stat label="Pace" value={act.pace} color="#B83D07"/>
            </div>
            <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
              {act.avgHr&&<Stat label="Avg HR" value={`${act.avgHr} bpm`} sub={act.maxHr?`max ${act.maxHr}`:null} color="#E84040"/>}
              {act.elevGain&&<Stat label="Gain" value={`+${act.elevGain}ft`} color="#4C6B8A"/>}
              {act.elevLoss&&<Stat label="Loss" value={`-${act.elevLoss}ft`} color="#9A9489"/>}
              {act.cadence&&<Stat label="Cadence" value={act.cadence} sub="spm"/>}
              {act.calories&&<Stat label="Calories" value={act.calories}/>}
            </div>
            <div><div style={{ fontWeight:700, fontSize:13, marginBottom:8 }}>🗺 Route</div><RouteMap polyline={act.polyline}/></div>
            {detail?.splits_metric?.length>0&&<ElevationProfile splits={detail.splits_metric}/>}
            {detail?.zones&&<HRZoneBar zones={detail.zones}/>}
            <SplitsTable laps={detail?.laps} splits_standard={detail?.splits_standard}/>
            <Segments segments={act.segments}/>
          </div>
        )}
      </div>
    </div>
  )
}
