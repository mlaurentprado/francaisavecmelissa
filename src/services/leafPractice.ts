import { Flashcard, QuizQuestion, SkillLeaf } from '../types';

const normalize = (value: string) => value.trim().toLowerCase();

/**
 * Uma categoria é exercício da folha quando:
 * - está listada em `leaf.categories` (vinculada pela professora), ou
 * - tem exatamente o nome da folha (permite criar um flashcard/quiz com a
 *   categoria "Verbo être" e ele aparecer automaticamente na folha).
 */
export const categoryBelongsToLeaf = (leaf: SkillLeaf, category: string): boolean => {
  const target = normalize(category);
  if (!target) return false;
  if (normalize(leaf.title) === target) return true;
  return (leaf.categories ?? []).some((c) => normalize(c) === target);
};

export const leafFlashcards = (leaf: SkillLeaf, cards: Flashcard[]): Flashcard[] =>
  cards.filter((card) => categoryBelongsToLeaf(leaf, card.category));

export const leafQuizzes = (leaf: SkillLeaf, quizzes: QuizQuestion[]): QuizQuestion[] =>
  quizzes.filter((quiz) => categoryBelongsToLeaf(leaf, quiz.category));
