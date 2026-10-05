import {
  StudentProfile,
  WeeklyModule,
  AuthSession,
  Level,
  StudentPaymentInfo,
  ClassScheduleRecord,
} from '../types';

export interface TeacherSettings {
  pixKey: string;
  pixType: 'email' | 'cpf' | 'telefone' | 'aleatoria';
  phone: string;
}

const STORAGE_KEYS = {
  STUDENTS: 'fam_portal_students_v4',
  WEEKS: 'fam_portal_weeks_v3',
  SESSION: 'fam_portal_session_v3',
  SCHEDULES: 'fam_portal_schedules_v1',
  SETTINGS: 'fam_portal_settings_v1',
};

const DEFAULT_SETTINGS: TeacherSettings = {
  pixKey: 'melissa.prado@exemplo.com',
  pixType: 'email',
  phone: '5511999990000',
};

// Initial Mock Students with Payment & Contact data
const INITIAL_STUDENTS: StudentProfile[] = [
  {
    id: 'std-1',
    name: 'Lucas Mendes',
    email: 'lucas@exemplo.com',
    phone: '5511999991111',
    pin: '1234',
    level: 'A1',
    totalPoints: 240,
    streakDays: 4,
    completedWeekIds: ['week-1'],
    registeredAt: '2026-08-15',
    payment: {
      planName: 'Aulas VIP Individuais (Pacote 4 Aulas)',
      amount: 480,
      billingCycleClasses: 4,
      completedClassesInCycle: 1,
      paymentDate: '2026-10-10',
      status: 'paid',
      lastPaymentDate: '2026-09-10',
    },
  },
  {
    id: 'std-2',
    name: 'Juliana Castro',
    email: 'juliana@exemplo.com',
    phone: '5511999992222',
    pin: '1234',
    level: 'A2',
    totalPoints: 580,
    streakDays: 9,
    completedWeekIds: ['week-1', 'week-2'],
    registeredAt: '2026-07-10',
    payment: {
      planName: 'Conversação Particular (Pacote 4 Aulas)',
      amount: 650,
      billingCycleClasses: 4,
      completedClassesInCycle: 3,
      paymentDate: '2026-10-15',
      status: 'paid',
    },
  },
  {
    id: 'std-3',
    name: 'Camila Ribeiro',
    email: 'camila@exemplo.com',
    phone: '5511999993333',
    pin: '1234',
    level: 'B1',
    totalPoints: 890,
    streakDays: 14,
    completedWeekIds: ['week-1'],
    registeredAt: '2026-06-02',
    payment: {
      planName: 'Francês Profissional (Pacote 4 Aulas)',
      amount: 520,
      billingCycleClasses: 4,
      completedClassesInCycle: 4,
      paymentDate: '2026-10-05',
      status: 'pending',
    },
  },
];

