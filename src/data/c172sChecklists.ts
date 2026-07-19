import type { FlightChecklistTemplate } from '../types';

export const c172sChecklistLibrary: FlightChecklistTemplate[] = [
  {
    id: 'vfc-710-c172s-normal-ops-2025-08-03',
    aircraft: 'C-172S',
    title: 'VFC 710 - C-172S Normal Ops Checklists',
    category: 'normal',
    source: 'VFC 710 photographed checklist',
    revisionDate: '2025-08-03',
    sections: [
      {
        id: 'passenger-briefing',
        title: 'Passenger Briefing',
        items: [
          { id: 'passenger-briefing-1', text: 'Doors, Windows, Seat Belts' },
          { id: 'passenger-briefing-2', text: 'Fire Extinguisher' },
          { id: 'passenger-briefing-3', text: 'First Aid Kit' },
          { id: 'passenger-briefing-4', text: 'Emergency Locator Transmitter' },
          { id: 'passenger-briefing-5', text: 'Controls' },
          { id: 'passenger-briefing-6', text: 'No Smoking / Vaping' },
          { id: 'passenger-briefing-7', text: 'Life Vests' },
          { id: 'passenger-briefing-8', text: 'Loose Articles - SECURE' }
        ]
      },
      {
        id: 'pre-start',
        title: 'Pre Start',
        items: [
          { id: 'pre-start-1', text: 'Avionics Master Switch - OFF' },
          { id: 'pre-start-2', text: 'Circuit Breakers - CHECK' },
          { id: 'pre-start-3', text: 'Fuel Selector Valve - BOTH' },
          { id: 'pre-start-4', text: 'Fuel Shut Off Valve - PUSH IN' },
          { id: 'pre-start-5', text: 'Master Switch - ON' },
          { id: 'pre-start-6', text: 'Beacon Light - ON' },
          { id: 'pre-start-7', text: 'Nav Lights - ON' },
          { id: 'pre-start-8', text: 'Throttle - SET' },
          { id: 'pre-start-9', text: 'Key - INSERT' },
          { id: 'pre-start-10', text: 'Brakes - APPLIED' },
          { id: 'pre-start-11', text: 'Prop Area - CLEAR' }
        ]
      },
      {
        id: 'cold-start-if-required',
        title: 'Cold Start (if required)',
        items: [
          { id: 'cold-start-if-required-1', text: 'Aux Fuel Pump - ON' },
          { id: 'cold-start-if-required-2', text: 'Mixture - RICH' },
          { id: 'cold-start-if-required-3', text: 'Fuel Flow - INDICATE' },
          { id: 'cold-start-if-required-4', text: 'Mixture - IDLE CUT-OFF' },
          { id: 'cold-start-if-required-5', text: 'Aux Fuel Pump - OFF' }
        ]
      },
      {
        id: 'cold-and-warm-start',
        title: 'Cold & Warm Start',
        items: [
          { id: 'cold-and-warm-start-1', text: 'Magnetos - START' },
          { id: 'cold-and-warm-start-2', text: 'Mixture - RICH' },
          { id: 'cold-and-warm-start-3', text: 'Throttle - 1000 RPM' },
          { id: 'cold-and-warm-start-4', text: 'Oil Press & Temp - CHECK' }
        ]
      },
      {
        id: 'engine-warm-up-and-taxi',
        title: 'Engine Warm Up & Taxi',
        items: [
          { id: 'engine-warm-up-and-taxi-1', text: 'Avionics Master Switch - ON' },
          { id: 'engine-warm-up-and-taxi-2', text: 'Throttle - 1200 RPM' },
          { id: 'engine-warm-up-and-taxi-3', text: 'Mixture - GROUND LEAN' },
          { id: 'engine-warm-up-and-taxi-4', text: 'Throttle - 1000 RPM' },
          { id: 'engine-warm-up-and-taxi-5', text: 'Flaps - RETRACT IN STAGES' },
          { id: 'engine-warm-up-and-taxi-6', text: 'Annunciator Panel - TEST' },
          { id: 'engine-warm-up-and-taxi-7', text: 'Transponder - STANDBY / CODE' },
          { id: 'engine-warm-up-and-taxi-8', text: 'Radios - SET' },
          { id: 'engine-warm-up-and-taxi-9', text: 'ATIS - COPY' },
          { id: 'engine-warm-up-and-taxi-10', text: 'Avionics - SET' },
          { id: 'engine-warm-up-and-taxi-11', text: 'Instruments - SET & CHECK' },
          { id: 'engine-warm-up-and-taxi-12', text: 'Clearance Del / Ground - CALL' },
          { id: 'engine-warm-up-and-taxi-13', text: 'Brakes - CHECK' },
          { id: 'engine-warm-up-and-taxi-14', text: 'Turn Coordinator - CHECK' }
        ]
      },
      {
        id: 'run-up',
        title: 'Run Up',
        items: [
          { id: 'run-up-1', text: 'Brakes - SET' },
          { id: 'run-up-2', text: 'Area - CLEAR' },
          { id: 'run-up-3', text: 'Mixture - RICH' },
          { id: 'run-up-4', text: 'Throttle - 1800 RPM' },
          { id: 'run-up-5', text: 'Oil Press & Temp - CHECK' },
          { id: 'run-up-6', text: 'Vacuum Gauge - CHECK' },
          { id: 'run-up-7', text: 'Ammeter - CHECK' },
          { id: 'run-up-8', text: 'Magnetos - CHECK DROPS' },
          { id: 'run-up-9', text: 'Mixture - CHECK LEANING' },
          { id: 'run-up-10', text: 'Throttle - IDLE' },
          { id: 'run-up-11', text: 'Oil Press & Temp - CHECK' },
          { id: 'run-up-12', text: 'Throttle - 1000 RPM' }
        ]
      },
      {
        id: 'pre-take-off',
        title: 'Pre Take Off',
        items: [
          { id: 'pre-take-off-1', text: 'Doors, Windows, Seat Belts - SECURE' },
          { id: 'pre-take-off-2', text: 'Fuel Quantity - CHECK' },
          { id: 'pre-take-off-3', text: 'Magnetos - BOTH' },
          { id: 'pre-take-off-4', text: 'Master Switch - ON' },
          { id: 'pre-take-off-5', text: 'Mixture - RICH' },
          { id: 'pre-take-off-6', text: 'Flaps - SET & CHECK' },
          { id: 'pre-take-off-7', text: 'Trim - SET TAKE OFF' },
          { id: 'pre-take-off-8', text: 'Fuel Selector Valve - BOTH' },
          { id: 'pre-take-off-9', text: 'Fuel Shut Off Valve - PUSH IN' },
          { id: 'pre-take-off-10', text: 'Controls - FREE & CORRECT' },
          { id: 'pre-take-off-11', text: 'Instruments - CHECK & SET' }
        ]
      },
      {
        id: 'take-off-brief',
        title: 'Take Off Brief',
        items: [
          { id: 'take-off-brief-1', text: 'AS REQUIRED' }
        ]
      },
      {
        id: 'take-off',
        title: 'Take Off',
        items: [
          { id: 'take-off-1', text: 'Approach - CLEAR' },
          { id: 'take-off-2', text: 'Clearance - OBTAIN' },
          { id: 'take-off-3', text: 'Lights - AS REQUIRED' },
          { id: 'take-off-4', text: 'Transponder - ALT' },
          { id: 'take-off-5', text: 'Time Off - RECORD' }
        ]
      },
      {
        id: 'level-checks',
        title: 'Level Checks',
        items: [
          { id: 'level-checks-1', text: 'Throttle - SET CRUISE' },
          { id: 'level-checks-2', text: 'Fuel Selector Valve - SET' },
          { id: 'level-checks-3', text: 'Mixture - LEAN AS REQUIRED' },
          { id: 'level-checks-4', text: 'Switches - AS REQUIRED' },
          { id: 'level-checks-5', text: 'Instruments - SET' }
        ]
      },
      {
        id: 'pre-landing',
        title: 'Pre Landing',
        items: [
          { id: 'pre-landing-1', text: 'Engine Gauges - CHECK' },
          { id: 'pre-landing-2', text: 'Magnetos - BOTH' },
          { id: 'pre-landing-3', text: 'Master Switch - ON' },
          { id: 'pre-landing-4', text: 'Circuit Breakers - CHECK' },
          { id: 'pre-landing-5', text: 'Switches - AS REQUIRED' },
          { id: 'pre-landing-6', text: 'Mixture - RICH' },
          { id: 'pre-landing-7', text: 'Fuel Selector - BOTH' },
          { id: 'pre-landing-8', text: 'Fuel Shut Off Valve - PUSH IN' },
          { id: 'pre-landing-9', text: 'Brakes - CHECK' },
          { id: 'pre-landing-10', text: 'Doors, Windows, Seat Belts - SECURE' }
        ]
      },
      {
        id: 'post-landing',
        title: 'Post Landing',
        items: [
          { id: 'post-landing-1', text: 'Taxi Clearance - OBTAIN' },
          { id: 'post-landing-2', text: 'Flaps - RETRACT' },
          { id: 'post-landing-3', text: 'Transponder - STANDBY' },
          { id: 'post-landing-4', text: 'Landing Light - OFF' },
          { id: 'post-landing-5', text: 'Wing Strobes / Pitot Heat - OFF' },
          { id: 'post-landing-6', text: 'Time Down - RECORD' }
        ]
      },
      {
        id: 'shut-down',
        title: 'Shut Down',
        items: [
          { id: 'shut-down-1', text: 'Flight Plan - CLOSED' },
          { id: 'shut-down-2', text: 'Radio - 121.50 (NO TONE)' },
          { id: 'shut-down-3', text: 'Avionics Master Switch - OFF' },
          { id: 'shut-down-4', text: 'Beacon Light - LEAVE ON' },
          { id: 'shut-down-5', text: 'Nav Lights - OFF' },
          { id: 'shut-down-6', text: 'Live Mag Check - 1000 RPM' },
          { id: 'shut-down-7', text: 'Mixture - IDLE CUT-OFF' },
          { id: 'shut-down-8', text: 'Hobbs - RECORD' },
          { id: 'shut-down-9', text: 'Magnetos - OFF & REMOVE KEY' },
          { id: 'shut-down-10', text: 'Master Switch - OFF' },
          { id: 'shut-down-11', text: 'Control Lock - IN' },
          { id: 'shut-down-12', text: 'Aircraft - SECURE' },
          { id: 'shut-down-13', text: 'Pitot Tube Cover - REPLACE' },
          { id: 'shut-down-14', text: 'Cockpit - CLEAN & REMOVE PERS ITEMS' },
          { id: 'shut-down-15', text: 'Beacon Light - VERIFY NOT FLASHING' }
        ]
      }
    ]
  },
  {
    id: 'vfc-710-c172s-emergency-2025-08-03',
    aircraft: 'C-172S',
    title: 'VFC 710 - C-172S Emergency Checklists',
    category: 'emergency',
    source: 'VFC 710 photographed checklist',
    revisionDate: '2025-08-03',
    sections: [
      {
        id: 'engine-failure-restart',
        title: 'Engine Failure Restart',
        items: [
          { id: 'engine-failure-restart-1', text: 'Airspeed - 68 KIAS' },
          { id: 'engine-failure-restart-2', text: 'Fuel Shutoff - ON (PUSH IN)' },
          { id: 'engine-failure-restart-3', text: 'Fuel Selector Valve - BOTH' },
          { id: 'engine-failure-restart-4', text: 'Aux Fuel Pump - ON' },
          { id: 'engine-failure-restart-5', text: 'Mixture - RICH' },
          { id: 'engine-failure-restart-6', text: 'Magnetos - ON / START' }
        ]
      },
      {
        id: 'engine-failure-take-off',
        title: 'Engine Failure Take Off',
        items: [
          { id: 'engine-failure-take-off-1', text: 'Airspeed - 68 KIAS' },
          { id: 'engine-failure-take-off-2', text: 'Mixture - LEAN (ICO)' },
          { id: 'engine-failure-take-off-3', text: 'Fuel Shutoff - OFF (PULL OUT)' },
          { id: 'engine-failure-take-off-4', text: 'Magnetos - OFF' },
          { id: 'engine-failure-take-off-5', text: 'Flaps - AS REQ' },
          { id: 'engine-failure-take-off-6', text: 'Master Switch - OFF' },
          { id: 'engine-failure-take-off-7', text: 'Doors - UNLATCH' },
          { id: 'engine-failure-take-off-8', text: 'Land - STRAIGHT AHEAD' }
        ]
      },
      {
        id: 'forced-landing',
        title: 'Forced Landing',
        items: [
          { id: 'forced-landing-1', text: 'Seat / Seat Belts - SECURE' },
          { id: 'forced-landing-2', text: 'Airspeed - 68 KIAS' },
          { id: 'forced-landing-3', text: 'Mixture - LEAN (ICO)' },
          { id: 'forced-landing-4', text: 'Fuel Shutoff - OFF (PULL OUT)' },
          { id: 'forced-landing-5', text: 'Magnetos - OFF' },
          { id: 'forced-landing-6', text: 'Flaps - AS REQ' },
          { id: 'forced-landing-7', text: 'Master Switch - OFF' },
          { id: 'forced-landing-8', text: 'Doors - UNLATCH' },
          { id: 'forced-landing-9', text: 'Land - TAIL LOW' },
          { id: 'forced-landing-10', text: 'Brakes - APPLY' }
        ]
      },
      {
        id: 'low-voltage-light',
        title: 'Low Voltage Light',
        items: [
          { id: 'low-voltage-light-1', text: 'Avionics Master Switch - OFF' },
          { id: 'low-voltage-light-2', text: 'Alternator Breaker - IN' },
          { id: 'low-voltage-light-3', text: 'Master Switch - OFF' },
          { id: 'low-voltage-light-4', text: 'Master Switch - ON' },
          { id: 'low-voltage-light-5', text: 'Voltage Light - OFF' },
          { id: 'low-voltage-light-6', text: 'Avionics Master Switch - ON' },
          { id: 'low-voltage-light-7', text: 'Voltage Light - ON' },
          { id: 'low-voltage-light-8', text: 'Alternator - OFF' },
          { id: 'low-voltage-light-9', text: 'Avionics - AS REQ' },
          { id: 'low-voltage-light-10', text: 'System Switches - AS REQ' }
        ]
      },
      {
        id: 'engine-over-heat',
        title: 'Engine Over-Heat',
        items: [
          { id: 'engine-over-heat-1', text: 'Mixture - ENRICH AS REQ' },
          { id: 'engine-over-heat-2', text: 'Power - LOW CRUISE' },
          { id: 'engine-over-heat-3', text: 'Descend - COOL ENGINE' },
          { id: 'engine-over-heat-4', text: 'Land - WHEN ABLE' }
        ]
      },
      {
        id: 'ditching',
        title: 'Ditching',
        items: [
          { id: 'ditching-1', text: 'Heavy Items - JETTISON' },
          { id: 'ditching-2', text: 'Seat & Belts - SECURE' },
          { id: 'ditching-3', text: 'Flaps - 20 deg to 30 deg' },
          { id: 'ditching-4', text: 'Airspeed - 55 KIAS' },
          { id: 'ditching-5', text: 'Power - 300 FPM DESCENT' },
          { id: 'ditching-6', text: 'Doors - UNLATCH' },
          { id: 'ditching-7', text: 'ELT - ACTIVATE' },
          { id: 'ditching-8', text: 'High Wind / Heavy Seas - LAND INTO WIND' },
          { id: 'ditching-9', text: 'Light Wind / Heavy Swell - Land PARALLEL SWELL' }
        ]
      },
      {
        id: 'engine-fire-on-start',
        title: 'Engine Fire - On Start',
        items: [
          { id: 'engine-fire-on-start-1', text: 'Cranking - CONTINUE' },
          { id: 'engine-fire-on-start-2', text: 'Power - 1800 RPM' },
          { id: 'engine-fire-on-start-3', text: 'Engine - SHUT DOWN' },
          { id: 'engine-fire-on-start-4', text: 'No Start - Throttle FULL OPEN' },
          { id: 'engine-fire-on-start-5', text: 'Mixture - LEAN (ICO)' },
          { id: 'engine-fire-on-start-6', text: 'Cranking - CONTINUE' },
          { id: 'engine-fire-on-start-7', text: 'Fuel Shutoff - OFF (PULL OUT)' },
          { id: 'engine-fire-on-start-8', text: 'Aux Fuel Pump - OFF' },
          { id: 'engine-fire-on-start-9', text: 'Master Switch - OFF' },
          { id: 'engine-fire-on-start-10', text: 'Magnetos - OFF' },
          { id: 'engine-fire-on-start-11', text: 'Exits - EVACUATE' },
          { id: 'engine-fire-on-start-12', text: 'Fire Extinguisher - AS REQ' }
        ]
      },
      {
        id: 'engine-fire-in-flight',
        title: 'Engine Fire - In Flight',
        items: [
          { id: 'engine-fire-in-flight-1', text: 'Mixture - LEAN (ICO)' },
          { id: 'engine-fire-in-flight-2', text: 'Fuel Shutoff - OFF (PULL OUT)' },
          { id: 'engine-fire-in-flight-3', text: 'Aux Fuel Pump - OFF' },
          { id: 'engine-fire-in-flight-4', text: 'Master Switch - OFF' },
          { id: 'engine-fire-in-flight-5', text: 'Cabin Heat / Air - OFF' },
          { id: 'engine-fire-in-flight-6', text: 'Airspeed - 100 KIAS' },
          { id: 'engine-fire-in-flight-7', text: 'Forced Landing - CONDUCT' }
        ]
      },
      {
        id: 'electrical-fire',
        title: 'Electrical Fire',
        items: [
          { id: 'electrical-fire-1', text: 'Master Switch - OFF' },
          { id: 'electrical-fire-2', text: 'Vents, Cabin Heat / Air - OFF' },
          { id: 'electrical-fire-3', text: 'Fire Extinguisher - AS REQ' },
          { id: 'electrical-fire-4', text: 'Avionics Master Switch - OFF' },
          { id: 'electrical-fire-5', text: 'System Switches - OFF' },
          { id: 'electrical-fire-6', text: 'Cabin - VENT AS REQ' },
          { id: 'electrical-fire-7', text: 'Fire Out - Master Switch ON' },
          { id: 'electrical-fire-8', text: 'Circuit Breakers - CHECK' },
          { id: 'electrical-fire-9', text: 'Radio Switches - OFF' },
          { id: 'electrical-fire-10', text: 'Avionics Master Switch - ON' },
          { id: 'electrical-fire-11', text: 'Avionics - AS REQ' },
          { id: 'electrical-fire-12', text: 'System Switches - AS REQ' }
        ]
      },
      {
        id: 'cabin-fire',
        title: 'Cabin Fire',
        items: [
          { id: 'cabin-fire-1', text: 'Master Switch - OFF' },
          { id: 'cabin-fire-2', text: 'Vents, Cabin Heat / Air - OFF' },
          { id: 'cabin-fire-3', text: 'Fire Extinguisher - AS REQ' },
          { id: 'cabin-fire-4', text: 'Cabin - VENT AS REQ' }
        ]
      },
      {
        id: 'wing-fire',
        title: 'Wing Fire',
        items: [
          { id: 'wing-fire-1', text: 'Landing / Taxi Lights - OFF' },
          { id: 'wing-fire-2', text: 'Nav Light Switch - OFF' },
          { id: 'wing-fire-3', text: 'Strobe Light Switch - OFF' },
          { id: 'wing-fire-4', text: 'Pitot Heat Switch - OFF' },
          { id: 'wing-fire-5', text: 'Sideslip - AWAY FROM FIRE' }
        ]
      },
      {
        id: 'airframe-icing',
        title: 'Airframe Icing',
        items: [
          { id: 'airframe-icing-1', text: 'Pitot Heat Switch - ON' },
          { id: 'airframe-icing-2', text: 'Heading - TURN BACK' },
          { id: 'airframe-icing-3', text: 'Altitude - FIND HIGHER OAT' },
          { id: 'airframe-icing-4', text: 'Cabin Heat / Defrost - ON' },
          { id: 'airframe-icing-5', text: 'Ice Persists - Land NEARBY AIRPORT' },
          { id: 'airframe-icing-6', text: 'Approach - 65-75 KIAS' }
        ]
      }
    ]
  }
];
