import type { PstarQuestion } from '../types';

// Official-source PSTAR bank imported from Transport Canada TP 11919, Seventh Edition (December 2022).
export const PSTAR_SOURCE_URL = 'https://tc.canada.ca/en/aviation/publications/student-pilot-permit-private-pilot-licence-foreign-military-applicants-aviation-regulations-tp-11919';

export const PSTAR_QUESTIONS: PstarQuestion[] = [
  {
    id: "1.01",
    section: "Collision Avoidance",
    q: "Which statement is true with regard to aircraft converging at approximately the same altitude?",
    options: ["A jet airliner has the right of way over all other aircraft.", "An aircraft towing objects has the right of way over all power-driven heavier-than-air aircraft.", "An aeroplane has the right of way over all other aircraft which are converging from the left.", "Aeroplanes towing gliders must give way to helicopters."],
    correct: "An aircraft towing objects has the right of way over all power-driven heavier-than-air aircraft."
  },
  {
    id: "1.02",
    section: "Collision Avoidance",
    q: "When two aircraft are converging at approximately the same altitude",
    options: ["both aircraft shall alter heading to the left.", "the aircraft on the right shall avoid the other by descending.", "the aircraft that has the other on its right shall give way.", "the aircraft that has the other on its left shall give way."],
    correct: "the aircraft that has the other on its right shall give way."
  },
  {
    id: "1.03",
    section: "Collision Avoidance",
    q: "When two aircraft are converging at approximately the same altitude, which statement applies?",
    options: ["Gliders shall give way to helicopters.", "Aeroplanes shall give way to power-driven heavier-than-air aircraft.", "Gliders shall give way to aeroplanes.", "Power-driven heavier-than-air aircraft shall give way to gliders."],
    correct: "Power-driven heavier-than-air aircraft shall give way to gliders."
  },
  {
    id: "1.04",
    section: "Collision Avoidance",
    q: "When two aircraft are converging at approximately the same altitude, which statement applies?",
    options: ["Gliders shall give way to helicopters.", "Aeroplanes shall give way to helicopters.", "Helicopters shall give way to aeroplanes.", "Helicopters shall give way to gliders."],
    correct: "Helicopters shall give way to gliders."
  },
  {
    id: "1.05",
    section: "Collision Avoidance",
    q: "When two aircrafts are converging at approximately the same altitude, which statement applies?",
    options: ["Gliders shall give way to helicopters.", "Aeroplanes shall give way to helicopters.", "Helicopters shall give way to aeroplanes.", "Gliders shall give way to balloons."],
    correct: "Gliders shall give way to balloons."
  },
  {
    id: "1.06",
    section: "Collision Avoidance",
    q: "When converging at approximately the same altitude",
    options: ["balloons shall give way to hang gliders.", "aeroplanes towing gliders shall give way to balloons.", "balloons shall give way to gliders.", "balloons shall give way to airships."],
    correct: "aeroplanes towing gliders shall give way to balloons."
  },
  {
    id: "1.07",
    section: "Collision Avoidance",
    q: "When two power-driven heavier-than-air aircraft are converging at approximately the same altitude,",
    options: ["the one on the left has the right of way.", "both shall alter heading to the left.", "the one on the right has the right of way.", "the one on the right shall give way by descending."],
    correct: "the one on the right has the right of way."
  },
  {
    id: "1.08",
    section: "Collision Avoidance",
    q: "When two aircraft are approaching head-on or approximately so and there is danger of collision, each pilot shall",
    options: ["decrease airspeed.", "increase airspeed.", "alter heading to the right.", "alter heading to the left."],
    correct: "alter heading to the right."
  },
  {
    id: "1.09",
    section: "Collision Avoidance",
    q: "When overtaking an aircraft at your 12 o\u2019clock position, at your altitude, you should",
    options: ["climb.", "descend.", "alter heading to the right.", "alter heading to the left."],
    correct: "alter heading to the right."
  },
  {
    id: "1.10",
    section: "Collision Avoidance",
    q: "Two aircraft are on approach to land, the aircraft at the higher altitude shall",
    options: ["have the right of way.", "overtake the lower aircraft on the left.", "give way.", "complete a 360\u00b0 turn to the right."],
    correct: "give way."
  },
  {
    id: "2.01",
    section: "Visual Signals",
    q: "A series of green flashes directed at an aircraft means respectively",
    options: ["in flight: cleared to land; / on the ground: cleared to taxi.", "in flight: return for landing; / on the ground: cleared for take-off.", "in flight: return for landing; / on the ground: cleared to taxi.", "in flight: cleared to land; / on the ground: cleared for take-off."],
    correct: "in flight: return for landing; / on the ground: cleared to taxi."
  },
  {
    id: "2.02",
    section: "Visual Signals",
    q: "A steady red light directed at an aircraft means",
    options: ["in flight: give way to other aircraft and continue circling; / on the ground: stop.", "in flight: give way to other aircraft and continue circling; / on the ground: taxi clear of landing area in use.", "in flight: airport unsafe do not land; / on the ground: taxi clear of landing area in use.", "in flight: airport unsafe do not land; / on the ground: stop."],
    correct: "in flight: give way to other aircraft and continue circling; / on the ground: stop."
  },
  {
    id: "2.03",
    section: "Visual Signals",
    q: "A series of red flashes directed at an aircraft means respectively",
    options: ["in flight: airport unsafe, do not land; / on the ground: taxi clear of landing area in use.", "in flight: give way to other aircraft and continue circling; / on the ground: stop.", "in flight: do not land for time being; / on the ground: return to starting point on airport.", "in flight: you are in prohibited area, alter course; / on the ground: stop."],
    correct: "in flight: airport unsafe, do not land; / on the ground: taxi clear of landing area in use."
  },
  {
    id: "2.04",
    section: "Visual Signals",
    q: "A steady green light directed at an aircraft means respectively",
    options: ["in flight: cleared to land; / on the ground: cleared to taxi.", "in flight: return for landing; / on the ground: cleared to taxi.", "in flight: return for landing; / on the ground: cleared for take-off.", "in flight: cleared to land; / on the ground: cleared for take-off."],
    correct: "in flight: cleared to land; / on the ground: cleared for take-off."
  },
  {
    id: "2.05",
    section: "Visual Signals",
    q: "A flashing white light directed at an aircraft on the manoeuvring area of an airport means",
    options: ["stop.", "return to starting point on the airport.", "cleared to taxi.", "taxi clear of landing area in use."],
    correct: "return to starting point on the airport."
  },
  {
    id: "2.06",
    section: "Visual Signals",
    q: "Blinking runway lights advises vehicles and pedestrians to",
    options: ["return to the apron.", "vacate the runways immediately.", "be aware that an emergency is in progress; continue with caution.", "be aware that an emergency is in progress; hold your position."],
    correct: "vacate the runways immediately."
  },
  {
    id: "2.07",
    section: "Visual Signals",
    q: "Chrome yellow and black strips painted on pylons or on the roof of a building identifies",
    options: ["an area where explosives are in use.", "a fur farm.", "an artillery range.", "an open pit mine."],
    correct: "a fur farm."
  },
  {
    id: "2.08",
    section: "Visual Signals",
    q: "Pilots should not overfly reindeer or caribou at an altitude of less than",
    options: ["2,500 feet AGL.", "2,000 feet AGL.", "1,500 feet AGL.", "1,000 feet AGL."],
    correct: "2,000 feet AGL."
  },
  {
    id: "3.01",
    section: "Communications",
    q: "When making initial contact with a Canadian ATC unit, the pilot of aircraft C-GFLU should transmit the manufacturer\u2019s name or the type of aircraft, followed by registration as",
    options: ["Lima \u2013 Uniform.", "Foxtrot \u2013 Lima \u2013 Uniform.", "Golf \u2013 Foxtrot \u2013 Lima \u2013 Uniform.", "Charlie \u2013 Golf \u2013 Foxtrot \u2013 Lima \u2013 Uniform."],
    correct: "Golf \u2013 Foxtrot \u2013 Lima \u2013 Uniform."
  },
  {
    id: "3.02",
    section: "Communications",
    q: "When making initial contact with a Canadian ATC unit, the pilot of aircraft C-FBSQ should transmit the registration as",
    options: ["FBSQ.", "Fox, Baker, Sugar, Queen.", "Foxtrot, Bravo, Sierra, Qu\u00e9bec.", "Bravo, Sierra, Qu\u00e9bec."],
    correct: "Foxtrot, Bravo, Sierra, Qu\u00e9bec."
  },
  {
    id: "3.03",
    section: "Communications",
    q: "After a Canadian privately registered aircraft has made initial contact with an ATS unit, which items may be omitted from subsequent transmissions? The aircraft type and",
    options: ["any registration letters omitted by ATS in the last communication.", "the first two letters of the registration, if initiated by ATS.", "the first three letters of the registration.", "the phonetic equivalents."],
    correct: "the first two letters of the registration, if initiated by ATS."
  },
  {
    id: "3.04",
    section: "Communications",
    q: "On initial radio contact with an ATS unit the pilot shall transmit the",
    options: ["manufacturer\u2019s name or type of aircraft and last four letters of the registration in phonetics.", "last three letters of the registration in phonetics.", "whole registration in phonetics.", "type of aircraft and the last three letters of the registration in phonetics."],
    correct: "manufacturer\u2019s name or type of aircraft and last four letters of the registration in phonetics."
  },
  {
    id: "3.05",
    section: "Communications",
    q: "ATIS is normally provided",
    options: ["to replace the FSS.", "to relieve frequency congestion.", "for the rapid updating of weather forecasts.", "only when VFR conditions exist at airports."],
    correct: "to relieve frequency congestion."
  },
  {
    id: "3.06",
    section: "Communications",
    q: "Where ATIS is available the information which should be included on first contact with ATC is the",
    options: ["phrase \u201cwith the numbers\u201d.", "phrase \u201cATIS received\u201d.", "phrase \u201cwith the information\u201d.", "ATIS phonetic identifier."],
    correct: "ATIS phonetic identifier."
  },
  {
    id: "3.07",
    section: "Communications",
    q: "Pilots operating VFR en route in uncontrolled airspace should continuously monitor . . . . . and 121.5 MHZ, when practical and not in communication on the MF or ATF frequency.",
    options: ["126.7 MHz", "123.2 MHz", "122.8 MHz", "122.2 MHz"],
    correct: "126.7 MHz"
  },
  {
    id: "3.08",
    section: "Communications",
    q: "En route aircraft should, whenever possible, maintain a listening watch for aircraft in distress on",
    options: ["the receiver mode of the ELT.", "121.5 MHz on the aircraft receiver.", "121.5 MHz during the first 5 minutes of each hour.", "the voice frequency of the navigation aid in use."],
    correct: "121.5 MHz on the aircraft receiver."
  },
  {
    id: "3.09",
    section: "Communications",
    q: "MF procedures such as frequency, distance and altitude to follow are given in the",
    options: ["Canada Flight Supplement (CFS) or Canada Water Aerodrome Supplement (CWAS).", "Designated Airspace Handbook (DAH).", "Transport Canada Aeronautical Information Manual (TC AIM) - TP 14371.", "Flight Training Manual (FTM) - TP1102."],
    correct: "Canada Flight Supplement (CFS) or Canada Water Aerodrome Supplement (CWAS)."
  },
  {
    id: "3.10",
    section: "Communications",
    q: "Pilots broadcasting on a MF where no ground station is in operation should direct their transmission to the",
    options: ["aerodrome UNICOM.", "closest ATC unit.", "aerodrome traffic.", "first aircraft heard on the frequency."],
    correct: "aerodrome traffic."
  },
  {
    id: "3.11",
    section: "Communications",
    q: "Pilots operating in VMC and intending to land at aerodromes where no UNICOM exists, should broadcast their intentions on the ATF of",
    options: ["121.5 MHz.", "123.2 MHz.", "123.45 MHz.", "126.7 MHz."],
    correct: "123.2 MHz."
  },
  {
    id: "3.12",
    section: "Communications",
    q: "If a MF is in use, pilots departing VFR shall monitor that frequency until",
    options: ["beyond the specified distance or altitude.", "established en route.", "established at cruise altitude.", "clear of the aerodrome circuit pattern."],
    correct: "beyond the specified distance or altitude."
  },
  {
    id: "3.13",
    section: "Communications",
    q: "A pilot is cleared to taxi to the runway in use without a hold short clearance. To get there, the aircraft must cross two taxiways and one runway. This authorizes the pilot to taxi to",
    options: ["the runway in use, but must hold short.", "the runway in use, but further clearance is required to cross each taxiway and runway en route.", "position on the runway without further clearance.", "the runway in use, but further clearance is required to cross the other runway."],
    correct: "the runway in use, but further clearance is required to cross the other runway."
  },
  {
    id: "3.14",
    section: "Communications",
    q: "Ground control authorizes \u201c golf alpha bravo charlie taxi runway 29 hold short of runway 04 \u201d. The pilot should acknowledge this by replying \u201c golf alpha bravo charlie to",
    options: ["runway 04\u201d.", "runway 29\u201d.", "hold short of 29\u201d.", "hold short of 04\u201d."],
    correct: "hold short of 04\u201d."
  },
  {
    id: "3.15",
    section: "Communications",
    q: "When a clearance for an \u201cimmediate take-off\u201d is accepted, the pilot shall",
    options: ["back-track on the runway to use the maximum available length for take-off.", "taxi to a full stop in position on the runway and take off without further clearance.", "taxi onto the runway and take off in one continuous movement.", "complete the pre-take-off check before taxiing onto the runway and taking off."],
    correct: "taxi onto the runway and take off in one continuous movement."
  },
  {
    id: "3.16",
    section: "Communications",
    q: "A pilot flying a heading of 270\u00b0, receives the following message from ATC, \u201cTraffic 2 o\u2019clock, 5 miles, eastbound\u201d. This information indicates the traffic is",
    options: ["60\u00b0 to the left, altitude unknown.", "60\u00b0 to the right, altitude unknown.", "90\u00b0 to the right, at same altitude.", "90\u00b0 to the left, at same altitude."],
    correct: "60\u00b0 to the right, altitude unknown."
  },
  {
    id: "3.17",
    section: "Communications",
    q: "A pilot receives the following ATC clearance \u201c cleared to land, turn right at the first intersection \u201d. The pilot should",
    options: ["land and attempt to turn off even though the speed is considered too high to safely accomplish the turn.", "complete a touch-and-go if it is not possible to safely accomplish the turn.", "land and turn off at the nearest intersection possible commensurate with safety.", "land and do a 180\u00b0 turn and taxi back to clear the runway at the required intersection."],
    correct: "land and turn off at the nearest intersection possible commensurate with safety."
  },
  {
    id: "3.18",
    section: "Communications",
    q: "The radiotelephone distress signal to indicate serious and/or imminent danger requiring immediate assistance is",
    options: ["mayday , mayday , mayday .", "pan pan , pan pan , pan pan .", "security , security , security .", "emergency , emergency , emergency"],
    correct: "mayday , mayday , mayday ."
  },
  {
    id: "3.19",
    section: "Communications",
    q: "The radiotelephone urgency signal to indicate a condition concerning the safety of an aircraft, vehicle or of some person on board which does not require immediate assistance is",
    options: ["mayday , mayday , mayday .", "pan pan , pan pan , pan pan .", "emergency , emergency , emergency .", "urgency , urgency , urgency ."],
    correct: "pan pan , pan pan , pan pan ."
  },
  {
    id: "3.20",
    section: "Communications",
    q: "What should be included along with the call sign of the aircraft and time, to indicate cancellation of a distress message?",
    options: ["mayday (three times), all stations, distress traffic ended, out .", "mayday (once), hello all stations (three times), this is (the call sign of the station transmitting the message, the filing time of the message, the call sign of the station in distress (once)), seelonce feenee, out .", "mayday cancelled (three times).", "all stations (three times), emergency over ."],
    correct: "mayday (once), hello all stations (three times), this is (the call sign of the station transmitting the message, the filing time of the message, the call sign of the station in distress (once)), seelonce feenee, out ."
  },
  {
    id: "3.21",
    section: "Communications",
    q: ". A departing flight will normally remain on tower frequency until",
    options: ["the flight is 2,000 feet AGL.", "25 NM from the airport.", "15 NM from the Control Zone.", "clear of the Control Zone."],
    correct: "clear of the Control Zone."
  },
  {
    id: "3.22",
    section: "Communications",
    q: "You advise ATC that you are on the downwind leg. If there is other traffic in the circuit, ATC will then",
    options: ["inform you of your number in the approach sequence or other appropriate instructions.", "inform you of the runway in use, wind and altimeter.", "advise you of all other circuit traffic.", "clear you to land."],
    correct: "inform you of your number in the approach sequence or other appropriate instructions."
  },
  {
    id: "3.23",
    section: "Communications",
    q: "A radio equipped aircraft has been cleared to land at a controlled airport. The pilot should acknowledge the clearance by",
    options: ["replying \u2018Roger\u2019.", "replying \u2018Wilco\u2019.", "clicking the microphone button.", "transmitting the aircraft call sign."],
    correct: "transmitting the aircraft call sign."
  },
  {
    id: "3.24",
    section: "Communications",
    q: "An initial call to Timmins FSS should be \u2018Timmins",
    options: ["radio this is...\u2019", "Flight Service Station this is...\u2019", "UNICOM this is...\u2019", "this is...\u2019"],
    correct: "radio this is...\u2019"
  },
  {
    id: "3.25",
    section: "Communications",
    q: "A responsibility of a Flight Information Center (FIC) specialist is to provide",
    options: ["air traffic control.", "flight planning services.", "air traffic service in uncontrolled airspace only.", "terminal radar service."],
    correct: "flight planning services."
  },
  {
    id: "3.26",
    section: "Communications",
    q: "NOTAMs are",
    options: ["available at all flight information centres (FIC)", "emailed to all pilots.", "issued for airport/aerodrome facility closures only.", "valid for 24 hours."],
    correct: "available at all flight information centres (FIC)"
  },
  {
    id: "3.27",
    section: "Communications",
    q: "A new or replacing NOTAM without the term \u201cEST\u201d is valid",
    options: ["for 48 hours only.", "for the day it was issued.", "until the End Time quoted in the NOTAM.", "until a cancelling NOTAM is issued."],
    correct: "until the End Time quoted in the NOTAM."
  },
  {
    id: "3.28",
    section: "Communications",
    q: "The term \u201cEST\u201d in the End Time in a new or replacing NOTAM means the NOTAM is valid",
    options: ["for an estimated 24 hours.", "for an estimated 48 hours.", "until the time quoted in the NOTAM.", "until a cancelling (NOTAMC) or replacing (NOTAMR) is issued."],
    correct: "until a cancelling (NOTAMC) or replacing (NOTAMR) is issued."
  },
  {
    id: "3.29",
    section: "Communications",
    q: "ATC advises that your radio transmissions are readability three this means that your transmissions are",
    options: ["readable now and then.", "readable with difficulty.", "readable.", "perfectly readable."],
    correct: "readable with difficulty."
  },
  {
    id: "4.01",
    section: "Aerodromes",
    q: "An airport is",
    options: ["an aerodrome with paved runways.", "an aerodrome with a control tower.", "an uncertified aerodrome.", "a certified aerodrome."],
    correct: "a certified aerodrome."
  },
  {
    id: "4.02",
    section: "Aerodromes",
    q: "A dry Transport Canada standard wind direction indicator when horizontal indicates a wind speed of at least",
    options: ["25 kt.", "15 kt.", "10 kt.", "6 kt."],
    correct: "15 kt."
  },
  {
    id: "4.03",
    section: "Aerodromes",
    q: "No person shall operate any vehicle on any part of an uncontrolled airport used for the movement of aircraft, except in accordance with permission from",
    options: ["the operator of the airport.", "the airport security officer.", "a federal peace officer.", "a qualified flying instructor."],
    correct: "the operator of the airport."
  },
  {
    id: "4.04",
    section: "Aerodromes",
    q: "Runways and taxiways or portions thereof that are closed to aircraft are marked by",
    options: ["red flags.", "horizontal red squares with yellow diagonals.", "white \u201cXs\u201d on runways and yellow \u201cXs\u201d on taxiways.", "white dumbbells."],
    correct: "white \u201cXs\u201d on runways and yellow \u201cXs\u201d on taxiways."
  },
  {
    id: "4.05",
    section: "Aerodromes",
    q: "The west end of a runway oriented east and west is numbered",
    options: ["09.", "90.", "27.", "270."],
    correct: "09."
  },
  {
    id: "4.06",
    section: "Aerodromes",
    q: "Where taxiway holding positions have not been established, aircraft waiting to enter an active runway should normally hold",
    options: ["clear of the manoeuvring area.", "50 ft from the edge of the runway.", "150 ft from the edge of the runway.", "200 ft from the edge of the runway."],
    correct: "200 ft from the edge of the runway."
  },
  {
    id: "4.07",
    section: "Aerodromes",
    q: "The manoeuvring area of an airport is that area",
    options: ["normally referred to as the ramp or apron.", "which includes the apron, taxiways and runways.", "used when taxiing to and from the parking area.", "used for taxiing, taking off and landing."],
    correct: "used for taxiing, taking off and landing."
  },
  {
    id: "4.08",
    section: "Aerodromes",
    q: "Except for the purpose of taking off or landing, an aircraft shall not be flown over an aerodrome at a height of less than",
    options: ["2,000 feet AGL.", "1,500 feet AGL.", "1,000 feet AGL.", "500 feet AGL."],
    correct: "2,000 feet AGL."
  },
  {
    id: "5.01",
    section: "Equipment",
    q: "Except for ultra-light aeroplanes and balloons, which documents shall be carried on board when flying a radio equipped Canadian privately registered aircraft? Items A, B and A. Flight Authority (Certificate of Airworthiness or Flight Permit). B. Certificate of Registration. C. Technical Records. D. Crew licences. E. Aircraft Flight Manual or equivalent document. F. Type certificate. G. Aircraft journey log book, where it is planned that the aircraft will land and shutdown at any location other than the point of departure. H. Proof of liability insurance.",
    options: ["C, D, E, G.", "C, D, F, H.", "D, E, F, G.", "D, E, G, H."],
    correct: "D, E, G, H."
  },
  {
    id: "5.02",
    section: "Equipment",
    q: "Taking into account seasonal climatic variations and geographical area, private aeroplanes and helicopters flying VFR 25 NM or more from an aerodrome or operating base may require",
    options: ["specified emergency supplies be carried.", "a functioning radio capable of two-way radio communication.", "the aircraft be multi-engined when passengers are carried.", "all of the above"],
    correct: "specified emergency supplies be carried."
  },
  {
    id: "5.03",
    section: "Equipment",
    q: "A serviceable landing light is required equipment on aircraft",
    options: ["carrying passengers at night.", "carrying passengers at night except private aircraft under 5,700 kg.", "using an unlighted aerodrome.", "taking off or landing at night."],
    correct: "carrying passengers at night."
  },
  {
    id: "5.04",
    section: "Equipment",
    q: "Unless oxygen and oxygen masks as specified in CARs are readily available, no person shall fly unpressurized aircraft above",
    options: ["9,500 feet ASL.", "10,000 feet ASL.", "12,500 feet ASL.", "13,000 feet ASL."],
    correct: "13,000 feet ASL."
  },
  {
    id: "5.05",
    section: "Equipment",
    q: "No person shall fly an unpressurized aircraft for more than . . . . . at an altitude between 10,000 and 13,000 feet ASL unless there is readily available to each flight crew member, an oxygen mask and a supply of oxygen.",
    options: ["15 minutes", "30 minutes", "1 hour", "2 hours"],
    correct: "30 minutes"
  },
  {
    id: "5.06",
    section: "Equipment",
    q: "What safety equipment must be available to each person on board a single-engine aircraft which is taking off from or landing on water?",
    options: ["An approved life raft.", "An approved life preserver.", "A signal flare.", "A signal mirror."],
    correct: "An approved life preserver."
  },
  {
    id: "5.07",
    section: "Equipment",
    q: "The International VHF Emergency Frequency is",
    options: ["121.5 MHz.", "121.9 MHz.", "122.2 MHz.", "126.7 MHz."],
    correct: "121.5 MHz."
  },
  {
    id: "5.08",
    section: "Equipment",
    q: "No pilot shall take off from or land at an aerodrome at night unless the",
    options: ["aircraft is equipped with a functioning two-way radio.", "aircraft is equipped with a functioning landing light or landing lights.", "aerodrome is lighted as prescribed by the Minister.", "pilot has completed 3 night landings in the previous 90 days."],
    correct: "aerodrome is lighted as prescribed by the Minister."
  },
  {
    id: "5.09",
    section: "Equipment",
    q: "The CARs define an infant passenger as a person",
    options: ["weighing less than 30 lb (13.6 kg)", "under 3 years of age.", "weighing less than 50 lb (22.7 kg) and under 5 years of age.", "under 2 years of age."],
    correct: "under 2 years of age."
  },
  {
    id: "5.10",
    section: "Equipment",
    q: "When the PIC directs that safety belts be fastened, an infant passenger for which no child restraint system is provided shall be",
    options: ["fastened securely in a seat by means of a safety belt.", "held securely in the arms of the responsible person whose safety belt shall be fastened.", "held securely in the arms of the responsible person and a safety belt shall be fastened about both.", "secured by any one of the above methods."],
    correct: "held securely in the arms of the responsible person whose safety belt shall be fastened."
  },
  {
    id: "5.11",
    section: "Equipment",
    q: "Which flight instrument systems and equipment are required on power driven aircraft for day VFR flight? A magnetic direction indicating system or magnetic compass and A. an airspeed indicator. B. an attitude indicator. C. an altimeter. D. a vertical speed indicator. E. a turn and bank indicator. F. a time piece. G. a heading indicator.",
    options: ["A, C, F.", "A, B, G.", "A, C, D, E, F.", "B, D, E, G."],
    correct: "A, C, F."
  },
  {
    id: "6.01",
    section: "Pilot Responsibilities",
    q: "If cleared for take-off immediately following the very low approach and overshoot of a large aircraft, the pilot should",
    options: ["take off immediately otherwise the trailing vortices will descend into the flight path.", "taxi to position on the runway and wait until it is considered safe to take off.", "decline take-off clearance and inform ATC of the reason for non-acceptance.", "wait for 2 minutes after the large aircraft has passed then take off."],
    correct: "decline take-off clearance and inform ATC of the reason for non-acceptance."
  },
  {
    id: "6.02",
    section: "Pilot Responsibilities",
    q: "The controller offers the option for a take-off from a runway intersection. The pilot must be aware that",
    options: ["the remaining runway length will not be stated by the controller.", "it is the pilot\u2019s responsibility to ensure that the remaining runway length is sufficient for takeoff.", "the controller will ensure that the remaining runway length is sufficient for take-off.", "noise abatement procedures have been cancelled."],
    correct: "it is the pilot\u2019s responsibility to ensure that the remaining runway length is sufficient for takeoff."
  },
  {
    id: "6.03",
    section: "Pilot Responsibilities",
    q: "A pilot requests an intersection take-off from ATC. If authorized,",
    options: ["the controller will always give the remaining runway length.", "the controller will ensure that the remaining runway length is sufficient for take-off.", "it is the pilot\u2019s responsibility to ensure that the remaining runway length is sufficient for takeoff.", "any noise abatement procedures for the runway are automatically cancelled."],
    correct: "it is the pilot\u2019s responsibility to ensure that the remaining runway length is sufficient for takeoff."
  },
  {
    id: "6.04",
    section: "Pilot Responsibilities",
    q: "When an arriving aircraft is cleared \u201cto the circuit\u201d, the pilot should interpret this to mean join the circuit",
    options: ["on the downwind leg at circuit height.", "from the upwind side of the runway in all cases.", "on base leg if convenient.", "on final for a straight in approach."],
    correct: "on the downwind leg at circuit height."
  },
  {
    id: "6.05",
    section: "Pilot Responsibilities",
    q: "When a NORDO aircraft crosses an airport for the purpose of obtaining landing information it should maintain",
    options: ["circuit height.", "1,000 feet above circuit height.", "at least 2,000 feet AGL.", "at least 500 feet above circuit height."],
    correct: "at least 500 feet above circuit height."
  },
  {
    id: "6.06",
    section: "Pilot Responsibilities",
    q: "An aircraft is \u201ccleared to the circuit\u201d where a left hand circuit is in effect. Without further approval from ATC a right turn may be made to",
    options: ["join the final leg.", "join the base leg.", "join crosswind or a partial right turn to join the downwind leg.", "descend on the downwind leg."],
    correct: "join crosswind or a partial right turn to join the downwind leg."
  },
  {
    id: "6.07",
    section: "Pilot Responsibilities",
    q: "When instructed to continue an approach to a runway which is clear of traffic, what action should the pilot take if no landing clearance is received?",
    options: ["Circle 360\u00b0 to the left.", "Circle 360\u00b0 in the direction of the circuit.", "Complete the landing.", "Request landing clearance."],
    correct: "Request landing clearance."
  },
  {
    id: "6.08",
    section: "Pilot Responsibilities",
    q: "A NOTAM has been published for an airport, which is 400 feet ASL, stating the circuit height is 1,500 feet ASL. When the ceiling is 1,000 overcast and the visibility is 3 miles, the circuit height in controlled airspace should be",
    options: ["500 feet below the cloud base.", "1,500 feet ASL.", "1,100 feet above the airport elevation.", "1,000 feet above the airport elevation."],
    correct: "500 feet below the cloud base."
  },
  {
    id: "6.09",
    section: "Pilot Responsibilities",
    q: "When the reported ceiling is 1,000 feet overcast and visibility is 3 miles, to remain VFR, an aircraft cleared to the circuit must join",
    options: ["as high as possible without entering cloud.", "at 500 feet below cloud base.", "at 700 feet AGL.", "in accordance with Special VFR."],
    correct: "at 500 feet below cloud base."
  },
  {
    id: "6.10",
    section: "Pilot Responsibilities",
    q: "Aircraft flying VFR normally join the circuit at 1,000 feet AAE. This may not always be possible because of",
    options: ["the possibility of a \u201cstraight in\u201d clearance to the airport in which case the final leg would normally be entered at less than 1,000 feet.", "the existence of a NOTAM which provides for a different circuit altitude.", "weather conditions which may necessitate a circuit height lower than 1,000 feet.", "the existence of any of the above circumstances."],
    correct: "the existence of any of the above circumstances."
  },
  {
    id: "6.11",
    section: "Pilot Responsibilities",
    q: "A pilot on final approach is requested by ATC to reduce airspeed. The pilot should",
    options: ["comply, giving due consideration to safe minimum manoeuvring speed of the aircraft.", "acknowledge transmission and execute a 360\u00b0 turn.", "overshoot and rejoin the circuit.", "reduce airspeed well below normal approach speed range."],
    correct: "comply, giving due consideration to safe minimum manoeuvring speed of the aircraft."
  },
  {
    id: "6.12",
    section: "Pilot Responsibilities",
    q: "A pilot is cleared to land but is concerned about the high crosswind component. The pilot should",
    options: ["use full flaps and approach at a reduced speed.", "alter heading and land on another runway which is more into wind.", "overshoot and request an into-wind runway.", "continue the approach and land as the clearance must be obeyed."],
    correct: "overshoot and request an into-wind runway."
  },
  {
    id: "6.13",
    section: "Pilot Responsibilities",
    q: "A pilot on a VFR flight is being vectored by ATC towards an extensive unbroken layer of cloud. The responsibility for remaining VFR rests with",
    options: ["the radar operator.", "ATC since the flight is designated VFR.", "ATC since the cloud is visible on radar.", "the pilot."],
    correct: "the pilot."
  },
  {
    id: "6.14",
    section: "Pilot Responsibilities",
    q: "A student pilot on a VFR flight has been given a radar vector by ATC. Ahead, at a lower altitude, is a solid overcast cloud condition. The pilot should",
    options: ["climb above the cloud and fly \u201cVFR over the top\u201d.", "alter heading as necessary to remain VFR and advise ATC.", "maintain heading and altitude as it is an ATC clearance.", "maintain heading and altitude because ATC knows of the cloud and will issue further instructions."],
    correct: "alter heading as necessary to remain VFR and advise ATC."
  },
  {
    id: "6.15",
    section: "Pilot Responsibilities",
    q: "An aircraft on a Special VFR flight has been cleared for a \u201cstraight in\u201d approach. Because of low ceiling and poor visibility, the pilot is concerned about the exact location of a radio mast in the vicinity. Avoiding this obstruction is the responsibility",
    options: ["of the pilot.", "of the tower controller as the controller is aware of the obstruction.", "of ATC as the pilot has been given Special VFR clearance.", "shared equally by the pilot and the controller."],
    correct: "of the pilot."
  },
  {
    id: "6.16",
    section: "Pilot Responsibilities",
    q: "A pilot on a Special VFR flight has been cleared to the circuit. Ahead, at a lower altitude, is a solid layer of stratus cloud. Remaining clear of cloud is the responsibility of",
    options: ["the tower controller as it is within a Control Zone.", "ATC because the weather is below VFR.", "the pilot and ATC.", "the pilot."],
    correct: "the pilot."
  },
  {
    id: "6.17",
    section: "Pilot Responsibilities",
    q: "A pilot on a VFR flight in Class C airspace is advised by ATC to maintain a specific heading. In the pilot\u2019s opinion, this heading will cause conflict with another aircraft. The pilot should",
    options: ["always change altitude as required to avoid the other aircraft.", "maintain the specified heading to comply with the CARs.", "alter heading to avoid the other aircraft and advise ATC.", "maintain the specified heading as separation will be provided by the controller."],
    correct: "alter heading to avoid the other aircraft and advise ATC."
  },
  {
    id: "6.18",
    section: "Pilot Responsibilities",
    q: "Unless ATC instructs otherwise, pilots operating VFR shall select transponder code 1200 when flying at or below ..... feet ASL and code ..... when flying above that altitude.",
    options: ["12,500, 1400.", "12,500, 1300.", "10,000, 1400.", "10,000, 1300."],
    correct: "12,500, 1400."
  },
  {
    id: "6.19",
    section: "Pilot Responsibilities",
    q: "Pilots shall activate the transponder \u201cident\u201d feature",
    options: ["before entering control zones.", "only when so instructed by ATC.", "before every change of altitude.", "after every change of an assigned code."],
    correct: "only when so instructed by ATC."
  },
  {
    id: "6.20",
    section: "Pilot Responsibilities",
    q: "The holder of a student pilot permit may for the sole purpose of the holder\u2019s own flight training act as PIC of an aircraft",
    options: ["only when accompanied by a flight instructor.", "by day and night and authorized by a supervising flight instructor.", "by day only and authorized by a supervising flight instructor.", "while carrying passengers."],
    correct: "by day only and authorized by a supervising flight instructor."
  },
  {
    id: "6.21",
    section: "Pilot Responsibilities",
    q: ". The PIC of an aircraft shall comply with any light signals or ground marking prescribed in the CARs",
    options: ["only while in class C airspace if they are part of an ATC clearance.", "only while in a Control Zone if they are part of an ATC instruction.", "at all times.", "at all times provided safety is not jeopardized."],
    correct: "at all times provided safety is not jeopardized."
  },
  {
    id: "6.22",
    section: "Pilot Responsibilities",
    q: "Before setting out on any VFR flight, a pilot is required to",
    options: ["read all weather reports received from stations within 100 miles of destination.", "file a flight itinerary.", "be familiar with all available information appropriate to the flight.", "obtain an ATC clearance."],
    correct: "be familiar with all available information appropriate to the flight."
  },
  {
    id: "6.23",
    section: "Pilot Responsibilities",
    q: "Terminal airspace dimensions and VHF sector frequencies for certain high density traffic airports in Canada are shown",
    options: ["in the Designated Airspace Handbook and the TC AIM.", "on the VTA chart and in the CFS.", "on the VTA and VNC charts.", "in the CFS and on the VNC chart."],
    correct: "on the VTA chart and in the CFS."
  },
  {
    id: "7.01",
    section: "Wake Turbulence",
    q: "Avoiding wake turbulence is",
    options: ["the sole responsibility of ATC.", "the responsibility of the pilot, only when advised by ATC of the possibility of wake turbulence.", "a responsibility shared by both the pilot and ATC.", "the sole responsibility of the pilot."],
    correct: "the sole responsibility of the pilot."
  },
  {
    id: "7.02",
    section: "Wake Turbulence",
    q: "Hazardous wake turbulence caused by aircraft in still air",
    options: ["dissipates immediately.", "dissipates rapidly.", "may persist for 5 minutes or more.", "persists indefinitely."],
    correct: "may persist for 5 minutes or more."
  },
  {
    id: "7.03",
    section: "Wake Turbulence",
    q: "Which response is most correct with respect to wake turbulence?",
    options: ["Wing tip vortices are carried by the ambient wind.", "Wing tip vortices have a circular and downward motion.", "Wake turbulence exists behind all aeroplanes and helicopters in flight.", "All of the above are correct."],
    correct: "All of the above are correct."
  },
  {
    id: "7.04",
    section: "Wake Turbulence",
    q: "The wing tip vortices generated by a heavy aeroplane can cause a lighter aircraft encountering them to",
    options: ["go out of control.", "continue descent even when maximum power is applied.", "sustain structural damage.", "experience any of the above situations."],
    correct: "experience any of the above situations."
  },
  {
    id: "7.05",
    section: "Wake Turbulence",
    q: "During the two minutes after the passage of a heavy aeroplane in cruising flight, hazardous wing tip vortices will",
    options: ["dissipate completely.", "dissipate rapidly.", "dissipate very slowly.", "remain at cruising altitude."],
    correct: "dissipate very slowly."
  },
  {
    id: "7.06",
    section: "Wake Turbulence",
    q: "The pilot of a light aircraft on final approach close behind a heavier aircraft should plan the approach to land",
    options: ["beyond the touchdown point of the other aircraft.", "prior to the touchdown point of the other aircraft.", "at the touchdown point of the other aircraft.", "to the right or left of the touchdown point of the other aircraft."],
    correct: "beyond the touchdown point of the other aircraft."
  },
  {
    id: "7.08",
    section: "Wake Turbulence",
    q: "Wake turbulence is produced by",
    options: ["heavy aeroplanes only, regardless of their speed.", "turbo-jet powered aircraft only.", "fast moving aeroplanes only, regardless of their weight.", "all fixed and rotary wing aircraft."],
    correct: "all fixed and rotary wing aircraft."
  },
  {
    id: "7.09",
    section: "Wake Turbulence",
    q: "Wake turbulence caused by a departing large aeroplane begins",
    options: ["before rotation.", "with rotation.", "after becoming airborne.", "with full power application."],
    correct: "with rotation."
  },
  {
    id: "7.10",
    section: "Wake Turbulence",
    q: "Wake turbulence caused by a departing aeroplane is most severe immediately",
    options: ["before rotation.", "following take-off.", "above its flight path.", "following full power application."],
    correct: "following take-off."
  },
  {
    id: "7.11",
    section: "Wake Turbulence",
    q: "Which statement concerning wing tip vortices is false?",
    options: ["Vortices normally settle below and behind the aircraft.", "With a light crosswind, one vortex can remain stationary over the ground for some time.", "Lateral movement of vortices, even in a no wind condition, may place a vortex core over a parallel runway.", "Vortices are caused directly by \u2018jet wash\u2019."],
    correct: "Vortices are caused directly by \u2018jet wash\u2019."
  },
  {
    id: "7.12",
    section: "Wake Turbulence",
    q: "Wake turbulence will be greatest when generated by an aeroplane which is",
    options: ["heavy, landing configuration and slow speed.", "heavy, clean configuration and slow speed.", "light, clean configuration and high speed.", "heavy, take-off configuration and slow speed."],
    correct: "heavy, clean configuration and slow speed."
  },
  {
    id: "7.13",
    section: "Wake Turbulence",
    q: "A helicopter in forward flight produces hazardous vortices",
    options: ["which rise above the helicopter.", "similar to wing tip vortices.", "which remains at the same level as the helicopter.", "ahead of the helicopter."],
    correct: "similar to wing tip vortices."
  },
  {
    id: "7.14",
    section: "Wake Turbulence",
    q: "Which statement concerning vortices caused by helicopters is correct?",
    options: ["Helicopter vortices are generally weak and dissipate rapidly.", "The size and weight of the helicopter has a direct influence on the intensity of the vortices.", "Helicopter vortices are less intense than the vortices of an aeroplane of the same weight.", "Wind does not influence the movement of vortices generated by a helicopter in hovering flight."],
    correct: "The size and weight of the helicopter has a direct influence on the intensity of the vortices."
  },
  {
    id: "7.15",
    section: "Wake Turbulence",
    q: "What effect would a light crosswind have on the wing tip vortices generated by a large aeroplane that had just taken off? A light crosswind",
    options: ["could cause one vortex to remain over the runway for some time.", "would rapidly dissipate the strength of both vortices.", "would rapidly clear the runway of all vortices.", "would not affect the lateral movement of the vortices."],
    correct: "could cause one vortex to remain over the runway for some time."
  },
  {
    id: "8.01",
    section: "Aeromedical",
    q: "A flight crew member aware of being under a physical disability that might invalidate licence issue or renewal shall",
    options: ["so advise the Minister.", "not commence a flight as a crew member.", "forward the licence to the Regional Aviation Medical Officer.", "fly as crew member only if a back-up member is available."],
    correct: "not commence a flight as a crew member."
  },
  {
    id: "8.02",
    section: "Aeromedical",
    q: "What is the recommended treatment for hyperventilation below 8,000 feet?",
    options: ["Increase the depth of breathing.", "Hold the breath and perform a Valsalva manoeuvre.", "Slow the breathing rate to below 12 times per minute.", "Increase oxygen flow rates."],
    correct: "Slow the breathing rate to below 12 times per minute."
  },
  {
    id: "8.03",
    section: "Aeromedical",
    q: "Damage to the ear drum in flight is most likely to occur",
    options: ["during a climb.", "during a descent.", "when using supplementary oxygen.", "after SCUBA diving."],
    correct: "during a descent."
  },
  {
    id: "8.04",
    section: "Aeromedical",
    q: "Clearing the ears on a rapid descent may be assisted by",
    options: ["swallowing.", "opening the mouth widely or yawning.", "a Valsalva manoeuvre.", "all of the above."],
    correct: "all of the above."
  },
  {
    id: "8.05",
    section: "Aeromedical",
    q: "Flight crew members who require decompression stops on the way to the surface when SCUBA diving should not fly for",
    options: ["4 hours.", "8 hours.", "12 hours.", "24 hours."],
    correct: "24 hours."
  },
  {
    id: "8.06",
    section: "Aeromedical",
    q: "With regard to fatigue, which statement is correct according to the information given under the \u201cMedical Information\u201d section of the TC AIM?",
    options: ["Financial or family problems do not influence tolerance to fatigue.", "Fatigue slows reaction time and causes foolish inattentive errors.", "A fatigued person recuperates more quickly as altitude is gained.", "A fatigued person must have food immediately before and during flight."],
    correct: "Fatigue slows reaction time and causes foolish inattentive errors."
  },
  {
    id: "8.07",
    section: "Aeromedical",
    q: "A pilot who has donated blood should not act as a flight crew member for at least the next",
    options: ["12 hours.", "24 hours.", "36 hours.", "48 hours."],
    correct: "48 hours."
  },
  {
    id: "8.08",
    section: "Aeromedical",
    q: "Any pilot who has had a general anaesthetic should not act as a flight crew member",
    options: ["during the next 12 hrs.", "during the next 36 hrs.", "during the next 48 hrs.", "unless advised it is safe to do so by a doctor."],
    correct: "unless advised it is safe to do so by a doctor."
  },
  {
    id: "8.09",
    section: "Aeromedical",
    q: "Any pilot who has had a local anaesthetic for extensive dental procedures should not act as a flight crew member during the next",
    options: ["12 hrs.", "24 hrs.", "36 hrs.", "48 hrs."],
    correct: "24 hrs."
  },
  {
    id: "8.10",
    section: "Aeromedical",
    q: "Relatively small amounts of alcohol affect tolerance to hypoxia (lack of sufficient oxygen). This tolerance",
    options: ["deteriorates with increase of altitude.", "improves with increase of altitude.", "is not affected by altitude change.", "remains constant to 6,000 feet ASL."],
    correct: "deteriorates with increase of altitude."
  },
  {
    id: "8.11",
    section: "Aeromedical",
    q: "Many common drugs such as cold tablets, cough mixtures, antihistamines and other over-thecounter remedies may seriously impair the judgement and co-ordination needed while flying. The safest rule is to",
    options: ["read the manufacturer\u2019s warning to ensure that you are aware of possible reactions to such drugs.", "take no medicine when you plan to fly, except on the advice of a Civil Aviation Medical Examiner\u2026", "allow at least 12 hours between taking any medicine or drugs and flying.", "allow at least 8 hours between taking any medicine or drugs and flying."],
    correct: "take no medicine when you plan to fly, except on the advice of a Civil Aviation Medical Examiner\u2026"
  },
  {
    id: "8.12",
    section: "Aeromedical",
    q: "The Canadian Medical Certificate of a private pilot 40 years old and over is valid, in Canada, for a period of",
    options: ["12 months.", "24 months.", "36 months.", "48 months."],
    correct: "24 months."
  },
  {
    id: "8.13",
    section: "Aeromedical",
    q: "The Canadian Medical Certificate of a private pilot under 40 years of age is valid, in Canada, for a period of",
    options: ["72 months.", "60 months.", "48 months.", "24 months."],
    correct: "60 months."
  },
  {
    id: "9.01",
    section: "Flight Plans and Flight Itineraries",
    q: "The amount of fuel and oil carried on board any helicopter at the commencement of a day VFR flight must be sufficient, to provide for foreseeable delays having been considered, to fly to the destination aerodrome,",
    options: ["and thereafter for 45 minutes at normal cruising speed.", "then to a specified alternate and thereafter for 45 minutes at normal cruising speed.", "and thereafter for 20 minutes at normal cruising speed.", "then to a specified alternate and thereafter for 20 minutes at normal cruising speed."],
    correct: "and thereafter for 20 minutes at normal cruising speed."
  },
  {
    id: "9.02",
    section: "Flight Plans and Flight Itineraries",
    q: "The amount of fuel carried on board any propeller-driven aeroplane at the commencement of a day VFR flight must be sufficient, having regard to the meteorological conditions and foreseeable delays that are expected in flight, to fly to the destination aerodrome",
    options: ["and then fly for a period of 45 minutes at normal cruising speed.", "and then fly for a period of 30 minutes at normal cruising speed.", "then to a specified alternate aerodrome and then for a period of 45 minutes at normal cruising speed.", "then to a specified alternate aerodrome and then fly for a period of 30 minutes at normal cruising speed."],
    correct: "and then fly for a period of 30 minutes at normal cruising speed."
  },
  {
    id: "9.03",
    section: "Flight Plans and Flight Itineraries",
    q: "If a flight plan is not filed, a flight itinerary must be filed",
    options: ["for flights proceeding 25 NM or more from the point of origin.", "only for flights in sparsely settled areas.", "for flights destined to land at aerodromes or places other than the point of origin.", "for all flights."],
    correct: "for flights proceeding 25 NM or more from the point of origin."
  },
  {
    id: "9.04",
    section: "Flight Plans and Flight Itineraries",
    q: "After landing from a VFR flight for which a flight plan has been filed, the pilot shall report the arrival to the appropriate ATS unit within",
    options: ["15 minutes.", "30 minutes.", "45 minutes.", "60 minutes."],
    correct: "60 minutes."
  },
  {
    id: "9.05",
    section: "Flight Plans and Flight Itineraries",
    q: "When there is a deviation from a VFR flight plan, ATC shall be notified of such deviation",
    options: ["as soon as possible.", "within 10 minutes.", "within 30 minutes.", "within 60 minutes after landing."],
    correct: "as soon as possible."
  },
  {
    id: "9.06",
    section: "Flight Plans and Flight Itineraries",
    q: "Where no search and rescue initiation time is specified in a flight itinerary, when shall the pilot report to the \u201cresponsible person\u201d?",
    options: ["Within one hour after the expiration of the estimated duration of the flight specified in the flight itinerary.", "Within one hour after landing.", "Within 24 hours after the expiration of the estimated duration of the flight specified in the flight itinerary.", "As soon as practicable after landing but no later than 24 hours after the last reported ETA."],
    correct: "As soon as practicable after landing but no later than 24 hours after the last reported ETA."
  },
  {
    id: "9.07",
    section: "Flight Plans and Flight Itineraries",
    q: "With regard to a flight itinerary, the \u201cresponsible person\u201d means an individual who",
    options: ["has agreed to report the aircraft overdue.", "is 18 years of age or over.", "holds an aeronautical licence.", "has agreed to report the arrival of the aircraft."],
    correct: "has agreed to report the aircraft overdue."
  },
  {
    id: "9.08",
    section: "Flight Plans and Flight Itineraries",
    q: "Where a VFR flight plan has been filed, an arrival report must be filed by the pilot",
    options: ["by advising an ATS unit.", "at each intermediate stop and then reopened on take-off.", "by parking the aircraft in close proximity to the tower.", "except at airports served by a control tower in which case the controller will automatically file the arrival report."],
    correct: "by advising an ATS unit."
  },
  {
    id: "9.09",
    section: "Flight Plans and Flight Itineraries",
    q: "Estimated elapsed time A to B",
    options: ["3 hours 50 minutes.", "3 hours 20 minutes.", "3 hours 05 minutes.", "2 hours 35 minutes."],
    correct: "3 hours 05 minutes."
  },
  {
    id: "9.10",
    section: "Flight Plans and Flight Itineraries",
    q: "When filing a VFR flight plan with an intermediate stop, the total elapsed time to be entered is the total",
    options: ["elapsed time for all legs including the duration of the intermediate stop.", "elapsed time for all legs, plus the intermediate stop, plus 45 minutes.", "flight time for all legs.", "elapsed time to the first landing plus intermediate stops."],
    correct: "elapsed time for all legs including the duration of the intermediate stop."
  },
  {
    id: "9.11",
    section: "Flight Plans and Flight Itineraries",
    q: "How is an intermediate stop indicated on the flight plan form for a VFR flight?",
    options: ["By including duration of the intermediate stop in \u2018Elapsed Time\u2019 box as ATC automatically checks time between points.", "Same as any VFR flight plan if the intermediate time does not exceed 30 minutes at each point.", "By repeating the name of intermediate stop and its duration in the \u2018Route\u2019 column.", "By simply indicating \u201cIntermediate Stop\u201d in \u201cOther Information\u201d column."],
    correct: "By repeating the name of intermediate stop and its duration in the \u2018Route\u2019 column."
  },
  {
    id: "10.01",
    section: "Clearances and Instructions",
    q: "An ATC instruction",
    options: ["must be complied with when received by the pilot providing the safety of the aircraft is not jeopardized.", "must be \u2018read back\u2019 in full to the controller and confirmed before becoming effective.", "is in effect advice provided by ATC and does not require acceptance or formal acknowledgement by the pilot concerned.", "is the same as an ATC clearance."],
    correct: "must be complied with when received by the pilot providing the safety of the aircraft is not jeopardized."
  },
  {
    id: "10.02",
    section: "Clearances and Instructions",
    q: "An ATC clearance",
    options: ["is the same as an ATC instruction.", "is advice provided by ATC and does not require acceptance or acknowledgement by the PIC.", "requires compliance when accepted by the PIC.", "must be complied with when received by the PIC."],
    correct: "requires compliance when accepted by the PIC."
  },
  {
    id: "10.03",
    section: "Clearances and Instructions",
    q: "A pilot, after accepting a clearance and subsequently finding that all or part of the clearance cannot be complied with, should",
    options: ["disregard the clearance.", "comply with only the part that is suitable.", "comply as best as possible under the circumstances to carry out the clearance and need not say anything to ATC.", "comply as best as possible under the circumstances and advise ATC as soon as possible."],
    correct: "comply as best as possible under the circumstances and advise ATC as soon as possible."
  },
  {
    id: "10.04",
    section: "Clearances and Instructions",
    q: "After accepting a clearance and subsequently finding that it cannot be complied with, a pilot should",
    options: ["take any immediate action required and advise ATC as soon as possible.", "comply as best as possible under the circumstances and say nothing to ATC.", "disregard the clearance.", "comply with the suitable parts."],
    correct: "take any immediate action required and advise ATC as soon as possible."
  },
  {
    id: "10.05",
    section: "Clearances and Instructions",
    q: "An ATC clearance or instruction is predicated on known traffic only. Therefore, when a pilot is proceeding in accordance with a clearance or instruction",
    options: ["ATC is relieved of the responsibility for traffic separation.", "the responsibility for traffic separation is divided between ATC and the pilot.", "the pilot is not relieved of the responsibility for traffic avoidance.", "the pilot is relieved of the responsibility for traffic avoidance."],
    correct: "the pilot is not relieved of the responsibility for traffic avoidance."
  },
  {
    id: "10.06",
    section: "Clearances and Instructions",
    q: "If all or part of an ATC clearance is unacceptable, a pilot should",
    options: ["comply as best as possible under the circumstances.", "refuse the clearance without giving a reason for refusal.", "acknowledge the clearance and read back only the acceptable parts.", "refuse the clearance and inform ATC of their intentions."],
    correct: "refuse the clearance and inform ATC of their intentions."
  },
  {
    id: "11.01",
    section: "Aircraft Operations",
    q: "In an emergency requiring the use of an ELT, it should be turned on",
    options: ["immediately and left on.", "at the ETA in the flight plan.", "for the first five minutes of each hour UTC.", "during daylight hours only to conserve the battery."],
    correct: "immediately and left on."
  },
  {
    id: "11.02",
    section: "Aircraft Operations",
    q: "An aircraft\u2019s 121.5 MHz ELT may be switched to transmit for test purposes anytime",
    options: ["following a hard landing.", "during the first 5 minutes of any hour UTC.", "following a component or battery change.", "prior to flight and listening on 121.5 MHz."],
    correct: "during the first 5 minutes of any hour UTC."
  },
  {
    id: "11.03",
    section: "Aircraft Operations",
    q: "Before shutting down you can verify that the aircraft\u2019s ELT is not transmitting by",
    options: ["checking that the ELT switch is in the off position.", "listening on 121.5 MHz for a signal.", "ensuring that the master switch is off.", "checking the ELT visual warning light."],
    correct: "listening on 121.5 MHz for a signal."
  },
  {
    id: "11.04",
    section: "Aircraft Operations",
    q: "All accidental ELT activations should be reported to the",
    options: ["airport manager.", "R.C.M.P.", "Minister.", "nearest ATS unit."],
    correct: "nearest ATS unit."
  },
  {
    id: "11.05",
    section: "Aircraft Operations",
    q: "When an aircraft engine is left running on the ground and no person remains onboard, the aircraft\u2019s movement must be restricted and",
    options: ["it must remain in sight of the pilot at all times.", "it must not be left unattended.", "its gross weight must be below 4,409 LB (2,000 kg).", "its control locks must be installed."],
    correct: "it must not be left unattended."
  },
  {
    id: "11.06",
    section: "Aircraft Operations",
    q: "When confronted with an approaching thunderstorm, a take-off or landing",
    options: ["should be avoided as a sudden wind shift or low level turbulence could cause a loss of control.", "is safe if you can see under the thunderstorm through to the other side.", "should be avoided unless the take-off can be made away from the thunderstorm.", "is safe if the thunderstorm is regarded as light."],
    correct: "should be avoided as a sudden wind shift or low level turbulence could cause a loss of control."
  },
  {
    id: "11.07",
    section: "Aircraft Operations",
    q: "An isolated thunderstorm is in close proximity to your aerodrome of intended landing. You should",
    options: ["land giving due consideration to wind shear on final approach.", "hold over a known point clear of the thunderstorm until it is well past the aerodrome.", "land as quickly as possible.", "add one-half the wind gust factor to the recommended landing speed and land."],
    correct: "hold over a known point clear of the thunderstorm until it is well past the aerodrome."
  },
  {
    id: "11.08",
    section: "Aircraft Operations",
    q: "The take-off thrust blast danger area includes at least that area extending back from the tail of a medium size jet transport aeroplane for",
    options: ["1,200 feet.", "900 feet.", "500 feet.", "450 feet."],
    correct: "1,200 feet."
  },
  {
    id: "11.09",
    section: "Aircraft Operations",
    q: "The ground idle blast danger area extends back from the tail of a jumbo jet aeroplane for at least",
    options: ["200 feet.", "450 feet.", "600 feet.", "750 feet."],
    correct: "600 feet."
  },
  {
    id: "11.10",
    section: "Aircraft Operations",
    q: "The ground idle blast danger area extends back from the tail of a medium size jet aeroplane for at least",
    options: ["200 feet.", "450 feet.", "600 feet.", "750 feet."],
    correct: "450 feet."
  },
  {
    id: "11.11",
    section: "Aircraft Operations",
    q: "The ground idle blast danger area extends back from the tail of an executive jet aeroplane for",
    options: ["200 feet.", "450 feet.", "600 feet.", "750 feet."],
    correct: "200 feet."
  },
  {
    id: "11.12",
    section: "Aircraft Operations",
    q: "A 45 kt blast area can be expected ..... behind the propellers of a large turbo-prop aeroplane during taxi.",
    options: ["60 feet.", "80 feet.", "100 feet.", "120 feet."],
    correct: "60 feet."
  },
  {
    id: "11.13",
    section: "Aircraft Operations",
    q: "ATC advises that simultaneous operations are in progress at an airport. Pilots could expect a clearance to",
    options: ["take-off over top of an aircraft on an intersecting runway.", "take-off on a specified parallel runway.", "land and hold short of an intersecting runway.", "land on a specified parallel runway."],
    correct: "land and hold short of an intersecting runway."
  },
  {
    id: "11.14",
    section: "Aircraft Operations",
    q: "When issued a clearance to land and hold short of an intersecting runway, pilots",
    options: ["shall comply regardless of the circumstances.", "may taxi across the intersection after the departing or arriving aircraft has cleared their path.", "who inadvertently go through the intersection should immediately do a 180\u00b0 turn and backtrack to the hold position.", "should immediately inform ATC if they are unable to comply."],
    correct: "should immediately inform ATC if they are unable to comply."
  },
  {
    id: "12.01",
    section: "Regulations \u2013 Canadian Airspace",
    q: "ADIZ rules normally apply",
    options: ["only to aircraft flying above 12,500 feet.", "only to aircraft flying at true airspeeds of 180 kt or more.", "only to all southbound aircraft.", "to all aircraft."],
    correct: "to all aircraft."
  },
  {
    id: "12.02",
    section: "Regulations \u2013 Canadian Airspace",
    q: "When operating in accordance with VFR, aircraft shall be flown",
    options: ["clear of aerodrome traffic zones.", "clear of control zones.", "with visual reference to the surface.", "in compliance with all of the above."],
    correct: "with visual reference to the surface."
  },
  {
    id: "12.03",
    section: "Regulations \u2013 Canadian Airspace",
    q: "Normally, a helicopter in uncontrolled airspace at less than 1,000 feet AGL may operate during the day in flight visibility which is not less than",
    options: ["\u00bd mile.", "1 mile.", "2 miles.", "3 miles."],
    correct: "1 mile."
  },
  {
    id: "12.04",
    section: "Regulations \u2013 Canadian Airspace",
    q: "What distance from cloud shall an aircraft maintain when flying below 1,000 feet AGL within uncontrolled airspace?",
    options: ["At least 2,000 ft horizontally and 500 ft vertically.", "At least 1 mile horizontally and 500 ft vertically.", "At least 2 miles horizontally and 500 ft vertically.", "Clear of cloud."],
    correct: "Clear of cloud."
  },
  {
    id: "12.05",
    section: "Regulations \u2013 Canadian Airspace",
    q: "No person shall drop anything from an aircraft in flight",
    options: ["which will create a hazard to persons or property.", "unless approval has been granted by the Minister.", "unless over an authorized jettison area.", "unless it is attached to a parachute."],
    correct: "which will create a hazard to persons or property."
  },
  {
    id: "12.06",
    section: "Regulations \u2013 Canadian Airspace",
    q: "A person may conduct aerobatic manoeuvres in an aircraft",
    options: ["over an airport provided the appropriate frequency is monitored.", "over the suburban area of a city above 2,000 feet AGL.", "within Class F advisory airspace when visibility is 3 miles or greater.", "within Class C airspace when the visibility is 1 mile or greater."],
    correct: "within Class F advisory airspace when visibility is 3 miles or greater."
  },
  {
    id: "12.07",
    section: "Regulations \u2013 Canadian Airspace",
    q: "CARs state that after the consumption of any alcoholic beverage, no person shall act as a crew member of an aircraft within",
    options: ["12 hours.", "24hours.", "36 hours.", "48 hours."],
    correct: "12 hours."
  },
  {
    id: "12.08",
    section: "Regulations \u2013 Canadian Airspace",
    q: "\u2018Day\u2019 in Canada is that period of time between",
    options: ["sunrise and sunset.", "one hour before sunrise and one hour after sunset.", "the beginning of morning civil twilight and the end of evening civil twilight.", "the end of morning civil twilight and the beginning of evening civil twilight."],
    correct: "the beginning of morning civil twilight and the end of evening civil twilight."
  },
  {
    id: "12.09",
    section: "Regulations \u2013 Canadian Airspace",
    q: "\u2018Night\u2019 in Canada is that period of time between",
    options: ["sunset and sunrise.", "the beginning of evening civil twilight and the end of morning civil twilight.", "one hour after sunset and one hour before sunrise.", "the end of evening civil twilight and the beginning of morning civil twilight."],
    correct: "the end of evening civil twilight and the beginning of morning civil twilight."
  },
  {
    id: "12.10",
    section: "Regulations \u2013 Canadian Airspace",
    q: "Formation flying is permitted only if such flights",
    options: ["have been pre-arranged by the pilots-in-command.", "are conducted above 3,000 feet AGL.", "are conducted by commercial pilots.", "are led by a pilot whose licence is endorsed for formation flight."],
    correct: "have been pre-arranged by the pilots-in-command."
  },
  {
    id: "12.11",
    section: "Regulations \u2013 Canadian Airspace",
    q: "Flight through active Class F airspace with the designator CYR",
    options: ["may be undertaken only by aircraft equipped with two-way radio communication and a transponder.", "is restricted to military aircraft operating under the authority of the Minister of National Defence.", "will be approved only for aircraft on IFR flight plans under positive radar control.", "is permitted only in accordance with permission issued by the user agency."],
    correct: "is permitted only in accordance with permission issued by the user agency."
  },
  {
    id: "12.12",
    section: "Regulations \u2013 Canadian Airspace",
    q: "Which statement is correct with regard to \u201cadvisory airspace\u201d?",
    options: ["A transient aircraft entering active advisory airspace shall be equipped with a serviceable transponder.", "Non-participating VFR aircraft are encouraged to avoid flight in advisory airspace during active periods specified on aeronautical charts and NOTAM.", "Aircraft need to be equipped with a two-way radio to enter active advisory airspace.", "Only military aircraft may enter advisory airspace depicted on aeronautical charts."],
    correct: "Non-participating VFR aircraft are encouraged to avoid flight in advisory airspace during active periods specified on aeronautical charts and NOTAM."
  },
  {
    id: "12.13",
    section: "Regulations \u2013 Canadian Airspace",
    q: "Except as provided by CARs, unless taking off, landing or attempting to land, no person shall fly a helicopter over a built-up area or open air assembly of persons except at an altitude that will permit, in the event of an emergency, the landing of the aircraft without creating a hazard to persons or property on the surface, and such altitude shall not be less than ..... above the highest obstacle within a horizontal radius of ..... from the aircraft.",
    options: ["3,000 ft, 1 mile.", "2,000 ft, 1,000 ft.", "1,000 ft, 500 ft.", "500 ft, 500 ft."],
    correct: "1,000 ft, 500 ft."
  },
  {
    id: "12.14",
    section: "Regulations \u2013 Canadian Airspace",
    q: "Over non-populous areas or over open water, a pilot must maintain a minimum distance of ..... feet from any person, vessel, vehicle or structure.",
    options: ["200", "500", "1,000", "2,000"],
    correct: "500"
  },
  {
    id: "12.15",
    section: "Regulations \u2013 Canadian Airspace",
    q: "Except for balloons and as provided by CARs, no person shall cause any aircraft to take off or attempt to take off from, land on or attempt to land on, any surface within the built-up area of any city or town unless",
    options: ["the aircraft is multi-engined.", "all obstacles on approach and departure can be cleared by a minimum of 500 ft.", "that surface is an airport or military aerodrome.", "noise abatement procedures are followed."],
    correct: "that surface is an airport or military aerodrome."
  },
  {
    id: "12.16",
    section: "Regulations \u2013 Canadian Airspace",
    q: "What is the height AGL above which an aircraft in VFR flight shall be operated to conform with the Cruising Altitudes Order?",
    options: ["700 feet.", "2,200 feet.", "3,000 feet.", "3,500 feet."],
    correct: "3,000 feet."
  },
  {
    id: "12.17",
    section: "Regulations \u2013 Canadian Airspace",
    q: "An aircraft cruising VFR in level flight above 3,000 feet AGL on a track of 290\u00b0M shall be flown at an",
    options: ["even thousand foot altitude.", "even thousand plus 500 foot altitude.", "odd thousand foot altitude.", "odd thousand plus 500 foot altitude."],
    correct: "even thousand plus 500 foot altitude."
  },
  {
    id: "12.18",
    section: "Regulations \u2013 Canadian Airspace",
    q: "The selection of a cruising altitude in the southern domestic airspace should be based on the",
    options: ["true track.", "magnetic track.", "true heading.", "magnetic heading."],
    correct: "magnetic track."
  },
  {
    id: "12.19",
    section: "Regulations \u2013 Canadian Airspace",
    q: "Every person who is the holder of any pilot licence or permit shall, on demand, produce such licence or permit for inspection by persons authorized by the Minister, by peace officers and",
    options: ["FSS operators.", "Transport Canada airport managers.", "immigration officers.", "all of the above."],
    correct: "immigration officers."
  },
  {
    id: "12.20",
    section: "Regulations \u2013 Canadian Airspace",
    q: "Low Level Airspace is defined as, all airspace",
    options: ["extending upwards from 2,200 feet AGL within designated airways.", "extending upwards from 1000 feet AGL within designated airways.", "extending upwards from the surface of the earth within designated airways.", "within the Canadian Domestic Airspace below 18,000 feet ASL."],
    correct: "within the Canadian Domestic Airspace below 18,000 feet ASL."
  },
  {
    id: "12.21",
    section: "Regulations \u2013 Canadian Airspace",
    q: "A Control Zone normally is controlled airspace extending upwards from",
    options: ["2,200 feet above the surface of the earth.", "700 feet above the surface of the earth.", "the surface of the earth to 3,000 feet.", "a specified height above the surface of the earth."],
    correct: "the surface of the earth to 3,000 feet."
  },
  {
    id: "13.01",
    section: "Controlled Airspace",
    q: "\u2018Controlled Airspace\u2019 means all airspace of defined dimensions within which",
    options: ["Control Zone regulations are in force.", "security regulations are in force.", "Special VFR flight only is permitted.", "an ATC service is provided."],
    correct: "an ATC service is provided."
  },
  {
    id: "13.02",
    section: "Controlled Airspace",
    q: "When in VFR flight within controlled airspace, a pilot must remain clear of cloud by at least",
    options: ["500 feet vertically and 1 mile horizontally.", "500 feet vertically and 2,000 feet horizontally.", "1,000 feet vertically and 1 mile horizontally.", "1,000 feet vertically and 3 miles horizontally."],
    correct: "500 feet vertically and 1 mile horizontally."
  },
  {
    id: "13.03",
    section: "Controlled Airspace",
    q: "The minimum flight visibility for VFR flight within a low level airway is",
    options: ["1 mile.", "1\u00bd miles.", "2 miles.", "3 miles."],
    correct: "3 miles."
  },
  {
    id: "13.04",
    section: "Controlled Airspace",
    q: "When in VFR flight within a Control Zone, a pilot must remain clear of cloud by at least",
    options: ["500 feet vertically and 2,000 feet horizontally.", "500 feet vertically and 1 mile horizontally.", "1,000 feet vertically and 1 mile horizontally.", "1,000 feet vertically and 3 miles horizontally."],
    correct: "500 feet vertically and 1 mile horizontally."
  },
  {
    id: "13.05",
    section: "Controlled Airspace",
    q: "VFR cross-country pilots wishing to cross through any part of a Class C Control Zone should",
    options: ["advise the associated FSS.", "monitor the Approach Control frequency.", "advise ATC of their intentions and obtain a clearance.", "conform with circuit direction at that airport."],
    correct: "advise ATC of their intentions and obtain a clearance."
  },
  {
    id: "13.06",
    section: "Controlled Airspace",
    q: "ATC may authorize an aircraft equipped with a functioning two-way radio to transit a Control Zone under day SVFR provided the flight visibility and, when reported, ground visibility, are each not less than",
    options: ["\u00bd mile.", "1 mile.", "2 miles.", "3 miles."],
    correct: "1 mile."
  },
  {
    id: "13.07",
    section: "Controlled Airspace",
    q: "ATC may authorize a helicopter equipped with a functioning two-way radio to transit a Control Zone under day SVFR where the flight visibility and, when reported, ground visibility are each not less than",
    options: ["1 mile and operated at not less than 500 feet AGL.", "\u00bd mile.", "1 mile.", "\u00bd mile and operated at not less than 500 feet AGL."],
    correct: "\u00bd mile."
  },
  {
    id: "13.08",
    section: "Controlled Airspace",
    q: "An aircraft flying in accordance with Special VFR would be flying within",
    options: ["a Control Zone.", "an Aerodrome Traffic Zone.", "a Terminal Control Area.", "an airway."],
    correct: "a Control Zone."
  },
  {
    id: "13.09",
    section: "Controlled Airspace",
    q: "An arriving VFR flight shall make initial radio contact with the control tower",
    options: ["upon entering an Aerodrome Traffic Zone.", "prior to entering a Control Zone.", "immediately prior to joining the circuit.", "immediately after entering a Control Zone."],
    correct: "prior to entering a Control Zone."
  },
  {
    id: "13.10",
    section: "Controlled Airspace",
    q: "VFR flight within Class B airspace is permitted",
    options: ["only when the flight visibility is 5 miles or better.", "for all aircraft except gliders and balloons.", "if the pilot holds a Class B Airspace Endorsement.", "in accordance with an ATC clearance."],
    correct: "in accordance with an ATC clearance."
  },
  {
    id: "13.11",
    section: "Controlled Airspace",
    q: "The pilot of an arriving VFR flight shall make initial radio contact with a control tower in Class C airspace",
    options: ["immediately after entering the Control Zone.", "10 NM outside the Control Zone.", "prior to entering the Control Zone.", "immediately prior to joining the circuit."],
    correct: "prior to entering the Control Zone."
  },
  {
    id: "13.12",
    section: "Controlled Airspace",
    q: "Unless otherwise authorized, a pilot on a VFR flight operating within a Class C terminal control area must",
    options: ["exit the airspace whenever the weather deteriorates below VFR limits.", "establish radio contact with the appropriate ATC unit only when transiting the associated control zone.", "establish and maintain radio communication with the appropriate ATC Unit.", "contact radar service only when taking off or landing at the major airport concerned."],
    correct: "establish and maintain radio communication with the appropriate ATC Unit."
  },
  {
    id: "14.01",
    section: "Aviation Occurrences",
    q: "The primary objective of an aviation safety investigation into an aircraft accident or aircraft incident is to",
    options: ["apportion blame and liability.", "determine the adequacy of insurance regulations.", "enforce regulations.", "prevent recurrences."],
    correct: "prevent recurrences."
  },
  {
    id: "14.02",
    section: "Aviation Occurrences",
    q: "Details on civil aviation accident reporting procedures can be found in the",
    options: ["TC AIM", "Canadian Aviation Regulations.", "Canada Flight Supplement.", "Aviation Safety Manual."],
    correct: "TC AIM"
  },
  {
    id: "14.03",
    section: "Aviation Occurrences",
    q: "When an aircraft accident occurs, the pilot or operator of the aircraft involved shall ensure that the particulars of the accident are reported to the TSB",
    options: ["within 7 days by registered mail.", "within 24 hours by telephone.", "within 48 hours by facsimile.", "as soon as possible and by the quickest means available."],
    correct: "as soon as possible and by the quickest means available."
  },
  {
    id: "14.04",
    section: "Aviation Occurrences",
    q: "The TSB shall be notified of a reportable aviation accident when",
    options: ["a person sustains serious or fatal injury as a result of being in or coming into direct contact with any part of an aircraft.", "an aircraft sustains damage or structural failure adversely affecting performance or flight characteristics and requiring major repair or replacement.", "an aircraft is missing or completely inaccessible.", "any of the above conditions exist."],
    correct: "any of the above conditions exist."
  },
  {
    id: "14.05",
    section: "Aviation Occurrences",
    q: "The TSB considers missing aircraft to be",
    options: ["a reportable aviation incident.", "an occurrence which need not be reported.", "an aviation incident which need not be reported.", "a reportable aviation accident."],
    correct: "a reportable aviation accident."
  },
];
