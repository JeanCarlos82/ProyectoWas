const DK=["domingo","lunes","martes","miercoles","jueves","viernes","sabado"];
const DL={domingo:"Domingo",lunes:"Lunes",martes:"Martes",miercoles:"Miércoles",jueves:"Jueves",viernes:"Viernes",sabado:"Sábado"};
const MO=['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
const OBJS={fuerza:{reps:"1–5 reps",series:"4–6 series"},hipertrofia:{reps:"6–12 reps",series:"3–4 series"},resistencia:{reps:"13–20 reps",series:"2–3 series"}};
const IMC_C=[{max:18.5,label:"Bajo peso",color:"#3ab4ff"},{max:25,label:"Peso normal",color:"#3aff8a"},{max:30,label:"Sobrepeso",color:"#ffaa3a"},{max:35,label:"Obesidad I",color:"#ff4d4d"},{max:999,label:"Obesidad II+",color:"#ff4d4d"}];
const DR={lunes:{label:"Pecho + Tríceps",rest:false,exercises:[{name:"Press banca",type:"pesas"},{name:"Press inclinado",type:"pesas"},{name:"Aperturas mancuernas",type:"pesas"},{name:"Fondos en paralelas",type:"pesas"},{name:"Press francés",type:"pesas"}]},martes:{label:"Espalda + Bíceps",rest:false,exercises:[{name:"Jalón al pecho",type:"pesas"},{name:"Remo con barra",type:"pesas"},{name:"Remo en polea baja",type:"pesas"},{name:"Curl con barra",type:"pesas"},{name:"Curl martillo",type:"pesas"}]},miercoles:{label:"Hombros",rest:false,exercises:[{name:"Press militar",type:"pesas"},{name:"Elevaciones laterales",type:"pesas"},{name:"Elevaciones frontales",type:"pesas"},{name:"Pájaros",type:"pesas"}]},jueves:{label:"Pierna",rest:false,exercises:[{name:"Sentadilla",type:"pesas"},{name:"Prensa de pierna",type:"pesas"},{name:"Extensiones cuádriceps",type:"pesas"},{name:"Curl femoral",type:"pesas"},{name:"Pantorrillas",type:"pesas"}]},viernes:{label:"Bíceps + Tríceps",rest:false,exercises:[{name:"Curl concentrado",type:"pesas"},{name:"Curl en polea",type:"pesas"},{name:"Tríceps en polea",type:"pesas"},{name:"Patada de tríceps",type:"pesas"}]},sabado:{label:"Cardio",rest:false,exercises:[{name:"Correr",type:"cardio"},{name:"Bicicleta estática",type:"cardio"},{name:"Elíptica",type:"cardio"}]},domingo:{label:"Descanso",rest:true,exercises:[]}};

function loadDB(){try{return{routine:JSON.parse(localStorage.getItem('gym_routine'))||DR,sessions:JSON.parse(localStorage.getItem('gym_sessions'))||[],profile:JSON.parse(localStorage.getItem('gym_profile'))||{name:'',age:'',sex:'H',height:'',weight:'',restTimerSeconds:90},objective:localStorage.getItem('gym_objective')||'hipertrofia',bw:JSON.parse(localStorage.getItem('gym_bw'))||[]}}catch{return{routine:DR,sessions:[],profile:{name:'',age:'',sex:'H',height:'',weight:'',restTimerSeconds:90},objective:'hipertrofia',bw:[]}}}
function ps(k,v){localStorage.setItem(k,typeof v==='string'?v:JSON.stringify(v));}
let db=loadDB(),selMG=null,selEx=null,bwCh=null,progCh=null,curEx=null,curType=null,curUnit='kg',currentSets=[];

// Timer globals
let timerInterval=null,timerRemaining=0,timerTotal=0;
// Duration globals
let durationInterval=null;

const today=()=>new Date().toISOString().split('T')[0];
const todayDK=()=>DK[new Date().getDay()];
const fmtD=d=>{const[y,m,dd]=d.split('-');return`${parseInt(dd)} ${MO[parseInt(m)-1]}`;};
const fmtDF=d=>{const[y,m,dd]=d.split('-');return`${parseInt(dd)} ${MO[parseInt(m)-1]} ${y}`;};
function toast(msg){const t=document.getElementById('toast');t.textContent=msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2200);}

// ── 1RM Calculator (Epley) ──
function calc1RM(w,r){
  if(!w||!r||r<=0)return 0;
  if(r===1)return w;
  return Math.round(w*(1+r/30)*10)/10;
}
function entryBest1RM(e){
  if(!e||!e.sets?.length)return 0;
  const working=e.sets.filter(s=>!s.warmup);
  if(!working.length)return 0;
  return Math.max(...working.map(s=>calc1RM(parseFloat(s.w)||0,parseInt(s.r)||0)));
}

// ── Entry helpers (warmup-aware) ──
function entryMaxWeight(e){
  if(!e)return null;
  if(e.sets?.length){
    const working=e.sets.filter(s=>!s.warmup);
    if(!working.length)return null;
    return Math.max(...working.map(s=>parseFloat(s.w)||0));
  }
  if(e.weight)return parseFloat(e.weight);
  return null;
}
function entryVolume(e){
  if(!e)return 0;
  if(e.sets?.length)return e.sets.filter(s=>!s.warmup).reduce((a,s)=>a+(parseFloat(s.w)||0)*(parseInt(s.r)||0),0);
  return 0;
}
function entrySetCount(e){
  if(!e)return 0;
  if(e.sets?.length){
    const w=e.sets.filter(s=>!s.warmup).length;
    const c=e.sets.filter(s=>s.warmup).length;
    return{working:w,warmup:c,total:e.sets.length};
  }
  return{working:e.weight?1:0,warmup:0,total:e.weight?1:0};
}
function entrySummaryText(e){
  if(!e)return '';
  if(e.sets?.length){
    const mx=entryMaxWeight(e),sc=entrySetCount(e);
    const parts=[];
    if(sc.warmup)parts.push(`${sc.warmup}C`);
    parts.push(`${sc.working}T`);
    return`${parts.join('+')} series · ${mx}${e.unit||'kg'} máx`;
  }
  if(e.weight)return`${e.weight} ${e.unit||'kg'}`;
  if(e.type==='cardio')return`${e.min||0}min${e.km?' · '+e.km+'km':''}`;
  return '';
}

// ── Duration helpers ──
function fmtDuration(startISO,endISO){
  if(!startISO||!endISO)return '';
  const ms=new Date(endISO)-new Date(startISO);
  if(ms<0)return '';
  const mins=Math.floor(ms/60000);
  if(mins<60)return`${mins} min`;
  const h=Math.floor(mins/60),m=mins%60;
  return`${h}h ${m}min`;
}
function fmtElapsed(startISO){
  const ms=Date.now()-new Date(startISO).getTime();
  if(ms<0)return '0:00';
  const mins=Math.floor(ms/60000),secs=Math.floor((ms%60000)/1000);
  if(mins<60)return`${mins}:${secs.toString().padStart(2,'0')}`;
  const h=Math.floor(mins/60),m=mins%60;
  return`${h}:${m.toString().padStart(2,'0')}:${secs.toString().padStart(2,'0')}`;
}

// ── Racha de Constancia ──
function calcStreak(){
  const dates=new Set(db.sessions.filter(s=>s.entries?.length>0).map(s=>s.date));
  let n=0,d=new Date();
  if(!dates.has(today()))d.setDate(d.getDate()-1);
  while(true){
    const k=d.toISOString().split('T')[0];
    const dk=DK[d.getDay()];
    const isRest=db.routine[dk]?.rest;
    if(isRest){d.setDate(d.getDate()-1);continue;}
    if(!dates.has(k))break;
    n++;d.setDate(d.getDate()-1);
  }
  return n;
}

// ── Racha de Progreso ──
function sessionImproved(sess){
  if(!sess||!sess.entries?.length)return false;
  // Find the previous session for the same day of the week
  const prevSessions=db.sessions.filter(s=>s.dayKey===sess.dayKey&&s.date<sess.date&&s.entries?.length>0).sort((a,b)=>b.date.localeCompare(a.date));
  if(!prevSessions.length)return true; // First session ever for this day = counts as progress
  const prev=prevSessions[0];
  // Check each exercise in current session
  for(const entry of sess.entries){
    if(entry.type==='cardio')continue;
    const prevEntry=prev.entries?.find(e=>e.exercise===entry.exercise);
    if(!prevEntry)continue;
    const curMax=entryMaxWeight(entry),prevMax=entryMaxWeight(prevEntry);
    if(curMax&&prevMax&&curMax>prevMax)return true; // Weight up
    const curVol=entryVolume(entry),prevVol=entryVolume(prevEntry);
    if(curVol>prevVol)return true; // Volume up
    // Same weight, more reps on best set
    if(curMax&&prevMax&&curMax===prevMax){
      const curBestReps=Math.max(...entry.sets.filter(s=>!s.warmup&&parseFloat(s.w)===curMax).map(s=>parseInt(s.r)||0));
      const prevBestReps=Math.max(...prevEntry.sets.filter(s=>!s.warmup&&parseFloat(s.w)===prevMax).map(s=>parseInt(s.r)||0));
      if(curBestReps>prevBestReps)return true;
    }
  }
  // Check for any all-time PR
  for(const entry of sess.entries){
    if(entry.type==='cardio')continue;
    const curMax=entryMaxWeight(entry);
    if(!curMax)continue;
    const allPrev=db.sessions.filter(s=>s.date<sess.date).flatMap(s=>s.entries||[]).filter(e=>e.exercise===entry.exercise);
    const allTimeMax=allPrev.length?Math.max(...allPrev.map(e=>entryMaxWeight(e)||0)):0;
    if(curMax>allTimeMax)return true; // New PR
  }
  return false;
}
function calcProgressStreak(){
  const sorted=[...db.sessions].filter(s=>s.entries?.length>0).sort((a,b)=>b.date.localeCompare(a.date));
  let n=0;
  for(const sess of sorted){
    if(sessionImproved(sess))n++;
    else break;
  }
  return n;
}

