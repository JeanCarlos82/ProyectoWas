// ── ONBOARDING WIZARD ──

// ── TEMPLATES MASCULINOS ──
// Enfoque: compuestos pesados como base, progresión de fuerza,
// equilibrio push/pull, piernas 2x/semana mínimo
const TEMPLATES_M={
  // 3 días: Full body — compuestos + máquinas de aislamiento
  fullbody_3:{
    exercises:[
      [{name:"Sentadilla",type:"pesas"},{name:"Press banca",type:"pesas"},{name:"Remo con barra",type:"pesas"},{name:"Press militar",type:"pesas"},{name:"Curl con barra",type:"pesas"},{name:"Tríceps en polea",type:"pesas"}],
      [{name:"Peso muerto rumano",type:"pesas"},{name:"Press inclinado",type:"pesas"},{name:"Jalón al pecho",type:"pesas"},{name:"Elevaciones laterales",type:"pesas"},{name:"Curl martillo",type:"pesas"},{name:"Press francés",type:"pesas"}],
      [{name:"Prensa de pierna",type:"pesas"},{name:"Press con mancuernas",type:"pesas"},{name:"Remo en máquina",type:"pesas"},{name:"Press Arnold",type:"pesas"},{name:"Face pull",type:"pesas"},{name:"Plancha",type:"pesas"}]
    ],labels:["Full Body A","Full Body B","Full Body C"]
  },
  fullbody_cardio_3:{
    exercises:[
      [{name:"Sentadilla",type:"pesas"},{name:"Press banca",type:"pesas"},{name:"Remo en máquina",type:"pesas"},{name:"Press militar",type:"pesas"},{name:"Plancha",type:"pesas"}],
      [{name:"Correr",type:"cardio"},{name:"Elíptica",type:"cardio"}],
      [{name:"Peso muerto rumano",type:"pesas"},{name:"Press inclinado",type:"pesas"},{name:"Jalón al pecho",type:"pesas"},{name:"Elevaciones laterales",type:"pesas"},{name:"Crunch",type:"pesas"}]
    ],labels:["Full Body","Cardio","Full Body"]
  },
  // 4 días: Upper/Lower — máquinas para aislamiento, peso libre para compuestos
  upperlower_4:{
    exercises:[
      [{name:"Press banca",type:"pesas"},{name:"Remo con barra",type:"pesas"},{name:"Press militar",type:"pesas"},{name:"Curl con barra",type:"pesas"},{name:"Tríceps en polea",type:"pesas"},{name:"Elevaciones laterales",type:"pesas"}],
      [{name:"Sentadilla",type:"pesas"},{name:"Peso muerto rumano",type:"pesas"},{name:"Prensa de pierna",type:"pesas"},{name:"Curl femoral sentado",type:"pesas"},{name:"Pantorrillas en prensa",type:"pesas"},{name:"Plancha",type:"pesas"}],
      [{name:"Press inclinado",type:"pesas"},{name:"Jalón al pecho",type:"pesas"},{name:"Press Arnold",type:"pesas"},{name:"Curl martillo",type:"pesas"},{name:"Tríceps en máquina",type:"pesas"},{name:"Face pull",type:"pesas"}],
      [{name:"Sentadilla búlgara",type:"pesas"},{name:"Hip thrust",type:"pesas"},{name:"Extensiones cuádriceps",type:"pesas"},{name:"Curl femoral",type:"pesas"},{name:"Pantorrillas",type:"pesas"},{name:"Elevación de piernas",type:"pesas"}]
    ],labels:["Upper A","Lower A","Upper B","Lower B"]
  },
  // 5 días: PPL + Upper/Lower — mix peso libre y máquinas
  pplul_5:{
    exercises:[
      [{name:"Press banca",type:"pesas"},{name:"Press inclinado",type:"pesas"},{name:"Contractor de pecho",type:"pesas"},{name:"Press militar",type:"pesas"},{name:"Elevaciones laterales",type:"pesas"},{name:"Tríceps en polea",type:"pesas"}],
      [{name:"Jalón al pecho",type:"pesas"},{name:"Remo con barra",type:"pesas"},{name:"Remo en máquina",type:"pesas"},{name:"Face pull",type:"pesas"},{name:"Curl con barra",type:"pesas"},{name:"Curl martillo",type:"pesas"}],
      [{name:"Sentadilla",type:"pesas"},{name:"Prensa de pierna",type:"pesas"},{name:"Peso muerto rumano",type:"pesas"},{name:"Curl femoral sentado",type:"pesas"},{name:"Hip thrust",type:"pesas"},{name:"Pantorrillas en prensa",type:"pesas"}],
      [{name:"Press inclinado",type:"pesas"},{name:"Jalón al pecho",type:"pesas"},{name:"Press de hombro en máquina",type:"pesas"},{name:"Curl en máquina",type:"pesas"},{name:"Tríceps en máquina",type:"pesas"},{name:"Elevaciones laterales en máquina",type:"pesas"}],
      [{name:"Sentadilla búlgara",type:"pesas"},{name:"Extensiones cuádriceps",type:"pesas"},{name:"Curl femoral",type:"pesas"},{name:"Hip thrust",type:"pesas"},{name:"Pantorrillas",type:"pesas"},{name:"Plancha",type:"pesas"}]
    ],labels:["Push","Pull","Legs","Upper","Lower"]
  },
  // 6 días: PPL x2 — día 1 peso libre, día 2 más máquinas (variedad de estímulo)
  ppl_6:{
    exercises:[
      [{name:"Press banca",type:"pesas"},{name:"Press inclinado",type:"pesas"},{name:"Aperturas mancuernas",type:"pesas"},{name:"Press militar",type:"pesas"},{name:"Elevaciones laterales",type:"pesas"},{name:"Tríceps en polea",type:"pesas"}],
      [{name:"Dominadas",type:"pesas"},{name:"Remo con barra",type:"pesas"},{name:"Remo con mancuerna",type:"pesas"},{name:"Face pull",type:"pesas"},{name:"Curl con barra",type:"pesas"},{name:"Curl martillo",type:"pesas"}],
      [{name:"Sentadilla",type:"pesas"},{name:"Prensa de pierna",type:"pesas"},{name:"Peso muerto rumano",type:"pesas"},{name:"Curl femoral sentado",type:"pesas"},{name:"Hip thrust",type:"pesas"},{name:"Pantorrillas",type:"pesas"}],
      [{name:"Press inclinado en máquina",type:"pesas"},{name:"Contractor de pecho",type:"pesas"},{name:"Press de hombro en máquina",type:"pesas"},{name:"Elevaciones laterales en máquina",type:"pesas"},{name:"Tríceps en máquina",type:"pesas"},{name:"Press francés",type:"pesas"}],
      [{name:"Pulldown en máquina",type:"pesas"},{name:"Remo en máquina",type:"pesas"},{name:"Remo T-bar",type:"pesas"},{name:"Curl en máquina",type:"pesas"},{name:"Curl predicador",type:"pesas"},{name:"Face pull",type:"pesas"}],
      [{name:"Hack squat",type:"pesas"},{name:"Zancadas",type:"pesas"},{name:"Extensiones cuádriceps",type:"pesas"},{name:"Curl femoral",type:"pesas"},{name:"Pantorrillas en prensa",type:"pesas"},{name:"Crunch en máquina",type:"pesas"}]
    ],labels:["Push Libre","Pull Libre","Legs Libre","Push Máquinas","Pull Máquinas","Legs Máquinas"]
  }
};

