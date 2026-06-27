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
  { id: '09/27', ends: [{ id: '09', heading: 90 }, { id: '27', heading: 270 }], lengthFt: 6998, widthFt: 200, surface: 'Grooved asphalt', primary: true },
  { id: '03/21', ends: [{ id: '03', heading: 30 }, { id: '21', heading: 210 }], lengthFt: 5027, widthFt: 200, surface: 'Asphalt' },
  { id: '14/32', ends: [{ id: '14', heading: 140 }, { id: '32', heading: 320 }], lengthFt: 5001, widthFt: 200, surface: 'Grooved asphalt' }
];

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
