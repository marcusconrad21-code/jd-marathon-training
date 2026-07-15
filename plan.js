function velocityForVO2(vo2) {
  const a=0.000104,b=0.182258,c=-(vo2+4.6)
  return (-b+Math.sqrt(b*b-4*a*c))/(2*a)
}
function paceMinMi(v){return 1609.34/v}
function fmt(minMi){const s=Math.round(minMi*60);return `${Math.floor(s/60)}:${(s%60).toString().padStart(2,'0')}`}
function fmtSec(s){const ss=Math.round(s);return `${Math.floor(ss/60)}:${(ss%60).toString().padStart(2,'0')}`}
function pctVO2(t){return 0.8+0.1894393*Math.exp(-0.012778*t)+0.2989558*Math.exp(-0.1932605*t)}
function marathonV(vdot){
  let t=200
  for(let i=0;i<10;i++){const v=velocityForVO2(vdot*pctVO2(t));t=paceMinMi(v)*26.2188}
  return{v:velocityForVO2(vdot*pctVO2(t)),finish:t}
}
export function buildPaces(vdot){
  const eL=velocityForVO2(vdot*0.59),eH=velocityForVO2(vdot*0.74)
  const{v:mV,finish}=marathonV(vdot)
  const tV=velocityForVO2(vdot*pctVO2(60))
  const iV=velocityForVO2(vdot*1.0),rV=iV*1.045
  const mk=v=>{const mpm=paceMinMi(v);return{mile:fmt(mpm),per400:fmtSec(mpm/1609.34*400*60),per1k:fmtSec(mpm/1609.34*1000*60)}}
  return{E:{low:fmt(paceMinMi(eL)),high:fmt(paceMinMi(eH))},M:{...mk(mV),finish},T:mk(tV),I:mk(iV),R:mk(rV)}
}
export function equivTimes(vdot){
  return[{label:'5K',mi:3.1069},{label:'10K',mi:6.2137},{label:'Half',mi:13.1094},{label:'Marathon',mi:26.2188}].map(d=>{
    let t=25
    for(let i=0;i<10;i++){const v=velocityForVO2(vdot*pctVO2(t));t=paceMinMi(v)*d.mi}
    const ts=Math.round(t*60),h=Math.floor(ts/3600),m=Math.floor((ts%3600)/60),s=ts%60
    return{label:d.label,time:h>0?`${h}:${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`:`${m}:${s.toString().padStart(2,'0')}`}
  })
}
