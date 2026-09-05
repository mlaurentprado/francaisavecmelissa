export type Level = 'A1' | 'A2' | 'B1' | 'C1';

export type TabType = 'flashcards' | 'quiz' | 'dictee' | 'fiches' | 'revisions';

export interface LevelConfig {
  id: Level;
  code: string;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  color: string;
  bgLight: string;
}

export interface Flashcard {
  id: string;
  level: Level;
  category: string;
  french: string;
  phonetic?: string;
  portuguese: string;
  exampleFr: string;
  examplePt: string;
  tip?: string;
}

export interface QuizQuestion {
  id: string;
  level: Level;
  category: string;
  question: string;
  sentenceWithBlank?: string;
  audioPrompt?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  melissaTip?: string;
}

export interface DicteeItem {
  id: string;
  level: Level;
  sentence: string;
  translation: string;
  hint: string;
  difficulty: 'facile' | 'moyen' | 'avance';
}

export interface FicheGrammaire {
  id: string;
  level: Level;
  title: string;
  summary: string;
  badge: string;
  rules: {
    rule: string;
    examples: { fr: string; pt: string }[];
  }[];
  melissaAdvice: string;
}

export interface StudentProgress {
  name: string;
  level: Level;
  knownCards: string[];
  reviewCards: string[];
  quizScores: Record<string, number>;
  completedDictees: string[];
  streakDays: number;
  totalPoints: number;
}
