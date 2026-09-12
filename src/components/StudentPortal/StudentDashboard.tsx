import React, { useState } from 'react';
import { StudentProfile, WeeklyModule, Level } from '../../types';
import { studentPortalService } from '../../services/studentPortalService';
import { WeeklyLessonRunner } from './WeeklyLessonRunner';
import {
  Sparkles,
  Flame,
  FileText,
  Video,
  Download,
  CheckCircle2,
  PlayCircle,
  LogOut,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface StudentDashboardProps {
  student: StudentProfile;
  onLogout: () => void;
  onSelectLevel: (lvl: Level) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  student,
  onLogout,
}) => {
  const [weeks, setWeeks] = useState<WeeklyModule[]>(() => studentPortalService.getWeeklyModules());
  const [selectedWeekForLesson, setSelectedWeekForLesson] = useState<WeeklyModule | null>(null);
  const [expandedWeekId, setExpandedWeekId] = useState<string | null>(weeks[0]?.id || null);

  const handleLessonCompleted = () => {
    setSelectedWeekForLesson(null);
    setWeeks(studentPortalService.getWeeklyModules());
  };

  const toggleWeek = (id: string) => {
    setExpandedWeekId((prev) => (prev === id ? null : id));
  };

  // Convert regular YouTube watch links to embed links
  const getEmbedVideoUrl = (url?: string) => {
    if (!url) return null;
    if (url.includes('youtube.com/watch?v=')) {
      const videoId = url.split('v=')[1]?.split('&')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1]?.split('?')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    return url;
  };

  if (selectedWeekForLesson) {
    return (
      <WeeklyLessonRunner
        module={selectedWeekForLesson}
        student={student}
        onBack={() => setSelectedWeekForLesson(null)}
        onCompleted={handleLessonCompleted}
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
      {/* Personalized Welcome Card */}
      <div className="bg-linear-to-r from-[#FAF7F2] via-white to-[#F9F5EE] rounded-3xl border border-[#EBE4D8] p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#8B2626] text-white flex items-center justify-center font-cormorant text-2xl font-bold shadow-sm border border-[#D4AF37]/30">
              {student.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-cormorant text-2xl sm:text-3xl font-bold text-[#0F172A]">
                  Bonjour, {student.name} ! 🥐
                </h2>
                <span className="text-[#C59B27] text-lg">✦</span>
              </div>
              <p className="text-xs sm:text-sm text-[#5A6578]">
                Seu espaço semanal de estudos e consolidação de francês com a Melissa.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onLogout}
            className="self-start sm:self-auto flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#D4C8B8] hover:bg-[#FAF7F2] text-xs font-semibold text-[#78644E] transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sair do perfil</span>
          </button>
        </div>

        {/* Student Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-[#EBE4D8]">
          <div className="bg-white p-3.5 rounded-2xl border border-[#EBE4D8] text-center shadow-2xs">
            <span className="text-[11px] font-bold text-[#8C7A6B] uppercase tracking-wider">
              Nível Atual
            </span>
            <p className="font-cormorant text-2xl font-bold text-[#0F172A] mt-0.5">
              {student.level}
            </p>
          </div>

          <div className="bg-white p-3.5 rounded-2xl border border-[#EBE4D8] text-center shadow-2xs">
            <span className="text-[11px] font-bold text-[#8C7A6B] uppercase tracking-wider flex items-center justify-center gap-1">
              <Sparkles className="w-3 h-3 text-[#C59B27]" />
              <span>Pontos Totais</span>
            </span>
            <p className="font-cormorant text-2xl font-bold text-[#8B2626] mt-0.5">
              {student.totalPoints} pts
            </p>
          </div>

          <div className="bg-white p-3.5 rounded-2xl border border-[#EBE4D8] text-center shadow-2xs">
            <span className="text-[11px] font-bold text-[#8C7A6B] uppercase tracking-wider flex items-center justify-center gap-1">
              <Flame className="w-3 h-3 text-amber-600" />
              <span>Sequência</span>
            </span>
            <p className="font-cormorant text-2xl font-bold text-amber-700 mt-0.5">
              {student.streakDays} dias
            </p>
          </div>

          <div className="bg-white p-3.5 rounded-2xl border border-[#EBE4D8] text-center shadow-2xs">
            <span className="text-[11px] font-bold text-[#8C7A6B] uppercase tracking-wider flex items-center justify-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              <span>Concluídas</span>
            </span>
            <p className="font-cormorant text-2xl font-bold text-emerald-700 mt-0.5">
              {student.completedWeekIds.length} semanas
            </p>
          </div>
        </div>
      </div>

      {/* Weekly Content Timeline */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-cormorant text-2xl sm:text-3xl font-bold text-[#0F172A] flex items-center gap-2">
            <span>Aulas & Resumos Semanais</span>
            <span className="text-xs font-sans px-2.5 py-0.5 rounded-full bg-[#8B2626] text-white font-bold">
              {weeks.length} disponíveis
            </span>
          </h3>
          <span className="text-xs text-[#78644E] font-medium hidden sm:inline">
            Acompanhe o conteúdo ministrado pela Melissa
          </span>
        </div>

        {weeks.map((module) => {
          const isCompleted = student.completedWeekIds.includes(module.id);
          const isExpanded = expandedWeekId === module.id;
          const embedUrl = getEmbedVideoUrl(module.videoUrl);

          return (
            <div
              key={module.id}
              className={`bg-white rounded-3xl border transition-all duration-200 overflow-hidden ${
                isExpanded
                  ? 'border-[#8B2626]/60 shadow-md ring-1 ring-[#8B2626]/10'
                  : 'border-[#EBE4D8] shadow-2xs hover:border-[#D4C8B8]'
              }`}
            >
              {/* Header Bar */}
              <button
                type="button"
                onClick={() => toggleWeek(module.id)}
                className="w-full text-left p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#FAF7F2]/60 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#FAF7F2] text-[#78644E] border border-[#DDD3C1]">
                      {module.date}
                    </span>
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#EFE8DC] text-[#63513D]">
                      Nível {module.level}
                    </span>
                    {isCompleted && (
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Concluída ✨</span>
                      </span>
                    )}
                  </div>
                  <h4 className="font-cormorant text-xl sm:text-2xl font-bold text-[#0F172A]">
                    {module.title}
                  </h4>
                </div>

                <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                  <span className="text-xs font-bold text-[#8B2626]">
                    {isExpanded ? 'Ocultar detalhes' : 'Ver resumo & materiais'}
                  </span>
                  <div className="w-7 h-7 rounded-full bg-[#FAF7F2] border border-[#DDD3C1] flex items-center justify-center text-[#78644E]">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </div>
              </button>

              {/* Expanded Body: Summary, Video, PDF and Practice CTA */}
              {isExpanded && (
                <div className="px-5 sm:px-6 pb-6 pt-2 border-t border-[#F2ECE3] space-y-6 animate-fadeIn">
                  {/* Summary Text / Markdown notes */}
                  <div className="bg-[#FAF7F2] rounded-2xl p-5 border border-[#EBE4D8] space-y-2 text-left">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#78644E] uppercase tracking-wider">
                      <FileText className="w-4 h-4 text-[#8B2626]" />
                      <span>Resumo da Aula & Anotações da Melissa</span>
                    </div>
                    <div className="text-xs sm:text-sm text-[#0F172A] leading-relaxed whitespace-pre-line font-medium">
                      {module.summaryNotes}
                    </div>
                  </div>

                  {/* Video & PDF Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Video Player */}
                    {module.videoUrl && (
                      <div className="bg-white rounded-2xl border border-[#EBE4D8] p-4 space-y-3 text-left">
                        <div className="flex items-center gap-2 text-xs font-bold text-[#0F172A]">
                          <Video className="w-4 h-4 text-[#8B2626]" />
                          <span>{module.videoTitle || 'Gravação / Vídeo da Aula'}</span>
                        </div>
                        {embedUrl ? (
                          <div className="aspect-video w-full rounded-xl overflow-hidden bg-black/5 border border-[#EBE4D8]">
                            <iframe
                              src={embedUrl}
                              title="Vídeo da Aula"
                              className="w-full h-full"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            ></iframe>
                          </div>
                        ) : (
                          <a
                            href={module.videoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-4 rounded-xl bg-[#FAF7F2] border border-[#DDD3C1] flex items-center justify-between text-xs font-bold text-[#8B2626] hover:bg-[#FCE7E7] transition-colors"
                          >
                            <span>Assistir vídeo no link externo</span>
                            <PlayCircle className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    )}

                    {/* PDF Attachment Box */}
                    {module.pdfUrl && (
                      <div className="bg-white rounded-2xl border border-[#EBE4D8] p-4 flex flex-col justify-between space-y-3 text-left">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-xs font-bold text-[#0F172A]">
                            <FileText className="w-4 h-4 text-[#8B2626]" />
                            <span>Material de Apoio (PDF)</span>
                          </div>
                          <p className="text-xs text-[#5A6578]">
                            {module.pdfFileName || 'Apostila_Resumo_Semanal.pdf'}
                          </p>
                          {module.pdfFileSize && (
                            <span className="text-[10px] text-[#8C7A6B] bg-[#FAF7F2] px-2 py-0.5 rounded-md border border-[#DDD3C1]">
                              {module.pdfFileSize}
                            </span>
                          )}
                        </div>

                        <a
                          href={module.pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          download={module.pdfFileName || 'Material_Melissa.pdf'}
                          className="w-full py-2.5 px-4 rounded-xl bg-[#FAF7F2] hover:bg-[#F4EFE6] border border-[#D4C8B8] text-xs font-bold text-[#0F172A] flex items-center justify-center gap-2 transition-colors shadow-2xs"
                        >
                          <Download className="w-4 h-4 text-[#8B2626]" />
                          <span>Baixar / Visualizar PDF da Aula</span>
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Practice Lesson Action Bar */}
                  <div className="bg-linear-to-r from-[#FAF7F2] to-white p-5 rounded-2xl border border-[#EBE4D8] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-0.5">
                      <h5 className="font-cormorant text-xl font-bold text-[#0F172A]">
                        Exercícios & Fixação da {module.title}
                      </h5>
                      <p className="text-xs text-[#5A6578]">
                        {module.lessons.flashcards.length} cards com áudio • {module.lessons.quizzes.length} quizzes • {module.lessons.dictees.length} ditados
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSelectedWeekForLesson(module)}
                      className="py-3 px-6 rounded-xl bg-[#8B2626] hover:bg-[#731E1E] text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 shrink-0"
                    >
                      <PlayCircle className="w-4 h-4" />
                      <span>{isCompleted ? 'Refazer Lição (+Pontos)' : 'Praticar Lição da Semana (+60 pts)'}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
