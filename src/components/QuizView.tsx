import React, { useState } from 'react';
import { QuizQuestion, Level } from '../types';
import { CheckCircle2, XCircle, Sparkles, ArrowRight, RotateCcw, Trophy, MessageCircle } from 'lucide-react';
import { getWhatsAppQuestionUrl } from '../services/whatsapp';
import confetti from 'canvas-confetti';

interface QuizViewProps {
  questions: QuizQuestion[];
  currentLevel: Level;
  onQuizComplete: (score: number, total: number) => void;
}

export const QuizView: React.FC<QuizViewProps> = ({
  questions,
  currentLevel,
  onQuizComplete,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const currentQ: QuizQuestion | undefined = questions[currentIndex];

  const handleSelectOption = (index: number) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(index);
    setIsAnswerSubmitted(true);

    const isCorrect = index === currentQ?.correctIndex;
    if (isCorrect) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
    } else {
      setIsFinished(true);
      const finalScore = score + (selectedOption === currentQ?.correctIndex ? 0 : 0);
      onQuizComplete(finalScore, questions.length);

      if (finalScore >= questions.length * 0.7) {
        confetti({
          particleCount: 90,
          spread: 70,
          origin: { y: 0.6 },
        });
      }
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setScore(0);
    setIsFinished(false);
  };

  if (isFinished) {
    const percentage = Math.round((score / questions.length) * 100);
    let title = 'Très bien !';
    let message = 'Você está desenvolvendo um excelente senso prático da língua francesa.';
    if (percentage === 100) {
      title = 'Félicitations ! Parfait ! 🥐';
      message = 'Acerto impecável! Você demonstrou pleno domínio dessas estruturas.';
    } else if (percentage < 60) {
      title = 'Bom treino!';
      message = 'A constância e repetição pós-aula constroem a verdadeira naturalidade.';
    }

    return (
      <div className="max-w-xl mx-auto bg-white rounded-3xl border border-[#EBE4D8] p-8 text-center space-y-6 shadow-sm">
        <div className="w-20 h-20 mx-auto rounded-full bg-[#8B2626] flex items-center justify-center text-white shadow-md">
          <Trophy className="w-10 h-10 text-[#C59B27]" />
        </div>

        <div className="space-y-2">
          <h2 className="font-cormorant text-3xl sm:text-4xl font-bold text-[#0F172A]">{title}</h2>
          <p className="text-[#5A6578] text-sm leading-relaxed">{message}</p>
        </div>

        <div className="bg-[#FAF7F2] rounded-2xl p-6 border border-[#EBE4D8] flex items-center justify-around">
          <div>
            <span className="text-xs text-[#8C7A6B] font-semibold uppercase tracking-wider">
              Pontuação
            </span>
            <p className="font-cormorant text-3xl font-bold text-[#0F172A] mt-1">
              {score} / {questions.length}
            </p>
          </div>
          <div className="w-px h-10 bg-[#DDD3C1]"></div>
          <div>
            <span className="text-xs text-[#8C7A6B] font-semibold uppercase tracking-wider">
              Precisão
            </span>
            <p className="font-cormorant text-3xl font-bold text-[#8B2626] mt-1">
              {percentage}%
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleRestart}
          className="w-full py-3.5 px-6 rounded-xl bg-[#8B2626] hover:bg-[#731E1E] text-white font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-xs"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Refazer este quiz</span>
        </button>
      </div>
    );
  }

  if (!currentQ) {
    return (
      <div className="text-center py-16 bg-white rounded-3xl border border-[#EBE4D8] p-8 shadow-xs">
        <p className="text-[#5A6578] font-medium">Nenhum quiz disponível para este nível no momento.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header bar */}
      <div className="flex items-center justify-between text-xs text-[#78644E] font-semibold px-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#8B2626]"></span>
          <span className="uppercase tracking-wide">Nível {currentLevel}</span>
          <span>•</span>
          <span className="text-[#0F172A]">{currentQ.category}</span>
        </div>
        <div>
          Questão {currentIndex + 1} de {questions.length}
        </div>
      </div>

      {/* Progress line */}
      <div className="w-full bg-[#EBE4D8] h-2 rounded-full overflow-hidden">
        <div
          className="bg-[#8B2626] h-full transition-all duration-300 rounded-full"
          style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
        ></div>
      </div>

      {/* Main question card */}
      <div className="bg-white rounded-3xl border border-[#EBE4D8] p-6 sm:p-8 shadow-sm space-y-6">
        <div className="space-y-3">
          <h2 className="font-cormorant text-2xl sm:text-3xl font-bold text-[#0F172A] leading-snug">
            {currentQ.question}
          </h2>

          {currentQ.sentenceWithBlank && (
            <div className="bg-[#FAF7F2] p-5 rounded-2xl border border-[#EBE4D8]">
              <p className="font-cormorant text-2xl sm:text-3xl text-[#0F172A] font-medium text-center">
                « {currentQ.sentenceWithBlank} »
              </p>
            </div>
          )}
        </div>

        {/* Options */}
        <div className="space-y-3">
          {currentQ.options.map((option, idx) => {
            let optionStyles =
              'border-[#EBE4D8] bg-white text-[#0F172A] hover:border-[#8B2626] hover:bg-[#FAF7F2]';

            if (isAnswerSubmitted) {
              if (idx === currentQ.correctIndex) {
                optionStyles =
                  'border-emerald-500 bg-emerald-50 text-emerald-950 font-bold ring-2 ring-emerald-200';
              } else if (idx === selectedOption) {
                optionStyles =
                  'border-[#8B2626] bg-[#FCE7E7] text-[#8B2626] font-semibold ring-2 ring-[#8B2626]/20';
              } else {
                optionStyles = 'border-[#EBE4D8]/50 bg-[#FAF7F2]/50 text-slate-400 opacity-60';
              }
            }

            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectOption(idx)}
                disabled={isAnswerSubmitted}
                className={`w-full text-left p-4 rounded-2xl border text-sm sm:text-base font-medium transition-all flex items-center justify-between gap-3 ${optionStyles}`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-full bg-[#FAF7F2] border border-[#DDD3C1] flex items-center justify-center text-xs font-bold shrink-0 text-[#63513D]">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span>{option}</span>
                </div>

                {isAnswerSubmitted && idx === currentQ.correctIndex && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                )}
                {isAnswerSubmitted && idx === selectedOption && idx !== currentQ.correctIndex && (
                  <XCircle className="w-5 h-5 text-[#8B2626] shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Feedback / Explanation Box */}
        {isAnswerSubmitted && (
          <div className="pt-2 space-y-4 animate-fadeIn">
            <div
              className={`p-4 sm:p-5 rounded-2xl border text-left space-y-2 ${
                selectedOption === currentQ.correctIndex
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                  : 'bg-[#FCE7E7] border-[#F8D2D2] text-[#8B2626]'
              }`}
            >
              <div className="flex items-center gap-2 font-bold text-sm">
                {selectedOption === currentQ.correctIndex ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Très bien ! Resposta correta.</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 text-[#8B2626]" />
                    <span>Atenção à nuance :</span>
                  </>
                )}
              </div>
              <p className="text-xs sm:text-sm leading-relaxed text-[#2C3E50]">
                {currentQ.explanation}
              </p>
            </div>

            {/* Melissa's Tip */}
            {currentQ.melissaTip && (
              <div className="flex items-start gap-2.5 bg-[#FDF9EE] rounded-xl p-4 border border-[#EEDFB8] text-left">
                <Sparkles className="w-4 h-4 text-[#C59B27] shrink-0 mt-0.5" />
                <p className="text-xs sm:text-sm text-[#7A5B18] leading-relaxed">
                  <span className="font-bold">Dica da Melissa: </span>
                  {currentQ.melissaTip}
                </p>
              </div>
            )}

            {/* WhatsApp Question Button */}
            <div className="flex items-center justify-between pt-1">
              <a
                href={getWhatsAppQuestionUrl(
                  `Questão de Quiz: ${currentQ.question}`,
                  currentQ.sentenceWithBlank || currentQ.explanation
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-[#059669] hover:underline font-semibold"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Ficou com dúvida? Pergunte à Melissa no WhatsApp</span>
              </a>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={handleNext}
                className="w-full py-3.5 px-6 rounded-xl bg-[#8B2626] hover:bg-[#731E1E] text-white font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-xs"
              >
                <span>
                  {currentIndex + 1 === questions.length ? 'Ver pontuação final' : 'Próxima questão'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
