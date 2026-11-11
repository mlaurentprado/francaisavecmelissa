import { useState, useEffect, useRef } from 'react';
import { Level, TabType, AuthSession } from './types';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { LevelsSection } from './components/LevelsSection';
import { FlashcardsView } from './components/FlashcardsView';
import { QuizView } from './components/QuizView';
import { DicteeView } from './components/DicteeView';
import { OralView } from './components/OralView';
import { FichesView } from './components/FichesView';
import { RevisionsView } from './components/RevisionsView';
import { InstallModal } from './components/InstallModal';
import { StudentLoginModal } from './components/StudentPortal/StudentLoginModal';
import { StudentDashboard } from './components/StudentPortal/StudentDashboard';
import { TeacherDashboard } from './components/TeacherPortal/TeacherDashboard';
import { SkillTreeView } from './components/SkillTreeView';
import { AchievementsPanel } from './components/AchievementsPanel';
import { studentPortalService } from './services/studentPortalService';
import { skillTreeService } from './services/skillTreeService';
import { LeafProgress, AchievementBadge } from './types';
import { flashcardService } from './services/flashcardService';
import { FICHES_DATA } from './data/learningContent';
import { dicteeService } from './services/dicteeService';
import { quizService } from './services/quizService';
import { Heart, Smartphone, GraduationCap, Sparkles } from 'lucide-react';

