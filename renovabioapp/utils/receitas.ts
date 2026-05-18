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

export function formatarListaTexto(texto: string) {
  return texto
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

const DEFAULT_RECIPE_IMAGE = require('../assets/images/receitas/bolinho-de-arroz.webp');

const RECIPE_IMAGE_KEYWORDS: Array<{ keywords: string[]; image: ImageSourcePropType }> = [
  {
    keywords: ['carreteiro', 'churrasco'],
    image: require('../assets/images/receitas/Arroz Carreteiro com Sobras de Churrasco.webp'),
  },
  {
    keywords: ['casca de abobora', 'abobora', 'abóbora'],
    image: require('../assets/images/receitas/arroz-com-casca-de-abobora.webp'),
  },
  {
    keywords: ['talos', 'arroz de talos'],
    image: require('../assets/images/receitas/arroz_de_talos.png'),
  },
  {
    keywords: ['bife', 'banana'],
    image: require('../assets/images/receitas/Bife de Casca de Banana.avif'),
  },
  {
    keywords: ['feijoada'],
    image: require('../assets/images/receitas/Bolinho de Feijoada.avif'),
  },
  {
    keywords: ['macarrao', 'macarrão'],
    image: require('../assets/images/receitas/Bolinho de Macarrão.webp'),
  },
  {
    keywords: ['bolinho de arroz', 'arroz'],
    image: require('../assets/images/receitas/bolinho-de-arroz.webp'),
  },
  {
    keywords: ['batata'],
    image: require('../assets/images/receitas/Bolinho-de-casca-de-batata.jpg'),
  },
  {
    keywords: ['talo', 'talos e folhas', 'pao de talos', 'pão de talos'],
    image: require('../assets/images/receitas/bolinho-de-talos.jpg'),
  },
  {
    keywords: ['casca de abacaxi'],
    image: require('../assets/images/receitas/Bolo-de-casca-de-abacaxi.jfif'),
  },
  {
    keywords: ['bolo', 'casca de banana', 'banana'],
    image: require('../assets/images/receitas/Bolo-de-casca-de-Banana-atual-729x410.png'),
  },
  {
    keywords: ['casca de laranja', 'laranja'],
    image: require('../assets/images/receitas/Bolo-de-casca-de-laranja.jfif'),
  },
  {
    keywords: ['casca de maca', 'casca de maçã', 'maca', 'maçã'],
    image: require('../assets/images/receitas/Bolo-de-casca-de-maca.jfif'),
  },
  {
    keywords: ['cristalizada'],
    image: require('../assets/images/receitas/casca de laranja cristalizada.jfif'),
  },
  {
    keywords: ['chips'],
    image: require('../assets/images/receitas/chips-de-casca-de-batata-1024x494.webp'),
  },
  {
    keywords: ['cha', 'chá'],
    image: require('../assets/images/receitas/Chá de Frutas.webp'),
  },
  {
    keywords: ['cocada', 'melancia'],
    image: require('../assets/images/receitas/cocada de entrecasca de melancia.jfif'),
  },
  {
    keywords: ['mamao', 'mamão'],
    image: require('../assets/images/receitas/doce de casca de mamao.jfif'),
  },
  {
    keywords: ['docinho'],
    image: require('../assets/images/receitas/docinho de abacaxi com coco.jfif'),
  },
  {
    keywords: ['farofa'],
    image: require('../assets/images/receitas/farofa-de-casca-de-melancia.jpg'),
  },
  {
    keywords: ['fritada'],
    image: require('../assets/images/receitas/fritada-de-arroz.webp'),
  },
  {
    keywords: ['geleia', 'geleia de manga', 'geléia'],
    image: require('../assets/images/receitas/geleia de manga.jfif'),
  },
  {
    keywords: ['couve-flor', 'gratinado'],
    image: require('../assets/images/receitas/Gratinado de Folhas de Couve-Flor com Queijo.png'),
  },
  {
    keywords: ['pao doce', 'pão doce'],
    image: require('../assets/images/receitas/pao doce abacaxi.jfif'),
  },
  {
    keywords: ['semente', 'sementes de abobora', 'sementes de abóbora'],
    image: require('../assets/images/receitas/pao-feito-com-sementes-de-abobora-recem-cozidas.jpg'),
  },
  {
    keywords: ['refogado', 'legumes'],
    image: require('../assets/images/receitas/Refogado de Casca de Legumes.png'),
  },
  {
    keywords: ['refrigerante'],
    image: require('../assets/images/receitas/Refrigerante Caseiro.webp'),
  },
  {
    keywords: ['salada de macarrao', 'salada de macarrão', 'beterraba', 'sardinha'],
    image: require('../assets/images/receitas/Salada de Macarrão com Molho de Beterraba e Sardinha.webp'),
  },
  {
    keywords: ['sopa'],
    image: require('../assets/images/receitas/Sopa de Talos e Cascas de Legumes.jpg'),
  },
  {
    keywords: ['suco de beterraba'],
    image: require('../assets/images/receitas/Suco de Beterraba.jpg'),
  },
  {
    keywords: ['suco de casca de abacaxi'],
    image: require('../assets/images/receitas/Suco de Casca de Abacaxi.webp'),
  },
  {
    keywords: ['suco de casca de manga'],
    image: require('../assets/images/receitas/Suco de Casca de Manga.jpg'),
  },
  {
    keywords: ['suco de casca de maca', 'suco de casca de maçã'],
    image: require('../assets/images/receitas/Suco de Casca de Maçã.jpg'),
  },
  {
    keywords: ['cascas de frutas'],
    image: require('../assets/images/receitas/Suco de Cascas de Frutas.webp'),
  },
  {
    keywords: ['abacaxi e couve', 'couve'],
    image: require('../assets/images/receitas/suco-de-abacaxi-e-couve.jpg'),
  },
  {
    keywords: ['sufle', 'suflê'],
    image: require('../assets/images/receitas/Suflê de Talos e Pão Amanhecido.png'),
  },
  {
    keywords: ['carne'],
    image: require('../assets/images/receitas/Torta com Sobras de Carne.jpg'),
  },
];

function normalizeText(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

export function getRecipeImage(titulo: string): ImageSourcePropType {
  const nome = normalizeText(titulo);
  const match = RECIPE_IMAGE_KEYWORDS.find(({ keywords }) =>
    keywords.some((keyword) => nome.includes(normalizeText(keyword))),
  );

  return match?.image ?? DEFAULT_RECIPE_IMAGE;
}
