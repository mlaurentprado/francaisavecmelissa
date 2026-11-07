import {
  AchievementBadge,
  LeafProgress,
  SkillBranch,
  SkillLeaf,
} from '../types';
import { SKILL_BADGES, SKILL_BRANCHES, SKILL_LEAVES } from '../data/skillTreeData';

/**
 * Árvore de Habilidades & Conquistas.
 *
 * - O conteúdo "fixo" (exemplo preenchido) vive em src/data/skillTreeData.ts.
 * - O que a professora cria no painel (aba "Árvore") é salvo no navegador
 *   (fam_teacher_skill_tree_v1) e MESCLADO com o conteúdo fixo, seguindo o
 *   mesmo padrão de flashcards/quizzes/dictées.
 * - O progresso do aluno é derivado de fam_skill_progress_v1
 *   (em progresso / dominada, com data) e os badges de
 *   fam_skill_badges_v1 (data de desbloqueio).
 */

const TEACHER_TREE_KEY = 'fam_teacher_skill_tree_v1';
const PROGRESS_KEY = 'fam_skill_progress_v1';
const BADGES_KEY = 'fam_skill_badges_v1';

interface TeacherTree {
  branches: SkillBranch[];
  leaves: SkillLeaf[];
}

const EMPTY_TEACHER_TREE: TeacherTree = { branches: [], leaves: [] };

function readTeacherTree(): TeacherTree {
  try {
    const raw = localStorage.getItem(TEACHER_TREE_KEY);
    if (!raw) return { ...EMPTY_TEACHER_TREE };
    const parsed = JSON.parse(raw) as Partial<TeacherTree>;
    return {
      branches: Array.isArray(parsed.branches) ? parsed.branches : [],
      leaves: Array.isArray(parsed.leaves) ? parsed.leaves : [],
    };
  } catch {
    return { ...EMPTY_TEACHER_TREE };
  }
}

function writeTeacherTree(tree: TeacherTree) {
  localStorage.setItem(TEACHER_TREE_KEY, JSON.stringify(tree));
}