// ── TEMPLATES FEMENINOS ──
// Basado en evidencia: glúteos 2-3x/semana, más lower que upper,
// hip thrust como movimiento principal, ejercicios unilaterales para
// estabilidad de cadera, cardio con Stairmaster para activar glúteos.
// Las mujeres recuperan más rápido (24-48h vs 48-72h hombres) permitiendo
// mayor frecuencia de glúteos.
const TEMPLATES_F={
  // 3 días: Full body con prioridad glúteos + máquinas de aislamiento
  fullbody_3:{
    exercises:[
      [{name:"Hip thrust",type:"pesas"},{name:"Sentadilla",type:"pesas"},{name:"Press con mancuernas",type:"pesas"},{name:"Jalón al pecho",type:"pesas"},{name:"Abductores en máquina",type:"pesas"},{name:"Plancha",type:"pesas"}],
      [{name:"Peso muerto rumano",type:"pesas"},{name:"Zancadas",type:"pesas"},{name:"Remo en máquina",type:"pesas"},{name:"Press de hombro en máquina",type:"pesas"},{name:"Patada de glúteo en máquina",type:"pesas"},{name:"Elevación de piernas",type:"pesas"}],
      [{name:"Prensa de pierna",type:"pesas"},{name:"Puente de glúteo",type:"pesas"},{name:"Press con mancuernas",type:"pesas"},{name:"Remo en polea baja",type:"pesas"},{name:"Curl femoral sentado",type:"pesas"},{name:"Crunch",type:"pesas"}]
    ],labels:["Full Body A","Full Body B","Full Body C"]
  },
  fullbody_cardio_3:{
    exercises:[
      [{name:"Hip thrust",type:"pesas"},{name:"Sentadilla",type:"pesas"},{name:"Jalón al pecho",type:"pesas"},{name:"Press con mancuernas",type:"pesas"},{name:"Abductores en máquina",type:"pesas"},{name:"Plancha",type:"pesas"}],
      [{name:"Stairmaster",type:"cardio"},{name:"Elíptica",type:"cardio"}],
      [{name:"Peso muerto rumano",type:"pesas"},{name:"Prensa de pierna",type:"pesas"},{name:"Remo en máquina",type:"pesas"},{name:"Press de hombro en máquina",type:"pesas"},{name:"Patada de glúteo en máquina",type:"pesas"},{name:"Elevación de piernas",type:"pesas"}]
    ],labels:["Full Body","Cardio","Full Body"]
  },
  // 4 días: 2 lower + 2 upper — máquinas integradas
  upperlower_4:{
    exercises:[
      [{name:"Hip thrust",type:"pesas"},{name:"Sentadilla",type:"pesas"},{name:"Curl femoral sentado",type:"pesas"},{name:"Abductores en máquina",type:"pesas"},{name:"Patada de glúteo en máquina",type:"pesas"},{name:"Plancha",type:"pesas"}],
      [{name:"Press con mancuernas",type:"pesas"},{name:"Jalón al pecho",type:"pesas"},{name:"Press de hombro en máquina",type:"pesas"},{name:"Remo en máquina",type:"pesas"},{name:"Elevaciones laterales",type:"pesas"},{name:"Tríceps en polea",type:"pesas"}],
      [{name:"Peso muerto rumano",type:"pesas"},{name:"Prensa de pierna",type:"pesas"},{name:"Extensiones cuádriceps",type:"pesas"},{name:"Puente de glúteo",type:"pesas"},{name:"Pantorrillas en prensa",type:"pesas"},{name:"Elevación de piernas",type:"pesas"}],
      [{name:"Press inclinado",type:"pesas"},{name:"Remo en polea baja",type:"pesas"},{name:"Face pull",type:"pesas"},{name:"Curl con mancuernas",type:"pesas"},{name:"Elevaciones laterales en máquina",type:"pesas"},{name:"Crunch",type:"pesas"}]
    ],labels:["Glúteos & Piernas A","Upper A","Glúteos & Piernas B","Upper B"]
  },
  // 5 días: 3 lower + 2 upper — glúteos 3x/semana con variedad máquina/libre
  pplul_5:{
    exercises:[
      [{name:"Hip thrust",type:"pesas"},{name:"Sentadilla",type:"pesas"},{name:"Curl femoral sentado",type:"pesas"},{name:"Abductores en máquina",type:"pesas"},{name:"Patada de glúteo en máquina",type:"pesas"},{name:"Plancha",type:"pesas"}],
      [{name:"Press con mancuernas",type:"pesas"},{name:"Jalón al pecho",type:"pesas"},{name:"Press de hombro en máquina",type:"pesas"},{name:"Remo en máquina",type:"pesas"},{name:"Elevaciones laterales",type:"pesas"},{name:"Tríceps en polea",type:"pesas"}],
      [{name:"Peso muerto rumano",type:"pesas"},{name:"Prensa de pierna",type:"pesas"},{name:"Extensiones cuádriceps",type:"pesas"},{name:"Puente de glúteo",type:"pesas"},{name:"Pantorrillas en prensa",type:"pesas"},{name:"Elevación de piernas",type:"pesas"}],
      [{name:"Press inclinado",type:"pesas"},{name:"Remo en polea baja",type:"pesas"},{name:"Face pull",type:"pesas"},{name:"Curl con mancuernas",type:"pesas"},{name:"Elevaciones laterales en máquina",type:"pesas"},{name:"Crunch",type:"pesas"}],
      [{name:"Hip thrust en máquina",type:"pesas"},{name:"Zancadas",type:"pesas"},{name:"Peso muerto sumo",type:"pesas"},{name:"Curl femoral",type:"pesas"},{name:"Abductores en máquina",type:"pesas"},{name:"Stairmaster",type:"cardio"}]
    ],labels:["Glúteos Heavy","Upper Push","Piernas & Core","Upper Pull","Glúteos & Cardio"]
  },
  // 6 días: 3 lower + 2 upper + 1 cardio/core — días alternos libre/máquina
  ppl_6:{
    exercises:[
      [{name:"Hip thrust",type:"pesas"},{name:"Sentadilla",type:"pesas"},{name:"Curl femoral sentado",type:"pesas"},{name:"Abductores en máquina",type:"pesas"},{name:"Patada de glúteo",type:"pesas"},{name:"Plancha",type:"pesas"}],
      [{name:"Press con mancuernas",type:"pesas"},{name:"Jalón al pecho",type:"pesas"},{name:"Press de hombro en máquina",type:"pesas"},{name:"Remo en máquina",type:"pesas"},{name:"Elevaciones laterales",type:"pesas"},{name:"Tríceps en polea",type:"pesas"}],
      [{name:"Peso muerto rumano",type:"pesas"},{name:"Prensa de pierna",type:"pesas"},{name:"Extensiones cuádriceps",type:"pesas"},{name:"Puente de glúteo",type:"pesas"},{name:"Pantorrillas en prensa",type:"pesas"},{name:"Elevación de piernas",type:"pesas"}],
      [{name:"Press inclinado en máquina",type:"pesas"},{name:"Contractor de pecho",type:"pesas"},{name:"Remo en polea baja",type:"pesas"},{name:"Face pull",type:"pesas"},{name:"Curl en máquina",type:"pesas"},{name:"Crunch en máquina",type:"pesas"}],
      [{name:"Hip thrust en máquina",type:"pesas"},{name:"Zancadas",type:"pesas"},{name:"Peso muerto sumo",type:"pesas"},{name:"Aductores en máquina",type:"pesas"},{name:"Curl femoral",type:"pesas"},{name:"Abductores en máquina",type:"pesas"}],
      [{name:"Stairmaster",type:"cardio"},{name:"Elíptica",type:"cardio"},{name:"Crunch",type:"pesas"},{name:"Russian twist",type:"pesas"},{name:"Elevación de piernas",type:"pesas"},{name:"Plancha",type:"pesas"}]
    ],labels:["Glúteos Libre","Upper Libre","Piernas Libre","Upper Máquinas","Glúteos Máquinas","Cardio & Core"]
  }
};

