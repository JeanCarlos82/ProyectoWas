// ── ONBOARDING WIZARD ──
// 3-step wizard that generates a personalized routine

const ROUTINE_TEMPLATES={
  fullbody_3:{
    exercises:[
      [{name:"Sentadilla",type:"pesas"},{name:"Press banca",type:"pesas"},{name:"Remo con barra",type:"pesas"},{name:"Press militar",type:"pesas"},{name:"Curl con barra",type:"pesas"},{name:"Tríceps en polea",type:"pesas"}],
      [{name:"Peso muerto rumano",type:"pesas"},{name:"Press inclinado",type:"pesas"},{name:"Jalón al pecho",type:"pesas"},{name:"Elevaciones laterales",type:"pesas"},{name:"Curl martillo",type:"pesas"},{name:"Press francés",type:"pesas"}],
      [{name:"Sentadilla búlgara",type:"pesas"},{name:"Press con mancuernas",type:"pesas"},{name:"Remo con mancuerna",type:"pesas"},{name:"Press Arnold",type:"pesas"},{name:"Curl con mancuernas",type:"pesas"},{name:"Fondos en banco",type:"pesas"}]
    ],
    labels:["Full Body A","Full Body B","Full Body C"]
  },
  upperlower_4:{
    exercises:[
      [{name:"Press banca",type:"pesas"},{name:"Remo con barra",type:"pesas"},{name:"Press militar",type:"pesas"},{name:"Curl con barra",type:"pesas"},{name:"Tríceps en polea",type:"pesas"},{name:"Elevaciones laterales",type:"pesas"}],
      [{name:"Sentadilla",type:"pesas"},{name:"Prensa de pierna",type:"pesas"},{name:"Curl femoral",type:"pesas"},{name:"Pantorrillas",type:"pesas"},{name:"Hip thrust",type:"pesas"}],
      [{name:"Press inclinado",type:"pesas"},{name:"Jalón al pecho",type:"pesas"},{name:"Press Arnold",type:"pesas"},{name:"Curl martillo",type:"pesas"},{name:"Press francés",type:"pesas"},{name:"Face pull",type:"pesas"}],
      [{name:"Peso muerto rumano",type:"pesas"},{name:"Sentadilla búlgara",type:"pesas"},{name:"Extensiones cuádriceps",type:"pesas"},{name:"Curl femoral",type:"pesas"},{name:"Pantorrillas",type:"pesas"}]
    ],
    labels:["Upper A","Lower A","Upper B","Lower B"]
  },
  pplul_5:{
    exercises:[
      [{name:"Press banca",type:"pesas"},{name:"Press inclinado",type:"pesas"},{name:"Press militar",type:"pesas"},{name:"Elevaciones laterales",type:"pesas"},{name:"Tríceps en polea",type:"pesas"},{name:"Press francés",type:"pesas"}],
      [{name:"Jalón al pecho",type:"pesas"},{name:"Remo con barra",type:"pesas"},{name:"Face pull",type:"pesas"},{name:"Curl con barra",type:"pesas"},{name:"Curl martillo",type:"pesas"}],
      [{name:"Sentadilla",type:"pesas"},{name:"Prensa de pierna",type:"pesas"},{name:"Peso muerto rumano",type:"pesas"},{name:"Curl femoral",type:"pesas"},{name:"Pantorrillas",type:"pesas"},{name:"Hip thrust",type:"pesas"}],
      [{name:"Press inclinado",type:"pesas"},{name:"Jalón al pecho",type:"pesas"},{name:"Press Arnold",type:"pesas"},{name:"Curl con barra",type:"pesas"},{name:"Tríceps en polea",type:"pesas"},{name:"Elevaciones laterales",type:"pesas"}],
      [{name:"Sentadilla búlgara",type:"pesas"},{name:"Extensiones cuádriceps",type:"pesas"},{name:"Curl femoral",type:"pesas"},{name:"Hip thrust",type:"pesas"},{name:"Pantorrillas",type:"pesas"}]
    ],
    labels:["Push","Pull","Legs","Upper","Lower"]
  },
  ppl_6:{
    exercises:[
      [{name:"Press banca",type:"pesas"},{name:"Press inclinado",type:"pesas"},{name:"Aperturas mancuernas",type:"pesas"},{name:"Press militar",type:"pesas"},{name:"Elevaciones laterales",type:"pesas"},{name:"Tríceps en polea",type:"pesas"}],
      [{name:"Jalón al pecho",type:"pesas"},{name:"Remo con barra",type:"pesas"},{name:"Remo con mancuerna",type:"pesas"},{name:"Face pull",type:"pesas"},{name:"Curl con barra",type:"pesas"},{name:"Curl martillo",type:"pesas"}],
      [{name:"Sentadilla",type:"pesas"},{name:"Prensa de pierna",type:"pesas"},{name:"Peso muerto rumano",type:"pesas"},{name:"Curl femoral",type:"pesas"},{name:"Hip thrust",type:"pesas"},{name:"Pantorrillas",type:"pesas"}],
      [{name:"Press inclinado",type:"pesas"},{name:"Aperturas en polea",type:"pesas"},{name:"Press Arnold",type:"pesas"},{name:"Elevaciones frontales",type:"pesas"},{name:"Press francés",type:"pesas"},{name:"Fondos en banco",type:"pesas"}],
      [{name:"Dominadas",type:"pesas"},{name:"Remo en polea baja",type:"pesas"},{name:"Pájaros",type:"pesas"},{name:"Curl con mancuernas",type:"pesas"},{name:"Curl predicador",type:"pesas"}],
      [{name:"Sentadilla frontal",type:"pesas"},{name:"Zancadas",type:"pesas"},{name:"Extensiones cuádriceps",type:"pesas"},{name:"Curl femoral",type:"pesas"},{name:"Pantorrillas",type:"pesas"},{name:"Abductores en máquina",type:"pesas"}]
    ],
    labels:["Push","Pull","Legs","Push","Pull","Legs"]
  }
};

