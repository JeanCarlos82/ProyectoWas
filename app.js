const DK=["domingo","lunes","martes","miercoles","jueves","viernes","sabado"];
const DL={domingo:"Domingo",lunes:"Lunes",martes:"Martes",miercoles:"Miércoles",jueves:"Jueves",viernes:"Viernes",sabado:"Sábado"};
const MO=['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
const OBJS={fuerza:{reps:"1–5 reps",series:"4–6 series"},hipertrofia:{reps:"6–12 reps",series:"3–4 series"},resistencia:{reps:"13–20 reps",series:"2–3 series"}};
const IMC_C=[{max:18.5,label:"Bajo peso",color:"#3ab4ff"},{max:25,label:"Peso normal",color:"#3aff8a"},{max:30,label:"Sobrepeso",color:"#ffaa3a"},{max:35,label:"Obesidad I",color:"#ff4d4d"},{max:999,label:"Obesidad II+",color:"#ff4d4d"}];
const DR={lunes:{label:"Pecho + Tríceps",rest:false,exercises:[{name:"Press banca",type:"pesas"},{name:"Press inclinado",type:"pesas"},{name:"Aperturas mancuernas",type:"pesas"},{name:"Fondos en paralelas",type:"pesas"},{name:"Press francés",type:"pesas"}]},martes:{label:"Espalda + Bíceps",rest:false,exercises:[{name:"Jalón al pecho",type:"pesas"},{name:"Remo con barra",type:"pesas"},{name:"Remo en polea baja",type:"pesas"},{name:"Curl con barra",type:"pesas"},{name:"Curl martillo",type:"pesas"}]},miercoles:{label:"Hombros",rest:false,exercises:[{name:"Press militar",type:"pesas"},{name:"Elevaciones laterales",type:"pesas"},{name:"Elevaciones frontales",type:"pesas"},{name:"Pájaros",type:"pesas"}]},jueves:{label:"Pierna",rest:false,exercises:[{name:"Sentadilla",type:"pesas"},{name:"Prensa de pierna",type:"pesas"},{name:"Extensiones cuádriceps",type:"pesas"},{name:"Curl femoral",type:"pesas"},{name:"Pantorrillas",type:"pesas"}]},viernes:{label:"Bíceps + Tríceps",rest:false,exercises:[{name:"Curl concentrado",type:"pesas"},{name:"Curl en polea",type:"pesas"},{name:"Tríceps en polea",type:"pesas"},{name:"Patada de tríceps",type:"pesas"}]},sabado:{label:"Cardio",rest:false,exercises:[{name:"Correr",type:"cardio"},{name:"Bicicleta estática",type:"cardio"},{name:"Elíptica",type:"cardio"}]},domingo:{label:"Descanso",rest:true,exercises:[]}};

function loadDB(){try{return{routine:JSON.parse(localStorage.getItem('gym_routine'))||DR,sessions:JSON.parse(localStorage.getItem('gym_sessions'))||[],profile:JSON.parse(localStorage.getItem('gym_profile'))||{name:'',age:'',sex:'H',height:'',weight:''},objective:localStorage.getItem('gym_objective')||'hipertrofia',bw:JSON.parse(localStorage.getItem('gym_bw'))||[]}}catch{return{routine:DR,sessions:[],profile:{name:'',age:'',sex:'H',height:'',weight:''},objective:'hipertrofia',bw:[]}}}
function ps(k,v){localStorage.setItem(k,typeof v==='string'?v:JSON.stringify(v));}
let db=loadDB(),selMG=null,selEx=null,bwCh=null,progCh=null,curEx=null,curType=null,curUnit='kg',currentSets=[];

const today=()=>new Date().toISOString().split('T')[0];
const todayDK=()=>DK[new Date().getDay()];
const fmtD=d=>{const[y,m,dd]=d.split('-');return`${parseInt(dd)} ${MO[parseInt(m)-1]}`;};
const fmtDF=d=>{const[y,m,dd]=d.split('-');return`${parseInt(dd)} ${MO[parseInt(m)-1]} ${y}`;};
function toast(msg){const t=document.getElementById('toast');t.textContent=msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2200);}

