import React from 'react';
import { StudentActivityRecord, ActivityType } from '../../types';
import { ListChecks, BookOpenCheck, Sparkles, Target, Trophy } from 'lucide-react';

const TYPE_META: Record<ActivityType, { label: string; icon: React.ElementType; className: string }> = {
  quiz: { label: 'Quiz', icon: ListChecks, className: 'bg-[#FCE7E7] text-[#8B2626] border border-[#8B2626]/20' },
  dictee: { label: 'Dictée', icon: BookOpenCheck, className: 'bg-amber-50 text-amber-800 border border-amber-200' },
  flashcards: { label: 'Flashcards', icon: Sparkles, className: 'bg-[#EFE8DC] text-[#63513D] border border-[#DDD3C1]' },
};

interface StudentActivityHistoryProps {
  records: StudentActivityRecord[];
}

export const StudentActivityHistory: React.FC<StudentActivityHistoryProps> = ({ records }) => {
  if (records.length === 0) {
    return (
      <div className="space-y-3">
        <h4 className="flex items-center gap-2 text-sm font-bold text-[#0F172A]">
          <Target className="w-4 h-4 text-[#8B2626]" />
          <span>Pontuação em quizzes &amp; exercícios</span>
        </h4>
        <div className="bg-[#FAF7F2] rounded-2xl border border-[#EBE4D8] p-6 text-center">
          <p className="text-xs text-[#5A6578]">
            Nenhum exercício registrado ainda. A pontuação aparece aqui quando o aluno conclui quizzes, dictées e flashcards conectado à conta dele.
          </p>
        </div>
      </div>
    );
  }

  const quizzes = records.filter((r) => r.type === 'quiz');
  const avgScore =
    quizzes.length > 0
      ? Math.round(
          (quizzes.reduce((acc, q) => acc + (q.total ? (q.score || 0) / q.total : 0), 0) / quizzes.length) * 100
        )
      : null;
  const dicteeCount = records.filter((r) => r.type === 'dictee').length;
  const flashcardCount = records.filter((r) => r.type === 'flashcards').length;
  const totalActivityPoints = records.reduce((acc, r) => acc + (r.points || 0), 0);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h4 className="flex items-center gap-2 text-sm font-bold text-[#0F172A]">
          <Target className="w-4 h-4 text-[#8B2626]" />
          <span>Pontuação em quizzes &amp; exercícios</span>
        </h4>
        <span className="text-[11px] font-bold text-[#8B2626] bg-[#FCE7E7] px-3 py-1 rounded-full border border-[#8B2626]/20 flex items-center gap-1">
          <Trophy className="w-3.5 h-3.5" />
          <span>{totalActivityPoints} pts em exercícios</span>
        </span>
      </div>

      {/* Resumo por tipo de exercício */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-[#FAF7F2] rounded-2xl border border-[#EBE4D8] p-3.5 space-y-0.5">
          <span className="text-[10px] uppercase font-bold text-[#8C7A6B]">Quizzes feitos</span>
          <p className="font-cormorant text-2xl font-bold text-[#0F172A]">
            {quizzes.length}
            {avgScore !== null && (
              <span className="text-sm text-[#8B2626] font-cormorant"> • {avgScore}% acerto</span>
            )}
          </p>
        </div>
        <div className="bg-[#FAF7F2] rounded-2xl border border-[#EBE4D8] p-3.5 space-y-0.5">
          <span className="text-[10px] uppercase font-bold text-[#8C7A6B]">Dictées corretas</span>
          <p className="font-cormorant text-2xl font-bold text-[#0F172A]">{dicteeCount}</p>
        </div>
        <div className="bg-[#FAF7F2] rounded-2xl border border-[#EBE4D8] p-3.5 space-y-0.5">
          <span className="text-[10px] uppercase font-bold text-[#8C7A6B]">Flashcards dominados</span>
          <p className="font-cormorant text-2xl font-bold text-[#0F172A]">{flashcardCount}</p>
        </div>
      </div>

      {/* Histórico individual */}
      <div className="space-y-2">
        {records.map((record) => {
          const meta = TYPE_META[record.type];
          const Icon = meta.icon;
          return (
            <div
              key={record.id}
              className="bg-white rounded-2xl border border-[#EBE4D8] p-3.5 flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span
                  className={`shrink-0 inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full ${meta.className}`}
                >
                  <Icon className="w-3 h-3" />
                  <span>{meta.label}</span>
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-[#0F172A] truncate">{record.title}</p>
                  <p className="text-[11px] text-[#5A6578]">
                    {record.total ? `${record.score || 0}/${record.total} acertos • ` : ''}
                    {new Date(record.at).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>
              <span className="shrink-0 text-[11px] font-bold text-[#8B2626]">+{record.points} pts</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