function selectTemplate(numDays){
  if(numDays<=3)return'fullbody_3';
  if(numDays===4)return'upperlower_4';
  if(numDays===5)return'pplul_5';
  return'ppl_6';
}

function getDaysWarning(experience,numDays){
  if(experience==='principiante'&&numDays>=5)return'La ciencia recomienda 3-4 días para principiantes. La recuperación es clave para crecer.';
  if(experience==='intermedio'&&numDays>=6)return'Para tu nivel, 4-5 días es lo óptimo. Más no siempre es mejor.';
  return null;
}

function goalToObjective(goal){
  if(goal==='musculo')return'hipertrofia';
  if(goal==='fuerza')return'fuerza';
  if(goal==='grasa')return'resistencia';
  return'hipertrofia';
}

// Build routine from template + selected days
function buildRoutineFromWizard(templateKey,selectedDays){
  const tmpl=ROUTINE_TEMPLATES[templateKey];
  const allDK=["lunes","martes","miercoles","jueves","viernes","sabado","domingo"];
  const DLshort={lunes:"Lunes",martes:"Martes",miercoles:"Miércoles",jueves:"Jueves",viernes:"Viernes",sabado:"Sábado",domingo:"Domingo"};
  const routine={};
  let exIdx=0;
  allDK.forEach(dk=>{
    if(selectedDays.includes(dk)&&exIdx<tmpl.exercises.length){
      routine[dk]={label:tmpl.labels[exIdx],rest:false,exercises:[...tmpl.exercises[exIdx]]};
      exIdx++;
    } else {
      routine[dk]={label:"Descanso",rest:true,exercises:[]};
    }
  });
  return routine;
}

// ── Wizard State ──
let wizardStep=1;
let wizardData={goal:null,experience:null,selectedDays:[]};

function showWizard(){
  // Warn if user already has a routine with exercises
  const hasExisting=Object.values(db.routine).some(d=>d.exercises?.length>0);
  if(hasExisting&&localStorage.getItem('gym_onboarded')){
    if(!confirm('Esto reemplazará tu rutina actual. ¿Continuar?'))return;
  }
  wizardStep=1;wizardData={goal:null,experience:null,selectedDays:[]};
  document.getElementById('wizard-overlay').style.display='flex';
  renderWizardStep();
}
function hideWizard(){
  document.getElementById('wizard-overlay').style.display='none';
}

