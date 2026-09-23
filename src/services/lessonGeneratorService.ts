import { Level, WeeklyLessonContent, Flashcard, QuizQuestion, DicteeItem } from '../types';

export interface LessonGeneratorInput {
  theme: string;
  level: Level;
  rawVocabularyOrNotes?: string;
  summaryNotes?: string;
}

export class LessonGeneratorService {
  /**
   * Extração estrita e determinística de lições a partir das notas ou vocabulário fornecidos pela professora.
   * Não inventa termos que não constam nas anotações da Melissa.
   */
  public generateLessonContent(input: LessonGeneratorInput): WeeklyLessonContent {
    const { theme, level, rawVocabularyOrNotes = '', summaryNotes = '' } = input;

    const flashcards: Flashcard[] = [];
    const quizzes: QuizQuestion[] = [];
    const dictees: DicteeItem[] = [];

    // Juntar as notas e vocabulário fornecidos
    const allText = `${rawVocabularyOrNotes}\n${summaryNotes}`;

    // Procurar por padrões de vocabulário como:
    // "le café : o café"
    // "je voudrais = eu gostaria"
    // "- la carafe d'eau - a jarra de água"
    const lines = allText
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 0 && (l.includes(':') || l.includes('=') || l.includes(' - ')));

    lines.forEach((line, idx) => {
      // Remove marcadores comuns como "-", "*", "•"
      const cleanLine = line.replace(/^[-*•\d.]+\s*/, '').trim();
      const delimiterMatch = cleanLine.match(/[:=]|(\s+-\s+)/);

      if (delimiterMatch && delimiterMatch.index !== undefined) {
        const delimiter = delimiterMatch[0];
        const parts = cleanLine.split(delimiter);

        if (parts.length >= 2) {
          const french = parts[0].replace(/[*_]/g, '').trim();
          const portuguese = parts.slice(1).join(' ').replace(/[*_]/g, '').trim();

          if (french.length > 1 && portuguese.length > 1) {
            flashcards.push({
              id: `gen-f-${Date.now()}-${idx}`,
              level,
              category: theme,
              french,
              portuguese,
              exampleFr: `« ${french} » — vu en classe avec Melissa.`,
              examplePt: `« ${portuguese} » — visto na aula com a Melissa.`,
              tip: `Pratique a pronúncia correta de « ${french} ».`,
            });
          }
        }
      }
    });

    // Se encontramos flashcards reais a partir do que ela digitou:
    if (flashcards.length > 0) {
      const first = flashcards[0];
      const second = flashcards[1] || first;
      const third = flashcards[2] || second;

      // Gerar quiz baseado estritamente nas opções extraídas
      quizzes.push({
        id: `gen-q-${Date.now()}-1`,
        level,
        category: theme,
        question: `Como se diz « ${first.portuguese} » em francês, conforme estudado nesta aula?`,
        options: [
          first.french,
          second.french !== first.french ? second.french : 'Pardon, je ne sais pas',
          third.french !== first.french && third.french !== second.french ? third.french : 'Ce n\'est pas correct',
          'Autre réponse',
        ],
        correctIndex: 0,
        explanation: `Correto! « ${first.french} » traduz-se como « ${first.portuguese} ».`,
        melissaTip: `Memorize o uso e pratique com o áudio nativo!`,
      });

      // Ditado baseado estritamente na primeira frase ou vocabulário
      dictees.push({
        id: `gen-d-${Date.now()}-1`,
        level,
        sentence: first.french,
        translation: first.portuguese,
        hint: `Atenção à ortografia e aos acentos franceses.`,
        difficulty: level === 'A1' ? 'facile' : 'moyen',
      });
    }

    return {
      flashcards,
      quizzes,
      dictees,
    };
  }
}

export const lessonGeneratorService = new LessonGeneratorService();
