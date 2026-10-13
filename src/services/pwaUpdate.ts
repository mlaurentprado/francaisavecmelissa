/**
 * Ciclo de atualização do PWA.
 *
 * O app instalado no celular fica preso ao código que o service worker já tinha
 * guardado. Aqui registramos o service worker, procuramos uma versão nova ao
 * abrir o app (e sempre que ele volta ao primeiro plano) e recarregamos a página
 * quando a versão nova assume o controle — assim o celular passa a rodar a
 * versão mais recente sem o usuário precisar reinstalar nada.
 */
export function registerPwaUpdates() {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;

  // A página já era controlada por uma versão anterior? Nesse caso, quando a
  // versão nova assumir o controle, recarregamos para passar a rodar nela.
  // (Na primeira instalação não há o que atualizar.)
  const wasControlledOnLoad = !!navigator.serviceWorker.controller;
  let isReloading = false;

  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (isReloading || !wasControlledOnLoad) return;
    isReloading = true;
    window.location.reload();
  });

  navigator.serviceWorker
    .register('/sw.js', { updateViaCache: 'none' })
    .then((registration) => {
      const checkForUpdate = () => registration.update().catch(() => {});

      // Procura uma versão nova ao abrir o app...
      checkForUpdate();

      // ...e sempre que o app volta ao primeiro plano no celular.
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') checkForUpdate();
      });
    })
    .catch((err) => {
      console.warn('Service worker registration note:', err);
    });
}
