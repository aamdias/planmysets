import { IoIosBody } from "react-icons/io";
import { IoFitness } from "react-icons/io5";
import { GiAbdominalArmor } from "react-icons/gi";
import { GiLegArmor } from "react-icons/gi";
import { CgGym } from "react-icons/cg";

const fullGymItems = [
  { id: "treadmill", label: "Esteira", body: "cardio", bodyIcon: IoFitness },
  { id: "exercise-bike", label: "Bicicleta Ergométrica", body: "cardio", bodyIcon: IoFitness },
  { id: "rowing-machine", label: "Máquina de Remo", body: "cardio", bodyIcon: IoFitness },
  { id: "elliptical-trainer", label: "Elíptico", body: "cardio", bodyIcon: IoFitness },
  { id: "stair-climber", label: "Escalador", body: "cardio", bodyIcon: IoFitness },
  { id: "dumbbells", label: "Halteres", body: "full-body", bodyIcon: CgGym },
  { id: "barbell", label: "Barra", body: "full-body", bodyIcon: CgGym },
  { id: "bench-press", label: "Supino", body: "upper body", bodyIcon: GiAbdominalArmor },
  { id: "squat-rack", label: "Rack de Agachamento", body: "lower body", bodyIcon: GiLegArmor },
  { id: "leg-press", label: "Leg Press", body: "lower body", bodyIcon: GiLegArmor },
  { id: "lat-pulldown", label: "Puxada Alta", body: "upper body", bodyIcon: GiAbdominalArmor },
  { id: "seated-row", label: "Remada Sentada", body: "upper body", bodyIcon: GiAbdominalArmor },
  { id: "bicep-curl-machine", label: "Máquina de Rosca Bíceps", body: "upper body", bodyIcon: GiAbdominalArmor },
  { id: "tricep-extension-machine", label: "Máquina de Extensão de Tríceps", body: "upper body", bodyIcon: GiAbdominalArmor },
  { id: "shoulder-press-machine", label: "Máquina de Desenvolvimento de Ombros", body: "upper body", bodyIcon: GiAbdominalArmor },
  { id: "cable-crossover", label: "Crossover", body: "upper body", bodyIcon: GiAbdominalArmor },
  { id: "leg-curl-machine", label: "Máquina de Flexão de Pernas", body: "lower body", bodyIcon: GiLegArmor },
  { id: "leg-extension-machine", label: "Máquina de Extensão de Pernas", body: "lower body", bodyIcon: GiLegArmor },
  { id: "ab-crunch-machine", label: "Máquina de Abdominal", body: "upper body", bodyIcon: GiAbdominalArmor },
  { id: "smith-machine", label: "Smith Machine", body: "full-body", bodyIcon: IoIosBody },
  { id: "hack-squat-machine", label: "Máquina de Hack Squat", body: "lower body", bodyIcon: GiLegArmor },
  { id: "calf-raise-machine", label: "Máquina de Elevação de Panturrilhas", body: "lower body", bodyIcon: GiLegArmor },
  { id: "medicine-ball", label: "Bola Medicinal", body: "full-body", bodyIcon: IoIosBody },
  { id: "kettlebells", label: "Kettlebells", body: "full-body", bodyIcon: IoIosBody },
  { id: "resistance-bands", label: "Faixas de Resistência", body: "full-body", bodyIcon: IoIosBody },
  { id: "pull-up-bar", label: "Barra Fixa", body: "upper body", bodyIcon: GiAbdominalArmor },
  { id: "dip-station", label: "Estação de Mergulho", body: "upper body", bodyIcon: GiAbdominalArmor },
  { id: "preacher-curl-bench", label: "Banco Scott", body: "upper body", bodyIcon: GiAbdominalArmor },
  { id: "hyperextension-bench", label: "Banco de Hiperextensão", body: "upper body", bodyIcon: GiAbdominalArmor },
  { id: "roman-chair", label: "Cadeira Romana", body: "upper body", bodyIcon: GiAbdominalArmor },
  { id: "pec-deck-machine", label: "Máquina Pec Deck", body: "upper body", bodyIcon: GiAbdominalArmor },
  { id: "chest-press-machine", label: "Máquina de Pressão no Peito", body: "upper body", bodyIcon: GiAbdominalArmor },
  { id: "hip-abductor-machine", label: "Máquina de Abdução de Quadril", body: "lower body", bodyIcon: GiLegArmor },
  { id: "hip-adductor-machine", label: "Máquina de Adução de Quadril", body: "lower body", bodyIcon: GiLegArmor },
  { id: "glute-ham-raise-machine", label: "Máquina de Elevação de Glúteo-Ham", body: "lower body", bodyIcon: GiLegArmor },
  { id: "smith-cage", label: "Gaiola Smith", body: "full-body", bodyIcon: IoIosBody },
  { id: "leg-abduction-machine", label: "Máquina de Abdução de Pernas", body: "lower body", bodyIcon: GiLegArmor },
  { id: "leg-adduction-machine", label: "Máquina de Adução de Pernas", body: "lower body", bodyIcon: GiLegArmor },
  { id: "torso-rotation-machine", label: "Máquina de Rotação de Tronco", body: "upper body", bodyIcon: GiAbdominalArmor },
  { id: "total-gym", label: "Total Gym", body: "full-body", bodyIcon: IoIosBody },
  { id: "trx", label: "TRX", body: "full-body", bodyIcon: IoIosBody },
  { id: "battle-ropes", label: "Cordas de Batalha", body: "full-body", bodyIcon: IoIosBody },
  { id: "punching-bag", label: "Saco de Pancadas", body: "full-body", bodyIcon: IoIosBody },
  { id: "landmine", label: "Landmine", body: "full-body", bodyIcon: IoIosBody }
];

export default fullGymItems;
