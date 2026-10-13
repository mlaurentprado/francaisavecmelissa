import React from 'react';
import { WeeklyModule, StudentProfile, ClassScheduleRecord } from '../../types';
import { StudentActivityHistory } from './StudentActivityHistory';
import {
  X,
  Trophy,
  Layers,
  Flame,
  CreditCard,
  CheckCircle2,
  Clock,
  Video,
  FileText,
  Calendar,
  TrendingUp,
  ArrowRight,
} from 'lucide-react';

/**
 * Pontos concedidos ao concluir a lição de fixação de uma semana.
 * Espelha o valor usado em WeeklyLessonRunner.completeWeekLesson (+60).
 */
const POINTS_PER_SESSION = 60;

interface StudentProgressPanelProps {
  student: StudentProfile;
  weeks: WeeklyModule[];
  schedules: ClassScheduleRecord[];
  onClose: () => void;
  onViewWeeks: (studentId: string) => void;
}

export const StudentProgressPanel: React.FC<StudentProgressPanelProps> = ({
  student,
  weeks,
  schedules,
  onClose,
  onViewWeeks,
}) => {
  // Aulas do aluno (individuais + turma aberta), da mais antiga para a mais recente
  const studentWeeks = weeks
    .filter((w) => w.studentId === student.id || w.studentId === 'ALL')
    .slice()
    .sort((a, b) => a.weekNumber - b.weekNumber);

  const completedSessions = studentWeeks.filter((w) => student.completedWeekIds.includes(w.id));
  const pendingSessions = studentWeeks.filter((w) => !student.completedWeekIds.includes(w.id));

  // Evolução acumulada: pontos base + 60 por sessão concluída (mesma regra do app)
  const basePoints = Math.max(0, student.totalPoints - POINTS_PER_SESSION * completedSessions.length);
  const evolution = completedSessions.map((module, index) => ({
    module,
    points: basePoints + POINTS_PER_SESSION * (index + 1),
  }));
  const maxEvolutionPoints = evolution.length
    ? evolution[evolution.length - 1].points
    : student.totalPoints || 1;

  const payment = student.payment;
  const cycleTotal = payment?.billingCycleClasses || 4;
  const cycleDone = payment?.completedClassesInCycle ?? 0;
  const cyclePercent = Math.min(100, Math.round((cycleDone / cycleTotal) * 100));
  const studentSchedules = schedules.filter((s) => s.studentId === student.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white w-full max-w-3xl max-h-[92vh] overflow-y-auto rounded-3xl border border-[#EBE4D8] shadow-xl">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-xs border-b border-[#EBE4D8] p-5 sm:p-6 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-12 h-12 rounded-full bg-[#8B2626] text-white flex items-center justify-center font-cormorant text-2xl font-bold shrink-0">
              {student.name.charAt(0)}
            </div>
            <div className="min-w-0">
              <h3 className="font-cormorant text-2xl sm:text-3xl font-bold text-[#0F172A] truncate">
                {student.name}
              </h3>
              <p className="text-xs text-[#78644E] font-semibold">
                Nível {student.level} • Aluno(a) desde{' '}
                {new Date(student.registeredAt).toLocaleDateString('pt-BR')}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl border border-[#D4C8B8] hover:bg-[#FAF7F2] text-[#78644E] transition-colors shrink-0"
            title="Fechar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 sm:p-6 space-y-6">
          {/* Resumo */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="bg-[#FAF7F2] rounded-2xl border border-[#EBE4D8] p-4 space-y-1">
              <span className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-[#8C7A6B]">
                <Trophy className="w-3.5 h-3.5 text-[#C59B27]" />
                <span>Pontos acumulados</span>
              </span>
              <p className="font-cormorant text-3xl font-bold text-[#8B2626]">{student.totalPoints}</p>
            </div>

            <div className="bg-[#FAF7F2] rounded-2xl border border-[#EBE4D8] p-4 space-y-1">
              <span className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-[#8C7A6B]">
                <Layers className="w-3.5 h-3.5 text-[#8B2626]" />
                <span>Sessões concluídas</span>
              </span>
              <p className="font-cormorant text-3xl font-bold text-[#0F172A]">
                {completedSessions.length}
                <span className="text-lg text-[#8C7A6B]"> / {studentWeeks.length}</span>
              </p>
            </div>

            <div className="bg-[#FAF7F2] rounded-2xl border border-[#EBE4D8] p-4 space-y-1">
              <span className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-[#8C7A6B]">
                <Flame className="w-3.5 h-3.5 text-[#C59B27]" />
                <span>Sequência de estudos</span>
              </span>
              <p className="font-cormorant text-3xl font-bold text-[#0F172A]">
                {student.streakDays}
                <span className="text-lg text-[#8C7A6B]"> dias</span>
              </p>
            </div>

            <div className="bg-[#FAF7F2] rounded-2xl border border-[#EBE4D8] p-4 space-y-1">
              <span className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-[#8C7A6B]">
                <CreditCard className="w-3.5 h-3.5 text-[#8B2626]" />
                <span>Ciclo de aulas</span>
              </span>
              <p className="font-cormorant text-3xl font-bold text-[#0F172A]">
                {cycleDone}
                <span className="text-lg text-[#8C7A6B]"> / {cycleTotal}</span>
              </p>
            </div>
          </div>

          {/* Ciclo de pagamento */}
          {payment && (
            <div className="bg-white rounded-2xl border border-[#EBE4D8] p-4 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-[#0F172A]">{payment.planName}</span>
                  <p className="text-[11px] text-[#5A6578]">
                    R$ {payment.amount.toFixed(2).replace('.', ',')} por pacote de {cycleTotal} aulas
                  </p>
                </div>
                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full border ${
                    payment.status === 'paid'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                      : payment.status === 'pending'
                      ? 'bg-amber-50 text-amber-800 border-amber-300'
                      : 'bg-rose-50 text-rose-800 border-rose-300'
                  }`}
                >
                  {payment.status === 'paid' ? 'Pago ✨' : payment.status === 'pending' ? 'Pendente' : 'Atrasado'}
                </span>
              </div>

              <div className="space-y-1.5">
                <div className="h-2 w-full rounded-full bg-[#F2ECE3] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#8B2626] transition-all"
                    style={{ width: `${cyclePercent}%` }}
                  />
                </div>
                <p className="text-[11px] text-[#5A6578]">
                  {cycleDone} de {cycleTotal} aulas do ciclo atual concluídas
                  {payment.paymentDate
                    ? ` • Próximo vencimento em ${new Date(payment.paymentDate).toLocaleDateString('pt-BR')}`
                    : ''}
                </p>
              </div>
            </div>
          )}

          {/* Evolução de pontos */}
          {evolution.length > 0 && (
            <div className="space-y-3">
              <h4 className="flex items-center gap-2 text-sm font-bold text-[#0F172A]">
                <TrendingUp className="w-4 h-4 text-[#8B2626]" />
                <span>Evolução de pontos por sessão</span>
              </h4>

              <div className="bg-[#FAF7F2] rounded-2xl border border-[#EBE4D8] p-4 space-y-3">
                {evolution.map((entry) => (
                  <div key={entry.module.id} className="space-y-1">
                    <div className="flex items-center justify-between gap-3 text-[11px] font-semibold text-[#5A6578]">
                      <span className="truncate">
                        Semana {entry.module.weekNumber} • {entry.module.title}
                      </span>
                      <span className="shrink-0 font-bold text-[#8B2626]">{entry.points} pts</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-[#F2ECE3] overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[#C59B27]"
                        style={{ width: `${Math.round((entry.points / maxEvolutionPoints) * 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
                <p className="text-[11px] text-[#8C7A6B] pt-1 border-t border-[#EBE4D8]">
                  +{POINTS_PER_SESSION} pontos por lição de fixação concluída.
                </p>
              </div>
            </div>
          )}

          {/* Pontuação em quizzes & exercícios (histórico por aluno) */}
          <StudentActivityHistory records={student.activityLog || []} />

          {/* Histórico de sessões */}
          <div className="space-y-3">
            <h4 className="flex items-center gap-2 text-sm font-bold text-[#0F172A]">
              <Layers className="w-4 h-4 text-[#8B2626]" />
              <span>Histórico de sessões ({studentWeeks.length})</span>
            </h4>

            {studentWeeks.length === 0 ? (
              <div className="bg-[#FAF7F2] rounded-2xl border border-[#EBE4D8] p-6 text-center">
                <p className="text-xs text-[#5A6578]">Nenhuma sessão cadastrada para este aluno ainda.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {studentWeeks
                  .slice()
                  .reverse()
                  .map((module) => {
                    const isCompleted = student.completedWeekIds.includes(module.id);
                    return (
                      <div
                        key={module.id}
                        className="bg-white rounded-2xl border border-[#EBE4D8] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div className="space-y-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold">
                            <span className="px-2 py-0.5 rounded-full bg-[#FAF7F2] text-[#78644E] border border-[#DDD3C1]">
                              Semana {module.weekNumber}
                            </span>
                            <span className="px-2 py-0.5 rounded-full bg-[#EFE8DC] text-[#63513D]">
                              Nível {module.level}
                            </span>
                            <span className="text-[#8C7A6B] font-semibold">{module.date}</span>
                          </div>
                          <p className="text-sm font-bold text-[#0F172A] truncate">{module.title}</p>
                          <div className="flex flex-wrap items-center gap-2 text-[11px] text-[#78644E]">
                            <span>{module.lessons.flashcards.length} cards</span>
                            <span>•</span>
                            <span>{module.lessons.quizzes.length} quizzes</span>
                            <span>•</span>
                            <span>{module.lessons.dictees.length} dictées</span>
                            {module.videoUrl && <Video className="w-3.5 h-3.5 text-[#8B2626]" />}
                            {module.pdfUrl && <FileText className="w-3.5 h-3.5 text-[#8B2626]" />}
                          </div>
                        </div>

                        {isCompleted ? (
                          <span className="self-start sm:self-center shrink-0 flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Concluída • +{POINTS_PER_SESSION} pts</span>
                          </span>
                        ) : (
                          <span className="self-start sm:self-center shrink-0 flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-full bg-[#FAF7F2] text-[#78644E] border border-[#DDD3C1]">
                            <Clock className="w-3.5 h-3.5" />
                            <span>Pendente</span>
                          </span>
                        )}
                      </div>
                    );
                  })}
              </div>
            )}

            {pendingSessions.length === 0 && studentWeeks.length > 0 && (
              <p className="text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2">
                🎉 Todas as sessões deste aluno já foram concluídas!
              </p>
            )}
          </div>

          {/* Remarcações e cancelamentos */}
          {studentSchedules.length > 0 && (
            <div className="space-y-3">
              <h4 className="flex items-center gap-2 text-sm font-bold text-[#0F172A]">
                <Calendar className="w-4 h-4 text-[#8B2626]" />
                <span>Remarcações e cancelamentos ({studentSchedules.length})</span>
              </h4>

              <div className="space-y-2">
                {studentSchedules.map((record) => (
                  <div
                    key={record.id}
                    className="bg-[#FAF7F2] rounded-2xl border border-[#EBE4D8] p-3.5 text-xs space-y-1"
                  >
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full font-bold ${
                        record.status === 'rescheduled'
                          ? 'bg-amber-50 text-amber-800 border border-amber-300'
                          : 'bg-rose-50 text-rose-800 border border-rose-300'
                      }`}
                    >
                      {record.status === 'rescheduled' ? 'Remarcada' : 'Cancelada'}
                    </span>
                    <p className="text-[#0F172A] font-semibold">
                      {record.originalDate}
                      {record.newDate ? ` → ${record.newDate}` : ''}
                    </p>
                    {record.reason && <p className="text-[#5A6578]">{record.reason}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white/95 backdrop-blur-xs border-t border-[#EBE4D8] p-4 sm:p-5 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => onViewWeeks(student.id)}
            className="py-2.5 px-4 rounded-xl border border-[#D4C8B8] hover:bg-[#FAF7F2] text-xs font-bold text-[#8B2626] transition-colors flex items-center gap-1.5"
          >
            <span>Ver aulas deste aluno</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={onClose}
            className="py-2.5 px-5 rounded-xl bg-[#8B2626] hover:bg-[#731E1E] text-white text-xs font-bold shadow-xs transition-all"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
