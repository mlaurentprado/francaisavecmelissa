import React from 'react';
import { Level } from '../types';
import { ModuleBadge } from './ModuleBadge';

interface StudyStatusBarProps {
  currentLevel: Level;
  /** O que está em foco agora: categoria, "Ditado 2 de 5", "Plano de revisão"... */
  label: string;
  /** Contador à direita (ex.: "Cartão 3 de 7"). Ignorado quando `right` é passado. */
  counter?: string;
  fromModule?: boolean;
  /** Conteúdo à direita no lugar do contador (ex.: pílula de dificuldade). */
  right?: React.ReactNode;
}

/**
 * Linha de contexto no topo de cada aba do aluno (nível, foco atual e contador).
 * Mantém a mesma leitura em Flashcards, Quizzes, Dictée/Oral, Fiches e Revisões.
 */
export const StudyStatusBar: React.FC<StudyStatusBarProps> = ({
  currentLevel,
  label,
  counter,
  fromModule,
  right,
}) => (
  <div className="flex items-center justify-between gap-3 text-xs text-[#78644E] font-semibold px-2">
    <div className="flex items-center gap-2 min-w-0">
      <span className="w-2 h-2 rounded-full bg-[#8B2626] shrink-0"></span>
      <span className="uppercase tracking-wide whitespace-nowrap">Nível {currentLevel}</span>
      <span>•</span>
      <span className="text-[#0F172A] truncate">{label}</span>
      {fromModule && <ModuleBadge />}
    </div>
    {right ?? (counter ? <div className="shrink-0 whitespace-nowrap">{counter}</div> : null)}
  </div>
);