function entryMaxWeight(e){if(!e)return null;if(e.sets?.length)return Math.max(...e.sets.map(s=>parseFloat(s.w)||0));if(e.weight)return parseFloat(e.weight);return null;}
function entryVolume(e){if(!e)return 0;if(e.sets?.length)return e.sets.reduce((a,s)=>a+(parseFloat(s.w)||0)*(parseInt(s.r)||0),0);return 0;}
function entrySetCount(e){if(!e)return 0;return e.sets?.length||(e.weight?1:0);}
function entrySummaryText(e){
  if(!e)return '';
  if(e.sets?.length){const mx=entryMaxWeight(e);return`${e.sets.length} series · ${mx}${e.unit||'kg'} máx`;}
  if(e.weight)return`${e.weight} ${e.unit||'kg'}`;
  if(e.type==='cardio')return`${e.min||0}min${e.km?' · '+e.km+'km':''}`;
  return '';
}

function calcStreak(){
  const dates=new Set(db.sessions.filter(s=>s.entries?.length>0).map(s=>s.date));
  let n=0,d=new Date();
  if(!dates.has(today()))d.setDate(d.getDate()-1);
  while(true){const k=d.toISOString().split('T')[0];if(!dates.has(k))break;if(!db.routine[DK[d.getDay()]]?.rest)n++;d.setDate(d.getDate()-1);}
  return n;
}

