import React, { useState } from 'react';
import { WeeklyModule, Level, WeeklyLessonContent } from '../../types';
import { lessonGeneratorService } from '../../services/lessonGeneratorService';
import { X, Sparkles, Video, FileText, CheckCircle2 } from 'lucide-react';

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
  const [weekNumber, setWeekNumber] = useState<number>(initialModule?.weekNumber || 1);
  const [title, setTitle] = useState<string>(initialModule?.title || '');
  const [level, setLevel] = useState<Level>(initialModule?.level || 'A1');
  const [dateStr, setDateStr] = useState<string>(
    initialModule?.date || `Semana ${initialModule?.weekNumber || 1} • ${new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}`
  );
  const [summaryNotes, setSummaryNotes] = useState<string>(
    initialModule?.summaryNotes ||
      `### Resumo da Aula:\n- Ponto 1:\n- Ponto 2:\n- Expressão chave trabalhada:`
  );
  const [videoUrl, setVideoUrl] = useState<string>(initialModule?.videoUrl || '');
  const [videoTitle, setVideoTitle] = useState<string>(initialModule?.videoTitle || 'Gravação da Aula com a Melissa');
  const [pdfUrl, setPdfUrl] = useState<string>(initialModule?.pdfUrl || '');
  const [pdfFileName, setPdfFileName] = useState<string>(initialModule?.pdfFileName || 'Material_de_Apoio.pdf');

  // Lessons data
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

  const handleGenerateLessons = () => {
    if (!title.trim()) {
      alert('Por favor, informe o título ou tema da aula antes de gerar lições.');
      return;
    }

    setIsGenerating(true);
    setTimeout(() => {
      const generated = lessonGeneratorService.generateLessonContent({
        theme: title,
        level,
        rawVocabularyOrNotes: rawNotes,
      });

      setLessons(generated);
      setIsGenerating(false);
    }, 400);
  };

  const handlePdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPdfFileName(file.name);
      // Read file as Data URL for immediate local viewing
      const reader = new FileReader();
      reader.onload = () => {
        setPdfUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Informe o título da semana.');
      return;
    }

    onSave({
      id: initialModule?.id,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-3xl border border-[#EBE4D8] p-6 sm:p-8 max-w-3xl w-full shadow-2xl my-8 relative space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#EBE4D8] pb-4">
          <div className="space-y-0.5 text-left">
            <h3 className="font-cormorant text-2xl sm:text-3xl font-bold text-[#0F172A]">
              {initialModule ? 'Editar Resumo da Semana' : 'Novo Resumo Semanal de Aula'}
            </h3>
            <p className="text-xs text-[#5A6578]">
              Cadastre o resumo, adicione o vídeo e o PDF, e gere as lições de fixação para seus alunos.
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
          {/* Main info grid */}
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

          {/* Summary notes */}
          <div>
            <label className="block text-xs font-bold text-[#0F172A] mb-1">
              Resumo da Aula & Anotações Pedagógicas :
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

          {/* Media Links Grid: Video & PDF */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#EBE4D8]">
            {/* Video attachment */}
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

            {/* PDF attachment */}
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

          {/* Smart Lesson Generator Section */}
          <div className="bg-[#FDF9EE] rounded-2xl p-5 border border-[#EEDFB8] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <h4 className="font-cormorant text-xl font-bold text-[#7A5B18] flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#C59B27]" />
                  <span>Gerador Inteligente de Lições da Melissa</span>
                </h4>
                <p className="text-xs text-[#7A5B18]/90">
                  Gere os flashcards com áudio nativo, quiz e ditado da semana em 1 clique!
                </p>
              </div>

              <button
                type="button"
                onClick={handleGenerateLessons}
                disabled={isGenerating}
                className="py-2.5 px-4 rounded-xl bg-[#8B2626] hover:bg-[#731E1E] text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-1.5 shrink-0"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isGenerating ? 'Gerando lições...' : 'Gerar Lições Automaticamente'}</span>
              </button>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#7A5B18] mb-1">
                Vocabulário ou termos específicos trabalhados (Opcional - Formato: "termo : tradução"):
              </label>
              <textarea
                rows={2}
                value={rawNotes}
                onChange={(e) => setRawNotes(e.target.value)}
                placeholder="Exemplo:&#10;l'addition : a conta&#10;le café allongé : café americano&#10;la carafe d'eau : jarra de água"
                className="w-full p-2.5 rounded-xl border border-[#EEDFB8] text-xs bg-white/90 text-[#0F172A] outline-none"
              />
            </div>

            {/* Generated Summary badges */}
            <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-[#7A5B18] pt-1">
              <span>Conteúdo da Lição:</span>
              <span className="px-2.5 py-0.5 rounded-full bg-white border border-[#EEDFB8]">
                {lessons.flashcards.length} Flashcards
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-white border border-[#EEDFB8]">
                {lessons.quizzes.length} Quizzes
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-white border border-[#EEDFB8]">
                {lessons.dictees.length} Ditados
              </span>
            </div>
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
              <span>Salvar e Publicar para os Alunos</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
