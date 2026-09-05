import { Flashcard, QuizQuestion, DicteeItem, FicheGrammaire, LevelConfig } from '../types';

export const LEVELS_CONFIG: LevelConfig[] = [
  {
    id: 'A1',
    code: 'A1',
    title: 'Iniciante',
    subtitle: 'Primeiras frases & sons',
    description: 'Primeiras frases, apresentações, números e vocabulário essencial para o cotidiano.',
    icon: 'book',
    color: '#059669',
    bgLight: '#E8F5E9',
  },
  {
    id: 'A2',
    code: 'A2',
    title: 'Básico',
    subtitle: 'Conversas do cotidiano',
    description: 'Converse em situações do dia a dia, descreva pessoas, lugares e atividades simples.',
    icon: 'message',
    color: '#D97706',
    bgLight: '#FEF3C7',
  },
  {
    id: 'B1',
    code: 'B1/B2',
    title: 'Intermediário',
    subtitle: 'Fluência & expressões',
    description: 'Ganhe fluência em viagens, trabalho e debates. Entenda textos e expressões culturais.',
    icon: 'coffee',
    color: '#8B2626',
    bgLight: '#FCE7E7',
  },
  {
    id: 'C1',
    code: 'C1/C2',
    title: 'Avançado',
    subtitle: 'Nuances & domínio pleno',
    description: 'Domine nuances, discursos complexos, literatura e contextos acadêmicos ou profissionais.',
    icon: 'graduation',
    color: '#334155',
    bgLight: '#F1F5F9',
  },
];