function renderHeader(){
  const dk=todayDK(),day=db.routine[dk],now=new Date();
  document.getElementById('hdr-day').textContent=DL[dk].toUpperCase();
  document.getElementById('hdr-date').textContent=`${now.getDate()} ${MO[now.getMonth()]} ${now.getFullYear()}`;
  const b=document.getElementById('hdr-badge');
  if(!day||day.rest){b.textContent='DESCANSO';b.className='hdr-badge rest';}
  else{b.textContent=day.label.toUpperCase();b.className='hdr-badge';}
  const s=calcStreak(),sp=document.getElementById('streak');
  if(s>=2){sp.style.display='flex';document.getElementById('streak-n').textContent=s;}
  else sp.style.display='none';
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
      const sugg=prevMx?(prevMx+2.5).toFixed(1):null;
      const unit=entry?.unit||prev?.unit||'kg';
      h+=`<div class="ex-card ${logged?'logged':''}" onclick="openModal('${sn}','pesas')">
        <div class="ex-l">
          <div class="ex-name">${ex.name}</div>
          <div class="ex-sub">${logged?entrySummaryText(entry):'Toca para registrar'}</div>
          <div class="ex-chips">
            <span class="chip y">${obj.reps} · ${obj.series}</span>
            ${prevMx?`<span class="chip b">Prev: ${prevMx}${prev?.unit||'kg'}</span>`:''}
            ${sugg&&!logged?`<span class="chip g">→ ${sugg}kg</span>`:''}
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

function renderHist(){
  const list=document.getElementById('sess-list'),sorted=[...db.sessions].sort((a,b)=>b.date.localeCompare(a.date));
  if(!sorted.length){list.innerHTML=`<div class="empty"><div class="empty-ico">📋</div><div class="empty-txt">Aún no hay sesiones.<br>¡Empieza hoy!</div></div>`;return;}
  list.innerHTML=sorted.map(sess=>{
    const label=db.routine[sess.dayKey]?.label||sess.dayKey;
    const rows=(sess.entries||[]).map(e=>{
      let valHtml='',setsHtml='';
      if(e.type==='cardio'){valHtml=`<div class="sess-val">${e.min||0}<small style="font-size:10px;color:var(--muted2)"> min</small></div>`;}
      else{const mx=entryMaxWeight(e);valHtml=`<div class="sess-val">${mx||'?'}<small style="font-size:10px;color:var(--muted2)"> ${e.unit||'kg'}</small></div><div class="sess-val-sub">${entrySetCount(e)} series</div>`;if(e.sets?.length)setsHtml=e.sets.map((s,i)=>`${i+1}. ${s.w}${e.unit||'kg'}×${s.r}`).join(' · ');}
      return`<div class="sess-row"><div><div class="sess-exname">${e.exercise}</div>${setsHtml?`<div class="sess-sets">${setsHtml}</div>`:''}${e.notes?`<div class="sess-note">"${e.notes}"</div>`:''}</div><div class="sess-maxval">${valHtml}</div></div>`;
    }).join('');
    return`<div class="sess-card"><div class="sess-hdr" onclick="this.nextElementSibling.classList.toggle('open')"><div><div class="sess-day">${(DL[sess.dayKey]||sess.dayKey).toUpperCase()}</div><div class="sess-date">${fmtDF(sess.date)}</div></div><div class="sess-tag">${label.toUpperCase()}</div></div><div class="sess-body">${rows||'<div style="color:var(--muted2);font-size:10px;padding:8px 0;font-family:\'DM Mono\',monospace">Sin ejercicios</div>'}</div></div>`;
  }).join('');
}

function buildMuscleGroups(){
  const g=new Map();
  Object.values(db.routine).forEach(d=>{if(!d.rest&&d.exercises?.length)d.exercises.forEach(ex=>{if(!g.has(d.label))g.set(d.label,[]);g.get(d.label).push(ex);});});
  return g;
}
function renderProg(){
  const groups=buildMuscleGroups(),labels=[...groups.keys()];
  if(!selMG||!groups.has(selMG))selMG=labels[0]||null;
  document.getElementById('mg-tabs').innerHTML=labels.map(l=>`<div class="mg-tab ${selMG===l?'active':''}" onclick="selectMG('${l.replace(/'/g,"\\'")}')"> ${l.toUpperCase()}</div>`).join('');
  const exes=groups.get(selMG)||[];
  document.getElementById('echips').innerHTML=exes.map(ex=>`<div class="echip ${selEx===ex.name?'active':''}" onclick="selectEx('${ex.name.replace(/'/g,"\\'")}')"> ${ex.name}</div>`).join('');
  if(selEx&&!exes.find(e=>e.name===selEx))selEx=null;
  if(selEx)renderExChart();else clearChart();
}
function selectMG(l){selMG=l;selEx=null;renderProg();clearChart();}
function clearChart(){document.getElementById('chart-empty').style.display='flex';document.getElementById('chart-cwrap').style.display='none';document.getElementById('stat-row').style.display='none';document.getElementById('pr-badge').style.display='none';document.getElementById('notes-sec').style.display='none';}
function selectEx(name){selEx=name;renderProg();renderExChart();}
function renderExChart(){
  const pts=[];
  db.sessions.forEach(s=>{const e=s.entries?.find(e=>e.exercise===selEx);if(e){const mx=entryMaxWeight(e),vol=entryVolume(e),unit=e.unit||'kg';if(mx)pts.push({date:s.date,mx,vol,unit,notes:e.notes});}});
  pts.sort((a,b)=>a.date.localeCompare(b.date));
  const empty=document.getElementById('chart-empty'),wrap=document.getElementById('chart-cwrap'),sr=document.getElementById('stat-row'),prb=document.getElementById('pr-badge');
  if(pts.length<2){empty.style.display='flex';wrap.style.display='none';sr.style.display='none';prb.style.display='none';document.getElementById('notes-sec').style.display='none';return;}
  empty.style.display='none';wrap.style.display='block';sr.style.display='flex';
  const mxVals=pts.map(p=>p.mx),maxV=Math.max(...mxVals),unit=pts[0].unit,totalVol=pts.reduce((a,p)=>a+p.vol,0),isPR=mxVals[mxVals.length-1]===maxV;
  prb.style.display=isPR?'':'none';
  document.getElementById('sv-max').textContent=maxV;document.getElementById('su-max').textContent=unit;
  document.getElementById('sv-vol').textContent=Math.round(totalVol).toLocaleString();document.getElementById('sv-cnt').textContent=pts.length;
  if(progCh)progCh.destroy();
  const prIdx=mxVals.lastIndexOf(maxV);
  progCh=new Chart(document.getElementById('prog-chart').getContext('2d'),{type:'line',data:{labels:pts.map(p=>fmtD(p.date)),datasets:[{data:mxVals,borderColor:'#E8FF3A',backgroundColor:ctx=>{const g=ctx.chart.ctx.createLinearGradient(0,0,0,140);g.addColorStop(0,'rgba(232,255,58,0.2)');g.addColorStop(1,'rgba(232,255,58,0)');return g;},borderWidth:2.5,pointBackgroundColor:mxVals.map((_,i)=>i===prIdx?'#000':'#E8FF3A'),pointBorderColor:mxVals.map((_,i)=>i===prIdx?'#E8FF3A':'rgba(232,255,58,0.3)'),pointBorderWidth:mxVals.map((_,i)=>i===prIdx?2.5:1),pointRadius:mxVals.map((_,i)=>i===prIdx?6:3),pointHoverRadius:7,fill:true,tension:0.35}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false},tooltip:{backgroundColor:'#1a1a1a',titleColor:'#555',bodyColor:'#f2f2f2',borderColor:'#202020',borderWidth:1,padding:9,callbacks:{label:ctx=>`${ctx.raw} ${unit}`,afterLabel:ctx=>{const p=pts[ctx.dataIndex];return p.notes?`📝 ${p.notes}`:''}}}},scales:{x:{ticks:{color:'#3a3a3a',font:{size:8,family:"'DM Mono',monospace"}},grid:{color:'rgba(255,255,255,0.03)'},border:{color:'#202020'}},y:{ticks:{color:'#3a3a3a',font:{size:8,family:"'DM Mono',monospace"}},grid:{color:'rgba(255,255,255,0.03)'},border:{color:'#202020'}}}}});
  const wN=pts.filter(p=>p.notes).reverse().slice(0,5),ns=document.getElementById('notes-sec');
  if(wN.length){ns.style.display='block';document.getElementById('notes-list').innerHTML=wN.map(p=>`<div class="note-row"><div class="note-date">${fmtD(p.date)}</div><div class="note-text">${p.notes}</div><div class="note-wt">${p.mx}<span style="font-size:8px;color:var(--muted2)"> ${p.unit}</span></div></div>`).join('');}
  else ns.style.display='none';
}

