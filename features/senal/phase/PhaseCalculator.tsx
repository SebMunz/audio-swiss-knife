"use client";

import type { CSSProperties } from "react";
import { useMemo, useState } from "react";
import type { ToolDefinition } from "@/data/tools";
import {
  calculatePhase,
  formatPhaseNumber,
  type PhaseInputMode
} from "@/lib/signal/phase";
import styles from "./PhaseCalculator.module.css";

const modes: Array<{ id: PhaseInputMode; label: string; helper: string; unit: string }> = [
  { id: "delay", label: "Delay", helper: "ms hacia grados/radianes", unit: "ms" },
  { id: "phase", label: "Fase", helper: "grados hacia delay equivalente", unit: "deg" }
];

export default function PhaseCalculator({ tool }: Readonly<{ tool: ToolDefinition }>) {
  const [mode, setMode] = useState<PhaseInputMode>("delay");
  const [frequency, setFrequency] = useState(100);
  const [value, setValue] = useState(2.5);

  const result = useMemo(
    () =>
      calculatePhase({
        mode,
        frequency,
        value
      }),
    [frequency, mode, value]
  );

  const activeMode = modes.find((item) => item.id === mode) ?? modes[0];

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
            <p>Phase vector</p>
            <h3>Entrada de alineacion</h3>
          </div>

          <div className={styles.modeGrid} aria-label="Seleccionar modo de entrada">
            {modes.map((item) => (
              <button
                key={item.id}
                className={item.id === mode ? styles.modeActive : styles.modeButton}
                type="button"
                onClick={() => setMode(item.id)}
              >
                <span>{item.label}</span>
                <small>{item.helper}</small>
              </button>
            ))}
          </div>

          <label className={styles.primaryField}>
            <span>Frecuencia</span>
            <div>
              <input
                type="number"
                min="0.001"
                step="1"
                value={frequency}
                onChange={(event) => setFrequency(clampNumber(event.target.valueAsNumber, 0.001))}
              />
              <small>Hz</small>
            </div>
          </label>

          <label className={styles.primaryField}>
            <span>{activeMode.label}</span>
            <div>
              <input
                type="number"
                step={mode === "delay" ? 0.01 : 1}
                value={value}
                onChange={(event) => setValue(safeNumber(event.target.valueAsNumber))}
              />
              <small>{activeMode.unit}</small>
            </div>
          </label>
        </div>

        <div className={styles.readoutPanel}>
          <div className={styles.heroReadout}>
            <span>Fase envuelta</span>
            <strong>{formatPhaseNumber(result.wrappedDegrees, 1)} deg</strong>
            <p>{formatPhaseNumber(result.signedDegrees, 1)} deg con signo / {formatPhaseNumber(result.radians, 3)} rad</p>
          </div>

          <PhaseDial value={result.wrappedDegrees} />
        </div>
      </section>

      <section className={styles.metricsPanel}>
        <div className={styles.panelHeader}>
          <p>Derived values</p>
          <h3>Equivalencias</h3>
        </div>
        <div className={styles.metricGrid}>
          <Metric label="Delay" value={`${formatPhaseNumber(result.delayMs, 3)} ms`} />
          <Metric label="Periodo" value={`${formatPhaseNumber(result.periodMs, 3)} ms`} />
          <Metric label="Ciclos" value={formatPhaseNumber(result.cycles, 4)} />
          <Metric label="Samples @48k" value={formatPhaseNumber(result.delaySamples48k, 2)} />
        </div>
      </section>

      <section className={styles.ritualPanel} aria-label="Corrupted phase telemetry">
        <pre>{phaseSigil}</pre>
        <div>
          <span>[VECTOR_SYNC]</span>
          <p>
            F={formatPhaseNumber(result.frequency, 2)}Hz // D={formatPhaseNumber(result.delayMs, 4)}ms // PHI=
            {formatPhaseNumber(result.wrappedDegrees, 2)}deg
          </p>
        </div>
      </section>
    </article>
  );
}

function PhaseDial({ value }: Readonly<{ value: number }>) {
  return (
    <div className={styles.phaseDial}>
      <div style={{ "--phase": `${value}deg` } as CSSProperties}>
        <i />
      </div>
      <span>0-360 deg</span>
    </div>
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

function clampNumber(value: number, min: number) {
  if (Number.isNaN(value)) {
    return min;
  }

  return Math.max(min, value);
}

function safeNumber(value: number) {
  return Number.isNaN(value) ? 0 : value;
}

const phaseSigil = String.raw`
  .----.
 / 90  \
|180 + 0|
 \ 270 /
  '----'`;
