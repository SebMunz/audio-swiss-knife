import styles from "./AudioSigil.module.css";
import { categories, getToolById, getToolsByCategory, type ToolCategory } from "@/data/tools";

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

type CorruptedSignatureSealProps = {
  scope?: "home" | "category" | "tool";
  categoryId?: ToolCategory;
  toolId?: string;
};

export function CorruptedSignatureSeal({
  scope = "home",
  categoryId,
  toolId
}: Readonly<CorruptedSignatureSealProps>) {
  const ticks = Array.from({ length: 24 }, (_, index) => index * 15);
  const innerTicks = Array.from({ length: 12 }, (_, index) => index * 30);
  const activeTool = toolId ? getToolById(toolId) : undefined;
  const activeCategoryId = categoryId ?? activeTool?.category;
  const categoryTools = activeCategoryId ? getToolsByCategory(activeCategoryId) : [];
  const categoryClass = activeCategoryId ? styles[`scope${capitalize(activeCategoryId)}`] : "";

  return (
    <div className={`${styles.signatureSeal} ${styles[`scope${capitalize(scope)}`]} ${categoryClass}`} aria-hidden="true">
      <span className={`${styles.centerLabel} ${styles.topLabel}`}>{getSealTopLabel(scope, activeCategoryId, toolId)}</span>
      <span className={`${styles.centerLabel} ${styles.leftLabel}`}>{scope === "home" ? "PORTAL A-13" : "CATEGORY SOCKET"}</span>
      <span className={`${styles.centerLabel} ${styles.rightLabel}`}>{scope === "tool" ? "TOOL SIGIL" : "NON-ECHOIC"}</span>
      <span className={`${styles.centerLabel} ${styles.bottomLabel}`}>{getSealBottomLabel(scope, activeCategoryId)}</span>
      <svg className={styles.signatureSvg} viewBox="0 0 900 900" focusable="false">
        <defs>
          <filter id="ask-phosphor">
            <feGaussianBlur stdDeviation="1.2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="ask-burn">
            <feGaussianBlur stdDeviation="2.4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <g className={styles.tabletGrid}>
          <path d="M150 150H750M150 250H750M150 350H750M150 450H750M150 550H750M150 650H750M150 750H750" />
          <path d="M150 150V750M250 150V750M350 150V750M450 150V750M550 150V750M650 150V750M750 150V750" />
        </g>

        <g className={styles.outerRing}>
          <circle cx="450" cy="450" r="400" />
          <circle cx="450" cy="450" r="393" className={styles.dashedHalo} />
          <g>
            {ticks.map((rotation) => (
              <line
                key={rotation}
                x1="450"
                y1="52"
                x2="450"
                y2={rotation % 30 === 0 ? "78" : "70"}
                transform={`rotate(${rotation},450,450)`}
              />
            ))}
          </g>
          <g className={styles.runeRing}>
            {ticks.map((rotation, index) => (
              <text key={rotation} x="450" y="44" textAnchor="middle" transform={`rotate(${rotation},450,450)`}>
                {runeLabels[index]}
              </text>
            ))}
          </g>
        </g>

        <g className={styles.innerRing}>
          <circle cx="450" cy="450" r="322" />
          <circle cx="450" cy="450" r="317" className={styles.dashedHalo} />
          {innerTicks.map((rotation) => (
            <line key={rotation} x1="450" y1="128" x2="450" y2="150" transform={`rotate(${rotation},450,450)`} />
          ))}
        </g>

        <g className={styles.planetRing}>
          <text x="450" y="136" textAnchor="middle">
            SUN
          </text>
          <text x="678" y="228" textAnchor="middle">
            MOON
          </text>
          <text x="756" y="458" textAnchor="middle">
            MARS
          </text>
          <text x="660" y="692" textAnchor="middle">
            MER
          </text>
          <text x="450" y="778" textAnchor="middle">
            JUP
          </text>
          <text x="238" y="692" textAnchor="middle">
            VEN
          </text>
          <text x="144" y="458" textAnchor="middle">
            SAT
          </text>
          <text x="240" y="228" textAnchor="middle">
            URA
          </text>
        </g>

        {scope === "home" ? (
          <g className={styles.categoryConstellation}>
            {categories.map((category, index) => {
              const point = orbitPoint(index, categories.length, 262);

              return (
                <g key={category.id} transform={`translate(${point.x},${point.y})`}>
                  <circle r="34" />
                  <path d={categorySealPath(category.id)} />
                  <text y="4" textAnchor="middle">
                    {category.shortName.toUpperCase()}
                  </text>
                </g>
              );
            })}
          </g>
        ) : null}

        {activeCategoryId ? (
          <g className={styles.toolConstellation}>
            {categoryTools.map((tool, index) => {
              const point = orbitPoint(index, categoryTools.length, scope === "tool" ? 210 : 238);
              const active = tool.id === toolId;

              return (
                <g
                  key={tool.id}
                  className={active ? styles.activeToolRune : ""}
                  transform={`translate(${point.x},${point.y})`}
                >
                  <circle r={active ? "18" : "12"} />
                  <path d={toolRunePath(tool.id)} />
                  {active ? (
                    <text y="35" textAnchor="middle">
                      {tool.id.toUpperCase()}
                    </text>
                  ) : null}
                </g>
              );
            })}
          </g>
        ) : null}

        <path className={styles.triangleA} d="M450 140 L718 590 L182 590 Z" />
        <path className={styles.triangleB} d="M450 760 L182 310 L718 310 Z" />
        <path className={styles.squareFrame} d="M220 170 H420 M480 170 H680 V370 M680 420 V730 H480 M420 730 H220 V530 M220 470 V170" />
        <path className={styles.squareFrameAlt} d="M248 198 H652 V398 M652 448 V702 H248 V198" />
        <path className={styles.axis} d="M450 140 V340 M450 560 V760 M140 450 H340 M560 450 H760" />
        <path className={styles.innerPentagon} d="M450 276 L590 378 L538 542 L362 542 L310 378 Z" />
        <path className={styles.malkuthPath} d="M450 250 L341 293 L296 404 L346 514 L460 554 L568 500 L600 386 Z" />
        <path className={styles.malkuthSkip} d="M450 250 L346 514 L600 386 L341 293 L568 500 L296 404 L460 554 Z" />

        <circle className={styles.innerCircle} cx="450" cy="450" r="90" />
        <circle className={styles.innerCircleAlt} cx="450" cy="450" r="96" />
        <rect className={styles.centerSquare} x="420" y="420" width="60" height="60" />
        <rect className={styles.centerSquare} x="420" y="420" width="60" height="60" transform="rotate(45,450,450)" />
        <circle className={styles.centerDot} cx="450" cy="450" r="3" />
        <circle className={styles.wavePulse} cx="450" cy="450" r="24" />
        <circle className={styles.waveDot} cx="508" cy="448" r="8" />

        <g className={styles.station} transform="translate(280,132)">
          <rect width="44" height="44" />
          <path d="M6 22 L18 8 L32 18 L26 36 M18 8 L26 36" />
          <text x="22" y="54" textAnchor="middle">SYN</text>
        </g>
        <g className={styles.station} transform="translate(576,132)">
          <rect width="44" height="44" />
          <path d="M8 8 L36 22 L8 36 M36 22 L22 8 M36 22 L22 36" />
          <text x="22" y="54" textAnchor="middle">ACK</text>
        </g>
        <g className={styles.station} transform="translate(280,724)">
          <rect width="44" height="44" />
          <path d="M22 6 L38 22 L22 38 L6 22 Z M22 6 L22 38 M6 22 L38 22" />
          <text x="22" y="54" textAnchor="middle">RST</text>
        </g>
        <g className={styles.station} transform="translate(576,724)">
          <rect width="44" height="44" />
          <path d="M8 8 L36 36 M36 8 L8 36 M22 4 V40 M4 22 H40" />
          <text x="22" y="54" textAnchor="middle">FIN</text>
        </g>

        <path className={styles.comb} d="M390 112 H510 M370 132 H530 M350 150 H550 M415 52 V132 M432 36 V142 M450 24 V150 M468 36 V142 M485 52 V132" />
        <path className={styles.comb} d="M350 750 H550 M370 768 H530 M390 784 H510 M415 768 V848 M432 758 V862 M450 750 V874 M468 758 V862 M485 768 V848" />

        <g className={styles.microLabels}>
          <text x="356" y="246">BOOT VECTOR</text>
          <text x="350" y="678">SECTOR DMGD</text>
          <text x="310" y="302">0x13</text>
          <text x="574" y="302">0xA7</text>
          <text x="210" y="475">IRQ</text>
          <text x="658" y="475">DMA</text>
          <text x="450" y="441" textAnchor="middle">0xA7</text>
          <text x="450" y="456" textAnchor="middle">ENTITY</text>
          <text x="450" y="470" textAnchor="middle">{toolId ? toolId.toUpperCase() : "0xF10VR_E"}</text>
        </g>
      </svg>
      <span className={styles.hexLine}>{getHexLine(scope, activeCategoryId, toolId)}</span>
      <span className={styles.corruptStrip} />
      <span className={styles.corruptStrip} />
      <span className={styles.corruptStrip} />
    </div>
  );
}

