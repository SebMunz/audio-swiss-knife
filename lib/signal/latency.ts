export type LatencyInputMode = "samples" | "milliseconds";

export type LatencyInput = {
  mode: LatencyInputMode;
  value: number;
  sampleRate: number;
  buffers: number;
};

export type LatencyResult = {
  sampleRate: number;
  buffers: number;
  samplesPerBuffer: number;
  millisecondsPerBuffer: number;
  totalSamples: number;
  totalMilliseconds: number;
  roundTripMilliseconds: number;
  videoFrames60fps: number;
};

export function calculateLatency(input: LatencyInput): LatencyResult {
  const sampleRate = Math.max(1, input.sampleRate);
  const buffers = Math.max(1, Math.round(input.buffers));
  const value = Math.max(0, input.value);
  const samplesPerBuffer = input.mode === "milliseconds" ? (value / 1000) * sampleRate : value;
  const millisecondsPerBuffer = input.mode === "samples" ? (value / sampleRate) * 1000 : value;
  const totalSamples = samplesPerBuffer * buffers;
  const totalMilliseconds = millisecondsPerBuffer * buffers;

  return {
    sampleRate,
    buffers,
    samplesPerBuffer,
    millisecondsPerBuffer,
    totalSamples,
    totalMilliseconds,
    roundTripMilliseconds: totalMilliseconds * 2,
    videoFrames60fps: totalMilliseconds / (1000 / 60)
  };
}

export function formatLatencyNumber(value: number, digits = 2) {
  return value.toLocaleString("es-CL", {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits
  });
}
