import AsyncStorage from '@react-native-async-storage/async-storage';

export type Desafio = {
  id: number;
  titulo: string;
  descricao: string;
  pontos: number;
  duracaoDias: number;
  ativo: boolean;
};

export type UsuarioDesafio = {
  id: number;
  status: string;
  progresso: number;
  desafio: Desafio;
};

export type Comprovacao = {
  uri: string;
  data: string;
};

function getComprovacaoKey(usuarioDesafioId: number) {
  return `renovabio:desafio-fotos:${usuarioDesafioId}`;
}

export async function listarComprovacoes(usuarioDesafioId: number) {
  const atual = await AsyncStorage.getItem(getComprovacaoKey(usuarioDesafioId));
  return atual ? (JSON.parse(atual) as Comprovacao[]) : [];
}

export async function salvarComprovacao(usuarioDesafioId: number, photoUri: string) {
  const atual = await listarComprovacoes(usuarioDesafioId);
  const proximaLista = [
    ...atual,
    {
      uri: photoUri,
      data: new Date().toLocaleDateString('pt-BR'),
    },
  ];
  await AsyncStorage.setItem(getComprovacaoKey(usuarioDesafioId), JSON.stringify(proximaLista));
  return proximaLista;
}

export function calcularDiasConcluidos(participacao?: UsuarioDesafio | null) {
  if (!participacao) {
    return 0;
  }

  const duracao = Math.max(1, participacao.desafio?.duracaoDias ?? 1);

  if (participacao.status === 'CONCLUIDO') {
    return duracao;
  }

  return Math.min(duracao, Math.max(0, Math.round(((participacao.progresso ?? 0) / 100) * duracao)));
}