function renderHeader(){
  const dk=todayDK(),day=db.routine[dk],now=new Date();
  document.getElementById('hdr-day').textContent=DL[dk].toUpperCase();
  document.getElementById('hdr-date').textContent=`${now.getDate()} ${MO[now.getMonth()]} ${now.getFullYear()}`;
  const b=document.getElementById('hdr-badge');
  if(!day||day.rest){b.textContent='DESCANSO';b.className='hdr-badge rest';}
  else{const focus=getDayFocus(day.exercises);b.textContent=(focus||day.label||'ENTRENO').toUpperCase();b.className='hdr-badge';}
  // Dual streaks
  const constancia=calcStreak(),progreso=calcProgressStreak();
  const sc=document.getElementById('streak-constancia'),sp=document.getElementById('streak-progreso');
  if(sc){sc.style.display=constancia>=1?'flex':'none';document.getElementById('streak-c-n').textContent=constancia;}
  if(sp){sp.style.display=progreso>=1?'flex':'none';document.getElementById('streak-p-n').textContent=progreso;}
  // Duration timer in header
  updateDurationDisplay();
}

function updateDurationDisplay(){
  const ts=db.sessions.find(s=>s.date===today()),el=document.getElementById('hdr-timer');
  if(!el)return;
  if(ts?.startTime&&ts.entries?.length>0){
    el.style.display='flex';
    el.innerHTML=`<span class="hdr-timer-dot"></span>${fmtElapsed(ts.startTime)}`;
  } else {
    el.style.display='none';
  }
}

function startDurationInterval(){
  if(durationInterval)clearInterval(durationInterval);
  durationInterval=setInterval(updateDurationDisplay,1000);
}
function stopDurationInterval(){
  if(durationInterval){clearInterval(durationInterval);durationInterval=null;}
}

function setObj(o){
  db.objective=o;ps('gym_objective',o);
  document.querySelectorAll('.obj-opt').forEach(b=>b.classList.remove('active'));
  document.getElementById('obj-'+o)?.classList.add('active');
}
function renderObj(){
  document.querySelectorAll('.obj-opt').forEach(b=>b.classList.remove('active'));
  document.getElementById('obj-'+db.objective)?.classList.add('active');
}

function prevEntry(name){
  const past=db.sessions.filter(s=>s.date!==today()).sort((a,b)=>b.date.localeCompare(a.date));
  for(const s of past){const e=s.entries?.find(e=>e.exercise===name);if(e)return e;}
  return null;
}
function getLastEntries(name,count=3){
  const results=[];
  const past=db.sessions.filter(s=>s.date!==today()).sort((a,b)=>b.date.localeCompare(a.date));
  for(const s of past){const e=s.entries?.find(e=>e.exercise===name);if(e){results.push(e);if(results.length>=count)break;}}
  return results;
}
function smartSuggestion(name){
  const entries=getLastEntries(name,3);
  if(!entries.length)return null;
  const last=entries[0],lastMax=entryMaxWeight(last);
  if(!lastMax)return null;
  const unit=last.unit||'kg';
  const info=getExerciseInfo?.(name);

  // Determine exercise type for increment size
  const isCompoundLower=['Sentadilla','Peso muerto','Prensa de pierna','Peso muerto rumano','Peso muerto sumo','Hip thrust','Hack squat'].some(c=>name.includes(c));
  const isIsolation=info?.muscleGroup?.length===1&&!['Sentadilla','Press banca','Press militar','Peso muerto','Dominadas','Remo con barra'].some(c=>name.includes(c));
  const increment=isCompoundLower?5:isIsolation?1.25:2.5;

  // Target reps based on objective
  const targetReps=db.objective==='fuerza'?5:db.objective==='hipertrofia'?10:15;

  // Analyze last session performance
  const workingSets=last.sets?.filter(s=>!s.warmup)||[];
  const setsAtMax=workingSets.filter(s=>parseFloat(s.w)===lastMax);
  const lastSetReps=setsAtMax.length?parseInt(setsAtMax[setsAtMax.length-1].r)||0:0;
  const exceededBy=lastSetReps-targetReps;

  // Check if 2-for-2 rule is met: 2+ reps over target on last set, for 2 consecutive sessions
  if(entries.length>=2){
    const prevMax=entryMaxWeight(entries[1]);

    // Weight dropped → maintain
    if(lastMax<prevMax)return{weight:lastMax,msg:`Mantener ${lastMax}${unit}`,reason:'Bajaste peso — consolida antes de subir',color:'b'};

    // 2-for-2 rule check
    const prevWorkingSets=entries[1].sets?.filter(s=>!s.warmup)||[];
    const prevSetsAtMax=prevWorkingSets.filter(s=>parseFloat(s.w)===prevMax);
    const prevLastSetReps=prevSetsAtMax.length?parseInt(prevSetsAtMax[prevSetsAtMax.length-1].r)||0:0;
    const prevExceeded=prevLastSetReps-targetReps;

    if(exceededBy>=2&&prevExceeded>=2&&lastMax===prevMax){
      const newWeight=lastMax+increment;
      return{weight:newWeight,msg:`Subir a ${newWeight}${unit}`,reason:`Regla 2-for-2: +${increment}${unit}`,color:'g'};
    }

    // Same weight, 3 sessions dominating → ready
    if(entries.length>=3){
      const allSame=entries.every(e=>entryMaxWeight(e)===lastMax);
      const allCompleted=entries.every(e=>{
        const ws=e.sets?.filter(s=>!s.warmup)||[];
        const atMax=ws.filter(s=>parseFloat(s.w)===entryMaxWeight(e));
        return atMax.length>0&&atMax.every(s=>parseInt(s.r)>=targetReps);
      });
      if(allSame&&allCompleted){
        const newWeight=lastMax+increment;
        return{weight:newWeight,msg:`Subir a ${newWeight}${unit}`,reason:`3 sesiones dominando — listo para +${increment}${unit}`,color:'g'};
      }
    }
  }

  // Exceeded target reps (but not 2-for-2 yet) → almost ready
  if(exceededBy>=2)return{weight:lastMax,msg:`Mantener ${lastMax}${unit}`,reason:`Vas bien (+${exceededBy} reps) — repite para confirmar`,color:'o'};

  // Completed target reps → on track
  if(exceededBy>=0)return{weight:lastMax,msg:`Mantener ${lastMax}${unit}`,reason:'Buen ritmo — sigue así',color:'b'};

  // Didn't reach target reps → maintain
  return{weight:lastMax,msg:`Mantener ${lastMax}${unit}`,reason:`Faltan ${Math.abs(exceededBy)} reps — no subas aún`,color:'b'};
}