function loadProfile(){
  const p=db.profile;
  document.getElementById('p-name').value=p.name||'';document.getElementById('p-age').value=p.age||'';
  document.getElementById('p-height').value=p.height||'';document.getElementById('p-weight').value=p.weight||'';
  setSex(p.sex||'H',false);updateIMC();renderObj();
}
function saveProfile(){
  db.profile={name:document.getElementById('p-name').value,age:document.getElementById('p-age').value,sex:db.profile.sex||'H',height:document.getElementById('p-height').value,weight:document.getElementById('p-weight').value};
  ps('gym_profile',db.profile);
}
function setSex(s,save=true){
  db.profile.sex=s;document.getElementById('sex-h').classList.toggle('active',s==='H');document.getElementById('sex-m').classList.toggle('active',s==='M');
  if(save){ps('gym_profile',db.profile);updateIMC();}
}
function updateIMC(){
  const h=parseFloat(document.getElementById('p-height').value),w=parseFloat(document.getElementById('p-weight').value),wrap=document.getElementById('imc-wrap');
  if(!h||!w||h<50||w<20){wrap.innerHTML=`<div style="color:var(--muted2);font-size:10px;text-align:center;padding:10px 0;font-family:'DM Mono',monospace">Completa altura y peso arriba</div>`;return;}
  const hm=h/100,imc=w/(hm*hm),cat=IMC_C.find(c=>imc<c.max)||IMC_C[IMC_C.length-1];
  const pMin=(18.5*hm*hm).toFixed(1),pMax=(24.9*hm*hm).toFixed(1),pMid=((18.5+24.9)/2*hm*hm),diff=(w-pMid).toFixed(1),dStr=diff>0?`+${diff}kg sobre el ideal`:`${diff}kg bajo el ideal`;
  const bars=IMC_C.filter(c=>c.max<999).map((c,i,arr)=>{const prev=arr[i-1]?.max||0;return`<div class="imc-seg" style="background:${c.color};opacity:${imc>=prev&&imc<c.max?1:0.15}"></div>`;}).join('');
  wrap.innerHTML=`<div class="imc-card"><div><div class="imc-num" style="color:${cat.color}">${imc.toFixed(1)}</div><div class="imc-cat" style="color:${cat.color}">${cat.label}</div></div><div class="imc-r"><div class="imc-rlbl">Peso ideal (OMS)</div><div class="imc-range">${pMin}–${pMax} kg</div><div class="imc-diff">${dStr}</div></div></div><div class="imc-bar">${bars}</div>`;
}

