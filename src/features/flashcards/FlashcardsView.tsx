import { CheckCircle2, CircleAlert, ExternalLink, Layers, RadioTower, RotateCcw, ShieldCheck, Shuffle, XCircle } from 'lucide-react';
import { useMemo, useState } from 'react';
import { PSTAR_QUESTIONS, PSTAR_SOURCE_URL } from '../../data/pstarQuestions';
import { ROCA_QUESTIONS, ROCA_SOURCE_URL } from '../../data/rocaQuestions';
import type { FlashcardReviewStatus, GroundSchoolData } from '../../types';

type StudyMode = 'all' | 'tc' | 'roca' | 'missed' | 'unknown' | 'known';
type StudyCard = {
  key: string;
  source: 'tc' | 'roca';
  label: string;
  section: string;
  question: string;
  answer: string;
  options: string[];
};

const modes: Array<{ id: StudyMode; label: string; hint: string }> = [
  { id: 'all', label: 'All Cards', hint: 'Everything' },
  { id: 'tc', label: 'PSTAR', hint: 'TP 11919' },
  { id: 'roca', label: 'ROC-A', hint: 'RIC-21' },
  { id: 'missed', label: 'Missed Cards', hint: 'Weak areas' },
  { id: 'unknown', label: 'Needs Review', hint: 'Marked hard' },
  { id: 'known', label: 'Mastered', hint: 'Marked known' }
];

const shuffleCards = <T,>(items: T[]) => [...items].sort(() => Math.random() - 0.5);
const sourceForMode = (mode: StudyMode): StudyCard['source'] | null => mode === 'tc' ? 'tc' : mode === 'roca' ? 'roca' : null;

