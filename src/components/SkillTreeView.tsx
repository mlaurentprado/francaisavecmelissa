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
import { LeafSprigs, TreeTrunkCanvas } from './SkillTreeConnections';

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

/** Emoji de estado na ponta de cada folha. */
const STATUS_EMOJI: Record<LeafStatus, string> = {
  available: '🌱',
  in_progress: '🌱',
  blocked: '🔒',
  dominated: '🌸',
};

/** Paleta do desenho de referência: contorno verde, galhos tan, fundo branco. */
const PALETTE = {
  moss: '#548C6A',
  mossDeep: '#3D6B50',
  mossSoft: '#7BA98C',
  terracotta: '#A98C63',
  gold: '#B09B7A',
  goldDeep: '#8A7554',
  cream: '#FCFBF7',
  creamDeep: '#F4EFE6',
  bark: '#E4DCCD',
  ink: '#3A362F',
  inkSoft: '#7B7367',
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
    <div className="relative max-w-4xl mx-auto">
      {/* COPA — topo do tronco */}
      <div
        className="relative rounded-[28px] px-6 py-5 overflow-hidden border-2 bg-white"
        style={{ borderColor: PALETTE.gold }}
      >
        <div className="absolute inset-0 opacity-[0.05] text-[100px] leading-none flex items-center justify-center select-none">
          🌳
        </div>
        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[11px] uppercase tracking-widest font-bold" style={{ color: PALETTE.moss }}>
              Arbre de compétences • Tronco
            </span>
            <h3 className="font-cormorant text-3xl font-bold" style={{ color: PALETTE.ink }}>
              Francês A1 → A2
            </h3>
            <p className="text-xs" style={{ color: PALETTE.inkSoft }}>
              {treeComplete
                ? '🌳 A árvore inteira floresceu ! Magnifique !'
                : `${dominatedCount} de ${leaves.length} folhas dominadas — continue, chaque feuille compte !`}
            </p>
          </div>
          <div className="text-right space-y-1 shrink-0">
            <div className="text-3xl font-bold font-cormorant" style={{ color: PALETTE.moss }}>
              {leaves.length > 0 ? Math.round((dominatedCount / leaves.length) * 100) : 0}%
            </div>
            <div
              className="w-36 h-2.5 rounded-full overflow-hidden border"
              style={{ background: PALETTE.creamDeep, borderColor: PALETTE.bark }}
            >
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${leaves.length > 0 ? (dominatedCount / leaves.length) * 100 : 0}%`,
                  background: PALETTE.moss,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* TRONCO principal + GALHOS — linhas desenhadas em SVG */}
      <TreeTrunkCanvas className="relative pl-14 sm:pl-24 pt-6 pb-2 space-y-6">
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
              <div key={branch.id} className="relative">
                <div
                  data-branch-card
                  data-branch-complete={branchComplete ? 'true' : 'false'}
                  className="relative rounded-3xl border bg-white p-4 sm:p-5 transition-all"
                  style={
                    branchComplete
                      ? { borderColor: PALETTE.moss, boxShadow: `0 0 0 3px ${PALETTE.moss}1F` }
                      : { borderColor: PALETTE.bark }
                  }
                >
                  {/* Cabeçalho do galho */}
                  <div className="flex items-center gap-3">
                    <div
                      className="w-11 h-11 rounded-full flex items-center justify-center text-xl shrink-0"
                      style={{ border: `1.5px solid ${PALETTE.moss}` }}
                    >
                      {branch.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-cormorant text-xl font-bold flex items-center gap-2" style={{ color: PALETTE.ink }}>
                        {branch.name}
                        {branchComplete && <span title="Galho carregado de frutos !">🍎</span>}
                      </h4>
                      <p className="text-[11px] font-semibold" style={{ color: PALETTE.inkSoft }}>
                        Nível {branch.level} • {branchDominated}/{branchLeaves.length} folhas dominadas
                      </p>
                    </div>
                    {branchComplete ? (
                      <span
                        className="text-[10px] font-bold px-2.5 py-1 rounded-full shrink-0 border bg-white"
                        style={{ color: PALETTE.moss, borderColor: PALETTE.moss }}
                      >
                        🍎 Galho completo !
                      </span>
                    ) : (
                      <span
                        className="text-[10px] font-bold px-2.5 py-1 rounded-full shrink-0 border bg-white"
                        style={{ color: PALETTE.goldDeep, borderColor: PALETTE.bark }}
                      >
                        {branchLeaves.length - branchDominated} restantes
                      </span>
                    )}
                  </div>

                  {/* FOLHAS — cards pendurados no galho (ramos desenhados em SVG) */}
                  <LeafSprigs>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-3 gap-y-6">
                    {branchLeaves.map((leaf, i) => {
                      const status = getLeafStatus(leaf, leaves, progress);
                      const done = status === 'dominated';
                      const wip = status === 'in_progress';
                      const blocked = status === 'blocked';

                      return (
                        <div key={leaf.id} className="relative">
                          <button
                            type="button"
                            data-leaf-card
                            data-leaf-blocked={blocked ? 'true' : 'false'}
                            onClick={() => setSelectedLeaf(leaf)}
                            className={`w-full h-full text-left p-3.5 rounded-2xl border transition-all group ${
                              blocked ? 'opacity-60 cursor-not-allowed' : 'hover:shadow-sm'
                            }`}
                            style={
                              done
                                ? { backgroundColor: '#FFFFFF', borderColor: PALETTE.moss }
                                : wip
                                  ? { backgroundColor: '#FFFFFF', borderColor: PALETTE.gold }
                                  : { backgroundColor: '#FFFFFF', borderColor: PALETTE.bark }
                            }
                          >
                            <div className="flex items-start justify-between gap-2">
                              <span
                                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                                style={
                                  done
                                    ? { border: `1.5px solid ${PALETTE.moss}`, color: PALETTE.moss }
                                    : blocked
                                      ? { border: `1.5px solid ${PALETTE.bark}`, color: '#A9A29A' }
                                      : { border: `1.5px solid ${PALETTE.gold}`, color: PALETTE.goldDeep }
                                }
                              >
                                {done ? <Check className="w-3.5 h-3.5" /> : blocked ? <Lock className="w-3 h-3" /> : i + 1}
                              </span>
                              {/* ícone de estado na ponta da folha */}
                              <span className="text-lg leading-none select-none">
                                {STATUS_EMOJI[status]}
                              </span>
                            </div>
                            <h5 className="font-bold text-xs mt-2 leading-tight" style={{ color: PALETTE.ink }}>
                              {leaf.title}
                            </h5>
                            <p className="text-[11px] mt-1 line-clamp-2 leading-snug" style={{ color: PALETTE.inkSoft }}>
                              {leaf.description}
                            </p>
                            <span className="inline-flex items-center gap-1 mt-2 text-[10px] font-bold uppercase tracking-wide">
                              {done && <span style={{ color: PALETTE.moss }}>Dominada</span>}
                              {wip && <span style={{ color: PALETTE.goldDeep }}>Em progresso</span>}
                              {blocked && <span style={{ color: '#A9A29A' }}>Bloqueada</span>}
                              {status === 'available' && (
                                <span style={{ color: PALETTE.moss }}>Disponível</span>
                              )}
                            </span>
                          </button>
                        </div>
                      );
                    })}
                    {branchLeaves.length === 0 && (
                      <p className="text-xs col-span-full italic" style={{ color: PALETTE.inkSoft }}>
                        Nenhuma folha neste galho ainda — a professora vai adicionar em breve !
                      </p>
                    )}
                  </div>
                  </LeafSprigs>
                </div>
              </div>
            );
          })}
      </TreeTrunkCanvas>

      {/* Toast de celebração */}
      {(toast || newBadgeToast) && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-fadeIn space-y-2">
          {newBadgeToast && (
            <div className="bg-white rounded-2xl border-2 shadow-xl px-5 py-3 flex items-center gap-3" style={{ borderColor: PALETTE.moss }}>
              <span className="text-3xl">{newBadgeToast.icon}</span>
              <div>
                <p className="text-[11px] uppercase font-bold tracking-wide" style={{ color: PALETTE.goldDeep }}>
                  Nouveau badge ! / Novo badge !
                </p>
                <p className="font-bold text-sm" style={{ color: PALETTE.ink }}>{newBadgeToast.name}</p>
              </div>
            </div>
          )}
          {toast && (
            <div
              className="text-white rounded-2xl shadow-xl px-5 py-3 text-xs font-bold text-center"
              style={{ backgroundColor: PALETTE.mossDeep }}
            >
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
            <div className="bg-white rounded-3xl border p-6 max-w-md w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto" style={{ borderColor: PALETTE.bark }}>
              <div className="flex items-start justify-between gap-3 border-b pb-3" style={{ borderColor: PALETTE.bark }}>
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl select-none">{branch?.icon}</span>
                  <div>
                    <h4 className="font-cormorant text-2xl font-bold leading-tight" style={{ color: PALETTE.ink }}>
                      {selectedLeaf.title}
                    </h4>
                    <p className="text-[11px] font-semibold" style={{ color: PALETTE.inkSoft }}>
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

              <p className="text-xs" style={{ color: PALETTE.inkSoft }}>{selectedLeaf.description}</p>

              {selectedLeaf.contents.length > 0 && (
                <div>
                  <p className="text-[10px] uppercase font-bold tracking-wider mb-1.5" style={{ color: PALETTE.inkSoft }}>
                    Conteúdos
                  </p>
                  <ul className="space-y-1">
                    {selectedLeaf.contents.map((c, i) => (
                      <li key={i} className="text-xs flex items-start gap-1.5" style={{ color: PALETTE.ink }}>
                        <Sprout className="w-3 h-3 mt-0.5 shrink-0" style={{ color: PALETTE.moss }} />
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
                      className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border"
                      style={{ backgroundColor: PALETTE.creamDeep, color: '#63513D', borderColor: '#DDD3C1' }}
                    >
                      {SKILL_ICON[s]?.icon}
                      {SKILL_ICON[s]?.label ?? s}
                    </span>
                  ))}
                </div>
              )}

              {selectedLeaf.linkedActivities.length > 0 && !blocked && (
                <div>
                  <p className="text-[10px] uppercase font-bold tracking-wider mb-1.5" style={{ color: PALETTE.inkSoft }}>
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
                        className="px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors"
                        style={{ backgroundColor: `${PALETTE.terracotta}12`, color: PALETTE.terracotta, borderColor: `${PALETTE.terracotta}38` }}
                      >
                        {ACTIVITY_LABEL[act] ?? act} →
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="rounded-xl p-3 border" style={{ backgroundColor: '#FBF5E4', borderColor: '#EEDFB8' }}>
                <p className="text-[10px] uppercase font-bold tracking-wider mb-0.5 flex items-center gap-1" style={{ color: '#7A5B18' }}>
                  <Sparkles className="w-3 h-3" /> Critério para dominar
                </p>
                <p className="text-xs" style={{ color: '#7A5B18' }}>{selectedLeaf.criterion || 'Definido pela professora'}</p>
              </div>

              {blocked ? (
                <div className="rounded-xl p-3 border text-center" style={{ backgroundColor: PALETTE.cream, borderColor: PALETTE.bark }}>
                  <p className="text-xs font-semibold" style={{ color: PALETTE.inkSoft }}>
                    🔒 Dominou a folha anterior para desbloquear esta !
                  </p>
                </div>
              ) : status !== 'dominated' ? (
                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => handleMarkInProgress(selectedLeaf)}
                    className="flex-1 py-2.5 rounded-xl border text-xs font-bold transition-colors"
                    style={{ borderColor: PALETTE.gold, backgroundColor: '#FFFFFF', color: PALETTE.goldDeep }}
                  >
                    🌱 Estou praticando
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMarkDominated(selectedLeaf)}
                    className="flex-1 py-2.5 rounded-xl text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                    style={{ backgroundColor: PALETTE.moss }}
                  >
                    <Flower2 className="w-3.5 h-3.5" />
                    <span>J'ai maîtrisé ! 🌸</span>
                  </button>
                </div>
              ) : (
                <div className="rounded-xl p-3 border text-center bg-white" style={{ borderColor: PALETTE.moss }}>
                  <p className="text-xs font-bold" style={{ color: PALETTE.moss }}>
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
