import type { PstarQuestion } from '../types';

const TC_PSTAR_QUESTIONS: PstarQuestion[] = [
  {
    id:'1.01',
    section:'Collision Avoidance',
    q:'When aircraft converge at about the same altitude, which aircraft has priority over power-driven heavier-than-air aircraft?',
    options:['A jet airliner','An aircraft towing objects','An aeroplane approaching from the left','A helicopter'],
    correct:'An aircraft towing objects'
  },
  {
    id:'1.02',
    section:'Collision Avoidance',
    q:'Two aircraft are converging at about the same altitude. If the other aircraft is on your right, what must you do?',
    options:['Turn left','Descend below it','Give way','Expect the other aircraft to give way'],
    correct:'Give way'
  },
  {
    id:'1.03',
    section:'Collision Avoidance',
    q:'When converging at about the same altitude, what should a power-driven heavier-than-air aircraft do with respect to a glider?',
    options:['Maintain course','Climb above it','Require the glider to give way','Give way to the glider'],
    correct:'Give way to the glider'
  },
  {
    id:'1.04',
    section:'Collision Avoidance',
    q:'When a helicopter and a glider converge at about the same altitude, which aircraft gives way?',
    options:['The glider','The lower aircraft','The aircraft on the left only','The helicopter'],
    correct:'The helicopter'
  },
  {
    id:'1.05',
    section:'Collision Avoidance',
    q:'When a glider and a balloon converge at about the same altitude, which aircraft gives way?',
    options:['The balloon','The lower aircraft','The aircraft moving faster','The glider'],
    correct:'The glider'
  },
  {
    id:'1.06',
    section:'Collision Avoidance',
    q:'When converging at about the same altitude, which aircraft gives way to a balloon?',
    options:['A balloon','An aeroplane towing a glider','A glider','An airship'],
    correct:'An aeroplane towing a glider'
  },
  {
    id:'1.07',
    section:'Collision Avoidance',
    q:'Two power-driven heavier-than-air aircraft are converging at about the same altitude. Which one has right of way?',
    options:['The one on the left','Both turn left','The one on the right','The one flying faster'],
    correct:'The one on the right'
  },
  {
    id:'1.08',
    section:'Collision Avoidance',
    q:'When two aircraft approach head-on and collision risk exists, what action should each pilot take?',
    options:['Reduce speed','Increase speed','Alter heading to the right','Alter heading to the left'],
    correct:'Alter heading to the right'
  },
  {
    id:'1.09',
    section:'Collision Avoidance',
    q:'You are overtaking an aircraft directly ahead at your altitude. What is the normal avoiding action?',
    options:['Climb','Descend','Alter heading to the right','Alter heading to the left'],
    correct:'Alter heading to the right'
  },
  {
    id:'1.10',
    section:'Collision Avoidance',
    q:'Two aircraft are on approach to land. What must the higher aircraft do?',
    options:['Claim right of way','Overtake on the left','Give way','Make a right 360 degree turn'],
    correct:'Give way'
  },
  {
    id:'2.01',
    section:'Visual Signals',
    q:'A series of green flashes from the tower means what for aircraft in flight and on the ground?',
    options:['Cleared to land / cleared to taxi','Return for landing / cleared for take-off','Return for landing / cleared to taxi','Cleared to land / cleared for take-off'],
    correct:'Return for landing / cleared to taxi'
  },
  {
    id:'2.02',
    section:'Visual Signals',
    q:'A steady red light means what to an aircraft in flight and to one on the ground?',
    options:['Give way and continue circling / stop','Airport unsafe / stop','Do not land / taxi clear','Return for landing / stop'],
    correct:'Give way and continue circling / stop'
  },
  {
    id:'2.03',
    section:'Visual Signals',
    q:'A series of red flashes means what to an aircraft in flight and to one on the ground?',
    options:['Airport unsafe, do not land / taxi clear of landing area in use','Give way and circle / stop','Do not land for now / return to starting point','Prohibited area / stop'],
    correct:'Airport unsafe, do not land / taxi clear of landing area in use'
  },
  {
    id:'2.04',
    section:'Visual Signals',
    q:'A steady green light means what to an aircraft in flight and to one on the ground?',
    options:['Cleared to land / cleared to taxi','Return for landing / cleared to taxi','Return for landing / cleared for take-off','Cleared to land / cleared for take-off'],
    correct:'Cleared to land / cleared for take-off'
  },
  {
    id:'2.05',
    section:'Visual Signals',
    q:'What does a flashing white light mean to an aircraft on the manoeuvring area?',
    options:['Stop','Return to starting point on the airport','Cleared to taxi','Taxi clear of the landing area'],
    correct:'Return to starting point on the airport'
  },
  {
    id:'2.06',
    section:'Visual Signals',
    q:'Blinking runway lights advise vehicles and pedestrians to do what?',
    options:['Return to the apron','Vacate the runways immediately','Proceed with caution','Hold position for an emergency'],
    correct:'Vacate the runways immediately'
  },
  {
    id:'2.07',
    section:'Visual Signals',
    q:'Chrome yellow and black strips on pylons or a building roof identify what?',
    options:['Explosives in use','A fur farm','An artillery range','An open pit mine'],
    correct:'A fur farm'
  },
  {
    id:'2.08',
    section:'Visual Signals',
    q:'Pilots should avoid overflying reindeer or caribou below what altitude?',
    options:['2,500 feet AGL','2,000 feet AGL','1,500 feet AGL','1,000 feet AGL'],
    correct:'2,000 feet AGL'
  },
  {
    id:'3.01',
    section:'Communications',
    q:'For initial contact with Canadian ATC, aircraft C-GFLU should use which phonetic registration after aircraft type or manufacturer?',
    options:['Lima Uniform','Foxtrot Lima Uniform','Golf Foxtrot Lima Uniform','Charlie Golf Foxtrot Lima Uniform'],
    correct:'Golf Foxtrot Lima Uniform'
  },
  {
    id:'3.02',
    section:'Communications',
    q:'On initial contact, how should aircraft C-FBSQ transmit the registration?',
    options:['FBSQ','Fox Baker Sugar Queen','Foxtrot Bravo Sierra Quebec','Bravo Sierra Quebec'],
    correct:'Foxtrot Bravo Sierra Quebec'
  },
  {
    id:'3.03',
    section:'Communications',
    q:'After initial contact by a Canadian privately registered aircraft, what may be omitted from later transmissions?',
    options:['Any letters omitted by ATS in the last communication','The aircraft type and first two registration letters if initiated by ATS','The first three registration letters','All phonetic equivalents'],
    correct:'The aircraft type and first two registration letters if initiated by ATS'
  },
  {
    id:'3.04',
    section:'Communications',
    q:'On initial radio contact with ATS, what identification should the pilot transmit?',
    options:['Aircraft manufacturer or type and the last four registration letters in phonetics','The last three registration letters only','The whole registration only','Aircraft type and the last three letters only'],
    correct:'Aircraft manufacturer or type and the last four registration letters in phonetics'
  },
  {
    id:'3.05',
    section:'Communications',
    q:'What is the normal purpose of ATIS?',
    options:['To replace FSS','To reduce frequency congestion','To rapidly update forecasts','To operate only in VFR conditions'],
    correct:'To reduce frequency congestion'
  },
  {
    id:'3.06',
    section:'Communications',
    q:'Where ATIS is available, what should be included on first contact with ATC?',
    options:['The phrase with the numbers','The phrase ATIS received','The phrase with the information','The ATIS phonetic identifier'],
    correct:'The ATIS phonetic identifier'
  },
  {
    id:'3.07',
    section:'Communications',
    q:'When practical, VFR aircraft en route in uncontrolled airspace should monitor 121.5 MHz and what other frequency?',
    options:['126.7 MHz','123.2 MHz','122.8 MHz','122.2 MHz'],
    correct:'126.7 MHz'
  },
  {
    id:'3.08',
    section:'Communications',
    q:'En route aircraft should maintain a listening watch for distress traffic on what frequency when possible?',
    options:['The ELT receiver mode','121.5 MHz on the aircraft receiver','121.5 MHz only during the first 5 minutes of each hour','The voice frequency of the navigation aid in use'],
    correct:'121.5 MHz on the aircraft receiver'
  },
  {
    id:'3.09',
    section:'Communications',
    q:'Where are MF procedures such as frequency, distance, and altitude normally found?',
    options:['Canada Flight Supplement or Canada Water Aerodrome Supplement','Designated Airspace Handbook','Transport Canada AIM only','Flight Training Manual'],
    correct:'Canada Flight Supplement or Canada Water Aerodrome Supplement'
  },
  {
    id:'3.10',
    section:'Communications',
    q:'When using an MF and no ground station is operating, transmissions should be addressed to whom?',
    options:['Aerodrome UNICOM','The nearest ATC unit','Aerodrome traffic','The first aircraft heard'],
    correct:'Aerodrome traffic'
  },
  {
    id:'3.11',
    section:'Communications',
    q:'At an aerodrome with no UNICOM, what ATF should VFR pilots normally use for landing intentions?',
    options:['121.5 MHz','123.2 MHz','123.45 MHz','126.7 MHz'],
    correct:'123.2 MHz'
  },
  {
    id:'3.12',
    section:'Communications',
    q:'If an MF is in use, departing VFR pilots should monitor it until when?',
    options:['Beyond the specified distance or altitude','Established en route','Established at cruise altitude','Clear of the circuit pattern'],
    correct:'Beyond the specified distance or altitude'
  },
  {
    id:'3.13',
    section:'Communications',
    q:'A taxi clearance to the runway in use includes crossing two taxiways and another runway. What clearance is still needed?',
    options:['No further clearance is needed','Clearance is needed for every taxiway and runway','Clearance is needed to line up on the runway','Clearance is needed to cross the other runway'],
    correct:'Clearance is needed to cross the other runway'
  },
  {
    id:'3.14',
    section:'Communications',
    q:'If instructed to taxi to runway 29 and hold short of runway 04, what must the readback include?',
    options:['Runway 04','Runway 29','Hold short of 29','Hold short of 04'],
    correct:'Hold short of 04'
  },
  {
    id:'3.15',
    section:'Communications',
    q:'When accepting an immediate take-off clearance, what should the pilot do?',
    options:['Back-track for full runway length','Stop in position and await another clearance','Taxi onto the runway and take off in one continuous movement','Finish checks before entering the runway'],
    correct:'Taxi onto the runway and take off in one continuous movement'
  },
  {
    id:'3.16',
    section:'Communications',
    q:'If flying heading 270 and ATC reports traffic at 2 o clock, 5 miles, eastbound, where is the traffic?',
    options:['60 degrees left, altitude unknown','60 degrees right, altitude unknown','90 degrees right at same altitude','90 degrees left at same altitude'],
    correct:'60 degrees right, altitude unknown'
  },
  {
    id:'3.17',
    section:'Communications',
    q:'ATC clears you to land and turn right at the first intersection. If that turn cannot be made safely, what should you do?',
    options:['Try the turn anyway','Complete a touch-and-go','Land and turn off at the nearest safe intersection','Make a 180 degree turn on the runway'],
    correct:'Land and turn off at the nearest safe intersection'
  },
  {
    id:'3.18',
    section:'Communications',
    q:'Which radiotelephone signal indicates serious or imminent danger requiring immediate assistance?',
    options:['Mayday Mayday Mayday','Pan Pan Pan Pan Pan Pan','Security Security Security','Emergency Emergency Emergency'],
    correct:'Mayday Mayday Mayday'
  },
  {
    id:'3.19',
    section:'Communications',
    q:'Which radiotelephone signal indicates urgency about safety but not immediate assistance?',
    options:['Mayday Mayday Mayday','Pan Pan Pan Pan Pan Pan','Emergency Emergency Emergency','Urgency Urgency Urgency'],
    correct:'Pan Pan Pan Pan Pan Pan'
  }
];

