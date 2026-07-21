import type { PracticeQuestion } from '../types';

export const ROCA_SOURCE_URL = 'https://ised-isde.canada.ca/site/spectrum-management-telecommunications/en/licences-and-certificates/radiocom-information-circulars-ric/ric-21-study-guide-restricted-operator-certificate-aeronautical-qualification-roc';
export const ROCA_EXAMINER_GUIDE_URL = 'https://ised-isde.canada.ca/site/spectrum-management-telecommunications/en/licences-and-certificates/radiocom-information-circulars-ric/ric-20-guide-examiners-conducting-examinations-restricted-operator-certificate-aeronautical';

const ROCA_CORE_QUESTIONS: PracticeQuestion[] = [
  {
    id: 'ROC-1.01',
    section: 'Certificate and Exam',
    q: 'What does the ROC-A permit a holder to operate?',
    options: ['Aeronautical radio equipment', 'Aircraft engines above 250 hp', 'Private pilot licences', 'Airport lighting systems'],
    correct: 'Aeronautical radio equipment'
  },
  {
    id: 'ROC-1.02',
    section: 'Certificate and Exam',
    q: 'Who conducts the official ROC-A examination?',
    options: ['An accredited examiner', 'Any flight instructor', 'A VFR tower controller only', 'A local airport manager only'],
    correct: 'An accredited examiner'
  },
  {
    id: 'ROC-1.03',
    section: 'Certificate and Exam',
    q: 'How long is a Restricted Operator Certificate - Aeronautical valid?',
    options: ['For life', 'Two years', 'Five years', 'Until the next medical renewal'],
    correct: 'For life'
  },
  {
    id: 'ROC-1.04',
    section: 'Certificate and Exam',
    q: 'What must a candidate present at the ROC-A examination?',
    options: ['Proof of identity', 'A pilot licence', 'A medical certificate', 'A radio station licence'],
    correct: 'Proof of identity'
  },
  {
    id: 'ROC-1.05',
    section: 'Certificate and Exam',
    q: 'Which statement best describes the official ROC-A exam format?',
    options: ['It may include written, practical, and oral exercises', 'It is always an online-only exam', 'It is an open-book take-home exam', 'It is only a flight test'],
    correct: 'It may include written, practical, and oral exercises'
  },
  {
    id: 'ROC-2.01',
    section: 'Regulations',
    q: 'Which type of communication has the highest priority in the aeronautical service?',
    options: ['Distress communications', 'Meteorological messages', 'Flight regularity messages', 'Routine company dispatch'],
    correct: 'Distress communications'
  },
  {
    id: 'ROC-2.02',
    section: 'Regulations',
    q: 'Which communication priority comes immediately after distress communications?',
    options: ['Urgency communications', 'Meteorological messages', 'Radio direction-finding', 'Flight safety messages'],
    correct: 'Urgency communications'
  },
  {
    id: 'ROC-2.03',
    section: 'Regulations',
    q: 'When may a station interrupt lower-priority radio traffic?',
    options: ['When transmitting distress, urgency, or safety traffic', 'Whenever the pilot is busy', 'When making a position report', 'When asking for a radio check'],
    correct: 'When transmitting distress, urgency, or safety traffic'
  },
  {
    id: 'ROC-2.04',
    section: 'Regulations',
    q: 'What is a radio operator required to do with private communications heard on the radio?',
    options: ['Preserve their privacy', 'Repeat them to nearby aircraft', 'Write them in the journey log', 'Post them in the NOTAM system'],
    correct: 'Preserve their privacy'
  },
  {
    id: 'ROC-2.05',
    section: 'Regulations',
    q: 'Which kind of radio transmission is strictly prohibited?',
    options: ['Profane, obscene, or superfluous communication', 'Weather information', 'Flight safety messages', 'Distress messages'],
    correct: 'Profane, obscene, or superfluous communication'
  },
  {
    id: 'ROC-2.06',
    section: 'Regulations',
    q: 'Who normally controls communications between an aeronautical ground station and an aircraft?',
    options: ['The ground station', 'The newest aircraft on frequency', 'The aircraft with the strongest signal', 'Any aircraft on final'],
    correct: 'The ground station'
  },
  {
    id: 'ROC-3.01',
    section: 'Operating Procedures',
    q: 'What should an operator do before transmitting on a frequency?',
    options: ['Listen long enough to avoid harmful interference', 'Transmit a test count immediately', 'Ask all stations to stand by', 'Change to 121.5 MHz first'],
    correct: 'Listen long enough to avoid harmful interference'
  },
  {
    id: 'ROC-3.02',
    section: 'Operating Procedures',
    q: 'Which station identifier is spoken first in a normal radio call?',
    options: ['The station being called', 'The station calling', 'The nearest FSS', 'The aircraft owner'],
    correct: 'The station being called'
  },
  {
    id: 'ROC-3.03',
    section: 'Operating Procedures',
    q: 'Which phrase means the transmission is ended and a response is expected?',
    options: ['OVER', 'OUT', 'ROGER', 'WILCO'],
    correct: 'OVER'
  },
  {
    id: 'ROC-3.04',
    section: 'Operating Procedures',
    q: 'Which phrase means the conversation is ended and no response is expected?',
    options: ['OUT', 'OVER', 'STANDBY', 'READ BACK'],
    correct: 'OUT'
  },
  {
    id: 'ROC-3.05',
    section: 'Operating Procedures',
    q: 'Which phrase should be used to request that a message be repeated?',
    options: ['SAY AGAIN', 'REPEAT', 'TEN-FOUR', 'COME IN PLEASE'],
    correct: 'SAY AGAIN'
  },
  {
    id: 'ROC-3.06',
    section: 'Operating Procedures',
    q: 'What word should be spoken when an error has been made in a transmission?',
    options: ['CORRECTION', 'NEGATIVE', 'DISREGARD', 'BREAK'],
    correct: 'CORRECTION'
  },
  {
    id: 'ROC-3.07',
    section: 'Operating Procedures',
    q: 'Which phrase tells another station to proceed with its message?',
    options: ['GO AHEAD', 'MONITOR', 'ACKNOWLEDGE', 'WORDS TWICE'],
    correct: 'GO AHEAD'
  },
  {
    id: 'ROC-3.08',
    section: 'Operating Procedures',
    q: 'How long should a signal or radio check transmission normally last?',
    options: ['No more than 10 seconds', 'At least 30 seconds', 'One full minute', 'Until another station interrupts'],
    correct: 'No more than 10 seconds'
  },
  {
    id: 'ROC-3.09',
    section: 'Operating Procedures',
    q: 'On the readability scale, what does 5 mean?',
    options: ['Excellent, perfectly readable', 'Good, readable', 'Fair, readable with difficulty', 'Bad, unreadable'],
    correct: 'Excellent, perfectly readable'
  },
  {
    id: 'ROC-3.10',
    section: 'Operating Procedures',
    q: 'On the readability scale, what does 3 mean?',
    options: ['Fair, readable with difficulty', 'Poor, readable now and then', 'Good, readable', 'Excellent, perfectly readable'],
    correct: 'Fair, readable with difficulty'
  },
  {
    id: 'ROC-3.11',
    section: 'Operating Procedures',
    q: 'Which speech habit should be avoided during radiotelephone transmissions?',
    options: ['Using fillers such as er or um', 'Speaking plainly', 'Keeping a steady rate', 'Using standard phraseology'],
    correct: 'Using fillers such as er or um'
  },
  {
    id: 'ROC-4.01',
    section: 'Time, Numbers, and Phonetics',
    q: 'Which time system should normally be used in radiocommunications?',
    options: ['The 24-hour clock', 'The 12-hour clock with AM/PM', 'Local sunrise time', 'Elapsed flight time only'],
    correct: 'The 24-hour clock'
  },
  {
    id: 'ROC-4.02',
    section: 'Time, Numbers, and Phonetics',
    q: 'How is 1:45 p.m. expressed on the 24-hour clock?',
    options: ['1345', '0145', '1245', '2345'],
    correct: '1345'
  },
  {
    id: 'ROC-4.03',
    section: 'Time, Numbers, and Phonetics',
    q: 'Why is UTC/Zulu time commonly used in aviation radio work?',
    options: ['To avoid confusion between time zones', 'To avoid using numbers', 'To replace aircraft call signs', 'To mark only emergency messages'],
    correct: 'To avoid confusion between time zones'
  },
  {
    id: 'ROC-4.04',
    section: 'Time, Numbers, and Phonetics',
    q: 'What is the correct phonetic word for the letter J?',
    options: ['Juliett', 'Juliet', 'Jupiter', 'Judge'],
    correct: 'Juliett'
  },
  {
    id: 'ROC-4.05',
    section: 'Time, Numbers, and Phonetics',
    q: 'What is the correct phonetic word for the letter Q?',
    options: ['Quebec', 'Queen', 'Quick', 'Quota'],
    correct: 'Quebec'
  },
  {
    id: 'ROC-4.06',
    section: 'Time, Numbers, and Phonetics',
    q: 'How should the number 5 be pronounced in radiotelephony?',
    options: ['Fife', 'Five', 'Fiv-er', 'Fiver'],
    correct: 'Fife'
  },
  {
    id: 'ROC-4.07',
    section: 'Time, Numbers, and Phonetics',
    q: 'How should the number 9 be pronounced in radiotelephony?',
    options: ['Niner', 'Nine', 'Ninety', 'Nigh'],
    correct: 'Niner'
  },
  {
    id: 'ROC-4.08',
    section: 'Time, Numbers, and Phonetics',
    q: 'How should the frequency 121.5 normally be transmitted?',
    options: ['One two one decimal five', 'One twenty-one point five', 'Twelve fifteen', 'One two one dot five'],
    correct: 'One two one decimal five'
  },
  {
    id: 'ROC-4.09',
    section: 'Time, Numbers, and Phonetics',
    q: 'How are aircraft headings normally given?',
    options: ['As groups of three digits', 'As two digits only', 'Only as left or right turns', 'Only as compass quadrants'],
    correct: 'As groups of three digits'
  },
  {
    id: 'ROC-4.10',
    section: 'Time, Numbers, and Phonetics',
    q: 'How should whole thousands normally be transmitted?',
    options: ['Digits for the number of thousands followed by thousand', 'Every digit followed by hundred', 'As a decimal number', 'Only with flight level phraseology'],
    correct: 'Digits for the number of thousands followed by thousand'
  },
  {
    id: 'ROC-5.01',
    section: 'Call Signs',
    q: 'When should a radio station use its distinctive call sign?',
    options: ['At least on initial contact and when communication ends', 'Only after an emergency', 'Only after ATC asks for it', 'Only in controlled airspace'],
    correct: 'At least on initial contact and when communication ends'
  },
  {
    id: 'ROC-5.02',
    section: 'Call Signs',
    q: 'How should aeronautical call signs normally be spoken?',
    options: ['Phonetically', 'As quickly as possible', 'With slang abbreviations', 'Only as registration letters'],
    correct: 'Phonetically'
  },
  {
    id: 'ROC-5.03',
    section: 'Call Signs',
    q: 'What call sign format is used by Canadian private aircraft?',
    options: ['Manufacturer or type plus the last four registration letters', 'Only the owner name', 'Company name plus flight number', 'Airport name plus frequency'],
    correct: 'Manufacturer or type plus the last four registration letters'
  },
  {
    id: 'ROC-5.04',
    section: 'Call Signs',
    q: 'Which is an example of an air carrier call sign format?',
    options: ['Company name followed by flight number', 'Airport name followed by tower', 'Type only followed by altitude', 'First name followed by runway'],
    correct: 'Company name followed by flight number'
  },
  {
    id: 'ROC-5.05',
    section: 'Call Signs',
    q: 'How are aeronautical ground stations normally identified?',
    options: ['Location name plus station function if needed', 'Pilot surname plus aircraft type', 'Runway number plus wind direction', 'Aircraft registration plus frequency'],
    correct: 'Location name plus station function if needed'
  },
  {
    id: 'ROC-6.01',
    section: 'Distress Communications',
    q: 'Which condition is classified as distress?',
    options: ['Grave and imminent danger requiring immediate assistance', 'A safety concern that does not need immediate assistance', 'A routine weather update', 'A request for a radio check'],
    correct: 'Grave and imminent danger requiring immediate assistance'
  },
  {
    id: 'ROC-6.02',
    section: 'Distress Communications',
    q: 'Which spoken word is the radiotelephony distress signal?',
    options: ['MAYDAY', 'PAN PAN', 'SECURITY', 'STANDBY'],
    correct: 'MAYDAY'
  },
  {
    id: 'ROC-6.03',
    section: 'Distress Communications',
    q: 'How many times is MAYDAY spoken in the distress call?',
    options: ['Three times', 'Once', 'Twice', 'Five times'],
    correct: 'Three times'
  },
  {
    id: 'ROC-6.04',
    section: 'Distress Communications',
    q: 'What frequency should be tried if a distress call cannot be established on the frequency in use?',
    options: ['121.5 MHz', '126.7 MHz', '123.2 MHz', '118.0 MHz'],
    correct: '121.5 MHz'
  },
  {
    id: 'ROC-6.05',
    section: 'Distress Communications',
    q: 'What should stations hearing a distress call do?',
    options: ['Stop transmissions that could interfere and listen', 'Continue normal traffic', 'Change frequency immediately', 'Acknowledge before the distress message is sent'],
    correct: 'Stop transmissions that could interfere and listen'
  },
  {
    id: 'ROC-6.06',
    section: 'Distress Communications',
    q: 'What signal introduces a distress message being relayed by another station?',
    options: ['MAYDAY RELAY', 'PAN PAN RELAY', 'ROGER MAYDAY', 'SEELONCE FEENEE'],
    correct: 'MAYDAY RELAY'
  },
  {
    id: 'ROC-6.07',
    section: 'Distress Communications',
    q: 'Which expression may the station in distress use to impose radio silence?',
    options: ['SEELONCE MAYDAY', 'SEELONCE FEENEE', 'WORDS TWICE', 'ROGER NUMBER'],
    correct: 'SEELONCE MAYDAY'
  },
  {
    id: 'ROC-6.08',
    section: 'Distress Communications',
    q: 'Which expression indicates the distress situation has ended and normal working may resume?',
    options: ['SEELONCE FEENEE', 'SEELONCE MAYDAY', 'MAYDAY RELAY', 'PAN PAN'],
    correct: 'SEELONCE FEENEE'
  },
  {
    id: 'ROC-6.09',
    section: 'Distress Communications',
    q: 'What automatic emergency equipment may be activated when appropriate during a distress situation?',
    options: ['ELT', 'ATIS', 'VOR', 'Transponder only'],
    correct: 'ELT'
  },
  {
    id: 'ROC-7.01',
    section: 'Urgency Communications',
    q: 'Which condition is classified as urgency?',
    options: ['A safety concern that does not require immediate assistance', 'Grave and imminent danger needing immediate assistance', 'A routine landing clearance', 'A request for fuel prices'],
    correct: 'A safety concern that does not require immediate assistance'
  },
  {
    id: 'ROC-7.02',
    section: 'Urgency Communications',
    q: 'Which spoken signal introduces an urgency communication?',
    options: ['PAN PAN', 'MAYDAY', 'SEELONCE', 'ROGER'],
    correct: 'PAN PAN'
  },
  {
    id: 'ROC-7.03',
    section: 'Urgency Communications',
    q: 'How many times is PAN PAN normally spoken at the beginning of an urgency communication?',
    options: ['Three times', 'Once', 'Twice', 'Five times'],
    correct: 'Three times'
  },
  {
    id: 'ROC-7.04',
    section: 'Urgency Communications',
    q: 'What priority does an urgency signal have?',
    options: ['Priority over all communications except distress', 'Priority over distress', 'No priority over routine traffic', 'Priority only on the ground'],
    correct: 'Priority over all communications except distress'
  },
  {
    id: 'ROC-7.05',
    section: 'Urgency Communications',
    q: 'If an urgency signal is heard but no message follows, how long should stations continue listening before normal work may resume?',
    options: ['At least three minutes', 'Ten seconds', 'Thirty minutes', 'Until the next hour'],
    correct: 'At least three minutes'
  },
  {
    id: 'ROC-7.06',
    section: 'Urgency Communications',
    q: 'To whom should an urgency cancellation be addressed?',
    options: ['All stations', 'Only the airport manager', 'Only aircraft on final', 'Only the original pilot'],
    correct: 'All stations'
  },
  {
    id: 'ROC-8.01',
    section: 'Equipment and Frequencies',
    q: 'What should you do if a fuse has blown?',
    options: ['Correct the fault before replacing the fuse', 'Replace it with a higher-rated fuse', 'Bypass it for the flight', 'Hold it in place manually'],
    correct: 'Correct the fault before replacing the fuse'
  },
  {
    id: 'ROC-8.02',
    section: 'Equipment and Frequencies',
    q: 'Why should a fuse not be replaced with one of a higher rating?',
    options: ['It can defeat protection and create a fire hazard', 'It lowers the aircraft registration', 'It changes the aircraft call sign', 'It blocks the emergency frequency'],
    correct: 'It can defeat protection and create a fire hazard'
  },
  {
    id: 'ROC-8.03',
    section: 'Equipment and Frequencies',
    q: 'What is the primary use of 121.9825 to 123.5875 MHz in the RIC-21 frequency table?',
    options: ['General Aviation Communications', 'Aeronautical radionavigation', 'Aeronautical Operational Control Communications', 'Search and rescue satellites only'],
    correct: 'General Aviation Communications'
  },
  {
    id: 'ROC-8.04',
    section: 'Equipment and Frequencies',
    q: 'What is the primary use of 128.8125 to 132.0125 MHz in the RIC-21 frequency table?',
    options: ['Aeronautical Operational Control Communications', 'General Aviation Communications', 'Aeronautical radionavigation', 'Marine communications'],
    correct: 'Aeronautical Operational Control Communications'
  },
  {
    id: 'ROC-8.05',
    section: 'Equipment and Frequencies',
    q: 'What does a radio station licence normally specify?',
    options: ['Call sign, transmitting frequencies, and special operating conditions', 'Pilot medical category and aircraft hours', 'Runway length and circuit direction', 'Flight plan destination only'],
    correct: 'Call sign, transmitting frequencies, and special operating conditions'
  }
];

