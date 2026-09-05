import React from 'react';
import { TabType } from '../types';
import { Sparkles, Layers, HelpCircle, Headphones, BookOpen, Smartphone, BookmarkCheck } from 'lucide-react';

interface HeaderProps {
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
  totalPoints: number;
  reviewCount: number;
  onOpenInstallModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  totalPoints,
  reviewCount,
  onOpenInstallModal,
}) => {
  return (
    <header className="bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#EBE4D8] sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-20 flex items-center justify-between gap-4">
          {/* Brand Logo with golden sparkle ✦ */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="font-cormorant text-2xl sm:text-3xl font-bold text-[#0F172A] tracking-tight">
                Français avec Melissa
              </span>
              <span className="text-[#C59B27] text-xl sm:text-2xl select-none">✦</span>
            </div>
            <span className="hidden lg:inline-block text-xs uppercase tracking-widest text-[#78644E] font-medium pl-2 border-l border-[#E3D9C9]">
              Espace Élèves
            </span>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-5 lg:gap-7 text-sm font-medium text-[#4B5563]">
            <button
              onClick={() => onSelectTab('flashcards')}
              className={`transition-all relative py-1.5 flex items-center gap-1.5 ${
                activeTab === 'flashcards'
                  ? 'text-[#8B2626] font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#8B2626]'
                  : 'hover:text-[#0F172A]'
              }`}
            >
              <Layers className="w-4 h-4 opacity-70" />
              <span>Flashcards</span>
            </button>

            <button
              onClick={() => onSelectTab('quiz')}
              className={`transition-all relative py-1.5 flex items-center gap-1.5 ${
                activeTab === 'quiz'
                  ? 'text-[#8B2626] font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#8B2626]'
                  : 'hover:text-[#0F172A]'
              }`}
            >
              <HelpCircle className="w-4 h-4 opacity-70" />
              <span>Quizzes</span>
            </button>

            <button
              onClick={() => onSelectTab('dictee')}
              className={`transition-all relative py-1.5 flex items-center gap-1.5 ${
                activeTab === 'dictee'
                  ? 'text-[#8B2626] font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#8B2626]'
                  : 'hover:text-[#0F172A]'
              }`}
            >
              <Headphones className="w-4 h-4 opacity-70" />
              <span>Dictée</span>
            </button>

            <button
              onClick={() => onSelectTab('fiches')}
              className={`transition-all relative py-1.5 flex items-center gap-1.5 ${
                activeTab === 'fiches'
                  ? 'text-[#8B2626] font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#8B2626]'
                  : 'hover:text-[#0F172A]'
              }`}
            >
              <BookOpen className="w-4 h-4 opacity-70" />
              <span>Fichas</span>
            </button>

            {/* Revisions Tab with badge */}
            <button
              onClick={() => onSelectTab('revisions')}
              className={`transition-all relative py-1.5 flex items-center gap-1.5 ${
                activeTab === 'revisions'
                  ? 'text-[#8B2626] font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#8B2626]'
                  : 'hover:text-[#0F172A]'
              }`}
            >
              <BookmarkCheck className="w-4 h-4 opacity-70" />
              <span>Revisões</span>
              {reviewCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-[#8B2626] text-white text-[10px] font-bold flex items-center justify-center">
                  {reviewCount}
                </span>
              )}
            </button>
          </nav>

          {/* Right side: Install App Button + Points Pill + WhatsApp CTA */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Install App button (PWA) */}
            <button
              type="button"
              onClick={onOpenInstallModal}
              title="Instalar no celular"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-[#D4C8B8] hover:border-[#8B2626] hover:bg-[#F9F6F0] text-xs font-semibold text-[#0F172A] transition-all shadow-2xs"
            >
              <Smartphone className="w-3.5 h-3.5 text-[#8B2626]" />
              <span className="hidden sm:inline">Instalar</span>
            </button>

            {/* Student Points Pill */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F4EFE6] text-[#78644E] text-xs font-bold border border-[#E3D9C9] shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-[#C59B27]" />
              <span>{totalPoints} pts</span>
            </div>

            {/* Signature Wine Button from the website */}
            <a
              href="https://wa.me/?text=Bonjour%20Melissa%2C%20gostaria%20de%20agendar%20uma%20aula%21"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#8B2626] hover:bg-[#731E1E] text-white text-xs sm:text-sm font-semibold px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl transition-all shadow-xs hover:shadow-sm flex items-center gap-2 shrink-0"
            >
              <span className="hidden xs:inline">Agende uma aula</span>
              <span className="xs:hidden">Aula</span>
            </a>
          </div>
        </div>

        {/* Mobile Navigation Bar */}
        <div className="md:hidden flex items-center justify-between border-t border-[#EBE4D8] py-2 overflow-x-auto no-scrollbar gap-2 text-xs font-semibold">
          <button
            onClick={() => onSelectTab('flashcards')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'flashcards'
                ? 'bg-[#8B2626] text-white'
                : 'text-[#4B5563] hover:bg-[#F4EFE6]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Cards</span>
          </button>

          <button
            onClick={() => onSelectTab('quiz')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'quiz'
                ? 'bg-[#8B2626] text-white'
                : 'text-[#4B5563] hover:bg-[#F4EFE6]'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Quiz</span>
          </button>

          <button
            onClick={() => onSelectTab('dictee')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'dictee'
                ? 'bg-[#8B2626] text-white'
                : 'text-[#4B5563] hover:bg-[#F4EFE6]'
            }`}
          >
            <Headphones className="w-3.5 h-3.5" />
            <span>Dictée</span>
          </button>

          <button
            onClick={() => onSelectTab('fiches')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'fiches'
                ? 'bg-[#8B2626] text-white'
                : 'text-[#4B5563] hover:bg-[#F4EFE6]'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Fichas</span>
          </button>

          <button
            onClick={() => onSelectTab('revisions')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'revisions'
                ? 'bg-[#8B2626] text-white'
                : 'text-[#4B5563] hover:bg-[#F4EFE6]'
            }`}
          >
            <BookmarkCheck className="w-3.5 h-3.5" />
            <span>Revisões ({reviewCount})</span>
          </button>
        </div>
      </div>
    </header>
  );
};