const TC_PSTAR_MORE_QUESTIONS: PstarQuestion[] = [
  {id:'3.20',section:'Communications',q:'What phraseology is used to cancel a distress message?',options:['Mayday three times, all stations, distress traffic ended, out','Mayday once, all stations style call, station details, seelonce feenee, out','Mayday cancelled three times','All stations three times, emergency over'],correct:'Mayday once, all stations style call, station details, seelonce feenee, out'},
  {id:'3.21',section:'Communications',q:'A departing flight normally stays on tower frequency until when?',options:['2,000 feet AGL','25 NM from the airport','15 NM from the control zone','Clear of the control zone'],correct:'Clear of the control zone'},
  {id:'3.22',section:'Communications',q:'After you report downwind and other traffic is in the circuit, what will ATC normally provide?',options:['Your approach sequence or other instructions','Runway, wind, and altimeter only','All other circuit traffic','Immediate landing clearance'],correct:'Your approach sequence or other instructions'},
  {id:'3.23',section:'Communications',q:'How should a radio-equipped aircraft acknowledge a landing clearance at a controlled airport?',options:['Say Roger','Say Wilco','Click the microphone','Transmit the aircraft call sign'],correct:'Transmit the aircraft call sign'},
  {id:'3.24',section:'Communications',q:'How should an initial call to Timmins FSS begin?',options:['Timmins radio this is...','Timmins Flight Service Station this is...','Timmins UNICOM this is...','Timmins this is...'],correct:'Timmins radio this is...'},
  {id:'3.25',section:'Communications',q:'A Flight Information Centre specialist provides what service?',options:['Air traffic control','Flight planning services','Only uncontrolled-airspace traffic service','Terminal radar service'],correct:'Flight planning services'},
  {id:'3.26',section:'Communications',q:'Where are NOTAMs available?',options:['At flight information centres','By email to all pilots','Only for aerodrome closures','Only for 24 hours'],correct:'At flight information centres'},
  {id:'3.27',section:'Communications',q:'A new or replacing NOTAM without EST remains valid until when?',options:['48 hours only','The day it was issued','The End Time in the NOTAM','A cancelling NOTAM is issued'],correct:'The End Time in the NOTAM'},
  {id:'3.28',section:'Communications',q:'If a NOTAM end time includes EST, what does that imply?',options:['An estimated 24-hour period','An estimated 48-hour period','Valid only until the time shown','Valid until cancelled or replaced'],correct:'Valid until cancelled or replaced'},
  {id:'3.29',section:'Communications',q:'Readability three means your radio transmission is what?',options:['Readable now and then','Readable with difficulty','Readable','Perfectly readable'],correct:'Readable with difficulty'},
  {id:'4.01',section:'Aerodromes',q:'In Canadian aviation terminology, what is an airport?',options:['An aerodrome with paved runways','An aerodrome with a tower','An uncertified aerodrome','A certified aerodrome'],correct:'A certified aerodrome'},
  {id:'4.02',section:'Aerodromes',q:'A dry Transport Canada standard wind indicator flying horizontal shows wind of at least what speed?',options:['25 kt','15 kt','10 kt','6 kt'],correct:'15 kt'},
  {id:'4.03',section:'Aerodromes',q:'At an uncontrolled airport, vehicle movement on aircraft movement areas requires permission from whom?',options:['The airport operator','The airport security officer','A federal peace officer','A flight instructor'],correct:'The airport operator'},
  {id:'4.04',section:'Aerodromes',q:'How are closed runways and taxiways normally marked?',options:['Red flags','Red squares with yellow diagonals','White Xs on runways and yellow Xs on taxiways','White dumbbells'],correct:'White Xs on runways and yellow Xs on taxiways'},
  {id:'4.05',section:'Aerodromes',q:'The west end of an east-west runway is numbered what?',options:['09','90','27','270'],correct:'09'},
  {id:'4.06',section:'Aerodromes',q:'If no taxiway holding position exists, where should aircraft normally wait before entering an active runway?',options:['Clear of the manoeuvring area','50 ft from the runway edge','150 ft from the runway edge','200 ft from the runway edge'],correct:'200 ft from the runway edge'},
  {id:'4.07',section:'Aerodromes',q:'What is the manoeuvring area of an airport?',options:['The ramp or apron','Apron, taxiways, and runways','Only routes to parking','Areas used for taxiing, takeoff, and landing'],correct:'Areas used for taxiing, takeoff, and landing'},
  {id:'4.08',section:'Aerodromes',q:'Except for takeoff or landing, aircraft should not fly over an aerodrome below what height?',options:['2,000 feet AGL','1,500 feet AGL','1,000 feet AGL','500 feet AGL'],correct:'2,000 feet AGL'},
  {id:'5.01',section:'Equipment',q:'For a radio-equipped Canadian private aircraft, which additional documents are carried with flight authority and registration?',options:['Technical records, crew licences, flight manual, journey log','Technical records, crew licences, type certificate, insurance','Crew licences, flight manual, type certificate, journey log','Crew licences, flight manual, journey log, insurance'],correct:'Crew licences, flight manual, journey log, insurance'},
  {id:'5.02',section:'Equipment',q:'Private aeroplanes or helicopters flying VFR 25 NM or more from base may require what?',options:['Specified emergency supplies','A two-way radio','A multi-engine aircraft with passengers','All of these'],correct:'Specified emergency supplies'},
  {id:'5.03',section:'Equipment',q:'A serviceable landing light is required on aircraft doing what?',options:['Carrying passengers at night','Carrying passengers at night except private aircraft under 5,700 kg','Using an unlighted aerodrome','Taking off or landing at night'],correct:'Carrying passengers at night'},
  {id:'5.04',section:'Equipment',q:'Without required oxygen equipment readily available, unpressurized aircraft must not be flown above what altitude?',options:['9,500 feet ASL','10,000 feet ASL','12,500 feet ASL','13,000 feet ASL'],correct:'13,000 feet ASL'},
  {id:'5.05',section:'Equipment',q:'How long may flight crew remain between 10,000 and 13,000 feet ASL without readily available oxygen?',options:['15 minutes','30 minutes','1 hour','2 hours'],correct:'30 minutes'},
  {id:'5.06',section:'Equipment',q:'What must be available to each person in a single-engine aircraft taking off from or landing on water?',options:['An approved life raft','An approved life preserver','A signal flare','A signal mirror'],correct:'An approved life preserver'},
  {id:'5.07',section:'Equipment',q:'What is the international VHF emergency frequency?',options:['121.5 MHz','121.9 MHz','122.2 MHz','126.7 MHz'],correct:'121.5 MHz'},
  {id:'5.08',section:'Equipment',q:'No pilot may take off from or land at an aerodrome at night unless what condition is met?',options:['A two-way radio is working','A landing light is working','The aerodrome is lighted as prescribed','The pilot has three recent night landings'],correct:'The aerodrome is lighted as prescribed'},
  {id:'5.09',section:'Equipment',q:'Under the CARs, an infant passenger is a person of what age?',options:['Under 30 lb','Under 3 years','Under 5 and under 50 lb','Under 2 years'],correct:'Under 2 years'},
  {id:'5.10',section:'Equipment',q:'If no child restraint system is used, how must an infant be secured when belts are required?',options:['In a seat using a safety belt','Held by a responsible person whose belt is fastened','Held and belted together with the adult','Any of these methods'],correct:'Held by a responsible person whose belt is fastened'},
  {id:'5.11',section:'Equipment',q:'For day VFR power-driven aircraft, what instruments are required along with a magnetic compass or direction system?',options:['Airspeed indicator, altimeter, timepiece','Airspeed, attitude, heading','Airspeed, altimeter, vertical speed, turn and bank, timepiece','Attitude, vertical speed, turn and bank, heading'],correct:'Airspeed indicator, altimeter, timepiece'},
  {id:'6.01',section:'Pilot Responsibilities',q:'If cleared for takeoff after a large aircraft makes a very low approach and overshoot, what should you do?',options:['Take off immediately','Line up and wait','Decline and tell ATC why','Wait exactly 2 minutes then go'],correct:'Decline and tell ATC why'},
  {id:'6.02',section:'Pilot Responsibilities',q:'When ATC offers an intersection takeoff, who must ensure enough runway remains?',options:['The controller need not state runway remaining','The pilot','The controller','Noise procedures are cancelled'],correct:'The pilot'},
  {id:'6.03',section:'Pilot Responsibilities',q:'If a pilot requests and receives an intersection takeoff, who is responsible for runway length?',options:['The controller gives remaining length every time','The controller ensures it is sufficient','The pilot ensures it is sufficient','Noise abatement is cancelled'],correct:'The pilot ensures it is sufficient'},
  {id:'6.04',section:'Pilot Responsibilities',q:'A clearance to the circuit normally means join where?',options:['Downwind at circuit height','Always from the upwind side','Base leg if convenient','Final for a straight-in'],correct:'Downwind at circuit height'},
  {id:'6.05',section:'Pilot Responsibilities',q:'A NORDO aircraft crossing an airport to get landing information should maintain what height?',options:['Circuit height','1,000 feet above circuit height','At least 2,000 feet AGL','At least 500 feet above circuit height'],correct:'At least 500 feet above circuit height'},
  {id:'6.06',section:'Pilot Responsibilities',q:'When cleared to a left-hand circuit, what right turn may be made without further ATC approval?',options:['To final','To base','To join crosswind or partly right to downwind','To descend on downwind'],correct:'To join crosswind or partly right to downwind'},
  {id:'6.07',section:'Pilot Responsibilities',q:'If told to continue approach to a clear runway but no landing clearance follows, what should you do?',options:['Circle left','Circle in circuit direction','Land','Request landing clearance'],correct:'Request landing clearance'},
  {id:'6.08',section:'Pilot Responsibilities',q:'With an airport at 400 feet ASL, NOTAM circuit height 1,500 ASL, ceiling 1,000 overcast and visibility 3 miles, what circuit height keeps VFR in controlled airspace?',options:['500 feet below cloud base','1,500 feet ASL','1,100 feet above airport','1,000 feet above airport'],correct:'500 feet below cloud base'},
  {id:'6.09',section:'Pilot Responsibilities',q:'With ceiling 1,000 overcast and visibility 3 miles, where should a VFR aircraft cleared to the circuit join?',options:['As high as possible below cloud','500 feet below cloud base','700 feet AGL','Under Special VFR only'],correct:'500 feet below cloud base'},
  {id:'6.10',section:'Pilot Responsibilities',q:'Why might a VFR aircraft not join at the usual 1,000 feet AAE?',options:['Straight-in clearance','Different NOTAM circuit altitude','Weather requires lower circuit','Any of these'],correct:'Any of these'},
  {id:'6.11',section:'Pilot Responsibilities',q:'If ATC asks you to reduce speed on final, how should you respond?',options:['Comply while respecting safe minimum manoeuvring speed','Make a 360 degree turn','Overshoot and rejoin','Reduce far below normal approach speed'],correct:'Comply while respecting safe minimum manoeuvring speed'},
  {id:'6.12',section:'Pilot Responsibilities',q:'If cleared to land but concerned about crosswind, what should the pilot do?',options:['Use full flap and slow down','Land on another runway without asking','Overshoot and request a more into-wind runway','Land because clearance must be obeyed'],correct:'Overshoot and request a more into-wind runway'},
  {id:'6.13',section:'Pilot Responsibilities',q:'If ATC vectors a VFR flight toward cloud, who remains responsible for VFR?',options:['The radar operator','ATC because it is VFR','ATC because radar sees cloud','The pilot'],correct:'The pilot'},
  {id:'6.14',section:'Pilot Responsibilities',q:'If a student on a VFR radar vector sees lower solid overcast ahead, what should they do?',options:['Climb VFR over the top','Turn as needed to remain VFR and advise ATC','Maintain heading and altitude','Continue because ATC will handle it'],correct:'Turn as needed to remain VFR and advise ATC'},
  {id:'6.15',section:'Pilot Responsibilities',q:'On a Special VFR straight-in approach, who is responsible for avoiding a nearby obstruction?',options:['The pilot','The tower controller','ATC because Special VFR was issued','Shared equally'],correct:'The pilot'},
  {id:'6.16',section:'Pilot Responsibilities',q:'On Special VFR, who is responsible for remaining clear of cloud?',options:['The tower controller','ATC','Pilot and ATC','The pilot'],correct:'The pilot'},
  {id:'6.17',section:'Pilot Responsibilities',q:'In Class C VFR, if an assigned heading would conflict with traffic, what should the pilot do?',options:['Always change altitude','Maintain heading to comply','Turn to avoid and advise ATC','Maintain heading because ATC separates'],correct:'Turn to avoid and advise ATC'},
  {id:'6.18',section:'Pilot Responsibilities',q:'Unless told otherwise, VFR transponder code 1200 is used at or below what altitude, and what code above it?',options:['12,500 and 1400','12,500 and 1300','10,000 and 1400','10,000 and 1300'],correct:'12,500 and 1400'},
  {id:'6.19',section:'Pilot Responsibilities',q:'When should pilots activate transponder IDENT?',options:['Before entering control zones','Only when instructed by ATC','Before every altitude change','After every code change'],correct:'Only when instructed by ATC'},
  {id:'6.20',section:'Pilot Responsibilities',q:'A student pilot permit holder may act as PIC for own training under what condition?',options:['Only with an instructor onboard','Day or night with instructor authorization','By day only with supervising instructor authorization','While carrying passengers'],correct:'By day only with supervising instructor authorization'},
  {id:'6.21',section:'Pilot Responsibilities',q:'When must the PIC comply with prescribed light signals or ground markings?',options:['Only in Class C if part of clearance','Only in a control zone if instructed','At all times','At all times if safety is not jeopardized'],correct:'At all times if safety is not jeopardized'},
  {id:'6.22',section:'Pilot Responsibilities',q:'Before any VFR flight, what must the pilot do?',options:['Read weather within 100 miles only','File a flight itinerary','Be familiar with all available information appropriate to the flight','Obtain ATC clearance'],correct:'Be familiar with all available information appropriate to the flight'},
  {id:'6.23',section:'Pilot Responsibilities',q:'Where are terminal airspace dimensions and VHF sector frequencies for busy Canadian airports shown?',options:['DAH and TC AIM','VTA chart and CFS','VTA and VNC charts','CFS and VNC chart'],correct:'VTA chart and CFS'},
  {id:'7.01',section:'Wake Turbulence',q:'Who is responsible for avoiding wake turbulence?',options:['ATC only','The pilot only when ATC advises it','Pilot and ATC jointly','The pilot'],correct:'The pilot'},
  {id:'7.02',section:'Wake Turbulence',q:'In still air, hazardous wake turbulence may last how long?',options:['It dissipates immediately','It dissipates rapidly','5 minutes or more','Indefinitely'],correct:'5 minutes or more'},
  {id:'7.03',section:'Wake Turbulence',q:'Which statement about wake turbulence is most correct?',options:['Vortices move with the wind','Vortices move circularly and downward','All aircraft in flight create wake turbulence','All of these'],correct:'All of these'},
  {id:'7.04',section:'Wake Turbulence',q:'Heavy-aircraft vortices can cause a light aircraft to do what?',options:['Go out of control','Keep descending even with maximum power','Sustain structural damage','Any of these'],correct:'Any of these'},
  {id:'7.05',section:'Wake Turbulence',q:'After a heavy aircraft passes in cruise, hazardous vortices dissipate how?',options:['Completely within two minutes','Rapidly','Very slowly','They remain at cruise altitude'],correct:'Very slowly'},
  {id:'7.06',section:'Wake Turbulence',q:'A light aircraft landing close behind a heavier aircraft should plan to touch down where?',options:['Beyond the other aircraft touchdown point','Before the other aircraft touchdown point','At the same touchdown point','Beside the touchdown point'],correct:'Beyond the other aircraft touchdown point'},
  {id:'7.08',section:'Wake Turbulence',q:'Wake turbulence is produced by what aircraft?',options:['Heavy aeroplanes only','Turbojets only','Fast aeroplanes only','All fixed and rotary wing aircraft'],correct:'All fixed and rotary wing aircraft'},
  {id:'7.09',section:'Wake Turbulence',q:'Wake turbulence from a departing large aeroplane begins when?',options:['Before rotation','With rotation','After becoming airborne','At full power application'],correct:'With rotation'},
  {id:'7.10',section:'Wake Turbulence',q:'Wake turbulence from a departing aeroplane is most severe when?',options:['Before rotation','Just after takeoff','Above its flight path','After full power application'],correct:'Just after takeoff'},
  {id:'7.11',section:'Wake Turbulence',q:'Which statement about wingtip vortices is false?',options:['They settle below and behind','A light crosswind can hold one near the runway','Even no wind can put a vortex over a parallel runway','They are caused directly by jet wash'],correct:'They are caused directly by jet wash'},
  {id:'7.12',section:'Wake Turbulence',q:'Wake turbulence is greatest behind an aircraft in what condition?',options:['Heavy, landing configuration, slow','Heavy, clean configuration, slow','Light, clean, fast','Heavy, takeoff configuration, slow'],correct:'Heavy, clean configuration, slow'},
  {id:'7.13',section:'Wake Turbulence',q:'A helicopter in forward flight produces vortices that are what?',options:['Rising above it','Similar to wingtip vortices','Remaining at helicopter level','Ahead of the helicopter'],correct:'Similar to wingtip vortices'},
  {id:'7.14',section:'Wake Turbulence',q:'Which statement about helicopter vortices is correct?',options:['They are generally weak','Size and weight influence intensity','They are less intense than same-weight aeroplane vortices','Wind does not affect hover vortices'],correct:'Size and weight influence intensity'},
  {id:'7.15',section:'Wake Turbulence',q:'What can a light crosswind do to vortices from a large departing aeroplane?',options:['Keep one vortex over the runway for some time','Rapidly dissipate both vortices','Rapidly clear all vortices','Have no lateral effect'],correct:'Keep one vortex over the runway for some time'}
];

export const PSTAR_QUESTIONS: PstarQuestion[] = [
  ...TC_PSTAR_QUESTIONS,
  ...TC_PSTAR_MORE_QUESTIONS
];
