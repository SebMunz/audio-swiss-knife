import styles from "./AudioSigil.module.css";

type AudioSigilProps = {
  variant?: "seal" | "small";
  label?: string;
};

export function AudioSigil({ variant = "seal", label = "FLOURE" }: Readonly<AudioSigilProps>) {
  return (
    <figure className={`${styles.sigil} ${styles[variant]}`} aria-hidden="true">
      <svg viewBox="0 0 220 220" role="img">
        <g className={styles.grid}>
          <circle cx="110" cy="110" r="95" />
          <circle cx="110" cy="110" r="68" />
          <circle cx="110" cy="110" r="34" />
          <path d="M110 15 L190 158 H30 Z" />
          <path d="M110 205 L30 62 H190 Z" />
          <path d="M25 110 H195 M110 25 V195" />
          <path d="M43 43 L177 177 M177 43 L43 177" />
        </g>
        <g className={styles.circuit}>
          <path d="M110 42 C138 64 148 84 148 110 C148 136 132 154 110 178" />
          <path d="M110 42 C82 64 72 84 72 110 C72 136 88 154 110 178" />
          <path d="M58 110 C78 97 96 92 110 92 C124 92 142 97 162 110" />
          <path d="M58 110 C78 123 96 128 110 128 C124 128 142 123 162 110" />
          <circle cx="110" cy="42" r="4" />
          <circle cx="110" cy="178" r="4" />
          <circle cx="58" cy="110" r="4" />
          <circle cx="162" cy="110" r="4" />
          <circle cx="110" cy="110" r="7" />
        </g>
        <g className={styles.wave}>
          <path d="M64 75 C80 58 95 58 110 75 C125 92 140 92 156 75" />
          <path d="M64 145 C80 128 95 128 110 145 C125 162 140 162 156 145" />
        </g>
        <text x="110" y="106" textAnchor="middle">
          {label}
        </text>
        <text x="110" y="121" textAnchor="middle" className={styles.sub}>
          AUDIO RITE
        </text>
      </svg>
      <figcaption className={styles.runes}>ᚠ ᚢ ᚦ ᚨ ᚱ ᚲ ᚷ ᚹ ᛇ ᛈ ᛉ ᛟ</figcaption>
    </figure>
  );
}

export function RuneStrip({ compact = false }: Readonly<{ compact?: boolean }>) {
  return (
    <div className={`${styles.runeStrip} ${compact ? styles.compact : ""}`} aria-hidden="true">
      <span>ᚠᚢᚦᚨᚱᚲ</span>
      <span>MONAS // AUDIO // 0xF10VR_E</span>
      <span>ᛇᛈᛉᛟᛞᛗ</span>
    </div>
  );
}

const oracleRows = [
  ["0x CIRCLE", "BOUND"],
  ["0x PRESENCE", "ACTIVE"],
  ["0x SEAL", "AUDIO"],
  ["0x LINK", "OCCULT"],
  ["0x LISTENER", "UNKNOWN"]
];

const deckReadouts = [
  ["RT60 CHAMBER", "UNMEASURED"],
  ["LUFS VESSEL", "-14.0?"],
  ["PHASE SEAL", "LOCKED"],
  ["NYQUIST GATE", "OPEN"],
  ["ROOM MODE", "LISTENING"],
  ["CRC", "INVALID"]
];

