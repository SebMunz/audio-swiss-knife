import { sum } from "mathjs";

export const octaveBands = [125, 250, 500, 1000, 2000, 4000] as const;

export type OctaveBand = (typeof octaveBands)[number];

export type RoomDimensions = {
  length: number;
  width: number;
  height: number;
};

export type SurfaceKey = "floor" | "ceiling" | "frontBack" | "sideWalls";

export type AbsorptionProfile = Record<OctaveBand, number>;

export type SurfaceMaterial = {
  id: string;
  name: string;
  absorption: AbsorptionProfile;
};

export type Rt60Input = {
  dimensions: RoomDimensions;
  materials: Record<SurfaceKey, SurfaceMaterial>;
};

export type Rt60BandResult = {
  frequency: OctaveBand;
  sabine: number | null;
  eyring: number | null;
  averageAbsorption: number;
  equivalentAbsorptionArea: number;
};

export type Rt60Result = {
  volume: number;
  totalSurfaceArea: number;
  bands: Rt60BandResult[];
  midSabine: number | null;
  midEyring: number | null;
  targetRange: {
    min: number;
    max: number;
  };
};

export const rt60Materials: SurfaceMaterial[] = [
  {
    id: "painted-drywall",
    name: "Drywall pintado",
    absorption: { 125: 0.1, 250: 0.05, 500: 0.04, 1000: 0.07, 2000: 0.09, 4000: 0.08 }
  },
  {
    id: "concrete",
    name: "Hormigon / muro duro",
    absorption: { 125: 0.01, 250: 0.01, 500: 0.02, 1000: 0.02, 2000: 0.02, 4000: 0.02 }
  },
  {
    id: "wood-floor",
    name: "Piso madera",
    absorption: { 125: 0.15, 250: 0.11, 500: 0.1, 1000: 0.07, 2000: 0.06, 4000: 0.07 }
  },
  {
    id: "carpet",
    name: "Alfombra media",
    absorption: { 125: 0.08, 250: 0.24, 500: 0.57, 1000: 0.69, 2000: 0.71, 4000: 0.73 }
  },
  {
    id: "heavy-curtain",
    name: "Cortina pesada",
    absorption: { 125: 0.14, 250: 0.35, 500: 0.55, 1000: 0.72, 2000: 0.7, 4000: 0.65 }
  },
  {
    id: "acoustic-panel",
    name: "Panel poroso 100 mm",
    absorption: { 125: 0.35, 250: 0.8, 500: 1, 1000: 1, 2000: 0.98, 4000: 0.95 }
  }
];

export function roomVolume({ length, width, height }: RoomDimensions) {
  return length * width * height;
}

export function roomSurfaceAreas({ length, width, height }: RoomDimensions): Record<SurfaceKey, number> {
  return {
    floor: length * width,
    ceiling: length * width,
    frontBack: 2 * width * height,
    sideWalls: 2 * length * height
  };
}

export function totalSurfaceArea(dimensions: RoomDimensions) {
  return Number(sum(Object.values(roomSurfaceAreas(dimensions))));
}

export function sabineRt60(volume: number, equivalentAbsorptionArea: number) {
  if (volume <= 0 || equivalentAbsorptionArea <= 0) {
    return null;
  }

  return (0.161 * volume) / equivalentAbsorptionArea;
}

export function eyringRt60(volume: number, surfaceArea: number, averageAbsorption: number) {
  if (volume <= 0 || surfaceArea <= 0 || averageAbsorption <= 0 || averageAbsorption >= 1) {
    return null;
  }

  return (0.161 * volume) / (-surfaceArea * Math.log(1 - averageAbsorption));
}

export function calculateRt60(input: Rt60Input): Rt60Result {
  const volume = roomVolume(input.dimensions);
  const areas = roomSurfaceAreas(input.dimensions);
  const surfaceArea = totalSurfaceArea(input.dimensions);

  const bands = octaveBands.map((frequency) => {
    const equivalentAbsorptionArea = Number(
      sum(
        (Object.keys(areas) as SurfaceKey[]).map((surface) => {
          return areas[surface] * input.materials[surface].absorption[frequency];
        })
      )
    );
    const averageAbsorption = surfaceArea > 0 ? equivalentAbsorptionArea / surfaceArea : 0;

    return {
      frequency,
      sabine: sabineRt60(volume, equivalentAbsorptionArea),
      eyring: eyringRt60(volume, surfaceArea, averageAbsorption),
      averageAbsorption,
      equivalentAbsorptionArea
    };
  });

  return {
    volume,
    totalSurfaceArea: surfaceArea,
    bands,
    midSabine: averageRt60AtMidBands(bands, "sabine"),
    midEyring: averageRt60AtMidBands(bands, "eyring"),
    targetRange: estimateControlRoomTarget(volume)
  };
}

export function averageRt60AtMidBands(bands: Rt60BandResult[], method: "sabine" | "eyring") {
  const midBands = bands.filter((band) => band.frequency === 500 || band.frequency === 1000);
  const values = midBands.map((band) => band[method]).filter((value): value is number => value !== null);

  if (values.length === 0) {
    return null;
  }

  return Number(sum(values)) / values.length;
}

export function estimateControlRoomTarget(volume: number) {
  const center = Math.max(0.18, Math.min(0.45, 0.25 * Math.pow(Math.max(volume, 1) / 100, 1 / 3)));

  return {
    min: center * 0.8,
    max: center * 1.2
  };
}

export function formatSeconds(value: number | null) {
  return value === null ? "--" : `${value.toFixed(2)} s`;
}
