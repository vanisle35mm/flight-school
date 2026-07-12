import type { PracticeQuestion } from '../types';

export const ROCA_QUESTIONS: PracticeQuestion[] = [
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