export const FlashcardsView = ({ data, onDataChange, search }: { data: GroundSchoolData; onDataChange: (data: GroundSchoolData) => void; search: string }) => {
  const [mode, setMode] = useState<StudyMode>('all');
  const [cardIndex, setCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [section, setSection] = useState('all');
  const [shuffleToken, setShuffleToken] = useState(0);
  const [isShuffled, setIsShuffled] = useState(false);
  const missedIds = useMemo(() => new Set([
    ...data.tcMissedIds.map((id) => `tc:${id}`),
    ...data.rocaMissedIds.map((id) => `roca:${id}`)
  ]), [data.rocaMissedIds, data.tcMissedIds]);
  const query = search.trim().toLowerCase();
  const selectedSource = sourceForMode(mode);

  const baseCards = useMemo<StudyCard[]>(() => {
    const pstarCards = PSTAR_QUESTIONS.map((question) => ({
      key: `tc:${question.id}`,
      source: 'tc' as const,
      label: question.id,
      section: question.section,
      question: question.q,
      answer: question.correct,
      options: question.options
    }));
    const rocaCards = ROCA_QUESTIONS.map((question) => ({
      key: `roca:${question.id}`,
      source: 'roca' as const,
      label: question.id,
      section: question.section,
      question: question.q,
      answer: question.correct,
      options: question.options
    }));
    return [...pstarCards, ...rocaCards];
  }, []);
  const sections = useMemo(() => {
    const sourceCards = selectedSource ? baseCards.filter((card) => card.source === selectedSource) : baseCards;
    return [...new Set(sourceCards.map((card) => card.section))].sort();
  }, [baseCards, selectedSource]);

  const filteredCards = useMemo(() => {
    const filtered = baseCards.filter((card) => {
      const status = data.flashcardProgress[card.key];
      if (mode === 'tc' && card.source !== 'tc') return false;
      if (mode === 'roca' && card.source !== 'roca') return false;
      if (mode === 'missed' && !missedIds.has(card.key)) return false;
      if (mode === 'unknown' && status !== 'unknown') return false;
      if (mode === 'known' && status !== 'known') return false;
      if (section !== 'all' && card.section !== section) return false;
      if (query && !card.question.toLowerCase().includes(query) && !card.answer.toLowerCase().includes(query) && !card.section.toLowerCase().includes(query)) return false;
      return true;
    });
    return isShuffled ? shuffleCards(filtered) : filtered;
  }, [baseCards, data.flashcardProgress, isShuffled, missedIds, mode, query, section, shuffleToken]);

  const activeCardIndex = Math.min(cardIndex, Math.max(0, filteredCards.length - 1));
  const card = filteredCards[activeCardIndex];
  const officialProgressEntries = Object.entries(data.flashcardProgress).filter(([key]) => key.startsWith('tc:') || key.startsWith('roca:'));
  const knownCount = officialProgressEntries.filter(([, status]) => status === 'known').length;
  const unknownCount = officialProgressEntries.filter(([, status]) => status === 'unknown').length;
  const pstarCount = baseCards.filter((item) => item.source === 'tc').length;
  const rocaCount = baseCards.filter((item) => item.source === 'roca').length;

  const switchMode = (nextMode: StudyMode) => {
    setMode(nextMode);
    setSection('all');
    setCardIndex(0);
    setShowAnswer(false);
    setSelectedAnswer('');
  };

  const setCardStatus = (status: FlashcardReviewStatus) => {
    if (!card) return;
    onDataChange({ ...data, flashcardProgress: { ...data.flashcardProgress, [card.key]: status } });
    setShowAnswer(false);
    setSelectedAnswer('');
    setCardIndex(Math.min(filteredCards.length - 1, activeCardIndex + 1));
  };

  const clearCurrentStatus = () => {
    if (!card) return;
    const nextProgress = { ...data.flashcardProgress };
    delete nextProgress[card.key];
    onDataChange({ ...data, flashcardProgress: nextProgress });
  };

  const shuffleCurrentView = () => {
    setIsShuffled(true);
    setShuffleToken((value) => value + 1);
    setCardIndex(0);
    setShowAnswer(false);
    setSelectedAnswer('');
  };

  const moveToCard = (nextIndex: number) => {
    setCardIndex(nextIndex);
    setShowAnswer(false);
    setSelectedAnswer('');
  };

  const checkAnswer = () => {
    if (!selectedAnswer) return;
    setShowAnswer(true);
  };

  return (
    <section className="panel flashcards-panel">
      <div className="panel-heading">
        <div>
          <span className="eyebrow">Exam Question Cards</span>
          <h2>Flashcards</h2>
        </div>
        <button onClick={shuffleCurrentView}><Shuffle size={17} />Shuffle</button>
      </div>
      <p className="status">These cards are built from the same question banks used on the Testing page. PSTAR uses the Transport Canada TP 11919 bank; ROC-A is simulated from the official RIC-21 study guide.</p>
      <div className="source-strip compact" aria-label="Flashcard source details">
        <a className="source-card verified source-link" href={PSTAR_SOURCE_URL} target="_blank" rel="noreferrer">
          <ShieldCheck size={18} />
          <div><span>PSTAR</span><strong>Official-source TP 11919</strong></div>
          <ExternalLink size={15} />
        </a>
        <a className="source-card simulated source-link" href={ROCA_SOURCE_URL} target="_blank" rel="noreferrer">
          <RadioTower size={18} />
          <div><span>ROC-A</span><strong>RIC-21 simulation</strong></div>
          <ExternalLink size={15} />
        </a>
      </div>

      <div className="deck-summary">
        <div><strong>{pstarCount}</strong><span>PSTAR cards</span></div>
        <div><strong>{rocaCount}</strong><span>ROC-A cards</span></div>
        <div><strong>{knownCount}</strong><span>Mastered</span></div>
        <div><strong>{unknownCount}</strong><span>Needs review</span></div>
      </div>

      <div className="mode-tabs" role="tablist" aria-label="Flashcard study modes">
        {modes.map((item) => <button className={mode === item.id ? 'mode-tab active' : 'mode-tab'} key={item.id} onClick={() => switchMode(item.id)}><span>{item.label}</span><small>{item.hint}</small></button>)}
      </div>

      <div className="flashcard-toolbar">
        <label>
          {mode === 'roca' ? 'ROC-A Section' : mode === 'tc' ? 'PSTAR Section' : 'Section'}
          <select value={section} onChange={(event) => { setSection(event.target.value); setCardIndex(0); setShowAnswer(false); setSelectedAnswer(''); }}>
            <option value="all">All sections</option>
            {sections.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </label>
        <span className="status">{filteredCards.length} cards in this view</span>
      </div>

      {card ? (
        <>
          <div className="practice-header"><strong>Card {activeCardIndex + 1} / {filteredCards.length}</strong><span>{data.flashcardProgress[card.key] ?? 'unmarked'}</span></div>
          <div className="progress"><div className="bar" style={{ width: `${Math.round(((activeCardIndex + 1) / filteredCards.length) * 100)}%` }} /></div>
          <div className="flashcard-big">
            <span>{card.source === 'tc' ? 'PSTAR' : 'ROC-A'} / {card.label} / {card.section}</span>
            <strong>{card.question}</strong>
            <div className="flashcard-options" aria-label="Answer options">
              {card.options.map((option, index) => <button className={[
                'flashcard-option',
                selectedAnswer === option ? 'selected' : '',
                showAnswer && option === card.answer ? 'correct' : '',
                showAnswer && selectedAnswer === option && option !== card.answer ? 'incorrect' : ''
              ].filter(Boolean).join(' ')} disabled={showAnswer} key={`${card.key}-${option}`} onClick={() => setSelectedAnswer(option)} type="button">
                <span>{String.fromCharCode(65 + index)}</span>
                <p>{option}</p>
              </button>)}
            </div>
            {showAnswer ? <p className={selectedAnswer === card.answer ? 'flashcard-answer correct' : 'flashcard-answer incorrect'}><span>{selectedAnswer === card.answer ? 'Correct' : 'Review this one'}</span>Correct answer: {card.answer}</p> : <button disabled={!selectedAnswer} onClick={checkAnswer}>Check Answer</button>}
          </div>
          <div className="flash-actions flash-study-actions">
            <button onClick={() => moveToCard(Math.max(0, activeCardIndex - 1))}>Prev</button>
            <button disabled={!selectedAnswer} onClick={checkAnswer}>Reveal</button>
            <button onClick={() => setCardStatus('known')}><CheckCircle2 size={17} />Known</button>
            <button onClick={() => setCardStatus('unknown')}><CircleAlert size={17} />Needs Review</button>
            <button onClick={clearCurrentStatus}><RotateCcw size={17} />Clear</button>
            <button onClick={() => moveToCard(Math.min(filteredCards.length - 1, activeCardIndex + 1))}>Next</button>
          </div>
        </>
      ) : <div className="empty-workspace"><p className="empty-state">No cards match this view yet.</p><div className="button-row"><button onClick={() => switchMode('all')}><Layers size={17} />All Cards</button><button onClick={() => switchMode('unknown')}><XCircle size={17} />Needs Review</button></div></div>}
    </section>
  );
};
