"use client";

import { useMemo, useState } from "react";
import type { ToolDefinition } from "@/data/tools";
import SignalToolIntro from "@/features/senal/SignalToolIntro";
import { calculateGainStaging, formatGainNumber } from "@/lib/signal/gain-staging";
import styles from "./GainStagingCalculator.module.css";

const verdictCopy = {
  clipping: "La etapa supera el techo definido. Baja ganancia o input antes de destruir transientes.",
  hot: "Nivel alto con poco margen. Util para color, riesgoso para buses acumulados.",
  nominal: "Rango sano para trabajo digital: senal visible, headroom suficiente.",
  low: "Nivel conservador. Puede estar bien, pero revisa si estas enterrando la senal cerca del ruido."
};

export default function GainStagingCalculator({ tool }: Readonly<{ tool: ToolDefinition }>) {
  const [inputLevelDbfs, setInputLevelDbfs] = useState(-18);
  const [gainDb, setGainDb] = useState(6);
  const [ceilingDbfs, setCeilingDbfs] = useState(-1);
  const [noiseFloorDbfs, setNoiseFloorDbfs] = useState(-90);

  const result = useMemo(
    () =>
      calculateGainStaging({
        inputLevelDbfs,
        gainDb,
        ceilingDbfs,
        noiseFloorDbfs
      }),
    [ceilingDbfs, gainDb, inputLevelDbfs, noiseFloorDbfs]
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
            <p>Stage model</p>
            <h3>Entrada y ganancia</h3>
          </div>

          <div className={styles.fieldGrid}>
            <NumberField label="Nivel entrada" unit="dBFS" value={inputLevelDbfs} onChange={setInputLevelDbfs} />
            <NumberField label="Ganancia" unit="dB" value={gainDb} onChange={setGainDb} />
            <NumberField label="Techo" unit="dBFS" value={ceilingDbfs} onChange={setCeilingDbfs} />
            <NumberField label="Ruido entrada" unit="dBFS" value={noiseFloorDbfs} onChange={setNoiseFloorDbfs} />
          </div>
        </div>

        <div className={styles.readoutPanel}>
          <div className={styles.heroReadout}>
            <span>Nivel de salida</span>
            <strong>{formatGainNumber(result.outputLevelDbfs, 1)} dBFS</strong>
            <p>{verdictCopy[result.verdict]}</p>
          </div>

          <div className={styles.headroomMeter}>
            <span style={{ width: `${Math.min(100, Math.max(0, (result.headroomDb / 24) * 100))}%` }} />
          </div>
        </div>
      </section>

      <section className={styles.metricsPanel}>
        <div className={styles.panelHeader}>
          <p>Stage readout</p>
          <h3>Margen util</h3>
        </div>
        <div className={styles.metricGrid}>
          <Metric label="Headroom" value={`${formatGainNumber(result.headroomDb, 2)} dB`} />
          <Metric label="Ruido salida" value={`${formatGainNumber(result.noiseFloorOutDbfs, 1)} dBFS`} />
          <Metric label="SNR etapa" value={`${formatGainNumber(result.snrDb, 1)} dB`} />
          <Metric label="Estado" value={result.isClipping ? "CLIP" : "OK"} />
        </div>
      </section>

      <section className={styles.ritualPanel} aria-label="Corrupted gain staging telemetry">
        <pre>{gainSigil}</pre>
        <div>
          <span>[GAIN_CHAIN]</span>
          <p>
            IN={formatGainNumber(inputLevelDbfs, 2)}dBFS // G={formatGainNumber(gainDb, 2)}dB // OUT=
            {formatGainNumber(result.outputLevelDbfs, 2)}dBFS
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

const gainSigil = String.raw`
 [IN]--(+dB)--[OUT]
   |          |
 NOISE     CEILING`;