const ROCA_SCENARIO_QUESTIONS: PracticeQuestion[] = [
  {
    id: 'ROC-9.01',
    section: 'Message Handling and Readbacks',
    q: 'You receive an instruction containing a runway, heading, altitude, and transponder code. What should you do?',
    options: ['Read back the safety-critical details', 'Reply only with ROGER', 'Acknowledge with your first name', 'Wait until after takeoff to confirm'],
    correct: 'Read back the safety-critical details'
  },
  {
    id: 'ROC-9.02',
    section: 'Message Handling and Readbacks',
    q: 'A controller says "Cessna GABC, hold short runway 27." Which reply is best?',
    options: ['Holding short runway 27, Cessna GABC', 'Roger', 'Wilco out', 'Standing by runway 27'],
    correct: 'Holding short runway 27, Cessna GABC'
  },
  {
    id: 'ROC-9.03',
    section: 'Message Handling and Readbacks',
    q: 'You did not understand part of a clearance. What should you transmit?',
    options: ['Say again', 'Repeat', 'Speak slower now', 'I missed it, thanks'],
    correct: 'Say again'
  },
  {
    id: 'ROC-9.04',
    section: 'Message Handling and Readbacks',
    q: 'You read back "left turn heading 260" and ATC replies "negative, heading 360." What is your next radio action?',
    options: ['Read back the corrected heading', 'Continue with heading 260', 'Say ROGER and change frequency', 'Ask for the weather first'],
    correct: 'Read back the corrected heading'
  },
  {
    id: 'ROC-9.05',
    section: 'Message Handling and Readbacks',
    q: 'Which item should normally be included when requesting a radio check?',
    options: ['The station called, your call sign, and the words radio check', 'Your passenger count only', 'Only the words testing testing', 'Your destination and fuel endurance only'],
    correct: 'The station called, your call sign, and the words radio check'
  },
  {
    id: 'ROC-9.06',
    section: 'Message Handling and Readbacks',
    q: 'Which reply means "I have received your message, understand it, and will comply"?',
    options: ['WILCO', 'ROGER', 'OVER', 'OUT'],
    correct: 'WILCO'
  },
  {
    id: 'ROC-9.07',
    section: 'Message Handling and Readbacks',
    q: 'Which reply only means that a message was received?',
    options: ['ROGER', 'WILCO', 'AFFIRM', 'CORRECTION'],
    correct: 'ROGER'
  },
  {
    id: 'ROC-9.08',
    section: 'Message Handling and Readbacks',
    q: 'You need to separate two parts of a long message. Which proword is appropriate?',
    options: ['BREAK', 'OUT', 'ROGER', 'MAYDAY'],
    correct: 'BREAK'
  },
  {
    id: 'ROC-9.09',
    section: 'Message Handling and Readbacks',
    q: 'What does ACKNOWLEDGE mean in radiotelephony?',
    options: ['Let me know that you received and understood this message', 'Repeat every word twice', 'Cancel my last transmission', 'End all radio traffic'],
    correct: 'Let me know that you received and understood this message'
  },
  {
    id: 'ROC-9.10',
    section: 'Message Handling and Readbacks',
    q: 'What does STANDBY mean?',
    options: ['Wait and I will call you', 'Transmit immediately', 'Change frequency now', 'The conversation is finished'],
    correct: 'Wait and I will call you'
  },
  {
    id: 'ROC-10.01',
    section: 'Circuit and Aerodrome Scenarios',
    q: 'At an uncontrolled aerodrome, what is the best first call before joining the circuit?',
    options: ['State the aerodrome, your call sign, position, altitude, intentions, and aerodrome again', 'Call only your aircraft type', 'Transmit only "any traffic please advise"', 'Wait until short final'],
    correct: 'State the aerodrome, your call sign, position, altitude, intentions, and aerodrome again'
  },
  {
    id: 'ROC-10.02',
    section: 'Circuit and Aerodrome Scenarios',
    q: 'You are joining downwind at an uncontrolled airport. Which transmission is most useful?',
    options: ['Call sign, position in circuit, runway, and intentions', 'Passenger names and destination', 'Only your altitude', 'Only the runway length'],
    correct: 'Call sign, position in circuit, runway, and intentions'
  },
  {
    id: 'ROC-10.03',
    section: 'Circuit and Aerodrome Scenarios',
    q: 'Which call best fits turning final at an uncontrolled aerodrome?',
    options: ['Cessna GABC final runway 27, touch and go', 'Cessna GABC ready to copy weather', 'Tower, Cessna GABC turning now', 'Traffic, runway 27 is mine'],
    correct: 'Cessna GABC final runway 27, touch and go'
  },
  {
    id: 'ROC-10.04',
    section: 'Circuit and Aerodrome Scenarios',
    q: 'Before taxiing at an uncontrolled aerodrome, what should you normally do on the radio?',
    options: ['Broadcast your position and taxi intentions', 'Request a takeoff clearance from all aircraft', 'Transmit a MAYDAY test', 'Remain silent until airborne'],
    correct: 'Broadcast your position and taxi intentions'
  },
  {
    id: 'ROC-10.05',
    section: 'Circuit and Aerodrome Scenarios',
    q: 'You hear an aircraft report final for the same runway while you are about to enter. What is the best action?',
    options: ['Hold short and avoid conflict', 'Enter quickly before it lands', 'Switch frequencies', 'Ask the other aircraft to go around'],
    correct: 'Hold short and avoid conflict'
  },
  {
    id: 'ROC-10.06',
    section: 'Circuit and Aerodrome Scenarios',
    q: 'At a mandatory frequency aerodrome, what must you do before entering the MF area?',
    options: ['Make the required report on the mandatory frequency', 'Turn off the radio to reduce congestion', 'Call only after landing', 'Use 121.5 MHz for all reports'],
    correct: 'Make the required report on the mandatory frequency'
  },
  {
    id: 'ROC-10.07',
    section: 'Circuit and Aerodrome Scenarios',
    q: 'If a Flight Service Station provides advisory information at an MF aerodrome, what is the pilot still responsible for?',
    options: ['Maintaining separation and deciding whether it is safe to proceed', 'Obeying the advisory as an ATC clearance', 'Cancelling all position reports', 'Ignoring traffic not on frequency'],
    correct: 'Maintaining separation and deciding whether it is safe to proceed'
  },
  {
    id: 'ROC-10.08',
    section: 'Circuit and Aerodrome Scenarios',
    q: 'Which phrase should not be used as a substitute for proper position reports?',
    options: ['Any traffic please advise', 'Downwind runway 27', 'Final runway 09', 'Backtracking runway 14'],
    correct: 'Any traffic please advise'
  },
  {
    id: 'ROC-10.09',
    section: 'Circuit and Aerodrome Scenarios',
    q: 'You are backtracking on runway 09 at an uncontrolled aerodrome. What should your call include?',
    options: ['Aircraft call sign, runway, direction of movement, and intention', 'Only the word backtracking', 'Only your departure time', 'The name of your instructor only'],
    correct: 'Aircraft call sign, runway, direction of movement, and intention'
  },
  {
    id: 'ROC-10.10',
    section: 'Circuit and Aerodrome Scenarios',
    q: 'When leaving an uncontrolled aerodrome circuit, which radio information helps nearby traffic most?',
    options: ['Your call sign, departure direction, altitude or intentions', 'Your fuel burn', 'Your aircraft colour only', 'Your passenger briefing'],
    correct: 'Your call sign, departure direction, altitude or intentions'
  },
  {
    id: 'ROC-11.01',
    section: 'Controlled Airport Scenarios',
    q: 'At a controlled airport, when may you enter an active runway?',
    options: ['When ATC clears you to enter or cross', 'After broadcasting your intention only', 'When no aircraft is visible', 'After receiving the ATIS'],
    correct: 'When ATC clears you to enter or cross'
  },
  {
    id: 'ROC-11.02',
    section: 'Controlled Airport Scenarios',
    q: 'You are told "line up and wait runway 27." What should you do?',
    options: ['Enter the runway, line up, wait, and read back the instruction', 'Take off immediately', 'Hold short of the runway', 'Taxi to the ramp'],
    correct: 'Enter the runway, line up, wait, and read back the instruction'
  },
  {
    id: 'ROC-11.03',
    section: 'Controlled Airport Scenarios',
    q: 'ATC says "cleared takeoff runway 27." Which response is best?',
    options: ['Cleared takeoff runway 27, Cessna GABC', 'Roger, going now', 'Taking runway 27, over and out', 'Runway 27 copied'],
    correct: 'Cleared takeoff runway 27, Cessna GABC'
  },
  {
    id: 'ROC-11.04',
    section: 'Controlled Airport Scenarios',
    q: 'A tower clears you to land runway 09. What should be read back?',
    options: ['Landing clearance and runway', 'Only the wind direction', 'Only your altitude', 'Nothing until touchdown'],
    correct: 'Landing clearance and runway'
  },
  {
    id: 'ROC-11.05',
    section: 'Controlled Airport Scenarios',
    q: 'You are instructed to "contact Victoria Terminal 119.7." What should you do after acknowledging?',
    options: ['Change to the assigned frequency and call the new station', 'Stay on tower until leaving controlled airspace', 'Switch to 121.5 MHz', 'Turn the radio off'],
    correct: 'Change to the assigned frequency and call the new station'
  },
  {
    id: 'ROC-11.06',
    section: 'Controlled Airport Scenarios',
    q: 'What should you include on first contact with a new ATC unit after a frequency change?',
    options: ['The station called, your call sign, altitude or position, and relevant request or instruction', 'Only your destination', 'Only "with you"', 'Only your aircraft colour'],
    correct: 'The station called, your call sign, altitude or position, and relevant request or instruction'
  },
  {
    id: 'ROC-11.07',
    section: 'Controlled Airport Scenarios',
    q: 'If you cannot comply with an ATC instruction, what should you do?',
    options: ['Advise ATC as soon as possible', 'Ignore it without comment', 'Comply anyway even if unsafe', 'Change frequency'],
    correct: 'Advise ATC as soon as possible'
  },
  {
    id: 'ROC-11.08',
    section: 'Controlled Airport Scenarios',
    q: 'Which radio call is most appropriate when ready for departure at a controlled airport?',
    options: ['Tower, Cessna GABC ready for departure runway 27', 'Traffic, GABC leaving now', 'Tower, please let me go', 'Cessna GABC is rolling without clearance'],
    correct: 'Tower, Cessna GABC ready for departure runway 27'
  },
  {
    id: 'ROC-12.01',
    section: 'Distress and Urgency Scenarios',
    q: 'Your engine fails and you require immediate assistance. Which signal starts the call?',
    options: ['MAYDAY MAYDAY MAYDAY', 'PAN PAN PAN PAN PAN PAN', 'SECURITY SECURITY SECURITY', 'ROGER ROGER ROGER'],
    correct: 'MAYDAY MAYDAY MAYDAY'
  },
  {
    id: 'ROC-12.02',
    section: 'Distress and Urgency Scenarios',
    q: 'Which distress message element is most important after identifying yourself?',
    options: ['Nature of distress and assistance required', 'Passenger meal preference', 'Aircraft paint colour only', 'The airport restaurant hours'],
    correct: 'Nature of distress and assistance required'
  },
  {
    id: 'ROC-12.03',
    section: 'Distress and Urgency Scenarios',
    q: 'You smell smoke but the aircraft is still controllable and you need priority handling. Which signal is most appropriate?',
    options: ['PAN PAN', 'MAYDAY only if grave and imminent danger exists', 'ROGER', 'WORDS TWICE'],
    correct: 'PAN PAN'
  },
  {
    id: 'ROC-12.04',
    section: 'Distress and Urgency Scenarios',
    q: 'You hear MAYDAY from another aircraft. What should you avoid?',
    options: ['Transmitting routine messages that interfere', 'Listening on the frequency', 'Writing down position information', 'Being ready to relay if needed'],
    correct: 'Transmitting routine messages that interfere'
  },
  {
    id: 'ROC-12.05',
    section: 'Distress and Urgency Scenarios',
    q: 'You hear a distress call that no ground station acknowledges. What may you need to do?',
    options: ['Acknowledge or relay the distress message if able', 'Ignore it because only ATC may respond', 'Transmit a routine position report over it', 'Leave the frequency immediately'],
    correct: 'Acknowledge or relay the distress message if able'
  },
  {
    id: 'ROC-12.06',
    section: 'Distress and Urgency Scenarios',
    q: 'Which phrase cancels distress traffic restrictions when the emergency is finished?',
    options: ['SEELONCE FEENEE', 'SEELONCE MAYDAY', 'MAYDAY RELAY', 'PAN PAN CANCELLED'],
    correct: 'SEELONCE FEENEE'
  },
  {
    id: 'ROC-12.07',
    section: 'Distress and Urgency Scenarios',
    q: 'Which item belongs in a MAYDAY message?',
    options: ['Position', 'Preferred hotel', 'Credit card number', 'Flight school invoice number'],
    correct: 'Position'
  },
  {
    id: 'ROC-12.08',
    section: 'Distress and Urgency Scenarios',
    q: 'A passenger becomes seriously ill but the aircraft is not in immediate danger. Which call normally fits best?',
    options: ['PAN PAN medical urgency', 'MAYDAY for every passenger illness', 'Routine company call only', 'No radio call is allowed'],
    correct: 'PAN PAN medical urgency'
  },
  {
    id: 'ROC-13.01',
    section: 'Phraseology and Pronunciation',
    q: 'How should the aircraft registration C-GABC normally be spoken?',
    options: ['Charlie Golf Alpha Bravo Charlie', 'See dash gab-see', 'Canadian GABC', 'Charlie G A B C with letters unspoken'],
    correct: 'Charlie Golf Alpha Bravo Charlie'
  },
  {
    id: 'ROC-13.02',
    section: 'Phraseology and Pronunciation',
    q: 'How should runway 09 normally be spoken?',
    options: ['Runway zero niner', 'Runway nine', 'Runway oh nine', 'Runway ninety'],
    correct: 'Runway zero niner'
  },
  {
    id: 'ROC-13.03',
    section: 'Phraseology and Pronunciation',
    q: 'How should heading 180 normally be spoken?',
    options: ['Heading one eight zero', 'Heading one eighty', 'Heading eighteen', 'Heading south only'],
    correct: 'Heading one eight zero'
  },
  {
    id: 'ROC-13.04',
    section: 'Phraseology and Pronunciation',
    q: 'How should altitude 2,500 feet normally be spoken?',
    options: ['Two thousand five hundred feet', 'Twenty-five hundred feet only', 'Two point five feet', 'Two five zero zero decimal feet'],
    correct: 'Two thousand five hundred feet'
  },
  {
    id: 'ROC-13.05',
    section: 'Phraseology and Pronunciation',
    q: 'Which proword asks the other station to verify and confirm information?',
    options: ['CONFIRM', 'CORRECTION', 'OUT', 'MAYDAY'],
    correct: 'CONFIRM'
  },
  {
    id: 'ROC-13.06',
    section: 'Phraseology and Pronunciation',
    q: 'Which proword means "yes" in radiotelephony?',
    options: ['AFFIRM', 'ROGER', 'WILCO', 'OVER'],
    correct: 'AFFIRM'
  },
  {
    id: 'ROC-13.07',
    section: 'Phraseology and Pronunciation',
    q: 'Which proword means "no" or "permission not granted"?',
    options: ['NEGATIVE', 'CORRECTION', 'DISREGARD', 'STANDBY'],
    correct: 'NEGATIVE'
  },
  {
    id: 'ROC-13.08',
    section: 'Phraseology and Pronunciation',
    q: 'What does MONITOR mean when assigned a frequency?',
    options: ['Listen on that frequency', 'Transmit a radio check immediately', 'Cancel your clearance', 'Turn off the receiver'],
    correct: 'Listen on that frequency'
  },
  {
    id: 'ROC-13.09',
    section: 'Phraseology and Pronunciation',
    q: 'What does READ BACK mean?',
    options: ['Repeat all or part of the message back exactly enough to confirm it', 'Read your checklist aloud', 'Read the weather report silently', 'Repeat only your aircraft type'],
    correct: 'Repeat all or part of the message back exactly enough to confirm it'
  },
  {
    id: 'ROC-13.10',
    section: 'Phraseology and Pronunciation',
    q: 'Which word should be avoided for asking someone to repeat because it can be confused with artillery or emergency use?',
    options: ['Repeat', 'Say again', 'Confirm', 'Verify'],
    correct: 'Repeat'
  },
  {
    id: 'ROC-14.01',
    section: 'Weather and Information Services',
    q: 'What does ATIS provide?',
    options: ['Recorded terminal information such as weather, runway, and operational notes', 'Emergency-only radio silence instructions', 'A personal flight plan filing service only', 'A replacement for all clearances'],
    correct: 'Recorded terminal information such as weather, runway, and operational notes'
  },
  {
    id: 'ROC-14.02',
    section: 'Weather and Information Services',
    q: 'If ATIS information "Bravo" is current, why should a pilot include "with Bravo" on initial call?',
    options: ['It tells the controller the pilot has the current recorded information', 'It replaces the need for a clearance', 'It confirms the aircraft is in distress', 'It gives the aircraft priority over other traffic'],
    correct: 'It tells the controller the pilot has the current recorded information'
  },
  {
    id: 'ROC-14.03',
    section: 'Weather and Information Services',
    q: 'What is the purpose of a Flight Service Station advisory?',
    options: ['To provide information that helps the pilot make safe decisions', 'To issue takeoff clearances at every airport', 'To command aircraft like a tower in all cases', 'To replace pilot responsibility for separation'],
    correct: 'To provide information that helps the pilot make safe decisions'
  },
  {
    id: 'ROC-14.04',
    section: 'Weather and Information Services',
    q: 'Which report would be useful in a normal inbound call to an FSS at an MF aerodrome?',
    options: ['Position, altitude, intentions, and ATIS or airport information if applicable', 'Credit card number and passenger names', 'Only the word inbound', 'Only aircraft colour'],
    correct: 'Position, altitude, intentions, and ATIS or airport information if applicable'
  },
  {
    id: 'ROC-14.05',
    section: 'Weather and Information Services',
    q: 'You are unsure whether your radio transmission was readable. What should you request?',
    options: ['A radio check', 'A clearance limit', 'A MAYDAY relay', 'A shutdown instruction'],
    correct: 'A radio check'
  },
  {
    id: 'ROC-14.06',
    section: 'Weather and Information Services',
    q: 'On a radio check, what readability number means perfectly readable?',
    options: ['5', '1', '3', '9'],
    correct: '5'
  },
  {
    id: 'ROC-14.07',
    section: 'Weather and Information Services',
    q: 'On a radio check, what readability number means unreadable?',
    options: ['1', '5', '3', '0'],
    correct: '1'
  },
  {
    id: 'ROC-14.08',
    section: 'Weather and Information Services',
    q: 'What should you do if two stations transmit at the same time and the messages are blocked?',
    options: ['Wait, then retransmit clearly when the frequency is available', 'Keep transmitting louder', 'Switch to an emergency call sign', 'Assume both messages were received'],
    correct: 'Wait, then retransmit clearly when the frequency is available'
  },
  {
    id: 'ROC-15.01',
    section: 'Frequency and Equipment Scenarios',
    q: 'Before transmitting on a new frequency, what should you do first?',
    options: ['Listen to make sure you will not interfere', 'Transmit your full route immediately', 'Ask everyone to clear the frequency', 'Turn the squelch off permanently'],
    correct: 'Listen to make sure you will not interfere'
  },
  {
    id: 'ROC-15.02',
    section: 'Frequency and Equipment Scenarios',
    q: 'Which frequency is internationally recognized for aeronautical emergency use?',
    options: ['121.5 MHz', '126.7 MHz', '122.8 MHz', '118.0 MHz'],
    correct: '121.5 MHz'
  },
  {
    id: 'ROC-15.03',
    section: 'Frequency and Equipment Scenarios',
    q: 'You suspect a stuck microphone on frequency. What is the main hazard?',
    options: ['It can block other stations from transmitting or receiving important calls', 'It improves reception for nearby aircraft', 'It automatically files a flight plan', 'It changes the transponder code'],
    correct: 'It can block other stations from transmitting or receiving important calls'
  },
  {
    id: 'ROC-15.04',
    section: 'Frequency and Equipment Scenarios',
    q: 'What should you do if radio failure occurs in flight?',
    options: ['Follow applicable lost communication procedures and use available visual signals or transponder codes as appropriate', 'Continue making normal calls without checking equipment', 'Transmit only on the intercom', 'Ignore all procedures until landing'],
    correct: 'Follow applicable lost communication procedures and use available visual signals or transponder codes as appropriate'
  },
  {
    id: 'ROC-15.05',
    section: 'Frequency and Equipment Scenarios',
    q: 'What does setting the correct frequency and volume before a call help prevent?',
    options: ['Missed calls and transmissions on the wrong frequency', 'Compass deviation', 'Incorrect fuel mixture', 'Altimeter error'],
    correct: 'Missed calls and transmissions on the wrong frequency'
  },
  {
    id: 'ROC-15.06',
    section: 'Frequency and Equipment Scenarios',
    q: 'Why should radio transmissions be brief?',
    options: ['To keep the frequency available for other safety traffic', 'To avoid using the aircraft battery at all', 'To prevent the transponder from changing codes', 'To make the call sign optional'],
    correct: 'To keep the frequency available for other safety traffic'
  },
  {
    id: 'ROC-15.07',
    section: 'Frequency and Equipment Scenarios',
    q: 'Which information should you verify before making a position report?',
    options: ['Your position, altitude, call sign, and intended action', 'Only the music volume', 'Only the aircraft paint scheme', 'Only the number of passengers'],
    correct: 'Your position, altitude, call sign, and intended action'
  },
  {
    id: 'ROC-15.08',
    section: 'Frequency and Equipment Scenarios',
    q: 'What should you do if you accidentally transmit incorrect information?',
    options: ['Use CORRECTION and transmit the corrected information', 'Pretend the message was not sent', 'Say MAYDAY to get attention', 'Immediately leave the frequency'],
    correct: 'Use CORRECTION and transmit the corrected information'
  }
];

export const ROCA_QUESTIONS: PracticeQuestion[] = [
  ...ROCA_CORE_QUESTIONS,
  ...ROCA_SCENARIO_QUESTIONS
];
