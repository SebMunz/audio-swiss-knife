export type GainStagingInput = {
  inputLevelDbfs: number;
  gainDb: number;
  ceilingDbfs: number;
  noiseFloorDbfs: number;
};

export type GainStagingResult = {
  inputLevelDbfs: number;
  gainDb: number;
  outputLevelDbfs: number;
  ceilingDbfs: number;
  headroomDb: number;
  noiseFloorOutDbfs: number;
  snrDb: number;
  isClipping: boolean;
  verdict: "clipping" | "hot" | "nominal" | "low";
};

export function calculateGainStaging(input: GainStagingInput): GainStagingResult {
  const inputLevelDbfs = finiteOrZero(input.inputLevelDbfs);
  const gainDb = finiteOrZero(input.gainDb);
  const ceilingDbfs = finiteOrZero(input.ceilingDbfs);
  const noiseFloorDbfs = finiteOrZero(input.noiseFloorDbfs);
  const outputLevelDbfs = inputLevelDbfs + gainDb;
  const noiseFloorOutDbfs = noiseFloorDbfs + gainDb;
  const headroomDb = ceilingDbfs - outputLevelDbfs;

  return {
    inputLevelDbfs,
    gainDb,
    outputLevelDbfs,
    ceilingDbfs,
    headroomDb,
    noiseFloorOutDbfs,
    snrDb: outputLevelDbfs - noiseFloorOutDbfs,
    isClipping: headroomDb < 0,
    verdict: getVerdict(outputLevelDbfs, headroomDb)
  };
}

export function formatGainNumber(value: number, digits = 2) {
  return value.toLocaleString("es-CL", {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits
  });
}

function getVerdict(outputLevelDbfs: number, headroomDb: number): GainStagingResult["verdict"] {
  if (headroomDb < 0) {
    return "clipping";
  }

  if (headroomDb < 6) {
    return "hot";
  }

  if (outputLevelDbfs >= -24) {
    return "nominal";
  }

  return "low";
}

function finiteOrZero(value: number) {
  return Number.isFinite(value) ? value : 0;
}
