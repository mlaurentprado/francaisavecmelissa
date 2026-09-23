import { StudentProfile, WeeklyModule, AuthSession, Level } from '../types';

const STORAGE_KEYS = {
  STUDENTS: 'fam_portal_students_v2',
  WEEKS: 'fam_portal_weeks_v2',
  SESSION: 'fam_portal_session_v2',
};

// Initial Mock Students
const INITIAL_STUDENTS: StudentProfile[] = [
  {
    id: 'std-1',
    name: 'Lucas Mendes',
    email: 'lucas@exemplo.com',
    pin: '1234',
    level: 'A1',
    totalPoints: 240,
    streakDays: 4,
    completedWeekIds: ['week-1'],
    registeredAt: '2026-08-15',
  },
  {
    id: 'std-2',
    name: 'Juliana Castro',
    email: 'juliana@exemplo.com',
    pin: '1234',
    level: 'A2',
    totalPoints: 580,
    streakDays: 9,
    completedWeekIds: ['week-1', 'week-2'],
    registeredAt: '2026-07-10',
  },
  {
    id: 'std-3',
    name: 'Camila Ribeiro',
    email: 'camila@exemplo.com',
    pin: '1234',
    level: 'B1',
    totalPoints: 890,
    streakDays: 14,
    completedWeekIds: ['week-1'],
    registeredAt: '2026-06-02',
  },
];

// Initial Weekly Modules prepared by Melissa
const INITIAL_WEEKS: WeeklyModule[] = [
  {
    id: 'week-1',
    studentId: 'std-1',
    studentName: 'Lucas Mendes',
    weekNumber: 1,
    title: 'Au Café : Commander avec élégance & Politesse',
    level: 'A1',
    date: 'Semana 1 • Setembro 2026',
    summaryNotes: `### Pontos Principais da Aula:\n- **A trinca de ouro:** Em qualquer café ou padaria na França, sempre inicie com *« Bonjour »*, use *« Je voudrais... »* (em vez de *« Je veux »*) e finalize com *« S'il vous plaît »*.\n- **A água gratuita:** A *« carafe d'eau »* é água potável da torneira servida gratuitamente por lei em todos os restaurantes.\n- **A conta:** Peça com *« L'addition, s'il vous plaît »*. O garçom não trará a conta sem você solicitar.`,
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    videoTitle: 'Gravação da Aula: Pronúncia e Diálogo no Café Parisiense',
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    pdfFileName: 'Vocabulaire_Au_Cafe_Melissa.pdf',
    pdfFileSize: '1.4 MB',
    createdAt: '2026-09-01',
    lessons: {
      flashcards: [
        {
          id: 'w1-f1',
          level: 'A1',
          category: 'Café & Restaurant',
          french: 'Je voudrais un café allongé',
          phonetic: 'ʒə vu.dʁɛ œ̃ ka.fe a.lɔ̃.ʒe',
          portuguese: 'Eu gostaria de um café americano (café coado/alongado com água quente)',
          exampleFr: 'Bonjour madame, je voudrais un café allongé et un verre d\'eau.',
          examplePt: 'Bom dia senhora, eu gostaria de um café americano e um copo de água.',
          tip: 'Na França, se você pedir apenas "un café", virá um espresso curto e forte!'
        },
        {
          id: 'w1-f2',
          level: 'A1',
          category: 'Politesse',
          french: 'L\'addition, s\'il vous plaît',
          phonetic: 'la.di.sjɔ̃ sil vu plɛ',
          portuguese: 'A conta, por favor',
          exampleFr: 'Nous avons terminé, l\'addition s\'il vous plaît.',
          examplePt: 'Terminamos, a conta por favor.',
          tip: 'Pratique a pronúncia da liaison entre "s\'il" e "vous"!'
        }
      ],
      quizzes: [
        {
          id: 'w1-q1',
          level: 'A1',
          category: 'Commander',
          question: 'Como pedir um café de forma elegante e polida com a Melissa?',
          options: [
            'Je veux un café vite.',
            'Je voudrais un café, s\'il vous plaît.',
            'Moi prendre un café.',
            'Donne-moi café.'
          ],
          correctIndex: 1,
          explanation: '"Je voudrais" usa o condicional de polidez. Soa muito natural e educado.',
          melissaTip: 'Lembre-se: Bonjour + Je voudrais + S\'il vous plaît !'
        }
      ],
      dictees: [
        {
          id: 'w1-d1',
          level: 'A1',
          sentence: 'Je voudrais un café crème et un croissant, s\'il vous plaît.',
          translation: 'Eu gostaria de um café com leite e um croissant, por favor.',
          hint: 'Acento grave no "è" de crème e apóstrofo em s\'il vous plaît.',
          difficulty: 'facile'
        }
      ]
    }
  },
  {
    id: 'week-2',
    studentId: 'std-2',
    studentName: 'Juliana Castro',
    weekNumber: 2,
    title: 'Raconter un Voyage : Passé Composé com Avoir e Être',
    level: 'A2',
    date: 'Semana 2 • Setembro 2026',
    summaryNotes: `### Pontos Principais da Aula:\n- **Os verbos com ÊTRE:** Lembrar da regra da *Maison d'Être* (verbos de movimento e mudança de estado como *aller, venir, partir, arriver, naître, mourir*).\n- **A concordância obrigatória:** Quando o auxiliar é Être, o particípio passado concorda em gênero e número com o sujeito (*Elle est allée*, *Ils sont partis*).\n- **Os verbos com AVOIR:** A grande maioria dos verbos usa AVOIR (*J'ai visité le musée*, *Nous avons mangé une crêpe*).`,
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    videoTitle: 'Gravação da Aula: Estrutura do Passé Composé na Prática',
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    pdfFileName: 'Regles_Passe_Compose_Exercices.pdf',
    pdfFileSize: '2.1 MB',
    createdAt: '2026-09-08',
    lessons: {
      flashcards: [
        {
          id: 'w2-f1',
          level: 'A2',
          category: 'Passé Composé',
          french: 'Je suis allé(e) à Paris',
          phonetic: 'ʒə sɥi.z‿a.le a pa.ʁi',
          portuguese: 'Eu fui a Paris',
          exampleFr: 'Le week-end dernier, je suis allé à Paris en train.',
          examplePt: 'No fim de semana passado, fui a Paris de trem.',
          tip: 'Verbo aller sempre pede o auxiliar Être no passado!'
        }
      ],
      quizzes: [
        {
          id: 'w2-q1',
          level: 'A2',
          category: 'Passé Composé',
          question: 'Complete com o auxiliar correto:',
          sentenceWithBlank: 'Hier soir, Marie _____ arrivée en retard à la gare.',
          options: ['a', 'est', 'va', 'était'],
          correctIndex: 1,
          explanation: 'O verbo "arriver" é de movimento e exige o auxiliar Être (Elle est arrivée). Note o "e" no final concordando com Marie!',
          melissaTip: 'Com Être, sempre confira se o sujeito é feminino ou plural para adicionar e/s!'
        }
      ],
      dictees: [
        {
          id: 'w2-d1',
          level: 'A2',
          sentence: 'Nous sommes allés en France pour les vacances.',
          translation: 'Fomos para a França nas férias.',
          hint: 'Être no plural: "sommes allés".',
          difficulty: 'moyen'
        }
      ]
    }
  }
];

