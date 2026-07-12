export type SnrInput = {
  signalLevelDb: number;
  noiseLevelDb: number;
  targetSnrDb: number;
};

export type SnrResult = {
  signalLevelDb: number;
  noiseLevelDb: number;
  targetSnrDb: number;
  snrDb: number;
  amplitudeRatio: number;
  powerRatio: number;
  equivalentBits: number;
  marginToTargetDb: number;
  verdict: "poor" | "usable" | "clean" | "excellent";
};

export function calculateSnr(input: SnrInput): SnrResult {
  const signalLevelDb = finiteOrZero(input.signalLevelDb);
  const noiseLevelDb = finiteOrZero(input.noiseLevelDb);
  const targetSnrDb = finiteOrZero(input.targetSnrDb);
  const snrDb = signalLevelDb - noiseLevelDb;

  return {
    signalLevelDb,
    noiseLevelDb,
    targetSnrDb,
    snrDb,
    amplitudeRatio: 10 ** (snrDb / 20),
    powerRatio: 10 ** (snrDb / 10),
    equivalentBits: snrDb / 6.02,
    marginToTargetDb: snrDb - targetSnrDb,
    verdict: getVerdict(snrDb)
  };
}

export function formatSnrNumber(value: number, digits = 2) {
  return value.toLocaleString("es-CL", {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits
  });
}

function getVerdict(snrDb: number): SnrResult["verdict"] {
  if (snrDb < 40) {
    return "poor";
  }

  if (snrDb < 60) {
    return "usable";
  }

  if (snrDb < 90) {
    return "clean";
  }

  return "excellent";
}

function finiteOrZero(value: number) {
  return Number.isFinite(value) ? value : 0;
}
