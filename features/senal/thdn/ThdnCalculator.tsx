"use client";

import { useMemo, useState } from "react";
import type { ToolDefinition } from "@/data/tools";
import SignalToolIntro from "@/features/senal/SignalToolIntro";
import { calculateThdn, formatThdnNumber } from "@/lib/signal/thdn";
import styles from "./ThdnCalculator.module.css";

const verdictCopy = {
  excellent: "Muy bajo. La distorsion y el ruido estan profundamente enterrados.",
  clean: "Limpio para medicion practica y cadena moderna.",
  colored: "Hay caracter audible o ruido relevante. Puede ser intencional, pero ya cuenta.",
  distorted: "THD+N alto. Revisa saturacion, ganancia, fuente o medicion."
};

export default function ThdnCalculator({ tool }: Readonly<{ tool: ToolDefinition }>) {
  const [fundamentalDbfs, setFundamentalDbfs] = useState(-6);
  const [harmonic2Dbfs, setHarmonic2Dbfs] = useState(-72);
  const [harmonic3Dbfs, setHarmonic3Dbfs] = useState(-78);
  const [harmonic4Dbfs, setHarmonic4Dbfs] = useState(-86);
  const [harmonic5Dbfs, setHarmonic5Dbfs] = useState(-90);
  const [noiseDbfs, setNoiseDbfs] = useState(-88);

  const result = useMemo(
    () =>
      calculateThdn({
        fundamentalDbfs,
        harmonic2Dbfs,
        harmonic3Dbfs,
        harmonic4Dbfs,
        harmonic5Dbfs,
        noiseDbfs
      }),
    [fundamentalDbfs, harmonic2Dbfs, harmonic3Dbfs, harmonic4Dbfs, harmonic5Dbfs, noiseDbfs]
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

      <SignalToolIntro tool={tool} />

      <section className={styles.workspace}>
        <div className={styles.controlsPanel}>
          <div className={styles.panelHeader}>
            <p>RMS components</p>
            <h3>Fundamental, armonicos y ruido</h3>
          </div>

          <div className={styles.fieldGrid}>
            <NumberField label="Fundamental" value={fundamentalDbfs} onChange={setFundamentalDbfs} />
            <NumberField label="H2" value={harmonic2Dbfs} onChange={setHarmonic2Dbfs} />
            <NumberField label="H3" value={harmonic3Dbfs} onChange={setHarmonic3Dbfs} />
            <NumberField label="H4" value={harmonic4Dbfs} onChange={setHarmonic4Dbfs} />
            <NumberField label="H5" value={harmonic5Dbfs} onChange={setHarmonic5Dbfs} />
            <NumberField label="Ruido" value={noiseDbfs} onChange={setNoiseDbfs} />
          </div>
        </div>

        <div className={styles.readoutPanel}>
          <div className={styles.heroReadout}>
            <span>THD+N</span>
            <strong>{formatThdnNumber(result.thdnPercent, 4)}%</strong>
            <p>{verdictCopy[result.verdict]}</p>
          </div>
          <div className={styles.distortionMeter}>
            <span style={{ width: `${Math.min(100, Math.max(1, result.thdnPercent * 100))}%` }} />
          </div>
        </div>
      </section>

      <section className={styles.metricsPanel}>
        <div className={styles.panelHeader}>
          <p>Distortion readout</p>
          <h3>Ratios derivados</h3>
        </div>
        <div className={styles.metricGrid}>
          <Metric label="THD" value={`${formatThdnNumber(result.thdPercent, 4)}%`} />
          <Metric label="THD dB" value={`${formatThdnNumber(result.thdDb, 2)} dB`} />
          <Metric label="THD+N dB" value={`${formatThdnNumber(result.thdnDb, 2)} dB`} />
          <Metric label="SINAD" value={`${formatThdnNumber(result.sinadDb, 2)} dB`} />
        </div>
      </section>

      <section className={styles.ritualPanel} aria-label="Corrupted THD+N telemetry">
        <pre>{thdnSigil}</pre>
        <div>
          <span>[DISTORTION_SUM]</span>
          <p>
            F={formatThdnNumber(fundamentalDbfs, 2)}dBFS // THD={formatThdnNumber(result.thdPercent, 5)}% // THDN=
            {formatThdnNumber(result.thdnPercent, 5)}%
          </p>
        </div>
      </section>
    </article>
  );
}

function NumberField({
  label,
  value,
  onChange
}: Readonly<{
  label: string;
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
        <small>dBFS</small>
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

const thdnSigil = String.raw`
 F0 ====> OUT
  | \ \ \ 
 H2 H3 N`;
