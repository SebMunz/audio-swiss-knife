export type EqInputMode = "q" | "bandwidth";

export type EqQBandwidthInput = {
  mode: EqInputMode;
  value: number;
  centerFrequency: number;
};

export type EqQBandwidthResult = {
  q: number;
  bandwidthOctaves: number;
  lowerFrequency: number;
  upperFrequency: number;
  frequencySpan: number;
};

export function calculateEqQBandwidth(input: EqQBandwidthInput): EqQBandwidthResult {
  const centerFrequency = Math.max(1, input.centerFrequency);
  const value = Math.max(0.001, input.value);
  const bandwidthOctaves = input.mode === "q" ? qToBandwidthOctaves(value) : value;
  const q = input.mode === "bandwidth" ? bandwidthOctavesToQ(value) : value;
  const octaveRatio = 2 ** (bandwidthOctaves / 2);
  const lowerFrequency = centerFrequency / octaveRatio;
  const upperFrequency = centerFrequency * octaveRatio;

  return {
    q,
    bandwidthOctaves,
    lowerFrequency,
    upperFrequency,
    frequencySpan: upperFrequency - lowerFrequency
  };
}

export function qToBandwidthOctaves(q: number) {
  const safeQ = Math.max(0.001, q);
  const inner = (2 * safeQ ** 2 + 1) / (2 * safeQ ** 2);

  return Math.log2(inner + Math.sqrt(inner ** 2 - 1));
}

export function bandwidthOctavesToQ(bandwidthOctaves: number) {
  const ratio = 2 ** Math.max(0.001, bandwidthOctaves);

  return Math.sqrt(ratio) / (ratio - 1);
}

export function formatEqNumber(value: number, digits = 2) {
  return value.toLocaleString("es-CL", {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits
  });
}

export function formatFrequency(value: number) {
  if (value >= 1000) {
    return `${formatEqNumber(value / 1000, 2)} kHz`;
  }

  return `${formatEqNumber(value, 1)} Hz`;
}