export const skillTreeService = {
  // --- LEITURA (conteúdo fixo + conteúdo da professora) ---

  getBranches(): SkillBranch[] {
    const teacher = readTeacherTree();
    return [...SKILL_BRANCHES, ...teacher.branches].sort((a, b) => a.order - b.order);
  },

  getLeaves(): SkillLeaf[] {
    const teacher = readTeacherTree();
    const branchIds = new Set(this.getBranches().map((b) => b.id));
    return [...SKILL_LEAVES, ...teacher.leaves]
      .filter((l) => branchIds.has(l.branchId))
      .sort((a, b) => a.order - b.order);
  },

  getBadges(): AchievementBadge[] {
    return SKILL_BADGES;
  },

  getTeacherContent(): TeacherTree {
    return readTeacherTree();
  },

  // --- CRUD DA PROFESSORA (galhos e folhas) ---

  addBranch(data: Omit<SkillBranch, 'id'>): SkillBranch {
    const teacher = readTeacherTree();
    const branch: SkillBranch = { ...data, id: `branch-${Date.now()}` };
    writeTeacherTree({ ...teacher, branches: [...teacher.branches, branch] });
    return branch;
  },

  updateBranch(id: string, data: Omit<SkillBranch, 'id'>) {
    const teacher = readTeacherTree();
    writeTeacherTree({
      ...teacher,
      branches: teacher.branches.map((b) => (b.id === id ? { ...data, id } : b)),
    });
  },

  deleteBranch(id: string) {
    const teacher = readTeacherTree();
    writeTeacherTree({
      branches: teacher.branches.filter((b) => b.id !== id),
      leaves: teacher.leaves.filter((l) => l.branchId !== id),
    });
  },

  addLeaf(data: Omit<SkillLeaf, 'id'>): SkillLeaf {
    const teacher = readTeacherTree();
    const leaf: SkillLeaf = { ...data, id: `leaf-${Date.now()}` };
    writeTeacherTree({ ...teacher, leaves: [...teacher.leaves, leaf] });
    return leaf;
  },

  updateLeaf(id: string, data: Omit<SkillLeaf, 'id'>) {
    const teacher = readTeacherTree();
    writeTeacherTree({
      ...teacher,
      leaves: teacher.leaves.map((l) => (l.id === id ? { ...data, id } : l)),
    });
  },

  deleteLeaf(id: string) {
    const teacher = readTeacherTree();
    writeTeacherTree({ ...teacher, leaves: teacher.leaves.filter((l) => l.id !== id) });
  },

  // --- PROGRESSO DO ALUNO ---

  getProgress(): Record<string, LeafProgress> {
    try {
      const raw = localStorage.getItem(PROGRESS_KEY);
      return raw ? (JSON.parse(raw) as Record<string, LeafProgress>) : {};
    } catch {
      return {};
    }
  },

  /** Marca uma folha como "em progresso" (🌱). */
  markInProgress(leafId: string) {
    const progress = this.getProgress();
    if (progress[leafId]?.status === 'dominated') return;
    progress[leafId] = { status: 'in_progress', date: new Date().toISOString() };
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  },

  /** Marca uma folha como dominada (🌸) e retorna os badges recém-desbloqueados. */
  markDominated(leafId: string): AchievementBadge[] {
    const progress = this.getProgress();
    progress[leafId] = { status: 'dominated', date: new Date().toISOString() };
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));

    const before = this.getUnlockedBadges();
    this.evaluateBadges({ progress });
    const after = this.getUnlockedBadges();
    const newlyUnlocked = this.getBadges().filter(
      (b) => after[b.id] && !before[b.id]
    );
    return newlyUnlocked;
  },

  // --- BADGES / CONQUISTAS ---

  getUnlockedBadges(): Record<string, string> {
    try {
      const raw = localStorage.getItem(BADGES_KEY);
      return raw ? (JSON.parse(raw) as Record<string, string>) : {};
    } catch {
      return {};
    }
  },

  /**
   * Avalia as condições dos badges e grava a data de desbloqueio dos novos.
   * Context (opcional) alimenta os badges de marcos/desempenho.
   */
  evaluateBadges(ctx: {
    progress?: Record<string, LeafProgress>;
    knownCardCount?: number;
    activityLog?: { type: string; score?: number; total?: number; at?: string }[];
  }): Record<string, string> {
    const unlocked = this.getUnlockedBadges();
    const now = new Date().toISOString();
    const progress = ctx.progress ?? this.getProgress();
    const leaves = this.getLeaves();

    for (const badge of this.getBadges()) {
      if (unlocked[badge.id]) continue;

      let achieved = false;

      if (badge.kind === 'branch' && badge.branchId) {
        const branchLeaves = leaves.filter((l) => l.branchId === badge.branchId);
        achieved =
          branchLeaves.length > 0 &&
          branchLeaves.every((l) => progress[l.id]?.status === 'dominated');
      } else if (badge.kind === 'tree') {
        achieved =
          leaves.length > 0 && leaves.every((l) => progress[l.id]?.status === 'dominated');
      } else if (badge.kind === 'streak') {
        achieved = computeStreakDays(ctx.activityLog ?? []) >= (badge.threshold ?? 1);
      } else if (badge.kind === 'milestone') {
        achieved = (ctx.knownCardCount ?? 0) >= (badge.threshold ?? 1);
      } else if (badge.kind === 'performance') {
        achieved = (ctx.activityLog ?? []).some(
          (a) => a.type === 'quiz' && a.total != null && a.score === a.total
        );
      }

      if (achieved) unlocked[badge.id] = now;
    }

    localStorage.setItem(BADGES_KEY, JSON.stringify(unlocked));
    return unlocked;
  },
};

/** Dias consecutivos de atividade, terminando hoje ou ontem. */
function computeStreakDays(
  activityLog: { at?: string }[]
): number {
  const days = new Set(
    activityLog
      .filter((a) => a.at)
      .map((a) => new Date(a.at as string).toDateString())
  );
  if (days.size === 0) return 0;

  let streak = 0;
  const cursor = new Date();
  // Permite que o streak continue válido se o aluno ainda não praticou hoje.
  if (!days.has(cursor.toDateString())) cursor.setDate(cursor.getDate() - 1);
  while (days.has(cursor.toDateString())) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}