// Initial Schedules records (Cancelled / Rescheduled)
const INITIAL_SCHEDULES: ClassScheduleRecord[] = [
  {
    id: 'sched-1',
    studentId: 'std-2',
    studentName: 'Juliana Castro',
    originalDate: '24/09 (Terça às 15h)',
    newDate: '26/09 (Quinta às 16h30)',
    status: 'rescheduled',
    reason: 'Viagem a trabalho da aluna',
    createdAt: '2026-09-22',
  },
  {
    id: 'sched-2',
    studentId: 'std-1',
    studentName: 'Lucas Mendes',
    originalDate: '21/09 (Sexta às 10h)',
    status: 'cancelled',
    reason: 'Reposição combinada para início de outubro',
    createdAt: '2026-09-20',
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
  private schedules: ClassScheduleRecord[] = [];
  private settings: TeacherSettings = DEFAULT_SETTINGS;
  private currentSession: AuthSession = { currentUser: null, isTeacher: false };

  constructor() {
    this.checkAndApplyUrlSync();
    this.loadFromStorage();
    if (typeof window !== 'undefined') {
      window.addEventListener('hashchange', () => {
        const res = this.checkAndApplyUrlSync();
        if (res.synced) {
          window.location.reload();
        }
      });
    }
  }

  private loadFromStorage() {
    if (typeof window === 'undefined') return;

    try {
      // 1. SCAN ALL POSSIBLE CANDIDATE KEYS FOR STUDENTS
      const candidateKeys = [
        'fam_portal_students_permanent',
        STORAGE_KEYS.STUDENTS,
        'fam_portal_students_v4',
        'fam_portal_students_v3',
        'fam_portal_students_v2',
        'fam_portal_students_v1',
        'fam_portal_students',
        'fam_students',
        'fam_portal_students_backup',
        'fam_students_backup',
      ];

      // Dynamically check any other key in localStorage
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && (k.toLowerCase().includes('student') || k.toLowerCase().includes('aluno')) && !candidateKeys.includes(k)) {
          candidateKeys.push(k);
        }
      }

      const allFoundStudents: StudentProfile[] = [];

      for (const k of candidateKeys) {
        const item = localStorage.getItem(k);
        if (item) {
          try {
            const parsed = JSON.parse(item);
            if (Array.isArray(parsed) && parsed.length > 0) {
              for (const s of parsed) {
                if (s && s.id && s.name) {
                  const existingIdx = allFoundStudents.findIndex((x) => x.id === s.id);
                  if (existingIdx === -1) {
                    allFoundStudents.push(s);
                  } else {
                    allFoundStudents[existingIdx] = { ...s, ...allFoundStudents[existingIdx] };
                  }
                }
              }
            }
          } catch (_) {
            // Ignore corrupted JSON keys
          }
        }
      }

      if (allFoundStudents.length > 0) {
        this.students = allFoundStudents.map((s, idx) => ({
          ...s,
          phone: s.phone || (idx === 0 ? '5511999991111' : idx === 1 ? '5511999992222' : '5511999993333'),
          payment: {
            planName: s.payment?.planName || 'Aulas VIP Individuais (Pacote 4 Aulas)',
            amount: s.payment?.amount || 480,
            billingCycleClasses: s.payment?.billingCycleClasses ?? 4,
            completedClassesInCycle: s.payment?.completedClassesInCycle ?? 0,
            paymentDate: s.payment?.paymentDate || s.payment?.lastPaymentDate || '2026-10-10',
            status: s.payment?.status || 'paid',
            lastPaymentDate: s.payment?.lastPaymentDate,
            pixKey: s.payment?.pixKey,
          },
        }));
      } else {
        this.students = INITIAL_STUDENTS;
      }

      // Re-save immediately across all permanent and legacy keys to guarantee redundancy
      this.saveStudents();

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

      const storedSchedules = localStorage.getItem(STORAGE_KEYS.SCHEDULES);
      this.schedules = storedSchedules ? JSON.parse(storedSchedules) : INITIAL_SCHEDULES;

      const storedSettings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      this.settings = storedSettings ? JSON.parse(storedSettings) : DEFAULT_SETTINGS;

      const storedSession = localStorage.getItem(STORAGE_KEYS.SESSION);
      if (storedSession) {
        this.currentSession = JSON.parse(storedSession);
      }
    } catch (e) {
      console.error('Error loading portal storage', e);
      if (this.students.length === 0) {
        this.students = INITIAL_STUDENTS;
      }
      this.weeks = INITIAL_WEEKS;
      this.schedules = INITIAL_SCHEDULES;
      this.settings = DEFAULT_SETTINGS;
    }
  }

  private saveStudents() {
    if (typeof window === 'undefined') return;
    const dataStr = JSON.stringify(this.students);
    // Write to primary permanent key
    localStorage.setItem(STORAGE_KEYS.STUDENTS, dataStr);
    // Mirror to all legacy and backup keys so no version update ever loses students
    localStorage.setItem('fam_portal_students_permanent', dataStr);
    localStorage.setItem('fam_portal_students_v4', dataStr);
    localStorage.setItem('fam_portal_students_v3', dataStr);
    localStorage.setItem('fam_portal_students_v2', dataStr);
    localStorage.setItem('fam_portal_students_backup', dataStr);
    localStorage.setItem('fam_students_backup', dataStr);
  }

  public exportStudentsData(): string {
    return JSON.stringify(this.students, null, 2);
  }

  public importStudentsData(jsonStr: string): { success: boolean; count?: number; message?: string } {
    try {
      const parsed = JSON.parse(jsonStr);
      if (!Array.isArray(parsed)) {
        return { success: false, message: 'Formato inválido. Os dados devem conter uma lista de alunos.' };
      }
      let count = 0;
      for (const s of parsed) {
        if (s && s.id && s.name) {
          const idx = this.students.findIndex((x) => x.id === s.id);
          if (idx >= 0) {
            this.students[idx] = { ...this.students[idx], ...s };
          } else {
            this.students.push(s);
          }
          count++;
        }
      }
      this.saveStudents();
      return { success: true, count };
    } catch (e: any) {
      return { success: false, message: e.message || 'Erro ao processar dados de alunos.' };
    }
  }

  public generateSyncUrl(): string {
    if (typeof window === 'undefined') return '';
    try {
      const json = JSON.stringify(this.students);
      // UTF-8 safe base64
      const b64 = btoa(encodeURIComponent(json).replace(/%([0-9A-F]{2})/g, (_, p1) => String.fromCharCode(parseInt(p1, 16))));
      const baseUrl = window.location.href.split('#')[0].split('?')[0];
      return `${baseUrl}#sync=${encodeURIComponent(b64)}`;
    } catch (e) {
      console.error('Error generating sync url', e);
      return '';
    }
  }

  public getSyncWhatsAppUrl(teacherPhone?: string): string {
    const syncUrl = this.generateSyncUrl();
    const message = `🇫🇷 *Français avec Melissa - Sincronização de Alunos*\n\nAbra este link no seu celular para carregar todos os seus alunos cadastrados com segurança:\n\n${syncUrl}`;
    const cleanPhone = (teacherPhone || this.settings.phone || '').replace(/\D/g, '');
    const phoneParam = cleanPhone ? `phone=${cleanPhone}&` : '';
    return `https://api.whatsapp.com/send?${phoneParam}text=${encodeURIComponent(message)}`;
  }

  public checkAndApplyUrlSync(): { synced: boolean; count?: number } {
    if (typeof window === 'undefined') return { synced: false };
    try {
      let b64 = '';
      if (window.location.hash && window.location.hash.includes('sync=')) {
        const parts = window.location.hash.split('sync=');
        b64 = decodeURIComponent(parts[1] || '');
      } else if (window.location.search && window.location.search.includes('sync=')) {
        const params = new URLSearchParams(window.location.search);
        b64 = params.get('sync') || '';
      }

      if (b64) {
        const decoded = decodeURIComponent(
          Array.prototype.map
            .call(atob(b64), (c: string) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
        );
        const res = this.importStudentsData(decoded);
        if (res.success) {
          // Auto login as teacher on sync
          this.currentSession = { currentUser: null, isTeacher: true };
          this.saveSession();

          // Clean url hash/query and flag sync success
          if (window.history && window.history.replaceState) {
            window.history.replaceState(null, '', window.location.pathname + '#synced=1');
          }
          return { synced: true, count: res.count };
        }
      }
    } catch (e) {
      console.warn('URL sync processing note:', e);
    }
    return { synced: false };
  }

  private saveWeeks() {
    localStorage.setItem(STORAGE_KEYS.WEEKS, JSON.stringify(this.weeks));
  }

  private saveSchedules() {
    localStorage.setItem(STORAGE_KEYS.SCHEDULES, JSON.stringify(this.schedules));
  }

  private saveSettings() {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(this.settings));
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

  public addStudent(
    student: Omit<StudentProfile, 'id' | 'totalPoints' | 'streakDays' | 'completedWeekIds' | 'registeredAt'>
  ): StudentProfile {
    const newStudent: StudentProfile = {
      ...student,
      id: `std-${Date.now()}`,
      totalPoints: 50,
      streakDays: 1,
      completedWeekIds: [],
      registeredAt: new Date().toISOString().split('T')[0],
      payment: student.payment || {
        planName: 'Aulas Particulares VIP (Pacote 4 Aulas)',
        amount: 480,
        billingCycleClasses: 4,
        completedClassesInCycle: 0,
        status: 'paid',
      },
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

  // --- PAYMENTS & CLASS CYCLE MANAGEMENT (A CADA 4 AULAS) ---

  public updateStudentPayment(studentId: string, paymentUpdates: Partial<StudentPaymentInfo>) {
    const student = this.students.find((s) => s.id === studentId);
    if (!student) return;

    const currentPayment: StudentPaymentInfo = student.payment || {
      planName: 'Aulas Particulares VIP (Pacote 4 Aulas)',
      amount: 480,
      billingCycleClasses: 4,
      completedClassesInCycle: 0,
      status: 'paid',
    };

    const updatedPayment: StudentPaymentInfo = {
      ...currentPayment,
      ...paymentUpdates,
    };

    this.updateStudent(studentId, { payment: updatedPayment });
  }

  public incrementStudentClass(studentId: string): StudentProfile | undefined {
    const student = this.students.find((s) => s.id === studentId);
    if (!student) return undefined;

    const currentPayment: StudentPaymentInfo = student.payment || {
      planName: 'Aulas Particulares VIP (Pacote 4 Aulas)',
      amount: 480,
      billingCycleClasses: 4,
      completedClassesInCycle: 0,
      status: 'paid',
    };

    const totalClasses = currentPayment.billingCycleClasses || 4;
    const nextCompleted = (currentPayment.completedClassesInCycle || 0) + 1;
    // Se completou todas as aulas do pacote, o pagamento do próximo ciclo fica pendente
    const nextStatus = nextCompleted >= totalClasses ? 'pending' : currentPayment.status;

    const updatedPayment: StudentPaymentInfo = {
      ...currentPayment,
      completedClassesInCycle: nextCompleted,
      status: nextStatus,
    };

    this.updateStudent(studentId, { payment: updatedPayment });
    return this.students.find((s) => s.id === studentId);
  }

  public decrementStudentClass(studentId: string): StudentProfile | undefined {
    const student = this.students.find((s) => s.id === studentId);
    if (!student) return undefined;

    const currentPayment: StudentPaymentInfo = student.payment || {
      planName: 'Aulas Particulares VIP (Pacote 4 Aulas)',
      amount: 480,
      billingCycleClasses: 4,
      completedClassesInCycle: 0,
      status: 'paid',
    };

    const totalClasses = currentPayment.billingCycleClasses || 4;
    const nextCompleted = Math.max(0, (currentPayment.completedClassesInCycle || 0) - 1);
    const nextStatus = nextCompleted < totalClasses && currentPayment.status === 'pending'
      ? 'paid'
      : currentPayment.status;

    const updatedPayment: StudentPaymentInfo = {
      ...currentPayment,
      completedClassesInCycle: nextCompleted,
      status: nextStatus,
    };

    this.updateStudent(studentId, { payment: updatedPayment });
    return this.students.find((s) => s.id === studentId);
  }

  public renewStudentCycle(studentId: string): StudentProfile | undefined {
    const student = this.students.find((s) => s.id === studentId);
    if (!student) return undefined;

    const currentPayment: StudentPaymentInfo = student.payment || {
      planName: 'Aulas Particulares VIP (Pacote 4 Aulas)',
      amount: 480,
      billingCycleClasses: 4,
      completedClassesInCycle: 0,
      status: 'paid',
    };

    const updatedPayment: StudentPaymentInfo = {
      ...currentPayment,
      completedClassesInCycle: 0,
      status: 'paid',
      lastPaymentDate: new Date().toISOString().split('T')[0],
    };

    this.updateStudent(studentId, { payment: updatedPayment });
    return this.students.find((s) => s.id === studentId);
  }

  // --- SCHEDULES & RESCHEDULING ---

  public getSchedules(): ClassScheduleRecord[] {
    return this.schedules;
  }

  public getSchedulesForStudent(studentId: string): ClassScheduleRecord[] {
    return this.schedules.filter((s) => s.studentId === studentId);
  }

  public addSchedule(record: Omit<ClassScheduleRecord, 'id' | 'createdAt'>): ClassScheduleRecord {
    const newRecord: ClassScheduleRecord = {
      ...record,
      id: `sched-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    this.schedules.unshift(newRecord);
    this.saveSchedules();
    return newRecord;
  }

  public deleteSchedule(id: string) {
    this.schedules = this.schedules.filter((s) => s.id !== id);
    this.saveSchedules();
  }

  // --- TEACHER SETTINGS ---

  public getTeacherSettings(): TeacherSettings {
    return this.settings;
  }

  public saveTeacherSettings(settings: TeacherSettings) {
    this.settings = settings;
    this.saveSettings();
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
      this.weeks = this.weeks.map((w) =>
        w.id === moduleData.id ? ({ ...w, ...moduleData } as WeeklyModule) : w
      );
      this.saveWeeks();
      return this.weeks.find((w) => w.id === moduleData.id)!;
    } else {
      const newModule: WeeklyModule = {
        ...moduleData,
        id: `week-${Date.now()}`,
        createdAt: new Date().toISOString().split('T')[0],
      };
      this.weeks.unshift(newModule);
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