function renderHoy(){
  const dk=todayDK(),day=db.routine[dk],ts=db.sessions.find(s=>s.date===today()),obj=OBJS[db.objective],c=document.getElementById('hoy-content');
  if(!day||day.rest){c.innerHTML=`<div class="rest-day"><div class="rest-emo">💤</div><div class="rest-t">DÍA DE DESCANSO</div><div class="rest-s">Descansa hoy.<br>Mañana más fuerte.</div></div>`;return;}
  let h=`<div class="ex-list">`;
  (day.exercises||[]).forEach(ex=>{
    const entry=ts?.entries?.find(e=>e.exercise===ex.name),logged=!!entry,prev=prevEntry(ex.name);
    const sn=ex.name.replace(/'/g,"\\'");
    if(ex.type==='cardio'){
      h+=`<div class="ex-card ${logged?'logged':''}" onclick="openModal('${sn}','cardio')">
        <div class="ex-l">
          <div class="ex-name">${ex.name}</div>
          <div class="ex-sub">${logged?entrySummaryText(entry):'Toca para registrar'}</div>
          <div class="ex-chips"><span class="chip y">Cardio</span>${logged?'<span class="chip g">✓</span>':''}</div>
        </div>
        <div class="ex-r">${logged?'<div class="ex-check"><svg viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></div>':'<span class="ex-arrow">›</span>'}</div>
      </div>`;
    } else {
      const mx=entryMaxWeight(entry),prevMx=entryMaxWeight(prev);
      const unit=entry?.unit||prev?.unit||'kg';
      const best1rm=logged?entryBest1RM(entry):0;
      const suggestion=!logged?smartSuggestion(ex.name):null;
      h+=`<div class="ex-card ${logged?'logged':''}" onclick="openModal('${sn}','pesas')">
        <div class="ex-l">
          <div class="ex-name">${ex.name}</div>
          <div class="ex-sub">${logged?entrySummaryText(entry):'Toca para registrar'}</div>
          <div class="ex-chips">
            ${prevMx?`<span class="chip b">Prev: ${prevMx}${prev?.unit||'kg'}</span>`:''}
            ${suggestion?`<span class="chip ${suggestion.color}">${suggestion.msg}</span>`:''}
            ${best1rm?`<span class="chip o">1RM: ${best1rm}${unit}</span>`:''}
          </div>
        </div>
        <div class="ex-r">
          <div class="ex-num">
            <div class="ex-weight">${mx||'—'}</div>
            ${mx?`<div class="ex-wunit">${unit}</div>`:''}
          </div>
          ${logged?'<div class="ex-check"><svg viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></div>':'<span class="ex-arrow">›</span>'}
        </div>
      </div>`;
    }
  });
  h+=`</div>`;c.innerHTML=h;
}

function getWeekRange(dateStr){
  const d=new Date(dateStr+'T12:00:00');
  const day=d.getDay(),diff=d.getDate()-day+(day===0?-6:1);
  const mon=new Date(d);mon.setDate(diff);
  const sun=new Date(mon);sun.setDate(mon.getDate()+6);
  return{start:mon,end:sun,key:`${mon.getFullYear()}-W${String(Math.ceil((diff+6)/7)).padStart(2,'0')}`};
}
function fmtWeekRange(start,end){
  return`${start.getDate()} ${MO[start.getMonth()]} – ${end.getDate()} ${MO[end.getMonth()]}`;
}
function renderSessCard(sess){
  const label=db.routine[sess.dayKey]?.label||sess.dayKey;
  const dur=sess.startTime&&sess.endTime?fmtDuration(sess.startTime,sess.endTime):'';
  const rows=(sess.entries||[]).map(e=>{
    let valHtml='',setsHtml='';
    if(e.type==='cardio'){valHtml=`<div class="sess-val">${e.min||0}<small style="font-size:10px;color:var(--muted2)"> min</small></div>`;}
    else{const mx=entryMaxWeight(e),sc=entrySetCount(e);valHtml=`<div class="sess-val">${mx||'?'}<small style="font-size:10px;color:var(--muted2)"> ${e.unit||'kg'}</small></div><div class="sess-val-sub">${sc.working} series</div>`;if(e.sets?.length)setsHtml=e.sets.map((s,i)=>`<span style="${s.warmup?'color:var(--muted)':''}">${i+1}. ${s.w}${e.unit||'kg'}×${s.r}${s.warmup?' (C)':''}</span>`).join(' · ');}
    return`<div class="sess-row"><div><div class="sess-exname">${e.exercise}</div>${setsHtml?`<div class="sess-sets">${setsHtml}</div>`:''}${e.notes?`<div class="sess-note">"${e.notes}"</div>`:''}</div><div class="sess-maxval">${valHtml}</div></div>`;
  }).join('');
  return`<div class="sess-card"><div class="sess-hdr" onclick="this.nextElementSibling.classList.toggle('open')"><div><div class="sess-day">${(DL[sess.dayKey]||sess.dayKey).toUpperCase()}</div><div class="sess-date">${fmtDF(sess.date)}${dur?' · '+dur:''}</div></div><div class="sess-tag">${label.toUpperCase()}</div></div><div class="sess-body">${rows||'<div style="color:var(--muted2);font-size:10px;padding:8px 0;font-family:\'DM Mono\',monospace">Sin ejercicios</div>'}</div></div>`;
}
function renderHist(){
  const list=document.getElementById('sess-list'),sorted=[...db.sessions].sort((a,b)=>b.date.localeCompare(a.date));
  if(!sorted.length){list.innerHTML=`<div class="empty"><div class="empty-ico">📋</div><div class="empty-txt">Aún no hay sesiones.<br>¡Empieza hoy!</div></div>`;return;}
  // Group by month → week
  const months=new Map();
  sorted.forEach(sess=>{
    const[y,m]=sess.date.split('-');
    const monthKey=`${y}-${m}`;
    const monthLabel=`${MO[parseInt(m)-1]} ${y}`.toUpperCase();
    if(!months.has(monthKey))months.set(monthKey,{label:monthLabel,weeks:new Map()});
    const wk=getWeekRange(sess.date);
    const weekLabel=fmtWeekRange(wk.start,wk.end);
    const mo=months.get(monthKey);
    if(!mo.weeks.has(wk.key))mo.weeks.set(wk.key,{label:weekLabel,sessions:[]});
    mo.weeks.get(wk.key).sessions.push(sess);
  });
  let html='';let mi=0;
  months.forEach((mo,monthKey)=>{
    const isFirst=mi===0;
    const totalSess=[...mo.weeks.values()].reduce((a,w)=>a+w.sessions.length,0);
    html+=`<div class="hist-month-block">
      <div class="hist-month-hdr" onclick="this.nextElementSibling.classList.toggle('open');this.querySelector('.hist-month-arrow').classList.toggle('rot')">
        <div class="hist-month-left">
          <span class="hist-month-name">${mo.label}</span>
          <span class="hist-month-count">${totalSess} sesiones</span>
        </div>
        <span class="hist-month-arrow ${isFirst?'rot':''}">›</span>
      </div>
      <div class="hist-month-body ${isFirst?'open':''}">`;
    mo.weeks.forEach(wk=>{
      html+=`<div class="hist-week"><span class="hist-week-dates">${wk.label}</span><span class="hist-week-count">${wk.sessions.length} sesiones</span></div>`;
      html+=`<div class="sess-list-inner">${wk.sessions.map(renderSessCard).join('')}</div>`;
    });
    html+=`</div></div>`;
    mi++;
  });
  list.innerHTML=html;
}

let progPeriodDays=7;

function getLoggedExercises(){
  const names=new Set();
  db.sessions.forEach(s=>s.entries?.forEach(e=>names.add(e.exercise)));
  return names;
}
function getRecentExercises(n=5){
  const seen=new Set(),result=[];
  const sorted=[...db.sessions].sort((a,b)=>b.date.localeCompare(a.date));
  for(const s of sorted){
    for(const e of (s.entries||[]).reverse()){
      if(!seen.has(e.exercise)&&e.type!=='cardio'){seen.add(e.exercise);result.push(e.exercise);}
      if(result.length>=n)return result;
    }
  }
  return result;
}

function setProgPeriod(days){
  progPeriodDays=days;
  document.querySelectorAll('.prog-period').forEach(el=>el.classList.toggle('active',parseInt(el.dataset.days)===days));
  renderProg();
}

function getSessionsInPeriod(){
  if(progPeriodDays===0)return db.sessions.filter(s=>s.entries?.length>0);
  const cutoff=new Date();cutoff.setDate(cutoff.getDate()-progPeriodDays);
  const cutoffStr=cutoff.toISOString().split('T')[0];
  return db.sessions.filter(s=>s.entries?.length>0&&s.date>=cutoffStr);
}

function getExerciseTrend(name){
  // Get last 3 sessions with this exercise, compute trend
  const sessions=db.sessions.filter(s=>s.entries?.some(e=>e.exercise===name)).sort((a,b)=>b.date.localeCompare(a.date)).slice(0,3);
  if(sessions.length<2)return'new';
  const weights=sessions.map(s=>{const e=s.entries.find(e=>e.exercise===name);return entryMaxWeight(e)||0;});
  if(weights[0]>weights[1])return'up';
  if(weights[0]<weights[1])return'down';
  return'stable';
}

function findRecentPRs(limit=5){
  const prs=[];
  const bestByExercise={};
  const sorted=[...db.sessions].sort((a,b)=>a.date.localeCompare(b.date));
  sorted.forEach(sess=>{
    (sess.entries||[]).forEach(e=>{
      if(e.type==='cardio')return;
      const mx=entryMaxWeight(e);if(!mx)return;
      if(!bestByExercise[e.exercise]||mx>bestByExercise[e.exercise]){
        if(bestByExercise[e.exercise])prs.push({exercise:e.exercise,weight:mx,unit:e.unit||'kg',date:sess.date});
        bestByExercise[e.exercise]=mx;
      }
    });
  });
  return prs.sort((a,b)=>b.date.localeCompare(a.date)).slice(0,limit);
}

function renderProg(){
  const periodSessions=getSessionsInPeriod();
  const totalVol=periodSessions.reduce((a,s)=>a+s.entries.reduce((b,e)=>b+entryVolume(e),0),0);
  const totalSets=periodSessions.reduce((a,s)=>a+s.entries.reduce((b,e)=>b+(e.sets?.filter(s=>!s.warmup).length||0),0),0);

  // Summary cards
  document.getElementById('prog-summary').innerHTML=`
    <div class="prog-cards">
      <div class="prog-card"><div class="prog-card-val">${periodSessions.length}</div><div class="prog-card-lbl">Sesiones</div></div>
      <div class="prog-card"><div class="prog-card-val" style="color:var(--orange)">${totalVol>=1000?(totalVol/1000).toFixed(1)+'k':Math.round(totalVol)}</div><div class="prog-card-lbl">kg volumen</div></div>
      <div class="prog-card"><div class="prog-card-val" style="color:var(--blue)">${totalSets}</div><div class="prog-card-lbl">Sets totales</div></div>
    </div>`;

  // Recent PRs
  const prs=findRecentPRs(3);
  document.getElementById('prog-prs').innerHTML=prs.length?`
    <div class="slbl">PRs RECIENTES</div>
    <div class="prog-pr-list">${prs.map(pr=>`<div class="prog-pr-item"><span class="prog-pr-icon">✨</span><span class="prog-pr-name">${pr.exercise}</span><span class="prog-pr-val">${pr.weight}${pr.unit}</span><span class="prog-pr-date">${fmtD(pr.date)}</span></div>`).join('')}</div>`:'';

  // Exercise list
  renderProgExList();

  // Detail
  if(selEx)renderExChart();else document.getElementById('prog-detail').style.display='none';
}

function renderProgExList(filter){
  const q=(filter||document.getElementById('prog-search')?.value||'').trim().toLowerCase();
  const logged=getLoggedExercises();
  let exercises=[...logged].filter(name=>{
    if(q&&!name.toLowerCase().includes(q))return false;
    return true;
  });
  // Sort by most recent
  const lastDate={};
  db.sessions.sort((a,b)=>b.date.localeCompare(a.date)).forEach(s=>s.entries?.forEach(e=>{if(!lastDate[e.exercise])lastDate[e.exercise]=s.date;}));
  exercises.sort((a,b)=>(lastDate[b]||'').localeCompare(lastDate[a]||''));

  const container=document.getElementById('prog-exercise-list');
  if(!exercises.length){container.innerHTML=`<div style="padding:20px 0;text-align:center;font-family:'DM Mono',monospace;font-size:11px;color:var(--muted2)">${q?'Sin resultados':'Registra ejercicios para ver progreso'}</div>`;return;}

  const trendIcons={up:'↑',down:'↓',stable:'→',new:'●'};
  const trendColors={up:'var(--green)',down:'var(--red)',stable:'var(--muted2)',new:'var(--blue)'};

  const titleEl=document.getElementById('prog-ex-title');
  if(titleEl)titleEl.textContent=`EJERCICIOS (${exercises.length})`;
  container.innerHTML=`<div class="prog-ex-list">${exercises.map(name=>{
    const lastSess=db.sessions.find(s=>s.entries?.some(e=>e.exercise===name));
    const lastEntry=lastSess?.entries?.find(e=>e.exercise===name);
    const mx=entryMaxWeight(lastEntry);
    const unit=lastEntry?.unit||'kg';
    const trend=getExerciseTrend(name);
    const mg=getExerciseMuscleGroup(name);
    return`<div class="prog-ex-item ${selEx===name?'active':''}" onclick="selectEx('${name.replace(/'/g,"\\'")}')">
      <div class="prog-ex-left">
        <span class="prog-ex-name">${name}</span>
        <span class="prog-ex-mg">${mg}</span>
      </div>
      <div class="prog-ex-right">
        <span class="prog-ex-weight">${mx||'—'}${mx?unit:''}</span>
        <span class="prog-ex-trend" style="color:${trendColors[trend]}">${trendIcons[trend]}</span>
      </div>
    </div>`;
  }).join('')}</div>`;
}

function onProgSearch(q){renderProgExList(q);}

