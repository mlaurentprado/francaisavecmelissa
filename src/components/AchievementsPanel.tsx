import React from 'react';
import { AchievementBadge, SkillBranch } from '../types';
import { Trophy, Lock } from 'lucide-react';

interface AchievementsPanelProps {
  badges: AchievementBadge[];
  unlocked: Record<string, string>;
  branches: SkillBranch[];
}

export const AchievementsPanel: React.FC<AchievementsPanelProps> = ({
  badges,
  unlocked,
  branches,
}) => {
  const unlockedCount = badges.filter((b) => unlocked[b.id]).length;

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <div className="flex items-center justify-between bg-[#FAF7F2] rounded-2xl border border-[#EBE4D8] p-4">
        <div>
          <h3 className="font-cormorant text-2xl font-bold text-[#0F172A] flex items-center gap-2">
            <Trophy className="w-5 h-5 text-[#C59B27]" />
            <span>Tableau des Conquêtes</span>
          </h3>
          <p className="text-xs text-[#5A6578]">
            Painel de Conquistas — cada badge é uma etapa do seu caminho en français.
          </p>
        </div>
        <div className="text-right shrink-0">
          <span className="text-2xl font-bold font-cormorant text-[#8B2626]">
            {unlockedCount}
          </span>
          <span className="text-xs text-[#78644E] font-bold"> / {badges.length}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {badges.map((badge) => {
          const date = unlocked[badge.id];
          const branch = badge.branchId ? branches.find((b) => b.id === badge.branchId) : undefined;
          return (
            <div
              key={badge.id}
              className={`rounded-2xl border p-4 flex flex-col items-center text-center gap-2 transition-all ${
                date
                  ? 'bg-white border-amber-300 ring-2 ring-amber-200/60 shadow-sm'
                  : 'bg-[#FAF7F2] border-[#EBE4D8]'
              }`}
            >
              <span
                className={`text-3xl select-none ${date ? '' : 'grayscale opacity-40'}`}
                aria-label={date ? 'Badge desbloqueado' : 'Badge bloqueado'}
              >
                {date ? badge.icon : '🔒'}
              </span>
              <div className="space-y-0.5">
                <h5 className={`text-xs font-bold ${date ? 'text-[#0F172A]' : 'text-[#8C7A6B]'}`}>
                  {badge.name}
                </h5>
                <p className="text-[11px] text-[#5A6578] leading-snug">{badge.description}</p>
              </div>
              <p className="text-[10px] text-[#78644E] border-t border-[#F2ECE3] pt-2 w-full">
                {branch && <span style={{ color: branch.color }}>{branch.icon} </span>}
                {badge.condition}
              </p>
              {date ? (
                <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                  Conquistado em {new Date(date).toLocaleDateString('pt-BR')}
                </span>
              ) : (
                <span className="text-[10px] font-semibold text-[#8C7A6B] inline-flex items-center gap-1">
                  <Lock className="w-3 h-3" /> Bloqueado
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
