import { Plus, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { ClassSession, GroundSchoolData } from '../../types';

const emptyClass = (): ClassSession => ({ date: '', topics: '', notes: '', flashcards: [] });

export const NotesView = ({ data, onDataChange, search }: { data: GroundSchoolData; onDataChange: (data: GroundSchoolData) => void; search: string }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [message, setMessage] = useState('');
  const activeIndex = Math.min(selectedIndex, Math.max(0, data.classes.length - 1));
  const activeClass = data.classes[activeIndex];
  const query = search.trim().toLowerCase();

  const visibleClasses = useMemo(() => data.classes
    .map((session, index) => ({ session, index }))
    .filter(({ session }) => !query || session.topics.toLowerCase().includes(query) || session.notes.toLowerCase().includes(query)), [data.classes, query]);

  const updateClass = (patch: Partial<ClassSession>) => {
    onDataChange({
      ...data,
      classes: data.classes.map((session, index) => index === activeIndex ? { ...session, ...patch } : session)
    });
  };

  const addSession = () => {
    onDataChange({ ...data, classes: [emptyClass(), ...data.classes] });
    setSelectedIndex(0);
    setMessage('New class added.');
  };

  const deleteSession = () => {
    if (!activeClass || !window.confirm('Delete this class and its imported flashcards?')) return;
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
            <h2>Lessons</h2>
          </div>
          <button onClick={addSession}><Plus size={17} /> Add</button>
        </div>
        <div className="stack-list">
          {visibleClasses.length ? visibleClasses.map(({ session, index }) => (
            <button className={index === activeIndex ? 'lesson-row active' : 'lesson-row'} key={`${session.date}-${session.topics}-${index}`} onClick={() => setSelectedIndex(index)}>
              <span className="lesson-meta"><span>{session.date || 'No date'}</span><span>{session.flashcards.length} cards</span></span>
              <strong>{session.topics || `Class ${index + 1}`}</strong>
            </button>
          )) : <p className="empty-state">No lessons match the current search.</p>}
        </div>
      </section>

      <section className="panel lesson-editor">
        {activeClass ? (
          <>
            <div className="panel-heading">
              <div>
                <span className="eyebrow">Study Notes</span>
                <h2>{activeClass.topics || 'Untitled Class'}</h2>
              </div>
              <div className="button-row">
                <button className="danger-button" onClick={deleteSession}><Trash2 size={17} /> Delete</button>
              </div>
            </div>
            <div className="form-grid">
              <label>
                Date
                <input type="date" value={activeClass.date} onChange={(event) => updateClass({ date: event.target.value })} />
              </label>
              <label>
                Topics
                <input value={activeClass.topics} onChange={(event) => updateClass({ topics: event.target.value })} placeholder="Air Law, Weather..." />
              </label>
            </div>
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
