/**
 * Utilitário para gerar links de dúvidas no WhatsApp para a professora Melissa
 */

export function getWhatsAppQuestionUrl(topic: string, details?: string): string {
  const message = `Bonjour Melissa ! 🇫🇷\nEstava treinando no aplicativo de estudos e fiquei com uma dúvida sobre:\n\n*${topic}*${
    details ? `\n_${details}_` : ''
  }\n\nPoderia me ajudar a esclarecer na próxima aula? Merci beaucoup !`;

  const encoded = encodeURIComponent(message);
  return `https://wa.me/?text=${encoded}`;
}
