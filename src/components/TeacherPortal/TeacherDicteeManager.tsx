import React, { useState } from 'react';
import { DicteeItem, Level } from '../../types';
import { dicteeService } from '../../services/dicteeService';
import { Plus, Edit2, Trash2, Sparkles, X, Volume2 } from 'lucide-react';
import { speechService } from '../../services/speech';

interface TeacherDicteeManagerProps {
  /** Called with the full custom list after every mutation (for the tab counter). */
  onChange?: (dictees: DicteeItem[]) => void;
}

interface DicteeForm {
  level: Level;
  sentence: string;
  translation: string;
  hint: string;
  difficulty: DicteeItem['difficulty'];
}

const EMPTY_FORM: DicteeForm = {
  level: 'A1',
  sentence: '',
  translation: '',
  hint: '',
  difficulty: 'facile',
};

const DIFFICULTY_LABELS: Record<DicteeItem['difficulty'], string> = {
  facile: 'Facile',
  moyen: 'Moyen',
  avance: 'Avancé',
};

export const TeacherDicteeManager: React.FC<TeacherDicteeManagerProps> = ({ onChange }) => {
  const [dictees, setDictees] = useState<DicteeItem[]>(() => dicteeService.getCustomDictees());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDictee, setEditingDictee] = useState<DicteeItem | null>(null);
  const [form, setForm] = useState<DicteeForm>(EMPTY_FORM);

  const notify = (list: DicteeItem[]) => {
    setDictees(list);
    onChange?.(list);
  };

  const handleOpenModal = (dictee?: DicteeItem) => {
    if (dictee) {
      setEditingDictee(dictee);
      setForm({
        level: dictee.level,
        sentence: dictee.sentence,
        translation: dictee.translation,
        hint: dictee.hint,
        difficulty: dictee.difficulty,
      });
    } else {
      setEditingDictee(null);
      setForm(EMPTY_FORM);
    }
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.sentence.trim() || !form.translation.trim()) return;

    const data: Omit<DicteeItem, 'id'> = {
      level: form.level,
      sentence: form.sentence.trim(),
      translation: form.translation.trim(),
      hint: form.hint.trim(),
      difficulty: form.difficulty,
    };

    if (editingDictee) {
      dicteeService.updateDictee(editingDictee.id, data);
    } else {
      dicteeService.addDictee(data);
    }

    notify(dicteeService.getCustomDictees());
    setIsModalOpen(false);
    setEditingDictee(null);
  };

  const handleDelete = (dictee: DicteeItem) => {
    if (confirm(`Excluir a dictée "${dictee.sentence.slice(0, 40)}…"?`)) {
      dicteeService.deleteDictee(dictee.id);
      notify(dicteeService.getCustomDictees());
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#FAF7F2] p-4 rounded-2xl border border-[#EBE4D8]">
        <div className="space-y-0.5">
          <h4 className="font-bold text-sm text-[#0F172A] flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#8B2626]" />
            <span>Minhas Dictées ({dictees.length})</span>
          </h4>
          <p className="text-xs text-[#5A6578]">
            Crie dictações de escrita para treinar ortografia e acordos. Elas aparecem na área de estudos dos alunos, junto com as dictées fixas do programa, no nível que você escolher.
          </p>
        </div>

        <button
          type="button"
          onClick={() => handleOpenModal()}
          className="py-2.5 px-4 rounded-xl bg-[#8B2626] hover:bg-[#731E1E] text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1.5 self-start sm:self-auto shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>+ Nova Dictée</span>
        </button>
      </div>

      {dictees.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#EBE4D8] p-8 text-center space-y-3">
          <p className="text-sm text-[#5A6578]">
            Você ainda não criou dictées próprias. As dictées fixas do programa já estão disponíveis na área de estudos.
          </p>
          <button
            type="button"
            onClick={() => handleOpenModal()}
            className="py-2.5 px-5 rounded-xl bg-[#8B2626] hover:bg-[#731E1E] text-white text-xs font-bold transition-all shadow-xs"
          >
            + Criar Minha Primeira Dictée
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {dictees.map((dictee) => (
            <div
              key={dictee.id}
              className="bg-white rounded-2xl border border-[#EBE4D8] p-5 shadow-2xs space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#EFE8DC] text-[#63513D]">
                    Nível {dictee.level}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#FAF7F2] text-[#78644E] border border-[#DDD3C1]">
                    {DIFFICULTY_LABELS[dictee.difficulty]}
                  </span>
                </div>

                <p className="font-cormorant text-xl font-bold text-[#0F172A] leading-tight">
                  « {dictee.sentence} »
                </p>

                <p className="text-xs italic text-[#5A6578]">— {dictee.translation}</p>

                {dictee.hint && (
                  <p className="text-[11px] text-[#78644E] border-t border-[#F2ECE3] pt-2">
                    <strong>Dica:</strong> {dictee.hint}
                  </p>
                )}
              </div>

              <div className="pt-2 border-t border-[#F2ECE3] flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => speechService.speak(dictee.sentence)}
                  className="p-2 rounded-xl border border-[#D4C8B8] hover:bg-[#FCE7E7] text-[#8B2626] transition-colors shrink-0"
                  title="Ouvir a frase"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleOpenModal(dictee)}
                  className="flex-1 py-2 px-3 rounded-xl border border-[#D4C8B8] hover:bg-[#FAF7F2] text-xs font-semibold text-[#8B2626] transition-colors flex items-center justify-center gap-1.5"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Editar</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(dictee)}
                  className="p-2 rounded-xl border border-rose-200 hover:bg-rose-50 text-rose-600 transition-colors shrink-0"
                  title="Excluir dictée"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl border border-[#EBE4D8] p-6 max-w-lg w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#EBE4D8] pb-3">
              <h4 className="font-cormorant text-2xl font-bold text-[#0F172A]">
                {editingDictee ? 'Editar Dictée' : 'Nova Dictée'}
              </h4>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3 text-left">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-[#0F172A] mb-1">
                    Nível :
                  </label>
                  <select
                    value={form.level}
                    onChange={(e) => setForm({ ...form, level: e.target.value as Level })}
                    className="w-full p-2.5 rounded-xl border border-[#D4C8B8] outline-none text-xs font-bold bg-white"
                  >
                    <option value="A1">A1 — Iniciante</option>
                    <option value="A2">A2 — Básico</option>
                    <option value="B1">B1/B2 — Intermediário</option>
                    <option value="C1">C1/C2 — Avançado</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0F172A] mb-1">
                    Dificuldade :
                  </label>
                  <select
                    value={form.difficulty}
                    onChange={(e) =>
                      setForm({ ...form, difficulty: e.target.value as DicteeItem['difficulty'] })
                    }
                    className="w-full p-2.5 rounded-xl border border-[#D4C8B8] outline-none text-xs font-bold bg-white"
                  >
                    <option value="facile">Facile</option>
                    <option value="moyen">Moyen</option>
                    <option value="avance">Avancé</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0F172A] mb-1">
                  Frase em francês :
                </label>
                <textarea
                  rows={2}
                  value={form.sentence}
                  onChange={(e) => setForm({ ...form, sentence: e.target.value })}
                  placeholder="Ex: Les enfants ont mangé une tarte aux pommes."
                  className="w-full p-2.5 rounded-xl border border-[#D4C8B8] outline-none text-xs font-bold bg-[#FAF7F2]/50"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0F172A] mb-1">
                  Tradução :
                </label>
                <textarea
                  rows={2}
                  value={form.translation}
                  onChange={(e) => setForm({ ...form, translation: e.target.value })}
                  placeholder="Ex: As crianças comeram uma torta de maçã."
                  className="w-full p-2.5 rounded-xl border border-[#D4C8B8] outline-none text-xs bg-[#FAF7F2]/50"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0F172A] mb-1">
                  Dica (opcional) :
                </label>
                <input
                  type="text"
                  value={form.hint}
                  onChange={(e) => setForm({ ...form, hint: e.target.value })}
                  placeholder="Ex: Atenção ao participe passé!"
                  className="w-full p-2.5 rounded-xl border border-[#D4C8B8] outline-none text-xs bg-[#FAF7F2]/50"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#EBE4D8]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="py-2.5 px-4 rounded-xl border border-[#D4C8B8] hover:bg-[#FAF7F2] text-xs font-semibold text-[#0F172A] transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="py-2.5 px-4 rounded-xl bg-[#8B2626] hover:bg-[#731E1E] text-white font-bold text-xs shadow-xs transition-all"
                >
                  {editingDictee ? 'Salvar Alterações' : 'Criar Dictée'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
