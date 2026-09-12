import { useState, useEffect, useRef } from 'react';
import { Level, TabType } from './types';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { LevelsSection } from './components/LevelsSection';
import { FlashcardsView } from './components/FlashcardsView';
import { QuizView } from './components/QuizView';
import { DicteeView } from './components/DicteeView';
import { FichesView } from './components/FichesView';
import { RevisionsView } from './components/RevisionsView';
import { InstallModal } from './components/InstallModal';
import { FLASHCARDS_DATA, QUIZ_DATA, DICTEE_DATA, FICHES_DATA } from './data/learningContent';
import { Heart, Smartphone } from 'lucide-react';

export function App() {
  const [currentLevel, setCurrentLevel] = useState<Level>(() => {
    const saved = localStorage.getItem('fam_level_v2');
    return (saved as Level) || 'A1';
  });

  const [activeTab, setActiveTab] = useState<TabType>('flashcards');
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);

  const [knownCards, setKnownCards] = useState<string[]>(() => {
    const saved = localStorage.getItem('fam_known_cards_v2');
    return saved ? JSON.parse(saved) : [];
  });

  const [reviewCards, setReviewCards] = useState<string[]>(() => {
    const saved = localStorage.getItem('fam_review_cards_v2');
    return saved ? JSON.parse(saved) : [];
  });

  const [totalPoints, setTotalPoints] = useState<number>(() => {
    const saved = localStorage.getItem('fam_points_v2');
    return saved ? parseInt(saved, 10) : 100;
  });

  const studyAreaRef = useRef<HTMLDivElement>(null);
  const levelsAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem('fam_level_v2', currentLevel);
  }, [currentLevel]);

  useEffect(() => {
    localStorage.setItem('fam_known_cards_v2', JSON.stringify(knownCards));
  }, [knownCards]);

  useEffect(() => {
    localStorage.setItem('fam_review_cards_v2', JSON.stringify(reviewCards));
  }, [reviewCards]);

  useEffect(() => {
    localStorage.setItem('fam_points_v2', totalPoints.toString());
  }, [totalPoints]);

  const handleMarkKnown = (cardId: string) => {
    if (!knownCards.includes(cardId)) {
      setKnownCards((prev) => [...prev, cardId]);
      setReviewCards((prev) => prev.filter((id) => id !== cardId));
      setTotalPoints((prev) => prev + 15);
    }
  };

  const handleMarkReview = (cardId: string) => {
    if (!reviewCards.includes(cardId)) {
      setReviewCards((prev) => [...prev, cardId]);
      setKnownCards((prev) => prev.filter((id) => id !== cardId));
    }
  };

  const handleQuizComplete = (score: number) => {
    const earned = score * 25;
    setTotalPoints((prev) => prev + earned);
  };

  const handleCompleteDictee = (_id: string, correct: boolean) => {
    if (correct) {
      setTotalPoints((prev) => prev + 25);
    }
  };

  const scrollToStudyArea = () => {
    studyAreaRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToLevelsArea = () => {
    levelsAreaRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSelectLevel = (lvl: Level) => {
    setCurrentLevel(lvl);
    scrollToStudyArea();
  };

  // Filter content by selected level
  const currentCards = FLASHCARDS_DATA.filter((c) => c.level === currentLevel);
  const currentQuizzes = QUIZ_DATA.filter((q) => q.level === currentLevel);
  const currentDictees = DICTEE_DATA.filter((d) => d.level === currentLevel);

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#0F172A] flex flex-col selection:bg-[#8B2626]/10 selection:text-[#8B2626]">
      {/* Header with Site Style */}
      <Header
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          scrollToStudyArea();
        }}
        totalPoints={totalPoints}
        reviewCount={reviewCards.length}
        onOpenInstallModal={() => setIsInstallModalOpen(true)}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-12 sm:space-y-16 pb-16">
        {/* Hero Section (Recreated from Screenshot 1) */}
        <HeroSection
          onStartTraining={scrollToStudyArea}
          onScrollToLevels={scrollToLevelsArea}
        />

        {/* 4 Levels Grid Section (Recreated from Screenshot 2) */}
        <div ref={levelsAreaRef}>
          <LevelsSection
            currentLevel={currentLevel}
            onSelectLevel={handleSelectLevel}
          />
        </div>

        {/* Interactive Study Arena (Flashcards, Quizzes, Dictée, Fiches, Revisions) */}
        <div ref={studyAreaRef} className="pt-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EBE4D8] pb-4">
            <div>
              <span className="text-xs uppercase tracking-wider font-bold text-[#8B2626]">
                Espaço de Prática • Nível Ativo: {currentLevel}
              </span>
              <h2 className="font-cormorant text-2xl sm:text-3xl font-bold text-[#0F172A]">
                {activeTab === 'flashcards' && 'Flashcards & Pronúncia Nativa'}
                {activeTab === 'quiz' && 'Exercícios & Fixação Pedagógica'}
                {activeTab === 'dictee' && 'Laboratório de Escuta & Dictée'}
                {activeTab === 'fiches' && 'Fiches Mémo da Professora'}
                {activeTab === 'revisions' && 'Meu Plano de Revisão Personalizado'}
              </h2>
            </div>

            {/* Quick Level Pills Switcher */}
            <div className="flex items-center bg-white p-1 rounded-xl border border-[#EBE4D8] text-xs font-semibold self-start sm:self-auto shadow-2xs">
              {(['A1', 'A2', 'B1', 'C1'] as Level[]).map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setCurrentLevel(lvl)}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    currentLevel === lvl
                      ? 'bg-[#8B2626] text-white shadow-2xs'
                      : 'text-[#5A6578] hover:text-[#0F172A]'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          {/* Module Content */}
          <div className="animate-fadeIn">
            {activeTab === 'flashcards' && (
              <FlashcardsView
                cards={currentCards}
                currentLevel={currentLevel}
                knownCardIds={knownCards}
                onMarkKnown={handleMarkKnown}
                onMarkReview={handleMarkReview}
              />
            )}

            {activeTab === 'quiz' && (
              <QuizView
                questions={currentQuizzes}
                currentLevel={currentLevel}
                onQuizComplete={handleQuizComplete}
              />
            )}

            {activeTab === 'dictee' && (
              <DicteeView
                items={currentDictees}
                currentLevel={currentLevel}
                onCompleteDictee={handleCompleteDictee}
              />
            )}

            {activeTab === 'fiches' && (
              <FichesView fiches={FICHES_DATA} currentLevel={currentLevel} />
            )}

            {activeTab === 'revisions' && (
              <RevisionsView
                cards={FLASHCARDS_DATA}
                reviewCardIds={reviewCards}
                currentLevel={currentLevel}
                onMarkKnown={handleMarkKnown}
                onGoToFlashcards={() => setActiveTab('flashcards')}
              />
            )}
          </div>
        </div>
      </div>

      {/* Floating PWA Install Pill for mobile users */}
      <div className="sm:hidden fixed bottom-4 right-4 z-30">
        <button
          type="button"
          onClick={() => setIsInstallModalOpen(true)}
          className="flex items-center gap-2 bg-[#8B2626] text-white px-4 py-2.5 rounded-full shadow-lg font-semibold text-xs border border-[#D4AF37]/40"
        >
          <Smartphone className="w-4 h-4" />
          <span>Instalar no celular</span>
        </button>
      </div>

      {/* Install Modal */}
      <InstallModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
      />

      {/* Footer */}
      <footer className="bg-[#F4EFE6] border-t border-[#EBE4D8] py-8 text-center text-xs text-[#78644E] mt-auto">
        <div className="max-w-6xl mx-auto px-4 space-y-3">
          <div className="flex items-center justify-center gap-2">
            <span className="font-cormorant text-xl font-bold text-[#0F172A]">
              Français avec Melissa
            </span>
            <span className="text-[#C59B27]">✦</span>
          </div>
          <p className="flex items-center justify-center gap-1.5 font-medium text-[#5A6578]">
            <span>Aulas personalizadas • Conversação, cultura e naturalidade</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              Feito com <Heart className="w-3.5 h-3.5 text-[#8B2626] fill-[#8B2626]" /> para os alunos
            </span>
          </p>
          <div className="pt-1">
            <button
              type="button"
              onClick={() => setIsInstallModalOpen(true)}
              className="text-[#8B2626] hover:underline font-semibold text-xs inline-flex items-center gap-1"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Como adicionar este app à tela inicial do seu celular</span>
            </button>
          </div>
          <p className="text-[#8C7A6B]">
            © {new Date().getFullYear()} Français avec Melissa. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
