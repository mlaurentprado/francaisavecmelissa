import React, { useState, useEffect } from 'react';
import { X, Smartphone, Share, PlusSquare, CheckCircle2, Sparkles } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

interface InstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstallModal: React.FC<InstallModalProps> = ({ isOpen, onClose }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Detect if already installed (standalone mode)
    const isRunningStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      ('standalone' in window.navigator && (window.navigator as unknown as { standalone: boolean }).standalone === true);
    setIsStandalone(isRunningStandalone);

    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIosDevice);

    // Catch Android / Chrome beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl border border-[#EBE4D8] p-6 sm:p-8 max-w-md w-full shadow-xl relative space-y-6">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-[#FAF7F2] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Icon & Title */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-[#8B2626] border-2 border-[#D4AF37] flex items-center justify-center shadow-md p-2">
            <span className="font-cormorant text-2xl font-bold text-white">FM</span>
          </div>
          <div className="space-y-1">
            <h3 className="font-cormorant text-2xl font-bold text-[#0F172A] flex items-center justify-center gap-1.5">
              <span>Instalar no seu Celular</span>
              <Sparkles className="w-4 h-4 text-[#C59B27]" />
            </h3>
            <p className="text-xs text-[#5A6578]">
              Tenha o app com ícone na tela inicial para treinar francês a qualquer hora, mesmo sem internet!
            </p>
          </div>
        </div>

        {/* Already Installed state */}
        {isStandalone ? (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
            <p className="text-xs font-bold text-emerald-900">
              O aplicativo já está instalado no seu aparelho!
            </p>
          </div>
        ) : (
          <div className="space-y-4 text-left text-xs sm:text-sm text-[#0F172A]">
            {/* Direct Android / Chrome button */}
            {deferredPrompt && (
              <button
                type="button"
                onClick={handleInstallClick}
                className="w-full py-3.5 px-6 rounded-xl bg-[#8B2626] hover:bg-[#731E1E] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Smartphone className="w-4 h-4" />
                <span>Instalar com 1 Clique</span>
              </button>
            )}

            {/* Step-by-step instructions for iPhone / iPad */}
            {isIOS || !deferredPrompt ? (
              <div className="space-y-3 bg-[#FAF7F2] p-4 sm:p-5 rounded-2xl border border-[#EBE4D8]">
                <p className="font-bold text-[#8B2626] text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <span>No iPhone / iPad (Safari) :</span>
                </p>
                <div className="space-y-2.5 text-xs text-[#5A6578]">
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[#EFE8DC] text-[#63513D] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      1
                    </span>
                    <p>
                      Toque no botão de <span className="font-semibold text-[#0F172A]">Compartilhar</span>{' '}
                      <Share className="w-3.5 h-3.5 inline mx-0.5 text-[#8B2626]" /> na barra inferior do Safari.
                    </p>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[#EFE8DC] text-[#63513D] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      2
                    </span>
                    <p>
                      Role as opções para baixo e clique em{' '}
                      <span className="font-semibold text-[#0F172A]">
                        "Adicionar à Tela de Início"
                      </span>{' '}
                      <PlusSquare className="w-3.5 h-3.5 inline mx-0.5 text-[#8B2626]" />.
                    </p>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[#EFE8DC] text-[#63513D] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      3
                    </span>
                    <p>
                      Toque em <span className="font-semibold text-[#0F172A]">"Adicionar"</span> no canto superior direito.
                      Pronto! O ícone <span className="font-semibold text-[#8B2626]">Français</span> estará na sua tela inicial.
                    </p>
                  </div>
                </div>

                {/* Android note */}
                <div className="pt-3 border-t border-[#EBE4D8] text-[11px] text-[#78644E]">
                  <span className="font-bold">No Android:</span> Toque nos 3 pontinhos do Chrome e selecione{' '}
                  <span className="font-semibold text-[#0F172A]">"Instalar aplicativo"</span>.
                </div>
              </div>
            ) : null}
          </div>
        )}

        <button
          type="button"
          onClick={onClose}
          className="w-full py-3 rounded-xl border border-[#D4C8B8] text-[#5A6578] hover:bg-[#FAF7F2] font-semibold text-xs transition-colors"
        >
          Fechar
        </button>
      </div>
    </div>
  );
};
