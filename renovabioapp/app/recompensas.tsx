import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ImageBackground,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { useAuth } from '../context/auth-context';
import { getApiBaseUrl, getAuthHeaders, toApiFileUrl } from '../utils/api';

type Parceiro = {
  id?: number;
  nome?: string;
  descricao?: string;
};

type Recompensa = {
  id: number;
  descricao: string;
  pontosNecessarios: number;
  quantidadeDisponivel: number;
  ativo?: boolean;
  parceiro?: Parceiro | null;
};

type TrocaRecompensa = {
  codigoVoucher?: string;
};

type UsuarioResponse = {
  id: number;
  nome: string;
  email: string;
  pontuacao: number;
  photoUri?: string | null;
  token?: string;
};

export default function Recompensas() {
  const { updateUser, user } = useAuth();
  const apiBaseUrl = useMemo(() => getApiBaseUrl(), []);
  const [recompensas, setRecompensas] = useState<Recompensa[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [resgatandoId, setResgatandoId] = useState<number | null>(null);
  const [erro, setErro] = useState('');

  const carregarRecompensas = useCallback(async () => {
    setCarregando(true);
    setErro('');

    try {
      const response = await fetch(`${apiBaseUrl}/recompensas`);

      if (!response.ok) {
        setErro('Não foi possivel carregar as recompensas.');
        return;
      }

      const data = (await response.json()) as Recompensa[];
      setRecompensas(data.filter((item) => item.ativo !== false));
    } catch {
      setErro(`Não foi possível acessar a API em ${apiBaseUrl}.`);
    } finally {
      setCarregando(false);
    }
  }, [apiBaseUrl]);

  useEffect(() => {
    void carregarRecompensas();
  }, [carregarRecompensas]);

  const sincronizarPontuacaoUsuario = useCallback(async () => {
    if (!user?.id) {
      return null;
    }

    try {
      const response = await fetch(`${apiBaseUrl}/usuarios/${user.id}`, {
        headers: getAuthHeaders(user.token),
      });
      if (!response.ok) {
        return null;
      }

      const usuarioAtualizado = (await response.json()) as UsuarioResponse;
      if (usuarioAtualizado.pontuacao !== (user?.pontuacao ?? 0)) {
        await updateUser({
          pontuacao: usuarioAtualizado.pontuacao,
          photoUri: toApiFileUrl(usuarioAtualizado.photoUri),
        });
      }
      return usuarioAtualizado.pontuacao;
    } catch {
      return null;
    }
  }, [apiBaseUrl, updateUser, user?.id, user?.pontuacao, user?.token]);

  useEffect(() => {
    void sincronizarPontuacaoUsuario();
  }, [sincronizarPontuacaoUsuario]);

  const pontuacaoAtual = user?.pontuacao ?? 0;

  async function confirmarTroca(recompensa: Recompensa) {
    if (!user?.id) {
      return;
    }

    Alert.alert(
      'Trocar pontos',
      `Deseja resgatar "${recompensa.descricao}" por ${recompensa.pontosNecessarios} pontos?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Resgatar', onPress: () => void trocarPontos(recompensa) },
      ],
    );
  }

  async function trocarPontos(recompensa: Recompensa) {
    if (!user?.id) {
      return;
    }

    const pontuacaoSincronizada = await sincronizarPontuacaoUsuario();
    const pontosDisponiveis = pontuacaoSincronizada ?? user.pontuacao ?? 0;

    if (pontosDisponiveis < (recompensa.pontosNecessarios ?? 0)) {
      Alert.alert('Troca de pontos', 'Você não tem pontos suficientes para essa recompensa.');
      return;
    }

    setResgatandoId(recompensa.id);

    try {
      const response = await fetch(
        `${apiBaseUrl}/recompensas/trocar?usuarioId=${user.id}&recompensaId=${recompensa.id}`,
        {
          method: 'POST',
          headers: getAuthHeaders(user.token),
        },
      );

      if (!response.ok) {
        const mensagem = await extrairMensagemErro(response);
        if (mensagem.toLowerCase().includes('pontos insuficientes')) {
          await sincronizarPontuacaoUsuario();
        }
        Alert.alert('Troca de pontos', mensagem);
        return;
      }

      const troca = (await response.json()) as TrocaRecompensa;
      const novaPontuacao = Math.max(0, pontosDisponiveis - (recompensa.pontosNecessarios ?? 0));

      await updateUser({ pontuacao: novaPontuacao });
      setRecompensas((atual) =>
        atual.map((item) =>
          item.id === recompensa.id
            ? { ...item, quantidadeDisponivel: Math.max(0, (item.quantidadeDisponivel ?? 0) - 1) }
            : item,
        ),
      );

      Alert.alert(
        'Resgate realizado',
        troca.codigoVoucher
          ? `Seu código de voucher e ${troca.codigoVoucher}.`
          : 'Sua recompensa foi resgatada com sucesso.',
        [
          { text: 'Fechar', style: 'cancel' },
          { text: 'Ver histórico', onPress: () => router.push('/historico-recompensas') },
        ],
      );
    } catch {
      Alert.alert('Troca de pontos', `Não foi possível acessar a API em ${apiBaseUrl}.`);
    } finally {
      setResgatandoId(null);
    }
  }

  return (
    <ImageBackground
      source={require('../assets/images/backgroundoutros.png')}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.headerSide}>
            <Ionicons name="arrow-back" size={28} color="#0B7A43" />
          </TouchableOpacity>

          <Text style={styles.title}>Troca de Pontos</Text>

          <View style={styles.headerSide} />
        </View>

        <View style={styles.pointsCard}>
          <Text style={styles.pointsLabel}>Seus pontos disponíveis</Text>
          <Text style={styles.pointsValue}>{user?.pontuacao ?? 0}</Text>
        </View>

        <Text style={styles.subtitle}>
          Troque sua pontuação por recompensas oferecidas pelos parceiros.
        </Text>

        <TouchableOpacity onPress={() => router.push('/historico-recompensas')} style={styles.historyButton}>
          <Ionicons name="receipt-outline" size={18} color="#F7F3DF" />
          <Text style={styles.historyButtonText}>Histórico de vouchers</Text>
        </TouchableOpacity>

        {carregando ? (
          <View style={styles.centerState}>
            <ActivityIndicator color="#0B7A43" size="large" />
          </View>
        ) : null}

        {!carregando && erro ? (
          <View style={styles.feedbackCard}>
            <Text style={styles.feedbackText}>{erro}</Text>
            <TouchableOpacity onPress={() => void carregarRecompensas()} style={styles.retryButton}>
              <Text style={styles.retryText}>Tentar novamente</Text>
            </TouchableOpacity>
          </View>
        ) : null}

        {!carregando && !erro && recompensas.length === 0 ? (
          <View style={styles.feedbackCard}>
            <Text style={styles.feedbackText}>Nenhuma recompensa disponível no momento.</Text>
          </View>
        ) : null}

        {!carregando && !erro ? (
          <View style={styles.cardsWrapper}>
            {recompensas.map((recompensa) => {
              const semEstoque = (recompensa.quantidadeDisponivel ?? 0) <= 0;
              const pontosInsuficientes = pontuacaoAtual < (recompensa.pontosNecessarios ?? 0);
              const desabilitado = semEstoque || pontosInsuficientes || resgatandoId !== null;
              const resgatando = resgatandoId === recompensa.id;

              return (
                <View key={recompensa.id} style={styles.card}>
                  <View style={styles.cardHeader}>
                    <View style={styles.partnerBadge}>
                      <Text style={styles.partnerBadgeText}>{recompensa.parceiro?.nome || 'Parceiro'}</Text>
                    </View>
                    <Text style={styles.pointsNeeded}>{recompensa.pontosNecessarios} pts</Text>
                  </View>

                  <Text style={styles.cardTitle}>{recompensa.descricao}</Text>

                  {recompensa.parceiro?.descricao ? (
                    <Text style={styles.partnerDescription}>{recompensa.parceiro.descricao}</Text>
                  ) : null}

                  <View style={styles.metaRow}>
                    <InfoItem
                      icon="gift-outline"
                      label={semEstoque ? 'Esgotado' : `${recompensa.quantidadeDisponivel} disponíveis`}
                    />
                    <InfoItem
                      icon="leaf-outline"
                      label={pontosInsuficientes ? 'Pontos insuficientes' : 'Pronto para resgatar'}
                    />
                  </View>

                  <TouchableOpacity
                    disabled={desabilitado}
                    onPress={() => void confirmarTroca(recompensa)}
                    style={[styles.actionButton, desabilitado ? styles.actionButtonDisabled : null]}
                  >
                    {resgatando ? (
                      <ActivityIndicator color="#F7F3DF" />
                    ) : (
                      <Text style={styles.actionText}>{semEstoque ? 'Indisponível' : 'Trocar pontos'}</Text>
                    )}
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        ) : null}
      </ScrollView>
    </ImageBackground>
  );
}

function InfoItem({ icon, label }: { icon: keyof typeof Ionicons.glyphMap; label: string }) {
  return (
    <View style={styles.metaItem}>
      <Ionicons name={icon} size={16} color="#2D6A4F" />
      <Text style={styles.metaText}>{label}</Text>
    </View>
  );
}

async function extrairMensagemErro(response: Response) {
  try {
    const bodyText = await response.text();
    if (!bodyText) {
      return 'Não foi possível concluir a troca.';
    }

    try {
      const data = JSON.parse(bodyText) as { message?: string; error?: string };
      return data.message || data.error || bodyText;
    } catch {
      return bodyText;
    }
  } catch {
    return 'Não foi possível concluir a troca.';
  }
}

const styles = {
  container: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 52,
    paddingBottom: 36,
  },
  header: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
    marginBottom: 18,
  },
  headerSide: {
    width: 32,
  },
  title: {
    color: '#0B7A43',
    fontSize: 28,
    fontWeight: '800' as const,
  },
  pointsCard: {
    backgroundColor: 'rgba(244,235,214,0.95)',
    borderRadius: 26,
    paddingVertical: 20,
    paddingHorizontal: 18,
    alignItems: 'center' as const,
    marginBottom: 14,
  },
  pointsLabel: {
    color: '#35506B',
    fontSize: 15,
    marginBottom: 6,
  },
  pointsValue: {
    color: '#0B7A43',
    fontSize: 34,
    fontWeight: '800' as const,
  },
  subtitle: {
    color: '#0B7A43',
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center' as const,
    marginBottom: 22,
  },
  centerState: {
    marginTop: 90,
    alignItems: 'center' as const,
  },
  historyButton: {
    alignSelf: 'center' as const,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 8,
    backgroundColor: '#0B7A43',
    borderRadius: 999,
    paddingVertical: 12,
    paddingHorizontal: 22,
    marginBottom: 22,
  },
  historyButtonText: {
    color: '#F7F3DF',
    fontSize: 15,
    fontWeight: '700' as const,
  },
  cardsWrapper: {
    gap: 16,
  },
  card: {
    backgroundColor: 'rgba(250,245,228,0.96)',
    borderRadius: 24,
    padding: 18,
  },
  cardHeader: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    gap: 10,
    marginBottom: 12,
  },
  partnerBadge: {
    backgroundColor: '#DCE8C7',
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  partnerBadgeText: {
    color: '#14532D',
    fontSize: 12,
    fontWeight: '700' as const,
  },
  pointsNeeded: {
    color: '#0B7A43',
    fontSize: 16,
    fontWeight: '800' as const,
  },
  cardTitle: {
    color: '#0B7A43',
    fontSize: 20,
    fontWeight: '800' as const,
    lineHeight: 26,
  },
  partnerDescription: {
    color: '#35506B',
    fontSize: 15,
    lineHeight: 22,
    marginTop: 8,
  },
  metaRow: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    gap: 12,
    marginTop: 14,
  },
  metaItem: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    backgroundColor: '#EEF3E2',
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 12,
    gap: 6,
  },
  metaText: {
    color: '#2D6A4F',
    fontSize: 13,
    fontWeight: '600' as const,
  },
  actionButton: {
    backgroundColor: '#0B7A43',
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: 'center' as const,
    marginTop: 18,
  },
  actionButtonDisabled: {
    backgroundColor: '#8AA28F',
  },
  actionText: {
    color: '#F7F3DF',
    fontSize: 15,
    fontWeight: '700' as const,
  },
  feedbackCard: {
    backgroundColor: 'rgba(244,235,214,0.94)',
    borderRadius: 22,
    padding: 18,
  },
  feedbackText: {
    color: '#35506B',
    textAlign: 'center' as const,
    lineHeight: 24,
    fontSize: 16,
  },
  retryButton: {
    marginTop: 14,
    backgroundColor: '#0B7A43',
    borderRadius: 18,
    paddingVertical: 12,
    alignItems: 'center' as const,
  },
  retryText: {
    color: '#F7F3DF',
    fontWeight: '700' as const,
  },
};
