export type ToolCategory = "acustica" | "senal" | "musica" | "masterizacion" | "codecs";

export type ToolStatus = "planned" | "prototype" | "ready";

export type ToolDefinition = {
  id: string;
  name: string;
  category: ToolCategory;
  description: string;
  status: ToolStatus;
  tags: string[];
  route: string;
  expectedInputs: string[];
};

export type CategoryDefinition = {
  id: ToolCategory;
  name: string;
  shortName: string;
  description: string;
};

export const categories: CategoryDefinition[] = [
  {
    id: "acustica",
    name: "Acustica de Sala",
    shortName: "Acustica",
    description: "RT60, claridad, inteligibilidad, difusores, modos propios y aislamiento."
  },
  {
    id: "senal",
    name: "Senal y Altavoces",
    shortName: "Senal",
    description: "Conversiones, filtros, fase, distorsion, latencia, crossover y cajas."
  },
  {
    id: "musica",
    name: "Teoria Musical",
    shortName: "Musica",
    description: "Escalas, acordes, temperamentos, microtonalidad, tempo y psicoacustica."
  },
  {
    id: "masterizacion",
    name: "Masterizacion",
    shortName: "Master",
    description: "LUFS, true peak, dinamica, dither, correlacion y objetivos por plataforma."
  },
  {
    id: "codecs",
    name: "Codecs y Telecom",
    shortName: "Codecs",
    description: "Bitrate, compresion, Nyquist, aliasing, VoIP, MOS, jitter y packet loss."
  }
];

const tool = (
  id: string,
  category: ToolCategory,
  name: string,
  description: string,
  tags: string[],
  expectedInputs: string[],
  status: ToolStatus = "planned"
): ToolDefinition => ({
  id,
  category,
  name,
  description,
  tags,
  expectedInputs,
  status,
  route: `/tools/${id}`
});

