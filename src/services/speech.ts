/**
 * Service de synthèse vocale pour prononciation en français
 */

class SpeechService {
  private synth: SpeechSynthesis | null = null;
  private frenchVoice: SpeechSynthesisVoice | null = null;
  private isInitialized = false;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      this.initVoices();
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => this.initVoices();
      }
    }
  }

  private initVoices() {
    if (!this.synth) return;
    const voices = this.synth.getVoices();
    // Prioritize natural fr-FR voices (Thomas, Audrey, Amelie, Google français, etc.)
    const frVoices = voices.filter(v => v.lang.startsWith('fr'));
    this.frenchVoice = 
      frVoices.find(v => v.lang === 'fr-FR' && !v.name.includes('Compact')) ||
      frVoices.find(v => v.lang.startsWith('fr-FR')) ||
      frVoices.find(v => v.lang.startsWith('fr')) ||
      null;
    this.isInitialized = true;
  }

  public speak(
    text: string, 
    options?: { 
      rate?: number; 
      pitch?: number; 
      onEnd?: () => void;
      onError?: () => void;
    }
  ) {
    if (!this.synth) {
      console.warn('Speech synthesis not supported on this browser.');
      options?.onError?.();
      return;
    }

    // Cancel ongoing speech
    this.synth.cancel();

    if (!this.isInitialized) {
      this.initVoices();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'fr-FR';
    if (this.frenchVoice) {
      utterance.voice = this.frenchVoice;
    }
    utterance.rate = options?.rate ?? 0.9; // Légèrement plus posé pour l'apprentissage
    utterance.pitch = options?.pitch ?? 1.0;

    if (options?.onEnd) {
      utterance.onend = () => options.onEnd?.();
    }
    if (options?.onError) {
      utterance.onerror = () => options.onError?.();
    }

    this.synth.speak(utterance);
  }

  public stop() {
    if (this.synth) {
      this.synth.cancel();
    }
  }

  public isAvailable(): boolean {
    return typeof window !== 'undefined' && 'speechSynthesis' in window;
  }
}

export const speechService = new SpeechService();
