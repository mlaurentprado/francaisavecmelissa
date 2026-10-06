import React, { useState } from 'react';
import { QuizQuestion, Level } from '../../types';
import { quizService } from '../../services/quizService';
import { Plus, Edit2, Trash2, Sparkles, X, Check } from 'lucide-react';

interface TeacherQuizManagerProps {
  /** Called with the full custom list after every mutation (for the tab counter). */
  onChange?: (quizzes: QuizQuestion[]) => void;
}

interface QuizForm {
  level: Level;
  category: string;
  question: string;
  sentenceWithBlank: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  melissaTip: string;
}

const EMPTY_FORM: QuizForm = {
  level: 'A1',
  category: '',
  question: '',
  sentenceWithBlank: '',
  options: ['', '', '', ''],
  correctIndex: 0,
  explanation: '',
  melissaTip: '',
};

export const TeacherQuizManager: React.FC<TeacherQuizManagerProps> = ({ onChange }) => {
  const [quizzes, setQuizzes] = useState<QuizQuestion[]>(() => quizService.getCustomQuizzes());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState<QuizQuestion | null>(null);
  const [form, setForm] = useState<QuizForm>(EMPTY_FORM);

  const notify = (list: QuizQuestion[]) => {
    setQuizzes(list);
    onChange?.(list);
  };

  const handleOpenModal = (quiz?: QuizQuestion) => {
    if (quiz) {
      setEditingQuiz(quiz);
      const options = [...quiz.options];
      while (options.length < 4) options.push('');
      setForm({
        level: quiz.level,
        category: quiz.category,
        question: quiz.question,
        sentenceWithBlank: quiz.sentenceWithBlank || '',
        options: options.slice(0, 4),
        correctIndex: quiz.correctIndex,
        explanation: quiz.explanation,
        melissaTip: quiz.melissaTip || '',
      });
    } else {
      setEditingQuiz(null);
      setForm(EMPTY_FORM);
    }
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const correctText = form.options[form.correctIndex]?.trim();
    const options = form.options.map((o) => o.trim()).filter(Boolean);
    const correctIndex = options.findIndex((o) => o === correctText);

    if (!form.question.trim() || options.length < 2 || correctIndex < 0 || !form.explanation.trim()) {
      return;
    }

    const data: Omit<QuizQuestion, 'id'> = {
      level: form.level,
      category: form.category.trim() || 'Général',
      question: form.question.trim(),
      sentenceWithBlank: form.sentenceWithBlank.trim() || undefined,
      options,
      correctIndex,
      explanation: form.explanation.trim(),
      melissaTip: form.melissaTip.trim() || undefined,
    };

    if (editingQuiz) {
      quizService.updateQuiz(editingQuiz.id, data);
    } else {
      quizService.addQuiz(data);
    }

    notify(quizService.getCustomQuizzes());
    setIsModalOpen(false);
    setEditingQuiz(null);
  };

  const handleDelete = (quiz: QuizQuestion) => {
    if (confirm(`Excluir o quiz "${quiz.question.slice(0, 40)}…"?`)) {
      quizService.deleteQuiz(quiz.id);
      notify(quizService.getCustomQuizzes());
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#FAF7F2] p-4 rounded-2xl border border-[#EBE4D8]">
        <div className="space-y-0.5">
          <h4 className="font-bold text-sm text-[#0F172A] flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#8B2626]" />
            <span>Meus Quizzes ({quizzes.length})</span>
          </h4>
          <p className="text-xs text-[#5A6578]">
            Crie exercícios de múltipla escolha para fixação. Eles aparecem na área de estudos dos alunos, junto com os quizzes fixos do programa, no nível que você escolher.
          </p>
        </div>

        <button
          type="button"
          onClick={() => handleOpenModal()}
          className="py-2.5 px-4 rounded-xl bg-[#8B2626] hover:bg-[#731E1E] text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1.5 self-start sm:self-auto shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>+ Novo Quiz</span>
        </button>
      </div>

      {quizzes.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#EBE4D8] p-8 text-center space-y-3">
          <p className="text-sm text-[#5A6578]">
            Você ainda não criou quizzes próprios. Os quizzes fixos do programa já estão disponíveis na área de estudos.
          </p>
          <button
            type="button"
            onClick={() => handleOpenModal()}
            className="py-2.5 px-5 rounded-xl bg-[#8B2626] hover:bg-[#731E1E] text-white text-xs font-bold transition-all shadow-xs"
          >
            + Criar Meu Primeiro Quiz
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quizzes.map((quiz) => (
            <div
              key={quiz.id}
              className="bg-white rounded-2xl border border-[#EBE4D8] p-5 shadow-2xs space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#EFE8DC] text-[#63513D]">
                    Nível {quiz.level}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#FAF7F2] text-[#78644E] border border-[#DDD3C1]">
                    {quiz.category}
                  </span>
                </div>

                <h5 className="font-cormorant text-xl font-bold text-[#0F172A] leading-tight">
                  {quiz.question}
                </h5>

                {quiz.sentenceWithBlank && (
                  <p className="text-xs italic text-[#8C7A6B]">{quiz.sentenceWithBlank}</p>
                )}

                <ul className="space-y-1">
                  {quiz.options.map((option, i) => (
                    <li
                      key={i}
                      className={`text-xs flex items-center gap-1.5 rounded-lg px-2 py-1 ${
                        i === quiz.correctIndex
                          ? 'bg-emerald-50 text-emerald-800 font-bold border border-emerald-200'
                          : 'text-[#5A6578] border border-transparent'
                      }`}
                    >
                      {i === quiz.correctIndex && <Check className="w-3 h-3 shrink-0" />}
                      <span>{option}</span>
                    </li>
                  ))}
                </ul>

                <p className="text-[11px] text-[#5A6578] border-t border-[#F2ECE3] pt-2">
                  <strong>Explicação:</strong> {quiz.explanation}
                </p>
                {quiz.melissaTip && (
                  <p className="text-[11px] text-[#8B2626]">
                    <strong>Dica da Melissa:</strong> {quiz.melissaTip}
                  </p>
                )}
              </div>

              <div className="pt-2 border-t border-[#F2ECE3] flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleOpenModal(quiz)}
                  className="flex-1 py-2 px-3 rounded-xl border border-[#D4C8B8] hover:bg-[#FAF7F2] text-xs font-semibold text-[#8B2626] transition-colors flex items-center justify-center gap-1.5"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Editar</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(quiz)}
                  className="p-2 rounded-xl border border-rose-200 hover:bg-rose-50 text-rose-600 transition-colors shrink-0"
                  title="Excluir quiz"
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
                {editingQuiz ? 'Editar Quiz' : 'Novo Quiz'}
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
                    Categoria :
                  </label>
                  <input
                    type="text"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    placeholder="Ex: Grammaire (Articles)"
                    className="w-full p-2.5 rounded-xl border border-[#D4C8B8] outline-none text-xs font-bold bg-[#FAF7F2]/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0F172A] mb-1">
                  Pergunta :
                </label>
                <textarea
                  rows={2}
                  value={form.question}
                  onChange={(e) => setForm({ ...form, question: e.target.value })}
                  placeholder="Ex: Qual é a forma correta de...?"
                  className="w-full p-2.5 rounded-xl border border-[#D4C8B8] outline-none text-xs font-bold bg-[#FAF7F2]/50"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0F172A] mb-1">
                  Frase para completar (opcional) :
                </label>
                <input
                  type="text"
                  value={form.sentenceWithBlank}
                  onChange={(e) => setForm({ ...form, sentenceWithBlank: e.target.value })}
                  placeholder="Ex: Sophie et Lucas _____ brésiliens."
                  className="w-full p-2.5 rounded-xl border border-[#D4C8B8] outline-none text-xs bg-[#FAF7F2]/50"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-[#0F172A]">
                  Opções de resposta (marque a correta — preencha ao menos 2) :
                </label>
                {form.options.map((option, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="correct-option"
                      checked={form.correctIndex === i}
                      onChange={() => setForm({ ...form, correctIndex: i })}
                      className="accent-[#8B2626] w-4 h-4 shrink-0"
                      title="Marcar como resposta correta"
                    />
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => {
                        const options = [...form.options];
                        options[i] = e.target.value;
                        setForm({ ...form, options });
                      }}
                      placeholder={`Opção ${i + 1}`}
                      className="w-full p-2.5 rounded-xl border border-[#D4C8B8] outline-none text-xs font-bold bg-[#FAF7F2]/50"
                    />
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0F172A] mb-1">
                  Explicação :
                </label>
                <textarea
                  rows={2}
                  value={form.explanation}
                  onChange={(e) => setForm({ ...form, explanation: e.target.value })}
                  placeholder="Por que essa resposta é a correta?"
                  className="w-full p-2.5 rounded-xl border border-[#D4C8B8] outline-none text-xs bg-[#FAF7F2]/50"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0F172A] mb-1">
                  Dica da Melissa (opcional) :
                </label>
                <textarea
                  rows={2}
                  value={form.melissaTip}
                  onChange={(e) => setForm({ ...form, melissaTip: e.target.value })}
                  placeholder="Ex: Atenção à liaison!"
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
                  {editingQuiz ? 'Salvar Alterações' : 'Criar Quiz'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