function renderWizardStep(){
  const container=document.getElementById('wizard-content');
  const dots=document.getElementById('wizard-dots');
  dots.innerHTML=[1,2,3].map(n=>`<span class="wiz-dot ${n===wizardStep?'active':''}${n<wizardStep?' done':''}"></span>`).join('');

  if(wizardStep===1){
    container.innerHTML=`
      <div class="wiz-title">¿Cuál es tu objetivo?</div>
      <div class="wiz-subtitle">Esto define tus sets y repeticiones</div>
      <div class="wiz-options">
        <div class="wiz-opt ${wizardData.goal==='musculo'?'active':''}" onclick="wizSelect('goal','musculo')">
          <span class="wiz-emoji">💪</span>
          <div><span class="wiz-opt-title">Ganar músculo</span><span class="wiz-opt-desc">Hipertrofia · 8-12 reps</span></div>
        </div>
        <div class="wiz-opt ${wizardData.goal==='fuerza'?'active':''}" onclick="wizSelect('goal','fuerza')">
          <span class="wiz-emoji">🏋️</span>
          <div><span class="wiz-opt-title">Ganar fuerza</span><span class="wiz-opt-desc">Fuerza máxima · 3-6 reps</span></div>
        </div>
        <div class="wiz-opt ${wizardData.goal==='grasa'?'active':''}" onclick="wizSelect('goal','grasa')">
          <span class="wiz-emoji">🔥</span>
          <div><span class="wiz-opt-title">Perder grasa</span><span class="wiz-opt-desc">Resistencia · 12-15 reps</span></div>
        </div>
        <div class="wiz-opt ${wizardData.goal==='general'?'active':''}" onclick="wizSelect('goal','general')">
          <span class="wiz-emoji">⚡</span>
          <div><span class="wiz-opt-title">Estar en forma</span><span class="wiz-opt-desc">General · 8-12 reps</span></div>
        </div>
      </div>`;
  } else if(wizardStep===2){
    container.innerHTML=`
      <div class="wiz-title">¿Cuánta experiencia tienes?</div>
      <div class="wiz-subtitle">Adaptamos la rutina a tu nivel</div>
      <div class="wiz-options">
        <div class="wiz-opt ${wizardData.experience==='principiante'?'active':''}" onclick="wizSelect('experience','principiante')">
          <span class="wiz-emoji">🌱</span>
          <div><span class="wiz-opt-title">Nunca he entrenado</span><span class="wiz-opt-desc">Principiante</span></div>
        </div>
        <div class="wiz-opt ${wizardData.experience==='intermedio'?'active':''}" onclick="wizSelect('experience','intermedio')">
          <span class="wiz-emoji">🔄</span>
          <div><span class="wiz-opt-title">Menos de 1 año</span><span class="wiz-opt-desc">Intermedio</span></div>
        </div>
        <div class="wiz-opt ${wizardData.experience==='avanzado'?'active':''}" onclick="wizSelect('experience','avanzado')">
          <span class="wiz-emoji">🏆</span>
          <div><span class="wiz-opt-title">Más de 1 año</span><span class="wiz-opt-desc">Avanzado</span></div>
        </div>
      </div>`;
  } else if(wizardStep===3){
    const warning=wizardData.selectedDays.length?getDaysWarning(wizardData.experience,wizardData.selectedDays.length):null;
    const allDays=[
      {key:"lunes",label:"L"},{key:"martes",label:"M"},{key:"miercoles",label:"X"},
      {key:"jueves",label:"J"},{key:"viernes",label:"V"},{key:"sabado",label:"S"},{key:"domingo",label:"D"}
    ];
    container.innerHTML=`
      <div class="wiz-title">¿Qué días entrenas?</div>
      <div class="wiz-subtitle">Toca los días disponibles</div>
      <div class="wiz-day-picker">
        ${allDays.map(d=>`<div class="wiz-day-btn ${wizardData.selectedDays.includes(d.key)?'active':''}" onclick="toggleWizDay('${d.key}')">${d.label}</div>`).join('')}
      </div>
      <div class="wiz-day-count">${wizardData.selectedDays.length} días seleccionados</div>
      ${warning?`<div class="wiz-warning">${warning}</div>`:''}
      ${wizardData.selectedDays.length>=3?`<button class="sbtn" onclick="showWizardResult()" style="margin-top:16px">CONTINUAR</button>`:'<div class="wiz-warning" style="border-color:var(--border2);color:var(--muted2);background:var(--card2)">Selecciona al menos 3 días</div>'}`;
  }
}

