// ── ONBOARDING WIZARD ──
// 3-step wizard that generates a personalized routine

const ROUTINE_TEMPLATES={
  // ── FULL BODY 3 DÍAS ──
  fullbody_3:{
    lunes:{label:"Full Body A",rest:false,exercises:[
      {name:"Sentadilla",type:"pesas"},{name:"Press banca",type:"pesas"},
      {name:"Remo con barra",type:"pesas"},{name:"Press militar",type:"pesas"},
      {name:"Curl con barra",type:"pesas"},{name:"Tríceps en polea",type:"pesas"}
    ]},
    martes:{label:"Descanso",rest:true,exercises:[]},
    miercoles:{label:"Full Body B",rest:false,exercises:[
      {name:"Peso muerto rumano",type:"pesas"},{name:"Press inclinado",type:"pesas"},
      {name:"Jalón al pecho",type:"pesas"},{name:"Elevaciones laterales",type:"pesas"},
      {name:"Curl martillo",type:"pesas"},{name:"Press francés",type:"pesas"}
    ]},
    jueves:{label:"Descanso",rest:true,exercises:[]},
    viernes:{label:"Full Body A",rest:false,exercises:[
      {name:"Sentadilla",type:"pesas"},{name:"Press banca",type:"pesas"},
      {name:"Remo con barra",type:"pesas"},{name:"Press militar",type:"pesas"},
      {name:"Curl con barra",type:"pesas"},{name:"Tríceps en polea",type:"pesas"}
    ]},
    sabado:{label:"Descanso",rest:true,exercises:[]},
    domingo:{label:"Descanso",rest:true,exercises:[]}
  },

  // ── UPPER/LOWER 4 DÍAS ──
  upperlower_4:{
    lunes:{label:"Upper A",rest:false,exercises:[
      {name:"Press banca",type:"pesas"},{name:"Remo con barra",type:"pesas"},
      {name:"Press militar",type:"pesas"},{name:"Curl con barra",type:"pesas"},
      {name:"Tríceps en polea",type:"pesas"},{name:"Elevaciones laterales",type:"pesas"}
    ]},
    martes:{label:"Lower A",rest:false,exercises:[
      {name:"Sentadilla",type:"pesas"},{name:"Prensa de pierna",type:"pesas"},
      {name:"Curl femoral",type:"pesas"},{name:"Pantorrillas",type:"pesas"},
      {name:"Hip thrust",type:"pesas"}
    ]},
    miercoles:{label:"Descanso",rest:true,exercises:[]},
    jueves:{label:"Upper B",rest:false,exercises:[
      {name:"Press inclinado",type:"pesas"},{name:"Jalón al pecho",type:"pesas"},
      {name:"Press Arnold",type:"pesas"},{name:"Curl martillo",type:"pesas"},
      {name:"Press francés",type:"pesas"},{name:"Face pull",type:"pesas"}
    ]},
    viernes:{label:"Lower B",rest:false,exercises:[
      {name:"Peso muerto rumano",type:"pesas"},{name:"Sentadilla búlgara",type:"pesas"},
      {name:"Extensiones cuádriceps",type:"pesas"},{name:"Curl femoral",type:"pesas"},
      {name:"Pantorrillas",type:"pesas"}
    ]},
    sabado:{label:"Descanso",rest:true,exercises:[]},
    domingo:{label:"Descanso",rest:true,exercises:[]}
  },

  // ── PPLUL 5 DÍAS ──
  pplul_5:{
    lunes:{label:"Push",rest:false,exercises:[
      {name:"Press banca",type:"pesas"},{name:"Press inclinado",type:"pesas"},
      {name:"Press militar",type:"pesas"},{name:"Elevaciones laterales",type:"pesas"},
      {name:"Tríceps en polea",type:"pesas"},{name:"Press francés",type:"pesas"}
    ]},
    martes:{label:"Pull",rest:false,exercises:[
      {name:"Jalón al pecho",type:"pesas"},{name:"Remo con barra",type:"pesas"},
      {name:"Face pull",type:"pesas"},{name:"Curl con barra",type:"pesas"},
      {name:"Curl martillo",type:"pesas"}
    ]},
    miercoles:{label:"Legs",rest:false,exercises:[
      {name:"Sentadilla",type:"pesas"},{name:"Prensa de pierna",type:"pesas"},
      {name:"Peso muerto rumano",type:"pesas"},{name:"Curl femoral",type:"pesas"},
      {name:"Pantorrillas",type:"pesas"},{name:"Hip thrust",type:"pesas"}
    ]},
    jueves:{label:"Upper",rest:false,exercises:[
      {name:"Press inclinado",type:"pesas"},{name:"Jalón al pecho",type:"pesas"},
      {name:"Press Arnold",type:"pesas"},{name:"Curl con barra",type:"pesas"},
      {name:"Tríceps en polea",type:"pesas"},{name:"Elevaciones laterales",type:"pesas"}
    ]},
    viernes:{label:"Lower",rest:false,exercises:[
      {name:"Sentadilla búlgara",type:"pesas"},{name:"Extensiones cuádriceps",type:"pesas"},
      {name:"Curl femoral",type:"pesas"},{name:"Hip thrust",type:"pesas"},
      {name:"Pantorrillas",type:"pesas"}
    ]},
    sabado:{label:"Descanso",rest:true,exercises:[]},
    domingo:{label:"Descanso",rest:true,exercises:[]}
  },

  // ── PPL x2 — 6 DÍAS ──
  ppl_6:{
    lunes:{label:"Push",rest:false,exercises:[
      {name:"Press banca",type:"pesas"},{name:"Press inclinado",type:"pesas"},
      {name:"Aperturas mancuernas",type:"pesas"},{name:"Press militar",type:"pesas"},
      {name:"Elevaciones laterales",type:"pesas"},{name:"Tríceps en polea",type:"pesas"}
    ]},
    martes:{label:"Pull",rest:false,exercises:[
      {name:"Jalón al pecho",type:"pesas"},{name:"Remo con barra",type:"pesas"},
      {name:"Remo con mancuerna",type:"pesas"},{name:"Face pull",type:"pesas"},
      {name:"Curl con barra",type:"pesas"},{name:"Curl martillo",type:"pesas"}
    ]},
    miercoles:{label:"Legs",rest:false,exercises:[
      {name:"Sentadilla",type:"pesas"},{name:"Prensa de pierna",type:"pesas"},
      {name:"Peso muerto rumano",type:"pesas"},{name:"Curl femoral",type:"pesas"},
      {name:"Hip thrust",type:"pesas"},{name:"Pantorrillas",type:"pesas"}
    ]},
    jueves:{label:"Push",rest:false,exercises:[
      {name:"Press inclinado",type:"pesas"},{name:"Aperturas en polea",type:"pesas"},
      {name:"Press Arnold",type:"pesas"},{name:"Elevaciones frontales",type:"pesas"},
      {name:"Press francés",type:"pesas"},{name:"Fondos en banco",type:"pesas"}
    ]},
    viernes:{label:"Pull",rest:false,exercises:[
      {name:"Dominadas",type:"pesas"},{name:"Remo en polea baja",type:"pesas"},
      {name:"Pájaros",type:"pesas"},{name:"Curl con mancuernas",type:"pesas"},
      {name:"Curl predicador",type:"pesas"}
    ]},
    sabado:{label:"Legs",rest:false,exercises:[
      {name:"Sentadilla frontal",type:"pesas"},{name:"Zancadas",type:"pesas"},
      {name:"Extensiones cuádriceps",type:"pesas"},{name:"Curl femoral",type:"pesas"},
      {name:"Pantorrillas",type:"pesas"},{name:"Abductores en máquina",type:"pesas"}
    ]},
    domingo:{label:"Descanso",rest:true,exercises:[]}
  }
};