// ── ADAPTACIÓN POR TODAS LAS VARIABLES DEL USUARIO ──
// Variables: edad, peso, altura (BMI), sexo, experiencia, objetivo, actividad
// Basado en evidencia: ACSM, NSCA, investigación en biomecánica
function adaptExercises(routine,{age,weight,height,experience,sex,goal,activityLevel}){
  const a=parseInt(age)||25;
  const w=parseFloat(weight)||70;
  const h=parseFloat(height)||170;
  const bmi=h>0?w/((h/100)*(h/100)):22;
  const act=activityLevel??2;
  const isBeginner=experience==='principiante';
  const isIntermediate=experience==='intermedio';
  const isAdvanced=experience==='avanzado';
  const isTall=h>=185;
  const isHeavy=bmi>=30;
  const isVeryHeavy=bmi>=35;
  const isOlder=a>=45;
  const isSenior=a>=50;
  const isYoung=a<20;
  const isFem=sex==='M';
  const isSedentary=act<=1;

  // ═══════════════════════════════════════════
  // FASE 1: Sustituciones de ejercicios por perfil físico
  // ═══════════════════════════════════════════
  const swaps=[];

  // === ADAPTACIONES POR PERFIL FÍSICO (aplican a todos los niveles) ===

  // Sentadilla: mayor/pesado → prensa siempre (independiente de experiencia)
  if(isOlder||isVeryHeavy)swaps.push(['Sentadilla','Prensa de pierna']);
  else if(isHeavy)swaps.push(['Sentadilla','Sentadilla en máquina Smith']);
  else if(isTall&&!isAdvanced)swaps.push(['Sentadilla','Sentadilla en multipower']);

  // Peso muerto: senior → puente, mayor → rumano más seguro
  if(isSenior)swaps.push(['Peso muerto rumano','Puente de glúteo']);
  else if(isVeryHeavy)swaps.push(['Peso muerto rumano','Puente de glúteo']);
  if(isIntermediate&&isSenior)swaps.push(['Peso muerto','Peso muerto rumano']);

  // Cardio: sobrepeso/mayor → bajo impacto
  if(isHeavy||isOlder)swaps.push(['Correr','Elíptica']);
  if(isVeryHeavy)swaps.push(['Stairmaster','Bicicleta estática']);

  // Fondos: mayor/pesado → polea (articulaciones)
  if(isOlder||isHeavy)swaps.push(['Fondos en paralelas','Tríceps en polea']);

  // === PRINCIPIANTE: máquinas guiadas y versiones más simples ===
  // Un principiante no sabe hacer ejercicios con barra libre de forma
  // segura. Las máquinas guiadas tienen recorrido fijo, reducen riesgo
  // de lesión y permiten enfocarse en el músculo sin preocuparse por
  // estabilización. Se progresa a peso libre cuando hay base.
  if(isBeginner){
    swaps.push(['Sentadilla frontal','Sentadilla goblet']);
    swaps.push(['Hack squat','Prensa de pierna']);

    // Pecho: press en máquina es más seguro que barra (no necesita spotter)
    swaps.push(['Press banca','Press en máquina']);
    swaps.push(['Press inclinado','Press inclinado en máquina']);
    swaps.push(['Press declinado','Press en máquina']);
    swaps.push(['Aperturas mancuernas','Contractor de pecho']);
    swaps.push(['Fondos en paralelas','Flexiones']);

    // Espalda: máquinas guiadas evitan errores de postura en espalda baja
    swaps.push(['Remo con barra','Remo en máquina']);
    swaps.push(['Remo con mancuerna','Remo en máquina']);
    swaps.push(['Dominadas','Pulldown en máquina']);
    swaps.push(['Remo T-bar','Remo en máquina']);

    // Hombros: máquina de press protege articulación del hombro
    swaps.push(['Press militar','Press de hombro en máquina']);
    swaps.push(['Press Arnold','Press de hombro en máquina']);
    swaps.push(['Elevaciones laterales','Elevaciones laterales en máquina']);

    // Brazos: polea/máquina es más controlable para principiantes
    swaps.push(['Curl con barra','Curl en máquina']);
    swaps.push(['Curl con barra Z','Curl en máquina']);
    swaps.push(['Press francés','Tríceps en máquina']);
    swaps.push(['Fondos en banco','Tríceps en máquina']);

    // Piernas: máquinas guiadas para movimientos complejos
    swaps.push(['Peso muerto sumo','Hip thrust en máquina']);
    swaps.push(['Sentadilla búlgara','Prensa de pierna']);
    swaps.push(['Curl femoral','Curl femoral sentado']);
    swaps.push(['Patada de glúteo','Patada de glúteo en máquina']);
    swaps.push(['Hip thrust','Hip thrust en máquina']);

    // Core: máquina de crunch tiene resistencia guiada
    swaps.push(['Crunch en polea','Crunch en máquina']);

    // Sedentario principiante → aún más básico
    if(isSedentary){
      swaps.push(['Sentadilla','Sentadilla en máquina Smith']);
      swaps.push(['Sentadilla goblet','Sentadilla en máquina Smith']);
      swaps.push(['Zancadas','Prensa de pierna']);
    }
  }

  // === INTERMEDIO: transición a peso libre pero mantener máquinas en algunos ===
  if(isIntermediate){
    // Ya puede usar mancuernas y algunos ejercicios con barra
    // Pero mantiene máquinas en ejercicios de mayor riesgo técnico
    swaps.push(['Dominadas','Jalón al pecho']); // Dominadas requieren fuerza avanzada
    swaps.push(['Hack squat','Prensa de pierna']);
    if(isOlder){
      swaps.push(['Press militar','Press de hombro en máquina']);
      swaps.push(['Fondos en paralelas','Tríceps en polea']);
    }
  }

  // Aplicar sustituciones
  const adapted={};
  for(const dk in routine){
    adapted[dk]={...routine[dk]};
    if(adapted[dk].exercises){
      adapted[dk].exercises=adapted[dk].exercises.map(ex=>{
        const swap=swaps.find(s=>s[0]===ex.name);
        return swap?{...ex,name:swap[1]}:ex;
      });
    }
  }

  // ═══════════════════════════════════════════
  // FASE 2: Ajustar volumen por experiencia + actividad
  // ═══════════════════════════════════════════

  for(const dk in adapted){
    const d=adapted[dk];
    if(d.rest||!d.exercises)continue;

    // Principiante sedentario: reducir a 4-5 ejercicios (menos agotamiento)
    if(isBeginner&&isSedentary&&d.exercises.length>5){
      d.exercises=d.exercises.slice(0,5);
    }
    // Principiante no sedentario: máximo 5-6
    else if(isBeginner&&d.exercises.length>6){
      d.exercises=d.exercises.slice(0,6);
    }

    // Avanzado: agregar ejercicio extra de variación si tiene menos de 6
    if(isAdvanced&&d.exercises.length<6){
      const hasUpper=d.exercises.some(e=>['Press banca','Press inclinado','Press con mancuernas','Jalón al pecho','Remo con barra'].includes(e.name));
      const hasLower=d.exercises.some(e=>['Sentadilla','Hip thrust','Peso muerto rumano','Prensa de pierna'].includes(e.name));
      if(hasUpper&&!d.exercises.some(e=>e.name==='Face pull')){
        d.exercises.push({name:'Face pull',type:'pesas'});
      } else if(hasLower&&!d.exercises.some(e=>e.name==='Pantorrillas')){
        d.exercises.push({name:'Pantorrillas',type:'pesas'});
      }
    }

    // Senior: limitar a 5 ejercicios máximo (fatiga, recuperación)
    if(isSenior&&d.exercises.length>5){
      d.exercises=d.exercises.slice(0,5);
    }
  }

  // ═══════════════════════════════════════════
  // FASE 3: Adaptación por OBJETIVO
  // ═══════════════════════════════════════════

  // Selección inteligente de cardio según objetivo + perfil completo
  // Cada objetivo tiene un tipo de cardio óptimo por razón específica:
  // - Grasa: alta quema calórica → HIIT, correr, Stairmaster
  // - Fuerza: mínima interferencia con recuperación → caminar, bici
  // - Músculo: recuperación activa sin catabolismo → elíptica, caminar
  // - General: salud cardiovascular → variedad moderada
  function bestCardio(){
    // Restricciones físicas primero (seguridad)
    if(isVeryHeavy)return'Bicicleta estática'; // cero impacto articular
    if(isSedentary&&isBeginner)return'Caminadora'; // empezar suave
    if(isHeavy)return'Elíptica'; // bajo impacto
    if(isSenior)return'Elíptica'; // articulaciones

    // Por objetivo
    if(goal==='grasa'){
      if(isFem)return'Stairmaster'; // glúteos + quema
      if(isAdvanced)return'HIIT'; // máxima quema en poco tiempo
      return'Correr'; // alta quema calórica
    }
    if(goal==='fuerza'){
      return'Caminar'; // mínima interferencia con fuerza
    }
    if(goal==='musculo'){
      if(isFem)return'Stairmaster'; // activa glúteos sin catabolismo
      return'Elíptica'; // bajo impacto, recuperación activa
    }
    // General
    if(isFem)return'Stairmaster';
    if(isOlder)return'Elíptica';
    return'Elíptica';
  }
  const optCardio=bestCardio();

  if(goal==='grasa'){
    // Fat loss: cardio al final de cada día de pesas (alta frecuencia)
    for(const dk in adapted){
      const d=adapted[dk];
      if(d.rest||!d.exercises)continue;
      const hasCardio=d.exercises.some(e=>e.type==='cardio');
      if(!hasCardio){
        d.exercises[d.exercises.length-1]={name:optCardio,type:'cardio'};
        d.label=d.label+' + Cardio';
      }
    }
  }

  if(goal==='fuerza'){
    // Fuerza: reemplazar aislamiento por compuestos
    // Pero NO para principiantes — ellos necesitan base primero
    if(!isBeginner){
      for(const dk in adapted){
        const d=adapted[dk];
        if(d.rest||!d.exercises)continue;
        d.exercises=d.exercises.map(ex=>{
          if(ex.name==='Aperturas mancuernas'||ex.name==='Aperturas en polea'||ex.name==='Contractor de pecho')return{...ex,name:'Press cerrado'};
          if(ex.name==='Curl predicador'||ex.name==='Curl en máquina')return{...ex,name:'Curl con barra'};
          if(ex.name==='Patada de tríceps'||ex.name==='Tríceps en máquina')return{...ex,name:'Press francés'};
          if(ex.name==='Elevaciones frontales')return{...ex,name:'Press militar'};
          if(isAdvanced&&isFem&&ex.name==='Patada de glúteo')return{...ex,name:'Peso muerto sumo'};
          if(isAdvanced&&isFem&&ex.name==='Patada de glúteo en máquina')return{...ex,name:'Peso muerto sumo'};
          return ex;
        });
      }
    }
    // Cardio ligero en 1 día de fuerza (caminar = mínima interferencia)
    let addedFCardio=false;
    for(const dk in adapted){
      const d=adapted[dk];
      if(d.rest||!d.exercises||addedFCardio)continue;
      const hasCardio=d.exercises.some(e=>e.type==='cardio');
      if(!hasCardio){
        d.exercises.push({name:optCardio,type:'cardio'});
        addedFCardio=true;
      }
    }
  }

  if(goal==='musculo'){
    // Hipertrofia: variedad de ángulos + aislamiento
    if(isAdvanced){
      for(const dk in adapted){
        const d=adapted[dk];
        if(d.rest||!d.exercises)continue;
        const hasChest=d.exercises.some(e=>['Press banca','Press inclinado','Press con mancuernas','Press en máquina','Press inclinado en máquina'].includes(e.name));
        const hasBack=d.exercises.some(e=>['Jalón al pecho','Remo con barra','Remo con mancuerna','Remo en máquina','Pulldown en máquina'].includes(e.name));
        if(hasChest&&d.exercises.length<7&&!d.exercises.some(e=>['Aperturas en polea','Contractor de pecho'].includes(e.name))){
          d.exercises.push({name:'Contractor de pecho',type:'pesas'});
        } else if(hasBack&&d.exercises.length<7&&!d.exercises.some(e=>e.name==='Face pull')){
          d.exercises.push({name:'Face pull',type:'pesas'});
        }
      }
    }
    // Cardio ligero en 1 día (5+ días) para recuperación activa
    const trainDayKeys=Object.keys(adapted).filter(dk=>!adapted[dk].rest&&adapted[dk].exercises?.length);
    if(trainDayKeys.length>=5){
      const lastDay=adapted[trainDayKeys[trainDayKeys.length-1]];
      if(!lastDay.exercises.some(e=>e.type==='cardio')){
        lastDay.exercises[lastDay.exercises.length-1]={name:optCardio,type:'cardio'};
        lastDay.label=lastDay.label+' + Cardio ligero';
      }
    }
  }

  if(goal==='general'){
    // General: core + cardio en 1-2 días para salud cardiovascular
    const coreExs=['Plancha','Crunch','Elevación de piernas'];
    let ci=0;
    let cardioAdded=0;
    const maxCardio=2;

    for(const dk in adapted){
      const d=adapted[dk];
      if(d.rest||!d.exercises)continue;
      const hasCore=d.exercises.some(e=>coreExs.includes(e.name)||e.name==='Russian twist');
      if(!hasCore&&d.exercises.length<=6){
        d.exercises.push({name:coreExs[ci%coreExs.length],type:'pesas'});
        ci++;
      }
      const hasCardio=d.exercises.some(e=>e.type==='cardio');
      if(!hasCardio&&cardioAdded<maxCardio){
        d.exercises[d.exercises.length-1]={name:optCardio,type:'cardio'};
        d.label=d.label+' + Cardio';
        cardioAdded++;
      }
    }
  }

  if(goal==='musculo'){
    // Hipertrofia: si tiene 5+ días, añadir cardio ligero en 1 día (recuperación activa)
    const trainDayKeys=Object.keys(adapted).filter(dk=>!adapted[dk].rest&&adapted[dk].exercises?.length);
    if(trainDayKeys.length>=5){
      const lastTrainDay=trainDayKeys[trainDayKeys.length-1];
      const d=adapted[lastTrainDay];
      const hasCardio=d.exercises.some(e=>e.type==='cardio');
      if(!hasCardio){
        let cardioName=isFem?'Stairmaster':'Elíptica';
        if(isHeavy||isOlder)cardioName='Elíptica';
        if(isVeryHeavy)cardioName='Bicicleta estática';
        d.exercises[d.exercises.length-1]={name:cardioName,type:'cardio'};
        d.label=d.label+' + Cardio ligero';
      }
    }
  }

  // ═══════════════════════════════════════════
  // FASE 4: Eliminar duplicados dentro del mismo día
  // ═══════════════════════════════════════════
  for(const dk in adapted){
    const d=adapted[dk];
    if(!d.exercises)continue;
    const seen=new Set();
    d.exercises=d.exercises.filter(ex=>{
      if(seen.has(ex.name))return false;
      seen.add(ex.name);
      return true;
    });
  }

  return adapted;
}

