import type { ToolDefinition } from "@/data/tools";
import styles from "./SignalToolIntro.module.css";

type SignalToolIntroCopy = {
  normal: {
    what: string;
    use: string;
  };
  corrupted: {
    title: string;
    what: string;
    use: string;
  };
};

const introCopy: Record<string, SignalToolIntroCopy> = {
  "delay-distance": {
    normal: {
      what: "Convierte distancia fisica, milisegundos y samples usando velocidad del sonido ajustada por temperatura.",
      use: "Sirve para alinear monitores, subs, delays de PA o diferencias de llegada entre fuentes acusticas."
    },
    corrupted: {
      title: "[DERIVA_TEMPORAL]",
      what: "Traduce separacion del recinto a retardo de bus: metros, ticks y muestras bajo reloj termico.",
      use: "Usalo para sellar desfases entre nodos fisicos antes de que el eco contamine el vector."
    }
  },
  "eq-q-bw": {
    normal: {
      what: "Convierte entre factor Q y bandwidth en octavas, mostrando el rango de frecuencias alrededor de f0.",
      use: "Sirve para replicar ajustes entre ecualizadores, estimar ancho de correccion y elegir filtros mas quirurgicos o musicales."
    },
    corrupted: {
      title: "[SELLO_QBW]",
      what: "Calcula el ancho espectral del filtro y delimita el circulo afectado alrededor de la frecuencia central.",
      use: "Usalo para grabar coeficientes limpios en el grimorio sin abrir una herida demasiado amplia en el espectro."
    }
  },
  phase: {
    normal: {
      what: "Calcula fase en grados, radianes y ciclos a partir de frecuencia y delay, o el delay equivalente desde una fase.",
      use: "Sirve para alinear drivers, subs, microfonos o fuentes duplicadas cuando el problema real es tiempo convertido en angulo."
    },
    corrupted: {
      title: "[SINCRONIA_VECTORIAL]",
      what: "Envuelve el desplazamiento temporal en un circulo de 360 grados y revela su residuo angular.",
      use: "Usalo para corregir vectores que orbitan fuera de fase antes de que cancelen el sello principal."
    }
  },
  latency: {
    normal: {
      what: "Convierte samples y milisegundos segun sample rate, acumulando multiples buffers y estimando round-trip.",
      use: "Sirve para evaluar buffers de interfaz, monitoreo, DSP, sincronizacion con video y latencia total del sistema."
    },
    corrupted: {
      title: "[RELOJ_DE_BUFFER]",
      what: "Mide la espera digital del host: muestras, buffers, retorno y frames consumidos por el clock.",
      use: "Usalo para detectar cuanto tiempo roba el kernel antes de devolver la senal al plano audible."
    }
  },
  "audio-units": {
    normal: {
      what: "Convierte dBu, dBV y dBFS mediante referencia de alineacion, y calcula presion para dBSPL como dominio separado.",
      use: "Sirve para comparar niveles analogicos, digitales y acusticos sin mezclar escalas incompatibles sin calibracion."
    },
    corrupted: {
      title: "[TABLA_DE_REFERENCIAS]",
      what: "Cruza voltaje y escala digital bajo pacto de calibracion; mantiene presion acustica en su propio circulo.",
      use: "Usalo para evitar conversiones impuras entre dominios que no comparten el mismo altar de referencia."
    }
  },
  snr: {
    normal: {
      what: "Calcula relacion senal-ruido como diferencia de niveles, ratio de amplitud, ratio de potencia y bits equivalentes.",
      use: "Sirve para estimar margen util, diagnosticar ruido de cadena y decidir si una captura tiene headroom limpio."
    },
    corrupted: {
      title: "[PISO_DE_RUIDO]",
      what: "Mide cuanta sombra queda bajo la senal y traduce esa distancia a ratios, bits y margen de supervivencia.",
      use: "Usalo para saber si el bus porta una ofrenda limpia o si el ruido ya mordio el borde del ritual."
    }
  }
};

export default function SignalToolIntro({ tool }: Readonly<{ tool: ToolDefinition }>) {
  const copy = introCopy[tool.id];

  if (!copy) {
    return null;
  }

  return (
    <section className={styles.intro} aria-label="Descripcion de herramienta">
      <div className={styles.normalIntro}>
        <div>
          <span>Que hace</span>
          <p>{copy.normal.what}</p>
        </div>
        <div>
          <span>Para que sirve</span>
          <p>{copy.normal.use}</p>
        </div>
      </div>

      <div className={styles.corruptedIntro}>
        <span>{copy.corrupted.title}</span>
        <div>
          <p>{copy.corrupted.what}</p>
          <p>{copy.corrupted.use}</p>
        </div>
      </div>
    </section>
  );
}
