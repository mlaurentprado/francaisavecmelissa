import { DicteeItem } from '../types';
import { DICTEE_DATA } from '../data/learningContent';

// Dictées created by the teacher at runtime (the fixed program dictées stay in the code).
const STORAGE_KEY = 'fam_teacher_dictees_v1';

const isValidDictee = (d: unknown): d is DicteeItem =>
  !!d &&
  typeof d === 'object' &&
  typeof (d as DicteeItem).id === 'string' &&
  typeof (d as DicteeItem).sentence === 'string' &&
  typeof (d as DicteeItem).translation === 'string';

function loadCustom(): DicteeItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    return Array.isArray(parsed) ? parsed.filter(isValidDictee) : [];
  } catch {
    return [];
  }
}

class DicteeService {
  private custom: DicteeItem[] = loadCustom();

  private save() {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.custom));
  }

  /** Dictées the teacher created herself. */
  getCustomDictees(): DicteeItem[] {
    return this.custom;
  }

  /** Everything the students see: fixed program dictées + the teacher's own dictées. */
  getDictees(): DicteeItem[] {
    return [...DICTEE_DATA, ...this.custom];
  }

  addDictee(data: Omit<DicteeItem, 'id'>): DicteeItem {
    const dictee: DicteeItem = { ...data, id: `td-${Date.now()}` };
    this.custom = [dictee, ...this.custom];
    this.save();
    return dictee;
  }

  updateDictee(id: string, updates: Partial<DicteeItem>) {
    this.custom = this.custom.map((d) => (d.id === id ? { ...d, ...updates } : d));
    this.save();
  }

  deleteDictee(id: string) {
    this.custom = this.custom.filter((d) => d.id !== id);
    this.save();
  }
}

export const dicteeService = new DicteeService();
