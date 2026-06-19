import type { ToolDefinition } from "@/data/tools";
import { AudioSigil, RuneStrip } from "@/components/esoteric/AudioSigil";
import { getCorruptedCopy } from "@/data/corrupted-copy";
import styles from "./PlaceholderTool.module.css";

export default function PlaceholderTool({ tool }: Readonly<{ tool: ToolDefinition }>) {
  const corruptedCopy = getCorruptedCopy(tool);

  return (
    <article className={styles.tool}>
      <header className={styles.header}>
        <div>
          <p>{tool.category}</p>
          <h2>{tool.name}</h2>
          <span>{tool.description}</span>
        </div>
        <div className={styles.toolSigil}>
          <AudioSigil variant="small" label={tool.category.toUpperCase()} />
        </div>
        <strong>{tool.status}</strong>
      </header>

      <RuneStrip compact />

      <section className={styles.corruptedPanel}>
        <h3>{corruptedCopy.title}</h3>
        <p>{corruptedCopy.description}</p>
      </section>

      <section className={styles.panel}>
        <h3>Inputs previstos</h3>
        <div className={styles.inputs}>
          {tool.expectedInputs.map((input) => (
            <label key={input}>
              <span>{input}</span>
              <input disabled placeholder="pendiente" />
            </label>
          ))}
        </div>
      </section>

      <section className={styles.panel}>
        <h3>Modulo aislado</h3>
        <p>
          Esta herramienta ya tiene ruta, metadata y contenedor. En el siguiente hito se reemplaza este placeholder por
          formula pura, validacion de entradas y visualizadores cuando corresponda.
        </p>
      </section>
    </article>
  );
}
