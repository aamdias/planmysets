import { IoIosBody } from "react-icons/io";
import { IoFitness } from "react-icons/io5";
import { GiAbdominalArmor } from "react-icons/gi";
import { GiLegArmor } from "react-icons/gi";
import { CgGym } from "react-icons/cg";

const defaultItems = [
  { id: "dumbbells", label: "Halteres", body: "full-body", bodyIcon: CgGym },
  { id: "barbells", label: "Barras", body: "full-body", bodyIcon: CgGym },
  { id: "cable crossover machine", label: "Máquina de Cross Over", body: "upper body", bodyIcon: GiAbdominalArmor },
  { id: "bench press", label: "Supino", body: "upper body", bodyIcon: GiAbdominalArmor },
  { id: "adjustable bench", label: "Banco Ajustável", body: "full-body", bodyIcon: IoIosBody },
  { id: "lat pull down machine", label: "Máquina de Pulldown", body: "upper body", bodyIcon: GiAbdominalArmor },
  { id: "ab roller", label: "Roda de Exercício Abdominal", body: "upper body", bodyIcon: GiAbdominalArmor },
  { id: "leg extension machine", label: "Máquina de Extensão de Pernas", body: "lower body", bodyIcon: GiLegArmor },
  { id: "treadmill", label: "Esteira", body: "cardio", bodyIcon: IoFitness },
  { id: "spin-bike", label: "Bicicleta Ergométrica", body: "cardio", bodyIcon: IoFitness },
  { id: "aerobic steps", label: "Steps Aeróbicos", body: "cardio", bodyIcon: IoFitness },
  { id: "seated row machine", label: "Máquina de Remada Sentada", body: "upper body", bodyIcon: GiAbdominalArmor },
  { id: "kettlebells", label: "Kettlebells", body: "full-body", bodyIcon: IoIosBody },
  { id: "exercise mat", label: "Tapete de Exercícios", body: "full-body", bodyIcon: IoIosBody },
  { id: "leg press", label: "Leg Press", body: "lower body", bodyIcon: GiLegArmor },
  { id: "pulley machine", label: "Máquina de Polia", body: "full-body", bodyIcon: IoIosBody },
];

export default defaultItems;
