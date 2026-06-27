import { Plus, Sparkles, Trash2, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { generateFlashcardsFromNotes } from '../../lib/flashcardGenerator';
import type { ClassSession, Flashcard, GroundSchoolData } from '../../types';

const emptyClass = (): ClassSession => ({ date: '', topics: '', notes: '', flashcards: [] });

export const NotesView = ({ data, onDataChange, search }: { data: GroundSchoolData; onDataChange: (data: GroundSchoolData) => void; search: string }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [message, setMessage] = useState('');
  const [draftCards, setDraftCards] = useState<Flashcard[]>([]);
  const [generatorOpen, setGeneratorOpen] = useState(false);
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

  const generateCards = () => {
    if (!activeClass?.notes.trim()) {
      setMessage('Add some lesson notes before generating cards.');
      return;
    }
    const existingQuestions = new Set(activeClass.flashcards.map((card) => card.question.toLowerCase().replace(/[^a-z0-9]/g, '')));
    const generated = generateFlashcardsFromNotes(activeClass.notes, activeClass.topics)
      .filter((card) => !existingQuestions.has(card.question.toLowerCase().replace(/[^a-z0-9]/g, '')));
    setDraftCards(generated.length ? generated : [{ question: '', answer: '' }]);
    setGeneratorOpen(true);
    setMessage(generated.length ? `${generated.length} card drafts ready.` : 'No new automatic cards found. A blank draft is ready.');
  };

  const updateDraft = (index: number, patch: Partial<Flashcard>) => {
    setDraftCards((cards) => cards.map((card, cardIndex) => cardIndex === index ? { ...card, ...patch } : card));
  };

  const saveDrafts = () => {
    if (!activeClass) return;
    const validDrafts = draftCards
      .map((card) => ({ question: card.question.trim(), answer: card.answer.trim() }))
      .filter((card) => card.question && card.answer);
    if (!validDrafts.length) {
      setMessage('Add a question and answer before saving.');
      return;
    }
    updateClass({ flashcards: [...activeClass.flashcards, ...validDrafts] });
    setDraftCards([]);
    setGeneratorOpen(false);
    setMessage(`${validDrafts.length} ${validDrafts.length === 1 ? 'card' : 'cards'} added to this lesson.`);
  };

  const closeGenerator = () => {
    setDraftCards([]);
    setGeneratorOpen(false);
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
            <button className={index === activeIndex ? 'lesson-row active' : 'lesson-row'} key={`${session.date}-${session.topics}-${index}`} onClick={() => { setSelectedIndex(index); closeGenerator(); setMessage(''); }}>
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
                <button onClick={generateCards} disabled={!activeClass.notes.trim()}><Sparkles size={17} /> Generate Cards</button>
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
            {generatorOpen && <section className="card-generator" aria-label="Generated flashcard drafts">
              <div className="card-generator-heading">
                <div><span className="eyebrow">Card Drafts</span><h3>{draftCards.length} ready to review</h3></div>
                <button className="icon-button" onClick={closeGenerator} aria-label="Close card drafts" title="Close"><X size={17} /></button>
              </div>
              <div className="card-draft-list">
                {draftCards.map((card, cardIndex) => <div className="card-draft-row" key={cardIndex}>
                  <label>Question<input value={card.question} onChange={(event) => updateDraft(cardIndex, { question: event.target.value })} placeholder="Question" /></label>
                  <label>Answer<textarea value={card.answer} onChange={(event) => updateDraft(cardIndex, { answer: event.target.value })} placeholder="Answer" /></label>
                  <button className="icon-button danger-icon" onClick={() => setDraftCards((cards) => cards.filter((_, index) => index !== cardIndex))} aria-label={`Remove card ${cardIndex + 1}`} title="Remove draft"><Trash2 size={16} /></button>
                </div>)}
              </div>
              <div className="card-generator-actions">
                <button onClick={() => setDraftCards((cards) => [...cards, { question: '', answer: '' }])}><Plus size={16} />Add Draft</button>
                <div className="button-row"><button onClick={generateCards}><Sparkles size={16} />Regenerate</button><button onClick={saveDrafts}>Add {draftCards.filter((card) => card.question.trim() && card.answer.trim()).length} Cards</button></div>
              </div>
            </section>}
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
