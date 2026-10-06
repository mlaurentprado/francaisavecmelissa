import { Flashcard } from '../types';
import { FLASHCARDS_DATA } from '../data/learningContent';

// Flashcards created by the teacher at runtime (the fixed program cards stay in the code).
const STORAGE_KEY = 'fam_teacher_flashcards_v1';

const isValidCard = (c: unknown): c is Flashcard =>
  !!c &&
  typeof c === 'object' &&
  typeof (c as Flashcard).id === 'string' &&
  typeof (c as Flashcard).french === 'string' &&
  typeof (c as Flashcard).portuguese === 'string';

function loadCustom(): Flashcard[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    return Array.isArray(parsed) ? parsed.filter(isValidCard) : [];
  } catch {
    return [];
  }
}

class FlashcardService {
  private custom: Flashcard[] = loadCustom();

  private save() {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.custom));
  }

  /** Flashcards the teacher created herself. */
  getCustomFlashcards(): Flashcard[] {
    return this.custom;
  }

  /** Everything the students see: fixed program cards + the teacher's own cards. */
  getFlashcards(): Flashcard[] {
    return [...FLASHCARDS_DATA, ...this.custom];
  }

  addFlashcard(data: Omit<Flashcard, 'id'>): Flashcard {
    const card: Flashcard = { ...data, id: `tc-${Date.now()}` };
    this.custom = [card, ...this.custom];
    this.save();
    return card;
  }

  updateFlashcard(id: string, updates: Partial<Flashcard>) {
    this.custom = this.custom.map((c) => (c.id === id ? { ...c, ...updates } : c));
    this.save();
  }

  deleteFlashcard(id: string) {
    this.custom = this.custom.filter((c) => c.id !== id);
    this.save();
  }
}

export const flashcardService = new FlashcardService();
