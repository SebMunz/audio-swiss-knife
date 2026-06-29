export type PhaseInputMode = "delay" | "phase";

export type PhaseInput = {
  mode: PhaseInputMode;
  frequency: number;
  value: number;
};

export type PhaseResult = {
  frequency: number;
  periodMs: number;
  delayMs: number;
  delaySamples48k: number;
  cycles: number;
  rawDegrees: number;
  wrappedDegrees: number;
  signedDegrees: number;
  radians: number;
};

export function calculatePhase(input: PhaseInput): PhaseResult {
  const frequency = Math.max(0.001, input.frequency);
  const value = Number.isFinite(input.value) ? input.value : 0;
  const periodMs = 1000 / frequency;
  const delayMs = input.mode === "phase" ? (value / 360) * periodMs : value;
  const cycles = delayMs / periodMs;
  const rawDegrees = cycles * 360;
  const wrappedDegrees = wrapDegrees(rawDegrees);

  return {
    frequency,
    periodMs,
    delayMs,
    delaySamples48k: (delayMs / 1000) * 48000,
    cycles,
    rawDegrees,
    wrappedDegrees,
    signedDegrees: toSignedDegrees(wrappedDegrees),
    radians: (wrappedDegrees * Math.PI) / 180
  };
}

export function formatPhaseNumber(value: number, digits = 2) {
  return value.toLocaleString("es-CL", {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits
  });
}

function wrapDegrees(degrees: number) {
  return ((degrees % 360) + 360) % 360;
}

function toSignedDegrees(degrees: number) {
  return degrees > 180 ? degrees - 360 : degrees;
}
