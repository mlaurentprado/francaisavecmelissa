import { useState, useEffect, useRef } from 'react';
import { Level, TabType, AuthSession } from './types';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { LevelsSection } from './components/LevelsSection';
import { FlashcardsView } from './components/FlashcardsView';
import { QuizView } from './components/QuizView';
import { DicteeView } from './components/DicteeView';
import { FichesView } from './components/FichesView';
import { RevisionsView } from './components/RevisionsView';
import { InstallModal } from './components/InstallModal';
import { StudentLoginModal } from './components/StudentPortal/StudentLoginModal';
import { StudentDashboard } from './components/StudentPortal/StudentDashboard';
import { TeacherDashboard } from './components/TeacherPortal/TeacherDashboard';
import { studentPortalService } from './services/studentPortalService';
import { FLASHCARDS_DATA, QUIZ_DATA, DICTEE_DATA, FICHES_DATA } from './data/learningContent';
import { Heart, Smartphone, GraduationCap, ArrowRight } from 'lucide-react';

export function App() {
  const [currentLevel, setCurrentLevel] = useState<Level>(() => {
    const saved = localStorage.getItem('fam_level_v2');
    return (saved as Level) || 'A1';
  });

  const [activeTab, setActiveTab] = useState<TabType>('flashcards');
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Portal session
  const [session, setSession] = useState<AuthSession>(() => studentPortalService.getCurrentSession());

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

  const handleLoginSuccess = () => {
    setSession(studentPortalService.getCurrentSession());
    setActiveTab('portal');
  };

  const handleLogout = () => {
    studentPortalService.logout();
    setSession(studentPortalService.getCurrentSession());
    setActiveTab('flashcards');
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
          if (tab !== 'portal') scrollToStudyArea();
        }}
        totalPoints={session.currentUser ? session.currentUser.totalPoints : totalPoints}
        reviewCount={reviewCards.length}
        onOpenInstallModal={() => setIsInstallModalOpen(true)}
        session={session}
        onOpenLoginModal={() => setIsLoginModalOpen(true)}
        onLogout={handleLogout}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-12 sm:space-y-16 pb-16">
        {/* VIEW 1: ESPAÇO DO ALUNO OU PAINEL DA PROFESSORA (QUANDO NA ABA PORTAL) */}
        {activeTab === 'portal' ? (
          <div className="pt-6 space-y-8">
            {session.isTeacher ? (
              <TeacherDashboard onLogout={handleLogout} />
            ) : session.currentUser ? (
              <StudentDashboard
                student={session.currentUser}
                onLogout={handleLogout}
                onSelectLevel={(lvl) => setCurrentLevel(lvl)}
              />
            ) : (
              <div className="max-w-lg mx-auto bg-white rounded-3xl border border-[#EBE4D8] p-8 text-center space-y-5 shadow-md">
                <GraduationCap className="w-12 h-12 text-[#8B2626] mx-auto" />
                <h3 className="font-cormorant text-3xl font-bold text-[#0F172A]">
                  Acesse seu Espaço do Aluno
                </h3>
                <p className="text-xs sm:text-sm text-[#5A6578]">
                  Faça login para acessar os resumos semanais de aula, os vídeos, PDFs e as lições exclusivas da Melissa.
                </p>
                <button
                  type="button"
                  onClick={() => setIsLoginModalOpen(true)}
                  className="w-full py-3.5 px-6 rounded-xl bg-[#8B2626] hover:bg-[#731E1E] text-white font-bold text-sm shadow-md transition-all"
                >
                  Entrar no Espaço do Aluno
                </button>
              </div>
            )}
          </div>
        ) : (
          /* VIEW 2: CATÁLOGO DE ESTUDOS E PRÁTICA LIVRE */
          <>
            {/* Student Portal Quick Access Banner (Se não estiver logado) */}
            {!session.currentUser && !session.isTeacher && (
              <div className="bg-[#FAF7F2] border border-[#D4C8B8] rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#8B2626] text-white flex items-center justify-center shrink-0">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-cormorant text-xl font-bold text-[#0F172A]">
                      É aluno(a) da Melissa? Acesse seus materiais semanais
                    </h4>
                    <p className="text-xs text-[#5A6578]">
                      Acompanhe os resumos de cada aula, vídeos gravados, PDFs e lições de fixação.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsLoginModalOpen(true)}
                  className="py-2.5 px-4 rounded-xl bg-[#8B2626] hover:bg-[#731E1E] text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 shrink-0"
                >
                  <span>Entrar no Espaço do Aluno</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Hero Section */}
            <HeroSection
              onStartTraining={scrollToStudyArea}
              onScrollToLevels={scrollToLevelsArea}
            />

            {/* 4 Levels Grid Section */}
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
          </>
        )}
      </div>

      {/* Floating PWA Install Pill */}
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

      {/* Student / Teacher Login Modal */}
      <StudentLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
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
          <div className="pt-1 flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => setIsInstallModalOpen(true)}
              className="text-[#8B2626] hover:underline font-semibold text-xs inline-flex items-center gap-1"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Adicionar app à tela inicial</span>
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => setIsLoginModalOpen(true)}
              className="text-[#8B2626] hover:underline font-semibold text-xs inline-flex items-center gap-1"
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Acesso Professora Melissa</span>
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
