import React, { useState } from 'react';
import { WeeklyModule, StudentProfile } from '../../types';
import { FlashcardsView } from '../FlashcardsView';
import { QuizView } from '../QuizView';
import { DicteeView } from '../DicteeView';
import { studentPortalService } from '../../services/studentPortalService';
import { CheckCircle2, ArrowLeft, Trophy, Layers, HelpCircle, Headphones } from 'lucide-react';
import confetti from 'canvas-confetti';

interface WeeklyLessonRunnerProps {
  module: WeeklyModule;
  student: StudentProfile;
  onBack: () => void;
  onCompleted: () => void;
}

export const WeeklyLessonRunner: React.FC<WeeklyLessonRunnerProps> = ({
  module,
  student,
  onBack,
  onCompleted,
}) => {
  const [subTab, setSubTab] = useState<'flashcards' | 'quiz' | 'dictee'>('flashcards');
  const [isDone, setIsDone] = useState(false);

  const handleFinishWeek = () => {
    studentPortalService.completeWeekLesson(student.id, module.id, 60);
    setIsDone(true);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  if (isDone) {
    return (
      <div className="max-w-xl mx-auto bg-white rounded-3xl border border-[#EBE4D8] p-8 sm:p-10 text-center space-y-6 shadow-md animate-fadeIn">
        <div className="w-20 h-20 mx-auto rounded-full bg-[#8B2626] text-[#C59B27] flex items-center justify-center shadow-lg">
          <Trophy className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <h3 className="font-cormorant text-3xl sm:text-4xl font-bold text-[#0F172A]">
            Félicitations, {student.name} ! 🥐
          </h3>
          <p className="text-xs sm:text-sm text-[#5A6578] leading-relaxed">
            Você concluiu a lição de fixação da <strong>{module.title}</strong> com sucesso e garantiu +60 pontos no seu perfil!
          </p>
        </div>

        <div className="bg-[#FAF7F2] rounded-2xl p-5 border border-[#EBE4D8] flex items-center justify-around text-xs">
          <div>
            <span className="text-[#8C7A6B] uppercase font-bold">Pontos Ganhos</span>
            <p className="font-cormorant text-2xl font-bold text-[#8B2626] mt-0.5">+60 pts</p>
          </div>
          <div className="w-px h-8 bg-[#DDD3C1]"></div>
          <div>
            <span className="text-[#8C7A6B] uppercase font-bold">Status da Semana</span>
            <p className="font-cormorant text-2xl font-bold text-emerald-700 mt-0.5">Concluída ✨</p>
          </div>
        </div>

        <button
          type="button"
          onClick={onCompleted}
          className="w-full py-3.5 px-6 rounded-xl bg-[#8B2626] hover:bg-[#731E1E] text-white font-bold text-sm shadow-md transition-all"
        >
          Voltar para o Painel de Aulas
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Top Bar with Back Button and Week Title */}
      <div className="flex items-center justify-between gap-4 border-b border-[#EBE4D8] pb-4">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-bold text-[#8B2626] hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar ao Resumo da Semana</span>
        </button>

        <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#FAF7F2] border border-[#DDD3C1] text-[#78644E]">
          Nível {module.level} • {module.date}
        </span>
      </div>

      <div className="text-center space-y-1">
        <h2 className="font-cormorant text-3xl font-bold text-[#0F172A]">
          Lição de Fixação: {module.title}
        </h2>
        <p className="text-xs text-[#5A6578]">
          Pratique os termos, responda às questões e conclua o ditado para pontuar!
        </p>
      </div>

      {/* Mini Tabs for the Week's Content */}
      <div className="flex items-center justify-center gap-2 bg-[#FAF7F2] p-1.5 rounded-2xl border border-[#EBE4D8] text-xs font-semibold max-w-md mx-auto">
        <button
          type="button"
          onClick={() => setSubTab('flashcards')}
          className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            subTab === 'flashcards'
              ? 'bg-[#8B2626] text-white shadow-2xs'
              : 'text-[#5A6578] hover:text-[#0F172A]'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Cards ({module.lessons.flashcards.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setSubTab('quiz')}
          className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            subTab === 'quiz'
              ? 'bg-[#8B2626] text-white shadow-2xs'
              : 'text-[#5A6578] hover:text-[#0F172A]'
          }`}
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Quiz ({module.lessons.quizzes.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setSubTab('dictee')}
          className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            subTab === 'dictee'
              ? 'bg-[#8B2626] text-white shadow-2xs'
              : 'text-[#5A6578] hover:text-[#0F172A]'
          }`}
        >
          <Headphones className="w-3.5 h-3.5" />
          <span>Dictée ({module.lessons.dictees.length})</span>
        </button>
      </div>

      {/* Content Runner */}
      <div className="animate-fadeIn">
        {subTab === 'flashcards' && (
          <div className="space-y-6">
            <FlashcardsView
              cards={module.lessons.flashcards}
              currentLevel={module.level}
              knownCardIds={[]}
              onMarkKnown={() => {}}
              onMarkReview={() => {}}
            />
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setSubTab('quiz')}
                className="py-3 px-6 rounded-xl bg-[#8B2626] hover:bg-[#731E1E] text-white font-bold text-xs sm:text-sm shadow-xs transition-all"
              >
                Continuar para os Quizzes da Semana →
              </button>
            </div>
          </div>
        )}

        {subTab === 'quiz' && (
          <div className="space-y-6">
            <QuizView
              questions={module.lessons.quizzes}
              currentLevel={module.level}
              onQuizComplete={() => {}}
            />
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setSubTab('dictee')}
                className="py-3 px-6 rounded-xl bg-[#8B2626] hover:bg-[#731E1E] text-white font-bold text-xs sm:text-sm shadow-xs transition-all"
              >
                Continuar para o Ditado da Semana →
              </button>
            </div>
          </div>
        )}

        {subTab === 'dictee' && (
          <div className="space-y-6">
            <DicteeView
              items={module.lessons.dictees}
              currentLevel={module.level}
              onCompleteDictee={() => {}}
            />
            <div className="text-center pt-4 border-t border-[#EBE4D8]">
              <button
                type="button"
                onClick={handleFinishWeek}
                className="py-3.5 px-8 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 mx-auto"
              >
                <CheckCircle2 className="w-5 h-5 text-emerald-300" />
                <span>Finalizar Semana e Coletar Pontos ✨</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