function selectTemplate(experience,numDays,goal,sex){
  const templates=sex==='M'?TEMPLATES_F:TEMPLATES_M;
  if(goal==='grasa'&&numDays<=3)return{key:'fullbody_cardio_3',templates};
  if(numDays<=3)return{key:'fullbody_3',templates};
  if(numDays===4)return{key:'upperlower_4',templates};
  if(numDays===5)return{key:'pplul_5',templates};
  return{key:'ppl_6',templates};
}

function getDaysWarning(experience,numDays){
  if(experience==='principiante'&&numDays>=5)return'La ciencia recomienda 3-4 días para principiantes. La recuperación es clave para crecer.';
  if(experience==='intermedio'&&numDays>=6)return'Para tu nivel, 4-5 días es lo óptimo. Más no siempre es mejor.';
  return null;
}

function getSuggestedDays(activity,experience){
  // Suggest based on activity level + experience
  if(experience==='principiante')return activity<=1?3:activity<=3?3:4;
  if(experience==='intermedio')return activity<=1?3:activity<=2?4:5;
  return activity<=1?4:activity<=2?4:activity<=3?5:6;
}

function goalToObjective(goal){
  if(goal==='musculo')return'hipertrofia';
  if(goal==='fuerza')return'fuerza';
  if(goal==='grasa')return'resistencia';
  return'hipertrofia';
}

