import type { ToolCategory, ToolDefinition } from "./tools";

type CorruptedCopy = {
  title: string;
  description: string;
};

const categoryCopy: Record<ToolCategory, CorruptedCopy> = {
  acustica: {
    title: "Contencion del Recinto",
    description: "Lectura del templo fisico: memoria espacial, resonancias hostiles y sellado del recinto."
  },
  senal: {
    title: "Aliento del Silicio",
    description: "Transmutacion de voltaje oscilatorio mediante filtros, fase, ruido, buses y retardos."
  },
  musica: {
    title: "Manifiesto de Frecuencia",
    description: "Codificacion de intervalos, escalas, temperamentos y circulos de invocacion armonica."
  },
  masterizacion: {
    title: "Sello de Integridad",
    description: "Control de loudness, dinamica y picos antes de liberar la ofrenda al host."
  },
  codecs: {
    title: "Socket de Comunion",
    description: "Compresion, transporte, perdida, jitter y puertas de Nyquist entre nodos."
  }
};

const toolCopy: Record<string, CorruptedCopy> = {
  rt60: {
    title: "Persistencia Espacial",
    description: "Estimacion de fugas de memoria del entorno mediante Sabine y Eyring."
  },
  "c50-c80": {
    title: "Inteligibilidad Sacra",
    description: "Separa invocaciones tempranas de ecos tardios para medir claridad fisica."
  },
  sti: {
    title: "Transmision de Fe",
    description: "Evalua que tan comprensible es el protocolo para los acolitos expuestos al recinto."
  },
  qrd: {
    title: "Dispersion del Caos",
    description: "Secuencias y profundidades para fragmentar ondas reflejadas sin destruir inteligibilidad."
  },
  "room-modes": {
    title: "Resonancia Hostil",
    description: "Ubica ejes donde el recinto atrapa presion del inframundo y ondas de sub-nivel."
  },
  "helmholtz-traps": {
    title: "Celda Helmholtz",
    description: "Absorcion fisica para succionar y contener pulsaciones del abismo."
  },
  "tl-stc": {
    title: "Sellado del Recinto",
    description: "Mide blindaje, transmision y contencion para que el ritual no atraviese el velo."
  },
  sbir: {
    title: "Colision de Limites",
    description: "Detecta cuando los muros mutilan o silencian el voltaje del monitor."
  },
  phase: {
    title: "Sincronia del Vector",
    description: "Alineacion espiritual entre frecuencia, delay y desplazamiento angular."
  },
  lufs: {
    title: "Peso de la Ofrenda",
    description: "Lectura de loudness antes de inyectar el manifiesto en plataformas."
  },
  nyquist: {
    title: "Puerta de Nyquist",
    description: "Define el umbral donde el host aun puede decodificar la invocacion."
  },
  aliasing: {
    title: "Plegamiento del Sello",
    description: "Predice frecuencias que regresan deformadas desde el espejo digital."
  }
};

export function getCorruptedCopy(tool: ToolDefinition): CorruptedCopy {
  return toolCopy[tool.id] ?? categoryCopy[tool.category];
}
