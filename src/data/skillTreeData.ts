import {
  AchievementBadge,
  SkillBranch,
  SkillLeaf,
} from '../types';

/**
 * ARQUIVO DE CONFIGURAÇÃO DA ÁRVORE DE HABILIDADES
 * ------------------------------------------------------------------
 * Este é o "arquivo" que a professora edita manualmente para criar
 * galhos, folhas e badges. O app lê este conteúdo automaticamente
 * na inicialização e junta com o que foi criado no Painel da
 * Professora (aba "Árvore"), que fica salvo no navegador.
 *
 * COMO EDITAR: veja o passo a passo em ARVORE-DE-HABILIDADES.md
 * (raiz do projeto).
 */

export const SKILL_BRANCHES: SkillBranch[] = [
  {
    id: 'gram',
    name: 'Gramática',
    icon: '📚',
    color: '#8B2626',
    order: 1,
    level: 'A1',
  },
  {
    id: 'vocab',
    name: 'Vocabulário',
    icon: '🥖',
    color: '#C59B27',
    order: 2,
    level: 'A1',
  },
  {
    id: 'culture',
    name: 'Cultura',
    icon: '🗼',
    color: '#2C5E9E',
    order: 3,
    level: 'A1',
  },
];

export const SKILL_LEAVES: SkillLeaf[] = [
  // --- Galho: Gramática ---
  {
    id: 'leaf-etre',
    branchId: 'gram',
    title: 'Verbo être',
    description: 'Je suis, tu es, il/elle est… o verbo mais importante do francês.',
    contents: ['Conjugação au présent', 'Frases de apresentação (Je suis brésilien·ne)', 'Négation : ne… pas'],
    skills: ['falar', 'ler', 'escrever'],
    linkedActivities: ['flashcards', 'quiz'],
    criterion: 'Concluir o quiz de être com 80% + dominar 5 flashcards',
    level: 'A1',
    order: 1,
  },
  {
    id: 'leaf-articles-def',
    branchId: 'gram',
    title: 'Artigos definidos',
    description: 'le, la, les — e quando eles desaparecem (au, à la, aux).',
    contents: ['le / la / l\' / les', 'Contrações : au, aux, du, des', 'Exemplos com lugares da cidade'],
    skills: ['ler', 'escrever'],
    linkedActivities: ['quiz'],
    criterion: 'Acertar 80% no quiz de artigos definidos',
    level: 'A1',
    order: 2,
  },
  {
    id: 'leaf-articles-part',
    branchId: 'gram',
    title: 'Artigos partitivos',
    description: 'du, de la, de l\' — falar de comida e quantidade.',
    contents: ['du pain, de la confiture', 'Négation : pas de + de', 'Au petit-déjeuner'],
    skills: ['ouvir', 'escrever'],
    linkedActivities: ['quiz', 'dictee'],
    criterion: 'Completar 2 dictées sobre comida',
    level: 'A1',
    order: 3,
  },
  {
    id: 'leaf-er-verbs',
    branchId: 'gram',
    title: 'Verbos em -er (présent)',
    description: 'parler, manger, habiter… o grupo mais comum do francês.',
    contents: ['Terminaisons : -e, -es, -e, -ons, -ez, -ent', 'Verbos essenciais : parler, habiter, travailler'],
    skills: ['falar', 'escrever'],
    linkedActivities: ['flashcards', 'quiz'],
    criterion: 'Concluir o quiz de verbos -er com 80%',
    level: 'A1',
    order: 4,
  },

  // --- Galho: Vocabulário ---
  {
    id: 'leaf-saudacoes',
    branchId: 'vocab',
    title: 'Saudações & apresentações',
    description: 'Bonjour, ça va ? — começar qualquer conversa com elegância.',
    contents: ['Bonjour / Bonsoir / Salut', 'Comment ça va ? / Et toi ?', 'Merci, s\'il vous plaît, au revoir'],
    skills: ['ouvir', 'falar'],
    linkedActivities: ['flashcards'],
    criterion: 'Dominar 10 flashcards de saudações',
    level: 'A1',
    order: 1,
  },
  {
    id: 'leaf-comida',
    branchId: 'vocab',
    title: 'Comida & bebidas',
    description: 'Le pain, le fromage, le café… pedir com naturalidade.',
    contents: ['Frutas, pães, bebidas', 'No café / au restaurant', 'J\'aime / je n\'aime pas'],
    skills: ['ouvir', 'falar', 'ler'],
    linkedActivities: ['flashcards', 'dictee'],
    criterion: 'Completar 1 dictée de comida + 10 flashcards',
    level: 'A1',
    order: 2,
  },
  {
    id: 'leaf-cidade',
    branchId: 'vocab',
    title: 'A cidade & direções',
    description: 'Où est la gare ? — se virar em qualquer cidade francesa.',
    contents: ['Lugares : la gare, la banque, le musée', 'Direções : à gauche, tout droit', 'Preposições de lugar'],
    skills: ['ler', 'ouvir'],
    linkedActivities: ['flashcards'],
    criterion: 'Dominar 10 flashcards da cidade',
    level: 'A1',
    order: 3,
  },
  {
    id: 'leaf-familia',
    branchId: 'vocab',
    title: 'Família & pessoas',
    description: 'Ma famille, mes amis — falar de quem você ama.',
    contents: ['Membros da família', 'Adjetivos de descrição', 'Posse : mon, ma, mes'],
    skills: ['falar', 'escrever'],
    linkedActivities: ['flashcards', 'quiz'],
    criterion: 'Dominar 10 flashcards de família',
    level: 'A1',
    order: 4,
  },

  // --- Galho: Cultura ---
  {
    id: 'leaf-franca',
    branchId: 'culture',
    title: 'A França e suas regiões',
    description: 'Paris, Provence, Alsace… um país, mil paisagens.',
    contents: ['Grandes regiões e cidades', 'Símbolos da França', 'Curiosidades geográficas'],
    skills: ['ler'],
    linkedActivities: ['flashcards'],
    criterion: 'Dominar 5 flashcards de cultura francesa',
    level: 'A1',
    order: 1,
  },
  {
    id: 'leaf-sons-nasais',
    branchId: 'culture',
    title: 'Sons nasais & pronúncia',
    description: 'an, on, in, un — o som que dá o "charme" ao francês.',
    contents: ['Les sons nasaux : an, on, in', 'Liaison e enchaînement', 'Prática com espelho'],
    skills: ['ouvir', 'falar'],
    linkedActivities: ['dictee'],
    criterion: 'Completar 1 dictée com sons nasais',
    level: 'A1',
    order: 2,
  },
  {
    id: 'leaf-gastronomia',
    branchId: 'culture',
    title: 'Gastronomia francesa',
    description: 'Croissant, raclette, macaron… a mesa como arte.',
    contents: ['Pratos típicos por região', 'Le repas français', 'Vocabulário do menu'],
    skills: ['ler', 'falar'],
    linkedActivities: ['flashcards', 'quiz'],
    criterion: 'Dominar 5 flashcards de gastronomia',
    level: 'A1',
    order: 3,
  },
];

