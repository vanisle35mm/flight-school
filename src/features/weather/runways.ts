export type Runway = {
  id: string;
  ends: [{ id: string; heading: number }, { id: string; heading: number }];
  lengthFt: number;
  widthFt: number;
  surface: string;
  primary?: boolean;
};

export type RunwayWind = Runway & {
  preferredEnd: string | null;
  preferredHeading: number | null;
  alignment: number | null;
  headwindKt: number | null;
  crosswindKt: number | null;
};

// Dimensions from the Victoria Airport Authority 2023-2042 Master Plan.
export const CYYJ_RUNWAYS: Runway[] = [
  { id: '09/27', ends: [{ id: '09', heading: 106 }, { id: '27', heading: 286 }], lengthFt: 6998, widthFt: 200, surface: 'Grooved asphalt', primary: true },
  { id: '03/21', ends: [{ id: '03', heading: 44 }, { id: '21', heading: 224 }], lengthFt: 5027, widthFt: 200, surface: 'Asphalt' },
  { id: '13/31', ends: [{ id: '13', heading: 152 }, { id: '31', heading: 332 }], lengthFt: 5001, widthFt: 200, surface: 'Grooved asphalt' }
];

const SURFACE_LABELS: Record<string, string> = {
  A: 'Asphalt',
  C: 'Concrete',
  G: 'Grass',
  GVL: 'Gravel',
  W: 'Water'
};

const magneticVariation = (value: unknown) => {
  if (typeof value !== 'string') return 0;
  const match = value.trim().match(/^(\d+(?:\.\d+)?)([EW])$/i);
  if (!match) return 0;
  const degrees = Number.parseFloat(match[1]);
  return match[2].toUpperCase() === 'E' ? degrees : -degrees;
};

export const normalizeAirportRunways = (value: unknown, station: string, magneticDeclination?: unknown, source?: unknown): Runway[] => {
  if (!Array.isArray(value)) return station === 'CYYJ' ? CYYJ_RUNWAYS : [];
  const variation = source === 'Intl' ? magneticVariation(magneticDeclination) : 0;
  const runways = value.map((item): Runway | null => {
    if (!item || typeof item !== 'object') return null;
    const source = item as Record<string, unknown>;
    const id = typeof source.id === 'string' ? source.id.replace('-', '/') : '';
    const ends = id.split('/');
    const dimension = typeof source.dimension === 'string' ? source.dimension.match(/(\d+)\s*x\s*(\d+)/i) : null;
    const alignment = typeof source.alignment === 'number' && Number.isFinite(source.alignment) ? source.alignment : Number.parseFloat(String(source.alignment));
    if (ends.length !== 2 || !dimension || !Number.isFinite(alignment)) return null;
    const firstHeading = (Math.round(alignment + variation) + 360) % 360;
    return {
      id: `${ends[0]}/${ends[1]}`,
      ends: [{ id: ends[0], heading: firstHeading }, { id: ends[1], heading: (firstHeading + 180) % 360 }],
      lengthFt: Number.parseInt(dimension[1], 10),
      widthFt: Number.parseInt(dimension[2], 10),
      surface: SURFACE_LABELS[String(source.surface)] ?? 'Paved'
    };
  }).filter((runway): runway is Runway => runway !== null);
  const longest = Math.max(...runways.map((runway) => runway.lengthFt));
  return runways.map((runway) => ({ ...runway, primary: runway.lengthFt === longest }));
};

const angleDifference = (left: number, right: number) => Math.abs(((left - right + 540) % 360) - 180);

export const getRunwayWind = (runway: Runway, windDirection: number | null, windSpeedKt: number | null): RunwayWind => {
  if (windDirection === null || windSpeedKt === null) {
    return { ...runway, preferredEnd: null, preferredHeading: null, alignment: null, headwindKt: null, crosswindKt: null };
  }
  const preferred = [...runway.ends].sort((left, right) => angleDifference(left.heading, windDirection) - angleDifference(right.heading, windDirection))[0];
  const alignment = angleDifference(preferred.heading, windDirection);
  const radians = alignment * Math.PI / 180;
  return {
    ...runway,
    preferredEnd: preferred.id,
    preferredHeading: preferred.heading,
    alignment,
    headwindKt: Math.max(0, Math.round(windSpeedKt * Math.cos(radians))),
    crosswindKt: Math.round(Math.abs(windSpeedKt * Math.sin(radians)))
  };
};

export const getCyyjRunwayWinds = (windDirection: number | null, windSpeedKt: number | null) =>
  CYYJ_RUNWAYS.map((runway) => getRunwayWind(runway, windDirection, windSpeedKt));
