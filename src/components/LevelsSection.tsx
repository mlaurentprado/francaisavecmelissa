import React from 'react';
import { Level, LevelConfig } from '../types';
import { LEVELS_CONFIG } from '../data/learningContent';
import { Book, MessageSquare, Coffee, GraduationCap, Check } from 'lucide-react';

interface LevelsSectionProps {
  currentLevel: Level;
  onSelectLevel: (level: Level) => void;
}

export const LevelsSection: React.FC<LevelsSectionProps> = ({
  currentLevel,
  onSelectLevel,
}) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'book':
        return <Book className="w-5 h-5 text-emerald-700" />;
      case 'message':
        return <MessageSquare className="w-5 h-5 text-amber-700" />;
      case 'coffee':
        return <Coffee className="w-5 h-5 text-[#8B2626]" />;
      case 'graduation':
        return <GraduationCap className="w-5 h-5 text-slate-700" />;
      default:
        return <Book className="w-5 h-5" />;
    }
  };

  return (
    <section className="space-y-6 pt-2 pb-6">
      {/* Title & Subtitle from Website Screenshot 2 */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <h2 className="font-cormorant text-3xl sm:text-4xl md:text-5xl font-bold text-[#0F172A] tracking-tight">
          Do seu primeiro <span className="text-[#8B2626] italic">"Bonjour"</span> à{' '}
          <span className="text-[#0F172A]">fluência</span>
        </h2>
        <p className="text-xs sm:text-sm text-[#5A6578] leading-relaxed">
          Cada nível é desenhado para respeitar seu ritmo e seus objetivos, sejam eles
          pessoais, profissionais ou acadêmicos. Selecione seu nível para treinar:
        </p>
      </div>

      {/* 4 Cards Grid - Recreated faithfully from Screenshot 2 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {LEVELS_CONFIG.map((lvl: LevelConfig) => {
          const isSelected = currentLevel === lvl.id;

          return (
            <button
              key={lvl.id}
              type="button"
              onClick={() => onSelectLevel(lvl.id)}
              className={`text-left p-6 rounded-2xl transition-all duration-200 relative group flex flex-col justify-between min-h-[220px] bg-white border ${
                isSelected
                  ? 'border-[#8B2626] ring-2 ring-[#8B2626]/20 shadow-md transform -translate-y-1'
                  : 'border-[#EBE4D8] hover:border-[#D4C8B8] hover:shadow-sm'
              }`}
            >
              {/* Selected indicator check */}
              {isSelected && (
                <span className="absolute top-4 right-4 w-5 h-5 rounded-full bg-[#8B2626] text-white flex items-center justify-center text-xs shadow-2xs">
                  <Check className="w-3 h-3 stroke-[3]" />
                </span>
              )}

              <div className="space-y-4">
                {/* Icon box in pastel square with rounded corners */}
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center border border-black/5"
                  style={{ backgroundColor: lvl.bgLight }}
                >
                  {getIcon(lvl.icon)}
                </div>

                {/* Level Code & Name */}
                <div className="space-y-1">
                  <span className="text-xs font-semibold text-[#8C7A6B] tracking-wider uppercase">
                    {lvl.code}
                  </span>
                  <h3 className="font-cormorant text-2xl font-bold text-[#0F172A]">
                    {lvl.title}
                  </h3>
                </div>

                {/* Description */}
                <p className="text-xs text-[#5A6578] leading-relaxed">
                  {lvl.description}
                </p>
              </div>

              {/* Status footer inside card */}
              <div className="pt-4 mt-2 border-t border-[#F2ECE3] flex items-center justify-between text-[11px] font-semibold">
                <span className={isSelected ? 'text-[#8B2626]' : 'text-[#8C7A6B]'}>
                  {isSelected ? 'Nível Ativo para Treino' : 'Clique para praticar'}
                </span>
                <span className="text-xs text-[#8C7A6B]">→</span>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};
