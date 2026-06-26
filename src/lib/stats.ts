import { PSTAR_QUESTIONS } from '../data/pstarQuestions';
import type { GroundSchoolData } from '../types';

const MIN_PSTAR_SCORE_QUESTIONS = 10;

export const isTaskDueSoon = (dateValue: string) => {
  if (!dateValue) return false;
  const due = new Date(`${dateValue}T23:59:59`);
  const now = new Date();
  const inThreeDays = new Date(now);
  inThreeDays.setDate(now.getDate() + 3);
  return due >= now && due <= inThreeDays;
};

export const getStats = (data: GroundSchoolData) => {
  const importedCards = data.classes.reduce((sum, session) => sum + session.flashcards.length, 0);
  const tasksRemaining = data.todos.filter((todo) => !todo.done).length;
  const completedTasks = data.todos.filter((todo) => todo.done).length;
  const scoreableAttempts = data.tcHistory.filter((entry) => typeof entry.total === 'number' && entry.total >= MIN_PSTAR_SCORE_QUESTIONS);
  const scoredQuestions = scoreableAttempts.reduce((sum, entry) => sum + (entry.total ?? 0), 0);
  const correctAnswers = scoreableAttempts.reduce((sum, entry) => sum + (entry.score ?? Math.round(((entry.percent ?? 0) / 100) * (entry.total ?? 0))), 0);
  const accuracy = scoredQuestions ? Math.round((correctAnswers / scoredQuestions) * 100) : 0;
  const latestAttempt = data.tcHistory[0] ?? null;
  return {
    classes: data.classes.length,
    cards: PSTAR_QUESTIONS.length + importedCards,
    importedCards,
    tasksRemaining,
    dueSoon: data.todos.filter((todo) => !todo.done && isTaskDueSoon(todo.dueDate)).length,
    taskPct: data.todos.length ? Math.round((completedTasks / data.todos.length) * 100) : 0,
    accuracy,
    hasAccuracy: scoredQuestions > 0,
    pstarQuestionsScored: scoredQuestions,
    pstarAttemptsScored: scoreableAttempts.length,
    latestPstarAttemptTotal: latestAttempt?.total ?? 0
  };
};
