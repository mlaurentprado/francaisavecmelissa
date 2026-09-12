import React, { useState } from 'react';
import { Flashcard, Level } from '../types';
import {
  Sparkles,
  Volume2,
  CheckCircle2,
  BookmarkCheck,
  MessageCircle,
  Mic,
} from 'lucide-react';
import { speechService } from '../services/speech';
import { speechRecognitionService, PronunciationResult } from '../services/speechRecognition';
import { getWhatsAppQuestionUrl } from '../services/whatsapp';

interface RevisionsViewProps {
  cards: Flashcard[];
  reviewCardIds: string[];
  currentLevel: Level;
  onMarkKnown: (id: string) => void;
  onGoToFlashcards: () => void;
}

export const RevisionsView: React.FC<RevisionsViewProps> = ({
  cards,
  reviewCardIds,
  currentLevel,
  onMarkKnown,
  onGoToFlashcards,
}) => {
  const [activeMicId, setActiveMicId] = useState<string | null>(null);
  const [micResult, setMicResult] = useState<{ id: string; result: PronunciationResult } | null>(null);

  // Cards pending review
  const reviewCards = cards.filter((c) => reviewCardIds.includes(c.id));

  const playAudio = (text: string) => {
    speechService.speak(text, { rate: 0.9 });
  };

  const handleStartMic = (card: Flashcard) => {
    setActiveMicId(card.id);
    setMicResult(null);

    speechRecognitionService.startListening(
      card.french,
      (res) => {
        setMicResult({ id: card.id, result: res });
        setActiveMicId(null);
      },
      () => {
        setActiveMicId(null);
      },
      (listening) => {
        if (!listening) setActiveMicId(null);
      }
    );
  };

  if (reviewCards.length === 0) {
    return (
      <div className="max-w-xl mx-auto bg-white rounded-3xl border border-[#EBE4D8] p-8 sm:p-10 text-center space-y-5 shadow-sm">
        <div className="w-16 h-16 mx-auto rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200/60 shadow-2xs">
          <BookmarkCheck className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <h3 className="font-cormorant text-2xl sm:text-3xl font-bold text-[#0F172A]">
            Tudo em dia ! Félicitations !
          </h3>
          <p className="text-xs sm:text-sm text-[#5A6578] leading-relaxed">
            Você não tem nenhum cartão pendente de revisão no nível {currentLevel}.
            Quando encontrar termos difíceis nos Flashcards, marque "À revoir" para reuni-los aqui.
          </p>
        </div>
        <button
          type="button"
          onClick={onGoToFlashcards}
          className="py-3 px-6 rounded-xl bg-[#8B2626] hover:bg-[#731E1E] text-white font-bold text-xs sm:text-sm transition-all shadow-xs"
        >
          Explorar novos Flashcards
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Intro header */}
      <div className="bg-[#FAF7F2] rounded-2xl p-5 border border-[#EBE4D8] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="font-cormorant text-2xl font-bold text-[#0F172A] flex items-center gap-2">
            <span>Meu Plano de Revisão</span>
            <span className="text-xs font-sans px-2.5 py-0.5 rounded-full bg-[#8B2626] text-white font-bold">
              {reviewCards.length} {reviewCards.length === 1 ? 'item' : 'itens'}
            </span>
          </h3>
          <p className="text-xs text-[#5A6578]">
            Estude estes termos antes da sua próxima aula com a Melissa para consolidar sua memória.
          </p>
        </div>

        <button
          type="button"
          onClick={onGoToFlashcards}
          className="text-xs font-semibold text-[#8B2626] hover:underline self-start sm:self-auto"
        >
          Ver todos os flashcards →
        </button>
      </div>

      {/* List of pending review cards */}
      <div className="space-y-4">
        {reviewCards.map((card) => {
          const hasMicFeedback = micResult?.id === card.id;

          return (
            <div
              key={card.id}
              className="bg-white rounded-2xl border border-[#EBE4D8] p-5 sm:p-6 shadow-2xs space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#F4EFE6] text-[#78644E] uppercase">
                      {card.category}
                    </span>
                    {card.phonetic && (
                      <span className="text-xs text-[#8C7A6B] font-mono">[{card.phonetic}]</span>
                    )}
                  </div>
                  <h4 className="font-cormorant text-2xl sm:text-3xl font-bold text-[#0F172A]">
                    {card.french}
                  </h4>
                  <p className="text-sm font-semibold text-[#5A6578]">
                    {card.portuguese}
                  </p>
                </div>

                {/* Quick Audio & Mic Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => playAudio(card.french)}
                    className="p-2.5 rounded-xl bg-[#FCE7E7] text-[#8B2626] hover:bg-[#F8D2D2] transition-colors"
                    title="Ouvir pronúncia"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleStartMic(card)}
                    className={`p-2.5 rounded-xl border transition-colors ${
                      activeMicId === card.id
                        ? 'bg-rose-600 text-white animate-pulse'
                        : 'bg-white border-[#D4C8B8] text-[#0F172A] hover:bg-[#FAF7F2]'
                    }`}
                    title="Treinar pronúncia"
                  >
                    <Mic className="w-4 h-4 text-[#8B2626]" />
                  </button>

                  <button
                    type="button"
                    onClick={() => onMarkKnown(card.id)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100 text-xs font-bold transition-colors shadow-2xs"
                    title="Marcar como já aprendido"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Já aprendi !</span>
                  </button>
                </div>
              </div>

              {/* Mic feedback if active for this card */}
              {hasMicFeedback && (
                <div
                  className={`p-3 rounded-xl border text-xs ${
                    micResult.result.similarity >= 75
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                      : 'bg-amber-50 border-amber-200 text-amber-950'
                  }`}
                >
                  <span className="font-bold">{micResult.result.feedback} </span>
                  <span>({micResult.result.similarity}% de precisão)</span>
                </div>
              )}

              {/* Example box */}
              <div className="bg-[#FAF7F2] rounded-xl p-3.5 border border-[#EBE4D8] text-xs sm:text-sm space-y-1">
                <p className="font-cormorant text-base font-bold text-[#0F172A]">
                  « {card.exampleFr} »
                </p>
                <p className="text-[#5A6578] italic text-xs">
                  — {card.examplePt}
                </p>
              </div>

              {/* Melissa's tip + WhatsApp link */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-[#F2ECE3] text-xs">
                {card.tip ? (
                  <p className="text-[#7A5B18] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#C59B27] shrink-0" />
                    <span><strong className="font-semibold">Dica:</strong> {card.tip}</span>
                  </p>
                ) : (
                  <div></div>
                )}

                <a
                  href={getWhatsAppQuestionUrl(
                    `Revisão de Dúvida: ${card.french}`,
                    card.exampleFr
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[#059669] hover:underline font-semibold shrink-0 self-end sm:self-auto"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Perguntar para a Melissa</span>
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
