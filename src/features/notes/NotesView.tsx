import { CalendarPlus, CheckCircle2, Plus, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { ClassSession, GroundSchoolData } from '../../types';

const currentYear = new Date().getFullYear();

const vfcSchedule: ClassSession[] = [
  { date: `${currentYear}-06-21`, topics: 'Introduction, CARs & Licensing', instructor: 'Neil Keating', club: 'Victoria Flying Club', completed: false, notes: '', flashcards: [] },
  { date: `${currentYear}-07-05`, topics: 'Aerodynamics & Theory of Flight', instructor: 'Neil Keating', club: 'Victoria Flying Club', completed: false, notes: '', flashcards: [] },
  { date: `${currentYear}-07-12`, topics: 'Airframes & Engines', instructor: 'Neil Keating', club: 'Victoria Flying Club', completed: false, notes: '', flashcards: [] },
  { date: `${currentYear}-07-19`, topics: 'Systems & Flight Instruments', instructor: 'Neil Keating', club: 'Victoria Flying Club', completed: false, notes: '', flashcards: [] },
  { date: `${currentYear}-07-26`, topics: 'Human Factors & Pilot Decision Making', instructor: 'Neil Keating', club: 'Victoria Flying Club', completed: false, notes: '', flashcards: [] },
  { date: `${currentYear}-08-02`, topics: 'Meteorology I', instructor: 'Neil Keating', club: 'Victoria Flying Club', completed: false, notes: '', flashcards: [] },
  { date: `${currentYear}-08-09`, topics: 'Meteorology II', instructor: 'Neil Keating', club: 'Victoria Flying Club', completed: false, notes: '', flashcards: [] },
  { date: `${currentYear}-08-16`, topics: 'Radio & Electronic Theory', instructor: 'Neil Keating', club: 'Victoria Flying Club', completed: false, notes: '', flashcards: [] },
  { date: `${currentYear}-08-23`, topics: 'Flight Operations & SAR', instructor: 'Neil Keating', club: 'Victoria Flying Club', completed: false, notes: '', flashcards: [] },
  { date: `${currentYear}-08-30`, topics: 'Navigation I, SAR & ROC-A', instructor: 'Neil Keating', club: 'Victoria Flying Club', completed: false, notes: '', flashcards: [] },
  { date: `${currentYear}-09-06`, topics: 'ATC, ROC-A, SAR & Review if required', instructor: 'Neil Keating', club: 'Victoria Flying Club', completed: false, notes: '', flashcards: [] }
];

const emptyClass = (defaults?: Partial<ClassSession>): ClassSession => ({
  date: '',
  topics: '',
  instructor: defaults?.instructor ?? '',
  club: defaults?.club ?? '',
  completed: false,
  notes: '',
  flashcards: []
});

const sortClasses = (classes: ClassSession[]) => [...classes].sort((a, b) => {
  if (!a.date && !b.date) return 0;
  if (!a.date) return 1;
  if (!b.date) return -1;
  return a.date.localeCompare(b.date);
});

export const NotesView = ({ data, onDataChange, search }: { data: GroundSchoolData; onDataChange: (data: GroundSchoolData) => void; search: string }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [message, setMessage] = useState('');
  const activeIndex = Math.min(selectedIndex, Math.max(0, data.classes.length - 1));
  const activeClass = data.classes[activeIndex];
  const query = search.trim().toLowerCase();
  const completedCount = data.classes.filter((session) => session.completed).length;
  const groundSchoolHours = completedCount * 8;

  const visibleClasses = useMemo(() => data.classes
    .map((session, index) => ({ session, index }))
    .filter(({ session }) => !query || session.topics.toLowerCase().includes(query) || session.notes.toLowerCase().includes(query) || (session.club ?? '').toLowerCase().includes(query) || (session.instructor ?? '').toLowerCase().includes(query)), [data.classes, query]);

  const updateClass = (patch: Partial<ClassSession>) => {
    onDataChange({
      ...data,
      classes: data.classes.map((session, index) => index === activeIndex ? { ...session, ...patch } : session)
    });
  };

  const addSession = () => {
    onDataChange({ ...data, classes: [emptyClass({ club: activeClass?.club, instructor: activeClass?.instructor }), ...data.classes] });
    setSelectedIndex(0);
    setMessage('New class added.');
  };

  const addVfcSchedule = () => {
    const existingKeys = new Set(data.classes.map((session) => `${session.date}|${session.topics.toLowerCase()}`));
    const additions = vfcSchedule.filter((session) => !existingKeys.has(`${session.date}|${session.topics.toLowerCase()}`));
    if (!additions.length) {
      setMessage('Victoria Flying Club schedule is already added.');
      return;
    }
    onDataChange({ ...data, classes: sortClasses([...data.classes, ...additions]) });
    setSelectedIndex(0);
    setMessage(`Added ${additions.length} Victoria Flying Club classes.`);
  };

  const deleteSession = () => {
    if (!activeClass || !window.confirm('Delete this class?')) return;
    onDataChange({ ...data, classes: data.classes.filter((_, index) => index !== activeIndex) });
    setSelectedIndex(Math.max(0, activeIndex - 1));
    setMessage('Class deleted.');
  };

  return (
    <div className="study-layout">
      <section className="panel class-browser">
        <div className="panel-heading">
          <div>
            <span className="eyebrow">Classes</span>
            <h2>Class Schedule</h2>
            <p>{completedCount} complete - {groundSchoolHours} hours</p>
          </div>
          <div className="button-row">
            <button onClick={addVfcSchedule}><CalendarPlus size={17} /> VFC</button>
            <button onClick={addSession}><Plus size={17} /> Add</button>
          </div>
        </div>
        <div className="stack-list">
          {visibleClasses.length ? visibleClasses.map(({ session, index }) => (
            <button className={index === activeIndex ? 'lesson-row active' : 'lesson-row'} key={`${session.date}-${session.topics}-${index}`} onClick={() => { setSelectedIndex(index); setMessage(''); }}>
              <span className="lesson-meta"><span>{session.date || 'No date'}</span>{session.completed ? <span className="lesson-complete"><CheckCircle2 size={13} />Complete</span> : <span>Planned</span>}</span>
              <strong>{session.topics || `Class ${index + 1}`}</strong>
              <small>{session.club || 'No club'}{session.instructor ? ` - ${session.instructor}` : ''}</small>
            </button>
          )) : <p className="empty-state">No lessons match the current search.</p>}
        </div>
      </section>

      <section className="panel lesson-editor">
        {activeClass ? (
          <>
            <div className="panel-heading">
              <div>
                <span className="eyebrow">Ground School Class</span>
                <h2>{activeClass.topics || 'Untitled Class'}</h2>
              </div>
              <div className="button-row">
                <button className="danger-button" onClick={deleteSession}><Trash2 size={17} /> Delete</button>
              </div>
            </div>
            <div className="form-grid">
              <label>
                Club / school
                <input value={activeClass.club ?? ''} onChange={(event) => updateClass({ club: event.target.value })} placeholder="Victoria Flying Club" />
              </label>
              <label>
                Instructor
                <input value={activeClass.instructor ?? ''} onChange={(event) => updateClass({ instructor: event.target.value })} placeholder="Instructor name" />
              </label>
              <label>
                Date
                <input type="date" value={activeClass.date} onChange={(event) => updateClass({ date: event.target.value })} />
              </label>
              <label>
                Topics
                <input value={activeClass.topics} onChange={(event) => updateClass({ topics: event.target.value })} placeholder="Air Law, Weather..." />
              </label>
            </div>
            <label className="completion-toggle">
              <input type="checkbox" checked={Boolean(activeClass.completed)} onChange={(event) => updateClass({ completed: event.target.checked })} />
              <span>Class complete</span>
              <small>Completed classes count as 8 ground-school hours.</small>
            </label>
            <label className="notes-field">
              Notes
              <textarea value={activeClass.notes} onChange={(event) => updateClass({ notes: event.target.value })} placeholder="Write lesson notes here..." />
            </label>
            {message && <p className="status">{message}</p>}
          </>
        ) : (
          <div className="empty-workspace">
            <h2>No lessons yet</h2>
            <p className="empty-state">Create a class or import your old saved lesson.</p>
            <button onClick={addSession}><Plus size={17} /> New Class</button>
          </div>
        )}
      </section>
    </div>
  );
};
