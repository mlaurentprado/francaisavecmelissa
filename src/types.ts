export type Level = 'A1' | 'A2' | 'B1' | 'C1';

export type TabType = 'flashcards' | 'quiz' | 'dictee' | 'fiches' | 'revisions' | 'portal';

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

export type PaymentStatus = 'paid' | 'pending' | 'overdue';

export interface StudentPaymentInfo {
  planName: string;
  amount: number;
  status: PaymentStatus;
  billingCycleClasses: number; // Quantidade de aulas por pacote (padrão: 4)
  completedClassesInCycle: number; // Aulas realizadas no ciclo atual (0 a billingCycleClasses)
  paymentDate?: string; // Data do pagamento ou próximo vencimento/aula (ex: "2026-10-10")
  dueDay?: number; // mantido opcional para retrocompatibilidade
  lastPaymentDate?: string;
  pixKey?: string;
}

export interface ClassScheduleRecord {
  id: string;
  studentId: string;
  studentName: string;
  originalDate: string;
  newDate?: string;
  status: 'rescheduled' | 'cancelled';
  reason?: string;
  createdAt: string;
}

export interface StudentProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  pin: string; // 4 dígitos
  level: Level;
  avatarUrl?: string;
  totalPoints: number;
  streakDays: number;
  completedWeekIds: string[];
  registeredAt: string;
  payment?: StudentPaymentInfo;
}

export interface WeeklyLessonContent {
  flashcards: Flashcard[];
  quizzes: QuizQuestion[];
  dictees: DicteeItem[];
}

export interface WeeklyModule {
  id: string;
  studentId: string; // ID do aluno específico (ex: 'std-1') ou 'ALL'
  studentName: string; // Nome do aluno (ex: 'Lucas Mendes' ou 'Todos os Alunos')
  weekNumber: number;
  title: string;
  level: Level;
  date: string;
  summaryNotes: string;
  videoUrl?: string;
  videoTitle?: string;
  pdfUrl?: string;
  pdfFileName?: string;
  pdfFileSize?: string;
  lessons: WeeklyLessonContent;
  createdAt: string;
}

export interface AuthSession {
  currentUser: StudentProfile | null;
  isTeacher: boolean;
}
