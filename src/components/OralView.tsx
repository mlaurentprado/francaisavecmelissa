import React, { useState } from 'react';
import { DicteeItem, Level } from '../types';
import {
  Volume2,
  Snail,
  ArrowRight,
  Mic,
  MessageCircle,
} from 'lucide-react';
import { speechService } from '../services/speech';
import { speechRecognitionService, PronunciationResult } from '../services/speechRecognition';
import { getWhatsAppQuestionUrl } from '../services/whatsapp';
import confetti from 'canvas-confetti';

interface OralViewProps {
  items: DicteeItem[];
  currentLevel: Level;
}

export const OralView: React.FC<OralViewProps> = ({
  items,
  currentLevel,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Mic recognition state
  const [isListening, setIsListening] = useState(false);
  const [pronunciationResult, setPronunciationResult] = useState<PronunciationResult | null>(null);
  const [micError, setMicError] = useState<string | null>(null);

  const currentItem: DicteeItem | undefined = items[currentIndex];

  const playAudio = (rate = 0.85) => {
    if (!currentItem) return;
    setIsPlaying(true);
    speechService.speak(currentItem.sentence, {
      rate,
      onEnd: () => setIsPlaying(false),
      onError: () => setIsPlaying(false),
    });
  };

  const handleStartMic = () => {
    if (!currentItem) return;
    setPronunciationResult(null);
    setMicError(null);

    speechRecognitionService.startListening(
      currentItem.sentence,
      (result) => {
        setPronunciationResult(result);
        if (result.similarity >= 80) {
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.7 },
          });
        }
      },
      (err) => setMicError(err),
      (listening) => setIsListening(listening)
    );
  };

  const handleNext = () => {
    setPronunciationResult(null);
    setMicError(null);
    setCurrentIndex((prev) => (prev + 1 < items.length ? prev + 1 : 0));
  };

  if (!currentItem) {
    return (
      <div className="text-center py-16 bg-white rounded-3xl border border-[#EBE4D8] p-8 shadow-xs">
        <p className="text-[#5A6578] font-medium">Nenhum exercício oral para este nível no momento.</p>
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
          <span className="text-[#0F172A]">Frase {currentIndex + 1} de {items.length}</span>
        </div>
        <span className="px-3 py-1 rounded-full bg-[#F4EFE6] text-[#78644E] text-xs font-semibold capitalize border border-[#DDD3C1]">
          {currentItem.difficulty}
        </span>
      </div>

      {/* Main exercise card */}
      <div className="bg-white rounded-3xl border border-[#EBE4D8] p-6 sm:p-8 shadow-sm space-y-6">
        <div className="text-center space-y-3">
          <h2 className="font-cormorant text-2xl sm:text-3xl font-bold text-[#0F172A]">
            Écoutez et répétez la phrase
          </h2>
          <p className="text-xs sm:text-sm text-[#5A6578]">
            Ouça a pronúncia nativa, repita em voz alta e compare com o microfone. Sem escrita — o foco é 100% na fala!
          </p>
        </div>

        {/* Sentence display */}
        <div className="bg-[#FAF7F2] rounded-2xl border border-[#EBE4D8] p-5 text-center space-y-2">
          <p className="font-cormorant text-xl sm:text-2xl font-bold text-[#0F172A]">
            « {currentItem.sentence} »
          </p>
          <p className="text-xs sm:text-sm text-[#5A6578] italic">
            Tradução : {currentItem.translation}
          </p>
        </div>

        {/* Audio triggers & Mic button */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
          <button
            type="button"
            onClick={() => playAudio(0.85)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-xs sm:text-sm transition-all shadow-xs ${
              isPlaying
                ? 'bg-[#731E1E] text-white scale-105 ring-4 ring-[#8B2626]/20'
                : 'bg-[#8B2626] text-white hover:bg-[#731E1E]'
            }`}
          >
            <Volume2 className="w-4 h-4" />
            <span>{isPlaying ? 'Ouvindo...' : 'Ouvir frase'}</span>
          </button>

          <button
            type="button"
            onClick={() => playAudio(0.6)}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-full font-semibold text-xs text-[#63513D] bg-[#F4EFE6] hover:bg-[#EFE8DC] border border-[#DDD3C1] transition-all"
            title="Vitesse ralentie"
          >
            <Snail className="w-4 h-4 text-[#C59B27]" />
            <span>Mais lento</span>
          </button>

          <button
            type="button"
            onClick={handleStartMic}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-full font-semibold text-xs transition-all shadow-xs ${
              isListening
                ? 'bg-rose-600 text-white animate-pulse'
                : 'bg-white text-[#0F172A] border border-[#D4C8B8] hover:bg-[#F9F6F0]'
            }`}
          >
            <Mic className="w-4 h-4 text-[#8B2626]" />
            <span>{isListening ? 'Fale agora...' : 'Treinar Fala'}</span>
          </button>
        </div>

        {/* Pronunciation Feedback */}
        {pronunciationResult && (
          <div
            className={`mx-auto max-w-md p-3 rounded-xl border text-left text-xs space-y-1 animate-fadeIn shadow-2xs ${
              pronunciationResult.similarity >= 75
                ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                : 'bg-amber-50 border-amber-200 text-amber-950'
            }`}
          >
            <div className="flex items-center justify-between font-bold">
              <span>{pronunciationResult.feedback}</span>
              <span className="px-2 py-0.5 rounded-full bg-white/80">
                {pronunciationResult.similarity}%
              </span>
            </div>
            <p className="text-slate-600 italic">Ouvido: "{pronunciationResult.transcript}"</p>
          </div>
        )}

        {micError && (
          <div className="mx-auto max-w-md p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs">
            {micError}
          </div>
        )}

        {/* Next + WhatsApp Question link */}
        <div className="space-y-3 pt-1">
          <button
            type="button"
            onClick={handleNext}
            className="w-full py-3.5 px-6 rounded-xl bg-[#8B2626] hover:bg-[#731E1E] text-white font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-xs"
          >
            <span>{currentIndex + 1 === items.length ? 'Recomeçar frases' : 'Próxima frase'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="flex items-center justify-center text-xs pt-1">
            <a
              href={getWhatsAppQuestionUrl(
                `Pronúncia da frase: ${currentItem.sentence}`,
                `Tradução: ${currentItem.translation}`
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[#059669] hover:underline font-semibold"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Dúvida sobre a pronúncia? Pergunte à Melissa no WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
