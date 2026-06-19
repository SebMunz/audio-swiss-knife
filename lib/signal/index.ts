export function dbToLinear(db: number) {
  return 10 ** (db / 20);
}

export function linearToDb(linear: number) {
  return 20 * Math.log10(linear);
}
