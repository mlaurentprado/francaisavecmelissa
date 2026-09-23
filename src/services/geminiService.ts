import { Level, WeeklyLessonContent } from '../types';

const GEMINI_STORAGE_KEY = 'fam_gemini_api_key_v1';

export class GeminiService {
  public getApiKey(): string {
    if (typeof window === 'undefined') return '';
    return localStorage.getItem(GEMINI_STORAGE_KEY) || (import.meta.env.VITE_GEMINI_API_KEY as string) || '';
  }

  public setApiKey(key: string): void {
    if (typeof window === 'undefined') return;
    if (key.trim()) {
      localStorage.setItem(GEMINI_STORAGE_KEY, key.trim());
    } else {
      localStorage.removeItem(GEMINI_STORAGE_KEY);
    }
  }

  public async generateWeeklyLessons(params: {
    theme: string;
    level: Level;
    summaryNotes: string;
    rawVocabulary: string;
  }): Promise<WeeklyLessonContent> {
    const apiKey = this.getApiKey();
    if (!apiKey) {
      throw new Error('Chave de API do Gemini não configurada.');
    }

    const { theme, level, summaryNotes, rawVocabulary } = params;

    const systemPrompt = `Você é a assistente pedagógica de francês da professora Melissa Laurent Prado ("Français avec Melissa").
Sua tarefa é criar exercícios práticos, elegantes e gramaticalmente perfeitos para os alunos revisarem após a aula.

REGRAS OBRIGATÓRIAS:
1. Baseie-se ESTRITAMENTE no tema da aula, no resumo pedagógico e no vocabulário fornecidos pela professora. NÃO invente regras, vocabulários ou tópicos que não foram mencionados.
2. Todo o francês deve ser autêntico, natural e adequado ao nível CEFR selecionado (${level}).
3. Forneça transcrição fonética simplificada e amigável nos flashcards para alunos lusófonos.
4. O quiz deve conter exatamente 4 alternativas por questão, onde apenas 1 é correta, acompanhada de explicação pedagógica clara e uma "dica da Melissa".
5. O ditado (dictée) deve ser uma frase em francês baseada diretamente no que foi ensinado na aula.
6. Retorne ESTRITAMENTE um objeto JSON válido, sem markdown envolvente ou formatação extra.`;

    const userPrompt = `DADOS DA AULA:
- Tema da Aula: ${theme}
- Nível CEFR: ${level}
- Resumo e Anotações da Professora Melissa:
${summaryNotes || 'Não informado'}
- Vocabulário e Expressões Trabalhadas na Aula:
${rawVocabulary || 'Não informado'}

Gere entre 3 a 5 flashcards, 2 a 3 questões de quiz e 1 a 2 frases para ditado, respeitando estritamente o formato JSON a seguir:
{
  "flashcards": [
    {
      "french": "expressão ou palavra em francês",
      "phonetic": "guia fonético amigável",
      "portuguese": "tradução em português",
      "exampleFr": "frase de exemplo contextualizada em francês",
      "examplePt": "tradução do exemplo em português",
      "tip": "dica pedagógica prática da Melissa"
    }
  ],
  "quizzes": [
    {
      "question": "pergunta prática sobre a aula",
      "options": ["opção A", "opção B", "opção C", "opção D"],
      "correctIndex": 0,
      "explanation": "explicação gramatical e contextual da resposta",
      "melissaTip": "dica da Melissa"
    }
  ],
  "dictees": [
    {
      "sentence": "frase em francês da aula para o aluno ouvir e digitar",
      "translation": "tradução da frase",
      "hint": "dica de acentuação ou liaison",
      "difficulty": "facile"
    }
  ]
}`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }],
          },
        ],
        generationConfig: {
          temperature: 0.2, // Low temperature for high adherence to class notes
          responseMimeType: 'application/json',
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      let parsedError = 'Erro ao se comunicar com a API do Gemini.';
      try {
        const errorJson = JSON.parse(errorText);
        parsedError = errorJson.error?.message || parsedError;
      } catch {
        // use raw error text
      }
      throw new Error(`Falha no Gemini (${response.status}): ${parsedError}`);
    }

    const data = await response.json();
    const rawContent = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawContent) {
      throw new Error('A IA não retornou conteúdo.');
    }

    const parsed = JSON.parse(rawContent);

    // Map to complete internal types
    const now = Date.now();
    const flashcards = (parsed.flashcards || []).map((f: any, idx: number) => ({
      id: `gem-f-${now}-${idx}`,
      level,
      category: theme,
      french: f.french || '',
      phonetic: f.phonetic || '',
      portuguese: f.portuguese || '',
      exampleFr: f.exampleFr || '',
      examplePt: f.examplePt || '',
      tip: f.tip || '',
    }));

    const quizzes = (parsed.quizzes || []).map((q: any, idx: number) => ({
      id: `gem-q-${now}-${idx}`,
      level,
      category: theme,
      question: q.question || '',
      sentenceWithBlank: q.sentenceWithBlank || undefined,
      options: Array.isArray(q.options) && q.options.length >= 2 ? q.options : ['Oui', 'Non'],
      correctIndex: typeof q.correctIndex === 'number' ? q.correctIndex : 0,
      explanation: q.explanation || '',
      melissaTip: q.melissaTip || 'Pratique em voz alta!',
    }));

    const dictees = (parsed.dictees || []).map((d: any, idx: number) => ({
      id: `gem-d-${now}-${idx}`,
      level,
      sentence: d.sentence || '',
      translation: d.translation || '',
      hint: d.hint || 'Atenção aos acentos.',
      difficulty: d.difficulty === 'difficile' ? 'difficile' : d.difficulty === 'moyen' ? 'moyen' : 'facile',
    }));

    return {
      flashcards,
      quizzes,
      dictees,
    };
  }
}

export const geminiService = new GeminiService();
