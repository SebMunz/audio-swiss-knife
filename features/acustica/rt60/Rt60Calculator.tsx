"use client";

import { useMemo, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import {
  calculateRt60,
  formatSeconds,
  rt60Materials,
  type Rt60Result,
  type SurfaceKey,
  type SurfaceMaterial
} from "@/lib/acoustics/rt60";
import type { ToolDefinition } from "@/data/tools";
import styles from "./Rt60Calculator.module.css";

const surfaces: Array<{ key: SurfaceKey; label: string; detail: string }> = [
  { key: "floor", label: "Piso", detail: "largo x ancho" },
  { key: "ceiling", label: "Cielo", detail: "largo x ancho" },
  { key: "frontBack", label: "Frente / fondo", detail: "2 x ancho x alto" },
  { key: "sideWalls", label: "Laterales", detail: "2 x largo x alto" }
];

const defaultMaterials: Record<SurfaceKey, SurfaceMaterial> = {
  floor: rt60Materials[2],
  ceiling: rt60Materials[0],
  frontBack: rt60Materials[0],
  sideWalls: rt60Materials[4]
};

export default function Rt60Calculator({ tool }: Readonly<{ tool: ToolDefinition }>) {
  const [length, setLength] = useState(5.8);
  const [width, setWidth] = useState(4.2);
  const [height, setHeight] = useState(2.7);
  const [materials, setMaterials] = useState(defaultMaterials);
  const [isGrimoireOpen, setIsGrimoireOpen] = useState(false);

  const result = useMemo(() => {
    return calculateRt60({
      dimensions: { length, width, height },
      materials
    });
  }, [height, length, materials, width]);

  const chartData = result.bands.map((band) => ({
    frequency: `${band.frequency}`,
    Sabine: rounded(band.sabine),
    Eyring: rounded(band.eyring),
    absorption: Number(band.averageAbsorption.toFixed(2))
  }));

  const verdict = getRt60Verdict(result);

  return (
    <article className={styles.tool}>
      <header className={styles.header}>
        <div>
          <p>{tool.category}</p>
          <h2>{tool.name}</h2>
          <span>{tool.description}</span>
        </div>
        <button
          className={styles.grimoireButton}
          type="button"
          aria-label="Desvelar grimorio RT60"
          onClick={() => setIsGrimoireOpen(true)}
        >
          <span aria-hidden="true">?</span>
          <em>[DESVELAR_GRIMORIO]</em>
        </button>
        <strong>{tool.status}</strong>
      </header>

      <section className={styles.calculatorGrid}>
        <div className={styles.controlsPanel}>
          <div className={styles.panelHeader}>
            <p>Room shell</p>
            <h3>Geometria del recinto</h3>
          </div>
          <div className={styles.dimensionGrid}>
            <NumberField label="Largo" unit="m" value={length} min={0.5} onChange={setLength} />
            <NumberField label="Ancho" unit="m" value={width} min={0.5} onChange={setWidth} />
            <NumberField label="Alto" unit="m" value={height} min={0.5} onChange={setHeight} />
          </div>

          <div className={styles.materials}>
            {surfaces.map((surface) => (
              <label key={surface.key} className={styles.materialSelect}>
                <span>
                  {surface.label}
                  <small>{surface.detail}</small>
                </span>
                <select
                  value={materials[surface.key].id}
                  onChange={(event) => {
                    const selected = rt60Materials.find((material) => material.id === event.target.value);

                    if (selected) {
                      setMaterials((current) => ({ ...current, [surface.key]: selected }));
                    }
                  }}
                >
                  {rt60Materials.map((material) => (
                    <option key={material.id} value={material.id}>
                      {material.name}
                    </option>
                  ))}
                </select>
              </label>
            ))}
          </div>
        </div>

        <div className={styles.resultsPanel}>
          <div className={styles.resultHero}>
            <span>RT60 medio 500 Hz / 1 kHz</span>
            <strong>{formatSeconds(result.midEyring ?? result.midSabine)}</strong>
            <p>{verdict}</p>
          </div>
          <div className={styles.statGrid}>
            <Metric label="Volumen" value={`${result.volume.toFixed(1)} m3`} />
            <Metric label="Superficie" value={`${result.totalSurfaceArea.toFixed(1)} m2`} />
            <Metric label="Objetivo" value={`${result.targetRange.min.toFixed(2)} - ${result.targetRange.max.toFixed(2)} s`} />
          </div>
        </div>
      </section>

      <section className={styles.chartPanel}>
        <div className={styles.panelHeader}>
          <p>Decay curve</p>
          <h3>RT60 por banda de octava</h3>
        </div>
        <div className={styles.chartFrame}>
          <ResponsiveContainer width="100%" height={290}>
            <LineChart data={chartData} margin={{ top: 18, right: 18, bottom: 10, left: 0 }}>
              <CartesianGrid stroke="rgba(154, 172, 157, 0.16)" vertical={false} />
              <XAxis dataKey="frequency" tickLine={false} axisLine={false} tick={{ fill: "var(--muted)", fontSize: 12 }} />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fill: "var(--muted)", fontSize: 12 }}
                unit="s"
                width={42}
              />
              <Tooltip
                contentStyle={{
                  background: "var(--panel-strong)",
                  border: "1px solid var(--line)",
                  borderRadius: "var(--radius)",
                  color: "var(--text)"
                }}
              />
              <Line type="monotone" dataKey="Sabine" stroke="#58d68d" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="Eyring" stroke="#f5c15f" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className={styles.tablePanel}>
        <div className={styles.panelHeader}>
          <p>Band table</p>
          <h3>Absorcion equivalente</h3>
        </div>
        <div className={styles.tableScroller}>
          <table>
            <thead>
              <tr>
                <th>Hz</th>
                <th>Sabine</th>
                <th>Eyring</th>
                <th>Alpha medio</th>
                <th>Area abs.</th>
              </tr>
            </thead>
            <tbody>
              {result.bands.map((band) => (
                <tr key={band.frequency}>
                  <td>{band.frequency}</td>
                  <td>{formatSeconds(band.sabine)}</td>
                  <td>{formatSeconds(band.eyring)}</td>
                  <td>{band.averageAbsorption.toFixed(2)}</td>
                  <td>{band.equivalentAbsorptionArea.toFixed(1)} m2</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {isGrimoireOpen ? <Rt60GrimoireModal result={result} onClose={() => setIsGrimoireOpen(false)} /> : null}
    </article>
  );
}

function NumberField({
  label,
  unit,
  value,
  min,
  onChange
}: Readonly<{
  label: string;
  unit: string;
  value: number;
  min: number;
  onChange: (value: number) => void;
}>) {
  return (
    <label className={styles.numberField}>
      <span>{label}</span>
      <div>
        <input
          type="number"
          min={min}
          step="0.1"
          value={value}
          onChange={(event) => onChange(clampDimension(event.target.valueAsNumber, min))}
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

function Rt60GrimoireModal({ result, onClose }: Readonly<{ result: Rt60Result; onClose: () => void }>) {
  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-labelledby="rt60-grimoire-title">
      <div className={styles.grimoireModal}>
        <div className={styles.modalChrome}>
          <span>[NODE_LEAF]: 0xDEAD_RT60</span>
          <button type="button" onClick={onClose}>
            [SELLAR_SOCKET]
          </button>
        </div>

        <div className={styles.grimoireBody}>
          <section className={styles.ritualText}>
            <p id="rt60-grimoire-title">:: CONTENCION DEL RECINTO :: [ALLOCATION]: Ring_0</p>
            <h3>[RITUAL_THEORY]</h3>
            <p>
              La Persistencia Espacial RT60 mide el decaimiento del Voltaje Oscilatorio dentro del templo fisico.
              El rito calcula cuantos segundos tarda la energia en disiparse 60 dB despues del corte inicial.
            </p>

            <h3>[EQUATIONS_OF_FAITH]</h3>
            <div className={styles.equationGrid}>
              <div>
                <span>METODO SACRE SABINE</span>
                <code>RT60 = 0.161 * V / A</code>
              </div>
              <div>
                <span>METODO SACRE EYRING</span>
                <code>RT60 = 0.161 * V / (-S * ln(1 - a))</code>
              </div>
            </div>

            <div className={styles.liveVariables}>
              <span>
                [V] <b>{result.volume.toFixed(2)} m3</b>
              </span>
              <span>
                [S] <b>{result.totalSurfaceArea.toFixed(2)} m2</b>
              </span>
              <span>
                [RT60_MID] <b>{formatSeconds(result.midEyring ?? result.midSabine)}</b>
              </span>
            </div>
          </section>

          <section className={styles.hexPanel} aria-label="Hermetic glyph hex dump">
            <pre>{rt60Glyph}</pre>
            <div className={styles.hexDump}>
              <span>0x00: 4D 42 52 2F 52 54 36 30 2F 53 45 41 4C</span>
              <span>0x10: 42 55 46 46 45 52 5F 4F 4B 2F 41 4D 42 45</span>
              <span>0x20: 52 5F 53 43 52 45 45 4E 2F 49 4E 56 4F 4B</span>
              <span>0x30: 45 5F 44 45 43 41 59 2F 53 41 42 49 4E 45</span>
              <span>0x40: 45 59 52 49 4E 47 5F 4E 4F 44 45 5F 4F 4B</span>
            </div>
          </section>
        </div>

        <footer className={styles.modalFooter}>
          <span>[SYS_LOG]: BUFFER_OK // MEM_SECTOR_CLEAN // ECHO_CONTAINED // 0xF10VR_E</span>
        </footer>
      </div>
    </div>
  );
}

function rounded(value: number | null) {
  return value === null ? null : Number(value.toFixed(2));
}

function clampDimension(value: number, min: number) {
  if (Number.isNaN(value)) {
    return min;
  }

  return Math.max(min, value);
}

function getRt60Verdict(result: Rt60Result) {
  const value = result.midEyring ?? result.midSabine;

  if (value === null) {
    return "Ingresa dimensiones y absorcion para calcular el decaimiento.";
  }

  if (value < result.targetRange.min) {
    return "Sala muy seca para este volumen: revisa absorcion excesiva en medios/agudos.";
  }

  if (value > result.targetRange.max) {
    return "Reverberacion alta: conviene aumentar absorcion o controlar reflexiones tempranas.";
  }

  return "Rango razonable para una sala de control pequena o entorno de escucha critica.";
}

const rt60Glyph = String.raw`
+--------------------------+
|           /\             |
|          /  \            |
|     ____/____\____       |
|    /\    RT60    /\      |
|   /  \  SABINE  /  \     |
|  /____\__F1___ /____\    |
|  \    / EYRING \    /    |
|   \  /__SEAL____\  /     |
|    \/     ||     \/      |
|           ||             |
|      [SIGIL_RT60]        |
+--------------------------+`;