function selectEx(name){
  selEx=selEx===name?null:name;
  renderProgExList();
  if(selEx){
    document.getElementById('prog-detail').style.display='block';
    renderExChart();
    // Scroll to detail
    setTimeout(()=>document.getElementById('prog-detail').scrollIntoView({behavior:'smooth',block:'start'}),100);
  } else {
    document.getElementById('prog-detail').style.display='none';
  }
}

function clearChart(){
  document.getElementById('prog-detail').style.display='none';
}

// ── Linear regression for trend line ──
function linearRegression(pts){
  const n=pts.length;if(n<2)return{slope:0,intercept:pts[0]||0};
  let sx=0,sy=0,sxx=0,sxy=0;
  for(let i=0;i<n;i++){sx+=i;sy+=pts[i];sxx+=i*i;sxy+=i*pts[i];}
  const slope=(n*sxy-sx*sy)/(n*sxx-sx*sx);
  const intercept=(sy-slope*sx)/n;
  return{slope,intercept};
}
function detectPlateau(pts,windowSize=4){
  if(pts.length<windowSize)return{isPlateaued:false,sessionsStuck:0};
  const recent=pts.slice(-windowSize);
  const maxRecent=Math.max(...recent),minRecent=Math.min(...recent);
  const range=maxRecent-minRecent;
  const tolerance=maxRecent*0.03;
  if(range<=tolerance){return{isPlateaued:true,sessionsStuck:windowSize};}
  const lr=linearRegression(recent);
  if(lr.slope<=0)return{isPlateaued:true,sessionsStuck:windowSize};
  return{isPlateaued:false,sessionsStuck:0};
}

function renderExChart(){
  document.getElementById('prog-detail').style.display='block';
  document.getElementById('prog-detail-header').innerHTML=`<div class="prog-detail-title">${selEx}</div><div class="prog-detail-mg">${getExerciseMuscleGroup(selEx)}</div>`;
  const pts=[];
  db.sessions.forEach(s=>{const e=s.entries?.find(e=>e.exercise===selEx);if(e){const mx=entryMaxWeight(e),vol=entryVolume(e),unit=e.unit||'kg',rm=entryBest1RM(e);if(mx)pts.push({date:s.date,mx,vol,unit,notes:e.notes,rm});}});
  pts.sort((a,b)=>a.date.localeCompare(b.date));
  const wrap=document.getElementById('chart-cwrap'),sr=document.getElementById('stat-row'),prb=document.getElementById('pr-badge');
  const pa=document.getElementById('plateau-alert');
  if(pts.length<2){wrap.style.display='none';sr.style.display='none';prb.style.display='none';document.getElementById('notes-sec').style.display='none';if(pa)pa.style.display='none';return;}
  wrap.style.display='block';sr.style.display='flex';
  const mxVals=pts.map(p=>p.mx),maxV=Math.max(...mxVals),unit=pts[0].unit,totalVol=pts.reduce((a,p)=>a+p.vol,0),isPR=mxVals[mxVals.length-1]===maxV;
  const best1rm=Math.max(...pts.map(p=>p.rm||0));
  prb.style.display=isPR?'':'none';
  document.getElementById('sv-max').textContent=maxV;document.getElementById('su-max').textContent=unit;
  document.getElementById('sv-vol').textContent=Math.round(totalVol).toLocaleString();document.getElementById('sv-cnt').textContent=pts.length;
  document.getElementById('sv-1rm').textContent=best1rm||'—';document.getElementById('su-1rm').textContent=unit;

  // Plateau detection
  const plateau=detectPlateau(mxVals);
  if(pa){
    if(plateau.isPlateaued&&mxVals.length>=4){
      pa.style.display='block';
      pa.innerHTML=`<span class="plateau-icon">⚠️</span><div><div class="plateau-title">Meseta detectada — ${plateau.sessionsStuck} sesiones sin progreso</div><div class="plateau-tip">Prueba: subir reps, reducir peso 10%, o cambiar variante</div></div>`;
    } else pa.style.display='none';
  }

  // Trend line data
  const lr=linearRegression(mxVals);
  const trendData=mxVals.map((_,i)=>Math.round((lr.intercept+lr.slope*i)*10)/10);

  if(progCh)progCh.destroy();
  const prIdx=mxVals.lastIndexOf(maxV);
  progCh=new Chart(document.getElementById('prog-chart').getContext('2d'),{type:'line',data:{labels:pts.map(p=>fmtD(p.date)),datasets:[
    {data:mxVals,borderColor:'#E8FF3A',backgroundColor:ctx=>{const g=ctx.chart.ctx.createLinearGradient(0,0,0,200);g.addColorStop(0,'rgba(232,255,58,0.2)');g.addColorStop(1,'rgba(232,255,58,0)');return g;},borderWidth:2.5,pointBackgroundColor:mxVals.map((_,i)=>i===prIdx?'#000':'#E8FF3A'),pointBorderColor:mxVals.map((_,i)=>i===prIdx?'#E8FF3A':'rgba(232,255,58,0.3)'),pointBorderWidth:mxVals.map((_,i)=>i===prIdx?2.5:1),pointRadius:mxVals.map((_,i)=>i===prIdx?6:3),pointHoverRadius:7,fill:true,tension:0.35},
    {data:trendData,borderColor:'rgba(58,180,255,0.4)',borderWidth:1.5,borderDash:[6,4],pointRadius:0,fill:false,tension:0}
  ]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false},tooltip:{backgroundColor:'#1a1a1a',titleColor:'#555',bodyColor:'#f2f2f2',borderColor:'#202020',borderWidth:1,padding:9,filter:item=>item.datasetIndex===0,callbacks:{label:ctx=>`${ctx.raw} ${unit}`,afterLabel:ctx=>{const p=pts[ctx.dataIndex];return p.notes?`📝 ${p.notes}`:''}}}},scales:{x:{ticks:{color:'#3a3a3a',font:{size:8,family:"'DM Mono',monospace"}},grid:{color:'rgba(255,255,255,0.03)'},border:{color:'#202020'}},y:{ticks:{color:'#3a3a3a',font:{size:8,family:"'DM Mono',monospace"}},grid:{color:'rgba(255,255,255,0.03)'},border:{color:'#202020'}}}}});
  const wN=pts.filter(p=>p.notes).reverse().slice(0,5),ns=document.getElementById('notes-sec');
  if(wN.length){ns.style.display='block';document.getElementById('notes-list').innerHTML=wN.map(p=>`<div class="note-row"><div class="note-date">${fmtD(p.date)}</div><div class="note-text">${p.notes}</div><div class="note-wt">${p.mx}<span style="font-size:8px;color:var(--muted2)"> ${p.unit}</span></div></div>`).join('');}
  else ns.style.display='none';

  // Best sets by rep range
  const allSets=[];
  db.sessions.forEach(s=>{const e=s.entries?.find(e=>e.exercise===selEx);if(e?.sets)e.sets.filter(st=>!st.warmup).forEach(st=>allSets.push({w:parseFloat(st.w)||0,r:parseInt(st.r)||0,date:s.date,unit:e.unit||'kg'}));});
  const bestByReps={};
  allSets.forEach(s=>{if(!bestByReps[s.r]||s.w>bestByReps[s.r].w)bestByReps[s.r]=s;});
  const repRanges=Object.keys(bestByReps).map(Number).sort((a,b)=>a-b);
  document.getElementById('prog-best-sets').innerHTML=repRanges.length?`
    <div class="slbl">MEJORES SETS POR REPS</div>
    <div class="prog-best-list">${repRanges.map(r=>{const s=bestByReps[r];return`<div class="prog-best-row"><span class="prog-best-reps">${r} rep${r>1?'s':''}</span><span class="prog-best-weight">${s.w}${s.unit}</span><span class="prog-best-date">${fmtD(s.date)}</span></div>`;}).join('')}</div>`:'';

  // Recent sessions for this exercise
  const recentSess=db.sessions.filter(s=>s.entries?.some(e=>e.exercise===selEx)).sort((a,b)=>b.date.localeCompare(a.date)).slice(0,5);
  document.getElementById('prog-recent-sets').innerHTML=recentSess.length?`
    <div class="slbl">ÚLTIMAS SESIONES</div>
    <div class="prog-recent-list">${recentSess.map(s=>{const e=s.entries.find(e=>e.exercise===selEx);const mx=entryMaxWeight(e);const vol=entryVolume(e);const sc=e.sets?.filter(st=>!st.warmup).length||0;return`<div class="prog-recent-row"><span class="prog-recent-date">${fmtD(s.date)}</span><span class="prog-recent-info">${sc}×${mx}${e.unit||'kg'}</span><span class="prog-recent-vol">${Math.round(vol)}kg vol</span></div>`;}).join('')}</div>`:'';
}

