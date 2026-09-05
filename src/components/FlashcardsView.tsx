import React, { useState } from 'react';
import { Flashcard, Level } from '../types';
import {
  Volume2,
  RotateCw,
  CheckCircle2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Snail,
  Sparkles,
  Mic,
  MessageCircle,
} from 'lucide-react';
import { speechService } from '../services/speech';
import { speechRecognitionService, PronunciationResult } from '../services/speechRecognition';
import { getWhatsAppQuestionUrl } from '../services/whatsapp';
import confetti from 'canvas-confetti';

interface FlashcardsViewProps {
  cards: Flashcard[];
  currentLevel: Level;
  knownCardIds: string[];
  onMarkKnown: (id: string) => void;
  onMarkReview: (id: string) => void;
}

export const FlashcardsView: React.FC<FlashcardsViewProps> = ({
  cards,
  currentLevel,
  knownCardIds,
  onMarkKnown,
  onMarkReview,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Pronunciation mic state
  const [isListening, setIsListening] = useState(false);
  const [pronunciationResult, setPronunciationResult] = useState<PronunciationResult | null>(null);
  const [micError, setMicError] = useState<string | null>(null);

  // Filter cards by category
  const categories = Array.from(new Set(cards.map((c) => c.category)));
  const filteredCards =
    selectedCategory === 'all'
      ? cards
      : cards.filter((c) => c.category === selectedCategory);

  const currentCard: Flashcard | undefined = filteredCards[currentIndex];

  const handleNext = () => {
    setIsFlipped(false);
    setPronunciationResult(null);
    setMicError(null);
    setCurrentIndex((prev) => (prev + 1) % filteredCards.length);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setPronunciationResult(null);
    setMicError(null);
    setCurrentIndex((prev) => (prev - 1 + filteredCards.length) % filteredCards.length);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentIndex(0);
    setIsFlipped(false);
    setPronunciationResult(null);
    setMicError(null);
  };

  const playAudio = (text: string, rate = 0.9, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setIsPlayingAudio(true);
    speechService.speak(text, {
      rate,
      onEnd: () => setIsPlayingAudio(false),
      onError: () => setIsPlayingAudio(false),
    });
  };

  const handleStartMic = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentCard) return;

    setPronunciationResult(null);
    setMicError(null);

    speechRecognitionService.startListening(
      currentCard.french,
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
      (error) => {
        setMicError(error);
      },
      (listening) => {
        setIsListening(listening);
      }
    );
  };

  if (!currentCard) {
    return (
      <div className="text-center py-16 bg-white rounded-3xl border border-[#EBE4D8] p-8 shadow-xs">
        <p className="text-[#5A6578] font-medium">Nenhum flashcard encontrado nesta categoria.</p>
        <button
          onClick={() => setSelectedCategory('all')}
          className="mt-4 px-5 py-2.5 bg-[#8B2626] text-white text-sm font-semibold rounded-xl hover:bg-[#731E1E] transition-colors"
        >
          Ver todos os flashcards do nível {currentLevel}
        </button>
      </div>
    );
  }

  const isKnown = knownCardIds.includes(currentCard.id);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Category selector pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs font-medium">
        <button
          onClick={() => handleCategoryChange('all')}
          className={`px-3.5 py-1.5 rounded-full transition-all whitespace-nowrap ${
            selectedCategory === 'all'
              ? 'bg-[#8B2626] text-white shadow-xs'
              : 'bg-white text-[#5A6578] hover:bg-[#F4EFE6] border border-[#EBE4D8]'
          }`}
        >
          Todas as categorias ({cards.length})
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategoryChange(cat)}
            className={`px-3.5 py-1.5 rounded-full transition-all whitespace-nowrap ${
              selectedCategory === cat
                ? 'bg-[#8B2626] text-white shadow-xs'
                : 'bg-white text-[#5A6578] hover:bg-[#F4EFE6] border border-[#EBE4D8]'
            }`}
          >
            {cat} ({cards.filter((c) => c.category === cat).length})
          </button>
        ))}
      </div>

      {/* Progress & Card info */}
      <div className="flex items-center justify-between text-xs text-[#78644E] font-semibold px-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#8B2626]"></span>
          <span className="uppercase tracking-wide">Nível {currentLevel}</span>
          <span>•</span>
          <span className="text-[#0F172A]">{currentCard.category}</span>
        </div>
        <div>
          Cartão {currentIndex + 1} de {filteredCards.length}
        </div>
      </div>

      {/* Flashcard 3D container */}
      <div
        className="perspective-1000 w-full min-h-[360px] sm:min-h-[410px] cursor-pointer select-none"
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <div
          className={`relative w-full h-full min-h-[360px] sm:min-h-[410px] transition-transform duration-500 transform-style-preserve-3d rounded-3xl shadow-md border border-[#EBE4D8] bg-white ${
            isFlipped ? 'rotate-y-180' : ''
          }`}
        >
          {/* FRONT OF CARD */}
          <div className="absolute inset-0 w-full h-full backface-hidden p-6 sm:p-8 flex flex-col justify-between rounded-3xl bg-linear-to-b from-white via-[#FCFAF7] to-[#F9F5EE]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#8B2626] bg-[#FCE7E7] px-3 py-1 rounded-full border border-[#F8D2D2]">
                Français
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsFlipped(true);
                }}
                className="text-xs text-[#78644E] hover:text-[#0F172A] flex items-center gap-1 font-medium bg-[#F4EFE6] px-3 py-1 rounded-lg border border-[#DDD3C1] transition-colors"
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span>Ver tradução</span>
              </button>
            </div>

            {/* Central French Term with Cormorant font */}
            <div className="my-auto text-center space-y-4 py-4">
              <h2 className="font-cormorant text-4xl sm:text-5xl md:text-6xl font-bold text-[#0F172A] tracking-tight leading-tight">
                {currentCard.french}
              </h2>
              {currentCard.phonetic && (
                <p className="text-sm font-mono text-[#8C7A6B]">
                  [{currentCard.phonetic}]
                </p>
              )}

              {/* Audio and Microphone Action Controls */}
              <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 pt-3">
                {/* Play native audio */}
                <button
                  type="button"
                  onClick={(e) => playAudio(currentCard.french, 0.9, e)}
                  title="Ouvir pronúncia nativa"
                  className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-full font-semibold text-xs sm:text-sm transition-all shadow-xs ${
                    isPlayingAudio
                      ? 'bg-[#731E1E] text-white scale-105 ring-4 ring-[#8B2626]/20'
                      : 'bg-[#8B2626] text-white hover:bg-[#731E1E]'
                  }`}
                >
                  <Volume2 className="w-4 h-4" />
                  <span>Écouter</span>
                </button>

                {/* Slow audio */}
                <button
                  type="button"
                  onClick={(e) => playAudio(currentCard.french, 0.65, e)}
                  title="Ouvir mais devagar"
                  className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-full font-medium text-xs text-[#63513D] bg-[#F4EFE6] hover:bg-[#EFE8DC] transition-all border border-[#DDD3C1]"
                >
                  <Snail className="w-4 h-4 text-[#C59B27]" />
                  <span>Lent</span>
                </button>

                {/* Microphone: Repita e Avalie Pronúncia */}
                <button
                  type="button"
                  onClick={handleStartMic}
                  title="Clique e fale em voz alta no microfone"
                  className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-full font-semibold text-xs sm:text-sm transition-all shadow-xs ${
                    isListening
                      ? 'bg-rose-600 text-white animate-pulse ring-4 ring-rose-300'
                      : 'bg-white text-[#0F172A] hover:bg-[#F9F6F0] border border-[#D4C8B8]'
                  }`}
                >
                  <Mic className={`w-4 h-4 ${isListening ? 'text-white' : 'text-[#8B2626]'}`} />
                  <span>{isListening ? 'Escutando você...' : 'Repita no Microfone'}</span>
                </button>
              </div>

              {/* Pronunciation Feedback Bubble */}
              {pronunciationResult && (
                <div
                  className={`mx-auto max-w-md p-3.5 rounded-2xl border text-left text-xs sm:text-sm space-y-1 animate-fadeIn shadow-xs ${
                    pronunciationResult.similarity >= 75
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                      : 'bg-amber-50 border-amber-200 text-amber-950'
                  }`}
                >
                  <div className="flex items-center justify-between font-bold">
                    <span>{pronunciationResult.feedback}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-white/70">
                      {pronunciationResult.similarity}% de precisão
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 italic">
                    Ouvido: "{pronunciationResult.transcript}"
                  </p>
                </div>
              )}

              {micError && (
                <div className="mx-auto max-w-md p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs text-center animate-fadeIn">
                  {micError}
                </div>
              )}
            </div>

            <div className="text-center text-xs text-[#8C7A6B] flex items-center justify-center gap-1.5">
              <span>Toque no cartão para ver a tradução e os exemplos</span>
            </div>
          </div>

          {/* BACK OF CARD */}
          <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 p-6 sm:p-8 flex flex-col justify-between rounded-3xl bg-linear-to-b from-white via-[#FCFAF7] to-[#F4EFE6]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#0F172A] bg-[#EFE8DC] px-3 py-1 rounded-full border border-[#DDD3C1]">
                Português & Exemplo
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsFlipped(false);
                }}
                className="text-xs text-[#78644E] hover:text-[#0F172A] flex items-center gap-1 font-medium bg-[#F4EFE6] px-3 py-1 rounded-lg border border-[#DDD3C1] transition-colors"
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span>Voltar</span>
              </button>
            </div>

            {/* Translation & Example */}
            <div className="my-auto space-y-4 py-2">
              <div className="text-center">
                <span className="text-xs uppercase font-semibold tracking-wider text-[#8C7A6B]">
                  Significado
                </span>
                <h3 className="font-cormorant text-2xl sm:text-3xl font-bold text-[#0F172A] mt-1">
                  {currentCard.portuguese}
                </h3>
              </div>

              {/* Example box with audio button */}
              <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#EBE4D8] text-left space-y-2 shadow-2xs">
                <div className="flex items-start justify-between gap-3">
                  <p className="font-cormorant text-lg sm:text-xl font-bold text-[#0F172A] leading-snug">
                    « {currentCard.exampleFr} »
                  </p>
                  <button
                    type="button"
                    onClick={(e) => playAudio(currentCard.exampleFr, 0.9, e)}
                    className="p-1.5 rounded-lg bg-[#FCE7E7] text-[#8B2626] hover:bg-[#F8D2D2] transition-colors shrink-0"
                    title="Ouvir a frase"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs sm:text-sm text-[#5A6578] italic">
                  — {currentCard.examplePt}
                </p>
              </div>

              {/* Melissa's Tip */}
              {currentCard.tip && (
                <div className="flex items-start gap-2.5 bg-[#FDF9EE] rounded-xl p-3.5 border border-[#EEDFB8] text-left">
                  <Sparkles className="w-4 h-4 text-[#C59B27] shrink-0 mt-0.5" />
                  <p className="text-xs text-[#7A5B18] leading-relaxed">
                    <span className="font-bold">Dica da Melissa: </span>
                    {currentCard.tip}
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between text-xs text-[#8C7A6B] pt-2 border-t border-[#EBE4D8]">
              <span>Français avec Melissa ✦</span>
              {/* WhatsApp Question Button */}
              <a
                href={getWhatsAppQuestionUrl(
                  `Flashcard: ${currentCard.french} (${currentCard.portuguese})`,
                  currentCard.exampleFr
                )}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1 text-[#059669] hover:underline font-semibold"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Dúvida com a Melissa?</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons: Mastery & Navigation */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
        {/* Navigation arrows */}
        <div className="flex items-center gap-2 order-2 sm:order-1">
          <button
            type="button"
            onClick={handlePrev}
            className="p-3 rounded-xl bg-white border border-[#EBE4D8] hover:bg-[#F4EFE6] text-[#0F172A] transition-colors shadow-2xs"
            title="Précédent"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="p-3 rounded-xl bg-white border border-[#EBE4D8] hover:bg-[#F4EFE6] text-[#0F172A] transition-colors shadow-2xs"
            title="Suivant"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Student assessment buttons */}
        <div className="flex items-center gap-3 w-full sm:w-auto order-1 sm:order-2">
          <button
            type="button"
            onClick={() => {
              onMarkReview(currentCard.id);
              handleNext();
            }}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white border border-[#8B2626]/40 text-[#8B2626] hover:bg-[#FCE7E7] text-xs sm:text-sm font-bold transition-all shadow-2xs"
          >
            <AlertCircle className="w-4 h-4 text-[#8B2626]" />
            <span>À revoir (Revisar)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onMarkKnown(currentCard.id);
              handleNext();
            }}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-xs ${
              isKnown
                ? 'bg-emerald-700 text-white ring-2 ring-emerald-300'
                : 'bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{isKnown ? 'Compris ! ✨' : 'Je sais ! (Entendi)'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