function logBW(){
  const v=parseFloat(document.getElementById('bw-val').value);if(!v||v<20||v>400){toast('Peso no válido');return;}
  db.bw.push({date:today(),v});db.bw.sort((a,b)=>a.date.localeCompare(b.date));
  ps('gym_bw',db.bw);document.getElementById('bw-val').value='';
  document.getElementById('p-weight').value=v;saveProfile();updateIMC();renderBWChart();toast('Peso registrado ✓');
}
function delBW(i){db.bw.splice(i,1);ps('gym_bw',db.bw);renderBWChart();}
function renderBWChart(){
  const bws=db.bw,empty=document.getElementById('bw-empty'),canvas=document.getElementById('bw-chart'),hist=document.getElementById('bw-hist');
  hist.innerHTML=[...bws].reverse().slice(0,8).map((b,i)=>`<div class="bw-hrow"><span class="bw-hdate">${fmtDF(b.date)}</span><span class="bw-hval">${b.v} kg</span><button class="bw-hdel" onclick="delBW(${bws.length-1-i})">×</button></div>`).join('');
  if(bws.length<2){empty.style.display='flex';canvas.style.display='none';if(bwCh){bwCh.destroy();bwCh=null;}return;}
  empty.style.display='none';canvas.style.display='block';if(bwCh)bwCh.destroy();
  bwCh=new Chart(canvas.getContext('2d'),{type:'line',data:{labels:bws.map(b=>fmtD(b.date)),datasets:[{data:bws.map(b=>b.v),borderColor:'#3ab4ff',backgroundColor:ctx=>{const g=ctx.chart.ctx.createLinearGradient(0,0,0,100);g.addColorStop(0,'rgba(58,180,255,0.18)');g.addColorStop(1,'rgba(58,180,255,0)');return g;},borderWidth:2,pointBackgroundColor:'#3ab4ff',pointRadius:3,fill:true,tension:0.35}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false},tooltip:{backgroundColor:'#1a1a1a',bodyColor:'#f2f2f2',callbacks:{label:ctx=>`${ctx.raw} kg`}}},scales:{x:{ticks:{color:'#3a3a3a',font:{size:8}},grid:{color:'rgba(255,255,255,0.03)'},border:{color:'#202020'}},y:{ticks:{color:'#3a3a3a',font:{size:8}},grid:{color:'rgba(255,255,255,0.03)'},border:{color:'#202020'}}}}});
}

