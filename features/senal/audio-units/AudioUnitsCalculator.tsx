"use client";

import { useMemo, useState } from "react";
import type { ToolDefinition } from "@/data/tools";
import {
  calculateAudioUnits,
  formatAudioNumber,
  type AudioUnit
} from "@/lib/signal/audio-units";
import SignalToolIntro from "@/features/senal/SignalToolIntro";
import styles from "./AudioUnitsCalculator.module.css";

const units: Array<{ id: AudioUnit; label: string; helper: string }> = [
  { id: "dbu", label: "dBu", helper: "Referencia 0.775 Vrms" },
  { id: "dbv", label: "dBV", helper: "Referencia 1.000 Vrms" },
  { id: "dbfs", label: "dBFS", helper: "Nivel digital relativo a full scale" },
  { id: "dbspl", label: "dBSPL", helper: "Presion acustica ref. 20 uPa" }
];

export default function AudioUnitsCalculator({ tool }: Readonly<{ tool: ToolDefinition }>) {
  const [unit, setUnit] = useState<AudioUnit>("dbu");
  const [level, setLevel] = useState(4);
  const [dbfsReferenceDbu, setDbfsReferenceDbu] = useState(24);

  const result = useMemo(
    () =>
      calculateAudioUnits({
        unit,
        level,
        dbfsReferenceDbu
      }),
    [dbfsReferenceDbu, level, unit]
  );

  const isPressureMode = unit === "dbspl";

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
            <p>Level reference</p>
            <h3>Unidad de entrada</h3>
          </div>

          <div className={styles.unitGrid} aria-label="Seleccionar unidad base">
            {units.map((item) => (
              <button
                key={item.id}
                className={item.id === unit ? styles.unitActive : styles.unitButton}
                type="button"
                onClick={() => setUnit(item.id)}
              >
                <span>{item.label}</span>
                <small>{item.helper}</small>
              </button>
            ))}
          </div>

          <label className={styles.primaryField}>
            <span>Nivel</span>
            <div>
              <input
                type="number"
                step="0.1"
                value={level}
                onChange={(event) => setLevel(safeNumber(event.target.valueAsNumber))}
              />
              <small>{units.find((item) => item.id === unit)?.label}</small>
            </div>
          </label>

          <label className={styles.numberField}>
            <span>Alineacion digital</span>
            <div>
              <input
                type="number"
                step="1"
                value={dbfsReferenceDbu}
                disabled={isPressureMode}
                onChange={(event) => setDbfsReferenceDbu(safeNumber(event.target.valueAsNumber))}
              />
              <small>dBu @ 0 dBFS</small>
            </div>
          </label>
        </div>

        <div className={styles.readoutPanel}>
          <div className={styles.heroReadout}>
            <span>{isPressureMode ? "Presion acustica" : "Voltaje RMS"}</span>
            <strong>
              {isPressureMode
                ? `${formatAudioNumber(result.pressurePa ?? 0, 4)} Pa`
                : `${formatAudioNumber(result.voltsRms ?? 0, 4)} V`}
            </strong>
            <p>
              {isPressureMode
                ? `${formatAudioNumber(result.pressureMicroPa ?? 0, 1)} uPa ref. 20 uPa`
                : `0 dBFS alineado a +${formatAudioNumber(result.dbfsReferenceDbu, 1)} dBu`}
            </p>
          </div>
        </div>
      </section>

      <section className={styles.metricsPanel}>
        <div className={styles.panelHeader}>
          <p>Converted readouts</p>
          <h3>Equivalencias</h3>
        </div>

        <div className={styles.metricGrid}>
          <Metric label="dBu" value={formatNullable(result.dbu, " dBu")} />
          <Metric label="dBV" value={formatNullable(result.dbv, " dBV")} />
          <Metric label="dBFS" value={formatNullable(result.dbfs, " dBFS")} />
          <Metric label="dBSPL" value={formatNullable(result.dbspl, " dBSPL")} />
        </div>
      </section>

      <section className={styles.notePanel}>
        <span>Nota tecnica</span>
        <p>
          dBu, dBV y dBFS se cruzan mediante una referencia de alineacion analogica. dBSPL describe presion acustica;
          no se convierte a voltaje sin sensibilidad de microfono, ganancia o calibracion externa.
        </p>
      </section>

      <section className={styles.ritualPanel} aria-label="Corrupted level telemetry">
        <pre>{audioUnitsSigil}</pre>
        <div>
          <span>[REFERENCE_SEAL]</span>
          <p>
            UNIT={unit.toUpperCase()} // LVL={formatAudioNumber(level, 3)} // REF=+{formatAudioNumber(dbfsReferenceDbu, 1)}dBuFS
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

function formatNullable(value: number | null, unit: string) {
  return value === null ? "N/A" : `${formatAudioNumber(value, 2)}${unit}`;
}

function safeNumber(value: number) {
  return Number.isNaN(value) ? 0 : value;
}

const audioUnitsSigil = String.raw`
 dBu -> V
  |     |
 dBV  dBFS
  \   /
  dBSPL`;