export function App() {
  const [currentLevel, setCurrentLevel] = useState<Level>(() => {
    const saved = localStorage.getItem('fam_level_v2');
    return (saved as Level) || 'A1';
  });

  const [activeTab, setActiveTab] = useState<TabType>(() => {
    if (typeof window !== 'undefined' && (window.location.hash.includes('sync=') || window.location.hash.includes('synced=1'))) {
      return 'portal';
    }
    return 'flashcards';
  });
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [dicteeMode, setDicteeMode] = useState<'dictee' | 'oral'>('dictee');
  const [syncSuccessMsg, setSyncSuccessMsg] = useState<string | null>(null);

  // Árvore de Habilidades & Conquistas (galhos/folhas relidos a cada render,
  // para refletir o que a professora criar no painel)
  const skillBranches = skillTreeService.getBranches();
  const skillLeaves = skillTreeService.getLeaves();
  const [skillProgress, setSkillProgress] = useState<Record<string, LeafProgress>>(() => skillTreeService.getProgress());
  const [unlockedBadges, setUnlockedBadges] = useState<Record<string, string>>(() => skillTreeService.getUnlockedBadges());

  const handleSkillInProgress = (leafId: string) => {
    skillTreeService.markInProgress(leafId);
    setSkillProgress(skillTreeService.getProgress());
  };

  const handleSkillDominated = (leafId: string): AchievementBadge[] => {
    const newBadges = skillTreeService.markDominated(leafId);
    setSkillProgress(skillTreeService.getProgress());
    if (newBadges.length > 0) {
      setUnlockedBadges(skillTreeService.getUnlockedBadges());
    }
    return newBadges;
  };

  // Portal session
  const [session, setSession] = useState<AuthSession>(() => studentPortalService.getCurrentSession());

  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash.includes('synced=1')) {
      setActiveTab('portal');
      setSession(studentPortalService.getCurrentSession());
      setSyncSuccessMsg('🎉 Sincronização concluída com sucesso! Seus alunos foram importados para este dispositivo.');
      setTimeout(() => setSyncSuccessMsg(null), 7000);
      if (window.history && window.history.replaceState) {
        window.history.replaceState(null, '', window.location.pathname);
      }
    }
  }, []);

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

  // Avalia badges automáticos (marcos, sequência, desempenho) ao visitar a árvore
  // ou quando o progresso do aluno muda.
  useEffect(() => {
    const before = skillTreeService.getUnlockedBadges();
    const after = skillTreeService.evaluateBadges({
      knownCardCount: knownCards.length,
      activityLog: session.currentUser?.activityLog ?? [],
    });
    if (Object.keys(after).length !== Object.keys(before).length) {
      setUnlockedBadges(after);
    }
  }, [activeTab, knownCards, session.currentUser]);

  const handleMarkKnown = (cardId: string) => {
    if (!knownCards.includes(cardId)) {
      setKnownCards((prev) => [...prev, cardId]);
      setReviewCards((prev) => prev.filter((id) => id !== cardId));
      setTotalPoints((prev) => prev + 15);
      if (session.currentUser) {
        studentPortalService.recordStudentActivity(session.currentUser.id, {
          type: 'flashcards',
          title: 'Flashcard dominado',
          points: 15,
        });
      }
    }
  };

  const handleMarkReview = (cardId: string) => {
    if (!reviewCards.includes(cardId)) {
      setReviewCards((prev) => [...prev, cardId]);
      setKnownCards((prev) => prev.filter((id) => id !== cardId));
    }
  };

  const handleQuizComplete = (score: number, total?: number) => {
    const earned = score * 25;
    setTotalPoints((prev) => prev + earned);
    if (session.currentUser) {
      studentPortalService.recordStudentActivity(session.currentUser.id, {
        type: 'quiz',
        title: 'Quiz de fixação',
        score,
        total,
        points: earned,
      });
    }
  };

  const handleCompleteDictee = (_id: string, correct: boolean) => {
    if (correct) {
      setTotalPoints((prev) => prev + 25);
      if (session.currentUser) {
        studentPortalService.recordStudentActivity(session.currentUser.id, {
          type: 'dictee',
          title: 'Dictée concluída',
          points: 25,
        });
      }
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

  // Catálogo de prática: programa fixo + o que a Melissa criou para todos.
  // Conteúdo de uma semana específica só existe dentro da lição daquela aula,
  // no Espaço do Aluno — aqui ele nunca se mistura com o catálogo.
  const allCards = flashcardService.getFlashcards();
  const allQuizzes = quizService.getQuizzes();
  const allDictees = dicteeService.getDictees();
  const currentCards = allCards.filter((c) => c.level === currentLevel);
  const currentQuizzes = allQuizzes.filter((q) => q.level === currentLevel);
  const currentDictees = allDictees.filter((d) => d.level === currentLevel);

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

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-8 sm:space-y-12 pb-16">
        {syncSuccessMsg && (
          <div className="p-4 rounded-2xl bg-emerald-700 text-white shadow-lg flex items-center justify-between gap-3 text-xs sm:text-sm font-bold animate-in fade-in">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-5 h-5 text-amber-300 shrink-0" />
              <span>{syncSuccessMsg}</span>
            </div>
            <button
              type="button"
              onClick={() => setSyncSuccessMsg(null)}
              className="text-white/80 hover:text-white p-1 text-sm font-bold"
            >
              ✕
            </button>
          </div>
        )}

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
                    {activeTab === 'dictee' && "Dictée & Entraînement à l'oral"}
                    {activeTab === 'fiches' && 'Fiches Mémo da Professora'}
                    {activeTab === 'revisions' && 'Meu Plano de Revisão Personalizado'}
                    {activeTab === 'skilltree' && 'Árvore de Habilidades & Conquistas'}
                  </h2>
                  <p className="text-xs text-[#78644E] mt-1 max-w-2xl leading-relaxed">
                    Conteúdo do programa e materiais liberados pela Melissa. A lição exclusiva de
                    cada semana fica no Espaço do Aluno, dentro da aula correspondente.
                  </p>
                </div>

                {/* O nível é escolhido num lugar só: os cartões de níveis acima. */}
                <button
                  type="button"
                  onClick={scrollToLevelsArea}
                  className="text-xs font-bold text-[#8B2626] hover:underline self-start sm:self-auto shrink-0"
                >
                  Trocar nível ↑
                </button>
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
                  <div className="space-y-6">
                    <div className="flex justify-center">
                      <div className="flex bg-white p-1 rounded-xl border border-[#EBE4D8] text-xs font-semibold shadow-2xs">
                        <button
                          type="button"
                          onClick={() => setDicteeMode('dictee')}
                          className={`px-4 py-1.5 rounded-lg transition-all ${
                            dicteeMode === 'dictee'
                              ? 'bg-[#8B2626] text-white shadow-2xs'
                              : 'text-[#5A6578] hover:text-[#0F172A]'
                          }`}
                        >
                          Dictée (escrita)
                        </button>
                        <button
                          type="button"
                          onClick={() => setDicteeMode('oral')}
                          className={`px-4 py-1.5 rounded-lg transition-all ${
                            dicteeMode === 'oral'
                              ? 'bg-[#8B2626] text-white shadow-2xs'
                              : 'text-[#5A6578] hover:text-[#0F172A]'
                          }`}
                        >
                          Entraînement à l'oral
                        </button>
                      </div>
                    </div>

                    {dicteeMode === 'dictee' ? (
                      <DicteeView
                        items={currentDictees}
                        currentLevel={currentLevel}
                        onCompleteDictee={handleCompleteDictee}
                      />
                    ) : (
                      <OralView
                        items={currentDictees}
                        currentLevel={currentLevel}
                      />
                    )}
                  </div>
                )}

                {activeTab === 'skilltree' && (
                  <div className="space-y-8">
                    <SkillTreeView
                      branches={skillBranches}
                      leaves={skillLeaves}
                      progress={skillProgress}
                      currentLevel={currentLevel}
                      cards={allCards}
                      quizzes={allQuizzes}
                      knownCardIds={knownCards}
                      onMarkKnown={handleMarkKnown}
                      onMarkReview={handleMarkReview}
                      onQuizComplete={handleQuizComplete}
                      onMarkInProgress={handleSkillInProgress}
                      onMarkDominated={handleSkillDominated}
                      onSelectTab={(tab) => {
                        setActiveTab(tab as typeof activeTab);
                        scrollToStudyArea();
                      }}
                    />
                    <AchievementsPanel
                      badges={skillTreeService.getBadges()}
                      unlocked={unlockedBadges}
                      branches={skillBranches}
                    />
                  </div>
                )}

                {activeTab === 'fiches' && (
                  <FichesView fiches={FICHES_DATA} currentLevel={currentLevel} />
                )}

                {activeTab === 'revisions' && (
                  <RevisionsView
                    cards={allCards}
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
          <p className="text-[#8C7A6B]">
            © {new Date().getFullYear()} Français avec Melissa. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