function renderRutina(){
  document.getElementById('routine-days').innerHTML=DK.map(dk=>{
    const day=db.routine[dk]||{label:'',rest:false,exercises:[]};
    return`<div class="day-block" id="db-${dk}"><div class="day-hdr" onclick="toggleDay('${dk}')"><div><div class="day-name">${DL[dk].toUpperCase()}</div><div class="day-sub">${day.rest?'Descanso':day.label}</div></div><div class="day-tog" id="dtog-${dk}">›</div></div><div class="day-body" id="dbody-${dk}"><div class="tog-row"><div class="tog ${day.rest?'on':''}" id="rtog-${dk}" onclick="toggleRest('${dk}')"><div class="tog-knob"></div></div><span class="tog-lbl">Día de descanso</span></div><div id="dexsec-${dk}" style="${day.rest?'display:none':''}"><input class="dlbl-input" type="text" id="dlbl-${dk}" value="${day.label}" placeholder="Ej: Pecho + Tríceps" onchange="updateLabel('${dk}',this.value)"><div id="dexlist-${dk}">${(day.exercises||[]).map((ex,i)=>`<div class="exrow"><span class="exrow-name">${ex.name}</span><span class="exrow-type">${ex.type}</span><button class="exrow-del" onclick="removeEx('${dk}',${i})">×</button></div>`).join('')}</div><div class="addex-row"><input class="addex-input" type="text" id="newex-${dk}" placeholder="Nuevo ejercicio..."><select class="addex-type" id="newtype-${dk}"><option value="pesas">pesas</option><option value="cardio">cardio</option></select><button class="addex-btn" onclick="addEx('${dk}')">+</button></div></div></div></div>`;
  }).join('');
}
function toggleDay(k){const b=document.getElementById('dbody-'+k),t=document.getElementById('dtog-'+k);b.classList.toggle('open');t.style.transform=b.classList.contains('open')?'rotate(90deg)':'';}
function toggleRest(k){db.routine[k].rest=!db.routine[k].rest;ps('gym_routine',db.routine);document.getElementById('rtog-'+k).classList.toggle('on');document.getElementById('dexsec-'+k).style.display=db.routine[k].rest?'none':'';document.querySelector(`#db-${k} .day-sub`).textContent=db.routine[k].rest?'Descanso':db.routine[k].label;renderHeader();renderHoy();}
function updateLabel(k,v){db.routine[k].label=v;ps('gym_routine',db.routine);document.querySelector(`#db-${k} .day-sub`).textContent=v;renderHeader();}
function removeEx(k,i){db.routine[k].exercises.splice(i,1);ps('gym_routine',db.routine);renderRutina();renderHoy();document.getElementById('dbody-'+k)?.classList.add('open');}
function addEx(k){const inp=document.getElementById('newex-'+k),name=inp.value.trim();if(!name)return;db.routine[k].exercises.push({name,type:document.getElementById('newtype-'+k).value});ps('gym_routine',db.routine);inp.value='';renderRutina();renderHoy();document.getElementById('dbody-'+k)?.classList.add('open');}