export const FLASHCARDS_DATA: Flashcard[] = [
  // --- A1: INICIANTE ---
  {
    id: 'a1-1',
    level: 'A1',
    category: 'Salutations & Politesse',
    french: 'Enchanté(e)',
    phonetic: 'ã.ʃɑ̃.te',
    portuguese: 'Muito prazer',
    exampleFr: 'Bonjour madame, enchanté de faire votre connaissance.',
    examplePt: 'Bom dia senhora, muito prazer em conhecê-la.',
    tip: 'Mulheres escrevem com "e" no final (enchantée), mas a pronúncia falada é idêntica!'
  },
  {
    id: 'a1-2',
    level: 'A1',
    category: 'Au Café & Restaurant',
    french: 'Je voudrais...',
    phonetic: 'ʒə vu.dʁɛ',
    portuguese: 'Eu gostaria de... / Eu queria...',
    exampleFr: 'Bonjour ! Je voudrais un café crème et un croissant, s\'il vous plaît.',
    examplePt: 'Bom dia! Eu gostaria de um café com leite e um croissant, por favor.',
    tip: 'Use sempre "Je voudrais" em vez de "Je veux". Soa infinitamente mais polido e elegante.'
  },
  {
    id: 'a1-3',
    level: 'A1',
    category: 'Salutations & Politesse',
    french: 'Bonne journée !',
    phonetic: 'bɔn ʒuʁ.ne',
    portuguese: 'Tenha um bom dia! (despedida)',
    exampleFr: 'Merci pour le service, au revoir et bonne journée !',
    examplePt: 'Obrigado pelo atendimento, até logo e tenha um bom dia!',
    tip: 'Use "Bonjour" ao chegar e "Bonne journée" apenas na hora de se despedir.'
  },
  {
    id: 'a1-4',
    level: 'A1',
    category: 'Salutations & Politesse',
    french: 'S\'il vous plaît',
    phonetic: 'sil vu plɛ',
    portuguese: 'Por favor (formal ou plural)',
    exampleFr: 'Un verre d\'eau, s\'il vous plaît.',
    examplePt: 'Um copo de água, por favor.',
    tip: 'Para amigos ou familiares próximos, use "S\'il te plaît". Com estranhos ou professores, sempre "S\'il vous plaît".'
  },

  // --- A2: BÁSICO ---
  {
    id: 'a2-1',
    level: 'A2',
    category: 'Au Café & Restaurant',
    french: 'L\'addition, s\'il vous plaît',
    phonetic: 'la.di.sjɔ̃ sil vu plɛ',
    portuguese: 'A conta, por favor',
    exampleFr: 'Garçon, l\'addition s\'il vous plaît. On peut payer par carte ?',
    examplePt: 'Garçom, a conta por favor. Podemos pagar com cartão?',
    tip: 'Na França, o garçom nunca traz a conta à mesa sem você pedir expressamente.'
  },
  {
    id: 'a2-2',
    level: 'A2',
    category: 'Au Café & Restaurant',
    french: 'Une carafe d\'eau',
    phonetic: 'yn ka.ʁaf do',
    portuguese: 'Uma jarra de água (gratuita / da torneira)',
    exampleFr: 'Nous prendrons deux plats du jour et une carafe d\'eau.',
    examplePt: 'Vamos querer dois pratos do dia e uma jarra de água.',
    tip: 'A "carafe d\'eau" é gratuita por lei em qualquer restaurante e a água é potável e excelente.'
  },
  {
    id: 'a2-3',
    level: 'A2',
    category: 'Vie Quotidienne',
    french: 'Ça marche !',
    phonetic: 'sa maʁʃ',
    portuguese: 'Combinado! / Beleza! / Fechado!',
    exampleFr: '— On se retrouve à 19h devant la boulangerie ? — Ça marche !',
    examplePt: '— A gente se encontra às 19h em frente à padaria? — Fechado!',
    tip: 'Expressão super comum no dia a dia. Significa que o combinado está de pé!'
  },
  {
    id: 'a2-4',
    level: 'A2',
    category: 'Vie Quotidienne',
    french: 'De temps en temps',
    phonetic: 'də tɑ̃.z‿ɑ̃ tɑ̃',
    portuguese: 'De vez em quando / Às vezes',
    exampleFr: 'Je vais au musée de temps en temps avec mes amis.',
    examplePt: 'Eu vou ao museu de vez em quando com meus amigos.',
    tip: 'Liaison obrigatória entre "temps" e "en" com som de "Z": "dê tan-zan-tan".'
  },

  // --- B1/B2: INTERMEDIÁRIO ---
  {
    id: 'b1-1',
    level: 'B1',
    category: 'Expressions Idiomatiques',
    french: 'Poser un lapin',
    phonetic: 'po.ze œ̃ la.pɛ̃',
    portuguese: 'Dar um bolo / Não comparecer ao encontro',
    exampleFr: 'J\'ai attendu pendant une heure au bistrot, il m\'a posé un lapin !',
    examplePt: 'Esperei por uma hora no bistrô, ele me deu um bolo!',
    tip: 'Literalmente "colocar um coelho". Uma das expressões mais clássicas do francês oral.'
  },
  {
    id: 'b1-2',
    level: 'B1',
    category: 'Expressions Idiomatiques',
    french: 'Avoir le coup de foudre',
    phonetic: 'a.vwaʁ lə ku də fudʁ',
    portuguese: 'Amor à primeira vista',
    exampleFr: 'Quand j\'ai visité Nice pour la première fois, j\'ai eu un vrai coup de foudre.',
    examplePt: 'Quando visitei Nice pela primeira vez, foi amor à primeira vista.',
    tip: 'Pode ser usado tanto para pessoas quanto para cidades, arte ou literatura.'
  },
  {
    id: 'b1-3',
    level: 'B1',
    category: 'Faux-Amis (Atenção!)',
    french: 'Actuellement',
    phonetic: 'ak.tɥɛl.mɑ̃',
    portuguese: 'Atualmente / No momento (NÃO significa "na verdade")',
    exampleFr: 'Actuellement, j\'habite à Paris et je perfectionne mon français.',
    examplePt: 'Atualmente, moro em Paris e aperfeiçoo meu francês.',
    tip: 'Para dizer "na verdade" em francês, use "En fait" ou "En réalité".'
  },
  {
    id: 'b1-4',
    level: 'B1',
    category: 'Faux-Amis (Atenção!)',
    french: 'Attendre',
    phonetic: 'a.tɑ̃dʁ',
    portuguese: 'Esperar / Aguardar (NÃO significa "atender")',
    exampleFr: 'Attends-moi une minute, je prends mon manteau !',
    examplePt: 'Me espera um minuto, estou pegando meu casaco!',
    tip: 'Para "atender o telefone", use "répondre au téléphone". Para "entender", use "comprendre".'
  },
  {
    id: 'b1-5',
    level: 'B1',
    category: 'Expressions Idiomatiques',
    french: 'Coûter les yeux de la tête',
    phonetic: 'ku.te le.z‿jø də la tɛt',
    portuguese: 'Custar os olhos da cara / Uma fortuna',
    exampleFr: 'Cet appartement sur la Promenade des Anglais coûte les yeux de la tête !',
    examplePt: 'Esse apartamento na Promenade des Anglais custa os olhos da cara!',
    tip: 'Em francês é "os olhos da cabeça" (les yeux de la tête)!'
  },
  {
    id: 'b1-6',
    level: 'B1',
    category: 'Nuances du Quotidien',
    french: 'Du coup',
    phonetic: 'dy ku',
    portuguese: 'Então / Por isso / Daí (consequência natural)',
    exampleFr: 'Le métro était bloqué, du coup j\'ai pris un vélo.',
    examplePt: 'O metrô estava parado, então peguei uma bicicleta.',
    tip: 'O conector mais falado pelos franceses nativos no dia a dia.'
  },

  // --- C1/C2: AVANÇADO ---
  {
    id: 'c1-1',
    level: 'C1',
    category: 'Connecteurs Soutenus',
    french: 'En revanche',
    phonetic: 'ɑ̃ ʁə.vɑ̃ʃ',
    portuguese: 'Por outro lado / Em contrapartida',
    exampleFr: 'La tâche s\'avère ardue, en revanche les retombées sont considérables.',
    examplePt: 'A tarefa se mostra árdua, em contrapartida os retornos são consideráveis.',
    tip: 'Elegante e indispensável em produções textuais e argumentações no DALF C1.'
  },
  {
    id: 'c1-2',
    level: 'C1',
    category: 'Expressions Littéraires',
    french: 'Au fur et à mesure',
    phonetic: 'o fy.ʁ‿e a mə.zyʁ',
    portuguese: 'À medida que / Gradualmente',
    exampleFr: 'Au fur et à mesure que nous avancions, le paysage se métamorphosait.',
    examplePt: 'À medida que avançávamos, a paisagem se transformava.',
    tip: 'Indica concomitância e progressão gradual no tempo.'
  },
  {
    id: 'c1-3',
    level: 'C1',
    category: 'Nuances Rhétoriques',
    french: 'Il n\'en demeure pas moins que',
    phonetic: 'il nɑ̃ də.mœʁ pa mwɛ̃ kə',
    portuguese: 'Não deixa de ser verdade que / Fato é que',
    exampleFr: 'Bien que l\'argument soit séduisant, il n\'en demeure pas moins contestable.',
    examplePt: 'Embora o argumento seja sedutor, não deixa de ser contestável.',
    tip: 'Expressão de alto nível para introduzir concessões com elegância.'
  },
  {
    id: 'c1-4',
    level: 'C1',
    category: 'Figures de Style',
    french: 'Tirer les marrons du feu',
    phonetic: 'ti.ʁe le ma.ʁɔ̃ dy fø',
    portuguese: 'Tirar proveito de uma situação arriscada',
    exampleFr: 'Dans cette négociation complexe, elle a su tirer les marrons du feu.',
    examplePt: 'Nesta negociação complexa, ela soube tirar proveito da situação.',
    tip: 'Origem na fábula clássica de La Fontaine "Le Singe et le Chat".'
  }
];

