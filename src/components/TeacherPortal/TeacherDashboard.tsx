import React, { useState } from 'react';
import { WeeklyModule, StudentProfile, Level } from '../../types';
import { studentPortalService } from '../../services/studentPortalService';
import { WeekContentEditor } from './WeekContentEditor';
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
} from 'lucide-react';

interface TeacherDashboardProps {
  onLogout: () => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ onLogout }) => {
  const [weeks, setWeeks] = useState<WeeklyModule[]>(() => studentPortalService.getWeeklyModules());
  const [students, setStudents] = useState<StudentProfile[]>(() => studentPortalService.getStudents());
  const [editingModule, setEditingModule] = useState<WeeklyModule | undefined>(undefined);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'weeks' | 'students'>('weeks');
  const [studentFilter, setStudentFilter] = useState<string>('ALL');

  // New Student modal state
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentEmail, setNewStudentEmail] = useState('');
  const [newStudentPin, setNewStudentPin] = useState('1234');
  const [newStudentLevel, setNewStudentLevel] = useState<Level>('A1');

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

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName.trim()) return;

    studentPortalService.addStudent({
      name: newStudentName.trim(),
      email: newStudentEmail.trim() || `${newStudentName.toLowerCase().replace(/\s+/g, '')}@aluno.com`,
      pin: newStudentPin.trim() || '1234',
      level: newStudentLevel,
    });

    setStudents(studentPortalService.getStudents());
    setIsAddStudentOpen(false);
    setNewStudentName('');
    setNewStudentEmail('');
    setNewStudentPin('1234');
  };

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
              Gerencie os resumos semanais de aula, anexe PDFs e vídeos, e acompanhe o progresso dos seus alunos.
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

      {/* Main Tabs: Semanas vs Alunos */}
      <div className="flex items-center justify-between border-b border-[#EBE4D8] pb-4 gap-4">
        <div className="flex items-center gap-2 bg-[#FAF7F2] p-1.5 rounded-2xl border border-[#EBE4D8] text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('weeks')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
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
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
              activeTab === 'students'
                ? 'bg-[#8B2626] text-white shadow-2xs'
                : 'text-[#5A6578] hover:text-[#0F172A]'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Meus Alunos ({students.length})</span>
          </button>
        </div>

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
            <span>Cadastrar Aluno</span>
          </button>
        )}
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {students.map((student) => (
              <div
                key={student.id}
                className="bg-white rounded-2xl border border-[#EBE4D8] p-5 shadow-2xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-full bg-[#8B2626] text-white flex items-center justify-center font-cormorant text-xl font-bold">
                      {student.name.charAt(0)}
                    </div>
                    <div>
                      <h5 className="font-bold text-[#0F172A] text-sm">{student.name}</h5>
                      <span className="text-[11px] text-[#78644E] font-semibold">Nível {student.level}</span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-[#8B2626] bg-[#FCE7E7] px-2.5 py-0.5 rounded-full">
                    {student.totalPoints} pts
                  </span>
                </div>

                <div className="pt-2 border-t border-[#F2ECE3] text-xs space-y-1 text-[#5A6578]">
                  <p><strong>PIN de Acesso:</strong> <code className="bg-[#FAF7F2] px-1.5 py-0.5 rounded text-[#0F172A]">{student.pin}</code></p>
                  <p><strong>Semanas Concluídas:</strong> {student.completedWeekIds.length}</p>
                  <p><strong>Sequência de Estudos:</strong> {student.streakDays} dias seguidos</p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setStudentFilter(student.id);
                    setActiveTab('weeks');
                  }}
                  className="w-full mt-2 py-2 px-3 rounded-xl border border-[#D4C8B8] hover:bg-[#FAF7F2] text-xs font-semibold text-[#8B2626] transition-colors flex items-center justify-center gap-1.5"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Ver Aulas deste Aluno ({weeks.filter((w) => w.studentId === student.id).length})</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Editor Modal */}
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

      {/* Add Student Modal */}
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
    </div>
  );
};
