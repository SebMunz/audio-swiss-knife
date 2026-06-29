"use client";

import { useMemo, useState } from "react";
import type { ToolDefinition } from "@/data/tools";
import {
  calculateLatency,
  formatLatencyNumber,
  type LatencyInputMode
} from "@/lib/signal/latency";
import styles from "./LatencyCalculator.module.css";

const modes: Array<{ id: LatencyInputMode; label: string; helper: string; unit: string }> = [
  { id: "samples", label: "Samples", helper: "Buffer o offset en muestras", unit: "spl" },
  { id: "milliseconds", label: "Milisegundos", helper: "Tiempo medido o declarado", unit: "ms" }
];

const commonSampleRates = [44100, 48000, 88200, 96000, 192000];

export default function LatencyCalculator({ tool }: Readonly<{ tool: ToolDefinition }>) {
  const [mode, setMode] = useState<LatencyInputMode>("samples");
  const [value, setValue] = useState(256);
  const [sampleRate, setSampleRate] = useState(48000);
  const [buffers, setBuffers] = useState(1);

  const result = useMemo(
    () =>
      calculateLatency({
        mode,
        value,
        sampleRate,
        buffers
      }),
    [buffers, mode, sampleRate, value]
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
            <p>Digital buffer</p>
            <h3>Entrada de latencia</h3>
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
            <span>{activeMode.label}</span>
            <div>
              <input
                type="number"
                min="0"
                step={mode === "samples" ? 1 : 0.01}
                value={value}
                onChange={(event) => setValue(clampNumber(event.target.valueAsNumber, 0))}
              />
              <small>{activeMode.unit}</small>
            </div>
          </label>

          <div className={styles.fieldGrid}>
            <label className={styles.numberField}>
              <span>Sample rate</span>
              <select value={sampleRate} onChange={(event) => setSampleRate(Number(event.target.value))}>
                {commonSampleRates.map((rate) => (
                  <option key={rate} value={rate}>
                    {rate} Hz
                  </option>
                ))}
              </select>
            </label>

            <label className={styles.numberField}>
              <span>Buffers</span>
              <div>
                <input
                  type="number"
                  min="1"
                  max="16"
                  step="1"
                  value={buffers}
                  onChange={(event) => setBuffers(clampNumber(event.target.valueAsNumber, 1, 16))}
                />
                <small>x</small>
              </div>
            </label>
          </div>
        </div>

        <div className={styles.readoutPanel}>
          <div className={styles.heroReadout}>
            <span>Latencia total</span>
            <strong>{formatLatencyNumber(result.totalMilliseconds, 2)} ms</strong>
            <p>{formatLatencyNumber(result.totalSamples, 1)} samples acumulados</p>
          </div>

          <div className={styles.meter}>
            <span style={{ width: `${Math.min(100, (result.totalMilliseconds / 25) * 100)}%` }} />
          </div>
        </div>
      </section>

      <section className={styles.metricsPanel}>
        <div className={styles.panelHeader}>
          <p>System view</p>
          <h3>Equivalencias de sistema</h3>
        </div>
        <div className={styles.metricGrid}>
          <Metric label="Por buffer" value={`${formatLatencyNumber(result.millisecondsPerBuffer, 3)} ms`} />
          <Metric label="Samples/buffer" value={formatLatencyNumber(result.samplesPerBuffer, 1)} />
          <Metric label="Round-trip" value={`${formatLatencyNumber(result.roundTripMilliseconds, 2)} ms`} />
          <Metric label="Frames @60fps" value={formatLatencyNumber(result.videoFrames60fps, 3)} />
        </div>
      </section>

      <section className={styles.ritualPanel} aria-label="Corrupted latency telemetry">
        <pre>{latencySigil}</pre>
        <div>
          <span>[BUFFER_LATENCY]</span>
          <p>
            SR={result.sampleRate}Hz // B={result.buffers} // LAT={formatLatencyNumber(result.totalMilliseconds, 4)}ms //
            RTT={formatLatencyNumber(result.roundTripMilliseconds, 4)}ms
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

const latencySigil = String.raw`
 [IN]--[BUF]--[DSP]
   \    ||    /
    [CLOCK_0]`;
