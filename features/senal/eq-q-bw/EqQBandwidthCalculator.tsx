"use client";

import { useMemo, useState } from "react";
import type { ToolDefinition } from "@/data/tools";
import {
  calculateEqQBandwidth,
  formatEqNumber,
  formatFrequency,
  type EqInputMode
} from "@/lib/signal/eq-q-bw";
import styles from "./EqQBandwidthCalculator.module.css";

const modeOptions: Array<{ id: EqInputMode; label: string; helper: string; unit: string }> = [
  { id: "q", label: "Q", helper: "Factor de calidad del filtro", unit: "Q" },
  { id: "bandwidth", label: "BW", helper: "Ancho en octavas", unit: "oct" }
];

export default function EqQBandwidthCalculator({ tool }: Readonly<{ tool: ToolDefinition }>) {
  const [mode, setMode] = useState<EqInputMode>("q");
  const [value, setValue] = useState(1.41);
  const [centerFrequency, setCenterFrequency] = useState(1000);

  const result = useMemo(
    () =>
      calculateEqQBandwidth({
        mode,
        value,
        centerFrequency
      }),
    [centerFrequency, mode, value]
  );

  const activeMode = modeOptions.find((option) => option.id === mode) ?? modeOptions[0];

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
            <p>Parametric EQ</p>
            <h3>Conversion Q/BW</h3>
          </div>

          <div className={styles.modeGrid} aria-label="Seleccionar modo de entrada">
            {modeOptions.map((option) => (
              <button
                key={option.id}
                className={option.id === mode ? styles.modeActive : styles.modeButton}
                type="button"
                onClick={() => setMode(option.id)}
              >
                <span>{option.label}</span>
                <small>{option.helper}</small>
              </button>
            ))}
          </div>

          <label className={styles.primaryField}>
            <span>{activeMode.label}</span>
            <div>
              <input
                type="number"
                min="0.001"
                step={mode === "q" ? 0.01 : 0.05}
                value={value}
                onChange={(event) => setValue(clampNumber(event.target.valueAsNumber, 0.001))}
              />
              <small>{activeMode.unit}</small>
            </div>
          </label>

          <label className={styles.primaryField}>
            <span>Frecuencia central</span>
            <div>
              <input
                type="number"
                min="1"
                max="96000"
                step="1"
                value={centerFrequency}
                onChange={(event) => setCenterFrequency(clampNumber(event.target.valueAsNumber, 1, 96000))}
              />
              <small>Hz</small>
            </div>
          </label>
        </div>

        <div className={styles.readoutPanel}>
          <div className={styles.heroReadout}>
            <span>{mode === "q" ? "Bandwidth equivalente" : "Q equivalente"}</span>
            <strong>{mode === "q" ? `${formatEqNumber(result.bandwidthOctaves, 3)} oct` : formatEqNumber(result.q, 3)}</strong>
            <p>
              {formatFrequency(result.lowerFrequency)} - {formatFrequency(result.upperFrequency)}
            </p>
          </div>

          <div className={styles.metricGrid}>
            <Metric label="Q" value={formatEqNumber(result.q, 3)} />
            <Metric label="Bandwidth" value={`${formatEqNumber(result.bandwidthOctaves, 3)} oct`} />
            <Metric label="Frecuencia baja" value={formatFrequency(result.lowerFrequency)} />
            <Metric label="Frecuencia alta" value={formatFrequency(result.upperFrequency)} />
          </div>
        </div>
      </section>

      <section className={styles.bandPanel}>
        <div className={styles.panelHeader}>
          <p>Filter window</p>
          <h3>Zona afectada alrededor de f0</h3>
        </div>
        <div className={styles.bandTrack}>
          <span>{formatFrequency(result.lowerFrequency)}</span>
          <div>
            <i />
          </div>
          <span>{formatFrequency(result.upperFrequency)}</span>
        </div>
        <div className={styles.detailGrid}>
          <Metric label="Centro" value={formatFrequency(centerFrequency)} />
          <Metric label="Ancho absoluto" value={formatFrequency(result.frequencySpan)} />
          <Metric label="Uso tipico" value={getUseCase(result.q)} />
        </div>
      </section>

      <section className={styles.ritualPanel} aria-label="Corrupted EQ telemetry">
        <pre>{eqSigil}</pre>
        <div>
          <span>[FILTER_SEAL]</span>
          <p>
            Q={formatEqNumber(result.q, 4)} // BW={formatEqNumber(result.bandwidthOctaves, 4)}oct // F0=
            {formatFrequency(centerFrequency)}
          </p>
        </div>
      </section>
    </article>
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

function clampNumber(value: number, min: number, max = Number.POSITIVE_INFINITY) {
  if (Number.isNaN(value)) {
    return min;
  }

  return Math.min(max, Math.max(min, value));
}

function getUseCase(q: number) {
  if (q >= 8) {
    return "Notch quirurgico";
  }

  if (q >= 2.5) {
    return "Correccion estrecha";
  }

  if (q >= 0.7) {
    return "EQ musical";
  }

  return "Curva amplia";
}

const eqSigil = String.raw`
  +-----+
  | Q/B |
 +-+-F-+-+
  | OCT |
  +-----+`;