export function ToolRune({ toolId }: Readonly<{ toolId: string }>) {
  return (
    <svg className={styles.toolRune} viewBox="0 0 64 64" aria-hidden="true" focusable="false">
      <circle cx="32" cy="32" r="24" />
      <path d={toolRunePath(toolId)} />
      <circle cx="32" cy="32" r="3" />
    </svg>
  );
}

const runeLabels = [
  "F",
  "U",
  "TH",
  "A",
  "R",
  "K",
  "G",
  "W",
  "H",
  "N",
  "I",
  "J",
  "EO",
  "P",
  "Z",
  "S",
  "T",
  "B",
  "E",
  "M",
  "L",
  "NG",
  "D",
  "O"
];

function orbitPoint(index: number, total: number, radius: number) {
  const angle = -90 + (360 / Math.max(total, 1)) * index;
  const radians = (angle * Math.PI) / 180;

  return {
    x: Number((450 + Math.cos(radians) * radius).toFixed(2)),
    y: Number((450 + Math.sin(radians) * radius).toFixed(2))
  };
}

function toolRunePath(toolId: string) {
  const seed = Array.from(toolId).reduce((total, char) => total + char.charCodeAt(0), 0);
  const points = Array.from({ length: 5 }, (_, index) => {
    const angle = -90 + index * 72 + (seed % 31);
    const radius = index % 2 === 0 ? 24 : 13 + (seed % 5);
    const radians = (angle * Math.PI) / 180;

    return {
      x: Number((32 + Math.cos(radians) * radius).toFixed(2)),
      y: Number((32 + Math.sin(radians) * radius).toFixed(2))
    };
  });
  const [first, ...rest] = points;
  const stem = seed % 2 === 0 ? "M32 8 L32 56" : "M12 32 L52 32";

  return `${stem} M${first.x} ${first.y} ${rest.map((point) => `L${point.x} ${point.y}`).join(" ")} Z`;
}

