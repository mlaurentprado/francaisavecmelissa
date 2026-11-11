import { QuizQuestion } from '../types';
import { QUIZ_DATA } from '../data/learningContent';

// Quizzes created by the teacher at runtime (the fixed program questions stay in the code).
const STORAGE_KEY = 'fam_teacher_quizzes_v1';

const isValidQuiz = (q: unknown): q is QuizQuestion =>
  !!q &&
  typeof q === 'object' &&
  typeof (q as QuizQuestion).id === 'string' &&
  typeof (q as QuizQuestion).question === 'string' &&
  Array.isArray((q as QuizQuestion).options) &&
  (q as QuizQuestion).options.length > 0 &&
  typeof (q as QuizQuestion).correctIndex === 'number';

function loadCustom(): QuizQuestion[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    return Array.isArray(parsed) ? parsed.filter(isValidQuiz) : [];
  } catch {
    return [];
  }
}

class QuizService {
  private custom: QuizQuestion[] = loadCustom();

  private save() {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.custom));
  }

  /** Quizzes the teacher created herself. */
  getCustomQuizzes(): QuizQuestion[] {
    return this.custom;
  }

  /** Everything the students see: fixed program questions + the teacher's own quizzes. */
  getQuizzes(): QuizQuestion[] {
    return [...QUIZ_DATA, ...this.custom];
  }

  addQuiz(data: Omit<QuizQuestion, 'id'>): QuizQuestion {
    const quiz: QuizQuestion = { ...data, id: `tq-${Date.now()}` };
    this.custom = [quiz, ...this.custom];
    this.save();
    return quiz;
  }

  updateQuiz(id: string, updates: Partial<QuizQuestion>) {
    this.custom = this.custom.map((q) => (q.id === id ? { ...q, ...updates } : q));
    this.save();
  }

  deleteQuiz(id: string) {
    this.custom = this.custom.filter((q) => q.id !== id);
    this.save();
  }
}

export const quizService = new QuizService();
