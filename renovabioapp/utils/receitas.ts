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

export function getRecipeImage(titulo: string) {
  const nome = titulo.toLowerCase();

  if (nome.includes('banana')) {
    return 'https://images.unsplash.com/photo-1606101204550-509ecb7b7f85?auto=format&fit=crop&w=300&q=80';
  }

  if (nome.includes('arroz')) {
    return 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=300&q=80';
  }

  if (nome.includes('laranja')) {
    return 'https://images.unsplash.com/photo-1519996529931-28324d5a630e?auto=format&fit=crop&w=300&q=80';
  }

  if (nome.includes('abacaxi')) {
    return 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=300&q=80';
  }

  return 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=300&q=80';
}
