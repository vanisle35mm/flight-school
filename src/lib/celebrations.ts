export type FlightSchoolCelebration = {
  type: 'milestone' | 'phase';
  title: string;
  message?: string;
};

export const FLIGHT_SCHOOL_CELEBRATION_EVENT = 'flightschool:celebration';

export const emitFlightSchoolCelebration = (celebration: FlightSchoolCelebration) => {
  window.dispatchEvent(new CustomEvent<FlightSchoolCelebration>(FLIGHT_SCHOOL_CELEBRATION_EVENT, { detail: celebration }));
};
