import React, { useState } from 'react';
import { Level, SkillAbility, SkillBranch, SkillLeaf, LinkedActivity } from '../../types';
import { skillTreeService } from '../../services/skillTreeService';
import { Plus, Edit2, Trash2, TreePine, X, Layers } from 'lucide-react';

interface TeacherSkillTreeManagerProps {
  /** Recarrega a lista depois de cada mutação. */
  onChange?: () => void;
}

interface BranchForm {
  name: string;
  icon: string;
  color: string;
  order: number;
  level: Level;
}

interface LeafForm {
  branchId: string;
  title: string;
  description: string;
  contents: string;
  skills: SkillAbility[];
  linkedActivities: LinkedActivity[];
  criterion: string;
  level: Level;
  order: number;
}

const ALL_ABILITIES: { id: SkillAbility; label: string }[] = [
  { id: 'ouvir', label: 'Ouvir 👂' },
  { id: 'falar', label: 'Falar 🗣️' },
  { id: 'ler', label: 'Ler 👀' },
  { id: 'escrever', label: 'Escrever ✍️' },
];

const ALL_ACTIVITIES: { id: LinkedActivity; label: string }[] = [
  { id: 'flashcards', label: 'Flashcards' },
  { id: 'quiz', label: 'Quiz' },
  { id: 'dictee', label: 'Dictée' },
];

const EMPTY_BRANCH_FORM: BranchForm = {
  name: '',
  icon: '🌿',
  color: '#8B2626',
  order: 10,
  level: 'A1',
};

const EMPTY_LEAF_FORM: LeafForm = {
  branchId: '',
  title: '',
  description: '',
  contents: '',
  skills: [],
  linkedActivities: [],
  criterion: '',
  level: 'A1',
  order: 10,
};

