import React, { useState } from 'react';
import {
  AchievementBadge,
  LeafProgress,
  LeafStatus,
  Level,
  SkillBranch,
  SkillLeaf,
  TabType,
} from '../types';
import { Lock, Sprout, Flower2, Check, X, Sparkles, Eye, Ear, MessageSquare, PenLine } from 'lucide-react';
import confetti from 'canvas-confetti';

interface SkillTreeViewProps {
  branches: SkillBranch[];
  leaves: SkillLeaf[];
  progress: Record<string, LeafProgress>;
  unlockedBadges: Record<string, string>;
  currentLevel: Level;
  onMarkInProgress: (leafId: string) => void;
  onMarkDominated: (leafId: string) => AchievementBadge[];
  onSelectTab: (tab: TabType) => void;
}

const SKILL_ICON: Record<string, { icon: React.ReactNode; label: string }> = {
  ouvir: { icon: <Ear className="w-3 h-3" />, label: 'Ouvir' },
  falar: { icon: <MessageSquare className="w-3 h-3" />, label: 'Falar' },
  ler: { icon: <Eye className="w-3 h-3" />, label: 'Ler' },
  escrever: { icon: <PenLine className="w-3 h-3" />, label: 'Escrever' },
};

const ACTIVITY_LABEL: Record<string, string> = {
  flashcards: 'Flashcards',
  quiz: 'Quiz',
  dictee: 'Dictée',
};

/** Status derivado: dominada > em progresso > bloqueada (anterior não dominada). */
function getLeafStatus(
  leaf: SkillLeaf,
  leaves: SkillLeaf[],
  progress: Record<string, LeafProgress>
): LeafStatus {
  if (progress[leaf.id]?.status === 'dominated') return 'dominated';
  if (progress[leaf.id]?.status === 'in_progress') return 'in_progress';
  const siblings = leaves
    .filter((l) => l.branchId === leaf.branchId)
    .sort((a, b) => a.order - b.order);
  const index = siblings.findIndex((l) => l.id === leaf.id);
  if (index <= 0) return 'available';
  const previousDominated =
    progress[siblings[index - 1].id]?.status === 'dominated';
  return previousDominated ? 'available' : 'blocked';
}

