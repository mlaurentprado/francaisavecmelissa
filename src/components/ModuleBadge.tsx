import React from 'react';
import { GraduationCap } from 'lucide-react';

/** Selo discreto para conteúdo vindo dos resumos semanais de aula. */
export const ModuleBadge: React.FC = () => (
  <span
    className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#FDF9EE] text-[#7A5B18] text-[10px] font-semibold border border-[#EEDFB8] whitespace-nowrap"
    title="Este conteúdo veio de um resumo semanal de aula"
  >
    <GraduationCap className="w-3 h-3 shrink-0" />
    <span>Da aula da semana</span>
  </span>
);