export const tools: ToolDefinition[] = [
  tool("rt60", "acustica", "Calculadora RT60", "Tiempo de reverberacion con Sabine y Eyring.", ["sabine", "eyring", "room"], ["Dimensiones", "Materiales", "Coeficientes"], "prototype"),
  tool("c50-c80", "acustica", "Calculadora C50/C80", "Claridad musical y de habla a partir de energia temprana/tardia.", ["claridad", "speech", "music"], ["Energia temprana", "Energia tardia"]),
  tool("sti", "acustica", "Calculadora STI", "Estimador de inteligibilidad para salas y sistemas de refuerzo.", ["speech", "intelligibility"], ["Ruido", "Reverberacion", "Modulacion"]),
  tool("qrd", "acustica", "Calculadora QRD", "Secuencias, profundidad y frecuencia de trabajo para difusores QRD.", ["diffusion", "qrd"], ["Orden", "Frecuencia minima", "Ancho de pozo"], "prototype"),
  tool("room-modes", "acustica", "Modos Propios", "Modos axiales, tangenciales y oblicuos por dimensiones de sala.", ["modes", "bass"], ["Largo", "Ancho", "Alto"], "prototype"),
  tool("helmholtz-traps", "acustica", "Trampas Helmholtz", "Sintonizacion de resonadores para control de graves.", ["bass", "absorber"], ["Volumen", "Cuello", "Frecuencia objetivo"]),
  tool("tl-stc", "acustica", "TL/STC Aislamiento", "Perdida por transmision y estimacion STC.", ["isolation", "stc"], ["Masa", "Frecuencia", "Capas"]),
  tool("sbir", "acustica", "SBIR", "Interferencia por limites y cancelaciones por distancia.", ["speaker", "boundary"], ["Distancia a muro", "Velocidad sonido"]),
  tool("monitor-placement", "acustica", "Ubicador Monitores/Sub", "Puntos iniciales para monitores, subwoofer y posicion de escucha.", ["studio", "subwoofer"], ["Dimensiones", "Posicion escucha"]),
  tool("eq-q-bw", "senal", "Filtros EQ Q/BW", "Conversion entre Q, bandwidth y octavas.", ["eq", "filter"], ["Q", "Bandwidth", "Frecuencia"]),
  tool("delay-distance", "senal", "Delay ms/metros", "Conversor entre tiempo, distancia y samples.", ["delay", "distance"], ["Milisegundos", "Metros", "Temperatura"], "prototype"),
  tool("phase", "senal", "Calculadora de Fase", "Fase en grados/radianes por frecuencia y delay.", ["phase", "delay"], ["Frecuencia", "Delay"]),
  tool("audio-units", "senal", "Unidades Audio", "Conversion entre dBu, dBV, dBFS y dBSPL.", ["db", "units"], ["Referencia", "Nivel"]),
  tool("snr", "senal", "SNR", "Relacion senal-ruido y margen util.", ["noise", "snr"], ["Nivel senal", "Nivel ruido"]),
  tool("thdn", "senal", "THD+N", "Distorsion total mas ruido en porcentaje y dB.", ["distortion", "noise"], ["Fundamental", "Armonicos", "Ruido"]),
  tool("gain-staging", "senal", "Gain Staging", "Headroom dinamico y niveles por etapa.", ["gain", "headroom"], ["Nivel entrada", "Ganancia", "Headroom"]),
  tool("latency", "senal", "Latencia Samples/ms", "Conversion entre samples, milisegundos y sample rate.", ["latency", "samples"], ["Samples", "Sample rate"]),
  tool("crossover", "senal", "Crossover", "Frecuencias de corte y pendientes para vias.", ["speaker", "crossover"], ["Drivers", "Pendiente", "Frecuencia"]),
  tool("speaker-box", "senal", "Cajas Acusticas", "Aproximacion inicial sealed/ported.", ["speaker", "enclosure"], ["Parametros T/S", "Volumen"]),
  tool("directivity", "senal", "Directividad", "Estimacion de cobertura por tamano y frecuencia.", ["speaker", "coverage"], ["Diametro", "Frecuencia"]),
  tool("multiway-alignment", "senal", "Alineacion Multi-way", "Ajuste temporal entre vias.", ["speaker", "alignment"], ["Offsets", "Frecuencia cruce"]),
  tool("impedance", "senal", "Impedancia Serie/Paralelo", "Combinacion de cargas resistivas nominales.", ["impedance", "speaker"], ["Impedancias", "Conexion"]),
  tool("sound-propagation", "senal", "Propagacion del Sonido", "Tiempo de llegada por distancia y temperatura.", ["speed", "distance"], ["Distancia", "Temperatura"]),
  tool("spl-distance", "senal", "SPL a Distancia", "Ley inversa y perdida por distancia.", ["spl", "distance"], ["SPL origen", "Distancias"]),
  tool("spectral-coherence", "senal", "Coherencia Espectral", "Analizador conceptual de coherencia entre senales.", ["spectrum", "coherence"], ["Canal A", "Canal B"]),
  tool("scale-builder", "musica", "Constructor de Escalas", "Mayor, menor, modos griegos, pentatonicas, blues y armonicas.", ["scales", "circle"], ["Tonica", "Tipo de escala"], "prototype"),
  tool("chord-generator", "musica", "Generador de Acordes", "Triadas, tetradas, extensiones y alteraciones.", ["chords", "harmony"], ["Raiz", "Calidad", "Extensiones"]),
  tool("transpose", "musica", "Transposicion", "Cambio de tonalidad preservando intervalos.", ["key", "interval"], ["Tonalidad origen", "Destino", "Notas"]),
  tool("reference-tuner", "musica", "Afinador de Referencia", "A4 432/440/444 Hz y desviacion en cents.", ["tuning", "cents"], ["A4", "Nota", "Octava"], "prototype"),
  tool("temperaments", "musica", "Temperamentos", "Igual, justo, pitagorico y meantone.", ["temperament", "cents"], ["Sistema", "Tonica"]),
  tool("microtonality", "musica", "Microtonalidad EDO", "Divisiones de octava 12, 19, 24, 31 y 53 EDO.", ["edo", "microtonal"], ["EDO", "Paso"]),
  tool("note-frequency", "musica", "Nota a Frecuencia", "Conversion nota/Hz con referencia configurable.", ["frequency", "note"], ["Nota", "Octava", "A4"]),
  tool("tempo-ms", "musica", "Tempo a ms", "Divisiones ritmicas, delays musicales y BPM.", ["tempo", "delay"], ["BPM", "Subdivision"]),
  tool("interval-cents", "musica", "Intervalos en Cents", "Ratio, cents y distancia musical.", ["interval", "cents"], ["Frecuencia A", "Frecuencia B"]),
  tool("equal-loudness", "musica", "Fletcher-Munson", "Curvas de igual sonoridad para escucha relativa.", ["psychoacoustics", "loudness"], ["Phon", "Frecuencia"]),
  tool("mel-bark-erb", "musica", "Mel/Bark/ERB", "Conversion entre escalas perceptuales y Hz.", ["psychoacoustics", "scale"], ["Hz", "Escala"]),
  tool("masking", "musica", "Enmascaramiento", "Estimacion de masking espectral.", ["masking", "psychoacoustics"], ["Frecuencia masker", "Nivel", "Target"]),
  tool("lufs", "masterizacion", "Calculadora LUFS", "Integrated, short-term y momentary segun EBU R128.", ["loudness", "ebu"], ["Medicion", "Ventana", "Gating"], "prototype"),
  tool("true-peak", "masterizacion", "True Peak", "Prediccion de picos inter-sample.", ["peak", "limiting"], ["Samples", "Oversampling"]),
  tool("dynamic-range", "masterizacion", "Dynamic Range Meter", "DR score estilo metrica Pleasurize.", ["dr", "dynamics"], ["Peak", "RMS"]),
  tool("crest-factor", "masterizacion", "Crest Factor", "Relacion pico/RMS para senales y masters.", ["dynamics", "rms"], ["Peak", "RMS"], "prototype"),
  tool("stereo-width", "masterizacion", "Stereo Width Analyzer", "Correlacion de fase L/R entre -1 y +1.", ["stereo", "phase"], ["Canal L", "Canal R"]),
  tool("dither", "masterizacion", "Dither", "Tipo y noise shaping segun bit depth destino.", ["dither", "bit-depth"], ["Bit depth origen", "Destino"]),
  tool("loudness-platforms", "masterizacion", "Loudness War Comparator", "Comparacion LUFS para Spotify, YouTube y otras plataformas.", ["platforms", "lufs"], ["LUFS master", "Plataforma"]),
  tool("bitrate", "codecs", "Bitrate", "CBR/VBR y estimador de tamano de archivo.", ["bitrate", "file-size"], ["Bitrate", "Duracion", "Canales"], "prototype"),
  tool("codec-compare", "codecs", "Comparador de Codecs", "MP3, AAC, Opus, FLAC, ALAC y OGG por frecuencia y uso.", ["codec", "compression"], ["Codec", "Bitrate"]),
  tool("compression-ratio", "codecs", "Relacion de Compresion", "Uncompressed vs compressed.", ["compression", "ratio"], ["Tamano original", "Comprimido"]),
  tool("nyquist", "codecs", "Nyquist", "Sample rate minima y frecuencia maxima reproducible.", ["sample-rate", "nyquist"], ["Sample rate", "Frecuencia maxima"]),
  tool("aliasing", "codecs", "Aliasing Predictor", "Frecuencias que se plegaran sin filtro anti-aliasing.", ["aliasing", "sampling"], ["Frecuencia entrada", "Sample rate"]),
  tool("telephone-bandwidth", "codecs", "Ancho de Banda Telefonico", "300 Hz a 3.4 kHz y perdida espectral estimada.", ["telecom", "bandwidth"], ["Rango fuente", "Codec"]),
  tool("voip-bandwidth", "codecs", "VoIP Bandwidth", "G.711, G.729 y Opus con overhead IP/UDP/RTP.", ["voip", "network"], ["Codec", "Packetization", "Overhead"]),
  tool("codec-delay", "codecs", "Codec Delay", "Delay algoritimico, packetization y jitter buffer.", ["voip", "latency"], ["Codec", "Packet time", "Jitter"]),
  tool("mos", "codecs", "MOS Calculator", "Prediccion Mean Opinion Score basada en codec y packet loss.", ["mos", "quality"], ["Codec", "Packet loss", "Jitter"]),
  tool("packet-loss", "codecs", "Packet Loss Impact", "Degradacion estimada por perdida de paquetes.", ["network", "loss"], ["Packet loss", "Codec"]),
  tool("jitter-buffer", "codecs", "Jitter Buffer", "Tamano optimo segun condiciones de red.", ["jitter", "voip"], ["Jitter medio", "Picos", "Latencia objetivo"]),
  tool("echo-tail", "codecs", "Echo Tail", "Duracion de eco en salas grandes expresada en ms.", ["echo", "room"], ["Distancia", "Reflexiones"]),
  tool("sample-rate-converter", "codecs", "Sample Rate Converter", "44.1k, 48k, 96k y 192k con estimacion de calidad.", ["sample-rate", "conversion"], ["Origen", "Destino"]),
  tool("bit-depth-converter", "codecs", "Bit Depth Converter", "16-bit, 24-bit y 32-bit float con SNR teorico.", ["bit-depth", "snr"], ["Origen", "Destino"]),
  tool("surround-format", "codecs", "Formato Surround", "5.1, 7.1 y Atmos con channel mapping.", ["surround", "mapping"], ["Formato origen", "Destino"]),
  tool("balance-downmix", "codecs", "Balance Downmix", "Downmix estereo desde 5.1/7.1.", ["downmix", "surround"], ["Canales", "Coeficientes"])
];

export function getCategory(categoryId: ToolCategory) {
  return categories.find((category) => category.id === categoryId);
}

export function getToolsByCategory(categoryId: ToolCategory) {
  return tools.filter((item) => item.category === categoryId);
}

export function getToolById(toolId: string) {
  return tools.find((item) => item.id === toolId);
}
