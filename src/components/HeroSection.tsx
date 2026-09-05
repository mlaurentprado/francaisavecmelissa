import React from 'react';
import { ArrowRight, Globe, Clock, GraduationCap, Sparkles } from 'lucide-react';

interface HeroSectionProps {
  onStartTraining: () => void;
  onScrollToLevels: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onStartTraining,
  onScrollToLevels,
}) => {
  return (
    <section className="py-8 sm:py-12 lg:py-16">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
        {/* Left Column: Typography & CTAs */}
        <div className="lg:col-span-7 space-y-6 sm:space-y-8 text-left">
          {/* Tag Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EFE8DC] text-[#63513D] border border-[#DDD3C1] text-xs font-semibold tracking-wide">
            <Globe className="w-3.5 h-3.5 text-[#C59B27]" />
            <span>Aulas 100% online • Espace de Pratique</span>
          </div>

          {/* Headline from Screenshot 1 */}
          <h1 className="font-cormorant text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-[#0F172A] tracking-tight leading-[1.05]">
            Descubra a elegância do{' '}
            <span className="text-[#8B2626] italic font-semibold">francês</span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-[#5A6578] font-normal leading-relaxed max-w-xl">
            Aprenda francês de forma personalizada, com foco em conversação, cultura e
            confiança. Do básico ao avançado, para adultos que querem falar com naturalidade.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              type="button"
              onClick={onStartTraining}
              className="bg-[#8B2626] hover:bg-[#731E1E] text-white text-sm sm:text-base font-semibold px-6 py-3.5 rounded-xl transition-all shadow-sm hover:shadow-md flex items-center gap-2.5 group"
            >
              <span>Comece a praticar</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>

            <button
              type="button"
              onClick={onScrollToLevels}
              className="bg-white hover:bg-[#F9F6F0] text-[#0F172A] border border-[#D4C8B8] text-sm sm:text-base font-semibold px-6 py-3.5 rounded-xl transition-all shadow-2xs"
            >
              Conheça os níveis
            </button>
          </div>

          {/* Bottom Trust Indicators */}
          <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-[#EBE4D8] text-xs sm:text-sm text-[#78644E] font-medium">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-[#8B2626]" />
              <span>13 anos de experiência</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#8B2626]" />
              <span>Aulas online ao vivo</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#8B2626]" />
              <span>Horários flexíveis</span>
            </div>
          </div>
        </div>

        {/* Right Column: Visual Card with Nice / Promenade des Anglais */}
        <div className="lg:col-span-5 relative">
          <div className="relative mx-auto max-w-md lg:max-w-none">
            {/* Main picture container */}
            <div className="relative rounded-3xl overflow-hidden shadow-xl border border-[#EBE4D8] aspect-4/3 sm:aspect-5/4 bg-slate-100">
              <img
                src="/hero.png"
                alt="Nice - Promenade des Anglais"
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback to debutant picture if hero is missing
                  e.currentTarget.src = '/debutant.jpg';
                }}
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent"></div>
            </div>

            {/* Floating Speech Card from Screenshot 1 */}
            <div className="absolute -bottom-5 -left-4 sm:-left-6 bg-white/95 backdrop-blur-md rounded-2xl p-4 sm:p-5 shadow-lg border border-[#EBE4D8] max-w-[240px] sm:max-w-[260px] animate-fadeIn">
              <div className="flex items-center gap-2 text-[#8B2626] font-bold text-sm font-cormorant">
                <Sparkles className="w-4 h-4 text-[#C59B27]" />
                <span className="text-base sm:text-lg">Bonjour !</span>
              </div>
              <p className="text-xs text-[#5A6578] mt-1 font-medium leading-snug">
                Sua primeira frase começa aqui. Treine hoje após sua aula!
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
