export type DelaySource = "milliseconds" | "meters" | "samples";

export type DelayDistanceInput = {
  source: DelaySource;
  value: number;
  temperatureCelsius: number;
  sampleRate: number;
};

export type DelayDistanceResult = {
  speedOfSound: number;
  milliseconds: number;
  meters: number;
  feet: number;
  samples: number;
  phaseAt100Hz: number;
  phaseAt1000Hz: number;
};

const FEET_PER_METER = 3.280839895;

export function speedOfSoundAtTemperature(temperatureCelsius: number) {
  return 331.3 + 0.606 * temperatureCelsius;
}

export function calculateDelayDistance(input: DelayDistanceInput): DelayDistanceResult {
  const speedOfSound = speedOfSoundAtTemperature(input.temperatureCelsius);
  const sampleRate = Math.max(1, input.sampleRate);
  const value = Math.max(0, input.value);

  const milliseconds = getMilliseconds(input.source, value, speedOfSound, sampleRate);
  const meters = (milliseconds / 1000) * speedOfSound;
  const samples = (milliseconds / 1000) * sampleRate;

  return {
    speedOfSound,
    milliseconds,
    meters,
    feet: meters * FEET_PER_METER,
    samples,
    phaseAt100Hz: getWrappedPhase(100, milliseconds),
    phaseAt1000Hz: getWrappedPhase(1000, milliseconds)
  };
}

export function formatDelay(value: number, digits = 2) {
  return value.toLocaleString("es-CL", {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits
  });
}

function getMilliseconds(source: DelaySource, value: number, speedOfSound: number, sampleRate: number) {
  if (source === "meters") {
    return (value / speedOfSound) * 1000;
  }

  if (source === "samples") {
    return (value / sampleRate) * 1000;
  }

  return value;
}

function getWrappedPhase(frequency: number, milliseconds: number) {
  const degrees = frequency * (milliseconds / 1000) * 360;
  return ((degrees % 360) + 360) % 360;
}
