import { ImageSourcePropType } from 'react-native';

export type Receita = {
  id: number;
  titulo: string;
  descricao: string;
  ingredientes: string;
  modoPreparo: string;
  tempoPreparo: number;
  dificuldade: string;
  pontos: number;
  categoria?: {
    nomeCategoria?: string;
    nome?: string;
  };
};

type AccentRule = {
  pattern: RegExp;
  replacement: string;
};

const ACCENT_RULES: AccentRule[] = [
  { pattern: /\bpao\b/gi, replacement: 'pão' },
  { pattern: /\bpães\b/gi, replacement: 'pães' },
  { pattern: /\bmamao\b/gi, replacement: 'mamão' },
  { pattern: /\bmamoes\b/gi, replacement: 'mamões' },
  { pattern: /\bmaca\b/gi, replacement: 'maçã' },
  { pattern: /\bmacas\b/gi, replacement: 'maçãs' },
  { pattern: /\babobora\b/gi, replacement: 'abóbora' },
  { pattern: /\boleo\b/gi, replacement: 'óleo' },
  { pattern: /\bacucar\b/gi, replacement: 'açúcar' },
  { pattern: /\blicao\b/gi, replacement: 'lição' },
  { pattern: /\bcha\b/gi, replacement: 'chá' },
  { pattern: /\bcha de\b/gi, replacement: 'chá de' },
  { pattern: /\bcoco ralado\b/gi, replacement: 'coco ralado' },
  { pattern: /\bagraiao\b/gi, replacement: 'agrião' },
  { pattern: /\bagriao\b/gi, replacement: 'agrião' },
  { pattern: /\bbrocolis\b/gi, replacement: 'brócolis' },
  { pattern: /\bxicara\b/gi, replacement: 'xícara' },
  { pattern: /\bxicaras\b/gi, replacement: 'xícaras' },
  { pattern: /\bfermento em po\b/gi, replacement: 'fermento em pó' },
  { pattern: /\bcanela em po\b/gi, replacement: 'canela em pó' },
  { pattern: /\bcafe\b/gi, replacement: 'café' },
  { pattern: /\bcha de\b/gi, replacement: 'chá de' },
  { pattern: /\blimao\b/gi, replacement: 'limão' },
  { pattern: /\blimoes\b/gi, replacement: 'limões' },
  { pattern: /\bpimentao\b/gi, replacement: 'pimentão' },
  { pattern: /\bpimentoes\b/gi, replacement: 'pimentões' },
  { pattern: /\bmolho de beterraba e sardinha\b/gi, replacement: 'molho de beterraba e sardinha' },
  { pattern: /\bsufle\b/gi, replacement: 'suflê' },
  { pattern: /\bmedio\b/gi, replacement: 'médio' },
  { pattern: /\bmedia\b/gi, replacement: 'média' },
  { pattern: /\bdificil\b/gi, replacement: 'difícil' },
  { pattern: /\bfacil\b/gi, replacement: 'fácil' },
  { pattern: /\bdescricao\b/gi, replacement: 'descrição' },
  { pattern: /\bpreparo\b/gi, replacement: 'preparo' },
  { pattern: /\bnao\b/gi, replacement: 'não' },
  { pattern: /\bapos\b/gi, replacement: 'após' },
  { pattern: /\bporcoes\b/gi, replacement: 'porções' },
];

function preserveCase(source: string, replacement: string) {
  if (source.toUpperCase() === source) {
    return replacement.toUpperCase();
  }

  if (source[0] && source[0] === source[0].toUpperCase()) {
    return replacement.charAt(0).toUpperCase() + replacement.slice(1);
  }

  return replacement;
}

export function corrigirTextoReceita(texto?: string) {
  if (!texto) {
    return '';
  }

  return ACCENT_RULES.reduce(
    (valor, rule) =>
      valor.replace(rule.pattern, (trecho) => preserveCase(trecho, rule.replacement)),
    texto,
  );
}

export function formatarListaTexto(texto: string) {
  return texto
    .split(',')
    .map((item) => corrigirTextoReceita(item).trim())
    .filter(Boolean);
}

const DEFAULT_RECIPE_IMAGE = require('../assets/images/receitas/bolinho-de-arroz.jpg');