function buildRoutineFromWizard(templateKey,selectedDays,templates){
  const tmpl=(templates||TEMPLATES_M)[templateKey];
  const allDK=["lunes","martes","miercoles","jueves","viernes","sabado","domingo"];
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
const WIZARD_STEPS=6;
let wizardStep=1;
let wizardData={name:'',age:'',sex:'H',height:'',weight:'',activityLevel:2,goal:null,experience:null,selectedDays:[],mode:null}; // mode: 'auto','manual','import'

const _svg='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">';
const ACTIVITY_OPTS=[
  {i:0,l:'Sedentario',d:'Trabajo de oficina, sin ejercicio',ico:_svg+'<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>'},
  {i:1,l:'Ligero',d:'Caminas a diario o 1-2 días de gym',ico:_svg+'<path d="M13 4v16"/><path d="M17 4v16"/><rect x="5" y="8" width="14" height="8" rx="1" fill="none"/></svg>'},
  {i:2,l:'Moderado',d:'3-4 días de gym por semana',ico:_svg+'<line x1="4" y1="12" x2="20" y2="12"/><rect x="2" y="9" width="4" height="6" rx="1.5"/><rect x="18" y="9" width="4" height="6" rx="1.5"/></svg>'},
  {i:3,l:'Activo',d:'5-6 días de gym o deporte frecuente',ico:_svg+'<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>'},
  {i:4,l:'Muy activo',d:'Entrenas 2 veces al día o trabajo físico',ico:_svg+'<path d="M12 22c4.97 0 7-3.58 7-7.5 0-4.05-3.5-7.5-7-10.5-3.5 3-7 6.45-7 10.5C5 18.42 7.03 22 12 22z"/><path d="M12 22c2 0 3.5-1.5 3.5-4 0-2.5-1.75-4-3.5-5.5C10.25 14 8.5 15.5 8.5 18c0 2.5 1.5 4 3.5 4z"/></svg>'}
];

function showWizard(){
  const hasExisting=Object.values(db.routine).some(d=>d.exercises?.length>0);
  if(hasExisting&&localStorage.getItem('gym_onboarded')){
    if(!confirm('Esto reemplazará tu rutina actual. ¿Continuar?'))return;
    wizardStep=1; // Skip install screen when relaunching
  } else {
    wizardStep=0; // Show install screen for new users
  }
  wizardData={name:db.profile.name||'',age:db.profile.age||'',sex:db.profile.sex||'H',height:db.profile.height||'',weight:db.profile.weight||'',activityLevel:db.profile.activityLevel??2,goal:null,experience:null,selectedDays:[],mode:null};
  document.getElementById('wizard-overlay').style.display='flex';
  renderWizardStep();
}
function hideWizard(){
  document.getElementById('wizard-overlay').style.display='none';
  const app=document.getElementById('app');
  if(app)app.style.display='';
  startDurationInterval();
}

function renderWizardStep(){
  const container=document.getElementById('wizard-content');
  const dots=document.getElementById('wizard-dots');

  // Step 0: Install screen (no dots)
  if(wizardStep===0){
    const isInstalled=window.matchMedia('(display-mode: standalone)').matches||window.navigator.standalone===true;
    dots.innerHTML='';
    if(isInstalled){
      // Already installed as PWA, skip to step 1
      wizardStep=1;
      renderWizardStep();
      return;
    }
    const isIOS=/iPad|iPhone|iPod/.test(navigator.userAgent);
    const iosSteps=`<div class="wiz-install-steps">
      <div class="wiz-is"><span class="wiz-is-n">1</span>Toca el botón de <b>compartir</b> <span style="font-size:16px">⎙</span> en Safari</div>
      <div class="wiz-is"><span class="wiz-is-n">2</span>Selecciona <b>"Añadir a pantalla de inicio"</b></div>
      <div class="wiz-is"><span class="wiz-is-n">3</span>Toca <b>"Añadir"</b> y abre la app desde tu pantalla</div>
    </div>`;
    const androidSteps=`<div class="wiz-install-steps">
      <div class="wiz-is"><span class="wiz-is-n">1</span>Toca los <b>tres puntos ⋮</b> en Chrome</div>
      <div class="wiz-is"><span class="wiz-is-n">2</span>Selecciona <b>"Instalar app"</b> o <b>"Añadir a pantalla de inicio"</b></div>
      <div class="wiz-is"><span class="wiz-is-n">3</span>Abre la app desde tu pantalla de inicio</div>
    </div>`;
    container.innerHTML=`
      <div class="wiz-install-ico">${_svg}<rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg></div>
      <div class="wiz-title">Antes de empezar</div>
      <div class="wiz-subtitle">Para que tus datos se guarden correctamente, te recomendamos <b>instalar la app</b> en tu teléfono</div>
      ${isIOS?iosSteps:androidSteps}
      <div class="wiz-install-note">
        ${_svg}<circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
        <p>Si haces el cuestionario en el navegador y luego instalas, <b>tendrás que repetirlo</b>. Instálala primero.</p>
      </div>
      <button class="sbtn" onclick="wizardStep=1;renderWizardStep()" style="margin-top:16px">YA LA INSTALÉ</button>
      <button class="wiz-skip-btn" onclick="wizardStep=1;renderWizardStep()">Continuar sin instalar</button>`;
    return;
  }

  const totalDots=wizardData.mode==='auto'?6:wizardData.mode==='manual'?3:1;
  const dotStep=wizardStep>totalDots?totalDots:wizardStep;
  dots.innerHTML=Array.from({length:totalDots},(_,i)=>i+1).map(n=>`<span class="wiz-dot ${n===dotStep?'active':''}${n<dotStep?' done':''}"></span>`).join('');

  if(wizardStep===1){
    // DATOS PERSONALES
    container.innerHTML=`
      <div class="wiz-title">Sobre ti</div>
      <div class="wiz-subtitle">Si no sabes algún dato, déjalo vacío</div>
      <div class="wiz-form">
        <div class="wiz-field"><label class="wiz-label">NOMBRE</label><input class="wiz-input" type="text" id="wiz-name" value="${wizardData.name}" placeholder="Tu nombre"></div>
        <div class="wiz-row">
          <div class="wiz-field"><label class="wiz-label">EDAD</label><input class="wiz-input wiz-num" type="number" id="wiz-age" value="${wizardData.age}" placeholder="25" min="10" max="99"></div>
          <div class="wiz-field"><label class="wiz-label">SEXO</label><div class="wiz-sex-row"><div class="wiz-sex ${wizardData.sex==='H'?'active':''}" onclick="wizardData.sex='H';renderWizardStep()">H</div><div class="wiz-sex ${wizardData.sex==='M'?'active':''}" onclick="wizardData.sex='M';renderWizardStep()">M</div></div></div>
        </div>
        <div class="wiz-row">
          <div class="wiz-field"><label class="wiz-label">ALTURA (cm)</label><input class="wiz-input wiz-num" type="number" id="wiz-height" value="${wizardData.height}" placeholder="175" min="100" max="230"></div>
          <div class="wiz-field"><label class="wiz-label">PESO (kg)</label><input class="wiz-input wiz-num" type="number" id="wiz-weight" value="${wizardData.weight}" placeholder="75" min="30" max="300" step="0.1"></div>
        </div>
      </div>
      <button class="sbtn" onclick="wizNextProfile()" style="margin-top:16px">CONTINUAR</button>`;

  } else if(wizardStep===2){
    // ELEGIR MODO
    container.innerHTML=`
      <div class="wiz-title">¿Cómo quieres tu rutina?</div>
      <div class="wiz-subtitle">Elige la opción que mejor te venga</div>
      <div class="wiz-options">
        <div class="wiz-opt ${wizardData.mode==='auto'?'active':''}" onclick="wizSelectMode('auto')">
          <span class="wiz-emoji wiz-svg-ico">${_svg}<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg></span>
          <div><span class="wiz-opt-title">Sugiéreme una rutina</span><span class="wiz-opt-desc">Te creamos una rutina personalizada según tus datos y objetivos</span></div>
        </div>
        <div class="wiz-opt ${wizardData.mode==='manual'?'active':''}" onclick="wizSelectMode('manual')">
          <span class="wiz-emoji wiz-svg-ico">${_svg}<path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg></span>
          <div><span class="wiz-opt-title">Crear la mía</span><span class="wiz-opt-desc">Elige tus días y ejercicios a tu gusto</span></div>
        </div>
        <div class="wiz-opt" onclick="wizImportRoutine()">
          <span class="wiz-emoji wiz-svg-ico">${_svg}<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg></span>
          <div><span class="wiz-opt-title">Importar rutina</span><span class="wiz-opt-desc">Importa un JSON de una rutina existente</span></div>
        </div>
      </div>
      <div class="wiz-import-tip">
        ${_svg}<circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
        <div>
          <p>¿Ya tienes una rutina? Copia el prompt, pégalo en <b>ChatGPT</b> junto con tu rutina y te devolverá un JSON para importar.</p>
          <button class="wiz-copy-prompt" onclick="copyImportPrompt()">COPIAR PROMPT</button>
        </div>
      </div>`;

  } else if(wizardStep===3){
    // NIVEL DE ACTIVIDAD (solo modo auto)
    container.innerHTML=`
      <div class="wiz-title">Tu estilo de vida</div>
      <div class="wiz-subtitle">Esto nos ayuda a calcular tus calorías y sugerirte días de entrenamiento</div>
      <div class="wiz-options">
        ${ACTIVITY_OPTS.map(a=>`<div class="wiz-opt ${wizardData.activityLevel===a.i?'active':''}" onclick="wizSelectActivity(${a.i})">
          <span class="wiz-emoji wiz-svg-ico">${a.ico}</span>
          <div><span class="wiz-opt-title">${a.l}</span><span class="wiz-opt-desc">${a.d}</span></div>
        </div>`).join('')}
      </div>`;

  } else if(wizardStep===4){
    // OBJETIVO — adaptado por sexo
    const isFem=wizardData.sex==='M';
    const goals=isFem?[
      {key:'musculo',title:'Tonificar y definir',desc:'Hipertrofia · 3-4 series × 10-15 reps · Enfoque en glúteos, piernas y core'},
      {key:'fuerza',title:'Ganar fuerza',desc:'Fuerza funcional · 4-5 series × 5-8 reps · Sentadilla, peso muerto, hip thrust'},
      {key:'grasa',title:'Perder grasa',desc:'Resistencia + cardio · 3 series × 15-20 reps · Circuitos y HIIT'},
      {key:'general',title:'Estar en forma',desc:'General · 3 series × 10-12 reps · Equilibrio de todo el cuerpo'},
    ]:[
      {key:'musculo',title:'Ganar músculo',desc:'Hipertrofia · 3-4 series × 8-12 reps'},
      {key:'fuerza',title:'Ganar fuerza',desc:'Fuerza · 4-5 series × 3-6 reps'},
      {key:'grasa',title:'Perder grasa',desc:'Resistencia + cardio · 3 series × 12-15 reps'},
      {key:'general',title:'Estar en forma',desc:'General · 3 series × 8-12 reps'},
    ];
    const goalIcons={musculo:_svg+'<path d="M15 3h6v6"/><path d="M9 21H3v-6"/><path d="M21 3l-7 7"/><path d="M3 21l7-7"/></svg>',fuerza:_svg+'<line x1="4" y1="12" x2="20" y2="12"/><rect x="2" y="9" width="4" height="6" rx="1.5"/><rect x="18" y="9" width="4" height="6" rx="1.5"/></svg>',grasa:_svg+'<path d="M12 22c4.97 0 7-3.58 7-7.5 0-4.05-3.5-7.5-7-10.5-3.5 3-7 6.45-7 10.5C5 18.42 7.03 22 12 22z"/></svg>',general:_svg+'<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>'};
    container.innerHTML=`
      <div class="wiz-title">¿Cuál es tu objetivo?</div>
      <div class="wiz-subtitle">Adaptamos ejercicios, series y repeticiones</div>
      <div class="wiz-options">
        ${goals.map(g=>`<div class="wiz-opt ${wizardData.goal===g.key?'active':''}" onclick="wizSelect('goal','${g.key}')">
          <span class="wiz-emoji wiz-svg-ico">${goalIcons[g.key]}</span>
          <div><span class="wiz-opt-title">${g.title}</span><span class="wiz-opt-desc">${g.desc}</span></div>
        </div>`).join('')}
      </div>`;

  } else if(wizardStep===5){
    // EXPERIENCIA
    container.innerHTML=`
      <div class="wiz-title">¿Cuánta experiencia tienes?</div>
      <div class="wiz-subtitle">Esto define la complejidad de tu rutina</div>
      <div class="wiz-options">
        <div class="wiz-opt ${wizardData.experience==='principiante'?'active':''}" onclick="wizSelect('experience','principiante')">
          <span class="wiz-emoji wiz-svg-ico">${_svg}<circle cx="12" cy="12" r="3"/><path d="M12 3v3"/><path d="M12 18v3"/></svg></span>
          <div><span class="wiz-opt-title">Nunca he entrenado</span><span class="wiz-opt-desc">Empezamos con lo básico — ejercicios compuestos</span></div>
        </div>
        <div class="wiz-opt ${wizardData.experience==='intermedio'?'active':''}" onclick="wizSelect('experience','intermedio')">
          <span class="wiz-emoji wiz-svg-ico">${_svg}<polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg></span>
          <div><span class="wiz-opt-title">Menos de 1 año</span><span class="wiz-opt-desc">Ya conoces los ejercicios — más variedad y volumen</span></div>
        </div>
        <div class="wiz-opt ${wizardData.experience==='avanzado'?'active':''}" onclick="wizSelect('experience','avanzado')">
          <span class="wiz-emoji wiz-svg-ico">${_svg}<path d="M6 9H3a1 1 0 0 0-1 1v1a4 4 0 0 0 4 4h0"/><path d="M18 9h3a1 1 0 0 1 1 1v1a4 4 0 0 1-4 4h0"/><path d="M7 4h10v7a5 5 0 0 1-10 0V4z"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="16" x2="12" y2="20"/></svg></span>
          <div><span class="wiz-opt-title">Más de 1 año</span><span class="wiz-opt-desc">Rutinas avanzadas — mayor frecuencia y especificidad</span></div>
        </div>
      </div>`;

  } else if(wizardStep===6||wizardStep==='manual_days'){
    const isManual=wizardData.mode==='manual';
    const suggested=isManual?4:getSuggestedDays(wizardData.activityLevel,wizardData.experience);
    const warning=!isManual&&wizardData.selectedDays.length?getDaysWarning(wizardData.experience,wizardData.selectedDays.length):null;
    const allDays=[
      {key:"lunes",label:"L"},{key:"martes",label:"M"},{key:"miercoles",label:"X"},
      {key:"jueves",label:"J"},{key:"viernes",label:"V"},{key:"sabado",label:"S"},{key:"domingo",label:"D"}
    ];
    const minDays=isManual?1:3;
    container.innerHTML=`
      <div class="wiz-title">¿Qué días entrenas?</div>
      <div class="wiz-subtitle">${isManual?'Selecciona los días que quieras entrenar':`Basado en tu actividad y nivel, te recomendamos <strong>${suggested} días</strong>`}</div>
      <div class="wiz-day-picker">
        ${allDays.map(d=>`<div class="wiz-day-btn ${wizardData.selectedDays.includes(d.key)?'active':''}" onclick="toggleWizDay('${d.key}')">${d.label}</div>`).join('')}
      </div>
      <div class="wiz-day-count">${wizardData.selectedDays.length} días seleccionados</div>
      ${warning?`<div class="wiz-warning">${warning}</div>`:''}
      ${wizardData.selectedDays.length>=minDays?`<button class="sbtn" onclick="${isManual?'showManualBuilder()':'showWizardResult()'}" style="margin-top:16px">${isManual?'ELEGIR EJERCICIOS':'VER MI RUTINA'}</button>`:`<div class="wiz-hint">Selecciona al menos ${minDays} día${minDays>1?'s':''}</div>`}`;
  }
}

function wizNextProfile(){
  wizardData.name=document.getElementById('wiz-name').value.trim();
  wizardData.age=document.getElementById('wiz-age').value;
  wizardData.height=document.getElementById('wiz-height').value;
  wizardData.weight=document.getElementById('wiz-weight').value;
  wizardStep=2;renderWizardStep();
}

function wizSelectMode(mode){
  wizardData.mode=mode;
  renderWizardStep();
  if(mode==='auto'){
    setTimeout(()=>{wizardStep=3;renderWizardStep();},300);
  } else if(mode==='manual'){
    setTimeout(()=>{wizardStep='manual_days';renderWizardStep();},300);
  }
}
function wizImportRoutine(){
  // Guardar perfil primero
  db.profile={...db.profile,name:wizardData.name||db.profile.name,age:wizardData.age||db.profile.age,sex:wizardData.sex||db.profile.sex,height:wizardData.height||db.profile.height,weight:wizardData.weight||db.profile.weight,activityLevel:wizardData.activityLevel??2};
  ps('gym_profile',db.profile);
  localStorage.setItem('gym_onboarded','true');
  hideWizard();
  // Abrir importador
  const input=document.createElement('input');input.type='file';input.accept='.json';
  input.onchange=e=>importData(e);
  input.click();
}
function wizSelectActivity(level){
  wizardData.activityLevel=level;
  renderWizardStep();
  setTimeout(()=>{wizardStep=4;renderWizardStep();},300);
}

function wizSelect(key,value){
  wizardData[key]=value;
  renderWizardStep();
  setTimeout(()=>{if(wizardStep<WIZARD_STEPS){wizardStep++;renderWizardStep();}},300);
}

function toggleWizDay(dk){
  const idx=wizardData.selectedDays.indexOf(dk);
  if(idx>=0)wizardData.selectedDays.splice(idx,1);
  else if(wizardData.selectedDays.length<6)wizardData.selectedDays.push(dk);
  const order=["lunes","martes","miercoles","jueves","viernes","sabado","domingo"];
  wizardData.selectedDays.sort((a,b)=>order.indexOf(a)-order.indexOf(b));
  renderWizardStep();
}

// ── Manual routine builder ──
let manualRoutine={};
function showManualBuilder(){
  const container=document.getElementById('wizard-content');
  document.getElementById('wizard-dots').innerHTML='';
  const dl={lunes:"Lunes",martes:"Martes",miercoles:"Miércoles",jueves:"Jueves",viernes:"Viernes",sabado:"Sábado",domingo:"Domingo"};
  const allDK=["lunes","martes","miercoles","jueves","viernes","sabado","domingo"];

  // Inicializar rutina manual si no existe
  if(!Object.keys(manualRoutine).length){
    allDK.forEach(dk=>{
      if(wizardData.selectedDays.includes(dk)){
        manualRoutine[dk]={label:'Entrenamiento',rest:false,exercises:[]};
      } else {
        manualRoutine[dk]={label:'Descanso',rest:true,exercises:[]};
      }
    });
  }

  const dayTabs=wizardData.selectedDays.map(dk=>{
    const exCount=manualRoutine[dk]?.exercises?.length||0;
    const copyBtn=exCount>0?`<span class="wiz-md-copy" onclick="event.stopPropagation();showCopyDay('${dk}')" title="Copiar a otro día">${_svg}<rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg></span>`:'';
    return`<div class="wiz-manual-day" onclick="openManualDayPicker('${dk}')">
      <span class="wiz-md-name">${dl[dk]}</span>
      <span class="wiz-md-count">${exCount} ej.</span>
      ${copyBtn}
      <span class="wiz-md-arrow">›</span>
    </div>`;
  }).join('');

  const totalEx=wizardData.selectedDays.reduce((a,dk)=>a+(manualRoutine[dk]?.exercises?.length||0),0);

  container.innerHTML=`
    <div class="wiz-title">Elige tus ejercicios</div>
    <div class="wiz-subtitle">Toca cada día para agregar ejercicios</div>
    <div class="wiz-manual-steps">
      <div class="wiz-ms"><span class="wiz-ms-n">1</span>Toca un día para abrir el catálogo</div>
      <div class="wiz-ms"><span class="wiz-ms-n">2</span>Selecciona los ejercicios que quieras</div>
      <div class="wiz-ms"><span class="wiz-ms-n">3</span>Usa el ícono de copiar para repetir un día</div>
    </div>
    <div class="wiz-manual-days">${dayTabs}</div>
    <div class="wiz-manual-note">Puedes modificar tu rutina cuando quieras desde <b>Perfil → Mi Rutina</b></div>
    ${totalEx>0?`<button class="sbtn" onclick="applyManualRoutine()" style="margin-top:12px">EMPEZAR A ENTRENAR</button>`:'<div class="wiz-hint">Agrega al menos un ejercicio</div>'}`;
}

function showCopyDay(fromDk){
  const dl={lunes:"Lun",martes:"Mar",miercoles:"Mié",jueves:"Jue",viernes:"Vie",sabado:"Sáb",domingo:"Dom"};
  const targets=wizardData.selectedDays.filter(dk=>dk!==fromDk);
  if(!targets.length){toast('No hay otros días');return;}
  const btns=targets.map(dk=>`<div class="wiz-copy-target" onclick="copyDayTo('${fromDk}','${dk}')">${dl[dk]}</div>`).join('');
  const container=document.getElementById('wizard-content');
  const existing=container.querySelector('.wiz-copy-popup');
  if(existing){existing.remove();showManualBuilder();return;}
  container.insertAdjacentHTML('beforeend',`<div class="wiz-copy-popup"><div class="wiz-copy-label">Copiar a:</div><div class="wiz-copy-targets">${btns}</div></div>`);
}
function copyDayTo(from,to){
  const hasExisting=manualRoutine[to]?.exercises?.length>0;
  if(hasExisting){
    if(!confirm('Este día ya tiene ejercicios. ¿Quieres reemplazarlos?'))return;
  }
  manualRoutine[to]={...manualRoutine[to],exercises:[...(manualRoutine[from]?.exercises||[]).map(e=>({...e}))]};
  toast('Copiado ✓');
  showManualBuilder();
}

function openManualDayPicker(dk){
  const current=manualRoutine[dk]?.exercises||[];
  window._manualPickerDay=dk;
  window._manualPickerSelected=current.map(e=>e.name);
  const overlay=document.getElementById('picker-overlay');
  const search=document.getElementById('picker-search');
  const btn=overlay.querySelector('.sbtn');
  overlay.style.zIndex='400';
  search.value='';
  search.oninput=()=>renderManualPicker(search.value);
  btn.onclick=()=>doneManualPicker();
  renderManualPicker('');
  overlay.classList.add('open');
}

function renderManualPicker(query){
  const q=(query||'').trim().toLowerCase();
  const selected=window._manualPickerSelected||[];
  const list=document.getElementById('picker-list');
  const zones=[{key:'superior',label:'TREN SUPERIOR'},{key:'inferior',label:'TREN INFERIOR'},{key:'core',label:'CORE'},{key:'cardio',label:'CARDIO'}];
  let html='';
  zones.forEach(z=>{
    const exs=EXERCISE_DB.filter(e=>e.zone===z.key&&(!q||e.name.toLowerCase().includes(q)||e.muscleGroup.some(m=>m.toLowerCase().includes(q))));
    if(!exs.length)return;
    html+=`<div style="font-family:'DM Mono',monospace;font-size:9px;color:var(--accent);letter-spacing:1.5px;padding:8px 0 4px">${z.label}</div>`;
    exs.forEach(e=>{
      const sel=selected.includes(e.name);
      html+=`<div class="pick-item ${sel?'selected':''}" onclick="toggleManualEx('${e.name.replace(/'/g,"\\'")}')"><span>${e.name}</span><span class="pick-mg">${e.muscleGroup[0]}</span></div>`;
    });
  });
  list.innerHTML=html;
}

function toggleManualEx(name){
  const sel=window._manualPickerSelected;
  const idx=sel.indexOf(name);
  if(idx>=0)sel.splice(idx,1);else sel.push(name);
  renderManualPicker(document.getElementById('picker-search')?.value||'');
}

function doneManualPicker(){
  const dk=window._manualPickerDay;
  const selected=window._manualPickerSelected||[];
  manualRoutine[dk].exercises=selected.map(name=>{
    const info=getExerciseInfo(name);
    return{name,type:info?.type||'pesas'};
  });
  const overlay=document.getElementById('picker-overlay');
  overlay.classList.remove('open');
  overlay.style.zIndex='';
  // Restaurar picker original
  const search=document.getElementById('picker-search');
  const btn=overlay.querySelector('.sbtn');
  search.oninput=()=>onPickerSearch(search.value);
  btn.onclick=()=>doneExPicker();
  showManualBuilder();
}

function applyManualRoutine(){
  const allDK=["lunes","martes","miercoles","jueves","viernes","sabado","domingo"];
  allDK.forEach(dk=>{
    if(!manualRoutine[dk])manualRoutine[dk]={label:'Descanso',rest:true,exercises:[]};
  });
  db.routine=manualRoutine;
  ps('gym_routine',db.routine);
  db.profile={...db.profile,name:wizardData.name||'Usuario',age:wizardData.age||'25',sex:wizardData.sex||'H',height:wizardData.height||'175',weight:wizardData.weight||'75',activityLevel:wizardData.activityLevel??2};
  ps('gym_profile',db.profile);
  db.objective='hipertrofia';
  ps('gym_objective',db.objective);
  localStorage.setItem('gym_onboarded','true');
  manualRoutine={};
  hideWizard();
  renderHeader();renderObj();renderHoy();
  toast('Rutina creada ✓');
}

function showWizardResult(){
  const numDays=wizardData.selectedDays.length;
  const {key:templateKey,templates}=selectTemplate(wizardData.experience,numDays,wizardData.goal,wizardData.sex);
  const rawRoutine=buildRoutineFromWizard(templateKey,wizardData.selectedDays,templates);
  const routine=adaptExercises(rawRoutine,{age:wizardData.age,weight:wizardData.weight,height:wizardData.height,experience:wizardData.experience,sex:wizardData.sex,goal:wizardData.goal,activityLevel:wizardData.activityLevel});
  const container=document.getElementById('wizard-content');
  document.getElementById('wizard-dots').innerHTML='';

  const splitNames={fullbody_3:'Full Body',fullbody_cardio_3:'Full Body + Cardio',upperlower_4:'Upper / Lower',pplul_5:'PPLUL',ppl_6:'Push / Pull / Legs'};
  const dl={lunes:"Lun",martes:"Mar",miercoles:"Mié",jueves:"Jue",viernes:"Vie",sabado:"Sáb",domingo:"Dom"};
  const allDK=["lunes","martes","miercoles","jueves","viernes","sabado","domingo"];

  // Solo mostrar días de entrenamiento (descanso se omite para ahorrar espacio)
  const trainDays=allDK.filter(dk=>!routine[dk].rest);
  const restCount=7-trainDays.length;

  // Color por grupo muscular para cada chip de ejercicio
  const muscleColors={
    'Pecho':'#f87171','Tríceps':'#fb923c','Hombros':'#fbbf24',
    'Espalda':'#60a5fa','Bíceps':'#818cf8',
    'Cuádriceps':'#4ade80','Isquiotibiales':'#34d399','Glúteos':'#2dd4bf','Pantorrillas':'#6ee7b7',
    'Core':'#f59e0b',
    'Cardio':'#38bdf8',
  };
  function getExColor(e){
    if(e.type==='cardio')return muscleColors.Cardio;
    const info=getExerciseInfo(e.name);
    if(info?.muscleGroup?.length)return muscleColors[info.muscleGroup[0]]||null;
    return null;
  }

  let preview=trainDays.map(dk=>{
    const day=routine[dk];
    const exList=day.exercises.map(e=>{
      const c=getExColor(e);
      const style=c?` style="color:${c};border-color:${c}33;background:${c}0d"`:'';
      return`<span class="wiz-dp-ex"${style}>${e.name}</span>`;
    }).join('');
    return`<div class="wiz-day-preview" onclick="this.classList.toggle('expanded')"><div class="wiz-dp-top"><span class="wiz-dp-day">${dl[dk]}</span><span class="wiz-dp-label">${day.label}</span><div class="wiz-dp-right"><span class="wiz-dp-count">${day.exercises.length}</span><span class="wiz-dp-arrow">›</span></div></div><div class="wiz-dp-exlist">${exList}</div></div>`;
  }).join('');

  container.innerHTML=`
    <div class="wiz-title">Tu rutina personalizada</div>
    <div class="wiz-subtitle">${numDays} días de entrenamiento · ${restCount} de descanso</div>
    <div class="wiz-result-scroll">
      <div class="wiz-preview">${preview}</div>
    </div>
    <div class="wiz-result-note">Toca un día para ver los ejercicios · Personaliza en <b>Perfil → Mi Rutina</b></div>
    <div class="wiz-result-actions">
      <button class="sbtn" onclick="applyWizardRoutine()">EMPEZAR A ENTRENAR</button>
    </div>`;
}

function applyWizardRoutine(customize){
  const numDays=wizardData.selectedDays.length;
  const {key:templateKey,templates}=selectTemplate(wizardData.experience,numDays,wizardData.goal,wizardData.sex);
  const rawRoutine=buildRoutineFromWizard(templateKey,wizardData.selectedDays,templates);
  const routine=adaptExercises(rawRoutine,{age:wizardData.age,weight:wizardData.weight,height:wizardData.height,experience:wizardData.experience,sex:wizardData.sex,goal:wizardData.goal,activityLevel:wizardData.activityLevel});

  db.routine=routine;
  ps('gym_routine',db.routine);
  db.objective=goalToObjective(wizardData.goal);
  ps('gym_objective',db.objective);
  db.profile={
    ...db.profile,
    name:wizardData.name||'Usuario',
    age:wizardData.age||'25',
    sex:wizardData.sex||'H',
    height:wizardData.height||'175',
    weight:wizardData.weight||'75',
    activityLevel:wizardData.activityLevel??2,
  };
  ps('gym_profile',db.profile);
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
  if(!localStorage.getItem('gym_onboarded')){
    showWizard();
  }
}