export const QUIZ_DATA: QuizQuestion[] = [
  // --- A1 ---
  {
    id: 'q-a1-1',
    level: 'A1',
    category: 'Politesse & Restaurant',
    question: 'Qual é a forma mais polida e natural de pedir um café em Paris?',
    options: [
      'Je veux un café, donne-moi.',
      'Je voudrais un café, s\'il vous plaît.',
      'Moi prendre un café.',
      'Un café rapide.'
    ],
    correctIndex: 1,
    explanation: '"Je voudrais" usa o condicional de polidez. Dizer "Je veux" soa rude e autoritário na cultura francesa.',
    melissaTip: 'Lembre-se da trinca de ouro francesa: Bonjour + Je voudrais + S\'il vous plaît !'
  },
  {
    id: 'q-a1-2',
    level: 'A1',
    category: 'Grammaire (Être vs Avoir)',
    question: 'Complete com o verbo ÊTRE:',
    sentenceWithBlank: 'Sophie et Lucas _____ brésiliens.',
    options: ['ont', 'sont', 'êtes', 'sommes'],
    correctIndex: 1,
    explanation: '3ª pessoa do plural do verbo être é "sont" (Ils sont). Cuidado para não confundir com "ont" (do verbo avoir).',
    melissaTip: 'Atenção ao som: "Ils sont" [il sõ] é nasal; "Ils ont" [il-z-õ] tem som de Z na ligação!'
  },

  // --- A2 ---
  {
    id: 'q-a2-1',
    level: 'A2',
    category: 'Articles Partitifs',
    question: 'Complete com os artigos partitivos adequados:',
    sentenceWithBlank: 'Au petit-déjeuner, je mange _____ pain avec _____ beurre.',
    options: ['du / du', 'le / le', 'de la / du', 'un / un'],
    correctIndex: 0,
    explanation: 'Tanto "pain" quanto "beurre" são substantivos masculinos franceses (du pain, du beurre).',
    melissaTip: 'Como não comemos todo o pão do mundo mas sim uma porção, usamos o partitivo "du"!'
  },
  {
    id: 'q-a2-2',
    level: 'A2',
    category: 'Prépositions de Pays',
    question: 'Complete com as preposições de lugar corretas para países:',
    sentenceWithBlank: 'J\'habite _____ Brésil, mais je pars en vacances _____ France.',
    options: ['en / au', 'au / en', 'à / en', 'dans / pour'],
    correctIndex: 1,
    explanation: 'Países masculinos pedem "AU" (Au Brésil). Países femininos terminados em "e" pedem "EN" (En France).',
    melissaTip: 'Se o país termina com a letra "E" (la France, l\'Italie), use EN!'
  },

  // --- B1 ---
  {
    id: 'q-b1-1',
    level: 'B1',
    category: 'Passé Composé vs Imparfait',
    question: 'Escolha a combinação correta de tempos no passado:',
    sentenceWithBlank: 'Pendant que je _____ tranquillement un livre, le téléphone _____ soudainement.',
    options: ['lisais / a sonné', 'ai lu / sonnait', 'lisais / sonnait', 'ai lu / a sonné'],
    correctIndex: 0,
    explanation: 'A ação contínua de fundo fica no Imparfait (lisais), enquanto a ação pontual que interrompe fica no Passé Composé (a sonné).',
    melissaTip: 'O Imparfait pinta o cenário (filme); o Passé Composé é o evento pontual (foto)!'
  },
  {
    id: 'q-b1-2',
    level: 'B1',
    category: 'Pronoms EN et Y',
    question: 'Qual pronome substitui o complemento [à ton avenir] ?',
    sentenceWithBlank: '— Est-ce que tu penses souvent à ton avenir ? — Oui, j\'_____ pense tous les jours.',
    options: ['en', 'y', 'le', 'lui'],
    correctIndex: 1,
    explanation: 'O pronome "Y" substitui complementos iniciados pela preposição "À" que não sejam pessoas (penser à quelque chose -> y penser).',
    melissaTip: 'Verbo + DE = EN. Verbo + À = Y !'
  },

  // --- C1 ---
  {
    id: 'q-c1-1',
    level: 'C1',
    category: 'Subjonctif & Nuances',
    question: 'Identifique a forma verbal correta que exige o modo Subjuntivo:',
    sentenceWithBlank: 'Bien qu\'il _____ toutes les compétences, il n\'a pas obtenu le poste.',
    options: ['a', 'ait', 'aura', 'avait'],
    correctIndex: 1,
    explanation: 'A conjunção concessiva "Bien que" exige obrigatoriamente o Subjonctif Présent (ait).',
    melissaTip: 'Conjunções concessivas como "Bien que" e "Quoique" sempre ativam o subjuntivo no francês elegante.'
  }
];

