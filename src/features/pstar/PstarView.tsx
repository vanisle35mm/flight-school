import { RotateCcw } from 'lucide-react';
import { useMemo, useState } from 'react';
import { PSTAR_QUESTIONS } from '../../data/pstarQuestions';
import type { GroundSchoolData, PstarQuestion } from '../../types';

type PracticeReview = {
  id: string;
  section: string;
  q: string;
  chosen: string;
  correctAnswer: string;
  correct: boolean;
};

const shuffle = <T,>(items: T[]) => [...items].sort(() => Math.random() - 0.5);
const buildPracticeQuestion = (question: PstarQuestion): PstarQuestion => ({ ...question, options: shuffle(question.options) });

export const PstarView = ({ data, onDataChange }: { data: GroundSchoolData; onDataChange: (data: GroundSchoolData) => void }) => {
  const [section, setSection] = useState(data.tcFlashcardSection || 'all');
  const [questions, setQuestions] = useState<PstarQuestion[]>([]);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState('');
  const [review, setReview] = useState<PracticeReview[]>([]);
  const [mode, setMode] = useState<'setup' | 'practice' | 'exam' | 'complete'>('setup');
  const sections = useMemo(() => [...new Set(PSTAR_QUESTIONS.map((item) => item.section))].sort(), []);
  const question = questions[index];

  const startPractice = (nextMode: 'practice' | 'exam', missedOnly = false) => {
    const pool = missedOnly
      ? data.tcMissedIds.map((id) => PSTAR_QUESTIONS.find((item) => item.id === id)).filter((item): item is PstarQuestion => Boolean(item))
      : PSTAR_QUESTIONS.filter((item) => section === 'all' || item.section === section);
    if (!pool.length) return;
    const count = nextMode === 'exam' ? Math.min(50, pool.length) : Math.min(20, pool.length);
    setQuestions(shuffle(pool).slice(0, count).map(buildPracticeQuestion));
    setIndex(0);
    setScore(0);
    setSelected('');
    setReview([]);
    setMode(nextMode);
  };

  const finish = (finalReview: PracticeReview[], finalScore: number) => {
    const missed = finalReview.filter((item) => !item.correct).map((item) => item.id).filter(Boolean);
    const correctIds = finalReview.filter((item) => item.correct).map((item) => item.id);
    const missedSet = new Set(data.tcMissedIds);
    missed.forEach((id) => missedSet.add(id));
    correctIds.forEach((id) => missedSet.delete(id));
    const percent = questions.length ? Math.round((finalScore / questions.length) * 100) : 0;
    onDataChange({
      ...data,
      tcFlashcardSection: section,
      tcMissedIds: [...missedSet],
      tcHistory: [{
        date: new Date().toISOString(),
        title: mode === 'exam' ? 'TC PSTAR Exam Mode' : 'TC PSTAR Practice',
        source: `Transport Canada TP 11919 - ${section === 'all' ? 'All Sections' : section}`,
        score: finalScore,
        total: questions.length,
        percent,
        missed
      }, ...data.tcHistory].slice(0, 12)
    });
    setMode('complete');
  };

  const answer = (choice: string) => {
    if (!question || selected) return;
    const correct = choice === question.correct;
    const nextScore = score + (correct ? 1 : 0);
    const nextReview = [...review, { id: question.id, section: question.section, q: question.q, chosen: choice, correctAnswer: question.correct, correct }];
    setSelected(choice);
    setScore(nextScore);
    setReview(nextReview);
    if (mode === 'exam') {
      if (index >= questions.length - 1) finish(nextReview, nextScore);
      else {
        setSelected('');
        setIndex(index + 1);
      }
    }
  };

  const nextQuestion = () => {
    if (index >= questions.length - 1) finish(review, score);
    else {
      setSelected('');
      setIndex(index + 1);
    }
  };

  if (mode === 'setup') {
    return (
      <section className="panel practice-panel">
        <div className="panel-heading">
          <div>
            <span className="eyebrow">Transport Canada PSTAR</span>
            <h2>Practice Test</h2>
          </div>
        </div>
        <p className="status">Based on Transport Canada TP 11919. Exam mode uses up to 50 questions with a 90% pass mark.</p>
        <div className="setup-grid">
          <label className="field-card">
            Section
            <select value={section} onChange={(event) => setSection(event.target.value)}>
              <option value="all">All available sections</option>
              {sections.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
            <span>{PSTAR_QUESTIONS.length} built-in questions available.</span>
          </label>
          <div className="field-card">
            <span>Mode</span>
            <button onClick={() => startPractice('practice')}>Practice Mode</button>
            <button onClick={() => startPractice('exam')}>Exam Mode</button>
            <button disabled={!data.tcMissedIds.length} onClick={() => startPractice('practice', true)}>Missed Only ({data.tcMissedIds.length})</button>
          </div>
        </div>
        <div className="result-box">
          <h3>Recent TC Scores</h3>
          {data.tcHistory.length ? data.tcHistory.slice(0, 6).map((entry, entryIndex) => (
            <div className="history-row" key={`${entry.date}-${entryIndex}`}>
              <span>{entry.title || 'TC PSTAR Practice'}</span>
              <strong>{entry.percent}%{typeof entry.score === 'number' && typeof entry.total === 'number' ? ` (${entry.score}/${entry.total})` : ''}</strong>
            </div>
          )) : <p className="empty-state">No TC practice scores yet.</p>}
        </div>
      </section>
    );
  }

  if (mode === 'complete') {
    const percent = questions.length ? Math.round((score / questions.length) * 100) : 0;
    const missed = review.filter((item) => !item.correct);
    return (
      <section className="panel practice-panel">
        <div className="result-box">
          <h3>Score: {score}/{questions.length} ({percent}%)</h3>
          <h2>{percent >= 90 ? 'PASS' : 'REVIEW'}</h2>
          <p className="status">PSTAR pass mark: 90%.</p>
        </div>
        <div className="button-row">
          <button onClick={() => setMode('setup')}><RotateCcw size={17} /> Back to Setup</button>
          <button disabled={!missed.length} onClick={() => startPractice('practice', true)}>Practice Missed Only</button>
        </div>
        <div className="missed-list">
          <h3>Missed Questions</h3>
          {missed.length ? missed.map((item) => (
            <article className="missed-item" key={`${item.id}-${item.chosen}`}>
              <span>{item.id} - {item.section}</span>
              <strong>{item.q}</strong>
              <p>Your answer: {item.chosen}</p>
              <p>Correct answer: {item.correctAnswer}</p>
            </article>
          )) : <p className="empty-state">No missed questions on this run.</p>}
        </div>
      </section>
    );
  }

  return (
    <section className="panel practice-panel">
      <div className="panel-heading">
        <div>
          <span className="eyebrow">{mode === 'exam' ? 'Exam Mode' : 'Practice Mode'}</span>
          <h2>TC PSTAR Practice</h2>
        </div>
        <button onClick={() => setMode('setup')}>Exit</button>
      </div>
      {question && (
        <div className="question-card">
          <div className="practice-header">
            <span>Question {index + 1}/{questions.length}</span>
            <span>Score: {score}/{mode === 'exam' ? index : index + (selected ? 1 : 0)}</span>
          </div>
          <div className="progress"><div className="bar" style={{ width: `${Math.round((index / questions.length) * 100)}%` }} /></div>
          <span>{question.id} / {question.section}</span>
          <strong>{question.q}</strong>
          <div className="answer-grid">
            {question.options.map((option) => (
              <button className={selected === option ? 'answer selected' : 'answer'} disabled={Boolean(selected)} key={option} onClick={() => answer(option)}>
                {option}
              </button>
            ))}
          </div>
          {selected && mode === 'practice' && (
            <div className={selected === question.correct ? 'result correct' : 'result'}>
              {selected === question.correct ? 'Correct' : `Correct answer: ${question.correct}`}
            </div>
          )}
          {mode === 'practice' && <button disabled={!selected} onClick={nextQuestion}>Next Question</button>}
        </div>
      )}
    </section>
  );
};