function loadProfile(){
  const p=db.profile;
  if(!p.restTimerSeconds)p.restTimerSeconds=90;
  document.getElementById('p-name').value=p.name||'';document.getElementById('p-age').value=p.age||'';
  document.getElementById('p-height').value=p.height||'';document.getElementById('p-weight').value=p.weight||'';
  setSex(p.sex||'H',false);updateIMC();renderObj();renderTimerOpts();
  renderProfileHeader();
}
function renderProfileHeader(){
  const p=db.profile,el=document.getElementById('profile-header');
  if(!el)return;
  const name=p.name||'Usuario';
  const totalSessions=db.sessions.filter(s=>s.entries?.length).length;
  const totalExercises=getLoggedExercises().size;
  const latestBW=db.bw.length?db.bw[db.bw.length-1].v:p.weight||'—';
  const streak=calcStreak();

  el.innerHTML=`
    <div class="ph-greeting">Hola, <span class="ph-name">${name}</span></div>
    <div class="ph-stats">
      <div class="ph-stat"><span class="ph-stat-val">${latestBW}</span><span class="ph-stat-lbl">kg</span></div>
      <div class="ph-stat"><span class="ph-stat-val">${totalSessions}</span><span class="ph-stat-lbl">sesiones</span></div>
      <div class="ph-stat"><span class="ph-stat-val">${totalExercises}</span><span class="ph-stat-lbl">ejercicios</span></div>
      <div class="ph-stat"><span class="ph-stat-val">${streak}</span><span class="ph-stat-lbl">racha</span></div>
    </div>`;
}
function saveProfile(){
  db.profile={...db.profile,name:document.getElementById('p-name').value,age:document.getElementById('p-age').value,height:document.getElementById('p-height').value,weight:document.getElementById('p-weight').value};
  ps('gym_profile',db.profile);
}
function setSex(s,save=true){
  db.profile.sex=s;document.getElementById('sex-h').classList.toggle('active',s==='H');document.getElementById('sex-m').classList.toggle('active',s==='M');
  if(save){ps('gym_profile',db.profile);updateIMC();}
}
function updateIMC(){
  const h=parseFloat(document.getElementById('p-height').value),w=parseFloat(document.getElementById('p-weight').value),wrap=document.getElementById('imc-wrap');
  const age=parseInt(document.getElementById('p-age').value)||25;
  const sex=db.profile.sex||'H';
  if(!h||!w||h<50||w<20){wrap.innerHTML=`<div style="color:var(--muted2);font-size:11px;text-align:center;padding:10px 0;font-family:'DM Mono',monospace">Completa altura, peso y edad arriba</div>`;return;}
  const hm=h/100;

  // ── IMC ──
  const imc=w/(hm*hm);
  const cat=IMC_C.find(c=>imc<c.max)||IMC_C[IMC_C.length-1];
  const bars=IMC_C.filter(c=>c.max<999).map((c,i,arr)=>{const prev=arr[i-1]?.max||0;return`<div class="imc-seg" style="background:${c.color};opacity:${imc>=prev&&imc<c.max?1:0.15}"></div>`;}).join('');

  // ── Peso ideal (promedio 4 fórmulas) ──
  const hInches=(h/2.54)-60; // inches over 5 feet
  const devine=sex==='H'?50+2.3*hInches:45.5+2.3*hInches;
  const robinson=sex==='H'?52+1.9*hInches:49+1.7*hInches;
  const miller=sex==='H'?56.2+1.41*hInches:53.1+1.36*hInches;
  const hamwi=sex==='H'?48+2.7*hInches:45.5+2.2*hInches;
  const idealMin=Math.min(devine,robinson,miller,hamwi).toFixed(1);
  const idealMax=Math.max(devine,robinson,miller,hamwi).toFixed(1);
  const idealAvg=((devine+robinson+miller+hamwi)/4);
  const diffIdeal=(w-idealAvg).toFixed(1);
  const diffStr=diffIdeal>0?`+${diffIdeal}kg`:`${diffIdeal}kg`;

  // ── TMB (Mifflin-St Jeor) ──
  const tmb=sex==='H'?(10*w+6.25*h-5*age+5):(10*w+6.25*h-5*age-161);

  // ── TDEE ──
  const actMult=[1.2,1.375,1.55,1.725,1.9];
  const actLabels=['Sedentario','Ligero','Moderado','Activo','Muy activo'];
  const actExamples=['Oficina, sin ejercicio','Caminar, 1-2 días gym','3-4 días gym','5-6 días gym','2x al día, trabajo físico'];
  const actLevel=db.profile.activityLevel||2;
  const tdee=tmb*actMult[actLevel];

  let html=`
    <div class="health-grid">
      <div class="health-card">
        <div class="health-label">IMC</div>
        <div class="health-value" style="color:${cat.color}">${imc.toFixed(1)}</div>
        <div class="health-sub" style="color:${cat.color}">${cat.label}</div>
      </div>
      <div class="health-card">
        <div class="health-label">PESO IDEAL</div>
        <div class="health-value">${idealMin}–${idealMax}</div>
        <div class="health-sub">${diffStr} del promedio</div>
      </div>
      <div class="health-card">
        <div class="health-label">TMB</div>
        <div class="health-value" style="color:var(--blue)">${Math.round(tmb)}</div>
        <div class="health-sub">kcal/día en reposo</div>
      </div>
      <div class="health-card">
        <div class="health-label">TDEE</div>
        <div class="health-value" style="color:var(--green)">${Math.round(tdee)}</div>
        <div class="health-sub">kcal/día total</div>
      </div>
    </div>
    <div class="imc-bar">${bars}</div>
    <div class="health-activity">
      <div class="health-label" style="margin-bottom:6px">NIVEL DE ACTIVIDAD</div>
      <div class="activity-opts">${actLabels.map((l,i)=>`<div class="activity-opt ${actLevel===i?'active':''}" onclick="setActivity(${i})"><span class="activity-name">${l}</span><span class="activity-example">${actExamples[i]}</span></div>`).join('')}</div>
    </div>`;
  wrap.innerHTML=html;
}
function setActivity(level){
  db.profile.activityLevel=level;ps('gym_profile',db.profile);updateIMC();
}

// ── Rest Timer ──
function startRestTimer(seconds){
  if(timerInterval)clearInterval(timerInterval);
  timerTotal=seconds;timerRemaining=seconds;
  const bar=document.getElementById('timer-bar');
  bar.style.display='flex';
  updateTimerDisplay();
  timerInterval=setInterval(()=>{
    timerRemaining--;
    if(timerRemaining<=0){
      clearInterval(timerInterval);timerInterval=null;
      bar.style.display='none';
      try{navigator.vibrate?.(300);}catch{}
      playBeep();
      toast('Descanso terminado');
    } else updateTimerDisplay();
  },1000);
}
function updateTimerDisplay(){
  const m=Math.floor(timerRemaining/60),s=timerRemaining%60;
  document.getElementById('timer-time').textContent=`${m}:${s.toString().padStart(2,'0')}`;
  const pct=((timerTotal-timerRemaining)/timerTotal)*100;
  document.getElementById('timer-ring').style.background=`conic-gradient(var(--accent) ${pct*3.6}deg, var(--border) ${pct*3.6}deg)`;
}
function skipTimer(){
  if(timerInterval)clearInterval(timerInterval);timerInterval=null;
  document.getElementById('timer-bar').style.display='none';
}
function addTimerTime(sec){
  timerRemaining+=sec;timerTotal+=sec;updateTimerDisplay();
}
function playBeep(){
  try{
    const ctx=new(window.AudioContext||window.webkitAudioContext)();
    const osc=ctx.createOscillator(),gain=ctx.createGain();
    osc.connect(gain);gain.connect(ctx.destination);
    osc.frequency.value=880;osc.type='sine';
    gain.gain.setValueAtTime(0.3,ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01,ctx.currentTime+0.3);
    osc.start(ctx.currentTime);osc.stop(ctx.currentTime+0.3);
  }catch{}
}
function setRestTime(sec){
  db.profile.restTimerSeconds=sec;ps('gym_profile',db.profile);renderTimerOpts();
}
function renderTimerOpts(){
  const cur=db.profile.restTimerSeconds||90;
  document.querySelectorAll('.timer-opt').forEach(el=>{
    el.classList.toggle('active',parseInt(el.dataset.sec)===cur);
  });
}

function logBW(){
  const v=parseFloat(document.getElementById('bw-val').value);if(!v||v<20||v>400){toast('Peso no válido');return;}
  db.bw.push({date:today(),v});db.bw.sort((a,b)=>a.date.localeCompare(b.date));
  ps('gym_bw',db.bw);document.getElementById('bw-val').value='';
  document.getElementById('p-weight').value=v;saveProfile();updateIMC();renderBWChart();toast('Peso registrado ✓');
}
function delBW(i){db.bw.splice(i,1);ps('gym_bw',db.bw);renderBWChart();}
function renderBWChart(){
  const bws=db.bw,empty=document.getElementById('bw-empty'),wrap=document.getElementById('bw-chart-wrap'),canvas=document.getElementById('bw-chart'),hist=document.getElementById('bw-hist');
  hist.innerHTML=[...bws].reverse().slice(0,8).map((b,i)=>`<div class="bw-hrow"><span class="bw-hdate">${fmtDF(b.date)}</span><span class="bw-hval">${b.v} kg</span><button class="bw-hdel" onclick="delBW(${bws.length-1-i})">×</button></div>`).join('');
  if(bws.length<2){empty.style.display='flex';if(wrap)wrap.style.display='none';if(bwCh){bwCh.destroy();bwCh=null;}return;}
  empty.style.display='none';if(wrap)wrap.style.display='block';if(bwCh)bwCh.destroy();
  bwCh=new Chart(canvas.getContext('2d'),{type:'line',data:{labels:bws.map(b=>fmtD(b.date)),datasets:[{data:bws.map(b=>b.v),borderColor:'#3ab4ff',backgroundColor:ctx=>{const g=ctx.chart.ctx.createLinearGradient(0,0,0,100);g.addColorStop(0,'rgba(58,180,255,0.18)');g.addColorStop(1,'rgba(58,180,255,0)');return g;},borderWidth:2,pointBackgroundColor:'#3ab4ff',pointRadius:3,fill:true,tension:0.35}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false},tooltip:{backgroundColor:'#1a1a1a',bodyColor:'#f2f2f2',callbacks:{label:ctx=>`${ctx.raw} kg`}}},scales:{x:{ticks:{color:'#3a3a3a',font:{size:8}},grid:{color:'rgba(255,255,255,0.03)'},border:{color:'#202020'}},y:{ticks:{color:'#3a3a3a',font:{size:8}},grid:{color:'rgba(255,255,255,0.03)'},border:{color:'#202020'}}}}});
}

let pickerDay=null; // which day the exercise picker is open for

function getDayFocus(exercises){
  if(!exercises||!exercises.length)return'';
  // Count how many exercises target each muscle group
  const counts={};
  exercises.forEach(ex=>{
    const info=typeof getExerciseInfo==='function'?getExerciseInfo(ex.name):null;
    const groups=info?.muscleGroup||[getExerciseMuscleGroup(ex.name)];
    // Only count primary group (first one)
    const primary=groups[0];
    if(primary&&primary!=='Otro')counts[primary]=(counts[primary]||0)+1;
  });
  // Sort by count descending, take top 2-3
  const sorted=Object.entries(counts).sort((a,b)=>b[1]-a[1]);
  if(!sorted.length)return'';
  // If cardio dominates, just say Cardio
  if(sorted[0][0]==='Cardio'&&sorted[0][1]>=exercises.length*0.5)return'Cardio';
  // Take groups that have at least 2 exercises or are in top 2
  const main=sorted.filter(([,c])=>c>=2).slice(0,3);
  if(!main.length)return sorted.slice(0,2).map(([g])=>g).join(' + ');
  return main.map(([g])=>g).join(' + ');
}

