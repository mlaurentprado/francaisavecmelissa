import React, { useState } from 'react';
import { WeeklyModule, Level, WeeklyLessonContent, Flashcard, QuizQuestion, DicteeItem } from '../../types';
import { lessonGeneratorService } from '../../services/lessonGeneratorService';
import { studentPortalService } from '../../services/studentPortalService';
import { geminiService } from '../../services/geminiService';
import {
  X,
  Sparkles,
  Video,
  FileText,
  CheckCircle2,
  UserCheck,
  Key,
  Plus,
  Trash2,
  HelpCircle,
  Headphones,
  Layers,
  ExternalLink,
} from 'lucide-react';

interface WeekContentEditorProps {
  initialModule?: WeeklyModule;
  onSave: (moduleData: Omit<WeeklyModule, 'id' | 'createdAt'> & { id?: string }) => void;
  onCancel: () => void;
}

export const WeekContentEditor: React.FC<WeekContentEditorProps> = ({
  initialModule,
  onSave,
  onCancel,
}) => {
  const students = studentPortalService.getStudents();
  const [studentId, setStudentId] = useState<string>(
    initialModule?.studentId || (students[0]?.id ?? 'ALL')
  );
  const [weekNumber, setWeekNumber] = useState<number>(initialModule?.weekNumber || 1);
  const [title, setTitle] = useState<string>(initialModule?.title || '');
  const [level, setLevel] = useState<Level>(initialModule?.level || 'A1');
  const [dateStr, setDateStr] = useState<string>(
    initialModule?.date ||
      `Semana ${initialModule?.weekNumber || 1} • ${new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}`
  );
  const [summaryNotes, setSummaryNotes] = useState<string>(
    initialModule?.summaryNotes ||
      `### Resumo da Aula:\n- Ponto 1:\n- Ponto 2:\n- Expressão chave trabalhada:`
  );
  const [videoUrl, setVideoUrl] = useState<string>(initialModule?.videoUrl || '');
  const [videoTitle, setVideoTitle] = useState<string>(initialModule?.videoTitle || 'Gravação da Aula com a Melissa');
  const [pdfUrl, setPdfUrl] = useState<string>(initialModule?.pdfUrl || '');
  const [pdfFileName, setPdfFileName] = useState<string>(initialModule?.pdfFileName || 'Material_de_Apoio.pdf');

  // Lessons data state
  const [lessons, setLessons] = useState<WeeklyLessonContent>(
    initialModule?.lessons || {
      flashcards: [],
      quizzes: [],
      dictees: [],
    }
  );

  // Lesson Generator State
  const [rawNotes, setRawNotes] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [apiKey, setApiKey] = useState<string>(geminiService.getApiKey());
  const [showKeyInput, setShowKeyInput] = useState<boolean>(false);
  const [activeLessonTab, setActiveLessonTab] = useState<'flashcards' | 'quizzes' | 'dictees'>('flashcards');

  // Generate Lessons (Gemini AI or Strict local extraction)
  const handleGenerateLessons = async () => {
    if (!title.trim()) {
      alert('Por favor, informe o título ou tema da aula antes de gerar lições.');
      return;
    }

    setIsGenerating(true);

    try {
      if (apiKey.trim()) {
        geminiService.setApiKey(apiKey.trim());
        const generated = await geminiService.generateWeeklyLessons({
          theme: title,
          level,
          summaryNotes,
          rawVocabulary: rawNotes,
        });

        setLessons(generated);
        setActiveLessonTab('flashcards');
      } else {
        // Fallback local: extração estrita das anotações e vocabulário digitados
        const generated = lessonGeneratorService.generateLessonContent({
          theme: title,
          level,
          summaryNotes,
          rawVocabularyOrNotes: rawNotes,
        });

        if (generated.flashcards.length === 0) {
          alert(
            'Dica da Melissa:\n\n' +
              'Sem uma chave da IA configurada, o gerador precisa que você informe o vocabulário no formato "termo : tradução" (ex: "l\'addition : a conta") no campo abaixo ou nas anotações da aula.\n\n' +
              'Ou conecte sua chave gratuita do Google Gemini para a IA criar exercícios perfeitos automaticamente a partir do resumo!'
          );
        } else {
          setLessons(generated);
          setActiveLessonTab('flashcards');
        }
      }
    } catch (err: any) {
      console.error(err);
      alert(`Falha ao gerar com a IA: ${err.message || err}.\nTentando extração direta das anotações...`);
      const fallback = lessonGeneratorService.generateLessonContent({
        theme: title,
        level,
        summaryNotes,
        rawVocabularyOrNotes: rawNotes,
      });
      if (fallback.flashcards.length > 0) {
        setLessons(fallback);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPdfFileName(file.name);
      const reader = new FileReader();
      reader.onload = () => {
        setPdfUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // --- FLASHCARDS CRUD ---
  const handleAddFlashcard = () => {
    const newCard: Flashcard = {
      id: `custom-f-${Date.now()}`,
      level,
      category: title || 'Vocabulário',
      french: '',
      phonetic: '',
      portuguese: '',
      exampleFr: '',
      examplePt: '',
      tip: '',
    };
    setLessons((prev) => ({
      ...prev,
      flashcards: [...prev.flashcards, newCard],
    }));
  };

  const handleUpdateFlashcard = (index: number, updates: Partial<Flashcard>) => {
    setLessons((prev) => {
      const updated = [...prev.flashcards];
      updated[index] = { ...updated[index], ...updates };
      return { ...prev, flashcards: updated };
    });
  };

  const handleRemoveFlashcard = (index: number) => {
    setLessons((prev) => ({
      ...prev,
      flashcards: prev.flashcards.filter((_, i) => i !== index),
    }));
  };

  // --- QUIZZES CRUD ---
  const handleAddQuiz = () => {
    const newQuiz: QuizQuestion = {
      id: `custom-q-${Date.now()}`,
      level,
      category: title || 'Gramática',
      question: '',
      options: ['', '', '', ''],
      correctIndex: 0,
      explanation: '',
      melissaTip: '',
    };
    setLessons((prev) => ({
      ...prev,
      quizzes: [...prev.quizzes, newQuiz],
    }));
  };

  const handleUpdateQuiz = (index: number, updates: Partial<QuizQuestion>) => {
    setLessons((prev) => {
      const updated = [...prev.quizzes];
      updated[index] = { ...updated[index], ...updates };
      return { ...prev, quizzes: updated };
    });
  };

  const handleRemoveQuiz = (index: number) => {
    setLessons((prev) => ({
      ...prev,
      quizzes: prev.quizzes.filter((_, i) => i !== index),
    }));
  };

  // --- DICTEES CRUD ---
  const handleAddDictee = () => {
    const newDictee: DicteeItem = {
      id: `custom-d-${Date.now()}`,
      level,
      sentence: '',
      translation: '',
      hint: '',
      difficulty: 'facile',
    };
    setLessons((prev) => ({
      ...prev,
      dictees: [...prev.dictees, newDictee],
    }));
  };

  const handleUpdateDictee = (index: number, updates: Partial<DicteeItem>) => {
    setLessons((prev) => {
      const updated = [...prev.dictees];
      updated[index] = { ...updated[index], ...updates };
      return { ...prev, dictees: updated };
    });
  };

  const handleRemoveDictee = (index: number) => {
    setLessons((prev) => ({
      ...prev,
      dictees: prev.dictees.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Informe o título da semana.');
      return;
    }

    const selectedStudent = students.find((s) => s.id === studentId);
    const studentName = studentId === 'ALL' ? 'Todos os Alunos' : (selectedStudent?.name || 'Aluno');

    onSave({
      id: initialModule?.id,
      studentId,
      studentName,
      weekNumber,
      title,
      level,
      date: dateStr,
      summaryNotes,
      videoUrl: videoUrl.trim() || undefined,
      videoTitle: videoTitle.trim() || undefined,
      pdfUrl: pdfUrl.trim() || undefined,
      pdfFileName: pdfFileName.trim() || undefined,
      pdfFileSize: pdfUrl ? '1.8 MB' : undefined,
      lessons,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-xs overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-3xl border border-[#EBE4D8] p-5 sm:p-8 max-w-4xl w-full shadow-2xl my-6 relative space-y-6 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#EBE4D8] pb-4">
          <div className="space-y-0.5 text-left">
            <h3 className="font-cormorant text-2xl sm:text-3xl font-bold text-[#0F172A]">
              {initialModule ? 'Editar Resumo da Semana' : 'Novo Resumo Semanal de Aula'}
            </h3>
            <p className="text-xs text-[#5A6578]">
              Cadastre o resumo, adicione o vídeo, PDF e prepare os exercícios de fixação para seu aluno.
            </p>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-[#FAF7F2]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 text-left">
          {/* Seletor de Aluno Destinatário */}
          <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#EBE4D8] space-y-2">
            <label className="block text-xs font-bold text-[#8B2626] flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-[#8B2626]" />
              <span>Aluno(a) Destinatário(a) desta Aula :</span>
            </label>
            <p className="text-[11px] text-[#5A6578]">
              🔒 <strong>Privacidade Total:</strong> Apenas o aluno selecionado terá acesso a esta gravação, notas e materiais quando entrar com seu PIN no Portal do Aluno.
            </p>
            <select
              value={studentId}
              onChange={(e) => {
                const sId = e.target.value;
                setStudentId(sId);
                const match = students.find((s) => s.id === sId);
                if (match && !initialModule) {
                  setLevel(match.level);
                }
              }}
              className="w-full p-2.5 rounded-xl border border-[#D4C8B8] focus:border-[#8B2626] outline-none text-xs sm:text-sm font-bold bg-white text-[#0F172A]"
            >
              <optgroup label="Alunos Individuais (Aulas Particulares)">
                {students.map((std) => (
                  <option key={std.id} value={std.id}>
                    {std.name} (Nível {std.level} • PIN: {std.pin})
                  </option>
                ))}
              </optgroup>
              <optgroup label="Turma Aberta">
                <option value="ALL">Todos os Alunos (Compartilhado com toda a turma)</option>
              </optgroup>
            </select>
          </div>

          {/* Informações Principais da Aula */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#0F172A] mb-1">
                Número da Semana :
              </label>
              <input
                type="number"
                min={1}
                value={weekNumber}
                onChange={(e) => setWeekNumber(parseInt(e.target.value, 10) || 1)}
                className="w-full p-2.5 rounded-xl border border-[#D4C8B8] focus:border-[#8B2626] outline-none text-xs sm:text-sm font-bold bg-[#FAF7F2]/50"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0F172A] mb-1">
                Nível da Aula :
              </label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value as Level)}
                className="w-full p-2.5 rounded-xl border border-[#D4C8B8] focus:border-[#8B2626] outline-none text-xs sm:text-sm font-bold bg-[#FAF7F2]/50"
              >
                <option value="A1">A1 — Iniciante</option>
                <option value="A2">A2 — Básico</option>
                <option value="B1">B1/B2 — Intermediário</option>
                <option value="C1">C1/C2 — Avançado</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0F172A] mb-1">
                Rótulo de Data / Período :
              </label>
              <input
                type="text"
                value={dateStr}
                onChange={(e) => setDateStr(e.target.value)}
                placeholder="Ex: Semana 3 • Outubro 2026"
                className="w-full p-2.5 rounded-xl border border-[#D4C8B8] focus:border-[#8B2626] outline-none text-xs sm:text-sm bg-[#FAF7F2]/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#0F172A] mb-1">
              Título da Aula / Tema :
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Au Restaurant : Commander et demander l'addition"
              className="w-full p-3 rounded-xl border border-[#D4C8B8] focus:border-[#8B2626] outline-none text-sm sm:text-base font-bold text-[#0F172A] bg-[#FAF7F2]/50"
              required
            />
          </div>

          {/* Resumo e Anotações da Aula */}
          <div>
            <label className="block text-xs font-bold text-[#0F172A] mb-1">
              Resumo da Aula & Anotações Pedagógicas da Melissa :
            </label>
            <textarea
              rows={4}
              value={summaryNotes}
              onChange={(e) => setSummaryNotes(e.target.value)}
              className="w-full p-3.5 rounded-xl border border-[#D4C8B8] focus:border-[#8B2626] outline-none text-xs sm:text-sm leading-relaxed text-[#0F172A] bg-[#FAF7F2]/50 font-mono"
              placeholder="Digite os principais tópicos, regras e dicas ensinadas na aula..."
              required
            />
          </div>

          {/* Mídias: Vídeo e PDF */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#EBE4D8]">
            <div className="space-y-2">
              <label className="block text-xs font-bold text-[#0F172A] flex items-center gap-1.5">
                <Video className="w-3.5 h-3.5 text-[#8B2626]" />
                <span>Link do Vídeo da Aula (YouTube, Loom, Drive) :</span>
              </label>
              <input
                type="url"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full p-2.5 rounded-xl border border-[#D4C8B8] focus:border-[#8B2626] outline-none text-xs bg-[#FAF7F2]/50"
              />
              <input
                type="text"
                value={videoTitle}
                onChange={(e) => setVideoTitle(e.target.value)}
                placeholder="Título do vídeo (ex: Gravação da Aula ao Vivo)"
                className="w-full p-2 rounded-lg border border-[#EBE4D8] text-xs text-[#5A6578]"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-[#0F172A] flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-[#8B2626]" />
                <span>Material de Apoio (PDF) :</span>
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handlePdfUpload}
                  className="hidden"
                  id="pdf-upload-input"
                />
                <label
                  htmlFor="pdf-upload-input"
                  className="py-2 px-3 rounded-xl bg-[#FAF7F2] hover:bg-[#F4EFE6] border border-[#D4C8B8] text-xs font-bold text-[#0F172A] cursor-pointer transition-colors"
                >
                  Subir arquivo PDF
                </label>
                <span className="text-xs text-[#5A6578] truncate max-w-[180px]">
                  {pdfFileName}
                </span>
              </div>
              <input
                type="url"
                value={pdfUrl.startsWith('data:') ? '' : pdfUrl}
                onChange={(e) => setPdfUrl(e.target.value)}
                placeholder="Ou cole o link direto para o PDF..."
                className="w-full p-2 rounded-lg border border-[#EBE4D8] text-xs text-[#5A6578]"
              />
            </div>
          </div>

          {/* PAINEL DE GERAÇÃO INTELIGENTE DE LIÇÕES */}
          <div className="bg-[#FDF9EE] rounded-2xl p-5 border border-[#EEDFB8] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <h4 className="font-cormorant text-xl font-bold text-[#7A5B18] flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-[#C59B27]" />
                    <span>Gerador de Lições da Aula</span>
                  </h4>
                  {apiKey.trim() ? (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                      IA Gemini Ativa ✦
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                      Modo Estrito (Sem IA)
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#7A5B18]/90">
                  Gere flashcards com áudio nativo, quizzes e ditados baseados <strong>estritamente</strong> no que foi ensinado.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setShowKeyInput(!showKeyInput)}
                  className="py-2 px-3 rounded-xl border border-[#D4AF37]/50 bg-white hover:bg-[#FAF7F2] text-[#7A5B18] font-bold text-xs transition-colors flex items-center gap-1.5"
                  title="Configurar Chave do Google Gemini"
                >
                  <Key className="w-3.5 h-3.5 text-[#C59B27]" />
                  <span>{apiKey.trim() ? 'Configurar IA' : 'Ativar IA Gemini'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleGenerateLessons}
                  disabled={isGenerating}
                  className="py-2.5 px-4 rounded-xl bg-[#8B2626] hover:bg-[#731E1E] text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-1.5 shrink-0"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isGenerating ? 'Criando lições...' : apiKey.trim() ? 'Gerar com Gemini IA' : 'Extrair das Anotações'}</span>
                </button>
              </div>
            </div>

            {/* Painel de Configuração da Chave Gemini (expansível) */}
            {showKeyInput && (
              <div className="bg-white p-3.5 rounded-xl border border-[#EEDFB8] space-y-2 text-xs animate-fadeIn">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#0F172A] flex items-center gap-1.5">
                    <Key className="w-3.5 h-3.5 text-[#C59B27]" />
                    <span>Chave de API do Google Gemini (Gratuita)</span>
                  </span>
                  <a
                    href="https://aistudio.google.com/app/apikey"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#8B2626] hover:underline font-bold text-[11px] flex items-center gap-1"
                  >
                    <span>Pegar chave grátis no Google AI Studio</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <div className="flex gap-2">
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="Cole sua chave AIzaSy..."
                    className="flex-1 p-2 rounded-lg border border-[#D4C8B8] text-xs font-mono outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      geminiService.setApiKey(apiKey);
                      setShowKeyInput(false);
                      alert('Chave de API do Gemini salva com sucesso!');
                    }}
                    className="py-2 px-3 rounded-lg bg-[#8B2626] text-white font-bold text-xs"
                  >
                    Salvar
                  </button>
                </div>
                <p className="text-[11px] text-[#5A6578]">
                  Sua chave fica salva apenas no seu navegador. Com a IA ativa, os exercícios são formulados com precisão cirúrgica e gramática natural a partir do resumo.
                </p>
              </div>
            )}

            <div>
              <label className="block text-[11px] font-semibold text-[#7A5B18] mb-1">
                Vocabulário ou termos específicos trabalhados na aula (Opcional - Formato: "termo : tradução"):
              </label>
              <textarea
                rows={2}
                value={rawNotes}
                onChange={(e) => setRawNotes(e.target.value)}
                placeholder="Exemplo:&#10;l'addition : a conta&#10;le café allongé : café americano&#10;la carafe d'eau : jarra de água"
                className="w-full p-2.5 rounded-xl border border-[#EEDFB8] text-xs bg-white/90 text-[#0F172A] outline-none"
              />
            </div>
          </div>

          {/* EDITOR VISUAL DE LIÇÕES (FLASHCARDS, QUIZZES, DITADOS) */}
          <div className="border border-[#EBE4D8] rounded-2xl p-4 sm:p-5 bg-white space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#EBE4D8] pb-3">
              <div>
                <h4 className="font-bold text-sm text-[#0F172A] flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Editor de Lições da Semana (Ver & Ajustar)</span>
                </h4>
                <p className="text-xs text-[#5A6578]">
                  Edite qualquer frase, adicione novos exercícios ou retire o que não desejar antes de publicar.
                </p>
              </div>

              {/* Sub-Tabs Selector */}
              <div className="flex bg-[#FAF7F2] p-1 rounded-xl border border-[#EBE4D8] text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setActiveLessonTab('flashcards')}
                  className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                    activeLessonTab === 'flashcards'
                      ? 'bg-[#8B2626] text-white shadow-2xs'
                      : 'text-[#5A6578] hover:text-[#0F172A]'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Cards ({lessons.flashcards.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveLessonTab('quizzes')}
                  className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                    activeLessonTab === 'quizzes'
                      ? 'bg-[#8B2626] text-white shadow-2xs'
                      : 'text-[#5A6578] hover:text-[#0F172A]'
                  }`}
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Quiz ({lessons.quizzes.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveLessonTab('dictees')}
                  className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                    activeLessonTab === 'dictees'
                      ? 'bg-[#8B2626] text-white shadow-2xs'
                      : 'text-[#5A6578] hover:text-[#0F172A]'
                  }`}
                >
                  <Headphones className="w-3.5 h-3.5" />
                  <span>Ditado ({lessons.dictees.length})</span>
                </button>
              </div>
            </div>

            {/* TAB 1: FLASHCARDS VISUAL LIST */}
            {activeLessonTab === 'flashcards' && (
              <div className="space-y-3">
                {lessons.flashcards.length === 0 ? (
                  <p className="text-xs text-slate-400 italic py-3 text-center">
                    Nenhum flashcard gerado ainda. Use o gerador acima ou adicione manualmente.
                  </p>
                ) : (
                  lessons.flashcards.map((card, idx) => (
                    <div
                      key={card.id || idx}
                      className="bg-[#FAF7F2] p-3.5 rounded-xl border border-[#EBE4D8] space-y-2 text-xs relative group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#8B2626]">Flashcard #{idx + 1}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveFlashcard(idx)}
                          className="p-1 rounded-lg text-rose-500 hover:bg-rose-100 transition-colors"
                          title="Excluir este card"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[11px] font-bold text-[#0F172A] mb-0.5">
                            Francês (termo ou frase):
                          </label>
                          <input
                            type="text"
                            value={card.french}
                            onChange={(e) => handleUpdateFlashcard(idx, { french: e.target.value })}
                            className="w-full p-2 rounded-lg border border-[#D4C8B8] bg-white font-bold text-xs"
                            placeholder="Ex: Je voudrais un café"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-[#0F172A] mb-0.5">
                            Português (tradução):
                          </label>
                          <input
                            type="text"
                            value={card.portuguese}
                            onChange={(e) => handleUpdateFlashcard(idx, { portuguese: e.target.value })}
                            className="w-full p-2 rounded-lg border border-[#D4C8B8] bg-white text-xs"
                            placeholder="Ex: Eu gostaria de um café"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                        <div>
                          <label className="block text-[11px] text-[#5A6578] mb-0.5">
                            Exemplo contextualizado em francês:
                          </label>
                          <input
                            type="text"
                            value={card.exampleFr || ''}
                            onChange={(e) => handleUpdateFlashcard(idx, { exampleFr: e.target.value })}
                            className="w-full p-1.5 rounded-lg border border-[#EBE4D8] bg-white text-xs text-[#0F172A]"
                            placeholder="Ex: Bonjour madame, je voudrais un café s'il vous plaît."
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] text-[#5A6578] mb-0.5">
                            Dica da Melissa:
                          </label>
                          <input
                            type="text"
                            value={card.tip || ''}
                            onChange={(e) => handleUpdateFlashcard(idx, { tip: e.target.value })}
                            className="w-full p-1.5 rounded-lg border border-[#EBE4D8] bg-white text-xs text-[#0F172A]"
                            placeholder="Ex: Use o condicional para soar muito educado."
                          />
                        </div>
                      </div>
                    </div>
                  ))
                )}

                <button
                  type="button"
                  onClick={handleAddFlashcard}
                  className="w-full py-2 px-3 rounded-xl border border-dashed border-[#D4C8B8] hover:bg-[#FAF7F2] text-xs font-bold text-[#8B2626] transition-colors flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Adicionar Flashcard Manualmente</span>
                </button>
              </div>
            )}

            {/* TAB 2: QUIZZES VISUAL LIST */}
            {activeLessonTab === 'quizzes' && (
              <div className="space-y-3">
                {lessons.quizzes.length === 0 ? (
                  <p className="text-xs text-slate-400 italic py-3 text-center">
                    Nenhum quiz gerado ainda. Use o gerador acima ou adicione manualmente.
                  </p>
                ) : (
                  lessons.quizzes.map((quiz, qIdx) => (
                    <div
                      key={quiz.id || qIdx}
                      className="bg-[#FAF7F2] p-3.5 rounded-xl border border-[#EBE4D8] space-y-2.5 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#8B2626]">Pergunta do Quiz #{qIdx + 1}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveQuiz(qIdx)}
                          className="p-1 rounded-lg text-rose-500 hover:bg-rose-100 transition-colors"
                          title="Excluir este quiz"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-[#0F172A] mb-0.5">
                          Enunciado da Pergunta:
                        </label>
                        <input
                          type="text"
                          value={quiz.question}
                          onChange={(e) => handleUpdateQuiz(qIdx, { question: e.target.value })}
                          className="w-full p-2 rounded-lg border border-[#D4C8B8] bg-white font-bold text-xs"
                          placeholder="Ex: Como pedir a conta educadamente em um restaurante?"
                        />
                      </div>

                      <div className="space-y-1.5 pt-1">
                        <label className="block text-[11px] font-bold text-[#0F172A]">
                          Alternativas (marque a correta):
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {quiz.options.map((opt, optIdx) => (
                            <div
                              key={optIdx}
                              className={`flex items-center gap-2 p-2 rounded-lg border bg-white ${
                                quiz.correctIndex === optIdx
                                  ? 'border-emerald-500 ring-1 ring-emerald-500/30 bg-emerald-50/20'
                                  : 'border-[#EBE4D8]'
                              }`}
                            >
                              <input
                                type="radio"
                                name={`correct-${quiz.id || qIdx}`}
                                checked={quiz.correctIndex === optIdx}
                                onChange={() => handleUpdateQuiz(qIdx, { correctIndex: optIdx })}
                                className="accent-emerald-600 cursor-pointer"
                                title="Marcar como alternativa correta"
                              />
                              <input
                                type="text"
                                value={opt}
                                onChange={(e) => {
                                  const updatedOpts = [...quiz.options];
                                  updatedOpts[optIdx] = e.target.value;
                                  handleUpdateQuiz(qIdx, { options: updatedOpts });
                                }}
                                placeholder={`Opção ${String.fromCharCode(65 + optIdx)}`}
                                className="flex-1 text-xs outline-none bg-transparent"
                              />
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="pt-1">
                        <label className="block text-[11px] text-[#5A6578] mb-0.5">
                          Explicação pedagógica da Melissa para a resposta:
                        </label>
                        <input
                          type="text"
                          value={quiz.explanation || ''}
                          onChange={(e) => handleUpdateQuiz(qIdx, { explanation: e.target.value })}
                          className="w-full p-1.5 rounded-lg border border-[#EBE4D8] bg-white text-xs"
                          placeholder="Ex: O verbo exige condicional de polidez."
                        />
                      </div>
                    </div>
                  ))
                )}

                <button
                  type="button"
                  onClick={handleAddQuiz}
                  className="w-full py-2 px-3 rounded-xl border border-dashed border-[#D4C8B8] hover:bg-[#FAF7F2] text-xs font-bold text-[#8B2626] transition-colors flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Adicionar Pergunta ao Quiz</span>
                </button>
              </div>
            )}

            {/* TAB 3: DICTEES VISUAL LIST */}
            {activeLessonTab === 'dictees' && (
              <div className="space-y-3">
                {lessons.dictees.length === 0 ? (
                  <p className="text-xs text-slate-400 italic py-3 text-center">
                    Nenhum ditado gerado ainda. Use o gerador acima ou adicione manualmente.
                  </p>
                ) : (
                  lessons.dictees.map((dictee, dIdx) => (
                    <div
                      key={dictee.id || dIdx}
                      className="bg-[#FAF7F2] p-3.5 rounded-xl border border-[#EBE4D8] space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#8B2626]">Ditado #{dIdx + 1}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveDictee(dIdx)}
                          className="p-1 rounded-lg text-rose-500 hover:bg-rose-100 transition-colors"
                          title="Excluir este ditado"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[11px] font-bold text-[#0F172A] mb-0.5">
                            Frase em francês (o aluno vai ouvir o áudio nativo e digitar):
                          </label>
                          <input
                            type="text"
                            value={dictee.sentence}
                            onChange={(e) => handleUpdateDictee(dIdx, { sentence: e.target.value })}
                            className="w-full p-2 rounded-lg border border-[#D4C8B8] bg-white font-bold text-xs"
                            placeholder="Ex: L'addition, s'il vous plaît."
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-[#0F172A] mb-0.5">
                            Tradução em português:
                          </label>
                          <input
                            type="text"
                            value={dictee.translation}
                            onChange={(e) => handleUpdateDictee(dIdx, { translation: e.target.value })}
                            className="w-full p-2 rounded-lg border border-[#D4C8B8] bg-white text-xs"
                            placeholder="Ex: A conta, por favor."
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] text-[#5A6578] mb-0.5">
                          Dica de apoio (acentuação / liaison):
                        </label>
                        <input
                          type="text"
                          value={dictee.hint || ''}
                          onChange={(e) => handleUpdateDictee(dIdx, { hint: e.target.value })}
                          className="w-full p-1.5 rounded-lg border border-[#EBE4D8] bg-white text-xs"
                          placeholder="Ex: Atenção ao apóstrofo e ao acento circunflexo no plaît."
                        />
                      </div>
                    </div>
                  ))
                )}

                <button
                  type="button"
                  onClick={handleAddDictee}
                  className="w-full py-2 px-3 rounded-xl border border-dashed border-[#D4C8B8] hover:bg-[#FAF7F2] text-xs font-bold text-[#8B2626] transition-colors flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Adicionar Ditado</span>
                </button>
              </div>
            )}
          </div>

          {/* Action Footer */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#EBE4D8]">
            <button
              type="button"
              onClick={onCancel}
              className="py-3 px-5 rounded-xl border border-[#D4C8B8] hover:bg-[#FAF7F2] text-xs font-semibold text-[#5A6578] transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="py-3 px-6 rounded-xl bg-[#8B2626] hover:bg-[#731E1E] text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Salvar e Publicar para o Aluno</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