function wizSelect(key,value){
  wizardData[key]=value;
  renderWizardStep();
  setTimeout(()=>{if(wizardStep<3){wizardStep++;renderWizardStep();}},300);
}

function toggleWizDay(dk){
  const idx=wizardData.selectedDays.indexOf(dk);
  if(idx>=0)wizardData.selectedDays.splice(idx,1);
  else if(wizardData.selectedDays.length<6)wizardData.selectedDays.push(dk);
  // Keep sorted by week order
  const order=["lunes","martes","miercoles","jueves","viernes","sabado","domingo"];
  wizardData.selectedDays.sort((a,b)=>order.indexOf(a)-order.indexOf(b));
  renderWizardStep();
}

function showWizardResult(){
  const numDays=wizardData.selectedDays.length;
  const templateKey=selectTemplate(numDays);
  const routine=buildRoutineFromWizard(templateKey,wizardData.selectedDays);
  const container=document.getElementById('wizard-content');
  document.getElementById('wizard-dots').innerHTML='';

  const splitName=numDays<=3?'Full Body':numDays===4?'Upper / Lower':numDays===5?'PPLUL':'Push / Pull / Legs';
  const dl={lunes:"Lun",martes:"Mar",miercoles:"Mié",jueves:"Jue",viernes:"Vie",sabado:"Sáb",domingo:"Dom"};
  const allDK=["lunes","martes","miercoles","jueves","viernes","sabado","domingo"];

  let preview=allDK.map(dk=>{
    const day=routine[dk];
    if(day.rest)return`<div class="wiz-day-preview rest"><span class="wiz-dp-day">${dl[dk]}</span><span class="wiz-dp-label">Descanso</span></div>`;
    return`<div class="wiz-day-preview"><span class="wiz-dp-day">${dl[dk]}</span><span class="wiz-dp-label">${day.label}</span><span class="wiz-dp-count">${day.exercises.length} ej.</span></div>`;
  }).join('');

  container.innerHTML=`
    <div class="wiz-title">Tu rutina está lista</div>
    <div class="wiz-subtitle">${numDays} días · ${splitName}</div>
    <div class="wiz-preview">${preview}</div>
    <div class="wiz-result-actions">
      <button class="sbtn" onclick="applyWizardRoutine()">EMPEZAR</button>
      <button class="wiz-customize-btn" onclick="applyWizardRoutine(true)">PERSONALIZAR</button>
    </div>`;
}

function applyWizardRoutine(customize){
  const numDays=wizardData.selectedDays.length;
  const templateKey=selectTemplate(numDays);
  const routine=buildRoutineFromWizard(templateKey,wizardData.selectedDays);

  db.routine=routine;
  ps('gym_routine',db.routine);
  db.objective=goalToObjective(wizardData.goal);
  ps('gym_objective',db.objective);
  localStorage.setItem('gym_onboarded','true');

  hideWizard();
  renderHeader();renderObj();renderHoy();

  if(customize){
    document.querySelector('.ni:nth-child(4)').click();
    setTimeout(()=>toggleDrop('rutina-section'),300);
  } else {
    toast('Rutina creada ✓');
  }
}

function checkOnboarding(){
  if(!localStorage.getItem('gym_onboarded')&&!db.sessions.length){
    showWizard();
  }
}
