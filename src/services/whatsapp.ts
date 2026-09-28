import { StudentProfile, StudentPaymentInfo, ClassScheduleRecord } from '../types';

/**
 * Utilitários para gerar links diretos de WhatsApp para comunicação entre a Melissa e seus alunos
 */

export function getWhatsAppQuestionUrl(topic: string, details?: string, teacherPhone?: string): string {
  const message = `Bonjour Melissa ! 🇫🇷\nEstava treinando no aplicativo de estudos e fiquei com uma dúvida sobre:\n\n*${topic}*${
    details ? `\n_${details}_` : ''
  }\n\nPoderia me ajudar a esclarecer na próxima aula? Merci beaucoup !`;

  const phoneParam = teacherPhone ? teacherPhone.replace(/\D/g, '') : '';
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${phoneParam}?text=${encoded}`;
}

/**
 * Lembrete educado e elegante de pagamento enviado pela Melissa para o aluno
 */
export function getWhatsAppPaymentReminderUrl(
  student: StudentProfile,
  payment: StudentPaymentInfo,
  pixKey: string
): string {
  const cleanPhone = student.phone ? student.phone.replace(/\D/g, '') : '';

  const message = `Bonjour ${student.name.split(' ')[0]} ! 🥐\n\nTudo bem? Passando para lembrar com carinho sobre a mensalidade do seu curso de francês (*${payment.planName}*).\n\n📌 *Valor:* R$ ${payment.amount.toFixed(2).replace('.', ',')}\n📅 *Vencimento:* Todo dia ${payment.dueDay}\n🔑 *Chave PIX:* ${pixKey || 'melissa.frances@exemplo.com'}\n\nAssim que puder efetuar, basta me enviar o comprovante por aqui. Qualquer dúvida estou à disposição!\n\nMerci beaucoup e bons estudos! ✦\nMelissa Laurent`;

  const encoded = encodeURIComponent(message);
  return cleanPhone ? `https://wa.me/${cleanPhone}?text=${encoded}` : `https://wa.me/?text=${encoded}`;
}

/**
 * Envio de comprovante do aluno para a Melissa
 */
export function getWhatsAppReceiptUrl(
  student: StudentProfile,
  payment?: StudentPaymentInfo,
  teacherPhone?: string
): string {
  const cleanPhone = teacherPhone ? teacherPhone.replace(/\D/g, '') : '';
  const firstName = student.name.split(' ')[0];

  const message = `Bonjour Melissa ! 🥐\nAqui é o(a) ${firstName}. Acabei de efetuar o pagamento da mensalidade de francês${
    payment ? ` referente ao plano *${payment.planName}* (R$ ${payment.amount.toFixed(2).replace('.', ',')})` : ''
  }.\n\nSegue o comprovante em anexo. Merci ! ✨`;

  const encoded = encodeURIComponent(message);
  return cleanPhone ? `https://wa.me/${cleanPhone}?text=${encoded}` : `https://wa.me/?text=${encoded}`;
}

/**
 * Notificação de aula cancelada ou remarcada
 */
export function getWhatsAppRescheduleUrl(
  student: StudentProfile,
  record: ClassScheduleRecord
): string {
  const cleanPhone = student.phone ? student.phone.replace(/\D/g, '') : '';
  const firstName = student.name.split(' ')[0];

  let message = `Bonjour ${firstName} ! 🇫🇷\n\n`;

  if (record.status === 'rescheduled') {
    message += `Passando para confirmar a remarcação da nossa aula de francês:\n\n📅 *Data original:* ${record.originalDate}\n✨ *Nova data agendada:* ${record.newDate || 'A combinar'}${
      record.reason ? `\n📝 *Motivo / Observação:* ${record.reason}` : ''
    }\n\nJá anotei na minha agenda. Qualquer ajuste me avise! À bientôt ! ✦\nMelissa`;
  } else {
    message += `Passando para registrar o cancelamento da nossa aula agendada para *${record.originalDate}*${
      record.reason ? ` (${record.reason})` : ''
    }.\n\nVamos combinar a reposição assim que for conveniente para você! À bientôt ! ✦\nMelissa`;
  }

  const encoded = encodeURIComponent(message);
  return cleanPhone ? `https://wa.me/${cleanPhone}?text=${encoded}` : `https://wa.me/?text=${encoded}`;
}
