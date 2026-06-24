"use client";

import type { CSSProperties } from "react";
import { useMemo, useState } from "react";
import type { ToolDefinition } from "@/data/tools";
import {
  calculateDelayDistance,
  formatDelay,
  type DelaySource
} from "@/lib/signal/delay-distance";
import styles from "./DelayDistanceCalculator.module.css";

const sourceOptions: Array<{ id: DelaySource; label: string; unit: string; helper: string }> = [
  { id: "milliseconds", label: "Tiempo", unit: "ms", helper: "Delay medido o deseado" },
  { id: "meters", label: "Distancia", unit: "m", helper: "Separacion fisica entre fuente y destino" },
  { id: "samples", label: "Samples", unit: "spl", helper: "Offset digital a sample rate fijo" }
];

export default function DelayDistanceCalculator({ tool }: Readonly<{ tool: ToolDefinition }>) {
  const [source, setSource] = useState<DelaySource>("meters");
  const [value, setValue] = useState(3.4);
  const [temperature, setTemperature] = useState(20);
  const [sampleRate, setSampleRate] = useState(48000);

  const result = useMemo(
    () =>
      calculateDelayDistance({
        source,
        value,
        temperatureCelsius: temperature,
        sampleRate
      }),
    [sampleRate, source, temperature, value]
  );

  const activeOption = sourceOptions.find((option) => option.id === source) ?? sourceOptions[0];

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
            <p>Propagation input</p>
            <h3>Fuente de calculo</h3>
          </div>

          <div className={styles.sourceGrid} aria-label="Seleccionar magnitud base">
            {sourceOptions.map((option) => (
              <button
                key={option.id}
                className={option.id === source ? styles.sourceActive : styles.sourceButton}
                type="button"
                onClick={() => setSource(option.id)}
              >
                <span>{option.label}</span>
                <small>{option.helper}</small>
              </button>
            ))}
          </div>

          <label className={styles.primaryField}>
            <span>{activeOption.label}</span>
            <div>
              <input
                type="number"
                min="0"
                step={source === "samples" ? 1 : 0.01}
                value={value}
                onChange={(event) => setValue(clampNumber(event.target.valueAsNumber, 0))}
              />
              <small>{activeOption.unit}</small>
            </div>
          </label>

          <div className={styles.fieldGrid}>
            <NumberField
              label="Temperatura"
              unit="C"
              value={temperature}
              min={-20}
              max={50}
              step={0.5}
              onChange={setTemperature}
            />
            <NumberField
              label="Sample rate"
              unit="Hz"
              value={sampleRate}
              min={8000}
              max={384000}
              step={1000}
              onChange={setSampleRate}
            />
          </div>
        </div>

        <div className={styles.readoutPanel}>
          <div className={styles.heroReadout}>
            <span>Delay equivalente</span>
            <strong>{formatDelay(result.milliseconds)} ms</strong>
            <p>
              {formatDelay(result.meters, 3)} m a {formatDelay(result.speedOfSound, 1)} m/s
            </p>
          </div>

          <div className={styles.metricGrid}>
            <Metric label="Distancia" value={`${formatDelay(result.meters, 3)} m`} />
            <Metric label="Distancia imperial" value={`${formatDelay(result.feet, 2)} ft`} />
            <Metric label="Samples" value={formatDelay(result.samples, 1)} />
            <Metric label="Velocidad sonido" value={`${formatDelay(result.speedOfSound, 1)} m/s`} />
          </div>
        </div>
      </section>

      <section className={styles.phasePanel}>
        <div className={styles.panelHeader}>
          <p>Alignment hints</p>
          <h3>Lectura rapida de fase</h3>
        </div>
        <div className={styles.phaseGrid}>
          <PhaseDial label="100 Hz" value={result.phaseAt100Hz} />
          <PhaseDial label="1 kHz" value={result.phaseAt1000Hz} />
          <div className={styles.notePanel}>
            <span>Uso practico</span>
            <p>
              Para alinear fuentes, convierte la diferencia fisica a milisegundos o samples y compensa en el procesador.
              La fase mostrada esta envuelta a 0-360 grados para una referencia rapida.
            </p>
          </div>
        </div>
      </section>

      <section className={styles.ritualPanel} aria-label="Corrupted telemetry">
        <pre>{delaySigil}</pre>
        <div>
          <span>[TEMPORAL_DRIFT]</span>
          <p>
            {formatDelay(result.milliseconds, 3)}ms // {formatDelay(result.samples, 2)}spl // AIR_BUS_
            {formatDelay(result.speedOfSound, 1)}MS
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
  min,
  max,
  step,
  onChange
}: Readonly<{
  label: string;
  unit: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
}>) {
  return (
    <label className={styles.numberField}>
      <span>{label}</span>
      <div>
        <input
          type="number"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(event) => onChange(clampNumber(event.target.valueAsNumber, min, max))}
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

function PhaseDial({ label, value }: Readonly<{ label: string; value: number }>) {
  const phasePercent = `${(value / 360) * 100}%`;

  return (
    <div className={styles.phaseDial}>
      <span>{label}</span>
      <strong>{formatDelay(value, 1)} deg</strong>
      <div style={{ "--phase": phasePercent } as CSSProperties} />
    </div>
  );
}

function clampNumber(value: number, min: number, max = Number.POSITIVE_INFINITY) {
  if (Number.isNaN(value)) {
    return min;
  }

  return Math.min(max, Math.max(min, value));
}

const delaySigil = String.raw`
   /\      [DELAY]
  /__\   m <-> ms
  \  /   samples
   \/    phase`;
