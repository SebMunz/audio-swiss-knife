export type ThdnInput = {
  fundamentalDbfs: number;
  harmonic2Dbfs: number;
  harmonic3Dbfs: number;
  harmonic4Dbfs: number;
  harmonic5Dbfs: number;
  noiseDbfs: number;
};

export type ThdnResult = {
  fundamentalDbfs: number;
  harmonicRms: number;
  noiseRms: number;
  thdRatio: number;
  thdPercent: number;
  thdDb: number;
  thdnRatio: number;
  thdnPercent: number;
  thdnDb: number;
  sinadDb: number;
  verdict: "excellent" | "clean" | "colored" | "distorted";
};

export function calculateThdn(input: ThdnInput): ThdnResult {
  const fundamentalDbfs = finiteOrZero(input.fundamentalDbfs);
  const fundamentalRms = dbToLinear(fundamentalDbfs);
  const harmonicRms = rss([
    dbToLinear(input.harmonic2Dbfs),
    dbToLinear(input.harmonic3Dbfs),
    dbToLinear(input.harmonic4Dbfs),
    dbToLinear(input.harmonic5Dbfs)
  ]);
  const noiseRms = dbToLinear(input.noiseDbfs);
  const thdRatio = safeRatio(harmonicRms, fundamentalRms);
  const thdnRatio = safeRatio(rss([harmonicRms, noiseRms]), fundamentalRms);

  return {
    fundamentalDbfs,
    harmonicRms,
    noiseRms,
    thdRatio,
    thdPercent: thdRatio * 100,
    thdDb: ratioToDb(thdRatio),
    thdnRatio,
    thdnPercent: thdnRatio * 100,
    thdnDb: ratioToDb(thdnRatio),
    sinadDb: -ratioToDb(thdnRatio),
    verdict: getVerdict(thdnRatio * 100)
  };
}

export function formatThdnNumber(value: number, digits = 2) {
  return value.toLocaleString("es-CL", {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits
  });
}

function dbToLinear(db: number) {
  return 10 ** (finiteOrZero(db) / 20);
}

function ratioToDb(ratio: number) {
  return ratio <= 0 ? Number.NEGATIVE_INFINITY : 20 * Math.log10(ratio);
}

function rss(values: number[]) {
  return Math.sqrt(values.reduce((sum, value) => sum + value ** 2, 0));
}

function safeRatio(value: number, reference: number) {
  return reference <= 0 ? 0 : value / reference;
}

function getVerdict(thdnPercent: number): ThdnResult["verdict"] {
  if (thdnPercent < 0.01) {
    return "excellent";
  }

  if (thdnPercent < 0.1) {
    return "clean";
  }

  if (thdnPercent < 1) {
    return "colored";
  }

  return "distorted";
}

function finiteOrZero(value: number) {
  return Number.isFinite(value) ? value : 0;
}