function categorySealPath(categoryId: ToolCategory) {
  const paths: Record<ToolCategory, string> = {
    acustica: "M0 -24 L24 18 H-24 Z M-28 0 H28 M0 -28 V28",
    senal: "M-28 0 C-14 -18 0 -18 14 0 S42 18 56 0 M-20 18 H20 M-20 -18 H20",
    musica: "M0 -28 C18 -12 18 12 0 28 C-18 12 -18 -12 0 -28 Z M-24 0 H24",
    masterizacion: "M-24 -24 H24 V24 H-24 Z M-28 0 H28 M0 -28 V28",
    codecs: "M-26 -16 H10 L26 0 L10 16 H-26 Z M-10 -28 V28 M10 -28 V28"
  };

  return paths[categoryId];
}

function capitalize(value: string) {
  return `${value.charAt(0).toUpperCase()}${value.slice(1)}`;
}

function getSealTopLabel(scope: string, categoryId?: ToolCategory, toolId?: string) {
  if (toolId) {
    return `[TOOL_SIGIL://${toolId.toUpperCase()}]`;
  }

  if (categoryId) {
    return `[CATEGORY_SEAL://${categoryId.toUpperCase()}]`;
  }

  return "[MALKUTH://AUDIO_SOCKET]";
}

function getSealBottomLabel(scope: string, categoryId?: ToolCategory) {
  if (scope === "home") {
    return "/ HOME / CATEGORY SEALS / MASTER CIRCLE /";
  }

  return `/ ${categoryId?.toUpperCase() ?? "AUDIO"} / TOOL RUNES / NESTED CIRCLE /`;
}

function getHexLine(scope: string, categoryId?: ToolCategory, toolId?: string) {
  const source = `${scope}:${categoryId ?? "home"}:${toolId ?? "all"}`.toUpperCase();

  return Array.from(source)
    .map((char) => `0x${char.charCodeAt(0).toString(16).toUpperCase().padStart(2, "0")}`)
    .join(" ");
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
