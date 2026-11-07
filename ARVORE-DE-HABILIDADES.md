# 🌳 Árvore de Habilidades & Painel de Conquistas

Guia para a professora adicionar conteúdo manualmente ao longo do curso.
Nada aqui exige programar de verdade: dá para fazer **tudo pelo Painel da
Professora** (aba "Árvore") ou, se preferir, editando um único arquivo.

## Como funciona na tela (visual)

- **Tronco** — faixa central no topo: "Francês A1 → A2", com a % de folhas dominadas.
- **Galhos** — cards grandes, um para cada macro-habilidade (Gramática, Vocabulário, Cultura…).
  Quando todas as folhas do galho forem dominadas, o galho "floresce" (moldura dourada + 🌸).
- **Folhas** — mini-cards dentro de cada galho, cada uma com 3 estados:
  - 🔒 **Bloqueada** — a folha anterior do galho ainda não foi dominada;
  - 🌱 **Em progresso** — o aluno marcou que está praticando;
  - 🌸 **Dominada** — tem o check verde e a data de conclusão.
- **Conquista especial** — ao completar a árvore inteira, o badge 🌳 "La Forêt du Français" é desbloqueado.
- **Painel de Conquistas** — logo abaixo da árvore (e também visível ao aluno):
  grade de badges com ícone, nome, descrição, condição e data de conquista.

## Modelo de dados

| Campo (GALHO) | Tipo | Exemplo |
|---|---|---|
| `id` | texto único | `oral` |
| `name` | nome do galho | `"Compreensão Oral"` |
| `icon` | emoji | `🎧` |
| `color` | hex | `#2C5E9E` |
| `order` | número (ordem de exibição) | `4` |
| `level` | `A1` \| `A2` \| `B1` \| `C1` | `A2` |

| Campo (FOLHA) | Tipo | Exemplo |
|---|---|---|
| `id` | gerado automaticamente | `leaf-1749...` |
| `branchId` | `id` do galho | `oral` |
| `title` | título | `"Verbo être"` |
| `description` | descrição curta | `"Je suis, tu es…"` |
| `contents` | lista de textos | `["Conjugação", "Frases de apresentação"]` |
| `skills` | lista: `ouvir` `falar` `ler` `escrever` | `["falar", "ler"]` |
| `linkedActivities` | lista: `flashcards` `quiz` `dictee` | `["quiz", "flashcards"]` |
| `criterion` | critério de check | `"80% no quiz + 10 flashcards"` |
| `level` | nível | `A1` |
| `order` | número (ordem dentro do galho; desbloqueia em sequência) | `2` |

| Campo (BADGE) | Tipo | Exemplo |
|---|---|---|
| `id` | texto único | `badge-streak7` |
| `name` | nome (pode ser bilíngue) | `"7 jours d'affilée"` |
| `icon` | emoji | `🔥` |
| `description` | microcopy motivacional | `"7 dias seguidos praticando!"` |
| `condition` | condição amigável | `"Praticar 7 dias seguidos"` |
| `kind` | `branch` \| `tree` \| `streak` \| `milestone` \| `performance` | `streak` |
| `branchId` | só para `kind: "branch"` | `gram` |
| `threshold` | só para `streak` (dias) e `milestone` (palavras) | `7` |

O status do aluno (`bloqueada` / `em progresso` / `dominada` + `data_conclusao`)
**não é editado por você**: é derivado automaticamente de
`fam_skill_progress_v1` (o que o aluno marcou) e da ordem das folhas.

## ✅ Jeito fácil: adicionar pelo Painel da Professora

1. Entre no **Espaço do Aluno** com o login de professora → **Melissa**.
2. Abra a aba **Árvore** (contador = galhos + folhas criados por você).
3. **Novo Galho**: nome, emoji, cor, ordem e nível → "Criar Galho".
4. **Nova Folha**: dentro do card do galho, botão **"+ Folha"** — título, descrição,
   conteúdos (separe com ` | `), habilidades, atividades vinculadas, critério e ordem.
   A **ordem** define a sequência de desbloqueio: ordem 1 fica livre, as demais
   só abrem quando a anterior for dominada.
5. Tudo aparece na hora na aba **Árvore** do app (área pública), mesclado com o
   exemplo fixo do programa.

## ✏️ Jeito avançado: editar o arquivo de configuração

O "arquivo de configuração" que o app lê é **`src/data/skillTreeData.ts`**
(JSON em formato TypeScript — o formato amigável recomendado, pois é versionado
com o código; CSV/planilha perderia listas e emojis com facilidade).

**Adicionar um GALHO** — acrescente um objeto a `SKILL_BRANCHES`:

```ts
{
  id: 'oral',            // não repita este id
  name: 'Compreensão Oral',
  icon: '🎧',
  color: '#2C5E9E',
  order: 4,              // posição na árvore
  level: 'A2',
}
```

**Adicionar uma FOLHA a um galho existente** — acrescente a `SKILL_LEAVES`:

```ts
{
  id: 'leaf-direcciones',   // não repita
  branchId: 'oral',         // galho dono da folha
  title: 'Direções & transportes',
  description: 'Se virar no métro sem tradutor.',
  contents: ['Vocabulário do métro', 'Pedir informações'],
  skills: ['ouvir', 'falar'],
  linkedActivities: ['flashcards', 'dictee'],
  criterion: 'Completar 2 dictées de transporte',
  level: 'A2',
  order: 1,
}
```

**Adicionar um BADGE** — acrescente a `SKILL_BADGES`:

```ts
{
  id: 'badge-oral',
  name: 'Oreille d\'or',
  icon: '🎧',
  description: 'Você entende francês falado como nativo!',
  condition: 'Concluir todas as folhas do galho Compreensão Oral',
  kind: 'branch',        // branch | tree | streak | milestone | performance
  branchId: 'oral',
}
```

Depois de salvar o arquivo, o dev server (Vite) atualiza a página sozinho.

## Regras dos badges automáticos

- `branch` — desbloqueia quando **todas as folhas do galho** ficarem 🌸.
- `tree` — desbloqueia quando a **árvore inteira** ficar 🌸 (conquista especial).
- `streak` — dias seguidos com qualquer atividade registrada (quiz, dictée, flashcard).
- `milestone` — nº de palavras dominadas nos flashcards ("J'ai compris !").
- `performance` — 100% em qualquer quiz completo.

A data de conquista fica salva em `fam_skill_badges_v1` e aparece no painel.

## Amostra pronta (o que já vem preenchido)

- **3 galhos**: Gramática 📚 · Vocabulário 🥖 · Cultura 🗼 (nível A1)
- **11 folhas** (4 + 4 + 3), com conteúdos, habilidades, atividades e critérios
- **6 badges**: 🏅 Maître de la Grammaire · 🥖 Excellence du Vocabulaire ·
  🎯 Sans faute ! · 🔥 7 jours d'affilée · 🥐 50 mots ! · 🌳 La Forêt du Français