// SETS
function addSet(){
  const prev=currentSets.length>0?currentSets[currentSets.length-1]:null;
  currentSets.push({w:prev?.w||'',r:prev?.r||''});
  renderSets();
  setTimeout(()=>{const rows=document.querySelectorAll('.set-w');if(rows.length)rows[rows.length-1].focus();},50);
}
function removeSet(i){currentSets.splice(i,1);renderSets();updateVolSummary();}
function renderSets(){
  const list=document.getElementById('sets-list');
  if(!currentSets.length){list.innerHTML='';updateVolSummary();return;}
  list.innerHTML=currentSets.map((s,i)=>`<div class="set-row"><span class="set-num">${i+1}</span><div class="set-inputs"><input class="set-w" type="number" min="0" step="0.5" placeholder="kg" value="${s.w}" oninput="currentSets[${i}].w=this.value;updateVolSummary()"><span class="set-x-label">×</span><input class="set-r" type="number" min="0" step="1" placeholder="reps" value="${s.r}" oninput="currentSets[${i}].r=this.value;updateVolSummary()"><span class="set-unit" id="su-${i}">${curUnit}</span></div><button class="set-del" onclick="removeSet(${i})">×</button></div>`).join('');
  updateVolSummary();
}
function updateVolSummary(){
  const vs=document.getElementById('vol-summary'),valid=currentSets.filter(s=>s.w&&s.r);
  if(!valid.length){vs.style.display='none';return;}
  vs.style.display='flex';
  const mx=Math.max(...valid.map(s=>parseFloat(s.w))),vol=valid.reduce((a,s)=>a+(parseFloat(s.w)||0)*(parseInt(s.r)||0),0);
  document.getElementById('vol-sets').textContent=currentSets.length;
  document.getElementById('vol-max').textContent=mx;
  document.getElementById('vol-total').textContent=Math.round(vol);
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
  document.getElementById('msub').textContent=type==='cardio'?'REGISTRA TU CARDIO':'SERIES DE HOY';
  const ts=db.sessions.find(s=>s.date===today()),entry=ts?.entries?.find(e=>e.exercise===name),prev=prevEntry(name);
  const del=document.getElementById('dbtn');
  let hints='';
  if(type!=='cardio'){
    if(prev){const prevMx=entryMaxWeight(prev),sugg=(prevMx+2.5).toFixed(1);hints+=`<div class="mhint b"><span class="mhint-l">Sesión anterior</span><span class="mhint-v b">${prevMx} ${prev.unit||'kg'}</span></div><div class="mhint g"><span class="mhint-l">Sugerido hoy (+2.5)</span><span class="mhint-v g">${sugg} ${prev.unit||'kg'}</span></div>`;}
    const obj=OBJS[db.objective];hints+=`<div class="mhint y"><span class="mhint-l">${db.objective.toUpperCase()}</span><span class="mhint-v y">${obj.reps} · ${obj.series}</span></div>`;
    let prevBlock='';
    if(prev?.sets?.length){const rows=prev.sets.map((s,i)=>`<div class="prev-set-row"><span class="prev-set-num">${i+1}</span><span class="prev-set-val">${s.w}${prev.unit||'kg'}</span><span class="prev-set-x">×</span><span class="prev-set-val">${s.r} reps</span></div>`).join('');prevBlock=`<div class="prev-sets-block"><div class="prev-sets-label">REFERENCIA — SESIÓN ANTERIOR</div>${rows}</div>`;}
    document.getElementById('prev-sets-block').innerHTML=prevBlock;
    if(entry?.sets?.length){currentSets=entry.sets.map(s=>({w:s.w,r:s.r}));if(entry.unit)setUnit(entry.unit);}
    else if(prev?.sets?.length){currentSets=prev.sets.map(s=>({w:s.w,r:s.r}));setUnit(prev.unit||'kg');}
    else if(prev?.weight){currentSets=[{w:prev.weight,r:''}];setUnit(prev.unit||'kg');}
    else{const rd=db.objective==='fuerza'?3:db.objective==='hipertrofia'?10:15;currentSets=[{w:'',r:rd}];}
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
  else{const valid=currentSets.filter(s=>s.w!==''&&s.r!=='');if(!valid.length){toast('Agrega al menos una serie');return;}entry={exercise:curEx,type:'pesas',sets:valid.map(s=>({w:parseFloat(s.w),r:parseInt(s.r)})),unit:curUnit,notes:document.getElementById('nval').value.trim()};}
  let sess=db.sessions.find(s=>s.date===t);if(!sess){sess={date:t,dayKey:dk,entries:[]};db.sessions.push(sess);}
  const idx=sess.entries.findIndex(e=>e.exercise===curEx);if(idx>=0)sess.entries[idx]=entry;else sess.entries.push(entry);
  ps('gym_sessions',db.sessions);document.getElementById('overlay').classList.remove('open');renderHoy();renderHeader();toast('Guardado ✓');
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
  if(name==='hist')renderHist();
  if(name==='prog')renderProg();
  if(name==='perfil'){loadProfile();renderBWChart();renderRutina();}
}

renderHeader();renderObj();renderHoy();
