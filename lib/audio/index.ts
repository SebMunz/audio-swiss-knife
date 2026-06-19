export function samplesToMilliseconds(samples: number, sampleRate: number) {
  return (samples / sampleRate) * 1000;
}

export function millisecondsToSamples(milliseconds: number, sampleRate: number) {
  return (milliseconds / 1000) * sampleRate;
}
