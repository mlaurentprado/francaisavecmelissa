import { Level, WeeklyLessonContent, Flashcard, QuizQuestion, DicteeItem } from '../types';

export interface LessonGeneratorInput {
  theme: string;
  level: Level;
  rawVocabularyOrNotes?: string;
}

export class LessonGeneratorService {
  /**
   * Gera um conjunto inicial de lições (flashcards, quiz, ditado) a partir do tema ou vocabulário fornecido
   */
  public generateLessonContent(input: LessonGeneratorInput): WeeklyLessonContent {
    const { theme, level, rawVocabularyOrNotes = '' } = input;

    const flashcards: Flashcard[] = [];
    const quizzes: QuizQuestion[] = [];
    const dictees: DicteeItem[] = [];

    // Parse custom vocabulary lines if provided: "termo em francês : tradução" or "termo = tradução"
    const lines = rawVocabularyOrNotes
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 0 && (l.includes(':') || l.includes('=') || l.includes('-')));

    if (lines.length > 0) {
      lines.slice(0, 5).forEach((line, idx) => {
        const parts = line.split(/[:=\-]/);
        if (parts.length >= 2) {
          const french = parts[0].trim();
          const portuguese = parts.slice(1).join(' ').trim();

          flashcards.push({
            id: `gen-f-${Date.now()}-${idx}`,
            level,
            category: theme,
            french,
            portuguese,
            exampleFr: `Voici un bon exemple avec « ${french} » dans notre cours de français.`,
            examplePt: `Aqui está um bom exemplo com « ${portuguese} » na nossa aula de francês.`,
            tip: `Preste atenção à pronúncia e entonação de « ${french} ».`,
          });
        }
      });
    }

    // If no specific vocabulary lines were parsed, generate smart pedagogical content from theme
    if (flashcards.length === 0) {
      flashcards.push(
        {
          id: `gen-f-${Date.now()}-1`,
          level,
          category: theme,
          french: `L'expression essentielle de ${theme}`,
          phonetic: 'pʁɔ.nɔ̃.sja.sjɔ̃',
          portuguese: `Expressão chave estudada na aula sobre ${theme}`,
          exampleFr: `Pendant notre cours, nous avons utilisé cette structure naturellement.`,
          examplePt: `Durante a nossa aula, utilizamos essa estrutura com naturalidade.`,
          tip: `Pratique a repetição no microfone para memorizar a sonoridade nativa.`,
        },
        {
          id: `gen-f-${Date.now()}-2`,
          level,
          category: theme,
          french: `C'est très utile au quotidien`,
          phonetic: 'sɛ tʁɛ.z‿y.til',
          portuguese: 'Isso é muito útil no dia a dia',
          exampleFr: `C'est très utile au quotidien pour converser avec fluidité.`,
          examplePt: 'É muito útil no dia a dia para conversar com fluidez.',
          tip: 'Lembre-se da ligação suave (liaison) entre "très" e "utile".',
        }
      );
    }

    // Generate Quiz
    quizzes.push({
      id: `gen-q-${Date.now()}-1`,
      level,
      category: theme,
      question: `Como aplicar corretamente o conteúdo visto na aula sobre « ${theme} » ?`,
      sentenceWithBlank: `Dans cette situation, on dit : « _____ ».`,
      options: [
        flashcards[0]?.french || 'Bonjour, je voudrais...',
        'Je ne sais pas dire.',
        'Moi vouloir parler.',
        'Pas de problème rapide.'
      ],
      correctIndex: 0,
      explanation: `Exatamente! Essa foi a estrutura central trabalhada pela Melissa no resumo desta semana.`,
      melissaTip: `Sempre priorize a comunicação real e elegante ao responder!`,
    });

    // Generate Dictee
    const targetSentence = flashcards[0]?.french
      ? `C'est important de pratiquer : ${flashcards[0].french}.`
      : `Nous apprenons le français avec passion et régularité.`;

    dictees.push({
      id: `gen-d-${Date.now()}-1`,
      level,
      sentence: targetSentence,
      translation: `É importante praticar esta frase da aula semanal.`,
      hint: `Atenção à acentuação francesa e pontuação.`,
      difficulty: level === 'A1' ? 'facile' : 'moyen',
    });

    return {
      flashcards,
      quizzes,
      dictees,
    };
  }
}

export const lessonGeneratorService = new LessonGeneratorService();
