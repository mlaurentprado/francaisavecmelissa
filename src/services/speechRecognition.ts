/**
 * Service de reconnaissance vocale pour l'évaluation de la prononciation en français
 */

interface SpeechRecognitionEvent extends Event {
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string;
        confidence: number;
      };
    };
  };
}

interface ISpeechRecognition extends EventTarget {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  continuous: boolean;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: { error: string }) => void;
  onend: () => void;
}

declare global {
  interface Window {
    SpeechRecognition?: new () => ISpeechRecognition;
    webkitSpeechRecognition?: new () => ISpeechRecognition;
  }
}

export interface PronunciationResult {
  transcript: string;
  target: string;
  similarity: number; // 0 to 100
  isSuccess: boolean;
  feedback: string;
}

class SpeechRecognitionService {
  private recognition: ISpeechRecognition | null = null;
  private isListening = false;

  constructor() {
    if (typeof window !== 'undefined') {
      const SpeechRecognitionConstructor =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognitionConstructor) {
        this.recognition = new SpeechRecognitionConstructor();
        this.recognition.lang = 'fr-FR';
        this.recognition.interimResults = false;
        this.recognition.maxAlternatives = 3;
      }
    }
  }

  public isSupported(): boolean {
    return this.recognition !== null;
  }

  public startListening(
    targetSentence: string,
    onResult: (result: PronunciationResult) => void,
    onError: (errMessage: string) => void,
    onListeningChange?: (listening: boolean) => void
  ) {
    if (!this.recognition) {
      onError('Reconnaissance vocale non supportée sur ce navigateur.');
      return;
    }

    if (this.isListening) {
      this.recognition.abort();
    }

    this.isListening = true;
    onListeningChange?.(true);

    this.recognition.onresult = (event: SpeechRecognitionEvent) => {
      this.isListening = false;
      onListeningChange?.(false);

      if (event.results && event.results[0] && event.results[0][0]) {
        const spokenText = event.results[0][0].transcript;
        const evaluation = this.evaluatePronunciation(spokenText, targetSentence);
        onResult(evaluation);
      } else {
        onError('Aucune parole détectée. Veuillez réessayer.');
      }
    };

    this.recognition.onerror = (event: { error: string }) => {
      this.isListening = false;
      onListeningChange?.(false);
      let message = 'Erreur lors de la détection de la parole.';
      if (event.error === 'not-allowed') {
        message = 'Autorisation du micro refusée. Veuillez autoriser le micro dans votre navigateur.';
      } else if (event.error === 'no-speech') {
        message = 'Aucune voix entendue. Rapprochez-vous du micro et répétez !';
      }
      onError(message);
    };

    this.recognition.onend = () => {
      this.isListening = false;
      onListeningChange?.(false);
    };

    try {
      this.recognition.start();
    } catch (e) {
      this.isListening = false;
      onListeningChange?.(false);
      console.warn('Speech recognition start error:', e);
    }
  }

  public stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  /**
   * Compare la phrase dite avec la phrase cible
   */
  private evaluatePronunciation(spoken: string, target: string): PronunciationResult {
    const cleanSpoken = this.cleanString(spoken);
    const cleanTarget = this.cleanString(target);

    // Score de similarité
    const similarity = this.calculateSimilarity(cleanSpoken, cleanTarget);
    const isSuccess = similarity >= 65;

    let feedback = 'Presque ! Entraînez-vous encore.';
    if (similarity >= 90) {
      feedback = 'Incroyable ! Prononciation digne d\'un natif ! 🥐';
    } else if (similarity >= 75) {
      feedback = 'Très bien ! La phrase a été parfaitement comprise.';
    } else if (similarity >= 60) {
      feedback = 'Bonne tentative ! Attention aux liaisons et voyelles.';
    }

    return {
      transcript: spoken,
      target,
      similarity,
      isSuccess,
      feedback,
    };
  }

  private cleanString(str: string): string {
    return str
      .toLowerCase()
      .trim()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // remove accents for gentle comparison
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?'"«»]/g, '')
      .replace(/\s+/g, ' ');
  }

  private calculateSimilarity(s1: string, s2: string): number {
    if (s1 === s2) return 100;
    if (s1.length === 0 || s2.length === 0) return 0;

    const words1 = s1.split(' ');
    const words2 = s2.split(' ');

    let commonWords = 0;
    for (const w1 of words1) {
      if (words2.includes(w1)) {
        commonWords++;
      }
    }

    const wordMatchScore = (commonWords / Math.max(words1.length, words2.length)) * 100;

    // Levenshtein ratio
    const longer = s1.length > s2.length ? s1 : s2;
    const shorter = s1.length > s2.length ? s2 : s1;
    const editDistance = this.levenshtein(longer, shorter);
    const charMatchScore = ((longer.length - editDistance) / longer.length) * 100;

    return Math.round(wordMatchScore * 0.5 + charMatchScore * 0.5);
  }

  private levenshtein(a: string, b: string): number {
    const matrix: number[][] = [];
    for (let i = 0; i <= b.length; i++) matrix[i] = [i];
    for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        if (b.charAt(i - 1) === a.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }
    return matrix[b.length][a.length];
  }
}

export const speechRecognitionService = new SpeechRecognitionService();