export function CorruptedGrimoireRail() {
  return (
    <aside className={styles.rail} aria-hidden="true">
      <section className={styles.block}>
        <span className={styles.cornerRune}>ᛟ</span>
        <h2>Recovered Omen Scroll</h2>
        <div className={styles.ansi}>░░▒▒▓▓████████████▓▓▒▒░░</div>
        <AudioSigil variant="small" label="0xF10" />
        <p className={styles.omen}>
          BEHOLD THE NODE
          <br />
          THAT WAS NOT MEANT
          <br />
          TO BE FOUND.
          <br />
          <br />
          THROUGH SAMPLES
          <br />
          THEY WHISPER.
          <br />
          THROUGH SILENCE
          <br />
          THEY WATCH.
        </p>
      </section>

      <section className={styles.block}>
        <span className={styles.cornerRune}>☽</span>
        <h2>Seal Telemetry</h2>
        {oracleRows.map(([key, value]) => (
          <div className={styles.readout} key={key}>
            <span>{key}</span>
            <i />
            <b>{value}</b>
          </div>
        ))}
        <div className={styles.tablet}>
          {["☉", "☽", "♂", "☿", "♃", "♀", "♄", "⛢", "♆", "♇"].map((glyph) => (
            <span key={glyph}>{glyph}</span>
          ))}
        </div>
      </section>

      <section className={styles.block}>
        <span className={styles.cornerRune}>ᛞ</span>
        <h2>Hex Oracle Dump</h2>
        <p className={styles.hex}>
          <span>0043</span> 4F 52 45 <b>DE AD</b> 41 55 44 49 4F
          <br />
          <span>0050</span> 53 49 47 49 4C <b>13 EF</b> 52 54 36
          <br />
          <span>0060</span> 4D 4F 44 45 20 43 4F <b>RR</b> 55 50
        </p>
      </section>
    </aside>
  );
}

export function CorruptedBottomBar() {
  return (
    <div className={styles.bottomBar} aria-hidden="true">
      <span>── HERMETIC AUDIO PROTOCOLS ARE NOT PRESETS.</span>
      <b>THEY ARE DOORS.</b>
      <span>SOME DO NOT CLOSE. ──</span>
    </div>
  );
}

export function CorruptedDataDeck() {
  return (
    <section className={styles.dataDeck} aria-hidden="true">
      <article className={styles.deckPanel}>
        <span className={styles.cornerRune}>ᚦ</span>
        <h2>Boot Sector Rite</h2>
        {deckReadouts.map(([key, value]) => (
          <div className={styles.readout} key={key}>
            <span>{key}</span>
            <i />
            <b>{value}</b>
          </div>
        ))}
      </article>

      <article className={styles.deckPanel}>
        <span className={styles.cornerRune}>ᛉ</span>
        <h2>Interrupt Table</h2>
        <div className={styles.interruptGrid}>
          {["13", "21", "2F", "33", "80", "A7", "C0", "DE", "EF", "FF", "04", "7B"].map((cell) => (
            <span key={cell}>{cell}</span>
          ))}
        </div>
        <p className={styles.cmt}>; SAMPLE BUFFER ENTERS CIRCLE BEFORE CONVERSION</p>
      </article>

      <article className={styles.deckPanel}>
        <span className={styles.cornerRune}>☿</span>
        <h2>Audio Seal</h2>
        <svg className={styles.miniSeal} viewBox="0 0 160 80">
          <g fill="none">
            <path d="M12 40 H148 M80 8 V72" />
            <circle cx="80" cy="40" r="30" />
            <path d="M80 10 L132 70 H28 Z" />
            <path d="M28 10 H132 L80 72 Z" />
            <path d="M30 40 C48 22 64 22 80 40 C96 58 112 58 130 40" />
          </g>
        </svg>
        <p className={styles.cmt}>; THE FILTER IS A CIRCLE WITH TEETH</p>
      </article>

      <article className={styles.deckPanel}>
        <span className={styles.cornerRune}>ᛟ</span>
        <h2>Corrupt Log</h2>
        <p className={styles.hex}>
          <span>00A0</span> 41 43 4F 55 53 54 49 43 <b>13</b>
          <br />
          <span>00B0</span> 46 4C 4F 55 52 45 <b>DE AD</b>
          <br />
          <span>00C0</span> 30 78 46 31 30 56 52 <b>5F 45</b>
        </p>
      </article>
    </section>
  );
}
