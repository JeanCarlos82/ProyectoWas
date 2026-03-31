const EXERCISE_DB = [
  // ── PECHO ──
  {name:"Press banca",type:"pesas",muscleGroup:"Pecho",secondary:["Tríceps","Hombros"]},
  {name:"Press inclinado",type:"pesas",muscleGroup:"Pecho",secondary:["Tríceps","Hombros"]},
  {name:"Press declinado",type:"pesas",muscleGroup:"Pecho",secondary:["Tríceps"]},
  {name:"Press con mancuernas",type:"pesas",muscleGroup:"Pecho",secondary:["Tríceps","Hombros"]},
  {name:"Aperturas mancuernas",type:"pesas",muscleGroup:"Pecho",secondary:[]},
  {name:"Aperturas en polea",type:"pesas",muscleGroup:"Pecho",secondary:[]},
  {name:"Fondos en paralelas",type:"pesas",muscleGroup:"Pecho",secondary:["Tríceps"]},
  {name:"Pullover",type:"pesas",muscleGroup:"Pecho",secondary:["Espalda"]},
  {name:"Press en máquina",type:"pesas",muscleGroup:"Pecho",secondary:["Tríceps"]},

  // ── ESPALDA ──
  {name:"Jalón al pecho",type:"pesas",muscleGroup:"Espalda",secondary:["Bíceps"]},
  {name:"Jalón tras nuca",type:"pesas",muscleGroup:"Espalda",secondary:["Bíceps"]},
  {name:"Remo con barra",type:"pesas",muscleGroup:"Espalda",secondary:["Bíceps"]},
  {name:"Remo con mancuerna",type:"pesas",muscleGroup:"Espalda",secondary:["Bíceps"]},
  {name:"Remo en polea baja",type:"pesas",muscleGroup:"Espalda",secondary:["Bíceps"]},
  {name:"Peso muerto",type:"pesas",muscleGroup:"Espalda",secondary:["Pierna","Glúteos"]},
  {name:"Dominadas",type:"pesas",muscleGroup:"Espalda",secondary:["Bíceps"]},
  {name:"Remo en máquina",type:"pesas",muscleGroup:"Espalda",secondary:["Bíceps"]},
  {name:"Face pull",type:"pesas",muscleGroup:"Espalda",secondary:["Hombros"]},

  // ── HOMBROS ──
  {name:"Press militar",type:"pesas",muscleGroup:"Hombros",secondary:["Tríceps"]},
  {name:"Press Arnold",type:"pesas",muscleGroup:"Hombros",secondary:["Tríceps"]},
  {name:"Elevaciones laterales",type:"pesas",muscleGroup:"Hombros",secondary:[]},
  {name:"Elevaciones frontales",type:"pesas",muscleGroup:"Hombros",secondary:[]},
  {name:"Pájaros",type:"pesas",muscleGroup:"Hombros",secondary:["Espalda"]},
  {name:"Encogimientos",type:"pesas",muscleGroup:"Hombros",secondary:[]},
  {name:"Press con mancuernas hombro",type:"pesas",muscleGroup:"Hombros",secondary:["Tríceps"]},
  {name:"Elevaciones laterales en polea",type:"pesas",muscleGroup:"Hombros",secondary:[]},

  // ── BÍCEPS ──
  {name:"Curl con barra",type:"pesas",muscleGroup:"Bíceps",secondary:[]},
  {name:"Curl con mancuernas",type:"pesas",muscleGroup:"Bíceps",secondary:[]},
  {name:"Curl martillo",type:"pesas",muscleGroup:"Bíceps",secondary:[]},
  {name:"Curl concentrado",type:"pesas",muscleGroup:"Bíceps",secondary:[]},
  {name:"Curl en polea",type:"pesas",muscleGroup:"Bíceps",secondary:[]},
  {name:"Curl predicador",type:"pesas",muscleGroup:"Bíceps",secondary:[]},
  {name:"Curl con barra Z",type:"pesas",muscleGroup:"Bíceps",secondary:[]},

  // ── TRÍCEPS ──
  {name:"Press francés",type:"pesas",muscleGroup:"Tríceps",secondary:[]},
  {name:"Tríceps en polea",type:"pesas",muscleGroup:"Tríceps",secondary:[]},
  {name:"Extensiones de tríceps",type:"pesas",muscleGroup:"Tríceps",secondary:[]},
  {name:"Patada de tríceps",type:"pesas",muscleGroup:"Tríceps",secondary:[]},
  {name:"Fondos en banco",type:"pesas",muscleGroup:"Tríceps",secondary:["Pecho"]},
  {name:"Press cerrado",type:"pesas",muscleGroup:"Tríceps",secondary:["Pecho"]},
  {name:"Tríceps con cuerda",type:"pesas",muscleGroup:"Tríceps",secondary:[]},

  // ── PIERNA ──
  {name:"Sentadilla",type:"pesas",muscleGroup:"Pierna",secondary:["Glúteos","Core"]},
  {name:"Sentadilla frontal",type:"pesas",muscleGroup:"Pierna",secondary:["Core"]},
  {name:"Sentadilla búlgara",type:"pesas",muscleGroup:"Pierna",secondary:["Glúteos"]},
  {name:"Prensa de pierna",type:"pesas",muscleGroup:"Pierna",secondary:["Glúteos"]},
  {name:"Extensiones cuádriceps",type:"pesas",muscleGroup:"Pierna",secondary:[]},
  {name:"Curl femoral",type:"pesas",muscleGroup:"Pierna",secondary:[]},
  {name:"Peso muerto rumano",type:"pesas",muscleGroup:"Pierna",secondary:["Glúteos","Espalda"]},
  {name:"Zancadas",type:"pesas",muscleGroup:"Pierna",secondary:["Glúteos"]},
  {name:"Pantorrillas",type:"pesas",muscleGroup:"Pierna",secondary:[]},
  {name:"Hack squat",type:"pesas",muscleGroup:"Pierna",secondary:["Glúteos"]},
  {name:"Aductores en máquina",type:"pesas",muscleGroup:"Pierna",secondary:[]},
  {name:"Abductores en máquina",type:"pesas",muscleGroup:"Pierna",secondary:["Glúteos"]},

  // ── GLÚTEOS ──
  {name:"Hip thrust",type:"pesas",muscleGroup:"Glúteos",secondary:["Pierna"]},
  {name:"Peso muerto sumo",type:"pesas",muscleGroup:"Glúteos",secondary:["Pierna","Espalda"]},
  {name:"Patada de glúteo",type:"pesas",muscleGroup:"Glúteos",secondary:[]},
  {name:"Puente de glúteo",type:"pesas",muscleGroup:"Glúteos",secondary:[]},

  // ── CORE ──
  {name:"Crunch",type:"pesas",muscleGroup:"Core",secondary:[]},
  {name:"Plancha",type:"pesas",muscleGroup:"Core",secondary:[]},
  {name:"Elevación de piernas",type:"pesas",muscleGroup:"Core",secondary:[]},
  {name:"Russian twist",type:"pesas",muscleGroup:"Core",secondary:[]},
  {name:"Ab wheel",type:"pesas",muscleGroup:"Core",secondary:[]},
  {name:"Crunch en polea",type:"pesas",muscleGroup:"Core",secondary:[]},

  // ── CARDIO ──
  {name:"Correr",type:"cardio",muscleGroup:"Cardio",secondary:[]},
  {name:"Bicicleta estática",type:"cardio",muscleGroup:"Cardio",secondary:[]},
  {name:"Elíptica",type:"cardio",muscleGroup:"Cardio",secondary:[]},
  {name:"Remo ergómetro",type:"cardio",muscleGroup:"Cardio",secondary:[]},
  {name:"Saltar cuerda",type:"cardio",muscleGroup:"Cardio",secondary:[]},
  {name:"Caminadora",type:"cardio",muscleGroup:"Cardio",secondary:[]},
  {name:"Stairmaster",type:"cardio",muscleGroup:"Cardio",secondary:[]},
];

const MUSCLE_GROUPS = ["Pecho","Espalda","Hombros","Bíceps","Tríceps","Pierna","Glúteos","Core","Cardio"];

function searchExercises(query){
  if(!query||!query.trim())return EXERCISE_DB;
  const q=query.toLowerCase().trim();
  return EXERCISE_DB.filter(e=>e.name.toLowerCase().includes(q)||e.muscleGroup.toLowerCase().includes(q));
}

function getExerciseMuscleGroup(name){
  const found=EXERCISE_DB.find(e=>e.name===name);
  return found?.muscleGroup||'Otro';
}
