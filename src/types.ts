export type Flashcard = { question: string; answer: string };
export type FlashcardReviewStatus = 'known' | 'unknown';
export type ClassSession = { date: string; topics: string; notes: string; flashcards: Flashcard[] };
export type Todo = { text: string; done: boolean; dueDate: string };
export type GroundSchoolUser = {
  id: string;
  firstName: string;
  role: 'admin' | 'student';
  classes: ClassSession[];
  todos: Todo[];
  flashcardProgress: Record<string, FlashcardReviewStatus>;
};
export type TcHistoryEntry = {
  title?: string;
  source?: string;
  score?: number;
  total?: number;
  percent: number;
  date?: string;
  completedAt?: string;
  missed?: string[];
};
export type GroundSchoolData = {
  activeUserId: string;
  users: Record<string, GroundSchoolUser>;
  classes: ClassSession[];
  todos: Todo[];
  tcHistory: TcHistoryEntry[];
  tcMissedIds: string[];
  tcFlashcardSection: string;
  dashboardStatOrder: string[];
  dashboardTileOrder: string[];
  dashboardHiddenTiles: string[];
  flashcardProgress: Record<string, FlashcardReviewStatus>;
};
export type ViewId = 'dashboard' | 'notes' | 'flashcards' | 'tasks' | 'pstar' | 'weather' | 'import' | 'dashboardEdit' | 'users';
export type PstarQuestion = { id: string; section: string; q: string; options: string[]; correct: string };
