const DK=["domingo","lunes","martes","miercoles","jueves","viernes","sabado"];
const DL={domingo:"Domingo",lunes:"Lunes",martes:"Martes",miercoles:"Miércoles",jueves:"Jueves",viernes:"Viernes",sabado:"Sábado"};
const MO=['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
const OBJS={fuerza:{reps:"1–5 reps",series:"4–6 series"},hipertrofia:{reps:"6–12 reps",series:"3–4 series"},resistencia:{reps:"13–20 reps",series:"2–3 series"}};
const IMC_C=[{max:18.5,label:"Bajo peso",color:"#3ab4ff"},{max:25,label:"Peso normal",color:"#3aff8a"},{max:30,label:"Sobrepeso",color:"#ffaa3a"},{max:35,label:"Obesidad I",color:"#ff4d4d"},{max:999,label:"Obesidad II+",color:"#ff4d4d"}];
const _s='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">';
const DR={lunes:{label:"",rest:true,exercises:[]},martes:{label:"",rest:true,exercises:[]},miercoles:{label:"",rest:true,exercises:[]},jueves:{label:"",rest:true,exercises:[]},viernes:{label:"",rest:true,exercises:[]},sabado:{label:"",rest:true,exercises:[]},domingo:{label:"",rest:true,exercises:[]}};

function escapeHtml(s){if(!s)return'';return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#039;');}

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
  if(e.type==='cardio'){const parts=[`${e.min||0}min`];if(e.intensity&&e.intensity!=='media')parts.push(e.intensity);if(e.km)parts.push(e.km+'km');if(e.cal)parts.push((e.calEstimated?'~':'')+e.cal+'kcal');return parts.join(' · ');}
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
  if(!day||day.rest){c.innerHTML=`<div class="rest-day"><div class="rest-emo">${_s}<path d="M2 4h4l2-2h8l2 2h4"/><path d="M3 4v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V4"/><path d="M12 10v4"/><path d="M10 12h4"/></svg></div><div class="rest-t">DÍA DE DESCANSO</div><div class="rest-s">Descansa hoy.<br>Mañana más fuerte.</div></div>`;return;}
  let h=`<div class="ex-list">`;
  (day.exercises||[]).forEach((ex,exIdx)=>{
    const entry=ts?.entries?.find(e=>e.exercise===ex.name),logged=!!entry,prev=prevEntry(ex.name);
    const sn=ex.name.replace(/'/g,"\\'");
    if(reorderMode){
      const isSel=reorderSelected===exIdx;
      const isTarget=reorderSelected!==null&&!isSel;
      h+=`<div class="ex-card reorder ${isSel?'reorder-sel':''}${isTarget?' reorder-target':''}" onclick="event.stopPropagation();selectReorderEx(${exIdx})">
        <span class="reorder-num">${exIdx+1}</span>
        <div class="reorder-info">
          <div class="reorder-name">${ex.name}</div>
          <div class="reorder-hint">${isSel?'Toca la posición destino':isTarget?`Posición ${exIdx+1}`:''}</div>
        </div>
      </div>`;
      return;
    }
    if(ex.type==='cardio'){
      const intColors={baja:'g',media:'y',alta:'r'};
      const intLabels={baja:'Baja',media:'Media',alta:'Alta'};
      const intChip=logged&&entry.intensity?`<span class="chip ${intColors[entry.intensity]||'y'}">${intLabels[entry.intensity]||'Media'}</span>`:'';
      const calChip=logged&&entry.cal?`<span class="chip b">${entry.calEstimated?'~':''}${entry.cal} kcal</span>`:'';
      h+=`<div class="ex-card ${logged?'logged':''}" onclick="openModal('${sn}','cardio')">
        <div class="ex-l">
          <div class="ex-name">${ex.name}</div>
          <div class="ex-sub">${logged?entrySummaryText(entry):'Toca para registrar'}</div>
          <div class="ex-chips"><span class="chip y">Cardio</span>${intChip}${calChip}${logged?'<span class="chip g">✓</span>':''}</div>
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
  const exCount=(day.exercises||[]).length;
  if(reorderMode&&exCount>1){
    h+=`<div class="reorder-note">${_s}<circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg><p><b>1.</b> Toca el ejercicio que quieras mover · <b>2.</b> Toca la posición donde colocarlo</p></div>`;
  }
  // Actualizar estado visual del botón toggle
  const togBtn=document.getElementById('reorder-toggle');
  if(togBtn)togBtn.classList.toggle('active',reorderMode);
  h+=`</div>`;c.innerHTML=h;
}

let reorderMode=false;
let reorderSelected=null;
function toggleReorder(){
  reorderMode=!reorderMode;
  reorderSelected=null;
  renderHoy();
}
function selectReorderEx(idx){
  if(reorderSelected===null){
    reorderSelected=idx;
    renderHoy();
  } else if(reorderSelected===idx){
    reorderSelected=null;
    renderHoy();
  } else {
    const dk=todayDK(),exs=db.routine[dk].exercises;
    const [moved]=exs.splice(reorderSelected,1);
    exs.splice(idx,0,moved);
    ps('gym_routine',db.routine);
    reorderSelected=null;
    renderHoy();
    toast('Movido ✓');
  }
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
    if(e.type==='cardio'){
      valHtml=`<div class="sess-val">${e.min||0}<small> min</small></div>`;
    }else{
      const mx=entryMaxWeight(e),sc=entrySetCount(e);
      valHtml=`<div class="sess-val">${mx||'?'}<small> ${e.unit||'kg'}</small></div><div class="sess-val-sub">${sc.working} series</div>`;
      if(e.sets?.length){
        const working=e.sets.filter(s=>!s.warmup);
        setsHtml=`<div class="sess-sets-grid">${e.sets.map((s,i)=>`<div class="sess-set-chip${s.warmup?' warmup':''}">${s.w}<small>${e.unit||'kg'}</small> × ${s.r}${s.warmup?' <span class="sess-set-w">C</span>':''}</div>`).join('')}</div>`;
        if(working.length){
          const avg=Math.round(working.reduce((a,s)=>a+(parseFloat(s.w)||0),0)/working.length*10)/10;
          const vol=working.reduce((a,s)=>a+(parseFloat(s.w)||0)*(parseInt(s.r)||0),0);
          const best1rm=entryBest1RM(e);
          const unit=e.unit||'kg';
          setsHtml+=`<div class="sess-stats"><span>Promedio <b>${avg} ${unit}</b></span><span>Volumen <b>${vol} ${unit}</b></span>${best1rm?`<span>1RM <b>${best1rm} ${unit}</b></span>`:''}</div>`;
        }
      }
    }
    return`<div class="sess-row"><div class="sess-row-top"><div class="sess-exname">${e.exercise}</div><div class="sess-maxval">${valHtml}</div></div>${setsHtml||''}${e.notes?`<div class="sess-note">${escapeHtml(e.notes)}</div>`:''}</div>`;
  }).join('');
  return`<div class="sess-card"><div class="sess-hdr" onclick="this.nextElementSibling.classList.toggle('open')"><div><div class="sess-day">${(DL[sess.dayKey]||sess.dayKey).toUpperCase()}</div><div class="sess-date">${fmtDF(sess.date)}${dur?' · '+dur:''}</div></div><div class="sess-tag">${label.toUpperCase()}</div></div><div class="sess-body">${rows||'<div class="sess-empty">Sin ejercicios registrados</div>'}</div></div>`;
}
function renderHist(){
  const list=document.getElementById('sess-list'),sorted=[...db.sessions].sort((a,b)=>b.date.localeCompare(a.date));
  if(!sorted.length){list.innerHTML=`<div class="empty"><div class="empty-ico">${_s}<rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg></div><div class="empty-txt">Aún no hay sesiones.<br>¡Empieza hoy!</div></div>`;return;}
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
    let wi=0;
    mo.weeks.forEach(wk=>{
      const isFirstWeek=isFirst&&wi===0;
      html+=`<div class="hist-week-block">
        <div class="hist-week-hdr" onclick="this.nextElementSibling.classList.toggle('open');this.querySelector('.hist-week-arrow').classList.toggle('rot')">
          <span class="hist-week-dates">Semana del ${wk.label}</span>
          <div class="hist-week-right">
            <span class="hist-week-count">${wk.sessions.length} ${wk.sessions.length===1?'día':'días'}</span>
            <span class="hist-week-arrow ${isFirstWeek?'rot':''}">›</span>
          </div>
        </div>
        <div class="hist-week-body ${isFirstWeek?'open':''}">${wk.sessions.map(renderSessCard).join('')}</div>
      </div>`;
      wi++;
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
      if(!seen.has(e.exercise)){seen.add(e.exercise);result.push(e.exercise);}
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
  const _pci={
    sess:_s+'<rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
    vol:_s+'<line x1="6" y1="20" x2="6" y2="14"/><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/></svg>',
    sets:_s+'<polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>',
  };
  document.getElementById('prog-summary').innerHTML=`
    <div class="prog-cards">
      <div class="prog-card"><div class="prog-card-ico">${_pci.sess}</div><div class="prog-card-val">${periodSessions.length}</div><div class="prog-card-lbl">Sesiones</div></div>
      <div class="prog-card"><div class="prog-card-ico">${_pci.vol}</div><div class="prog-card-val" style="color:var(--orange)">${totalVol>=1000?(totalVol/1000).toFixed(1)+'k':Math.round(totalVol)}</div><div class="prog-card-lbl">kg volumen</div></div>
      <div class="prog-card"><div class="prog-card-ico">${_pci.sets}</div><div class="prog-card-val" style="color:var(--blue)">${totalSets}</div><div class="prog-card-lbl">Sets totales</div></div>
    </div>`;

  // Recent PRs
  const prs=findRecentPRs(3);
  const _trophy=_s+'<path d="M6 9H3a1 1 0 0 0-1 1v1a4 4 0 0 0 4 4h0"/><path d="M18 9h3a1 1 0 0 1 1 1v1a4 4 0 0 1-4 4h0"/><path d="M7 4h10v7a5 5 0 0 1-10 0V4z"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="16" x2="12" y2="20"/></svg>';
  const prColors=['var(--accent)','var(--muted2)','var(--orange)'];
  document.getElementById('prog-prs').innerHTML=prs.length?`
    <div class="slbl slbl-ico">${_trophy}PRs RECIENTES</div>
    <div class="prog-pr-list">${prs.sort((a,b)=>b.weight-a.weight).map((pr,i)=>`<div class="prog-pr-item"><span class="prog-pr-icon" style="color:${prColors[i]||'var(--muted2)'}">${i+1}</span><span class="prog-pr-name">${pr.exercise}</span><span class="prog-pr-val">${pr.weight}${pr.unit}</span><span class="prog-pr-date">${fmtD(pr.date)}</span></div>`).join('')}</div>`:'';

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
  const exInfo=getExerciseInfo(selEx);
  const isCardio=exInfo?.type==='cardio'||db.sessions.some(s=>s.entries?.find(e=>e.exercise===selEx&&e.type==='cardio'));
  document.getElementById('prog-detail-header').innerHTML=`<div class="prog-detail-title">${selEx}</div><div class="prog-detail-mg">${getExerciseMuscleGroup(selEx)}</div>`;
  const chartTitleEl=document.getElementById('chart-title-text');
  if(chartTitleEl)chartTitleEl.textContent=isCardio?'TIEMPO POR SESIÓN':'PESO MÁXIMO POR SESIÓN';

  const wrap=document.getElementById('chart-cwrap'),sr=document.getElementById('stat-row'),prb=document.getElementById('pr-badge');
  const pa=document.getElementById('plateau-alert');

  // ── CARDIO PROGRESS ──
  if(isCardio){
    const cpts=[];
    db.sessions.forEach(s=>{const e=s.entries?.find(e=>e.exercise===selEx&&e.type==='cardio');if(e&&e.min)cpts.push({date:s.date,min:e.min||0,km:e.km||0,cal:e.cal||0,intensity:e.intensity||'media',notes:e.notes});});
    cpts.sort((a,b)=>a.date.localeCompare(b.date));
    if(cpts.length<2){wrap.style.display='none';sr.style.display='none';prb.style.display='none';document.getElementById('notes-sec').style.display='none';if(pa)pa.style.display='none';document.getElementById('prog-best-sets').innerHTML='';document.getElementById('prog-recent-sets').innerHTML='';return;}

    const minVals=cpts.map(p=>p.min),maxMin=Math.max(...minVals),totalMin=minVals.reduce((a,v)=>a+v,0),totalKm=cpts.reduce((a,p)=>a+p.km,0),totalCal=cpts.reduce((a,p)=>a+p.cal,0);

    sr.style.display='flex';prb.style.display='none';if(pa)pa.style.display='none';
    document.getElementById('sv-max').textContent=maxMin;document.getElementById('su-max').textContent='min máx';
    document.getElementById('sv-1rm').textContent=Math.round(totalMin);document.getElementById('su-1rm').textContent='min total';
    document.getElementById('sv-vol').textContent=totalKm?totalKm.toFixed(1):'—';document.getElementById('su-vol')&&(document.getElementById('su-vol').textContent='km total');
    document.getElementById('sv-cnt').textContent=cpts.length;

    // Stat box labels for cardio
    const sboxes=sr.querySelectorAll('.sbox');
    if(sboxes[0])sboxes[0].querySelector('.slb').textContent='MÁXIMO';
    if(sboxes[1])sboxes[1].querySelector('.slb').textContent='TOTAL';
    if(sboxes[2])sboxes[2].querySelector('.slb').textContent=totalKm?'DISTANCIA':'CALORÍAS';
    if(sboxes[2]){document.getElementById('sv-vol').textContent=totalKm?totalKm.toFixed(1):(totalCal||'—');}
    if(sboxes[3])sboxes[3].querySelector('.slb').textContent='SESIONES';

    wrap.style.display='block';
    const lr=linearRegression(minVals);
    const trendData=minVals.map((_,i)=>Math.round((lr.intercept+lr.slope*i)*10)/10);
    if(progCh){progCh.destroy();progCh=null;}
    progCh=new Chart(document.getElementById('prog-chart').getContext('2d'),{type:'line',data:{labels:cpts.map(p=>fmtD(p.date)),datasets:[
      {data:minVals,borderColor:'#38bdf8',backgroundColor:ctx=>{const g=ctx.chart.ctx.createLinearGradient(0,0,0,200);g.addColorStop(0,'rgba(56,189,248,0.2)');g.addColorStop(1,'rgba(56,189,248,0)');return g;},borderWidth:2.5,pointBackgroundColor:'#38bdf8',pointBorderColor:'rgba(56,189,248,0.3)',pointBorderWidth:1,pointRadius:3,pointHoverRadius:7,fill:true,tension:0.35},
      {data:trendData,borderColor:'rgba(232,255,58,0.4)',borderWidth:1.5,borderDash:[6,4],pointRadius:0,fill:false,tension:0}
    ]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false},tooltip:{backgroundColor:'#1a1a1a',titleColor:'#888',bodyColor:'#f2f2f2',borderColor:'#202020',borderWidth:1,padding:9,filter:item=>item.datasetIndex===0,callbacks:{label:ctx=>`${ctx.raw} min`,afterLabel:ctx=>{const p=cpts[ctx.dataIndex];const parts=[];if(p.intensity!=='media')parts.push(p.intensity);if(p.km)parts.push(p.km+'km');if(p.cal)parts.push(p.cal+'kcal');return parts.length?parts.join(' · '):''}}}},scales:{x:{ticks:{color:'#666',font:{size:8,family:"'DM Mono',monospace"}},grid:{color:'rgba(255,255,255,0.03)'},border:{color:'#202020'}},y:{ticks:{color:'#666',font:{size:8,family:"'DM Mono',monospace"}},grid:{color:'rgba(255,255,255,0.03)'},border:{color:'#202020'}}}}});

    document.getElementById('prog-best-sets').innerHTML='';
    // Recent cardio sessions
    const recentC=cpts.slice().reverse().slice(0,5);
    document.getElementById('prog-recent-sets').innerHTML=recentC.length?`
      <div class="slbl slbl-ico">${_s}<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>ÚLTIMAS SESIONES</div>
      <div class="prog-recent-list">${recentC.map(p=>{const parts=[p.min+'min'];if(p.intensity!=='media')parts.push(p.intensity);if(p.km)parts.push(p.km+'km');if(p.cal)parts.push(p.cal+'kcal');return`<div class="prog-recent-row"><span class="prog-recent-date">${fmtD(p.date)}</span><span class="prog-recent-info">${parts.join(' · ')}</span></div>`;}).join('')}</div>`:'';

    const wN=cpts.filter(p=>p.notes).reverse().slice(0,5),ns=document.getElementById('notes-sec');
    if(wN.length){ns.style.display='block';document.getElementById('notes-list').innerHTML=wN.map(p=>`<div class="note-row"><div class="note-date">${fmtD(p.date)}</div><div class="note-text">${escapeHtml(p.notes)}</div><div class="note-wt">${p.min}<span style="font-size:8px;color:var(--muted2)"> min</span></div></div>`).join('');}
    else ns.style.display='none';
    return;
  }

  // ── WEIGHT EXERCISE PROGRESS ──
  const pts=[];
  db.sessions.forEach(s=>{const e=s.entries?.find(e=>e.exercise===selEx);if(e){const mx=entryMaxWeight(e),vol=entryVolume(e),unit=e.unit||'kg',rm=entryBest1RM(e);if(mx)pts.push({date:s.date,mx,vol,unit,notes:e.notes,rm});}});
  pts.sort((a,b)=>a.date.localeCompare(b.date));
  if(pts.length<2){wrap.style.display='none';sr.style.display='none';prb.style.display='none';document.getElementById('notes-sec').style.display='none';if(pa)pa.style.display='none';document.getElementById('prog-best-sets').innerHTML='';document.getElementById('prog-recent-sets').innerHTML='';return;}
  wrap.style.display='block';sr.style.display='flex';
  const mxVals=pts.map(p=>p.mx),maxV=Math.max(...mxVals),unit=pts[0].unit,totalVol=pts.reduce((a,p)=>a+p.vol,0),isPR=mxVals[mxVals.length-1]===maxV;
  const best1rm=Math.max(...pts.map(p=>p.rm||0));
  prb.style.display=isPR?'':'none';

  // Restore weight stat labels
  const sboxes=sr.querySelectorAll('.sbox');
  if(sboxes[0])sboxes[0].querySelector('.slb').textContent='RÉCORD';
  if(sboxes[1])sboxes[1].querySelector('.slb').textContent='1RM EST';
  if(sboxes[2])sboxes[2].querySelector('.slb').textContent='VOLUMEN';
  if(sboxes[3])sboxes[3].querySelector('.slb').textContent='SESIONES';

  document.getElementById('sv-max').textContent=maxV;document.getElementById('su-max').textContent=unit;
  document.getElementById('sv-vol').textContent=Math.round(totalVol).toLocaleString();document.getElementById('sv-cnt').textContent=pts.length;
  document.getElementById('sv-1rm').textContent=best1rm||'—';document.getElementById('su-1rm').textContent=unit;

  // Plateau detection
  const plateau=detectPlateau(mxVals);
  if(pa){
    if(plateau.isPlateaued&&mxVals.length>=4){
      pa.style.display='block';
      pa.innerHTML=`<span class="plateau-icon">${_s}<line x1="3" y1="17" x2="8" y2="12"/><line x1="8" y1="12" x2="21" y2="12" stroke-dasharray="3 2"/></svg></span><div><div class="plateau-title">Meseta detectada — ${plateau.sessionsStuck} sesiones sin progreso</div><div class="plateau-tip">Prueba: subir reps, reducir peso 10%, o cambiar variante</div></div>`;
    } else pa.style.display='none';
  }

  // Trend line data
  const lr=linearRegression(mxVals);
  const trendData=mxVals.map((_,i)=>Math.round((lr.intercept+lr.slope*i)*10)/10);

  if(progCh){progCh.destroy();progCh=null;}
  const prIdx=mxVals.lastIndexOf(maxV);
  progCh=new Chart(document.getElementById('prog-chart').getContext('2d'),{type:'line',data:{labels:pts.map(p=>fmtD(p.date)),datasets:[
    {data:mxVals,borderColor:'#E8FF3A',backgroundColor:ctx=>{const g=ctx.chart.ctx.createLinearGradient(0,0,0,200);g.addColorStop(0,'rgba(232,255,58,0.2)');g.addColorStop(1,'rgba(232,255,58,0)');return g;},borderWidth:2.5,pointBackgroundColor:mxVals.map((_,i)=>i===prIdx?'#000':'#E8FF3A'),pointBorderColor:mxVals.map((_,i)=>i===prIdx?'#E8FF3A':'rgba(232,255,58,0.3)'),pointBorderWidth:mxVals.map((_,i)=>i===prIdx?2.5:1),pointRadius:mxVals.map((_,i)=>i===prIdx?6:3),pointHoverRadius:7,fill:true,tension:0.35},
    {data:trendData,borderColor:'rgba(58,180,255,0.4)',borderWidth:1.5,borderDash:[6,4],pointRadius:0,fill:false,tension:0}
  ]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false},tooltip:{backgroundColor:'#1a1a1a',titleColor:'#888',bodyColor:'#f2f2f2',borderColor:'#202020',borderWidth:1,padding:9,filter:item=>item.datasetIndex===0,callbacks:{label:ctx=>`${ctx.raw} ${unit}`,afterLabel:ctx=>{const p=pts[ctx.dataIndex];return p.notes?`✎ ${p.notes}`:''}}}},scales:{x:{ticks:{color:'#666',font:{size:8,family:"'DM Mono',monospace"}},grid:{color:'rgba(255,255,255,0.03)'},border:{color:'#202020'}},y:{ticks:{color:'#666',font:{size:8,family:"'DM Mono',monospace"}},grid:{color:'rgba(255,255,255,0.03)'},border:{color:'#202020'}}}}});
  const wN=pts.filter(p=>p.notes).reverse().slice(0,5),ns=document.getElementById('notes-sec');
  if(wN.length){ns.style.display='block';document.getElementById('notes-list').innerHTML=wN.map(p=>`<div class="note-row"><div class="note-date">${fmtD(p.date)}</div><div class="note-text">${escapeHtml(p.notes)}</div><div class="note-wt">${p.mx}<span style="font-size:8px;color:var(--muted2)"> ${p.unit}</span></div></div>`).join('');}
  else ns.style.display='none';

  // Best sets by rep range
  const allSets=[];
  db.sessions.forEach(s=>{const e=s.entries?.find(e=>e.exercise===selEx);if(e?.sets)e.sets.filter(st=>!st.warmup).forEach(st=>allSets.push({w:parseFloat(st.w)||0,r:parseInt(st.r)||0,date:s.date,unit:e.unit||'kg'}));});
  const bestByReps={};
  allSets.forEach(s=>{if(!bestByReps[s.r]||s.w>bestByReps[s.r].w)bestByReps[s.r]=s;});
  const repRanges=Object.keys(bestByReps).map(Number).sort((a,b)=>a-b);
  document.getElementById('prog-best-sets').innerHTML=repRanges.length?`
    <div class="slbl slbl-ico">${_s}<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>MEJORES SETS POR REPS</div>
    <div class="prog-best-list">${repRanges.map(r=>{const s=bestByReps[r];return`<div class="prog-best-row"><span class="prog-best-reps">${r} rep${r>1?'s':''}</span><span class="prog-best-weight">${s.w}${s.unit}</span><span class="prog-best-date">${fmtD(s.date)}</span></div>`;}).join('')}</div>`:'';

  // Recent sessions for this exercise
  const recentSess=db.sessions.filter(s=>s.entries?.some(e=>e.exercise===selEx)).sort((a,b)=>b.date.localeCompare(a.date)).slice(0,5);
  document.getElementById('prog-recent-sets').innerHTML=recentSess.length?`
    <div class="slbl slbl-ico">${_s}<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>ÚLTIMAS SESIONES</div>
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

  const _phi={
    bw:_s+'<path d="M12 3v4"/><circle cx="12" cy="3" r="1"/><path d="M6.5 10L12 7l5.5 3"/><rect x="4" y="14" width="16" height="4" rx="2"/><line x1="8" y1="18" x2="8" y2="20"/><line x1="16" y1="18" x2="16" y2="20"/></svg>',
    sess:_s+'<polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>',
    ex:_s+'<line x1="4" y1="12" x2="20" y2="12"/><rect x="2" y="9" width="4" height="6" rx="1.5"/><rect x="18" y="9" width="4" height="6" rx="1.5"/></svg>',
    fire:_s+'<path d="M12 22c4.97 0 7-3.58 7-7.5 0-4.05-3.5-7.5-7-10.5-3.5 3-7 6.45-7 10.5C5 18.42 7.03 22 12 22z"/><path d="M12 22c2 0 3.5-1.5 3.5-4 0-2.5-1.75-4-3.5-5.5C10.25 14 8.5 15.5 8.5 18c0 2.5 1.5 4 3.5 4z"/></svg>',
  };
  el.innerHTML=`
    <div class="ph-greeting">Hola, <span class="ph-name">${name}</span></div>
    <div class="ph-stats">
      <div class="ph-stat"><span class="ph-stat-ico">${_phi.bw}</span><span class="ph-stat-val">${latestBW}</span><span class="ph-stat-lbl">kg</span></div>
      <div class="ph-stat"><span class="ph-stat-ico">${_phi.sess}</span><span class="ph-stat-val">${totalSessions}</span><span class="ph-stat-lbl">sesiones</span></div>
      <div class="ph-stat"><span class="ph-stat-ico">${_phi.ex}</span><span class="ph-stat-val">${totalExercises}</span><span class="ph-stat-lbl">ejercicios</span></div>
      <div class="ph-stat"><span class="ph-stat-ico">${_phi.fire}</span><span class="ph-stat-val">${streak}</span><span class="ph-stat-lbl">racha</span></div>
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
  const actIcons=[
    _s+'<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
    _s+'<path d="M13 4v16"/><path d="M17 4v16"/><path d="M19 8H5c-.6 0-1 .4-1 1v6c0 .6.4 1 1 1h14c.6 0 1-.4 1-1V9c0-.6-.4-1-1-1z" fill="none"/></svg>',
    _s+'<line x1="4" y1="12" x2="20" y2="12"/><rect x="2" y="9" width="4" height="6" rx="1.5"/><rect x="18" y="9" width="4" height="6" rx="1.5"/></svg>',
    _s+'<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',
    _s+'<path d="M12 22c4.97 0 7-3.58 7-7.5 0-4.05-3.5-7.5-7-10.5-3.5 3-7 6.45-7 10.5C5 18.42 7.03 22 12 22z"/><path d="M12 22c2 0 3.5-1.5 3.5-4 0-2.5-1.75-4-3.5-5.5C10.25 14 8.5 15.5 8.5 18c0 2.5 1.5 4 3.5 4z"/></svg>',
  ];
  const actLevel=db.profile.activityLevel??2;
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
    <div class="health-disclaimer">Estos valores son aproximaciones orientativas. No sustituyen una valoración médica profesional.</div>
    <div class="health-activity">
      <div class="act-header">
        <span class="act-header-ico">${_s}<path d="M3 12h4l3-9 4 18 3-9h4"/></svg></span>
        <span class="health-label" style="margin:0">NIVEL DE ACTIVIDAD</span>
      </div>
      <div class="act-row">${actLabels.map((l,i)=>`<div class="act-dot ${actLevel===i?'active':''}" onclick="setActivity(${i})">
        <span class="act-dot-ico">${actIcons[i]}</span>
      </div>`).join('')}</div>
      <div class="act-detail">
        <div class="act-detail-name">${actLabels[actLevel]}</div>
        <div class="act-detail-desc">${actExamples[actLevel]} · multiplicador ×${actMult[actLevel]}</div>
      </div>
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
  const allRows=[...bws].reverse().map((b,i)=>`<div class="bw-hrow"><span class="bw-hdate">${fmtDF(b.date)}</span><span class="bw-hval">${b.v} kg</span><button class="bw-hdel" onclick="delBW(${bws.length-1-i})">×</button></div>`);
  const showAll=hist.dataset.expanded==='true';
  const visible=showAll?allRows:allRows.slice(0,3);
  hist.innerHTML=visible.join('')+(allRows.length>3&&!showAll?`<button class="bw-more" onclick="this.parentElement.dataset.expanded='true';renderBWChart()">Ver ${allRows.length-3} más</button>`:'')+(showAll&&allRows.length>3?`<button class="bw-more" onclick="this.parentElement.dataset.expanded='false';renderBWChart()">Ver menos</button>`:'');
  if(bws.length<2){empty.style.display='flex';if(wrap)wrap.style.display='none';if(bwCh){bwCh.destroy();bwCh=null;}return;}
  empty.style.display='none';if(wrap)wrap.style.display='block';if(bwCh){bwCh.destroy();bwCh=null;}
  bwCh=new Chart(canvas.getContext('2d'),{type:'line',data:{labels:bws.map(b=>fmtD(b.date)),datasets:[{data:bws.map(b=>b.v),borderColor:'#3ab4ff',backgroundColor:ctx=>{const g=ctx.chart.ctx.createLinearGradient(0,0,0,100);g.addColorStop(0,'rgba(58,180,255,0.18)');g.addColorStop(1,'rgba(58,180,255,0)');return g;},borderWidth:2,pointBackgroundColor:'#3ab4ff',pointRadius:3,fill:true,tension:0.35}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false},tooltip:{backgroundColor:'#1a1a1a',bodyColor:'#f2f2f2',callbacks:{label:ctx=>`${ctx.raw} kg`}}},scales:{x:{ticks:{color:'#666',font:{size:8}},grid:{color:'rgba(255,255,255,0.03)'},border:{color:'#202020'}},y:{ticks:{color:'#666',font:{size:8}},grid:{color:'rgba(255,255,255,0.03)'},border:{color:'#202020'}}}}});
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
  const dkWeek=["lunes","martes","miercoles","jueves","viernes","sabado","domingo"];
  const muscleColors={'Pecho':'#f87171','Tríceps':'#fb923c','Hombros':'#fbbf24','Espalda':'#60a5fa','Bíceps':'#818cf8','Cuádriceps':'#4ade80','Isquiotibiales':'#34d399','Glúteos':'#2dd4bf','Pantorrillas':'#6ee7b7','Core':'#f59e0b','Cardio':'#38bdf8'};
  document.getElementById('routine-days').innerHTML=dkWeek.map(dk=>{
    const day=db.routine[dk]||{label:'',rest:false,exercises:[]};
    const isRest=day.rest;
    const exList=(day.exercises||[]);
    const focus=getDayFocus(exList);
    const exCount=exList.length;
    const exRows=exList.map((ex,i)=>{
      const info=getExerciseInfo(ex.name);
      const mg=info?.muscleGroup?.[0]||'Otro';
      const color=muscleColors[mg]||'#777';
      return`<div class="exrow">
        <span class="exrow-num">${i+1}</span>
        <span class="exrow-name">${ex.name}</span>
        <span class="exrow-mg" style="color:${color};border-color:${color}33;background:${color}0d">${mg}</span>
        <button class="exrow-del" onclick="removeEx('${dk}',${i})">×</button>
      </div>`;
    }).join('');
    return`<div class="day-block ${isRest?'day-rest':''}" id="db-${dk}">
      <div class="day-hdr" onclick="toggleDay('${dk}')">
        <div class="day-hdr-left">
          <span class="day-letter">${DL[dk].charAt(0)}</span>
          <div>
            <div class="day-name">${DL[dk].toUpperCase()}${!isRest&&day.label?` <span class="day-label-tag">${day.label}</span>`:''}</div>
            <div class="day-sub">${isRest?'Descanso':exCount?`${exCount} ejercicios · ${focus}`:'Toca para configurar'}</div>
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
          <div id="dexlist-${dk}">${exRows}</div>
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
const FEEDBACK_URL='https://docs.google.com/forms/d/e/1FAIpQLSfLQckaUxUdv0gEPzD7PS1UxdjiTVidmkqTCDjPf9IgBLU29A/viewform';
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
    <span class="set-warm ${s.warmup?'on':''}" onclick="toggleWarmup(${i})">${s.warmup?'C':'N'}</span>
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
  document.getElementById('vol-sets').textContent=`${currentSets.filter(s=>s.warmup).length?currentSets.filter(s=>s.warmup).length+'C+':''}${working.length}N`;
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
  document.getElementById('nval').value='';const ne=document.getElementById('note-expand');if(ne)ne.classList.remove('open');document.getElementById('c-min').value='';document.getElementById('c-km').value='';
  const calEl=document.getElementById('c-cal');if(calEl)calEl.value='';
  setCardioIntensity('media');
  document.getElementById('m-wsec').style.display=type==='cardio'?'none':'';
  document.getElementById('m-csec').style.display=type==='cardio'?'':'none';
  document.getElementById('msub').textContent=type==='cardio'?'REGISTRA TU CARDIO':'REGISTRA TU ENTRENAMIENTO';
  const ts=db.sessions.find(s=>s.date===today()),entry=ts?.entries?.find(e=>e.exercise===name),prev=prevEntry(name);
  const del=document.getElementById('dbtn');
  let hints='';
  if(type!=='cardio'){
    if(prev){
      const prevMx=entryMaxWeight(prev);
      const suggestion=smartSuggestion(name);
      if(suggestion)hints+=`<div class="mhint ${suggestion.color}"><span class="mhint-l">${suggestion.reason}</span><span class="mhint-v ${suggestion.color}">${suggestion.msg}</span></div>`;
    }
    let prevBlock='';
    if(prev?.sets?.length){
      const last3=getLastEntries(name,3);
      const unit=prev.unit||'kg';
      const _pi='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">';
      const piIco={
        weight:_pi+'<line x1="4" y1="12" x2="20" y2="12"/><rect x="2" y="9" width="4" height="6" rx="1.5"/><rect x="18" y="9" width="4" height="6" rx="1.5"/></svg>',
        reps:_pi+'<polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>',
        sets:_pi+'<polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>',
        vol:_pi+'<line x1="6" y1="20" x2="6" y2="14"/><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/></svg>',
      };
      if(last3.length>=2){
        const avgWeight=Math.round(last3.reduce((a,e)=>a+(entryMaxWeight(e)||0),0)/last3.length*10)/10;
        const avgReps=Math.round(last3.reduce((a,e)=>{const ws=e.sets?.filter(s=>!s.warmup)||[];return a+(ws.length?Math.max(...ws.map(s=>parseInt(s.r)||0)):0);},0)/last3.length);
        const avgVol=Math.round(last3.reduce((a,e)=>a+entryVolume(e),0)/last3.length);
        const avgSets=Math.round(last3.reduce((a,e)=>a+(e.sets?.filter(s=>!s.warmup).length||0),0)/last3.length);
        prevBlock=`<div class="prev-avg-card">
          <div class="prev-avg-title"><span class="prev-avg-ico">${_pi}<path d="M12 8v8"/><path d="M8 12h8"/><circle cx="12" cy="12" r="10"/></svg></span>TU PROMEDIO <span class="prev-avg-sub">últimas ${last3.length} sesiones</span></div>
          <div class="prev-avg-grid">
            <div class="prev-avg-item"><span class="prev-avg-item-ico">${piIco.weight}</span><span class="prev-avg-val">${avgWeight}</span><span class="prev-avg-lbl">${unit} máx</span></div>
            <div class="prev-avg-item"><span class="prev-avg-item-ico">${piIco.reps}</span><span class="prev-avg-val">${avgReps}</span><span class="prev-avg-lbl">reps máx</span></div>
            <div class="prev-avg-item"><span class="prev-avg-item-ico">${piIco.sets}</span><span class="prev-avg-val">${avgSets}</span><span class="prev-avg-lbl">series</span></div>
            <div class="prev-avg-item"><span class="prev-avg-item-ico">${piIco.vol}</span><span class="prev-avg-val">${avgVol>=1000?(avgVol/1000).toFixed(1)+'k':avgVol}</span><span class="prev-avg-lbl">kg vol</span></div>
          </div>
        </div>`;
      } else {
        const mx=entryMaxWeight(prev);
        prevBlock=`<div class="prev-avg-card"><div class="prev-avg-title"><span class="prev-avg-ico">${_pi}<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></span>SESIÓN ANTERIOR</div><div class="prev-avg-grid"><div class="prev-avg-item"><span class="prev-avg-item-ico">${piIco.weight}</span><span class="prev-avg-val">${mx}</span><span class="prev-avg-lbl">${unit} máx</span></div><div class="prev-avg-item"><span class="prev-avg-item-ico">${piIco.sets}</span><span class="prev-avg-val">${prev.sets.filter(s=>!s.warmup).length}</span><span class="prev-avg-lbl">series</span></div></div></div>`;
      }
    }
    document.getElementById('prev-sets-block').innerHTML=prevBlock;
    if(entry?.sets?.length){currentSets=entry.sets.map(s=>({w:s.w,r:s.r,warmup:!!s.warmup}));if(entry.unit)setUnit(entry.unit);}
    else if(prev?.sets?.length){currentSets=prev.sets.map(s=>({w:s.w,r:s.r,warmup:!!s.warmup}));setUnit(prev.unit||'kg');}
    else if(prev?.weight){currentSets=[{w:prev.weight,r:'',warmup:false}];setUnit(prev.unit||'kg');}
    else{const rd=db.objective==='fuerza'?3:db.objective==='hipertrofia'?10:15;currentSets=[{w:'',r:rd,warmup:false}];}
    renderSets();
  }
  document.getElementById('mhints').innerHTML=hints;
  if(entry){if(type==='cardio'){document.getElementById('c-min').value=entry.min||'';document.getElementById('c-km').value=entry.km||'';const calEl=document.getElementById('c-cal');if(calEl)calEl.value=entry.cal||'';if(entry.intensity)setCardioIntensity(entry.intensity);}document.getElementById('nval').value=entry.notes||'';if(entry.notes){const ne=document.getElementById('note-expand');if(ne)ne.classList.add('open');}del.style.display='';}
  else del.style.display='none';
  document.getElementById('overlay').classList.add('open');
}
function setCardioIntensity(val){
  document.querySelectorAll('.c-int-opt').forEach(el=>{el.classList.toggle('active',el.dataset.val===val);});
  updateCalEstimate();
}

// MET values por ejercicio e intensidad (evidencia: Compendium of Physical Activities)
// MET = consumo de oxígeno relativo al reposo. Calorías/min = MET × peso(kg) × 3.5 / 200
const CARDIO_METS={
  'Correr':{baja:6,media:8.5,alta:11},
  'Caminadora':{baja:3.5,media:5,alta:8},
  'Caminar':{baja:2.5,media:3.5,alta:5},
  'Elíptica':{baja:4.5,media:6,alta:8},
  'Bicicleta estática':{baja:4,media:6.5,alta:10},
  'Stairmaster':{baja:6,media:8,alta:10},
  'Remo ergómetro':{baja:5,media:7,alta:10},
  'Saltar cuerda':{baja:8,media:10,alta:12},
  'Natación':{baja:4.5,media:7,alta:10},
  'Bicicleta de asalto':{baja:6,media:9,alta:12},
  'HIIT':{baja:6,media:9,alta:12},
};
function estimateCalories(exercise,intensity,minutes,weightKg){
  const mets=CARDIO_METS[exercise]||{baja:4,media:6,alta:8};
  const met=mets[intensity]||mets.media;
  return Math.round(met*weightKg*3.5/200*minutes);
}
function updateCalEstimate(){
  const calEl=document.getElementById('c-cal');
  const estEl=document.getElementById('c-cal-est');
  if(!calEl||!estEl)return;
  const min=parseFloat(document.getElementById('c-min').value)||0;
  const intensity=document.querySelector('.c-int-opt.active')?.dataset.val||'media';
  const w=parseFloat(db.profile.weight)||70;
  if(min>0){
    const est=estimateCalories(curEx,intensity,min,w);
    estEl.textContent=`~${est} kcal aprox.`;
    estEl.style.display='';
    if(!calEl.value)calEl.placeholder=est;
  } else {
    estEl.style.display='none';
    calEl.placeholder='—';
  }
}
function closeModal(e){if(e&&e.target!==document.getElementById('overlay'))return;document.getElementById('overlay').classList.remove('open');}

// ── Swipe down to close any modal ──
(function(){
  let startY=0,currentY=0,isDragging=false,activeOverlay=null,activeModal=null;
  document.addEventListener('touchstart',e=>{
    const modal=document.querySelector('.overlay.open .modal');
    if(!modal)return;
    if(modal.scrollTop<=0){
      startY=e.touches[0].clientY;isDragging=true;currentY=0;
      activeModal=modal;
      activeOverlay=modal.closest('.overlay');
    }
  },{passive:true});
  document.addEventListener('touchmove',e=>{
    if(!isDragging||!activeModal)return;
    currentY=e.touches[0].clientY-startY;
    if(currentY>0){
      const dampened=currentY*0.6;
      activeModal.style.transform=`translateY(${dampened}px)`;
      activeModal.style.transition='none';
      activeOverlay.style.opacity=Math.max(0.3,1-dampened/400);
    } else {currentY=0;}
  },{passive:true});
  document.addEventListener('touchend',()=>{
    if(!isDragging||!activeModal)return;isDragging=false;
    if(currentY>80){
      activeModal.style.transition='transform 0.4s cubic-bezier(0.32,0.72,0,1)';
      activeModal.style.transform='translateY(100%)';
      activeOverlay.style.transition='opacity 0.35s ease';
      activeOverlay.style.opacity='0';
      const ov=activeOverlay,mo=activeModal;
      setTimeout(()=>{ov.classList.remove('open');mo.style.transition='';mo.style.transform='';ov.style.transition='';ov.style.opacity='';},400);
    } else {
      activeModal.style.transition='transform 0.35s cubic-bezier(0.32,0.72,0,1)';
      activeModal.style.transform='';
      activeOverlay.style.transition='opacity 0.3s ease';
      activeOverlay.style.opacity='';
      const mo=activeModal,ov=activeOverlay;
      setTimeout(()=>{mo.style.transition='';ov.style.transition='';},350);
    }
    currentY=0;activeModal=null;activeOverlay=null;
  });
})();
function saveEntry(){
  const t=today(),dk=todayDK();let entry;
  if(curType==='cardio'){const calEl=document.getElementById('c-cal');const min=parseFloat(document.getElementById('c-min').value)||0;const intensity=document.querySelector('.c-int-opt.active')?.dataset.val||'media';const userCal=calEl?parseFloat(calEl.value):0;const cal=userCal||estimateCalories(curEx,intensity,min,parseFloat(db.profile.weight)||70);entry={exercise:curEx,type:'cardio',min,intensity,km:parseFloat(document.getElementById('c-km').value)||0,cal,calEstimated:!userCal,notes:document.getElementById('nval').value.trim()};}
  else{const valid=currentSets.filter(s=>s.w!==''&&s.r!=='');if(!valid.length){toast('Agrega al menos una serie');return;}entry={exercise:curEx,type:'pesas',sets:valid.map(s=>({w:parseFloat(s.w),r:parseInt(s.r),warmup:!!s.warmup})),unit:curUnit,notes:document.getElementById('nval').value.trim()};}
  let sess=db.sessions.find(s=>s.date===t);
  const isNew=!sess;
  if(!sess){sess={date:t,dayKey:dk,entries:[],startTime:new Date().toISOString()};db.sessions.push(sess);}
  if(!sess.startTime)sess.startTime=new Date().toISOString();
  sess.endTime=new Date().toISOString();
  const idx=sess.entries.findIndex(e=>e.exercise===curEx);if(idx>=0)sess.entries[idx]=entry;else sess.entries.push(entry);
  ps('gym_sessions',db.sessions);document.getElementById('overlay').classList.remove('open');renderHoy();renderHeader();
  toast('Guardado ✓');
}
function deleteEntry(){
  const t=today(),sess=db.sessions.find(s=>s.date===t);if(!sess)return;
  sess.entries=sess.entries.filter(e=>e.exercise!==curEx);if(!sess.entries.length)db.sessions=db.sessions.filter(s=>s.date!==t);
  ps('gym_sessions',db.sessions);document.getElementById('overlay').classList.remove('open');renderHoy();
}

function copyImportPrompt(){
  const prompt=`Convierte mi rutina de gym al siguiente formato JSON. Responde SOLO con el JSON, sin explicaciones.

El formato es:
{
  "routine": {
    "lunes": { "label": "Nombre del día", "rest": false, "exercises": [{"name": "Nombre ejercicio", "type": "pesas"}] },
    "martes": { "label": "Descanso", "rest": true, "exercises": [] },
    "miercoles": { "label": "...", "rest": false, "exercises": [...] },
    "jueves": { "label": "...", "rest": false, "exercises": [...] },
    "viernes": { "label": "...", "rest": false, "exercises": [...] },
    "sabado": { "label": "Descanso", "rest": true, "exercises": [] },
    "domingo": { "label": "Descanso", "rest": true, "exercises": [] }
  },
  "sessions": [],
  "profile": { "name": "", "age": "", "sex": "H", "height": "", "weight": "" },
  "objective": "hipertrofia",
  "bw": []
}

Reglas:
- Los días siempre son: lunes, martes, miercoles, jueves, viernes, sabado, domingo (sin tildes)
- "type" es "pesas" para ejercicios con peso y "cardio" para cardio
- "rest": true para días de descanso, false para días de entrenamiento
- "label" es el nombre del tipo de entrenamiento (ej: "Push", "Pull", "Legs", "Full Body")
- "objective" puede ser: "hipertrofia", "fuerza" o "resistencia"

Mi rutina es:
`;
  navigator.clipboard.writeText(prompt).then(()=>toast('Prompt copiado ✓')).catch(()=>toast('No se pudo copiar'));
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
  if(name==='hoy'){startDurationInterval();}else{stopDurationInterval();reorderMode=false;}
  const fab=document.getElementById('reorder-toggle');
  if(fab)fab.style.display=name==='hoy'?'':'none';
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

// ── GYM GUIDE ──
const GI={
  // 1RM — dumbbell (single, clean)
  crown:_s+'<line x1="4" y1="12" x2="20" y2="12"/><rect x="2" y="9" width="4" height="6" rx="1.5"/><rect x="18" y="9" width="4" height="6" rx="1.5"/></svg>',
  // PR — trophy cup
  star:_s+'<path d="M6 9H3a1 1 0 0 0-1 1v1a4 4 0 0 0 4 4h0"/><path d="M18 9h3a1 1 0 0 1 1 1v1a4 4 0 0 1-4 4h0"/><path d="M7 4h10v7a5 5 0 0 1-10 0V4z"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="16" x2="12" y2="20"/></svg>',
  // Max weight — gauge/speedometer at max
  weight:_s+'<path d="M12 22c5.52 0 10-4.48 10-10S17.52 2 12 2 2 6.48 2 12"/><line x1="12" y1="12" x2="17" y2="7"/><circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none"/></svg>',
  // Volume — bar chart ascending
  bars:_s+'<line x1="6" y1="20" x2="6" y2="14"/><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/></svg>',
  // Sets — layers/stack
  repeat:_s+'<polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>',
  // Reps — rotate clockwise (cycle)
  hash:_s+'<polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>',
  // Warm-up — flame with dashed outline (light/soft fire)
  thermo:_s+'<path d="M9 18a3 3 0 0 0 6 0c0-2-1.5-3-3-4.5C10.5 15 9 16 9 18z"/><path d="M12 2C8.5 5 5 8.5 5 13a7 7 0 0 0 14 0c0-4.5-3.5-8-7-11z" stroke-dasharray="3 2"/></svg>',
  // Progressive overload — trending up
  trendUp:_s+'<polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>',
  // Plateau — flat trend line (going up then stuck)
  wall:_s+'<polyline points="3 17 8 12 13 12 18 12"/><line x1="18" y1="12" x2="21" y2="12" stroke-dasharray="2 2"/><line x1="16" y1="10" x2="20" y2="10" stroke-opacity="0.3"/><line x1="16" y1="14" x2="20" y2="14" stroke-opacity="0.3"/></svg>',
  // Consistency streak — flame
  flame:_s+'<path d="M12 22c4.97 0 7-3.58 7-7.5 0-4.05-3.5-7.5-7-10.5-3.5 3-7 6.45-7 10.5C5 18.42 7.03 22 12 22z"/><path d="M12 22c2 0 3.5-1.5 3.5-4 0-2.5-1.75-4-3.5-5.5C10.25 14 8.5 15.5 8.5 18c0 2.5 1.5 4 3.5 4z"/></svg>',
  // Progress streak — lightning bolt
  bolt:_s+'<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',
  // IMC — scale/balance
  ruler:_s+'<path d="M12 3v4"/><circle cx="12" cy="3" r="1"/><path d="M6.5 10L12 7l5.5 3"/><rect x="4" y="14" width="16" height="4" rx="2"/><line x1="8" y1="18" x2="8" y2="20"/><line x1="16" y1="18" x2="16" y2="20"/></svg>',
  // Hypertrophy — bicep/muscle flex
  expand:_s+'<path d="M7 20l-3-3c-1-1-1-2.5 0-3.5l0 0c.7-.7 1.8-.8 2.6-.3"/><path d="M9.5 14.5L7 12"/><path d="M14 17l5-5c1-1 1-2.5 0-3.5l-4-4c-1-1-2.5-1-3.5 0L6 10c-1 1-1 2.5 0 3.5l4 4c1 1 2.5 1 3.5 0z"/><path d="M17 8l2-2"/></svg>',
  // Strength — target/bullseye
  shield:_s+'<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>',
  // Endurance — heartbeat/pulse
  heart:_s+'<path d="M3 12h4l3-9 4 18 3-9h4"/></svg>',
};
const GUIDE_DATA=[
  {cat:'MEDIDAS DE FUERZA',color:'var(--accent)',items:[
    {ico:GI.crown,term:'1RM',name:'1 Rep Max',desc:'El peso máximo que puedes levantar en una sola repetición. Es la referencia universal de fuerza.',example:'Si haces 80kg × 5 reps en press banca, tu 1RM estimado es ~93kg. No necesitas intentar tu máximo real — la app lo calcula por ti.'},
    {ico:GI.star,term:'PR',name:'Personal Record',desc:'Tu récord personal — el mejor rendimiento que has logrado en un ejercicio.',example:'Si antes tu máximo en sentadilla era 100kg y hoy levantas 105kg, ¡ese es tu nuevo PR!'},
    {ico:GI.weight,term:'Peso máximo',name:'Max Weight',desc:'El peso más alto que usaste en tus sets de trabajo (sin contar calentamiento) durante una sesión.',example:'Si hiciste 3 series de press banca: 60kg, 70kg y 75kg — tu peso máximo es 75kg.'},
  ]},
  {cat:'VOLUMEN Y CARGA',color:'var(--orange)',items:[
    {ico:GI.bars,term:'Volumen',name:'Total Volume',desc:'La cantidad total de peso que moviste. Se calcula: peso × repeticiones, sumado en todas las series.',example:'3 series de 80kg × 10 reps = 2,400kg de volumen. Más volumen = más estímulo muscular.'},
    {ico:GI.repeat,term:'Series (Sets)',name:'Working Sets',desc:'Cada grupo de repeticiones que haces de un ejercicio. Las series "de trabajo" son las que cuentan — no el calentamiento.',example:'Si haces 4 × 10 en curl de bíceps, son 4 series de 10 repeticiones cada una.'},
    {ico:GI.hash,term:'Reps',name:'Repeticiones',desc:'El número de veces que repites un movimiento dentro de una serie.',example:'Si subes y bajas la barra 10 veces en press banca, hiciste 10 reps.'},
    {ico:GI.thermo,term:'Calentamiento',name:'Warm-up Set',desc:'Series ligeras que haces antes de tus sets de trabajo para preparar músculos y articulaciones. No cuentan en los cálculos.',example:'Antes de hacer sentadilla con 100kg, haces 1 serie con 40kg y otra con 70kg. Esas son de calentamiento.'},
  ]},
  {cat:'PROGRESO',color:'var(--blue)',items:[
    {ico:GI.trendUp,term:'Sobrecarga progresiva',name:'Progressive Overload',desc:'El principio fundamental del gym: aumentar gradualmente la dificultad (peso, reps o series) para que tus músculos sigan creciendo.',example:'Semana 1: 60kg × 8 reps. Semana 2: 60kg × 10 reps. Semana 3: 62.5kg × 8 reps. Eso es sobrecarga progresiva.'},
    {ico:GI.wall,term:'Plateau',name:'Estancamiento',desc:'Cuando dejas de progresar durante varias semanas. Es normal y tiene solución: cambiar ejercicios, volumen o descanso.',example:'Si llevas 3 semanas haciendo press banca con 70kg × 8 y no logras subir, estás en un plateau.'},
    {ico:GI.flame,term:'Streak de constancia',name:'Consistency Streak',desc:'Días consecutivos que has entrenado según tu rutina. Mide tu disciplina.',example:'Si tu rutina es Lun-Mié-Vie y entrenas los 3 días durante 4 semanas sin fallar, tu streak crece.'},
    {ico:GI.bolt,term:'Streak de progreso',name:'Progress Streak',desc:'Sesiones consecutivas donde mejoraste vs. la sesión anterior (más peso, más reps o más volumen).',example:'Si cada sesión de pecho superas algo de la anterior, tu streak de progreso sube.'},
  ]},
  {cat:'CUERPO',color:'var(--green)',items:[
    {ico:GI.ruler,term:'IMC',name:'Índice de Masa Corporal',desc:'Una medida básica que relaciona tu peso y altura. Útil como referencia general, pero no distingue entre músculo y grasa.',example:'Peso 75kg, mido 1.75m → IMC = 75 ÷ (1.75²) = 24.5 (normal). Un fisicoculturista de 95kg puede tener IMC "alto" pero poca grasa.'},
    {ico:GI.expand,term:'Hipertrofia',name:'Muscle Growth',desc:'El objetivo de aumentar el tamaño muscular. Se logra con 8-12 reps por serie y descansos de 60-90 segundos.',example:'Si tu objetivo es que los músculos se vean más grandes, entrenas en rango de hipertrofia.'},
    {ico:GI.shield,term:'Fuerza',name:'Strength',desc:'El objetivo de levantar el máximo peso posible. Se entrena con 1-5 reps por serie con pesos altos y descansos largos (3-5 min).',example:'Un powerlifter entrena fuerza: pocas reps, mucho peso, mucho descanso entre series.'},
    {ico:GI.heart,term:'Resistencia',name:'Endurance',desc:'La capacidad de mantener el esfuerzo por más tiempo. Se entrena con 15+ reps, poco peso y descansos cortos.',example:'Hacer 20 reps de sentadilla con peso ligero entrena resistencia muscular.'},
  ]},
];

function openGuide(){
  const el=document.getElementById('guide-content');
  el.innerHTML=GUIDE_DATA.map(cat=>`
    <div class="guide-cat">
      <div class="guide-cat-hdr" style="--cat-color:${cat.color}">${cat.cat}</div>
      ${cat.items.map(item=>`
        <div class="guide-card" style="--cat-color:${cat.color}" onclick="this.classList.toggle('expanded')">
          <div class="guide-card-top">
            <span class="guide-card-ico">${item.ico}</span>
            <div class="guide-card-info">
              <div class="guide-card-term">${item.term}</div>
              <div class="guide-card-name">${item.name}</div>
            </div>
            <span class="guide-card-arrow">›</span>
          </div>
          <div class="guide-card-body">
            <p class="guide-card-desc">${item.desc}</p>
            <div class="guide-card-example">
              <div class="guide-card-ex-label">EJEMPLO</div>
              <p>${item.example}</p>
            </div>
          </div>
        </div>
      `).join('')}
    </div>
  `).join('');
  document.getElementById('guide-overlay').classList.add('open');
}
function closeGuide(ev){if(ev.target.id==='guide-overlay')document.getElementById('guide-overlay').classList.remove('open');}

// ── Service Worker Registration ──
if('serviceWorker' in navigator){
  navigator.serviceWorker.register('sw.js').catch(()=>{});
}

// ── Init ──
const _isNew=!localStorage.getItem('gym_onboarded');
if(!_isNew){renderHeader();renderObj();renderHoy();startDurationInterval();}
else{document.getElementById('app').style.display='none';}
if(typeof checkOnboarding==='function')checkOnboarding();
