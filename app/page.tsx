import Link from "next/link";
import { AudioSigil, CorruptedDataDeck, RuneStrip } from "@/components/esoteric/AudioSigil";
import { categories, tools } from "@/data/tools";
import styles from "./page.module.css";

const changelog = [
  {
    version: "0.1.0",
    title: "Foundation pass",
    notes: "Catalogo navegable, rutas base, modo normal/corrupted y placeholders modulares."
  },
  {
    version: "next",
    title: "Acustica Core",
    notes: "RT60, Modos Propios y QRD con calculos puros y graficos."
  }
];

export default function HomePage() {
  const prototypeCount = tools.filter((tool) => tool.status === "prototype").length;

  return (
    <section className={styles.home}>
      <div className={styles.hero}>
        <div className={styles.heroCopy}>
          <p>
            <span className={styles.operatorNormal}>Floure presents</span>
            <span className={styles.operatorCorrupted}>0xF10VR_E recovered spellbook</span>
          </p>
          <h2>Audio Swiss Knife</h2>
          <span>
            Una webapp client-side para calculos de audio, acustica, masterizacion, codecs, telecom y teoria musical.
            Modo normal para medir. Modo corrupted para medir con cara de haber visto el buffer por dentro.
          </span>
        </div>
        <div className={styles.heroSigil}>
          <AudioSigil label="0xF10" />
        </div>
        <div className={styles.heroStats}>
          <div>
            <strong>{tools.length}</strong>
            <span>herramientas mapeadas</span>
          </div>
          <div>
            <strong>{prototypeCount}</strong>
            <span>prototipos iniciales</span>
          </div>
          <div>
            <strong>0</strong>
            <span>backend requerido</span>
          </div>
        </div>
      </div>

      <RuneStrip />
      <CorruptedDataDeck />

      <div className={styles.grid}>
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h3>Modulos</h3>
            <span>rutas principales</span>
          </div>
          <div className={styles.moduleGrid}>
            {categories.map((category) => (
              <Link key={category.id} href={`/${category.id}`} className={styles.moduleCard}>
                <strong>{category.name}</strong>
                <span>{category.description}</span>
              </Link>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h3>Changelog</h3>
            <span>estado vivo</span>
          </div>
          <div className={styles.timeline}>
            {changelog.map((entry) => (
              <article key={entry.version}>
                <b>{entry.version}</b>
                <div>
                  <strong>{entry.title}</strong>
                  <p>{entry.notes}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>

      <section className={styles.contact}>
        <div>
          <h3>Contacto y repo</h3>
          <p>
            GitHub queda como placeholder hasta publicar el remoto. La app esta pensada para funcionar local, estatica y
            sin secretos.
          </p>
        </div>
        <a href="https://github.com/Floure/audio-swiss-knife" target="_blank" rel="noreferrer">
          github.com/Floure/audio-swiss-knife
        </a>
      </section>
    </section>
  );
}