function renderRutina(){
  document.getElementById('routine-days').innerHTML=DK.map(dk=>{
    const day=db.routine[dk]||{label:'',rest:false,exercises:[]};
    const isRest=day.rest;
    const exList=(day.exercises||[]);
    const focus=getDayFocus(exList);
    return`<div class="day-block ${isRest?'day-rest':''}" id="db-${dk}">
      <div class="day-hdr" onclick="toggleDay('${dk}')">
        <div class="day-hdr-left">
          <span class="day-letter">${DL[dk].charAt(0)}</span>
          <div>
            <div class="day-name">${DL[dk].toUpperCase()}</div>
            <div class="day-sub">${isRest?'Descanso':focus||'Toca para configurar'}</div>
          </div>
        </div>
        <div class="day-tog" id="dtog-${dk}">›</div>
      </div>
      <div class="day-body" id="dbody-${dk}">
        <div class="tog-row">
          <div class="tog ${isRest?'on':''}" id="rtog-${dk}" onclick="toggleRest('${dk}')"><div class="tog-knob"></div></div>
          <span class="tog-lbl">Día de descanso</span>
        </div>
        <div id="dexsec-${dk}" style="${isRest?'display:none':''}">
          <div id="dexlist-${dk}">
            ${exList.map((ex,i)=>`<div class="exrow">
              <span class="exrow-name">${ex.name}</span>
              <button class="exrow-del" onclick="removeEx('${dk}',${i})">×</button>
            </div>`).join('')}
          </div>
          <div class="routine-actions">
            <button class="picker-open-btn" onclick="openExPicker('${dk}')">+ AGREGAR EJERCICIOS</button>
            ${otherDaysWithExercises(dk).length?`<button class="copy-day-btn" onclick="showCopyMenu('${dk}')">COPIAR DE...</button>`:''}
          </div>
          <div class="copy-menu" id="copy-menu-${dk}" style="display:none"></div>
        </div>
      </div>
    </div>`;
  }).join('');
}

// ── Copy Day ──
function otherDaysWithExercises(dk){
  return DK.filter(d=>d!==dk&&db.routine[d]&&!db.routine[d].rest&&db.routine[d].exercises?.length>0);
}
function showCopyMenu(dk){
  const menu=document.getElementById('copy-menu-'+dk);
  if(menu.style.display==='flex'){menu.style.display='none';return;}
  const others=otherDaysWithExercises(dk);
  menu.innerHTML=others.map(d=>`<button class="copy-day-opt" onclick="copyDayExercises('${d}','${dk}')">${DL[d].toUpperCase()}</button>`).join('');
  menu.style.display='flex';
}
function copyDayExercises(fromDk,toDk){
  const existing=new Set((db.routine[toDk].exercises||[]).map(e=>e.name));
  const toAdd=(db.routine[fromDk].exercises||[]).filter(e=>!existing.has(e.name));
  if(!toAdd.length){toast('Todos los ejercicios ya están');return;}
  db.routine[toDk].exercises.push(...toAdd.map(e=>({name:e.name,type:e.type})));
  ps('gym_routine',db.routine);
  renderRutina();renderHoy();
  document.getElementById('dbody-'+toDk)?.classList.add('open');
  toast(`${toAdd.length} ejercicios copiados`);
}

// ── Exercise Picker (modal-style) ──
function openExPicker(dk){
  pickerDay=dk;
  const existing=new Set((db.routine[dk].exercises||[]).map(e=>e.name));
  const overlay=document.getElementById('picker-overlay');
  overlay.classList.add('open');
  document.getElementById('picker-search').value='';
  renderPickerContent('',existing);
}
function closeExPicker(e){
  if(e&&e.target!==document.getElementById('picker-overlay'))return;
  document.getElementById('picker-overlay').classList.remove('open');
}
function renderPickerContent(query,existing){
  const container=document.getElementById('picker-list');
  let exercises=query.trim()?searchExercises(query):EXERCISE_DB;
  let html='';

  // "EN TU RUTINA" section — exercises from other days (only when no search query)
  if(!query.trim()&&pickerDay){
    const routineExes=new Set();
    DK.forEach(dk=>{if(dk!==pickerDay&&db.routine[dk]?.exercises?.length)db.routine[dk].exercises.forEach(e=>routineExes.add(e.name));});
    const fromRoutine=[...routineExes].filter(name=>!existing?.has(name));
    if(fromRoutine.length){
      html+=`<div class="pk-zone" style="color:var(--accent)">EN TU RUTINA</div>`;
      fromRoutine.forEach(name=>{
        const ex=EXERCISE_DB.find(e=>e.name===name);
        const type=ex?.type||'pesas';
        html+=`<div class="pk-item" onclick="togglePickerEx('${name.replace(/'/g,"\\'")}','${type}',this)">
          <span class="pk-check"></span>
          <span class="pk-name">${name}</span>
          <span class="pk-mg">${ex?.muscleGroup?.[0]||''}</span>
        </div>`;
      });
    }
  }

  // Group by zone then muscle
  const zones=query.trim()?null:Object.keys(ZONES);
  if(zones){
    zones.forEach(z=>{
      const zoneExes=exercises.filter(e=>e.zone===z);
      if(!zoneExes.length)return;
      html+=`<div class="pk-zone">${ZONES[z]}</div>`;
      const muscles=[...new Set(zoneExes.flatMap(e=>e.muscleGroup))];
      muscles.forEach(m=>{
        const mExes=zoneExes.filter(e=>e.muscleGroup.includes(m));
        // Deduplicate (compound exercises appear in multiple muscles)
        const uniqueInGroup=mExes.filter((e,i,arr)=>arr.findIndex(x=>x.name===e.name)===i);
        if(!uniqueInGroup.length)return;
        html+=`<div class="pk-muscle">${m}</div>`;
        uniqueInGroup.forEach(ex=>{
          const checked=existing?.has(ex.name);
          html+=`<div class="pk-item ${checked?'pk-checked':''}" onclick="togglePickerEx('${ex.name.replace(/'/g,"\\'")}','${ex.type}',this)">
            <span class="pk-check">${checked?'✓':''}</span>
            <span class="pk-name">${ex.name}</span>
          </div>`;
        });
      });
    });
  } else {
    exercises.forEach(ex=>{
      const checked=existing?.has(ex.name);
      html+=`<div class="pk-item ${checked?'pk-checked':''}" onclick="togglePickerEx('${ex.name.replace(/'/g,"\\'")}','${ex.type}',this)">
        <span class="pk-check">${checked?'✓':''}</span>
        <span class="pk-name">${ex.name}</span>
        <span class="pk-mg">${ex.muscleGroup[0]}</span>
      </div>`;
    });
  }
  if(!html)html='<div style="padding:20px;text-align:center;color:var(--muted2);font-family:\'DM Mono\',monospace;font-size:10px">Sin resultados</div>';
  container.innerHTML=html;
}
function onPickerSearch(q){
  const existing=new Set((db.routine[pickerDay]?.exercises||[]).map(e=>e.name));
  renderPickerContent(q,existing);
}
function togglePickerEx(name,type,el){
  if(!pickerDay)return;
  const day=db.routine[pickerDay];
  const idx=day.exercises.findIndex(e=>e.name===name);
  if(idx>=0){
    day.exercises.splice(idx,1);
    el.classList.remove('pk-checked');
    el.querySelector('.pk-check').textContent='';
  } else {
    day.exercises.push({name,type});
    el.classList.add('pk-checked');
    el.querySelector('.pk-check').textContent='✓';
  }
  ps('gym_routine',db.routine);
}
function doneExPicker(){
  document.getElementById('picker-overlay').classList.remove('open');
  renderRutina();renderHoy();
  document.getElementById('dbody-'+pickerDay)?.classList.add('open');
  pickerDay=null;
}

// ── Dropdowns ──
function toggleDrop(id){
  const body=document.getElementById(id),arrow=document.getElementById('arrow-'+id);
  body.classList.toggle('open');
  if(arrow)arrow.style.transform=body.classList.contains('open')?'rotate(90deg)':'';
}

// ── Feedback ──
const FEEDBACK_URL=''; // Set your Google Form URL here
function openFeedback(){
  if(FEEDBACK_URL){window.open(FEEDBACK_URL,'_blank');}
  else{toast('Configura el link de feedback en app.js');}
}
function toggleDay(k){const b=document.getElementById('dbody-'+k),t=document.getElementById('dtog-'+k);b.classList.toggle('open');t.style.transform=b.classList.contains('open')?'rotate(90deg)':'';}
function toggleRest(k){db.routine[k].rest=!db.routine[k].rest;ps('gym_routine',db.routine);document.getElementById('rtog-'+k).classList.toggle('on');document.getElementById('dexsec-'+k).style.display=db.routine[k].rest?'none':'';document.querySelector(`#db-${k} .day-sub`).textContent=db.routine[k].rest?'Descanso':db.routine[k].label;renderHeader();renderHoy();}
function updateLabel(k,v){db.routine[k].label=v;ps('gym_routine',db.routine);document.querySelector(`#db-${k} .day-sub`).textContent=v;renderHeader();}
function removeEx(k,i){db.routine[k].exercises.splice(i,1);ps('gym_routine',db.routine);renderRutina();renderHoy();document.getElementById('dbody-'+k)?.classList.add('open');}
function addEx(k){const inp=document.getElementById('newex-'+k),name=inp.value.trim();if(!name)return;db.routine[k].exercises.push({name,type:document.getElementById('newtype-'+k).value});ps('gym_routine',db.routine);inp.value='';renderRutina();renderHoy();document.getElementById('dbody-'+k)?.classList.add('open');}

