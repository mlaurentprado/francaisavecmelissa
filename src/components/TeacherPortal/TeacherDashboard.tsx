import React, { useState } from 'react';
import { WeeklyModule, StudentProfile, Level, ClassScheduleRecord, PaymentStatus } from '../../types';
import { studentPortalService, TeacherSettings } from '../../services/studentPortalService';
import { getWhatsAppPaymentReminderUrl, getWhatsAppRescheduleUrl } from '../../services/whatsapp';
import { WeekContentEditor } from './WeekContentEditor';
import { StudentProgressPanel } from './StudentProgressPanel';
import {
  GraduationCap,
  Plus,
  Edit2,
  Trash2,
  Users,
  Video,
  FileText,
  Sparkles,
  LogOut,
  Layers,
  UserPlus,
  X,
  User,
  UserCheck,
  CreditCard,
  Calendar,
  MessageCircle,
  AlertCircle,
  CheckCircle2,
  DollarSign,
  Clock,
  Settings,
  Copy,
  Check,
  RefreshCw,
  ShieldCheck,
  QrCode,
  Smartphone,
  TrendingUp,
} from 'lucide-react';

interface TeacherDashboardProps {
  onLogout: () => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ onLogout }) => {
  const [weeks, setWeeks] = useState<WeeklyModule[]>(() => studentPortalService.getWeeklyModules());
  const [students, setStudents] = useState<StudentProfile[]>(() => studentPortalService.getStudents());
  const [schedules, setSchedules] = useState<ClassScheduleRecord[]>(() => studentPortalService.getSchedules());
  const [teacherSettings, setTeacherSettings] = useState<TeacherSettings>(() =>
    studentPortalService.getTeacherSettings()
  );

  const [editingModule, setEditingModule] = useState<WeeklyModule | undefined>(undefined);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'weeks' | 'students' | 'financial'>('weeks');
  const [studentFilter, setStudentFilter] = useState<string>('ALL');

  // Per-student progress panel (session history + accumulated points)
  const [progressStudent, setProgressStudent] = useState<StudentProfile | null>(null);

  // New Student modal state
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentEmail, setNewStudentEmail] = useState('');
  const [newStudentPhone, setNewStudentPhone] = useState('');
  const [newStudentPin, setNewStudentPin] = useState('1234');
  const [newStudentLevel, setNewStudentLevel] = useState<Level>('A1');
  const [newStudentPlan, setNewStudentPlan] = useState('Aulas Particulares VIP');
  const [newStudentAmount, setNewStudentAmount] = useState(480);
  const [newStudentBillingCycle, setNewStudentBillingCycle] = useState(4);
  const [newStudentCompletedClasses, setNewStudentCompletedClasses] = useState(0);

  // Reschedule / Cancellation Modal State
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [schedStudentId, setSchedStudentId] = useState(students[0]?.id || '');
  const [schedOriginalDate, setSchedOriginalDate] = useState('');
  const [schedNewDate, setSchedNewDate] = useState('');
  const [schedStatus, setSchedStatus] = useState<'rescheduled' | 'cancelled'>('rescheduled');
  const [schedReason, setSchedReason] = useState('');

  // Edit Payment Modal State
  const [editingPaymentStudent, setEditingPaymentStudent] = useState<StudentProfile | null>(null);
  const [editPlanName, setEditPlanName] = useState('');
  const [editAmount, setEditAmount] = useState(480);
  const [editBillingCycle, setEditBillingCycle] = useState(4);
  const [editCompletedClasses, setEditCompletedClasses] = useState(0);
  const [editPaymentDate, setEditPaymentDate] = useState('2026-10-10');
  const [editStatus, setEditStatus] = useState<PaymentStatus>('paid');

  // Quick Edit Modal State (amount, date, classes)
  const [quickEditStudent, setQuickEditStudent] = useState<StudentProfile | null>(null);
  const [quickEditType, setQuickEditType] = useState<'amount' | 'date' | 'classes' | null>(null);
  const [quickEditAmount, setQuickEditAmount] = useState(480);
  const [quickEditDate, setQuickEditDate] = useState('');
  const [quickEditClasses, setQuickEditClasses] = useState(0);

  // Backup / Sync Modal State
  const [isBackupModalOpen, setIsBackupModalOpen] = useState(false);
  const [backupCodeText, setBackupCodeText] = useState('');
  const [backupStatusMessage, setBackupStatusMessage] = useState<string | null>(null);
  const [copiedBackup, setCopiedBackup] = useState(false);
  const [copiedSyncUrl, setCopiedSyncUrl] = useState(false);

  // Teacher PIX Settings Modal State
  const [isPixSettingsOpen, setIsPixSettingsOpen] = useState(false);
  const [settingsPixKey, setSettingsPixKey] = useState(teacherSettings.pixKey);
  const [settingsPhone, setSettingsPhone] = useState(teacherSettings.phone);
  const [copiedPix, setCopiedPix] = useState(false);

  // --- WEEKS HANDLERS ---
  const handleSaveWeek = (moduleData: Omit<WeeklyModule, 'id' | 'createdAt'> & { id?: string }) => {
    studentPortalService.saveWeeklyModule(moduleData);
    setWeeks(studentPortalService.getWeeklyModules());
    setIsEditorOpen(false);
    setEditingModule(undefined);
  };

  const handleDeleteWeek = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este resumo semanal?')) {
      studentPortalService.deleteWeeklyModule(id);
      setWeeks(studentPortalService.getWeeklyModules());
    }
  };

  // --- STUDENTS HANDLERS ---
  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName.trim()) return;

    studentPortalService.addStudent({
      name: newStudentName.trim(),
      email: newStudentEmail.trim() || `${newStudentName.toLowerCase().replace(/\s+/g, '')}@aluno.com`,
      phone: newStudentPhone.trim() || undefined,
      pin: newStudentPin.trim() || '1234',
      level: newStudentLevel,
      payment: {
        planName: newStudentPlan,
        amount: Number(newStudentAmount) || 480,
        billingCycleClasses: Number(newStudentBillingCycle) || 4,
        completedClassesInCycle: Number(newStudentCompletedClasses) || 0,
        status: 'paid',
      },
    });

    setStudents(studentPortalService.getStudents());
    setIsAddStudentOpen(false);
    setNewStudentName('');
    setNewStudentEmail('');
    setNewStudentPhone('');
    setNewStudentPin('1234');
    setNewStudentBillingCycle(4);
    setNewStudentCompletedClasses(0);
  };

  const handleDeleteStudent = (student: StudentProfile) => {
    const studentWeeksCount = weeks.filter((w) => w.studentId === student.id).length;
    const warningMsg =
      studentWeeksCount > 0
        ? `Deseja realmente retirar "${student.name}" da lista de alunos?\n\nEste aluno possui ${studentWeeksCount} aula(s) associada(s). O cadastro do aluno será removido e ele não conseguirá mais entrar com seu PIN.`
        : `Deseja realmente retirar "${student.name}" da lista de alunos?`;

    if (confirm(warningMsg)) {
      studentPortalService.deleteStudent(student.id);
      setStudents(studentPortalService.getStudents());
      if (studentFilter === student.id) {
        setStudentFilter('ALL');
      }
    }
  };

  // --- FINANCIAL & CLASS CYCLE HANDLERS ---
  const handleTogglePaymentStatus = (studentId: string, currentStatus: PaymentStatus) => {
    const nextStatus: PaymentStatus =
      currentStatus === 'paid' ? 'pending' : currentStatus === 'pending' ? 'overdue' : 'paid';

    studentPortalService.updateStudentPayment(studentId, { status: nextStatus });
    setStudents(studentPortalService.getStudents());
  };

  const handleRenewCycle = (studentId: string) => {
    studentPortalService.renewStudentCycle(studentId);
    setStudents(studentPortalService.getStudents());
  };

  const formatDisplayDate = (d?: string) => {
    if (!d) return 'Definir data';
    try {
      const [year, month, day] = d.split('-');
      if (year && month && day) {
        return `${day}/${month}/${year}`;
      }
      return d;
    } catch (_) {
      return d;
    }
  };

  const handleOpenQuickEdit = (student: StudentProfile, type: 'amount' | 'date' | 'classes') => {
    setQuickEditStudent(student);
    setQuickEditType(type);
    setQuickEditAmount(student.payment?.amount || 480);
    setQuickEditDate(student.payment?.paymentDate || student.payment?.lastPaymentDate || new Date().toISOString().split('T')[0]);
    setQuickEditClasses(student.payment?.completedClassesInCycle || 0);
  };

  const handleSaveQuickEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickEditStudent || !quickEditType) return;

    if (quickEditType === 'amount') {
      studentPortalService.updateStudentPayment(quickEditStudent.id, {
        amount: Number(quickEditAmount) || 480,
      });
    } else if (quickEditType === 'date') {
      studentPortalService.updateStudentPayment(quickEditStudent.id, {
        paymentDate: quickEditDate || new Date().toISOString().split('T')[0],
      });
    } else if (quickEditType === 'classes') {
      const totalClasses = quickEditStudent.payment?.billingCycleClasses || 4;
      const completed = Number(quickEditClasses) || 0;
      const status = completed >= totalClasses ? 'pending' : (quickEditStudent.payment?.status || 'paid');
      studentPortalService.updateStudentPayment(quickEditStudent.id, {
        completedClassesInCycle: completed,
        status,
      });
    }

    setStudents(studentPortalService.getStudents());
    setQuickEditStudent(null);
    setQuickEditType(null);
  };

  const handleOpenBackup = () => {
    setIsBackupModalOpen(true);
    setBackupCodeText(studentPortalService.exportStudentsData());
    setBackupStatusMessage(null);
  };

  const handleCopyBackup = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(backupCodeText);
      setCopiedBackup(true);
      setTimeout(() => setCopiedBackup(false), 2500);
    }
  };

  const handleCopySyncUrl = () => {
    const url = studentPortalService.generateSyncUrl();
    if (navigator.clipboard && url) {
      navigator.clipboard.writeText(url);
      setCopiedSyncUrl(true);
      setTimeout(() => setCopiedSyncUrl(false), 2500);
    }
  };

  const handleImportBackup = () => {
    if (!backupCodeText.trim()) return;
    const result = studentPortalService.importStudentsData(backupCodeText.trim());
    if (result.success) {
      setStudents(studentPortalService.getStudents());
      setBackupStatusMessage(`✅ Sucesso! ${result.count || 0} alunos salvos e sincronizados com perfeição.`);
    } else {
      setBackupStatusMessage(`❌ Erro: ${result.message}`);
    }
  };

  const handleOpenEditPayment = (student: StudentProfile) => {
    setEditingPaymentStudent(student);
    setEditPlanName(student.payment?.planName || 'Aulas Particulares VIP (Pacote 4 Aulas)');
    setEditAmount(student.payment?.amount || 480);
    setEditBillingCycle(student.payment?.billingCycleClasses || 4);
    setEditCompletedClasses(student.payment?.completedClassesInCycle || 0);
    setEditPaymentDate(student.payment?.paymentDate || student.payment?.lastPaymentDate || new Date().toISOString().split('T')[0]);
    setEditStatus(student.payment?.status || 'paid');
  };

  const handleSavePaymentEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPaymentStudent) return;

    studentPortalService.updateStudentPayment(editingPaymentStudent.id, {
      planName: editPlanName,
      amount: Number(editAmount),
      billingCycleClasses: Number(editBillingCycle) || 4,
      completedClassesInCycle: Number(editCompletedClasses) || 0,
      paymentDate: editPaymentDate,
      status: editStatus,
    });

    setStudents(studentPortalService.getStudents());
    setEditingPaymentStudent(null);
  };

  // --- SCHEDULES & REMARCAÇÕES HANDLERS ---
  const handleAddSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    const student = students.find((s) => s.id === schedStudentId);
    if (!student || !schedOriginalDate.trim()) return;

    const newRecord = studentPortalService.addSchedule({
      studentId: student.id,
      studentName: student.name,
      originalDate: schedOriginalDate.trim(),
      newDate: schedStatus === 'rescheduled' ? schedNewDate.trim() || undefined : undefined,
      status: schedStatus,
      reason: schedReason.trim() || undefined,
    });

    setSchedules(studentPortalService.getSchedules());
    setIsScheduleModalOpen(false);

    // Perguntar se quer abrir o WhatsApp imediatamente
    if (confirm(`Remarcação salva! Deseja abrir o WhatsApp para avisar ${student.name.split(' ')[0]} agora?`)) {
      window.open(getWhatsAppRescheduleUrl(student, newRecord), '_blank');
    }

    setSchedOriginalDate('');
    setSchedNewDate('');
    setSchedReason('');
  };

  const handleDeleteSchedule = (id: string) => {
    if (confirm('Deseja retirar este registro de aula cancelada/remarcada?')) {
      studentPortalService.deleteSchedule(id);
      setSchedules(studentPortalService.getSchedules());
    }
  };

  // --- PIX SETTINGS HANDLERS ---
  const handleSavePixSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: TeacherSettings = {
      ...teacherSettings,
      pixKey: settingsPixKey.trim() || 'melissa.prado@exemplo.com',
      phone: settingsPhone.trim() || '5511999990000',
    };
    studentPortalService.saveTeacherSettings(updated);
    setTeacherSettings(updated);
    setIsPixSettingsOpen(false);
  };

  const handleCopyPix = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(teacherSettings.pixKey);
      setCopiedPix(true);
      setTimeout(() => setCopiedPix(false), 2500);
    }
  };

  // Cálculos Financeiros
  const totalPaid = students
    .filter((s) => s.payment?.status === 'paid')
    .reduce((acc, s) => acc + (s.payment?.amount || 0), 0);

  const totalPending = students
    .filter((s) => s.payment?.status === 'pending')
    .reduce((acc, s) => acc + (s.payment?.amount || 0), 0);

  const totalOverdue = students
    .filter((s) => s.payment?.status === 'overdue')
    .reduce((acc, s) => acc + (s.payment?.amount || 0), 0);

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fadeIn text-left">
      {/* Teacher Welcome Header */}
      <div className="bg-linear-to-r from-[#0F1E36] to-[#1E293B] text-white rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-[#D4AF37] border border-white/10">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Painel de Gestão da Professora</span>
            </div>
            <h2 className="font-cormorant text-2xl sm:text-3xl font-bold tracking-tight">
              Bonjour, Melissa ! ✦
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Gerencie os resumos semanais de aula, acompanhe pagamentos, remarcações e o progresso dos seus alunos.
            </p>
          </div>

          <button
            type="button"
            onClick={onLogout}
            className="self-start sm:self-auto flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-colors border border-white/10"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sair do Painel</span>
          </button>
        </div>
      </div>

      {/* Main Tabs: Semanas vs Alunos vs Financeiro */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#EBE4D8] pb-4 gap-4">
        <div className="flex items-center gap-2 bg-[#FAF7F2] p-1.5 rounded-2xl border border-[#EBE4D8] text-xs font-semibold overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveTab('weeks')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'weeks'
                ? 'bg-[#8B2626] text-white shadow-2xs'
                : 'text-[#5A6578] hover:text-[#0F172A]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Resumos Semanais ({weeks.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('students')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'students'
                ? 'bg-[#8B2626] text-white shadow-2xs'
                : 'text-[#5A6578] hover:text-[#0F172A]'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Meus Alunos ({students.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('financial')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'financial'
                ? 'bg-[#8B2626] text-white shadow-2xs'
                : 'text-[#5A6578] hover:text-[#0F172A]'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Financeiro & Agenda</span>
            {totalOverdue > 0 && (
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" title="Há mensalidades atrasadas"></span>
            )}
          </button>
        </div>

        {/* Tab Specific Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          {activeTab === 'weeks' && (
            <button
              type="button"
              onClick={() => {
                setEditingModule(undefined);
                setIsEditorOpen(true);
              }}
              className="py-2.5 px-4 rounded-xl bg-[#8B2626] hover:bg-[#731E1E] text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Nova Semana de Aula</span>
            </button>
          )}

          {activeTab === 'students' && (
            <button
              type="button"
              onClick={() => setIsAddStudentOpen(true)}
              className="py-2.5 px-4 rounded-xl bg-[#8B2626] hover:bg-[#731E1E] text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1.5"
            >
              <UserPlus className="w-4 h-4" />
              <span>+ Cadastrar Aluno</span>
            </button>
          )}

          {activeTab === 'financial' && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsScheduleModalOpen(true)}
                className="py-2.5 px-4 rounded-xl bg-[#FAF7F2] hover:bg-[#F4EFE6] border border-[#DDD3C1] text-[#78644E] font-bold text-xs shadow-2xs transition-all flex items-center gap-1.5"
              >
                <Calendar className="w-4 h-4 text-[#8B2626]" />
                <span>+ Remarcar Aula</span>
              </button>

              <button
                type="button"
                onClick={() => setIsPixSettingsOpen(true)}
                className="p-2.5 rounded-xl border border-[#D4C8B8] hover:bg-[#FAF7F2] text-[#78644E] transition-colors"
                title="Configurações de PIX e WhatsApp"
              >
                <Settings className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* TAB 1: WEEKS LIST */}
      {activeTab === 'weeks' && (
        <div className="space-y-4">
          {/* Student Filter Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#FAF7F2] p-3.5 rounded-2xl border border-[#EBE4D8]">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#0F172A]">
              <UserCheck className="w-4 h-4 text-[#8B2626]" />
              <span>Filtrar por aluno:</span>
              <select
                value={studentFilter}
                onChange={(e) => setStudentFilter(e.target.value)}
                className="p-1.5 px-3 rounded-xl border border-[#D4C8B8] bg-white text-xs font-bold text-[#0F172A] outline-none"
              >
                <option value="ALL">Todos os Alunos ({weeks.length} aulas)</option>
                {students.map((std) => {
                  const count = weeks.filter((w) => w.studentId === std.id).length;
                  return (
                    <option key={std.id} value={std.id}>
                      {std.name} ({count} aulas)
                    </option>
                  );
                })}
              </select>
            </div>
            <span className="text-xs text-[#5A6578]">
              Mostrando {weeks.filter((w) => studentFilter === 'ALL' || w.studentId === studentFilter).length} de {weeks.length} aulas cadastradas
            </span>
          </div>

          {weeks.filter((w) => studentFilter === 'ALL' || w.studentId === studentFilter).length === 0 ? (
            <div className="bg-white rounded-2xl border border-[#EBE4D8] p-8 text-center space-y-3">
              <p className="text-sm text-[#5A6578]">
                Nenhuma aula cadastrada para este aluno ainda.
              </p>
              <button
                type="button"
                onClick={() => {
                  setEditingModule(undefined);
                  setIsEditorOpen(true);
                }}
                className="py-2.5 px-5 rounded-xl bg-[#8B2626] hover:bg-[#731E1E] text-white text-xs font-bold transition-all shadow-xs"
              >
                + Criar Primeira Aula para este Aluno
              </button>
            </div>
          ) : (
            weeks
              .filter((w) => studentFilter === 'ALL' || w.studentId === studentFilter)
              .map((module) => (
                <div
                  key={module.id}
                  className="bg-white rounded-2xl border border-[#EBE4D8] p-5 sm:p-6 shadow-2xs space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        <span className="font-bold px-2.5 py-0.5 rounded-full bg-[#FAF7F2] text-[#78644E] border border-[#DDD3C1]">
                          Semana {module.weekNumber}
                        </span>
                        <span className="font-bold px-2 py-0.5 rounded-full bg-[#EFE8DC] text-[#63513D]">
                          Nível {module.level}
                        </span>
                        <span className="font-bold px-2.5 py-0.5 rounded-full bg-[#8B2626]/10 text-[#8B2626] border border-[#8B2626]/20 flex items-center gap-1">
                          <User className="w-3 h-3" />
                          <span>{module.studentId === 'ALL' ? '👥 Turma Aberta' : `👤 Aluno: ${module.studentName}`}</span>
                        </span>
                        <span className="text-[#8C7A6B]">{module.date}</span>
                      </div>

                      <h4 className="font-cormorant text-2xl font-bold text-[#0F172A]">
                        {module.title}
                      </h4>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingModule(module);
                          setIsEditorOpen(true);
                        }}
                        className="p-2 rounded-lg border border-[#D4C8B8] hover:bg-[#FAF7F2] text-[#0F172A] transition-colors"
                        title="Editar"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteWeek(module.id)}
                        className="p-2 rounded-lg border border-rose-200 hover:bg-rose-50 text-rose-700 transition-colors"
                        title="Excluir"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Attachments pills */}
                  <div className="flex flex-wrap items-center gap-3 pt-2 text-xs font-semibold text-[#78644E] border-t border-[#F2ECE3]">
                    {module.videoUrl && (
                      <span className="flex items-center gap-1 bg-[#FAF7F2] px-2.5 py-1 rounded-lg border border-[#DDD3C1]">
                        <Video className="w-3.5 h-3.5 text-[#8B2626]" />
                        <span>Vídeo gravado</span>
                      </span>
                    )}
                    {module.pdfUrl && (
                      <span className="flex items-center gap-1 bg-[#FAF7F2] px-2.5 py-1 rounded-lg border border-[#DDD3C1]">
                        <FileText className="w-3.5 h-3.5 text-[#8B2626]" />
                        <span>PDF: {module.pdfFileName}</span>
                      </span>
                    )}
                    <span className="flex items-center gap-1 bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-lg border border-emerald-200">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                      <span>
                        {module.lessons.flashcards.length} cards • {module.lessons.quizzes.length} quizzes • {module.lessons.dictees.length} ditados
                      </span>
                    </span>
                  </div>
                </div>
              ))
          )}
        </div>
      )}

      {/* TAB 2: STUDENTS LIST */}
      {activeTab === 'students' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#FAF7F2] p-4 rounded-2xl border border-[#EBE4D8]">
            <div className="space-y-0.5">
              <h4 className="font-bold text-sm text-[#0F172A] flex items-center gap-2">
                <Users className="w-4 h-4 text-[#8B2626]" />
                <span>Gestão de Alunos ({students.length} matriculados)</span>
              </h4>
              <p className="text-xs text-[#5A6578]">
                Adicione novos alunos à turma ou retire alunos da lista a qualquer momento.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto shrink-0">
              <button
                type="button"
                onClick={handleOpenBackup}
                className="py-2.5 px-3.5 rounded-xl bg-white hover:bg-[#FAF7F2] text-[#8B2626] font-bold text-xs border border-[#D4C8B8] shadow-2xs transition-all flex items-center justify-center gap-1.5"
                title="Sincronizar alunos com o celular via QR Code, WhatsApp ou Backup"
              >
                <Smartphone className="w-4 h-4 text-[#8B2626]" />
                <span>Sincronizar Celular</span>
              </button>

              <button
                type="button"
                onClick={() => setIsAddStudentOpen(true)}
                className="py-2.5 px-4 rounded-xl bg-[#8B2626] hover:bg-[#731E1E] text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-1.5"
              >
                <UserPlus className="w-4 h-4" />
                <span>+ Adicionar Aluno</span>
              </button>
            </div>
          </div>

          {students.length === 0 ? (
            <div className="bg-white rounded-2xl border border-[#EBE4D8] p-8 text-center space-y-3">
              <p className="text-sm text-[#5A6578]">Nenhum aluno cadastrado no momento.</p>
              <button
                type="button"
                onClick={() => setIsAddStudentOpen(true)}
                className="py-2.5 px-5 rounded-xl bg-[#8B2626] hover:bg-[#731E1E] text-white text-xs font-bold transition-all shadow-xs"
              >
                + Adicionar Primeiro Aluno
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {students.map((student) => (
                <div
                  key={student.id}
                  className="bg-white rounded-2xl border border-[#EBE4D8] p-5 shadow-2xs space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-10 h-10 rounded-full bg-[#8B2626] text-white flex items-center justify-center font-cormorant text-xl font-bold shrink-0">
                          {student.name.charAt(0)}
                        </div>
                        <div className="truncate">
                          <h5 className="font-bold text-[#0F172A] text-sm truncate">{student.name}</h5>
                          <span className="text-[11px] text-[#78644E] font-semibold">Nível {student.level}</span>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-[#8B2626] bg-[#FCE7E7] px-2.5 py-0.5 rounded-full shrink-0">
                        {student.totalPoints} pts
                      </span>
                    </div>

                    <div className="pt-2 border-t border-[#F2ECE3] text-xs space-y-1 text-[#5A6578]">
                      <p><strong>PIN de Acesso:</strong> <code className="bg-[#FAF7F2] px-1.5 py-0.5 rounded text-[#0F172A] font-bold">{student.pin}</code></p>
                      <p><strong>Plano:</strong> {student.payment?.planName || 'Particular'}</p>
                      <p><strong>Semanas Concluídas:</strong> {student.completedWeekIds.length}</p>
                      <p><strong>Sequência de Estudos:</strong> {student.streakDays} dias seguidos</p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#F2ECE3] flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setProgressStudent(student)}
                      className="flex-1 py-2 px-3 rounded-xl bg-[#8B2626] hover:bg-[#731E1E] text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                      title="Ver histórico de sessões e pontos acumulados"
                    >
                      <TrendingUp className="w-3.5 h-3.5" />
                      <span>Ver Evolução</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setStudentFilter(student.id);
                        setActiveTab('weeks');
                      }}
                      className="flex-1 py-2 px-3 rounded-xl border border-[#D4C8B8] hover:bg-[#FAF7F2] text-xs font-semibold text-[#8B2626] transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Layers className="w-3.5 h-3.5" />
                      <span>Aulas ({weeks.filter((w) => w.studentId === student.id || w.studentId === 'ALL').length})</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteStudent(student)}
                      className="p-2 rounded-xl border border-rose-200 hover:bg-rose-50 text-rose-600 transition-colors shrink-0"
                      title={`Retirar ${student.name} da lista`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: FINANCIAL & AGENDAMENTOS */}
      {activeTab === 'financial' && (
        <div className="space-y-8 animate-fadeIn">
          {/* Summary Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-[#EBE4D8] shadow-2xs space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Recebido no Ciclo</span>
              </span>
              <p className="font-cormorant text-3xl font-bold text-emerald-700">
                R$ {totalPaid.toFixed(2).replace('.', ',')}
              </p>
              <p className="text-[11px] text-[#5A6578]">
                {students.filter((s) => s.payment?.status === 'paid').length} pacotes em dia
              </p>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-[#EBE4D8] shadow-2xs space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-600" />
                <span>A Renovar (Pendente)</span>
              </span>
              <p className="font-cormorant text-3xl font-bold text-amber-700">
                R$ {totalPending.toFixed(2).replace('.', ',')}
              </p>
              <p className="text-[11px] text-[#5A6578]">
                {students.filter((s) => s.payment?.status === 'pending').length} renovações necessárias
              </p>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-[#EBE4D8] shadow-2xs space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-rose-800 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-rose-600" />
                <span>Atrasado (Cobrança)</span>
              </span>
              <p className="font-cormorant text-3xl font-bold text-rose-700">
                R$ {totalOverdue.toFixed(2).replace('.', ',')}
              </p>
              <p className="text-[11px] text-[#5A6578]">
                {students.filter((s) => s.payment?.status === 'overdue').length} pacotes pendentes
              </p>
            </div>

            <div className="bg-[#FAF7F2] p-5 rounded-3xl border border-[#DDD3C1] shadow-2xs space-y-2 flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#78644E] flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-[#8B2626]" />
                  <span>Sua Chave PIX</span>
                </span>
                <p className="font-mono text-xs font-bold text-[#0F172A] truncate mt-1">
                  {teacherSettings.pixKey}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyPix}
                  className="py-1 px-2.5 rounded-lg border border-[#D4C8B8] bg-white text-[11px] font-bold text-[#8B2626] hover:bg-[#F4EFE6] transition-colors flex items-center gap-1"
                >
                  <Copy className="w-3 h-3" />
                  <span>{copiedPix ? 'Copiado!' : 'Copiar'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsPixSettingsOpen(true)}
                  className="py-1 px-2.5 rounded-lg bg-[#8B2626] text-white text-[11px] font-bold hover:bg-[#731E1E] transition-colors"
                >
                  Alterar Chave
                </button>
              </div>
            </div>
          </div>

          {/* MÓDULO 1: TABELA DE CONTROLE DE MENSALIDADES */}
          <div className="bg-white rounded-3xl border border-[#EBE4D8] p-6 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F2ECE3] pb-4">
              <div>
                <h3 className="font-cormorant text-2xl font-bold text-[#0F172A] flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-[#8B2626]" />
                  <span>Controle de Pagamentos dos Alunos (A cada 4 Aulas)</span>
                </h3>
                <p className="text-xs text-[#5A6578]">
                  Controle por ciclo de aulas sem data fixa. Clique nos botões de valor, data e aulas para editar diretamente sem flechas.
                </p>
              </div>

              <button
                type="button"
                onClick={handleOpenBackup}
                className="py-2 px-3.5 rounded-xl bg-white hover:bg-[#FAF7F2] text-[#8B2626] font-bold text-xs border border-[#D4C8B8] shadow-2xs transition-all flex items-center justify-center gap-1.5 shrink-0"
                title="Sincronizar com celular via QR Code ou WhatsApp"
              >
                <Smartphone className="w-4 h-4 text-[#8B2626]" />
                <span>Sincronizar Celular</span>
              </button>
            </div>

            <div className="space-y-3">
              {students.map((student) => {
                const payment = student.payment || {
                  planName: 'Aulas VIP Individuais',
                  amount: 480,
                  billingCycleClasses: 4,
                  completedClassesInCycle: 0,
                  status: 'paid' as PaymentStatus,
                };

                const totalClasses = payment.billingCycleClasses || 4;
                const completed = payment.completedClassesInCycle || 0;
                const isCycleCompleted = completed >= totalClasses;

                return (
                  <div
                    key={student.id}
                    className="p-4 sm:p-5 rounded-2xl border border-[#EBE4D8] bg-[#FAF7F2]/40 hover:bg-[#FAF7F2] transition-colors flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                  >
                    {/* Aluno & Plano */}
                    <div className="flex items-center gap-3 min-w-[200px]">
                      <div className="w-10 h-10 rounded-full bg-[#8B2626] text-white flex items-center justify-center font-cormorant text-lg font-bold shrink-0">
                        {student.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-[#0F172A]">{student.name}</h4>
                        <p className="text-xs text-[#5A6578]">{payment.planName}</p>
                      </div>
                    </div>

                    {/* Botões Editáveis Sem Flechas (Valor, Data e Aulas) */}
                    <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs">
                      {/* Botão de Valor Editável */}
                      <div className="space-y-1">
                        <span className="text-[#8C7A6B] block text-[11px] font-semibold">Valor do Pacote</span>
                        <button
                          type="button"
                          onClick={() => handleOpenQuickEdit(student, 'amount')}
                          className="py-1.5 px-3 rounded-xl bg-white hover:bg-[#FAF7F2] text-[#0F172A] font-bold text-xs border border-[#D4C8B8] hover:border-[#8B2626] transition-all flex items-center gap-1.5 shadow-2xs group"
                          title="Clique para editar o valor do pacote"
                        >
                          <span>R$ {payment.amount.toFixed(2).replace('.', ',')}</span>
                          <Edit2 className="w-3 h-3 text-[#8B2626] opacity-70 group-hover:opacity-100" />
                        </button>
                      </div>

                      {/* Botão de Data Editável */}
                      <div className="space-y-1">
                        <span className="text-[#8C7A6B] block text-[11px] font-semibold">Data do Pagamento</span>
                        <button
                          type="button"
                          onClick={() => handleOpenQuickEdit(student, 'date')}
                          className="py-1.5 px-3 rounded-xl bg-white hover:bg-[#FAF7F2] text-[#0F172A] font-bold text-xs border border-[#D4C8B8] hover:border-[#8B2626] transition-all flex items-center gap-1.5 shadow-2xs group"
                          title="Clique para editar a data de pagamento"
                        >
                          <Calendar className="w-3.5 h-3.5 text-[#8B2626]" />
                          <span>{formatDisplayDate(payment.paymentDate)}</span>
                          <Edit2 className="w-3 h-3 text-[#8B2626] opacity-70 group-hover:opacity-100" />
                        </button>
                      </div>

                      {/* Botão de Aulas do Ciclo (Sem Flechas) */}
                      <div className="space-y-1">
                        <span className="text-[#8C7A6B] block text-[11px] font-semibold">Aulas no Ciclo</span>
                        <button
                          type="button"
                          onClick={() => handleOpenQuickEdit(student, 'classes')}
                          className={`py-1.5 px-3 rounded-xl font-bold text-xs border transition-all flex items-center gap-1.5 shadow-2xs group ${
                            isCycleCompleted
                              ? 'bg-amber-100 border-amber-300 text-amber-900 hover:bg-amber-200'
                              : 'bg-white hover:bg-[#FAF7F2] text-[#0F172A] border-[#D4C8B8] hover:border-[#8B2626]'
                          }`}
                          title="Clique para definir as aulas dadas (0 a 4)"
                        >
                          <GraduationCap className="w-3.5 h-3.5 text-[#8B2626]" />
                          <span>{completed} de {totalClasses} aulas</span>
                          <Edit2 className="w-3 h-3 text-[#8B2626] opacity-70 group-hover:opacity-100" />
                        </button>
                      </div>
                    </div>

                    {/* Status Badge e Ações */}
                    <div className="flex flex-wrap items-center gap-2">
                      {isCycleCompleted && (
                        <button
                          type="button"
                          onClick={() => handleRenewCycle(student.id)}
                          className="py-1.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] shadow-xs transition-all flex items-center gap-1"
                          title="Aluno pagou o próximo pacote! Zerar aulas e registrar novo ciclo"
                        >
                          <RefreshCw className="w-3 h-3" />
                          <span>Renovar Pacote (Pago ✨)</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => handleTogglePaymentStatus(student.id, payment.status)}
                        className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border flex items-center gap-1.5 ${
                          payment.status === 'paid'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                            : payment.status === 'pending'
                            ? 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100'
                            : 'bg-rose-50 text-rose-800 border-rose-300 hover:bg-rose-100'
                        }`}
                        title="Clique para alternar o status do pagamento"
                      >
                        {payment.status === 'paid' && (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Pago ✨</span>
                          </>
                        )}
                        {payment.status === 'pending' && (
                          <>
                            <Clock className="w-3.5 h-3.5 text-amber-600" />
                            <span>{isCycleCompleted ? 'Renovação' : 'Pendente'}</span>
                          </>
                        )}
                        {payment.status === 'overdue' && (
                          <>
                            <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                            <span>Atrasado</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleOpenEditPayment(student)}
                        className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-white rounded-lg transition-colors border border-transparent hover:border-[#DDD3C1]"
                        title="Editar valor ou aulas do pacote"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      {/* Botão de Enviar Lembrete no WhatsApp */}
                      <a
                        href={getWhatsAppPaymentReminderUrl(student, payment, teacherSettings.pixKey)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-2 px-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-1.5 shrink-0"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>Lembrete WhatsApp</span>
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* MÓDULO 2: HISTÓRICO DE AULAS CANCELADAS & REMARCADAS */}
          <div className="bg-white rounded-3xl border border-[#EBE4D8] p-6 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F2ECE3] pb-4">
              <div>
                <h3 className="font-cormorant text-2xl font-bold text-[#0F172A] flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-[#8B2626]" />
                  <span>Agenda de Reposições e Remarcações</span>
                </h3>
                <p className="text-xs text-[#5A6578]">
                  Registro das aulas que precisaram de alteração de horário ou cancelamento com reposição.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsScheduleModalOpen(true)}
                className="py-2.5 px-4 rounded-xl bg-[#8B2626] hover:bg-[#731E1E] text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1.5 self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>+ Registrar Ocorrência</span>
              </button>
            </div>

            {schedules.length === 0 ? (
              <div className="text-center py-8 text-xs text-[#5A6578] space-y-2">
                <p>Nenhuma aula remarcada ou cancelada registrada no momento. Todas em dia! ✨</p>
              </div>
            ) : (
              <div className="space-y-3">
                {schedules.map((record) => {
                  const student = students.find((s) => s.id === record.studentId);

                  return (
                    <div
                      key={record.id}
                      className="p-4 sm:p-5 rounded-2xl border border-[#EBE4D8] bg-[#FAF7F2]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`p-2.5 rounded-xl shrink-0 mt-0.5 ${
                            record.status === 'rescheduled'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          <Calendar className="w-4 h-4" />
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-[#0F172A]">{record.studentName}</span>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                                record.status === 'rescheduled'
                                  ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                  : 'bg-rose-100 text-rose-800 border border-rose-300'
                              }`}
                            >
                              {record.status === 'rescheduled' ? 'Remarcada' : 'Cancelada'}
                            </span>
                          </div>

                          <p className="text-xs text-[#0F172A]">
                            {record.status === 'rescheduled' ? (
                              <>
                                De <span className="line-through text-slate-500">{record.originalDate}</span> para{' '}
                                <strong className="text-[#8B2626] font-bold">{record.newDate}</strong>
                              </>
                            ) : (
                              <>Aula do dia <strong>{record.originalDate}</strong> cancelada.</>
                            )}
                          </p>

                          {record.reason && (
                            <p className="text-xs text-[#5A6578]">
                              <strong>Motivo:</strong> {record.reason}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Ações: Avisar Aluno + Excluir */}
                      <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
                        {student && (
                          <a
                            href={getWhatsAppRescheduleUrl(student, record)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="py-2 px-3.5 rounded-xl border border-emerald-600 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs transition-colors flex items-center gap-1.5"
                          >
                            <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Avisar no WhatsApp</span>
                          </a>
                        )}

                        <button
                          type="button"
                          onClick={() => handleDeleteSchedule(record.id)}
                          className="p-2 rounded-xl border border-rose-200 hover:bg-rose-50 text-rose-600 transition-colors"
                          title="Excluir ocorrência"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Editor Modal de Aulas Semanais */}
      {isEditorOpen && (
        <WeekContentEditor
          initialModule={editingModule}
          onSave={handleSaveWeek}
          onCancel={() => {
            setIsEditorOpen(false);
            setEditingModule(undefined);
          }}
        />
      )}

      {/* Modal Cadastrar Aluno */}
      {isAddStudentOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl border border-[#EBE4D8] p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#EBE4D8] pb-3">
              <h4 className="font-cormorant text-2xl font-bold text-[#0F172A]">
                Cadastrar Novo Aluno
              </h4>
              <button
                type="button"
                onClick={() => setIsAddStudentOpen(false)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddStudent} className="space-y-3 text-left">
              <div>
                <label className="block text-xs font-bold text-[#0F172A] mb-1">
                  Nome do Aluno :
                </label>
                <input
                  type="text"
                  value={newStudentName}
                  onChange={(e) => setNewStudentName(e.target.value)}
                  placeholder="Ex: Beatriz Lima"
                  className="w-full p-2.5 rounded-xl border border-[#D4C8B8] outline-none text-xs font-bold bg-[#FAF7F2]/50"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-[#0F172A] mb-1">
                    WhatsApp (DDD + Número) :
                  </label>
                  <input
                    type="tel"
                    value={newStudentPhone}
                    onChange={(e) => setNewStudentPhone(e.target.value)}
                    placeholder="11999998888"
                    className="w-full p-2.5 rounded-xl border border-[#D4C8B8] outline-none text-xs bg-[#FAF7F2]/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0F172A] mb-1">
                    Nível do Aluno :
                  </label>
                  <select
                    value={newStudentLevel}
                    onChange={(e) => setNewStudentLevel(e.target.value as Level)}
                    className="w-full p-2.5 rounded-xl border border-[#D4C8B8] outline-none text-xs font-bold bg-[#FAF7F2]/50"
                  >
                    <option value="A1">A1 — Iniciante</option>
                    <option value="A2">A2 — Básico</option>
                    <option value="B1">B1/B2 — Intermediário</option>
                    <option value="C1">C1/C2 — Avançado</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0F172A] mb-1">
                  Plano / Modalidade :
                </label>
                <input
                  type="text"
                  value={newStudentPlan}
                  onChange={(e) => setNewStudentPlan(e.target.value)}
                  placeholder="Ex: Aulas Particulares VIP"
                  className="w-full p-2.5 rounded-xl border border-[#D4C8B8] outline-none text-xs font-bold bg-[#FAF7F2]/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-[#0F172A] mb-1">
                    Valor do Pacote (R$) :
                  </label>
                  <input
                    type="number"
                    value={newStudentAmount}
                    onChange={(e) => setNewStudentAmount(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-[#D4C8B8] outline-none text-xs font-bold bg-[#FAF7F2]/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0F172A] mb-1">
                    Ciclo de Aulas (Pacote) :
                  </label>
                  <select
                    value={newStudentBillingCycle}
                    onChange={(e) => setNewStudentBillingCycle(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-[#D4C8B8] outline-none text-xs font-bold bg-white"
                  >
                    <option value={4}>A cada 4 aulas (Padrão)</option>
                    <option value={8}>A cada 8 aulas</option>
                    <option value={12}>A cada 12 aulas</option>
                    <option value={1}>A cada 1 aula (Avulsa)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0F172A] mb-1">
                  PIN de Acesso (4 dígitos) :
                </label>
                <input
                  type="password"
                  maxLength={6}
                  value={newStudentPin}
                  onChange={(e) => setNewStudentPin(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#D4C8B8] outline-none text-xs font-bold tracking-widest bg-[#FAF7F2]/50"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#EBE4D8]">
                <button
                  type="button"
                  onClick={() => setIsAddStudentOpen(false)}
                  className="py-2.5 px-4 rounded-xl border border-[#D4C8B8] text-xs font-semibold text-[#5A6578]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="py-2.5 px-5 rounded-xl bg-[#8B2626] text-white font-bold text-xs shadow-xs"
                >
                  Salvar Aluno
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Registrar Remarcação ou Cancelamento */}
      {isScheduleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl border border-[#EBE4D8] p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#EBE4D8] pb-3">
              <h4 className="font-cormorant text-2xl font-bold text-[#0F172A] flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#8B2626]" />
                <span>Registrar Aula</span>
              </h4>
              <button
                type="button"
                onClick={() => setIsScheduleModalOpen(false)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddSchedule} className="space-y-3.5 text-left">
              <div>
                <label className="block text-xs font-bold text-[#0F172A] mb-1">
                  Selecione o Aluno :
                </label>
                <select
                  value={schedStudentId}
                  onChange={(e) => setSchedStudentId(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#D4C8B8] outline-none text-xs font-bold bg-[#FAF7F2]/50"
                  required
                >
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.level})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0F172A] mb-1">
                  Tipo de Ocorrência :
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setSchedStatus('rescheduled')}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-colors ${
                      schedStatus === 'rescheduled'
                        ? 'bg-[#8B2626] text-white border-[#8B2626]'
                        : 'bg-white text-[#5A6578] border-[#DDD3C1]'
                    }`}
                  >
                    Aula Remarcada
                  </button>
                  <button
                    type="button"
                    onClick={() => setSchedStatus('cancelled')}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-colors ${
                      schedStatus === 'cancelled'
                        ? 'bg-rose-700 text-white border-rose-700'
                        : 'bg-white text-[#5A6578] border-[#DDD3C1]'
                    }`}
                  >
                    Aula Cancelada
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0F172A] mb-1">
                  Data e Horário Original da Aula :
                </label>
                <input
                  type="text"
                  value={schedOriginalDate}
                  onChange={(e) => setSchedOriginalDate(e.target.value)}
                  placeholder="Ex: Terça 24/09 às 15:00"
                  className="w-full p-2.5 rounded-xl border border-[#D4C8B8] outline-none text-xs bg-[#FAF7F2]/50"
                  required
                />
              </div>

              {schedStatus === 'rescheduled' && (
                <div>
                  <label className="block text-xs font-bold text-[#0F172A] mb-1">
                    Nova Data e Horário Reagendado :
                  </label>
                  <input
                    type="text"
                    value={schedNewDate}
                    onChange={(e) => setSchedNewDate(e.target.value)}
                    placeholder="Ex: Quinta 26/09 às 16:30"
                    className="w-full p-2.5 rounded-xl border border-[#D4C8B8] outline-none text-xs font-bold bg-white"
                    required
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-[#0F172A] mb-1">
                  Motivo ou Observação Pedagógica (Opcional) :
                </label>
                <input
                  type="text"
                  value={schedReason}
                  onChange={(e) => setSchedReason(e.target.value)}
                  placeholder="Ex: Viagem de trabalho / Reposição combinada"
                  className="w-full p-2.5 rounded-xl border border-[#D4C8B8] outline-none text-xs bg-[#FAF7F2]/50"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#EBE4D8]">
                <button
                  type="button"
                  onClick={() => setIsScheduleModalOpen(false)}
                  className="py-2.5 px-4 rounded-xl border border-[#D4C8B8] text-xs font-semibold text-[#5A6578]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="py-2.5 px-5 rounded-xl bg-[#8B2626] text-white font-bold text-xs shadow-xs"
                >
                  Salvar e Notificar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Editar Pagamento do Aluno */}
      {editingPaymentStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl border border-[#EBE4D8] p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#EBE4D8] pb-3">
              <div>
                <h4 className="font-cormorant text-2xl font-bold text-[#0F172A]">
                  Editar Mensalidade
                </h4>
                <p className="text-xs text-[#5A6578]">Aluno: {editingPaymentStudent.name}</p>
              </div>
              <button
                type="button"
                onClick={() => setEditingPaymentStudent(null)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSavePaymentEdit} className="space-y-3.5 text-left">
              <div>
                <label className="block text-xs font-bold text-[#0F172A] mb-1">
                  Nome do Plano / Curso :
                </label>
                <input
                  type="text"
                  value={editPlanName}
                  onChange={(e) => setEditPlanName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#D4C8B8] outline-none text-xs font-bold bg-[#FAF7F2]/50"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#0F172A] mb-1">
                    Valor do Pacote (R$) :
                  </label>
                  <input
                    type="number"
                    value={editAmount}
                    onChange={(e) => setEditAmount(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-[#D4C8B8] outline-none text-xs font-bold bg-[#FAF7F2]/50"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0F172A] mb-1">
                    Ciclo de Aulas :
                  </label>
                  <select
                    value={editBillingCycle}
                    onChange={(e) => setEditBillingCycle(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-[#D4C8B8] outline-none text-xs font-bold bg-white"
                  >
                    <option value={4}>A cada 4 aulas (Padrão)</option>
                    <option value={8}>A cada 8 aulas</option>
                    <option value={12}>A cada 12 aulas</option>
                    <option value={1}>A cada 1 aula (Avulsa)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#0F172A] mb-1">
                    Aulas Dadas no Ciclo :
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={editBillingCycle}
                    value={editCompletedClasses}
                    onChange={(e) => setEditCompletedClasses(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-[#D4C8B8] outline-none text-xs font-bold bg-[#FAF7F2]/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0F172A] mb-1">
                    Data do Pagamento :
                  </label>
                  <input
                    type="date"
                    value={editPaymentDate}
                    onChange={(e) => setEditPaymentDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#D4C8B8] outline-none text-xs font-bold bg-[#FAF7F2]/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0F172A] mb-1">
                  Status Atual do Pagamento :
                </label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value as PaymentStatus)}
                  className="w-full p-2.5 rounded-xl border border-[#D4C8B8] outline-none text-xs font-bold bg-white"
                >
                  <option value="paid">Pago ✨ (Mensalidade em dia)</option>
                  <option value="pending">Pendente (Aguardando vencimento)</option>
                  <option value="overdue">Atrasado (Cobrança necessária)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#EBE4D8]">
                <button
                  type="button"
                  onClick={() => setEditingPaymentStudent(null)}
                  className="py-2.5 px-4 rounded-xl border border-[#D4C8B8] text-xs font-semibold text-[#5A6578]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="py-2.5 px-5 rounded-xl bg-[#8B2626] text-white font-bold text-xs shadow-xs"
                >
                  Salvar Alterações
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Configurar Chave PIX e Telefone da Melissa */}
      {isPixSettingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl border border-[#EBE4D8] p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#EBE4D8] pb-3">
              <h4 className="font-cormorant text-2xl font-bold text-[#0F172A] flex items-center gap-2">
                <Settings className="w-5 h-5 text-[#8B2626]" />
                <span>Dados de Recebimento PIX</span>
              </h4>
              <button
                type="button"
                onClick={() => setIsPixSettingsOpen(false)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSavePixSettings} className="space-y-3.5 text-left">
              <div>
                <label className="block text-xs font-bold text-[#0F172A] mb-1">
                  Sua Chave PIX (E-mail, CPF ou Telefone) :
                </label>
                <input
                  type="text"
                  value={settingsPixKey}
                  onChange={(e) => setSettingsPixKey(e.target.value)}
                  placeholder="Ex: melissa.prado@gmail.com"
                  className="w-full p-2.5 rounded-xl border border-[#D4C8B8] outline-none text-xs font-bold bg-[#FAF7F2]/50 font-mono"
                  required
                />
                <p className="text-[11px] text-[#5A6578] mt-1">
                  Esta chave é exibida no portal de todos os alunos e nos lembretes de WhatsApp.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0F172A] mb-1">
                  Seu WhatsApp para Receber Comprovantes :
                </label>
                <input
                  type="tel"
                  value={settingsPhone}
                  onChange={(e) => setSettingsPhone(e.target.value)}
                  placeholder="5511999990000"
                  className="w-full p-2.5 rounded-xl border border-[#D4C8B8] outline-none text-xs bg-[#FAF7F2]/50"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#EBE4D8]">
                <button
                  type="button"
                  onClick={() => setIsPixSettingsOpen(false)}
                  className="py-2.5 px-4 rounded-xl border border-[#D4C8B8] text-xs font-semibold text-[#5A6578]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="py-2.5 px-5 rounded-xl bg-[#8B2626] text-white font-bold text-xs shadow-xs"
                >
                  Salvar Chave
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QUICK EDIT MODAL (VALOR, DATA OU AULAS - SEM FLECHAS) */}
      {quickEditStudent && quickEditType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border border-[#EBE4D8] p-6 max-w-md w-full shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#F2ECE3] pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#FAF7F2] text-[#8B2626] flex items-center justify-center border border-[#DDD3C1]">
                  {quickEditType === 'amount' && <DollarSign className="w-4 h-4" />}
                  {quickEditType === 'date' && <Calendar className="w-4 h-4" />}
                  {quickEditType === 'classes' && <GraduationCap className="w-4 h-4" />}
                </div>
                <div>
                  <h3 className="font-cormorant text-xl font-bold text-[#0F172A]">
                    {quickEditType === 'amount' && 'Editar Valor do Pacote'}
                    {quickEditType === 'date' && 'Editar Data do Pagamento'}
                    {quickEditType === 'classes' && 'Aulas Ministradas no Ciclo'}
                  </h3>
                  <p className="text-xs text-[#5A6578]">Aluno(a): <strong>{quickEditStudent.name}</strong></p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setQuickEditStudent(null);
                  setQuickEditType(null);
                }}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveQuickEdit} className="space-y-4 text-left">
              {/* EDIT AMOUNT */}
              {quickEditType === 'amount' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-[#0F172A] mb-1.5">
                      Valor do Pacote (R$) :
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-[#8C7A6B]">
                        R$
                      </span>
                      <input
                        type="number"
                        step="10"
                        value={quickEditAmount}
                        onChange={(e) => setQuickEditAmount(Number(e.target.value))}
                        className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-[#D4C8B8] outline-none text-sm font-bold text-[#0F172A] bg-[#FAF7F2]/50 focus:border-[#8B2626]"
                        required
                        autoFocus
                      />
                    </div>
                  </div>

                  {/* Botões de Valores Rápidos (1 clique) */}
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-semibold text-[#8C7A6B] block">
                      Valores Frequentes:
                    </span>
                    <div className="grid grid-cols-3 gap-2">
                      {[380, 400, 450, 480, 520, 600].map((val) => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => setQuickEditAmount(val)}
                          className={`py-1.5 px-2 rounded-xl text-xs font-bold border transition-all ${
                            quickEditAmount === val
                              ? 'bg-[#8B2626] text-white border-[#8B2626] shadow-2xs'
                              : 'bg-white hover:bg-[#FAF7F2] text-[#0F172A] border-[#D4C8B8]'
                          }`}
                        >
                          R$ {val}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* EDIT DATE */}
              {quickEditType === 'date' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-[#0F172A] mb-1.5">
                      Data do Pagamento ou Vencimento :
                    </label>
                    <input
                      type="date"
                      value={quickEditDate}
                      onChange={(e) => setQuickEditDate(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-[#D4C8B8] outline-none text-xs font-bold bg-[#FAF7F2]/50 focus:border-[#8B2626]"
                      required
                      autoFocus
                    />
                  </div>

                  {/* Atalhos Rápidos de Data */}
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-semibold text-[#8C7A6B] block">
                      Atalhos Rápidos:
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setQuickEditDate(new Date().toISOString().split('T')[0])}
                        className="py-1.5 px-2.5 rounded-xl text-xs font-bold border border-[#D4C8B8] bg-white hover:bg-[#FAF7F2] text-[#0F172A]"
                      >
                        Hoje ({formatDisplayDate(new Date().toISOString().split('T')[0])})
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const d = new Date();
                          d.setDate(d.getDate() + 7);
                          setQuickEditDate(d.toISOString().split('T')[0]);
                        }}
                        className="py-1.5 px-2.5 rounded-xl text-xs font-bold border border-[#D4C8B8] bg-white hover:bg-[#FAF7F2] text-[#0F172A]"
                      >
                        Em 7 dias
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const d = new Date();
                          d.setDate(d.getDate() + 15);
                          setQuickEditDate(d.toISOString().split('T')[0]);
                        }}
                        className="py-1.5 px-2.5 rounded-xl text-xs font-bold border border-[#D4C8B8] bg-white hover:bg-[#FAF7F2] text-[#0F172A]"
                      >
                        Em 15 dias
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const d = new Date();
                          d.setMonth(d.getMonth() + 1);
                          setQuickEditDate(d.toISOString().split('T')[0]);
                        }}
                        className="py-1.5 px-2.5 rounded-xl text-xs font-bold border border-[#D4C8B8] bg-white hover:bg-[#FAF7F2] text-[#0F172A]"
                      >
                        Em 30 dias
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* EDIT CLASSES IN CYCLE (SEM FLECHAS) */}
              {quickEditType === 'classes' && (() => {
                const totalCycle = quickEditStudent.payment?.billingCycleClasses || 4;
                return (
                  <div className="space-y-3">
                    <p className="text-xs text-[#5A6578]">
                      Selecione quantas aulas você já ministrou neste pacote de <strong>{totalCycle} aulas</strong>:
                    </p>

                    <div className="grid grid-cols-1 gap-2">
                      {Array.from({ length: totalCycle + 1 }, (_, i) => i).map((count) => {
                        const isSelected = quickEditClasses === count;
                        const isFinished = count >= totalCycle;

                        return (
                          <button
                            key={count}
                            type="button"
                            onClick={() => setQuickEditClasses(count)}
                            className={`p-2.5 rounded-xl border text-left flex items-center justify-between text-xs transition-all ${
                              isSelected
                                ? isFinished
                                  ? 'bg-amber-100 border-amber-400 text-amber-950 font-bold shadow-2xs'
                                  : 'bg-[#8B2626] text-white border-[#8B2626] font-bold shadow-2xs'
                                : 'bg-white hover:bg-[#FAF7F2] text-[#0F172A] border-[#D4C8B8]'
                            }`}
                          >
                            <span className="flex items-center gap-2">
                              <span className="font-mono font-bold text-sm">{count} de {totalCycle}</span>
                              <span className="text-[11px] opacity-80">
                                {count === 0 && '— Pacote novo iniciado'}
                                {count === 1 && '— 1ª aula realizada'}
                                {count === 2 && '— 2 aulas realizadas'}
                                {count === 3 && '— 3 aulas realizadas (Falta 1)'}
                                {count === 4 && '— Ciclo Concluído! 🔔 Hora de Renovar'}
                              </span>
                            </span>
                            {isSelected && <Check className="w-4 h-4 shrink-0" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#EBE4D8]">
                <button
                  type="button"
                  onClick={() => {
                    setQuickEditStudent(null);
                    setQuickEditType(null);
                  }}
                  className="py-2.5 px-4 rounded-xl border border-[#D4C8B8] text-xs font-semibold text-[#5A6578]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="py-2.5 px-5 rounded-xl bg-[#8B2626] text-white font-bold text-xs shadow-xs hover:bg-[#731E1E]"
                >
                  Confirmar Alteração
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* BACKUP & SINCRONIZAÇÃO MODAL (QR CODE + WHATSAPP + CÓDIGO) */}
      {isBackupModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border border-[#EBE4D8] p-6 max-w-lg w-full shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#F2ECE3] pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#8B2626] text-white flex items-center justify-center shadow-2xs">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-cormorant text-xl font-bold text-[#0F172A]">
                    Sincronizar com seu Celular
                  </h3>
                  <p className="text-xs text-[#5A6578]">
                    Transfira seus alunos do computador para o celular instantaneamente
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsBackupModalOpen(false)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Status Feedback */}
            {backupStatusMessage && (
              <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-xs font-semibold text-amber-900">
                {backupStatusMessage}
              </div>
            )}

            {/* SEÇÃO 1: SINCRONIZAÇÃO INSTANTÂNEA VIA QR CODE */}
            <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#EBE4D8] space-y-3 text-center">
              <div className="space-y-1">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                  <QrCode className="w-3.5 h-3.5" />
                  <span>Método Mais Fácil (Recomendado)</span>
                </span>
                <h4 className="font-bold text-sm text-[#0F172A]">
                  Aponte a Câmera do seu Celular
                </h4>
                <p className="text-xs text-[#5A6578]">
                  Ao escanear o QR Code abaixo com seu telefone, o app abrirá automaticamente com todos os seus <strong>{students.length} alunos</strong> salvos!
                </p>
              </div>

              {/* QR Code */}
              <div className="flex justify-center py-1">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
                    studentPortalService.generateSyncUrl()
                  )}`}
                  alt="QR Code de Sincronização de Alunos"
                  className="w-44 h-44 rounded-2xl border-2 border-white shadow-md bg-white p-2"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                {/* Botão de Enviar para WhatsApp */}
                <a
                  href={studentPortalService.getSyncWhatsAppUrl(teacherSettings.phone)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-1.5"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Enviar para meu WhatsApp</span>
                </a>

                {/* Botão de Copiar Link */}
                <button
                  type="button"
                  onClick={handleCopySyncUrl}
                  className="py-2.5 px-3 rounded-xl bg-white hover:bg-slate-50 text-[#0F172A] font-bold text-xs border border-[#D4C8B8] shadow-2xs transition-all flex items-center justify-center gap-1.5"
                >
                  {copiedSyncUrl ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span className="text-emerald-700">Link Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-[#8C7A6B]" />
                      <span>Copiar Link Direto</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* SEÇÃO 2: CÓPIA DE SEGURANÇA MANUAL (CÓDIGO DE ALUNOS) */}
            <div className="p-4 rounded-2xl bg-white border border-[#EBE4D8] space-y-3 text-left">
              <div>
                <h4 className="font-bold text-xs text-[#0F172A] flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#8B2626]" />
                  <span>Backup Manual (Código dos Alunos)</span>
                </h4>
                <p className="text-[11px] text-[#5A6578]">
                  Você também pode copiar os dados abaixo para salvar um arquivo no seu computador ou colar para restaurar:
                </p>
              </div>

              <textarea
                value={backupCodeText}
                onChange={(e) => setBackupCodeText(e.target.value)}
                rows={4}
                className="w-full p-2.5 rounded-xl border border-[#D4C8B8] font-mono text-[11px] bg-[#FAF7F2]/50 outline-none select-all"
                placeholder="Cole aqui o código de backup de alunos para restaurar..."
              />

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyBackup}
                  className="py-2 px-3.5 rounded-xl bg-white hover:bg-[#FAF7F2] text-[#0F172A] font-bold text-xs border border-[#D4C8B8] shadow-2xs flex items-center gap-1.5"
                >
                  <Copy className="w-3.5 h-3.5 text-[#8C7A6B]" />
                  <span>{copiedBackup ? 'Código Copiado!' : 'Copiar Código'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleImportBackup}
                  className="py-2 px-3.5 rounded-xl bg-[#8B2626] hover:bg-[#731E1E] text-white font-bold text-xs shadow-xs flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Restaurar Alunos Deste Código</span>
                </button>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-[#EBE4D8]">
              <button
                type="button"
                onClick={() => setIsBackupModalOpen(false)}
                className="py-2.5 px-5 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#0F172A] font-bold text-xs"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PER-STUDENT PROGRESS PANEL (SESSION HISTORY + POINTS) */}
      {progressStudent && (
        <StudentProgressPanel
          student={students.find((s) => s.id === progressStudent.id) || progressStudent}
          weeks={weeks}
          schedules={schedules}
          onClose={() => setProgressStudent(null)}
          onViewWeeks={(studentId) => {
            setStudentFilter(studentId);
            setActiveTab('weeks');
            setProgressStudent(null);
          }}
        />
      )}
    </div>
  );
};