export const DICTEE_DATA: DicteeItem[] = [
  // A1
  {
    id: 'dic-a1-1',
    level: 'A1',
    sentence: 'Bonjour, comment allez-vous aujourd\'hui ?',
    translation: 'Bom dia, como você está hoje?',
    hint: 'Atenção ao apóstrofo em "aujourd\'hui" e ao hífen em "allez-vous".',
    difficulty: 'facile'
  },
  {
    id: 'dic-a1-2',
    level: 'A1',
    sentence: 'Je voudrais un croissant et un café.',
    translation: 'Eu gostaria de um croissant e um café.',
    hint: 'Acento agudo no "é" de café e S mudo em croissant.',
    difficulty: 'facile'
  },

  // A2
  {
    id: 'dic-a2-1',
    level: 'A2',
    sentence: 'Il fait très beau à Nice ce matin.',
    translation: 'O tempo está muito bonito em Nice esta manhã.',
    hint: 'Acento grave no "à" de lugar: à Nice.',
    difficulty: 'moyen'
  },
  {
    id: 'dic-a2-2',
    level: 'A2',
    sentence: 'Nous prenons le déjeuner sur la terrasse.',
    translation: 'Almoçamos no terraço.',
    hint: 'Dois "s" em terrasse.',
    difficulty: 'moyen'
  },

  // B1
  {
    id: 'dic-b1-1',
    level: 'B1',
    sentence: 'Bien que ce soit difficile, nous progressons chaque semaine.',
    translation: 'Embora seja difícil, progredimos a cada semana.',
    hint: 'Subjuntivo do verbo être: "soit".',
    difficulty: 'moyen'
  },
  {
    id: 'dic-b1-2',
    level: 'B1',
    sentence: 'Elle a pris le train de huit heures pour arriver à l\'heure.',
    translation: 'Ela pegou o trem das oito horas para chegar no horário.',
    hint: 'Atenção à grafia de "huit" e "à l\'heure".',
    difficulty: 'avance'
  },

  // C1
  {
    id: 'dic-c1-1',
    level: 'C1',
    sentence: 'Si j\'avais su, je serais venu plus tôt pour écouter cette conférence.',
    translation: 'Se eu soubesse, teria vindo mais cedo para escutar esta conferência.',
    hint: 'Condicional passado com o auxiliar être: "serais venu".',
    difficulty: 'avance'
  }
];

