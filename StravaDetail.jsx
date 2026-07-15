export function decodePolyline(encoded) {
  if (!encoded) return []
  let index=0,lat=0,lng=0; const coords=[]
  while(index<encoded.length){
    let b,shift=0,result=0
    do{b=encoded.charCodeAt(index++)-63;result|=(b&0x1f)<<shift;shift+=5}while(b>=0x20)
    lat+=result&1?~(result>>1):result>>1; shift=0;result=0
    do{b=encoded.charCodeAt(index++)-63;result|=(b&0x1f)<<shift;shift+=5}while(b>=0x20)
    lng+=result&1?~(result>>1):result>>1
    coords.push([lat/1e5,lng/1e5])
  }
  return coords
}
export function fmtDuration(secs){const s=Math.round(secs),h=Math.floor(s/3600),m=Math.floor((s%3600)/60),ss=s%60;return h>0?`${h}:${m.toString().padStart(2,'0')}:${ss.toString().padStart(2,'0')}`:`${m}:${ss.toString().padStart(2,'0')}`}
export function fmtPace(mps){if(!mps||mps<=0)return'—';const spm=1609.34/mps,pm=Math.floor(spm/60),ps=Math.round(spm%60);return`${pm}:${ps.toString().padStart(2,'0')}/mi`}
export function fmtMiles(m){return(m/1609.34).toFixed(2)}
export function fmtFeet(m){return Math.round(m*3.28084)}
export const ZONE_COLORS=['','#6DB3F2','#72CF72','#F5C542','#F5954B','#E84040']
export const ZONE_LABELS=['','Z1 Recovery','Z2 Aerobic','Z3 Tempo','Z4 Threshold','Z5 Max']
export function buildSplits(laps){
  if(!laps?.length)return[]
  return laps.map((lap,i)=>({lap:i+1,miles:fmtMiles(lap.distance),pace:fmtPace(lap.average_speed),hr:lap.average_heartrate?Math.round(lap.average_heartrate):null,elev:lap.total_elevation_gain?fmtFeet(lap.total_elevation_gain):0,duration:fmtDuration(lap.moving_time)}))
}
export function parseActivity(act){
  if(!act)return null
  return{id:act.id,name:act.name,date:new Date(act.start_date_local).toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric'}),miles:fmtMiles(act.distance),duration:fmtDuration(act.moving_time),pace:fmtPace(act.average_speed),avgHr:act.average_heartrate?Math.round(act.average_heartrate):null,maxHr:act.max_heartrate?Math.round(act.max_heartrate):null,elevGain:act.total_elevation_gain?fmtFeet(act.total_elevation_gain):null,elevLoss:act.total_elevation_loss?fmtFeet(act.total_elevation_loss):null,calories:act.calories||null,cadence:act.average_cadence?Math.round(act.average_cadence*2):null,polyline:act.map?.summary_polyline||act.map?.polyline||null,segments:act.segment_efforts||[],laps:act.laps||[],kudos:act.kudos_count||0,url:`https://www.strava.com/activities/${act.id}`,splits_standard:act.splits_standard||[]}
}
