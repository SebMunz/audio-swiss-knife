export type AudioUnit = "dbu" | "dbv" | "dbfs" | "dbspl";

export type AudioUnitsInput = {
  unit: AudioUnit;
  level: number;
  dbfsReferenceDbu: number;
};

export type AudioUnitsResult = {
  inputUnit: AudioUnit;
  inputLevel: number;
  dbu: number | null;
  dbv: number | null;
  dbfs: number | null;
  voltsRms: number | null;
  dbspl: number | null;
  pressurePa: number | null;
  pressureMicroPa: number | null;
  dbfsReferenceDbu: number;
};

const DBU_REFERENCE_VOLTS = 0.775;
const DBSPL_REFERENCE_PA = 0.00002;

export function calculateAudioUnits(input: AudioUnitsInput): AudioUnitsResult {
  const level = Number.isFinite(input.level) ? input.level : 0;
  const dbfsReferenceDbu = Number.isFinite(input.dbfsReferenceDbu) ? input.dbfsReferenceDbu : 24;

  if (input.unit === "dbspl") {
    const pressurePa = DBSPL_REFERENCE_PA * 10 ** (level / 20);

    return {
      inputUnit: input.unit,
      inputLevel: level,
      dbu: null,
      dbv: null,
      dbfs: null,
      voltsRms: null,
      dbspl: level,
      pressurePa,
      pressureMicroPa: pressurePa * 1_000_000,
      dbfsReferenceDbu
    };
  }

  const dbu = getDbu(input.unit, level, dbfsReferenceDbu);
  const voltsRms = DBU_REFERENCE_VOLTS * 10 ** (dbu / 20);
  const dbv = 20 * Math.log10(voltsRms);

  return {
    inputUnit: input.unit,
    inputLevel: level,
    dbu,
    dbv,
    dbfs: dbu - dbfsReferenceDbu,
    voltsRms,
    dbspl: null,
    pressurePa: null,
    pressureMicroPa: null,
    dbfsReferenceDbu
  };
}

export function formatAudioNumber(value: number, digits = 2) {
  return value.toLocaleString("es-CL", {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits
  });
}

function getDbu(unit: AudioUnit, level: number, dbfsReferenceDbu: number) {
  if (unit === "dbv") {
    const voltsRms = 10 ** (level / 20);
    return 20 * Math.log10(voltsRms / DBU_REFERENCE_VOLTS);
  }

  if (unit === "dbfs") {
    return level + dbfsReferenceDbu;
  }

  return level;
}
