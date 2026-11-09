import React, { useEffect, useRef } from 'react';
import { TabType, AuthSession } from '../types';
import {
  Sparkles,
  Layers,
  HelpCircle,
  Headphones,
  BookOpen,
  Smartphone,
  BookmarkCheck,
  TreePine,
  User,
  GraduationCap,
  LogOut,
} from 'lucide-react';

interface HeaderProps {
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
  totalPoints: number;
  reviewCount: number;
  onOpenInstallModal: () => void;
  session: AuthSession;
  onOpenLoginModal: () => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  totalPoints,
  reviewCount,
  onOpenInstallModal,
  session,
  onOpenLoginModal,
  onLogout,
}) => {
  const isStudentLoggedIn = session.currentUser !== null;
  const isTeacherLoggedIn = session.isTeacher;

  // No celular a barra rola na horizontal: mantém a aba ativa à vista.
  const mobileNavRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const box = mobileNavRef.current;
    const active = box?.querySelector<HTMLElement>('[data-active="true"]');
    if (!box || !active) return;
    box.scrollTo({
      left: Math.max(active.offsetLeft - (box.clientWidth - active.clientWidth) / 2, 0),
      behavior: 'smooth',
    });
  }, [activeTab]);

  return (
    <header className="bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#EBE4D8] sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 sm:h-18 flex items-center justify-between gap-4">
          {/* Brand Logo with golden sparkle ✦ */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="flex items-center gap-1.5 cursor-pointer group" onClick={() => onSelectTab('flashcards')}>
              <span className="font-cormorant text-lg sm:text-xl font-bold text-[#0F172A] tracking-normal whitespace-nowrap group-hover:text-[#8B2626] transition-colors">
                Français avec Melissa
              </span>
              <span className="text-[#C59B27] text-base select-none">✦</span>
            </div>
            <span className="hidden lg:inline-block text-[11px] uppercase tracking-wider text-[#78644E] font-medium pl-2 border-l border-[#E3D9C9]">
              Espace Élèves
            </span>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden 2xl:flex items-center gap-4 lg:gap-6 text-sm font-medium text-[#4B5563]">
            {/* Espaço do Aluno Portal Tab */}
            <button
              onClick={() => {
                if (!isStudentLoggedIn && !isTeacherLoggedIn) {
                  onOpenLoginModal();
                } else {
                  onSelectTab('portal');
                }
              }}
              className={`transition-all relative py-1.5 flex items-center gap-1.5 ${
                activeTab === 'portal'
                  ? 'text-[#8B2626] font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#8B2626]'
                  : 'hover:text-[#0F172A]'
              }`}
            >
              <GraduationCap className="w-4 h-4 opacity-80 text-[#8B2626]" />
              <span className="font-bold text-[#8B2626]">Espaço do Aluno</span>
              {isStudentLoggedIn && (
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              )}
            </button>

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

            <button
              onClick={() => onSelectTab('skilltree')}
              className={`transition-all relative py-1.5 flex items-center gap-1.5 ${
                activeTab === 'skilltree'
                  ? 'text-[#8B2626] font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#8B2626]'
                  : 'hover:text-[#0F172A]'
              }`}
            >
              <TreePine className="w-4 h-4 opacity-70" />
              <span>Árvore</span>
            </button>
          </nav>

          {/* Right side: Login Status / Student Profile / Install / Points */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Install PWA Button */}
            <button
              type="button"
              onClick={onOpenInstallModal}
              title="Instalar no celular"
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-[#D4C8B8] hover:border-[#8B2626] hover:bg-[#F9F6F0] text-xs font-semibold text-[#0F172A] transition-all shadow-2xs"
            >
              <Smartphone className="w-3.5 h-3.5 text-[#8B2626]" />
              <span>App</span>
            </button>

            {/* Points pill */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F4EFE6] text-[#78644E] text-xs font-bold border border-[#E3D9C9] shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-[#C59B27]" />
              <span>{totalPoints} pts</span>
            </div>

            {/* Login / Profile Button */}
            {isStudentLoggedIn ? (
              <div className="flex items-center gap-2 bg-white px-2.5 py-1.5 rounded-xl border border-[#EBE4D8] shadow-2xs">
                <button
                  type="button"
                  onClick={() => onSelectTab('portal')}
                  className="flex items-center gap-1.5 text-xs font-bold text-[#0F172A] hover:text-[#8B2626]"
                >
                  <div className="w-6 h-6 rounded-full bg-[#8B2626] text-white flex items-center justify-center text-[10px] font-bold">
                    {session.currentUser?.name.charAt(0)}
                  </div>
                  <span className="hidden sm:inline">{session.currentUser?.name.split(' ')[0]}</span>
                </button>
                <button
                  type="button"
                  onClick={onLogout}
                  title="Sair do perfil"
                  className="p-1 text-slate-400 hover:text-slate-700"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : isTeacherLoggedIn ? (
              <div className="flex items-center gap-2 bg-[#0F1E36] text-white px-3 py-1.5 rounded-xl text-xs font-bold shadow-2xs">
                <button
                  type="button"
                  onClick={() => onSelectTab('portal')}
                  className="flex items-center gap-1 text-[#D4AF37]"
                >
                  <GraduationCap className="w-4 h-4" />
                  <span>Melissa</span>
                </button>
                <button
                  type="button"
                  onClick={onLogout}
                  title="Sair"
                  className="p-0.5 text-slate-300 hover:text-white"
                >
                  <LogOut className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={onOpenLoginModal}
                className="bg-[#8B2626] hover:bg-[#731E1E] text-white text-xs sm:text-sm font-semibold px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl transition-all shadow-xs hover:shadow-sm flex items-center gap-1.5 shrink-0"
              >
                <User className="w-3.5 h-3.5" />
                <span>Área do Aluno</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation Bar — rola na horizontal com os nomes completos */}
        <div className="2xl:hidden border-t border-[#EBE4D8] py-2">
          <div
            ref={mobileNavRef}
            className="flex items-center gap-1.5 overflow-x-auto no-scrollbar scroll-fade text-xs font-semibold"
          >
            <button
              onClick={() => {
                if (!isStudentLoggedIn && !isTeacherLoggedIn) {
                  onOpenLoginModal();
                } else {
                  onSelectTab('portal');
                }
              }}
              data-active={activeTab === 'portal'}
              className={`shrink-0 px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                activeTab === 'portal'
                  ? 'bg-[#8B2626] text-white'
                  : 'text-[#8B2626] font-bold bg-[#FCE7E7]'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Espaço Aluno</span>
            </button>

            <button
              onClick={() => onSelectTab('flashcards')}
              data-active={activeTab === 'flashcards'}
              className={`shrink-0 px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                activeTab === 'flashcards'
                  ? 'bg-[#8B2626] text-white'
                  : 'text-[#4B5563] hover:bg-[#F4EFE6]'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Flashcards</span>
            </button>

            <button
              onClick={() => onSelectTab('quiz')}
              data-active={activeTab === 'quiz'}
              className={`shrink-0 px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                activeTab === 'quiz'
                  ? 'bg-[#8B2626] text-white'
                  : 'text-[#4B5563] hover:bg-[#F4EFE6]'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Quizzes</span>
            </button>

            <button
              onClick={() => onSelectTab('dictee')}
              data-active={activeTab === 'dictee'}
              className={`shrink-0 px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors flex items-center gap-1.5 ${
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
              data-active={activeTab === 'fiches'}
              className={`shrink-0 px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors flex items-center gap-1.5 ${
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
              data-active={activeTab === 'revisions'}
              className={`shrink-0 px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                activeTab === 'revisions'
                  ? 'bg-[#8B2626] text-white'
                  : 'text-[#4B5563] hover:bg-[#F4EFE6]'
              }`}
            >
              <BookmarkCheck className="w-3.5 h-3.5" />
              <span>Revisões{reviewCount > 0 ? ` (${reviewCount})` : ''}</span>
            </button>

            <button
              onClick={() => onSelectTab('skilltree')}
              data-active={activeTab === 'skilltree'}
              className={`shrink-0 px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                activeTab === 'skilltree'
                  ? 'bg-[#8B2626] text-white'
                  : 'text-[#4B5563] hover:bg-[#F4EFE6]'
              }`}
            >
              <TreePine className="w-3.5 h-3.5" />
              <span>Árvore</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