export const FICHES_DATA: FicheGrammaire[] = [
  {
    id: 'f-1',
    level: 'A1',
    title: 'C\'est vs Il est : O Guia Definitivo',
    badge: 'A1 • Fundamental',
    summary: 'O erro mais clássico de brasileiros desmistificado de vez.',
    rules: [
      {
        rule: 'Use C\'EST seguido de artigo/determinante (un/une/le/la/mon...) ou adjetivo neutro.',
        examples: [
          { fr: 'C\'est un professeur brésilien.', pt: 'É um professor brasileiro.' },
          { fr: 'C\'est magnifique !', pt: 'É maravilhoso! (comentário geral)' }
        ]
      },
      {
        rule: 'Use IL EST / ELLE EST diretamente antes de adjetivo ou profissão sem artigo.',
        examples: [
          { fr: 'Il est professeur.', pt: 'Ele é professor. (sem "un")' },
          { fr: 'Elle est française et gentille.', pt: 'Ela é francesa e gentil.' }
        ]
      }
    ],
    melissaAdvice: 'Com artigo ou pronome possessivo ("un", "mon", "le") use C\'EST. Com adjetivo puro, use IL EST!'
  },
  {
    id: 'f-2',
    level: 'A2',
    title: 'Preposições antes de Cidades e Países',
    badge: 'A2 • Viagem & Geografia',
    summary: 'Quando usar À, EN, AU e AUX sem hesitar.',
    rules: [
      {
        rule: 'Cidades: sempre usam À (à Paris, à Nice, à São Paulo).',
        examples: [
          { fr: 'J\'habite à Paris.', pt: 'Moro em Paris.' }
        ]
      },
      {
        rule: 'Países Femininos (terminados em -E) e com vogal: use EN.',
        examples: [
          { fr: 'Je voyage en France et en Italie.', pt: 'Viajo para a França e para a Itália.' }
        ]
      },
      {
        rule: 'Países Masculinos (não terminados em -E): use AU.',
        examples: [
          { fr: 'Nous habitons au Brésil.', pt: 'Moramos no Brasil.' }
        ]
      }
    ],
    melissaAdvice: 'Lembre-se: Le Mexique termina com E mas é masculino: "au Mexique"!'
  },
  {
    id: 'f-3',
    level: 'B1',
    title: 'Passé Composé vs Imparfait : A Linha do Tempo',
    badge: 'B1/B2 • Narrativa',
    summary: 'Aprenda a contar histórias vivas e naturais em francês.',
    rules: [
      {
        rule: 'Imparfait: cenário, hábitos repetidos e estados mentais/emocionais contínuos.',
        examples: [
          { fr: 'Quand j\'étais enfant, il faisait froid.', pt: 'Quando eu era criança, fazia frio.' }
        ]
      },
      {
        rule: 'Passé Composé: ações pontuais, sucessivas ou que interrompem o cenário.',
        examples: [
          { fr: 'Soudain, le téléphone a sonné.', pt: 'De repente, o telefone tocou.' }
        ]
      }
    ],
    melissaAdvice: 'Cenário contínuo (filme) = Imparfait. Acontecimento imediato (foto) = Passé Composé.'
  },
  {
    id: 'f-4',
    level: 'C1',
    title: 'Les Nuances du Subjonctif et Connecteurs Soutenus',
    badge: 'C1 • Nível Avançado',
    summary: 'Como falar e escrever com precisão e refinamento editorial.',
    rules: [
      {
        rule: 'Concessão nobre com "Bien que" e "Quoique" sempre exige subjuntivo.',
        examples: [
          { fr: 'Bien que le projet soit complexe, nous le mènerons à bien.', pt: 'Embora o projeto seja complexo, nós o levaremos a bom termo.' }
        ]
      },
      {
        rule: 'Alternância elegante entre "En revanche" e "Par contre".',
        examples: [
          { fr: 'Ce cru est jeune, en revanche son arôme est déjà prometteur.', pt: 'Este vinho é jovem, em contrapartida seu aroma já é promissor.' }
        ]
      }
    ],
    melissaAdvice: 'Evite "Par contre" na escrita formal e discursos de apresentação; prefira sempre "En revanche" ou "Néanmoins".'
  }
];