export const SKILL_BADGES: AchievementBadge[] = [
  {
    id: 'badge-gram',
    name: 'Maître de la Grammaire',
    icon: '🏅',
    description: 'Você dominou todas as folhas do galho Gramática!',
    condition: 'Concluir todas as folhas do galho Gramática',
    kind: 'branch',
    branchId: 'gram',
  },
  {
    id: 'badge-vocab',
    name: 'Excellence du Vocabulaire',
    icon: '🥖',
    description: 'Todas as folhas de Vocabulário em flor!',
    condition: 'Concluir todas as folhas do galho Vocabulário',
    kind: 'branch',
    branchId: 'vocab',
  },
  {
    id: 'badge-quiz100',
    name: 'Sans faute !',
    icon: '🎯',
    description: '100% em um quiz. Précision chirurgicale !',
    condition: 'Conseguir 100% em um quiz completo',
    kind: 'performance',
  },
  {
    id: 'badge-streak7',
    name: '7 jours d\'affilée',
    icon: '🔥',
    description: '7 dias seguidos praticando francês. Régularité impressionnante !',
    condition: 'Praticar 7 dias seguidos',
    kind: 'streak',
    threshold: 7,
  },
  {
    id: 'badge-words50',
    name: '50 mots !',
    icon: '🥐',
    description: 'Suas primeiras 50 palavras dominadas. Bon départ !',
    condition: 'Dominar 50 palavras (flashcards "J\'ai compris")',
    kind: 'milestone',
    threshold: 50,
  },
  {
    id: 'badge-tree',
    name: 'La Forêt du Français',
    icon: '🌳',
    description: 'A árvore inteira floresceu! Conquista especial, réservée aux champions.',
    condition: 'Concluir a árvore de habilidades inteira',
    kind: 'tree',
  },
];