// Maps goal+experience+days → template key
function selectTemplate(experience,days){
  if(days<=3)return'fullbody_3';
  if(days===4)return'upperlower_4';
  if(days===5)return'pplul_5';
  return'ppl_6';
}

// Check if days is recommended for experience level
function getDaysWarning(experience,days){
  if(experience==='principiante'&&days>=5)return'La ciencia recomienda 3-4 días para principiantes. La recuperación es clave para crecer.';
  if(experience==='intermedio'&&days>=6)return'Para tu nivel, 4-5 días es lo óptimo. Más no siempre es mejor.';
  return null;
}

// Map goal to objective key
function goalToObjective(goal){
  if(goal==='musculo')return'hipertrofia';
  if(goal==='fuerza')return'fuerza';
  if(goal==='grasa')return'resistencia';
  return'hipertrofia';
}

// ── Wizard State ──
let wizardStep=1;
let wizardData={goal:null,experience:null,days:null};

function showWizard(){
  wizardStep=1;wizardData={goal:null,experience:null,days:null};
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
          <span class="wiz-opt-title">Ganar músculo</span>
          <span class="wiz-opt-desc">Hipertrofia · 8-12 reps</span>
        </div>
        <div class="wiz-opt ${wizardData.goal==='fuerza'?'active':''}" onclick="wizSelect('goal','fuerza')">
          <span class="wiz-emoji">🏋️</span>
          <span class="wiz-opt-title">Ganar fuerza</span>
          <span class="wiz-opt-desc">Fuerza máxima · 3-6 reps</span>
        </div>
        <div class="wiz-opt ${wizardData.goal==='grasa'?'active':''}" onclick="wizSelect('goal','grasa')">
          <span class="wiz-emoji">🔥</span>
          <span class="wiz-opt-title">Perder grasa</span>
          <span class="wiz-opt-desc">Resistencia · 12-15 reps</span>
        </div>
        <div class="wiz-opt ${wizardData.goal==='general'?'active':''}" onclick="wizSelect('goal','general')">
          <span class="wiz-emoji">⚡</span>
          <span class="wiz-opt-title">Estar en forma</span>
          <span class="wiz-opt-desc">General · 8-12 reps</span>
        </div>
      </div>`;
  } else if(wizardStep===2){
    container.innerHTML=`
      <div class="wiz-title">¿Cuánta experiencia tienes?</div>
      <div class="wiz-subtitle">Adaptamos la rutina a tu nivel</div>
      <div class="wiz-options">
        <div class="wiz-opt ${wizardData.experience==='principiante'?'active':''}" onclick="wizSelect('experience','principiante')">
          <span class="wiz-emoji">🌱</span>
          <span class="wiz-opt-title">Nunca he entrenado</span>
          <span class="wiz-opt-desc">Principiante · Full Body</span>
        </div>
        <div class="wiz-opt ${wizardData.experience==='intermedio'?'active':''}" onclick="wizSelect('experience','intermedio')">
          <span class="wiz-emoji">🔄</span>
          <span class="wiz-opt-title">Menos de 1 año</span>
          <span class="wiz-opt-desc">Intermedio · Upper/Lower</span>
        </div>
        <div class="wiz-opt ${wizardData.experience==='avanzado'?'active':''}" onclick="wizSelect('experience','avanzado')">
          <span class="wiz-emoji">🏆</span>
          <span class="wiz-opt-title">Más de 1 año</span>
          <span class="wiz-opt-desc">Avanzado · Push/Pull/Legs</span>
        </div>
      </div>`;
  } else if(wizardStep===3){
    const warning=wizardData.days?getDaysWarning(wizardData.experience,wizardData.days):null;
    container.innerHTML=`
      <div class="wiz-title">¿Cuántos días puedes entrenar?</div>
      <div class="wiz-subtitle">Elige los días que puedas mantener</div>
      <div class="wiz-options wiz-days">
        ${[3,4,5,6].map(d=>`<div class="wiz-day ${wizardData.days===d?'active':''}" onclick="wizSelect('days',${d})">
          <span class="wiz-day-num">${d}</span>
          <span class="wiz-day-lbl">días</span>
        </div>`).join('')}
      </div>
      ${warning?`<div class="wiz-warning">${warning}</div>`:''}`;
  }
}

function wizSelect(key,value){
  wizardData[key]=value;
  renderWizardStep();
  // Auto-advance after short delay
  setTimeout(()=>{
    if(wizardStep<3){wizardStep++;renderWizardStep();}
    else{showWizardResult();}
  },300);
}

function showWizardResult(){
  const templateKey=selectTemplate(wizardData.experience,wizardData.days);
  const template=ROUTINE_TEMPLATES[templateKey];
  const container=document.getElementById('wizard-content');
  document.getElementById('wizard-dots').innerHTML='';

  // Count training days
  const trainingDays=Object.values(template).filter(d=>!d.rest).length;

  let preview='';
  const dkOrder=["lunes","martes","miercoles","jueves","viernes","sabado","domingo"];
  dkOrder.forEach(dk=>{
    const day=template[dk];
    const dl={lunes:"Lun",martes:"Mar",miercoles:"Mié",jueves:"Jue",viernes:"Vie",sabado:"Sáb",domingo:"Dom"};
    if(day.rest){
      preview+=`<div class="wiz-day-preview rest"><span class="wiz-dp-day">${dl[dk]}</span><span class="wiz-dp-label">Descanso</span></div>`;
    } else {
      preview+=`<div class="wiz-day-preview"><span class="wiz-dp-day">${dl[dk]}</span><span class="wiz-dp-label">${day.label}</span><span class="wiz-dp-count">${day.exercises.length} ej.</span></div>`;
    }
  });

  container.innerHTML=`
    <div class="wiz-title">Tu rutina está lista</div>
    <div class="wiz-subtitle">${trainingDays} días · ${templateKey.includes('full')?'Full Body':templateKey.includes('upper')?'Upper/Lower':templateKey.includes('pplul')?'PPLUL':'Push/Pull/Legs'}</div>
    <div class="wiz-preview">${preview}</div>
    <div class="wiz-result-actions">
      <button class="sbtn" onclick="applyWizardRoutine()">EMPEZAR</button>
      <button class="wiz-customize-btn" onclick="applyWizardRoutine(true)">PERSONALIZAR</button>
    </div>`;
}

function applyWizardRoutine(customize){
  const templateKey=selectTemplate(wizardData.experience,wizardData.days);
  const template=ROUTINE_TEMPLATES[templateKey];

  // Apply routine
  db.routine=JSON.parse(JSON.stringify(template));
  ps('gym_routine',db.routine);

  // Apply objective
  db.objective=goalToObjective(wizardData.goal);
  ps('gym_objective',db.objective);

  // Mark onboarded
  localStorage.setItem('gym_onboarded','true');

  hideWizard();
  renderHeader();renderObj();renderHoy();

  if(customize){
    // Switch to profile and open rutina
    document.querySelector('.ni:nth-child(4)').click();
    setTimeout(()=>toggleDrop('rutina-section'),300);
  } else {
    toast('Rutina creada ✓');
  }
}

// Check if should show wizard on load
function checkOnboarding(){
  if(!localStorage.getItem('gym_onboarded')&&!db.sessions.length){
    showWizard();
  }
}
