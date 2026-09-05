import React, { useState } from 'react';
import { FicheGrammaire, Level } from '../types';
import { Sparkles, ChevronDown, ChevronUp, Volume2 } from 'lucide-react';
import { speechService } from '../services/speech';

interface FichesViewProps {
  fiches: FicheGrammaire[];
  currentLevel: Level;
}

export const FichesView: React.FC<FichesViewProps> = ({ fiches, currentLevel }) => {
  const [expandedId, setExpandedId] = useState<string | null>(fiches[0]?.id || null);

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const playAudio = (text: string, e: React.MouseEvent) => {
    e.stopPropagation();
    speechService.speak(text, { rate: 0.9 });
  };

  const filteredFiches = fiches.filter((f) => f.level === currentLevel);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Banner inspired by Screenshot 3 (Deep Navy & Gold) */}
      <div className="bg-[#0F1E36] text-white rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
        <div className="relative z-10 space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-[#D4AF37] border border-white/10">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Fiches Mémo • Imersão Cultural</span>
          </div>
          <h2 className="font-cormorant text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">
            Mais que regras: uma <span className="text-[#D4AF37] italic">imersão real</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Consulte resumos visuais, regras essenciais e conselhos pedagógicos da Melissa para
            fixar os pontos mais importantes das suas aulas.
          </p>
        </div>
      </div>

      {/* List of Fiches */}
      <div className="space-y-4">
        {filteredFiches.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-3xl border border-[#EBE4D8] p-6 shadow-xs">
            <p className="text-[#5A6578] font-medium">Nenhuma ficha cadastrada para o nível {currentLevel} ainda.</p>
          </div>
        ) : (
          filteredFiches.map((fiche) => {
            const isExpanded = expandedId === fiche.id;

            return (
              <div
                key={fiche.id}
                className="bg-white rounded-3xl border border-[#EBE4D8] shadow-2xs transition-all overflow-hidden"
              >
                {/* Header clickable */}
                <button
                  type="button"
                  onClick={() => toggleExpand(fiche.id)}
                  className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 hover:bg-[#FAF7F2] transition-colors"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#F4EFE6] text-[#78644E] border border-[#DDD3C1] uppercase tracking-wide">
                        {fiche.badge}
                      </span>
                    </div>
                    <h3 className="font-cormorant text-xl sm:text-2xl font-bold text-[#0F172A]">
                      {fiche.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#5A6578]">
                      {fiche.summary}
                    </p>
                  </div>

                  <div className="w-8 h-8 rounded-full bg-[#F4EFE6] border border-[#DDD3C1] flex items-center justify-center text-[#78644E] shrink-0">
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </div>
                </button>

                {/* Body */}
                {isExpanded && (
                  <div className="px-5 sm:px-6 pb-6 pt-2 border-t border-[#F2ECE3] space-y-5 animate-fadeIn">
                    {/* Rules list */}
                    <div className="space-y-4">
                      {fiche.rules.map((ruleItem, idx) => (
                        <div
                          key={idx}
                          className="bg-[#FAF7F2] rounded-2xl p-4 sm:p-5 border border-[#EBE4D8] space-y-3"
                        >
                          <p className="text-sm font-bold text-[#0F172A] flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-[#8B2626] text-white text-xs flex items-center justify-center font-bold">
                              {idx + 1}
                            </span>
                            <span>{ruleItem.rule}</span>
                          </p>

                          <div className="space-y-2 pt-1">
                            {ruleItem.examples.map((ex, exIdx) => (
                              <div
                                key={exIdx}
                                className="bg-white p-3 rounded-xl border border-[#EBE4D8] flex items-center justify-between gap-3 text-xs sm:text-sm shadow-2xs"
                              >
                                <div className="space-y-0.5">
                                  <p className="font-cormorant text-base sm:text-lg font-bold text-[#0F172A]">
                                    {ex.fr}
                                  </p>
                                  <p className="text-[#5A6578] text-xs italic">
                                    {ex.pt}
                                  </p>
                                </div>
                                <button
                                  type="button"
                                  onClick={(e) => playAudio(ex.fr, e)}
                                  className="p-1.5 rounded-lg bg-[#FCE7E7] text-[#8B2626] hover:bg-[#F8D2D2] transition-colors shrink-0"
                                  title="Ouvir pronúncia"
                                >
                                  <Volume2 className="w-4 h-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Melissa's Advice Box */}
                    <div className="flex items-start gap-3 bg-[#FDF9EE] rounded-2xl p-4 sm:p-5 border border-[#EEDFB8]">
                      <Sparkles className="w-5 h-5 text-[#C59B27] shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-xs uppercase font-bold text-[#7A5B18] tracking-wider">
                          Conselho da Professora Melissa
                        </h4>
                        <p className="text-xs sm:text-sm text-[#7A5B18] mt-1 leading-relaxed">
                          {fiche.melissaAdvice}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