// ── SETS (warmup-aware) ──
function addSet(){
  const prev=currentSets.length>0?currentSets[currentSets.length-1]:null;
  currentSets.push({w:prev?.w||'',r:prev?.r||'',warmup:false});
  renderSets();
  setTimeout(()=>{const rows=document.querySelectorAll('.set-w');if(rows.length)rows[rows.length-1].focus();},50);
}
function removeSet(i){currentSets.splice(i,1);renderSets();updateVolSummary();}
function toggleWarmup(i){currentSets[i].warmup=!currentSets[i].warmup;renderSets();updateVolSummary();}
function renderSets(){
  const list=document.getElementById('sets-list');
  if(!currentSets.length){list.innerHTML='';updateVolSummary();return;}
  list.innerHTML=currentSets.map((s,i)=>`<div class="set-row ${s.warmup?'set-warmup':''}">
    <span class="set-warm ${s.warmup?'on':''}" onclick="toggleWarmup(${i})">${s.warmup?'C':'T'}</span>
    <div class="set-inputs">
      <div class="set-input-group"><span class="set-input-lbl" id="su-${i}">${curUnit}</span><input class="set-w" type="number" inputmode="decimal" min="0" step="0.5" placeholder="0" value="${s.w}" oninput="currentSets[${i}].w=this.value;updateVolSummary()"></div>
      <span class="set-x-label">×</span>
      <div class="set-input-group"><span class="set-input-lbl">REPS</span><input class="set-r" type="number" inputmode="numeric" min="0" step="1" placeholder="0" value="${s.r}" oninput="currentSets[${i}].r=this.value;updateVolSummary()"></div>
    </div>
    <div class="set-actions"><button class="set-del" onclick="removeSet(${i})">×</button></div>
  </div>`).join('');
  updateVolSummary();
}
function updateVolSummary(){
  const vs=document.getElementById('vol-summary'),working=currentSets.filter(s=>s.w&&s.r&&!s.warmup);
  if(!working.length&&!currentSets.filter(s=>s.w&&s.r).length){vs.style.display='none';return;}
  vs.style.display='flex';
  const mx=working.length?Math.max(...working.map(s=>parseFloat(s.w))):0;
  const vol=working.reduce((a,s)=>a+(parseFloat(s.w)||0)*(parseInt(s.r)||0),0);
  const best1rm=working.length?Math.max(...working.map(s=>calc1RM(parseFloat(s.w)||0,parseInt(s.r)||0))):0;
  document.getElementById('vol-sets').textContent=`${currentSets.filter(s=>s.warmup).length?currentSets.filter(s=>s.warmup).length+'C+':''}${working.length}T`;
  document.getElementById('vol-max').textContent=mx;
  document.getElementById('vol-total').textContent=Math.round(vol);
  document.getElementById('vol-1rm').textContent=best1rm||'—';
}
function setUnit(u){
  curUnit=u;document.getElementById('btn-kg').classList.toggle('active',u==='kg');document.getElementById('btn-lb').classList.toggle('active',u==='lb');
  document.querySelectorAll('[id^="su-"]').forEach(el=>el.textContent=u);
}

function openModal(name,type){
  curEx=name;curType=type;currentSets=[];
  document.getElementById('mtitle').textContent=name;
  document.getElementById('nval').value='';document.getElementById('c-min').value='';document.getElementById('c-km').value='';
  document.getElementById('m-wsec').style.display=type==='cardio'?'none':'';
  document.getElementById('m-csec').style.display=type==='cardio'?'':'none';
  document.getElementById('msub').textContent=type==='cardio'?'REGISTRA TU CARDIO':'REGISTRA TU ENTRENAMIENTO';
  const ts=db.sessions.find(s=>s.date===today()),entry=ts?.entries?.find(e=>e.exercise===name),prev=prevEntry(name);
  const del=document.getElementById('dbtn');
  let hints='';
  if(type!=='cardio'){
    if(prev){
      const prevMx=entryMaxWeight(prev);
      hints+=`<div class="mhint b"><span class="mhint-l">Sesión anterior</span><span class="mhint-v b">${prevMx} ${prev.unit||'kg'}</span></div>`;
      const suggestion=smartSuggestion(name);
      if(suggestion)hints+=`<div class="mhint ${suggestion.color}"><span class="mhint-l">${suggestion.reason}</span><span class="mhint-v ${suggestion.color}">${suggestion.msg}</span></div>`;
    }
    let prevBlock='';
    if(prev?.sets?.length){const rows=prev.sets.map((s,i)=>`<div class="prev-set-row"><span class="prev-set-num">${i+1}</span><span class="prev-set-val ${s.warmup?'prev-warm':''}">${s.w}${prev.unit||'kg'}</span><span class="prev-set-x">×</span><span class="prev-set-val">${s.r} reps</span>${s.warmup?'<span style="font-size:7px;color:var(--muted)"> C</span>':''}</div>`).join('');prevBlock=`<div class="prev-sets-block"><div class="prev-sets-label">ÚLTIMA SESIÓN</div>${rows}</div>`;}
    document.getElementById('prev-sets-block').innerHTML=prevBlock;
    if(entry?.sets?.length){currentSets=entry.sets.map(s=>({w:s.w,r:s.r,warmup:!!s.warmup}));if(entry.unit)setUnit(entry.unit);}
    else if(prev?.sets?.length){currentSets=prev.sets.map(s=>({w:s.w,r:s.r,warmup:!!s.warmup}));setUnit(prev.unit||'kg');}
    else if(prev?.weight){currentSets=[{w:prev.weight,r:'',warmup:false}];setUnit(prev.unit||'kg');}
    else{const rd=db.objective==='fuerza'?3:db.objective==='hipertrofia'?10:15;currentSets=[{w:'',r:rd,warmup:false}];}
    renderSets();
  }
  document.getElementById('mhints').innerHTML=hints;
  if(entry){if(type==='cardio'){document.getElementById('c-min').value=entry.min||'';document.getElementById('c-km').value=entry.km||'';}document.getElementById('nval').value=entry.notes||'';del.style.display='';}
  else del.style.display='none';
  document.getElementById('overlay').classList.add('open');
}
function closeModal(e){if(e&&e.target!==document.getElementById('overlay'))return;document.getElementById('overlay').classList.remove('open');}
function saveEntry(){
  const t=today(),dk=todayDK();let entry;
  if(curType==='cardio'){entry={exercise:curEx,type:'cardio',min:parseFloat(document.getElementById('c-min').value)||0,km:parseFloat(document.getElementById('c-km').value)||0,notes:document.getElementById('nval').value.trim()};}
  else{const valid=currentSets.filter(s=>s.w!==''&&s.r!=='');if(!valid.length){toast('Agrega al menos una serie');return;}entry={exercise:curEx,type:'pesas',sets:valid.map(s=>({w:parseFloat(s.w),r:parseInt(s.r),warmup:!!s.warmup})),unit:curUnit,notes:document.getElementById('nval').value.trim()};}
  let sess=db.sessions.find(s=>s.date===t);
  const isNew=!sess;
  if(!sess){sess={date:t,dayKey:dk,entries:[],startTime:new Date().toISOString()};db.sessions.push(sess);}
  if(!sess.startTime)sess.startTime=new Date().toISOString();
  sess.endTime=new Date().toISOString();
  const idx=sess.entries.findIndex(e=>e.exercise===curEx);if(idx>=0)sess.entries[idx]=entry;else sess.entries.push(entry);
  ps('gym_sessions',db.sessions);document.getElementById('overlay').classList.remove('open');renderHoy();renderHeader();
  // Start rest timer for weight exercises
  if(curType!=='cardio'){startRestTimer(db.profile.restTimerSeconds||90);}
  toast('Guardado ✓');
}
function deleteEntry(){
  const t=today(),sess=db.sessions.find(s=>s.date===t);if(!sess)return;
  sess.entries=sess.entries.filter(e=>e.exercise!==curEx);if(!sess.entries.length)db.sessions=db.sessions.filter(s=>s.date!==t);
  ps('gym_sessions',db.sessions);document.getElementById('overlay').classList.remove('open');renderHoy();
}

function exportData(){
  const blob=new Blob([JSON.stringify({routine:db.routine,sessions:db.sessions,profile:db.profile,objective:db.objective,bw:db.bw,exported:new Date().toISOString()},null,2)],{type:'application/json'});
  const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`gym-backup-${today()}.json`;document.body.appendChild(a);a.click();document.body.removeChild(a);toast('Backup exportado ✓');
}
function importData(ev){
  const file=ev.target.files[0];if(!file)return;
  const r=new FileReader();
  r.onload=e=>{try{const d=JSON.parse(e.target.result);if(d.sessions)ps('gym_sessions',d.sessions);if(d.routine)ps('gym_routine',d.routine);if(d.profile)ps('gym_profile',d.profile);if(d.objective)ps('gym_objective',d.objective);if(d.bw)ps('gym_bw',d.bw);db=loadDB();renderHeader();renderHoy();loadProfile();renderBWChart();renderRutina();toast('Backup restaurado ✓');}catch{toast('Error al importar');}};
  r.readAsText(file);ev.target.value='';
}

function switchView(name,el){
  document.querySelectorAll('.view').forEach(v=>v.classList.remove('active'));
  document.querySelectorAll('.ni').forEach(n=>n.classList.remove('active'));
  document.getElementById('view-'+name).classList.add('active');el.classList.add('active');
  document.getElementById('scroll').scrollTop=0;
  if(name==='hoy'){startDurationInterval();}else{stopDurationInterval();}
  if(name==='hist')renderHist();
  if(name==='prog')renderProg();
  if(name==='perfil'){loadProfile();renderBWChart();renderRutina();}
}

// ── PWA Install ──
let deferredPrompt=null;
window.addEventListener('beforeinstallprompt',e=>{
  e.preventDefault();deferredPrompt=e;
  const btn=document.getElementById('install-btn');
  if(btn)btn.style.display='';
});
function installPWA(){
  if(!deferredPrompt){toast('Abre en tu navegador para instalar');return;}
  deferredPrompt.prompt();
  deferredPrompt.userChoice.then(r=>{if(r.outcome==='accepted')toast('App instalada ✓');deferredPrompt=null;document.getElementById('install-btn').style.display='none';});
}

// ── Service Worker Registration ──
if('serviceWorker' in navigator){
  navigator.serviceWorker.register('sw.js').catch(()=>{});
}

