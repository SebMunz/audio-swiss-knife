export function frequencyRatioToCents(ratio: number) {
  return 1200 * Math.log2(ratio);
}

export function centsToFrequencyRatio(cents: number) {
  return 2 ** (cents / 1200);
}
