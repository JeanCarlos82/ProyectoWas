const ZONES={superior:"TREN SUPERIOR",inferior:"TREN INFERIOR",core:"CORE",cardio:"CARDIO"};
const ZONE_MUSCLES={
  superior:["Pecho","Espalda","Hombros","Bíceps","Tríceps"],
  inferior:["Cuádriceps","Isquiotibiales","Glúteos","Pantorrillas"],
  core:["Core"],
  cardio:["Cardio"]
};

const EXERCISE_DB = [
  // ── PECHO ──
  {name:"Press banca",type:"pesas",zone:"superior",muscleGroup:["Pecho","Tríceps"]},
  {name:"Press inclinado",type:"pesas",zone:"superior",muscleGroup:["Pecho","Hombros"]},
  {name:"Press declinado",type:"pesas",zone:"superior",muscleGroup:["Pecho","Tríceps"]},
  {name:"Press con mancuernas",type:"pesas",zone:"superior",muscleGroup:["Pecho","Tríceps"]},
  {name:"Aperturas mancuernas",type:"pesas",zone:"superior",muscleGroup:["Pecho"]},
  {name:"Aperturas en polea",type:"pesas",zone:"superior",muscleGroup:["Pecho"]},
  {name:"Fondos en paralelas",type:"pesas",zone:"superior",muscleGroup:["Pecho","Tríceps"]},
  {name:"Pullover",type:"pesas",zone:"superior",muscleGroup:["Pecho","Espalda"]},
  {name:"Press en máquina",type:"pesas",zone:"superior",muscleGroup:["Pecho"]},

  // ── ESPALDA ──
  {name:"Jalón al pecho",type:"pesas",zone:"superior",muscleGroup:["Espalda","Bíceps"]},
  {name:"Jalón tras nuca",type:"pesas",zone:"superior",muscleGroup:["Espalda"]},
  {name:"Remo con barra",type:"pesas",zone:"superior",muscleGroup:["Espalda","Bíceps"]},
  {name:"Remo con mancuerna",type:"pesas",zone:"superior",muscleGroup:["Espalda"]},
  {name:"Remo en polea baja",type:"pesas",zone:"superior",muscleGroup:["Espalda","Bíceps"]},
  {name:"Dominadas",type:"pesas",zone:"superior",muscleGroup:["Espalda","Bíceps"]},
  {name:"Remo en máquina",type:"pesas",zone:"superior",muscleGroup:["Espalda"]},
  {name:"Face pull",type:"pesas",zone:"superior",muscleGroup:["Espalda","Hombros"]},

  // ── HOMBROS ──
  {name:"Press militar",type:"pesas",zone:"superior",muscleGroup:["Hombros","Tríceps"]},
  {name:"Press Arnold",type:"pesas",zone:"superior",muscleGroup:["Hombros"]},
  {name:"Elevaciones laterales",type:"pesas",zone:"superior",muscleGroup:["Hombros"]},
  {name:"Elevaciones frontales",type:"pesas",zone:"superior",muscleGroup:["Hombros"]},
  {name:"Pájaros",type:"pesas",zone:"superior",muscleGroup:["Hombros","Espalda"]},
  {name:"Encogimientos",type:"pesas",zone:"superior",muscleGroup:["Hombros"]},
  {name:"Press con mancuernas hombro",type:"pesas",zone:"superior",muscleGroup:["Hombros"]},
  {name:"Elevaciones laterales en polea",type:"pesas",zone:"superior",muscleGroup:["Hombros"]},

  // ── BÍCEPS ──
  {name:"Curl con barra",type:"pesas",zone:"superior",muscleGroup:["Bíceps"]},
  {name:"Curl con mancuernas",type:"pesas",zone:"superior",muscleGroup:["Bíceps"]},
  {name:"Curl martillo",type:"pesas",zone:"superior",muscleGroup:["Bíceps"]},
  {name:"Curl concentrado",type:"pesas",zone:"superior",muscleGroup:["Bíceps"]},
  {name:"Curl en polea",type:"pesas",zone:"superior",muscleGroup:["Bíceps"]},
  {name:"Curl predicador",type:"pesas",zone:"superior",muscleGroup:["Bíceps"]},
  {name:"Curl con barra Z",type:"pesas",zone:"superior",muscleGroup:["Bíceps"]},

  // ── TRÍCEPS ──
  {name:"Press francés",type:"pesas",zone:"superior",muscleGroup:["Tríceps"]},
  {name:"Tríceps en polea",type:"pesas",zone:"superior",muscleGroup:["Tríceps"]},
  {name:"Extensiones de tríceps",type:"pesas",zone:"superior",muscleGroup:["Tríceps"]},
  {name:"Patada de tríceps",type:"pesas",zone:"superior",muscleGroup:["Tríceps"]},
  {name:"Fondos en banco",type:"pesas",zone:"superior",muscleGroup:["Tríceps","Pecho"]},
  {name:"Press cerrado",type:"pesas",zone:"superior",muscleGroup:["Tríceps","Pecho"]},
  {name:"Tríceps con cuerda",type:"pesas",zone:"superior",muscleGroup:["Tríceps"]},

  // ── CUÁDRICEPS ──
  {name:"Sentadilla",type:"pesas",zone:"inferior",muscleGroup:["Cuádriceps","Glúteos"]},
  {name:"Sentadilla frontal",type:"pesas",zone:"inferior",muscleGroup:["Cuádriceps"]},
  {name:"Sentadilla búlgara",type:"pesas",zone:"inferior",muscleGroup:["Cuádriceps","Glúteos"]},
  {name:"Prensa de pierna",type:"pesas",zone:"inferior",muscleGroup:["Cuádriceps","Glúteos"]},
  {name:"Extensiones cuádriceps",type:"pesas",zone:"inferior",muscleGroup:["Cuádriceps"]},
  {name:"Zancadas",type:"pesas",zone:"inferior",muscleGroup:["Cuádriceps","Glúteos"]},
  {name:"Hack squat",type:"pesas",zone:"inferior",muscleGroup:["Cuádriceps"]},

  // ── ISQUIOTIBIALES ──
  {name:"Curl femoral",type:"pesas",zone:"inferior",muscleGroup:["Isquiotibiales"]},
  {name:"Peso muerto rumano",type:"pesas",zone:"inferior",muscleGroup:["Isquiotibiales","Glúteos","Espalda"]},
  {name:"Peso muerto",type:"pesas",zone:"inferior",muscleGroup:["Isquiotibiales","Espalda","Glúteos"]},
  {name:"Peso muerto sumo",type:"pesas",zone:"inferior",muscleGroup:["Isquiotibiales","Glúteos"]},

  // ── GLÚTEOS ──
  {name:"Hip thrust",type:"pesas",zone:"inferior",muscleGroup:["Glúteos"]},
  {name:"Patada de glúteo",type:"pesas",zone:"inferior",muscleGroup:["Glúteos"]},
  {name:"Puente de glúteo",type:"pesas",zone:"inferior",muscleGroup:["Glúteos"]},
  {name:"Aductores en máquina",type:"pesas",zone:"inferior",muscleGroup:["Cuádriceps"]},
  {name:"Abductores en máquina",type:"pesas",zone:"inferior",muscleGroup:["Glúteos"]},

  // ── PANTORRILLAS ──
  {name:"Pantorrillas",type:"pesas",zone:"inferior",muscleGroup:["Pantorrillas"]},
  {name:"Pantorrillas sentado",type:"pesas",zone:"inferior",muscleGroup:["Pantorrillas"]},

  // ── CORE ──
  {name:"Crunch",type:"pesas",zone:"core",muscleGroup:["Core"]},
  {name:"Plancha",type:"pesas",zone:"core",muscleGroup:["Core"]},
  {name:"Elevación de piernas",type:"pesas",zone:"core",muscleGroup:["Core"]},
  {name:"Russian twist",type:"pesas",zone:"core",muscleGroup:["Core"]},
  {name:"Ab wheel",type:"pesas",zone:"core",muscleGroup:["Core"]},
  {name:"Crunch en polea",type:"pesas",zone:"core",muscleGroup:["Core"]},

  // ── CARDIO ──
  {name:"Correr",type:"cardio",zone:"cardio",muscleGroup:["Cardio"]},
  {name:"Bicicleta estática",type:"cardio",zone:"cardio",muscleGroup:["Cardio"]},
  {name:"Elíptica",type:"cardio",zone:"cardio",muscleGroup:["Cardio"]},
  {name:"Remo ergómetro",type:"cardio",zone:"cardio",muscleGroup:["Cardio"]},
  {name:"Saltar cuerda",type:"cardio",zone:"cardio",muscleGroup:["Cardio"]},
  {name:"Caminadora",type:"cardio",zone:"cardio",muscleGroup:["Cardio"]},
  {name:"Stairmaster",type:"cardio",zone:"cardio",muscleGroup:["Cardio"]},
];

function searchExercises(query){
  if(!query||!query.trim())return EXERCISE_DB;
  const q=query.toLowerCase().trim();
  return EXERCISE_DB.filter(e=>e.name.toLowerCase().includes(q)||e.muscleGroup.some(m=>m.toLowerCase().includes(q)));
}

function getExerciseInfo(name){
  return EXERCISE_DB.find(e=>e.name===name)||null;
}

function getExerciseMuscleGroup(name){
  const found=EXERCISE_DB.find(e=>e.name===name);
  return found?.muscleGroup[0]||'Otro';
}

function getExercisesByMuscle(muscle){
  return EXERCISE_DB.filter(e=>e.muscleGroup.includes(muscle));
}

function getExercisesByZone(zone){
  return EXERCISE_DB.filter(e=>e.zone===zone);
}