export const TeacherSkillTreeManager: React.FC<TeacherSkillTreeManagerProps> = ({ onChange }) => {
  const [branches, setBranches] = useState<SkillBranch[]>(() => skillTreeService.getTeacherContent().branches);
  const [leaves, setLeaves] = useState<SkillLeaf[]>(() => skillTreeService.getTeacherContent().leaves);

  const [branchModalOpen, setBranchModalOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState<SkillBranch | null>(null);
  const [branchForm, setBranchForm] = useState<BranchForm>(EMPTY_BRANCH_FORM);

  const [leafModalOpen, setLeafModalOpen] = useState(false);
  const [editingLeaf, setEditingLeaf] = useState<SkillLeaf | null>(null);
  const [leafForm, setLeafForm] = useState<LeafForm>(EMPTY_LEAF_FORM);

  const refresh = () => {
    setBranches(skillTreeService.getTeacherContent().branches);
    setLeaves(skillTreeService.getTeacherContent().leaves);
    onChange?.();
  };

  const handleSaveBranch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!branchForm.name.trim()) return;
    const data = { ...branchForm, name: branchForm.name.trim() };
    if (editingBranch) {
      skillTreeService.updateBranch(editingBranch.id, data);
    } else {
      skillTreeService.addBranch(data);
    }
    refresh();
    setBranchModalOpen(false);
    setEditingBranch(null);
  };

  const handleDeleteBranch = (branch: SkillBranch) => {
    if (confirm(`Excluir o galho "${branch.name}" e todas as folhas dele?`)) {
      skillTreeService.deleteBranch(branch.id);
      refresh();
    }
  };

  const openLeafModal = (branchId: string, leaf?: SkillLeaf) => {
    setEditingLeaf(leaf ?? null);
    setLeafForm({
      ...EMPTY_LEAF_FORM,
      branchId,
      level: skillTreeService.getBranches().find((b) => b.id === branchId)?.level ?? 'A1',
      ...(leaf
        ? {
            title: leaf.title,
            description: leaf.description,
            contents: leaf.contents.join(' | '),
            skills: leaf.skills,
            linkedActivities: leaf.linkedActivities,
            criterion: leaf.criterion,
            level: leaf.level,
            order: leaf.order,
          }
        : {}),
    });
    setLeafModalOpen(true);
  };

  const handleSaveLeaf = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leafForm.title.trim() || !leafForm.branchId) return;
    const data = {
      branchId: leafForm.branchId,
      title: leafForm.title.trim(),
      description: leafForm.description.trim(),
      contents: leafForm.contents
        .split('|')
        .map((c) => c.trim())
        .filter(Boolean),
      skills: leafForm.skills,
      linkedActivities: leafForm.linkedActivities,
      criterion: leafForm.criterion.trim(),
      level: leafForm.level,
      order: leafForm.order,
    };
    if (editingLeaf) {
      skillTreeService.updateLeaf(editingLeaf.id, data);
    } else {
      skillTreeService.addLeaf(data);
    }
    refresh();
    setLeafModalOpen(false);
    setEditingLeaf(null);
  };

  const handleDeleteLeaf = (leaf: SkillLeaf) => {
    if (confirm(`Excluir a folha "${leaf.title}"?`)) {
      skillTreeService.deleteLeaf(leaf.id);
      refresh();
    }
  };

  const toggleSkill = (s: SkillAbility) => {
    setLeafForm((f) => ({
      ...f,
      skills: f.skills.includes(s) ? f.skills.filter((x) => x !== s) : [...f.skills, s],
    }));
  };

  const toggleActivity = (a: LinkedActivity) => {
    setLeafForm((f) => ({
      ...f,
      linkedActivities: f.linkedActivities.includes(a)
        ? f.linkedActivities.filter((x) => x !== a)
        : [...f.linkedActivities, a],
    }));
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#FAF7F2] p-4 rounded-2xl border border-[#EBE4D8]">
        <div className="space-y-0.5">
          <h4 className="font-bold text-sm text-[#0F172A] flex items-center gap-2">
            <TreePine className="w-4 h-4 text-[#8B2626]" />
            <span>Minha Árvore de Habilidades ({branches.length} galhos • {leaves.length} folhas)</span>
          </h4>
          <p className="text-xs text-[#5A6578]">
            Adicione galhos (macro-habilidades) e folhas (conteúdos) que seus alunos desbloqueiam ao longo do curso. Badges fixos ficam em <code>src/data/skillTreeData.ts</code>.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setEditingBranch(null);
            setBranchForm(EMPTY_BRANCH_FORM);
            setBranchModalOpen(true);
          }}
          className="py-2.5 px-4 rounded-xl bg-[#8B2626] hover:bg-[#731E1E] text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1.5 self-start sm:self-auto shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>+ Novo Galho</span>
        </button>
      </div>

      {branches.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#EBE4D8] p-8 text-center space-y-3">
          <TreePine className="w-10 h-10 text-[#D4C8B8] mx-auto" />
          <p className="text-sm text-[#5A6578]">
            Você ainda não criou galhos próprios. O exemplo fixo do programa (Gramática, Vocabulário e Cultura) já está visível na aba "Árvore" do app.
          </p>
          <button
            type="button"
            onClick={() => {
              setEditingBranch(null);
              setBranchForm(EMPTY_BRANCH_FORM);
              setBranchModalOpen(true);
            }}
            className="py-2.5 px-5 rounded-xl bg-[#8B2626] hover:bg-[#731E1E] text-white text-xs font-bold transition-all shadow-xs"
          >
            + Criar Meu Primeiro Galho
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {branches
            .slice()
            .sort((a, b) => a.order - b.order)
            .map((branch) => {
              const branchLeaves = leaves
                .filter((l) => l.branchId === branch.id)
                .sort((a, b) => a.order - b.order);
              return (
                <div key={branch.id} className="bg-white rounded-2xl border border-[#EBE4D8] p-5 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0"
                        style={{ backgroundColor: `${branch.color}14`, border: `1.5px solid ${branch.color}40` }}
                      >
                        {branch.icon}
                      </div>
                      <div className="min-w-0">
                        <h5 className="font-cormorant text-lg font-bold text-[#0F172A] truncate">
                          {branch.name}
                        </h5>
                        <p className="text-[11px] text-[#78644E] font-semibold">
                          Nível {branch.level} • ordem {branch.order} • {branchLeaves.length} folhas
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => openLeafModal(branch.id)}
                        className="py-1.5 px-3 rounded-xl bg-[#8B2626]/5 hover:bg-[#8B2626]/10 text-[#8B2626] text-xs font-bold transition-colors flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Folha</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingBranch(branch);
                          setBranchForm({
                            name: branch.name,
                            icon: branch.icon,
                            color: branch.color,
                            order: branch.order,
                            level: branch.level,
                          });
                          setBranchModalOpen(true);
                        }}
                        className="p-2 rounded-xl border border-[#D4C8B8] hover:bg-[#FAF7F2] text-[#8B2626]"
                        title="Editar galho"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteBranch(branch)}
                        className="p-2 rounded-xl border border-rose-200 hover:bg-rose-50 text-rose-600"
                        title="Excluir galho"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {branchLeaves.length > 0 && (
                    <ul className="space-y-1.5">
                      {branchLeaves.map((leaf) => (
                        <li
                          key={leaf.id}
                          className="flex items-center justify-between gap-3 bg-[#FAF7F2] rounded-xl px-3 py-2 border border-[#F2ECE3]"
                        >
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-[#0F172A] truncate">
                              {leaf.order}. {leaf.title}{' '}
                              <span className="text-[#78644E] font-semibold">({leaf.level})</span>
                            </p>
                            <p className="text-[11px] text-[#5A6578] truncate">{leaf.criterion}</p>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              type="button"
                              onClick={() => openLeafModal(branch.id, leaf)}
                              className="p-1.5 rounded-lg border border-[#D4C8B8] hover:bg-white text-[#8B2626]"
                              title="Editar folha"
                            >
                              <Edit2 className="w-3 h-3" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteLeaf(leaf)}
                              className="p-1.5 rounded-lg border border-rose-200 hover:bg-rose-50 text-rose-600"
                              title="Excluir folha"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
        </div>
      )}

      {/* Modal Galho */}
      {branchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl border border-[#EBE4D8] p-6 max-w-md w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#EBE4D8] pb-3">
              <h4 className="font-cormorant text-2xl font-bold text-[#0F172A]">
                {editingBranch ? 'Editar Galho' : 'Novo Galho'}
              </h4>
              <button type="button" onClick={() => setBranchModalOpen(false)} className="p-1.5 rounded-full text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSaveBranch} className="space-y-3 text-left">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-[#0F172A] mb-1">Nome :</label>
                  <input
                    type="text"
                    value={branchForm.name}
                    onChange={(e) => setBranchForm({ ...branchForm, name: e.target.value })}
                    placeholder="Ex: Compreensão Oral"
                    className="w-full p-2.5 rounded-xl border border-[#D4C8B8] outline-none text-xs font-bold bg-[#FAF7F2]/50"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#0F172A] mb-1">Ícone (emoji) :</label>
                  <input
                    type="text"
                    value={branchForm.icon}
                    onChange={(e) => setBranchForm({ ...branchForm, icon: e.target.value })}
                    placeholder="🎧"
                    className="w-full p-2.5 rounded-xl border border-[#D4C8B8] outline-none text-xs font-bold bg-[#FAF7F2]/50"
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-bold text-[#0F172A] mb-1">Cor :</label>
                  <input
                    type="color"
                    value={branchForm.color}
                    onChange={(e) => setBranchForm({ ...branchForm, color: e.target.value })}
                    className="w-full h-10 rounded-xl border border-[#D4C8B8] bg-white cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#0F172A] mb-1">Ordem :</label>
                  <input
                    type="number"
                    value={branchForm.order}
                    onChange={(e) => setBranchForm({ ...branchForm, order: Number(e.target.value) || 1 })}
                    className="w-full p-2.5 rounded-xl border border-[#D4C8B8] outline-none text-xs font-bold bg-[#FAF7F2]/50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#0F172A] mb-1">Nível :</label>
                  <select
                    value={branchForm.level}
                    onChange={(e) => setBranchForm({ ...branchForm, level: e.target.value as Level })}
                    className="w-full p-2.5 rounded-xl border border-[#D4C8B8] outline-none text-xs font-bold bg-white"
                  >
                    <option value="A1">A1</option>
                    <option value="A2">A2</option>
                    <option value="B1">B1</option>
                    <option value="C1">C1</option>
                  </select>
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#EBE4D8]">
                <button type="button" onClick={() => setBranchModalOpen(false)} className="py-2.5 px-4 rounded-xl border border-[#D4C8B8] hover:bg-[#FAF7F2] text-xs font-semibold text-[#0F172A]">
                  Cancelar
                </button>
                <button type="submit" className="py-2.5 px-4 rounded-xl bg-[#8B2626] hover:bg-[#731E1E] text-white font-bold text-xs shadow-xs">
                  {editingBranch ? 'Salvar Alterações' : 'Criar Galho'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Folha */}
      {leafModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl border border-[#EBE4D8] p-6 max-w-lg w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#EBE4D8] pb-3">
              <h4 className="font-cormorant text-2xl font-bold text-[#0F172A]">
                {editingLeaf ? 'Editar Folha' : 'Nova Folha'}
              </h4>
              <button type="button" onClick={() => setLeafModalOpen(false)} className="p-1.5 rounded-full text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSaveLeaf} className="space-y-3 text-left">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-[#0F172A] mb-1">Título :</label>
                  <input
                    type="text"
                    value={leafForm.title}
                    onChange={(e) => setLeafForm({ ...leafForm, title: e.target.value })}
                    placeholder="Ex: Verbo aller"
                    className="w-full p-2.5 rounded-xl border border-[#D4C8B8] outline-none text-xs font-bold bg-[#FAF7F2]/50"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#0F172A] mb-1">Ordem :</label>
                  <input
                    type="number"
                    value={leafForm.order}
                    onChange={(e) => setLeafForm({ ...leafForm, order: Number(e.target.value) || 1 })}
                    className="w-full p-2.5 rounded-xl border border-[#D4C8B8] outline-none text-xs font-bold bg-[#FAF7F2]/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0F172A] mb-1">Descrição curta :</label>
                <textarea
                  rows={2}
                  value={leafForm.description}
                  onChange={(e) => setLeafForm({ ...leafForm, description: e.target.value })}
                  placeholder="O que o aluno vai aprender nesta folha?"
                  className="w-full p-2.5 rounded-xl border border-[#D4C8B8] outline-none text-xs bg-[#FAF7F2]/50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0F172A] mb-1">
                  Conteúdos (separe com " | ") :
                </label>
                <input
                  type="text"
                  value={leafForm.contents}
                  onChange={(e) => setLeafForm({ ...leafForm, contents: e.target.value })}
                  placeholder="Conjugação au présent | Frases de viagem"
                  className="w-full p-2.5 rounded-xl border border-[#D4C8B8] outline-none text-xs bg-[#FAF7F2]/50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0F172A] mb-1">Habilidades trabalhadas :</label>
                <div className="flex flex-wrap gap-1.5">
                  {ALL_ABILITIES.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => toggleSkill(s.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                        leafForm.skills.includes(s.id)
                          ? 'bg-[#8B2626] text-white'
                          : 'bg-[#FAF7F2] text-[#5A6578] border border-[#D4C8B8] hover:bg-[#F4EFE6]'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0F172A] mb-1">Atividades vinculadas :</label>
                <div className="flex flex-wrap gap-1.5">
                  {ALL_ACTIVITIES.map((a) => (
                    <button
                      key={a.id}
                      type="button"
                      onClick={() => toggleActivity(a.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1 ${
                        leafForm.linkedActivities.includes(a.id)
                          ? 'bg-[#8B2626] text-white'
                          : 'bg-[#FAF7F2] text-[#5A6578] border border-[#D4C8B8] hover:bg-[#F4EFE6]'
                      }`}
                    >
                      <Layers className="w-3 h-3" />
                      {a.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-[#0F172A] mb-1">Critério de check :</label>
                  <input
                    type="text"
                    value={leafForm.criterion}
                    onChange={(e) => setLeafForm({ ...leafForm, criterion: e.target.value })}
                    placeholder='Ex: "80% no quiz + 10 flashcards"'
                    className="w-full p-2.5 rounded-xl border border-[#D4C8B8] outline-none text-xs bg-[#FAF7F2]/50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#0F172A] mb-1">Nível :</label>
                  <select
                    value={leafForm.level}
                    onChange={(e) => setLeafForm({ ...leafForm, level: e.target.value as Level })}
                    className="w-full p-2.5 rounded-xl border border-[#D4C8B8] outline-none text-xs font-bold bg-white"
                  >
                    <option value="A1">A1</option>
                    <option value="A2">A2</option>
                    <option value="B1">B1</option>
                    <option value="C1">C1</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#EBE4D8]">
                <button type="button" onClick={() => setLeafModalOpen(false)} className="py-2.5 px-4 rounded-xl border border-[#D4C8B8] hover:bg-[#FAF7F2] text-xs font-semibold text-[#0F172A]">
                  Cancelar
                </button>
                <button type="submit" className="py-2.5 px-4 rounded-xl bg-[#8B2626] hover:bg-[#731E1E] text-white font-bold text-xs shadow-xs">
                  {editingLeaf ? 'Salvar Alterações' : 'Criar Folha'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
