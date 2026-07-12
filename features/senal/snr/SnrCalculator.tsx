"use client";

import { useMemo, useState } from "react";
import type { ToolDefinition } from "@/data/tools";
import { calculateSnr, formatSnrNumber } from "@/lib/signal/snr";
import styles from "./SnrCalculator.module.css";

const verdictCopy = {
  poor: "Ruido demasiado cerca de la senal. Revisa ganancia, tierra o etapa de captura.",
  usable: "Rango util para material tolerante, pero puede revelar hiss en pasajes suaves.",
  clean: "Margen limpio para produccion general y conversion robusta.",
  excellent: "Ruido muy por debajo de la senal. Buen margen para captura critica."
};

export default function SnrCalculator({ tool }: Readonly<{ tool: ToolDefinition }>) {
  const [signalLevelDb, setSignalLevelDb] = useState(-12);
  const [noiseLevelDb, setNoiseLevelDb] = useState(-84);
  const [targetSnrDb, setTargetSnrDb] = useState(60);

  const result = useMemo(
    () =>
      calculateSnr({
        signalLevelDb,
        noiseLevelDb,
        targetSnrDb
      }),
    [noiseLevelDb, signalLevelDb, targetSnrDb]
  );

  return (
    <article className={styles.tool}>
      <header className={styles.header}>
        <div>
          <p>{tool.category}</p>
          <h2>{tool.name}</h2>
          <span>{tool.description}</span>
        </div>
        <strong>{tool.status}</strong>
      </header>

      <section className={styles.workspace}>
        <div className={styles.controlsPanel}>
          <div className={styles.panelHeader}>
            <p>Noise floor</p>
            <h3>Niveles relativos</h3>
          </div>

          <div className={styles.fieldGrid}>
            <NumberField label="Senal" unit="dB" value={signalLevelDb} onChange={setSignalLevelDb} />
            <NumberField label="Ruido" unit="dB" value={noiseLevelDb} onChange={setNoiseLevelDb} />
            <NumberField label="Objetivo" unit="dB SNR" value={targetSnrDb} onChange={setTargetSnrDb} />
          </div>
        </div>

        <div className={styles.readoutPanel}>
          <div className={styles.heroReadout}>
            <span>SNR</span>
            <strong>{formatSnrNumber(result.snrDb, 1)} dB</strong>
            <p>{verdictCopy[result.verdict]}</p>
          </div>

          <div className={styles.marginStrip}>
            <span style={{ width: `${Math.min(100, Math.max(0, (result.snrDb / 100) * 100))}%` }} />
          </div>
        </div>
      </section>

      <section className={styles.metricsPanel}>
        <div className={styles.panelHeader}>
          <p>Ratio readout</p>
          <h3>Equivalencias</h3>
        </div>

        <div className={styles.metricGrid}>
          <Metric label="Ratio amplitud" value={`${formatSnrNumber(result.amplitudeRatio, 1)}:1`} />
          <Metric label="Ratio potencia" value={`${formatSnrNumber(result.powerRatio, 0)}:1`} />
          <Metric label="Bits equivalentes" value={`${formatSnrNumber(result.equivalentBits, 2)} bit`} />
          <Metric
            label="Margen objetivo"
            value={`${result.marginToTargetDb >= 0 ? "+" : ""}${formatSnrNumber(result.marginToTargetDb, 1)} dB`}
          />
        </div>
      </section>

      <section className={styles.notePanel}>
        <span>Lectura</span>
        <p>
          SNR usa la diferencia entre nivel de senal y piso de ruido en la misma escala relativa. Si mezclas dBu con dBFS
          sin calibracion, el resultado queda contaminado: skill issue clasico.
        </p>
      </section>

      <section className={styles.ritualPanel} aria-label="Corrupted SNR telemetry">
        <pre>{snrSigil}</pre>
        <div>
          <span>[NOISE_FLOOR]</span>
          <p>
            S={formatSnrNumber(signalLevelDb, 2)}dB // N={formatSnrNumber(noiseLevelDb, 2)}dB // SNR=
            {formatSnrNumber(result.snrDb, 3)}dB
          </p>
        </div>
      </section>
    </article>
  );
}

function NumberField({
  label,
  unit,
  value,
  onChange
}: Readonly<{
  label: string;
  unit: string;
  value: number;
  onChange: (value: number) => void;
}>) {
  return (
    <label className={styles.numberField}>
      <span>{label}</span>
      <div>
        <input
          type="number"
          step="0.1"
          value={value}
          onChange={(event) => onChange(safeNumber(event.target.valueAsNumber))}
        />
        <small>{unit}</small>
      </div>
    </label>
  );
}

function Metric({ label, value }: Readonly<{ label: string; value: string }>) {
  return (
    <div className={styles.metric}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function safeNumber(value: number) {
  return Number.isNaN(value) ? 0 : value;
}

const snrSigil = String.raw`
 SIGNAL =====>
      \ 
       > SNR
      /
 NOISE  ---->`;