// ── DEMO DATA (remove after testing) ──
function loadDemo(){
  // Clear all existing data
  localStorage.clear();
  injectDemoData();
  db=loadDB();
  renderHeader();renderObj();renderHoy();
  toast('Demo cargada ✓');
}
function injectDemoData(){
  const d=n=>{const dd=new Date();dd.setDate(dd.getDate()-n);return dd.toISOString().split('T')[0];};
  const dk=n=>{const dd=new Date();dd.setDate(dd.getDate()-n);return DK[dd.getDay()];};
  const ts=n=>{const dd=new Date();dd.setDate(dd.getDate()-n);dd.setHours(17,0,0);return dd.toISOString();};
  const te=n=>{const dd=new Date();dd.setDate(dd.getDate()-n);dd.setHours(18,15,0);return dd.toISOString();};

  // Profile
  db.profile={name:'Carlos',age:'25',sex:'H',height:'178',weight:'78',restTimerSeconds:90};
  ps('gym_profile',db.profile);

  // Objective
  db.objective='hipertrofia';
  ps('gym_objective',db.objective);

  // Body weight history (last 4 weeks)
  db.bw=[
    {date:d(28),v:76.2},{date:d(21),v:76.8},{date:d(14),v:77.3},
    {date:d(7),v:77.5},{date:d(3),v:77.8},{date:d(0),v:78}
  ];
  ps('gym_bw',db.bw);

  // Sessions — 3 weeks of training with progressive overload
  db.sessions=[
    // Week 3 (oldest)
    {date:d(20),dayKey:dk(20),startTime:ts(20),endTime:te(20),entries:[
      {exercise:"Press banca",type:"pesas",sets:[{w:45,r:10,warmup:true},{w:60,r:10},{w:60,r:8},{w:57.5,r:10}],unit:"kg"},
      {exercise:"Press inclinado",type:"pesas",sets:[{w:40,r:10},{w:40,r:8},{w:37.5,r:10}],unit:"kg"},
      {exercise:"Aperturas mancuernas",type:"pesas",sets:[{w:14,r:12},{w:14,r:10}],unit:"kg"},
      {exercise:"Press francés",type:"pesas",sets:[{w:25,r:10},{w:25,r:8}],unit:"kg"}
    ]},
    {date:d(19),dayKey:dk(19),startTime:ts(19),endTime:te(19),entries:[
      {exercise:"Jalón al pecho",type:"pesas",sets:[{w:50,r:10},{w:50,r:8},{w:47.5,r:10}],unit:"kg"},
      {exercise:"Remo con barra",type:"pesas",sets:[{w:45,r:10},{w:45,r:8}],unit:"kg"},
      {exercise:"Curl con barra",type:"pesas",sets:[{w:25,r:10},{w:25,r:8},{w:22.5,r:10}],unit:"kg"}
    ]},
    {date:d(18),dayKey:dk(18),startTime:ts(18),endTime:te(18),entries:[
      {exercise:"Press militar",type:"pesas",sets:[{w:30,r:10},{w:30,r:8},{w:27.5,r:10}],unit:"kg"},
      {exercise:"Elevaciones laterales",type:"pesas",sets:[{w:10,r:12},{w:10,r:12},{w:10,r:10}],unit:"kg"},
      {exercise:"Pájaros",type:"pesas",sets:[{w:8,r:12},{w:8,r:10}],unit:"kg"}
    ]},
    {date:d(17),dayKey:dk(17),startTime:ts(17),endTime:te(17),entries:[
      {exercise:"Sentadilla",type:"pesas",sets:[{w:40,r:8,warmup:true},{w:70,r:8},{w:70,r:6},{w:65,r:8}],unit:"kg"},
      {exercise:"Prensa de pierna",type:"pesas",sets:[{w:100,r:10},{w:100,r:8}],unit:"kg"},
      {exercise:"Curl femoral",type:"pesas",sets:[{w:35,r:10},{w:35,r:8}],unit:"kg"},
      {exercise:"Pantorrillas",type:"pesas",sets:[{w:60,r:15},{w:60,r:12}],unit:"kg"}
    ]},
    // Week 2
    {date:d(13),dayKey:dk(13),startTime:ts(13),endTime:te(13),entries:[
      {exercise:"Press banca",type:"pesas",sets:[{w:45,r:8,warmup:true},{w:62.5,r:10},{w:62.5,r:8},{w:60,r:10}],unit:"kg"},
      {exercise:"Press inclinado",type:"pesas",sets:[{w:42.5,r:10},{w:42.5,r:8},{w:40,r:10}],unit:"kg"},
      {exercise:"Aperturas mancuernas",type:"pesas",sets:[{w:14,r:12},{w:14,r:12}],unit:"kg"},
      {exercise:"Press francés",type:"pesas",sets:[{w:27.5,r:10},{w:27.5,r:8}],unit:"kg"}
    ]},
    {date:d(12),dayKey:dk(12),startTime:ts(12),endTime:te(12),entries:[
      {exercise:"Jalón al pecho",type:"pesas",sets:[{w:52.5,r:10},{w:52.5,r:8},{w:50,r:10}],unit:"kg"},
      {exercise:"Remo con barra",type:"pesas",sets:[{w:47.5,r:10},{w:47.5,r:8}],unit:"kg"},
      {exercise:"Curl con barra",type:"pesas",sets:[{w:27.5,r:10},{w:27.5,r:8},{w:25,r:10}],unit:"kg"}
    ]},
    {date:d(11),dayKey:dk(11),startTime:ts(11),endTime:te(11),entries:[
      {exercise:"Press militar",type:"pesas",sets:[{w:32.5,r:10},{w:32.5,r:8},{w:30,r:10}],unit:"kg"},
      {exercise:"Elevaciones laterales",type:"pesas",sets:[{w:12,r:12},{w:12,r:10},{w:10,r:12}],unit:"kg"},
      {exercise:"Pájaros",type:"pesas",sets:[{w:10,r:12},{w:10,r:10}],unit:"kg"}
    ]},
    {date:d(10),dayKey:dk(10),startTime:ts(10),endTime:te(10),entries:[
      {exercise:"Sentadilla",type:"pesas",sets:[{w:40,r:8,warmup:true},{w:75,r:8},{w:75,r:6},{w:70,r:8}],unit:"kg"},
      {exercise:"Prensa de pierna",type:"pesas",sets:[{w:110,r:10},{w:110,r:8}],unit:"kg"},
      {exercise:"Curl femoral",type:"pesas",sets:[{w:37.5,r:10},{w:37.5,r:8}],unit:"kg"},
      {exercise:"Pantorrillas",type:"pesas",sets:[{w:65,r:15},{w:65,r:12}],unit:"kg"}
    ]},
    {date:d(9),dayKey:dk(9),startTime:ts(9),endTime:te(9),entries:[
      {exercise:"Curl concentrado",type:"pesas",sets:[{w:12,r:10},{w:12,r:8}],unit:"kg"},
      {exercise:"Tríceps en polea",type:"pesas",sets:[{w:25,r:12},{w:25,r:10}],unit:"kg"}
    ]},
    // Week 1 (most recent)
    {date:d(6),dayKey:dk(6),startTime:ts(6),endTime:te(6),entries:[
      {exercise:"Press banca",type:"pesas",sets:[{w:45,r:8,warmup:true},{w:65,r:10},{w:65,r:9},{w:62.5,r:10}],unit:"kg",notes:"Buen día, se sintió liviano"},
      {exercise:"Press inclinado",type:"pesas",sets:[{w:45,r:10},{w:45,r:8},{w:42.5,r:10}],unit:"kg"},
      {exercise:"Aperturas mancuernas",type:"pesas",sets:[{w:16,r:12},{w:16,r:10}],unit:"kg"},
      {exercise:"Press francés",type:"pesas",sets:[{w:30,r:10},{w:30,r:8}],unit:"kg"}
    ]},
    {date:d(5),dayKey:dk(5),startTime:ts(5),endTime:te(5),entries:[
      {exercise:"Jalón al pecho",type:"pesas",sets:[{w:55,r:10},{w:55,r:8},{w:52.5,r:10}],unit:"kg"},
      {exercise:"Remo con barra",type:"pesas",sets:[{w:50,r:10},{w:50,r:8}],unit:"kg"},
      {exercise:"Curl con barra",type:"pesas",sets:[{w:30,r:10},{w:30,r:8},{w:27.5,r:10}],unit:"kg",notes:"PR en curl"}
    ]},
    {date:d(4),dayKey:dk(4),startTime:ts(4),endTime:te(4),entries:[
      {exercise:"Press militar",type:"pesas",sets:[{w:35,r:10},{w:35,r:8},{w:32.5,r:10}],unit:"kg"},
      {exercise:"Elevaciones laterales",type:"pesas",sets:[{w:12,r:14},{w:12,r:12},{w:12,r:10}],unit:"kg"},
      {exercise:"Pájaros",type:"pesas",sets:[{w:10,r:14},{w:10,r:12}],unit:"kg"}
    ]},
    {date:d(3),dayKey:dk(3),startTime:ts(3),endTime:te(3),entries:[
      {exercise:"Sentadilla",type:"pesas",sets:[{w:40,r:8,warmup:true},{w:80,r:8},{w:80,r:6},{w:75,r:8}],unit:"kg",notes:"Nuevo PR 80kg!"},
      {exercise:"Prensa de pierna",type:"pesas",sets:[{w:120,r:10},{w:120,r:8}],unit:"kg"},
      {exercise:"Curl femoral",type:"pesas",sets:[{w:40,r:10},{w:40,r:8}],unit:"kg"},
      {exercise:"Pantorrillas",type:"pesas",sets:[{w:70,r:15},{w:70,r:12}],unit:"kg"}
    ]},
    {date:d(1),dayKey:dk(1),startTime:ts(1),endTime:te(1),entries:[
      {exercise:"Curl concentrado",type:"pesas",sets:[{w:14,r:10},{w:14,r:8}],unit:"kg"},
      {exercise:"Curl en polea",type:"pesas",sets:[{w:20,r:12},{w:20,r:10}],unit:"kg"},
      {exercise:"Tríceps en polea",type:"pesas",sets:[{w:27.5,r:12},{w:27.5,r:10}],unit:"kg"},
      {exercise:"Patada de tríceps",type:"pesas",sets:[{w:10,r:12},{w:10,r:10}],unit:"kg"}
    ]},
  ];
  ps('gym_sessions',db.sessions);
}
// Auto-inject if empty
if(!db.sessions.length)injectDemoData();

// ── Init ──
renderHeader();renderObj();renderHoy();startDurationInterval();
if(typeof checkOnboarding==='function')checkOnboarding();