class StudentPortalService {
  private students: StudentProfile[] = [];
  private weeks: WeeklyModule[] = [];
  private currentSession: AuthSession = { currentUser: null, isTeacher: false };

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    if (typeof window === 'undefined') return;

    try {
      const storedStudents = localStorage.getItem(STORAGE_KEYS.STUDENTS);
      this.students = storedStudents ? JSON.parse(storedStudents) : INITIAL_STUDENTS;

      const storedWeeks = localStorage.getItem(STORAGE_KEYS.WEEKS);
      if (storedWeeks) {
        const parsedWeeks: WeeklyModule[] = JSON.parse(storedWeeks);
        this.weeks = parsedWeeks.map((w, idx) => ({
          ...w,
          studentId: w.studentId || (idx === 0 ? 'std-1' : idx === 1 ? 'std-2' : 'ALL'),
          studentName:
            w.studentName ||
            (w.studentId === 'std-1'
              ? 'Lucas Mendes'
              : w.studentId === 'std-2'
              ? 'Juliana Castro'
              : 'Todos os Alunos'),
        }));
      } else {
        this.weeks = INITIAL_WEEKS;
      }

      const storedSession = localStorage.getItem(STORAGE_KEYS.SESSION);
      if (storedSession) {
        this.currentSession = JSON.parse(storedSession);
      }
    } catch (e) {
      console.error('Error loading portal storage', e);
      this.students = INITIAL_STUDENTS;
      this.weeks = INITIAL_WEEKS;
    }
  }

  private saveStudents() {
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(this.students));
  }

  private saveWeeks() {
    localStorage.setItem(STORAGE_KEYS.WEEKS, JSON.stringify(this.weeks));
  }

  private saveSession() {
    localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(this.currentSession));
  }

  // --- AUTHENTICATION ---

  public loginStudent(studentId: string, pin: string): { success: boolean; message?: string } {
    const student = this.students.find((s) => s.id === studentId || s.name.toLowerCase() === studentId.toLowerCase());
    if (!student) {
      return { success: false, message: 'Aluno não encontrado na lista.' };
    }

    if (student.pin !== pin) {
      return { success: false, message: 'PIN incorreto. Tente novamente ou peça ajuda à Melissa.' };
    }

    this.currentSession = { currentUser: student, isTeacher: false };
    this.saveSession();
    return { success: true };
  }

  public loginTeacher(password: string): { success: boolean; message?: string } {
    if (password === 'melissa2026' || password === 'admin' || password === 'melissa') {
      this.currentSession = { currentUser: null, isTeacher: true };
      this.saveSession();
      return { success: true };
    }
    return { success: false, message: 'Senha da professora incorreta.' };
  }

  public logout() {
    this.currentSession = { currentUser: null, isTeacher: false };
    this.saveSession();
  }

  public getCurrentSession(): AuthSession {
    return this.currentSession;
  }

  // --- STUDENTS MANAGEMENT ---

  public getStudents(): StudentProfile[] {
    return this.students;
  }

  public addStudent(student: Omit<StudentProfile, 'id' | 'totalPoints' | 'streakDays' | 'completedWeekIds' | 'registeredAt'>): StudentProfile {
    const newStudent: StudentProfile = {
      ...student,
      id: `std-${Date.now()}`,
      totalPoints: 50,
      streakDays: 1,
      completedWeekIds: [],
      registeredAt: new Date().toISOString().split('T')[0],
    };
    this.students.push(newStudent);
    this.saveStudents();
    return newStudent;
  }

  public updateStudent(id: string, updates: Partial<StudentProfile>) {
    this.students = this.students.map((s) => (s.id === id ? { ...s, ...updates } : s));
    this.saveStudents();
    if (this.currentSession.currentUser?.id === id) {
      this.currentSession.currentUser = { ...this.currentSession.currentUser, ...updates };
      this.saveSession();
    }
  }

  public deleteStudent(id: string): boolean {
    this.students = this.students.filter((s) => s.id !== id);
    this.saveStudents();
    if (this.currentSession.currentUser?.id === id) {
      this.currentSession.currentUser = null;
      this.saveSession();
    }
    return true;
  }

  // --- WEEKS MANAGEMENT (TEACHER & STUDENT) ---

  public getWeeklyModules(levelFilter?: Level): WeeklyModule[] {
    if (!levelFilter) return this.weeks;
    return this.weeks.filter((w) => w.level === levelFilter);
  }

  public getWeeklyModulesForStudent(studentId: string): WeeklyModule[] {
    return this.weeks.filter((w) => w.studentId === studentId || w.studentId === 'ALL');
  }

  public getWeeklyModuleById(id: string): WeeklyModule | undefined {
    return this.weeks.find((w) => w.id === id);
  }

  public saveWeeklyModule(moduleData: Omit<WeeklyModule, 'id' | 'createdAt'> & { id?: string }): WeeklyModule {
    if (moduleData.id) {
      // Update existing
      this.weeks = this.weeks.map((w) =>
        w.id === moduleData.id ? ({ ...w, ...moduleData } as WeeklyModule) : w
      );
      this.saveWeeks();
      return this.weeks.find((w) => w.id === moduleData.id)!;
    } else {
      // Create new
      const newModule: WeeklyModule = {
        ...moduleData,
        id: `week-${Date.now()}`,
        createdAt: new Date().toISOString().split('T')[0],
      };
      this.weeks.unshift(newModule); // newest first
      this.saveWeeks();
      return newModule;
    }
  }

  public deleteWeeklyModule(id: string) {
    this.weeks = this.weeks.filter((w) => w.id !== id);
    this.saveWeeks();
  }

  // --- PROGRESS & GAMIFICATION ---

  public completeWeekLesson(studentId: string, weekId: string, pointsEarned: number) {
    const student = this.students.find((s) => s.id === studentId);
    if (!student) return;

    const completedWeeks = new Set(student.completedWeekIds);
    completedWeeks.add(weekId);

    const updatedPoints = student.totalPoints + pointsEarned;
    const updatedStreak = student.streakDays + 1;

    this.updateStudent(studentId, {
      totalPoints: updatedPoints,
      streakDays: updatedStreak,
      completedWeekIds: Array.from(completedWeeks),
    });
  }
}

export const studentPortalService = new StudentPortalService();