function normalizeText(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

const RECIPE_IMAGE_BY_TITLE: Array<{ title: string; image: ImageSourcePropType }> = [
  {
    title: 'Bolo de Casca de Banana',
    image: require('../assets/images/receitas/Bolo-de-casca-de-Banana-atual-729x410.png'),
  },
  {
    title: 'Arroz de Talos',
    image: require('../assets/images/receitas/arroz_de_talos.png'),
  },
  {
    title: 'Bolo de Laranja com Casca',
    image: require('../assets/images/receitas/Bolo-de-casca-de-laranja.jpg'),
  },
  {
    title: 'Bolo de Laranja com Maca e Aveia',
    image: require('../assets/images/receitas/Bolo-de-casca-de-maca.jpg'),
  },
  {
    title: 'Geleia de Manga Sem Acucar',
    image: require('../assets/images/receitas/geleia de manga.jpg'),
  },
  {
    title: 'Doce de Casca de Mamao',
    image: require('../assets/images/receitas/doce de casca de mamao.jpg'),
  },
  {
    title: 'Bolo de Casca de Abacaxi',
    image: require('../assets/images/receitas/Bolo-de-casca-de-abacaxi.jpg'),
  },
  {
    title: 'Casca de Laranja Cristalizada',
    image: require('../assets/images/receitas/casca de laranja cristalizada.jpg'),
  },
  {
    title: 'Docinho de Abacaxi com Coco',
    image: require('../assets/images/receitas/docinho de abacaxi com coco.jpg'),
  },
  {
    title: 'Cocada de Entrecasca de Melancia',
    image: require('../assets/images/receitas/cocada de entrecasca de melancia.jpg'),
  },
  {
    title: 'Pao Doce de Abacaxi',
    image: require('../assets/images/receitas/pao doce abacaxi.jpg'),
  },
  {
    title: 'Arroz de Casca de Abobora',
    image: require('../assets/images/receitas/arroz-com-casca-de-abobora.jpg'),
  },
  {
    title: 'Chips de Cascas e Sementes',
    image: require('../assets/images/receitas/chips-de-casca-de-batata-1024x494.jpg'),
  },
  {
    title: 'Farofa de Casca de Melancia',
    image: require('../assets/images/receitas/farofa-de-casca-de-melancia.jpg'),
  },
  {
    title: 'Pao de Folhas e Talos',
    image: require('../assets/images/receitas/pao-de-talos-e-folhas.jpg'),
  },
  {
    title: 'Pao de Abobora com Sementes',
    image: require('../assets/images/receitas/pao-feito-com-sementes-de-abobora-recem-cozidas.jpg'),
  },
  {
    title: 'Bolinho de Casca de Batata',
    image: require('../assets/images/receitas/Bolinho-de-casca-de-batata.jpg'),
  },
  {
    title: 'Bolinho de Folhas e Talos',
    image: require('../assets/images/receitas/bolinho-de-talos.jpg'),
  },
  {
    title: 'Gratinado de Folhas de Couve-Flor',
    image: require('../assets/images/receitas/Gratinado de Folhas de Couve-Flor com Queijo.jpg'),
  },
  {
    title: 'Sopa de Talos e Cascas',
    image: require('../assets/images/receitas/Sopa de Talos e Cascas de Legumes.jpg'),
  },
  {
    title: 'Refogado de Cascas de Legumes',
    image: require('../assets/images/receitas/Refogado de Casca de Legumes.jpg'),
  },
  {
    title: 'Bife de Casca de Banana',
    image: require('../assets/images/receitas/Bife de Casca de Banana.jpg'),
  },
  {
    title: 'Bolinho de Arroz',
    image: require('../assets/images/receitas/bolinho-de-arroz.jpg'),
  },
  {
    title: 'Salada de Macarrao com Beterraba',
    image: require('../assets/images/receitas/Salada de Macarrão com Molho de Beterraba e Sardinha.jpg'),
  },
  {
    title: 'Sufle de Talos e Pao Amanhecido',
    image: require('../assets/images/receitas/Suflê de Talos e Pão Amanhecido.jpg'),
  },
  {
    title: 'Fritada de Arroz',
    image: require('../assets/images/receitas/fritada-de-arroz.jpg'),
  },
  {
    title: 'Arroz Carreteiro com Sobras',
    image: require('../assets/images/receitas/Arroz Carreteiro com Sobras de Churrasco.jpg'),
  },
  {
    title: 'Torta com Sobras de Carne',
    image: require('../assets/images/receitas/Torta com Sobras de Carne.jpg'),
  },
  {
    title: 'Bolinho de Feijoada',
    image: require('../assets/images/receitas/Bolinho de Feijoada.jpg'),
  },
  {
    title: 'Bolinho de Macarrao',
    image: require('../assets/images/receitas/Bolinho de Macarrão.jpg'),
  },
  {
    title: 'Suco de Casca de Manga',
    image: require('../assets/images/receitas/Suco de Casca de Manga.jpg'),
  },
  {
    title: 'Refrigerante Caseiro',
    image: require('../assets/images/receitas/Refrigerante Caseiro.jpg'),
  },
  {
    title: 'Suco de Abacaxi com Couve',
    image: require('../assets/images/receitas/suco-de-abacaxi-e-couve.jpg'),
  },
  {
    title: 'Suco de Beterraba',
    image: require('../assets/images/receitas/Suco de Beterraba.jpg'),
  },
  {
    title: 'Suco de Casca de Abacaxi',
    image: require('../assets/images/receitas/Suco de Casca de Abacaxi.jpg'),
  },
  {
    title: 'Suco de Casca de Maca',
    image: require('../assets/images/receitas/Suco de Casca de Maçã.jpg'),
  },
  {
    title: 'Suco de Cascas de Frutas',
    image: require('../assets/images/receitas/Suco de Cascas de Frutas.jpg'),
  },
  {
    title: 'Cha de Frutas',
    image: require('../assets/images/receitas/Chá de Frutas.jpg'),
  },
];

const RECIPE_IMAGE_FALLBACKS: Array<{ keywords: string[]; image: ImageSourcePropType }> = [
  {
    keywords: ['banana'],
    image: require('../assets/images/receitas/Bolo-de-casca-de-Banana-atual-729x410.png'),
  },
  {
    keywords: ['maca', 'aveia'],
    image: require('../assets/images/receitas/Bolo-de-casca-de-maca.jpg'),
  },
  {
    keywords: ['laranja'],
    image: require('../assets/images/receitas/Bolo-de-casca-de-laranja.jpg'),
  },
  {
    keywords: ['abacaxi'],
    image: require('../assets/images/receitas/Suco de Casca de Abacaxi.jpg'),
  },
  {
    keywords: ['arroz'],
    image: require('../assets/images/receitas/bolinho-de-arroz.jpg'),
  },
];

export function getRecipeImage(titulo: string): ImageSourcePropType {
  const normalizedTitle = normalizeText(titulo);

  const exactMatch = RECIPE_IMAGE_BY_TITLE.find(
    ({ title }) => normalizeText(title) === normalizedTitle,
  );

  if (exactMatch) {
    return exactMatch.image;
  }

  const fallbackMatch = RECIPE_IMAGE_FALLBACKS.find(({ keywords }) =>
    keywords.some((keyword) => normalizedTitle.includes(normalizeText(keyword))),
  );

  return fallbackMatch?.image ?? DEFAULT_RECIPE_IMAGE;
}

export function formatarDificuldadeReceita(dificuldade?: string) {
  const valor = normalizeText(dificuldade ?? '');

  if (valor === 'facil') {
    return 'Fácil';
  }

  if (valor === 'media' || valor === 'medio') {
    return 'Média';
  }

  if (valor === 'dificil') {
    return 'Difícil';
  }

  return corrigirTextoReceita(dificuldade || 'Não informado');
}

export function formatarModoPreparoEmPassos(texto?: string) {
  return corrigirTextoReceita(texto)
    .split(/(?<=[.;:])\s+/)
    .map((item) => item.replace(/[.;:]\s*$/g, '').trim())
    .filter((item) => item.length > 0);
}

export function formatarReceita(receita: Receita): Receita {
  return {
    ...receita,
    titulo: corrigirTextoReceita(receita.titulo),
    descricao: corrigirTextoReceita(receita.descricao),
    ingredientes: corrigirTextoReceita(receita.ingredientes),
    modoPreparo: corrigirTextoReceita(receita.modoPreparo),
    dificuldade: formatarDificuldadeReceita(receita.dificuldade),
  };
}