export const SkillTreeView: React.FC<SkillTreeViewProps> = ({
  branches,
  leaves,
  progress,
  unlockedBadges,
  onMarkInProgress,
  onMarkDominated,
  onSelectTab,
}) => {
  const [selectedLeaf, setSelectedLeaf] = useState<SkillLeaf | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [newBadgeToast, setNewBadgeToast] = useState<AchievementBadge | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 4000);
  };

  const handleMarkInProgress = (leaf: SkillLeaf) => {
    onMarkInProgress(leaf.id);
    setSelectedLeaf(null);
    showToast('Nouvelle feuille débloquée ! 🌱 / Nova folha em progresso !');
  };

  const handleMarkDominated = (leaf: SkillLeaf) => {
    const newBadges = onMarkDominated(leaf.id);
    setSelectedLeaf(null);
    confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    showToast('Feuille dominée ! 🌸 / Folha dominada ! Parabéns ! ✨');
    if (newBadges.length > 0) {
      setNewBadgeToast(newBadges[0]);
      setTimeout(() => setNewBadgeToast(null), 6000);
      confetti({ particleCount: 140, spread: 100, origin: { y: 0.4 } });
    }
  };

  const dominatedCount = leaves.filter(
    (l) => progress[l.id]?.status === 'dominated'
  ).length;
  const treeComplete = leaves.length > 0 && dominatedCount === leaves.length;

  return (
    <div className="relative max-w-4xl mx-auto space-y-6">
      {/* TRONCO — eixo central */}
      <div className="relative bg-linear-to-b from-[#5C3A1E] to-[#7A5B3A] rounded-3xl p-6 text-white shadow-md overflow-hidden">
        <div className="absolute inset-0 opacity-10 text-[100px] leading-none flex items-center justify-center select-none">
          🌳
        </div>
        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[11px] uppercase tracking-widest text-amber-200/90 font-bold">
              Arbre de compétences • Tronco
            </span>
            <h3 className="font-cormorant text-3xl font-bold">
              Francês A1 → A2
            </h3>
            <p className="text-xs text-amber-100/80">
              {treeComplete
                ? '🌳 A árvore inteira floresceu ! Magnifique !'
                : `${dominatedCount} de ${leaves.length} folhas dominadas — continue, chaque feuille compte !`}
            </p>
          </div>
          <div className="text-right space-y-1 shrink-0">
            <div className="text-3xl font-bold font-cormorant">
              {leaves.length > 0 ? Math.round((dominatedCount / leaves.length) * 100) : 0}%
            </div>
            <div className="w-36 h-2.5 rounded-full bg-white/20 overflow-hidden">
              <div
                className="h-full rounded-full bg-linear-to-r from-amber-300 to-rose-300 transition-all duration-500"
                style={{ width: `${leaves.length > 0 ? (dominatedCount / leaves.length) * 100 : 0}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* GALHOS */}
      {branches.map((branch) => {
        const branchLeaves = leaves
          .filter((l) => l.branchId === branch.id)
          .sort((a, b) => a.order - b.order);
        const branchDominated = branchLeaves.filter(
          (l) => progress[l.id]?.status === 'dominated'
        ).length;
        const branchComplete =
          branchLeaves.length > 0 && branchDominated === branchLeaves.length;

        return (
          <div
            key={branch.id}
            className={`relative bg-white rounded-3xl border p-5 sm:p-6 shadow-2xs transition-all ${
              branchComplete ? 'border-amber-300 ring-2 ring-amber-200' : 'border-[#EBE4D8]'
            }`}
            style={branchComplete ? { background: 'linear-gradient(135deg, #FFFDF6 0%, #FDF6E9 100%)' } : undefined}
          >
            {/* Cabineiro do galho */}
            <div className="flex items-center gap-3 pb-4 border-b border-[#F2ECE3]">
              <div
                className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl shrink-0"
                style={{ backgroundColor: `${branch.color}14`, border: `1.5px solid ${branch.color}40` }}
              >
                {branch.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-cormorant text-xl font-bold text-[#0F172A] flex items-center gap-2">
                  {branch.name}
                  {branchComplete && <span title="Galho florido !">🌸</span>}
                </h4>
                <p className="text-[11px] text-[#78644E] font-semibold">
                  Nível {branch.level} • {branchDominated}/{branchLeaves.length} folhas dominadas
                </p>
              </div>
              {branchComplete && unlockedBadges && (
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-200 shrink-0">
                  🌸 Floreći !
                </span>
              )}
            </div>

            {/* FOLHAS — cadeia com estados */}
            <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {branchLeaves.map((leaf, i) => {
                const status = getLeafStatus(leaf, leaves, progress);
                const done = status === 'dominated';
                const wip = status === 'in_progress';
                const blocked = status === 'blocked';

                return (
                  <button
                    key={leaf.id}
                    type="button"
                    onClick={() => setSelectedLeaf(leaf)}
                    className={`text-left p-3.5 rounded-2xl border transition-all group ${
                      done
                        ? 'bg-emerald-50/70 border-emerald-200'
                        : wip
                          ? 'bg-amber-50/70 border-amber-200'
                          : blocked
                            ? 'bg-[#FAF7F2] border-[#EBE4D8] opacity-60 cursor-not-allowed'
                            : 'bg-white border-[#EBE4D8] hover:border-[#8B2626]/40 hover:shadow-sm'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span
                        className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                        style={
                          done
                            ? { backgroundColor: '#059669', color: 'white' }
                            : { backgroundColor: `${branch.color}14`, color: branch.color }
                        }
                      >
                        {done ? <Check className="w-3.5 h-3.5" /> : blocked ? <Lock className="w-3 h-3" /> : i + 1}
                      </span>
                      <span className="text-lg select-none">
                        {done ? '🌸' : wip ? '🌱' : blocked ? '🔒' : '🌿'}
                      </span>
                    </div>
                    <h5 className="font-bold text-xs text-[#0F172A] mt-2 leading-tight">
                      {leaf.title}
                    </h5>
                    <p className="text-[11px] text-[#5A6578] mt-1 line-clamp-2 leading-snug">
                      {leaf.description}
                    </p>
                    <span className="inline-flex items-center gap-1 mt-2 text-[10px] font-bold uppercase tracking-wide">
                      {done && <span className="text-emerald-700">Dominada</span>}
                      {wip && <span className="text-amber-700">Em progresso</span>}
                      {blocked && <span className="text-[#8C7A6B]">Bloqueada</span>}
                      {status === ('available' as LeafStatus) && (
                        <span style={{ color: branch.color }}>Disponível</span>
                      )}
                    </span>
                  </button>
                );
              })}
              {branchLeaves.length === 0 && (
                <p className="text-xs text-[#8C7A6B] col-span-full italic">
                  Nenhuma folha neste galho ainda — a professora vai adicionar em breve !
                </p>
              )}
            </div>
          </div>
        );
      })}

      {/* Toast de celebração */}
      {(toast || newBadgeToast) && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-fadeIn space-y-2">
          {newBadgeToast && (
            <div className="bg-white rounded-2xl border-2 border-amber-300 shadow-xl px-5 py-3 flex items-center gap-3">
              <span className="text-3xl">{newBadgeToast.icon}</span>
              <div>
                <p className="text-[11px] uppercase font-bold text-amber-600 tracking-wide">
                  Nouveau badge ! / Novo badge !
                </p>
                <p className="font-bold text-sm text-[#0F172A]">{newBadgeToast.name}</p>
              </div>
            </div>
          )}
          {toast && (
            <div className="bg-[#0F172A] text-white rounded-2xl shadow-xl px-5 py-3 text-xs font-bold text-center">
              {toast}
            </div>
          )}
        </div>
      )}

      {/* Modal de detalhe da folha */}
      {selectedLeaf && (() => {
        const status = getLeafStatus(selectedLeaf, leaves, progress);
        const branch = branches.find((b) => b.id === selectedLeaf.branchId);
        const blocked = status === 'blocked';
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
            <div className="bg-white rounded-3xl border border-[#EBE4D8] p-6 max-w-md w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-start justify-between gap-3 border-b border-[#EBE4D8] pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl select-none">{branch?.icon}</span>
                  <div>
                    <h4 className="font-cormorant text-2xl font-bold text-[#0F172A] leading-tight">
                      {selectedLeaf.title}
                    </h4>
                    <p className="text-[11px] text-[#78644E] font-semibold">
                      {branch?.name} • Nível {selectedLeaf.level}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedLeaf(null)}
                  className="p-1.5 rounded-full text-slate-400 hover:text-slate-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-[#5A6578]">{selectedLeaf.description}</p>

              {selectedLeaf.contents.length > 0 && (
                <div>
                  <p className="text-[10px] uppercase font-bold tracking-wider text-[#78644E] mb-1.5">
                    Conteúdos
                  </p>
                  <ul className="space-y-1">
                    {selectedLeaf.contents.map((c, i) => (
                      <li key={i} className="text-xs text-[#0F172A] flex items-start gap-1.5">
                        <Sprout className="w-3 h-3 mt-0.5 shrink-0" style={{ color: branch?.color }} />
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedLeaf.skills.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {selectedLeaf.skills.map((s) => (
                    <span
                      key={s}
                      className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#F4EFE6] text-[#63513D] text-[10px] font-bold border border-[#DDD3C1]"
                    >
                      {SKILL_ICON[s]?.icon}
                      {SKILL_ICON[s]?.label ?? s}
                    </span>
                  ))}
                </div>
              )}

              {selectedLeaf.linkedActivities.length > 0 && !blocked && (
                <div>
                  <p className="text-[10px] uppercase font-bold tracking-wider text-[#78644E] mb-1.5">
                    Praticar agora
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selectedLeaf.linkedActivities.map((act) => (
                      <button
                        key={act}
                        type="button"
                        onClick={() => {
                          setSelectedLeaf(null);
                          onSelectTab(act as TabType);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-[#8B2626]/5 text-[#8B2626] hover:bg-[#8B2626]/10 text-xs font-bold border border-[#8B2626]/20 transition-colors"
                      >
                        {ACTIVITY_LABEL[act] ?? act} →
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-[#FDF9EE] rounded-xl p-3 border border-[#EEDFB8]">
                <p className="text-[10px] uppercase font-bold tracking-wider text-[#7A5B18] mb-0.5 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Critério para dominar
                </p>
                <p className="text-xs text-[#7A5B18]">{selectedLeaf.criterion || 'Definido pela professora'}</p>
              </div>

              {blocked ? (
                <div className="bg-[#FAF7F2] rounded-xl p-3 border border-[#EBE4D8] text-center">
                  <p className="text-xs text-[#5A6578] font-semibold">
                    🔒 Dominou a folha anterior para desbloquear esta !
                  </p>
                </div>
              ) : status !== 'dominated' ? (
                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => handleMarkInProgress(selectedLeaf)}
                    className="flex-1 py-2.5 rounded-xl border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold transition-colors"
                  >
                    🌱 Estou praticando
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMarkDominated(selectedLeaf)}
                    className="flex-1 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Flower2 className="w-3.5 h-3.5" />
                    <span>J'ai maîtrisé ! 🌸</span>
                  </button>
                </div>
              ) : (
                <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-200 text-center">
                  <p className="text-xs text-emerald-800 font-bold">
                    🌸 Feuille dominée le {new Date(progress[selectedLeaf.id]?.date ?? '').toLocaleDateString('pt-BR')} — Beau travail !
                  </p>
                </div>
              )}
            </div>
          </div>
        );
      })()}
    </div>
  );
};
