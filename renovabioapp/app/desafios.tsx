import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  ImageBackground,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { useAuth } from '../context/auth-context';
import { getApiBaseUrl, getAuthHeaders } from '../utils/api';
import { calcularDiasConcluidos, Desafio, UsuarioDesafio } from '../utils/desafios';

export default function Desafios() {
  const { user } = useAuth();
  const apiBaseUrl = useMemo(() => getApiBaseUrl(), []);
  const [desafios, setDesafios] = useState<Desafio[]>([]);
  const [participacoes, setParticipacoes] = useState<UsuarioDesafio[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [modalAberto, setModalAberto] = useState(false);

  const carregarDados = useCallback(async () => {
    if (!user?.id) {
      setErro('Usuário não autenticado.');
      setCarregando(false);
      return;
    }

    setCarregando(true);
    setErro('');

    try {
      const [desafiosResponse, participacoesResponse] = await Promise.all([
        fetch(`${apiBaseUrl}/desafios`),
        fetch(`${apiBaseUrl}/desafios/usuario/${user.id}`, {
          headers: getAuthHeaders(user.token),
        }),
      ]);

      if (!desafiosResponse.ok || !participacoesResponse.ok) {
        setErro('Não foi possível carregar os desafios.');
        return;
      }

      const desafiosData = (await desafiosResponse.json()) as Desafio[];
      const participacoesData = (await participacoesResponse.json()) as UsuarioDesafio[];

      setDesafios(desafiosData.filter((desafio) => desafio.ativo !== false));
      setParticipacoes(participacoesData);
    } catch {
      setErro(`Não foi possível acessar a API em ${apiBaseUrl}.`);
    } finally {
      setCarregando(false);
    }
  }, [apiBaseUrl, user?.id, user?.token]);

  useEffect(() => {
    void carregarDados();
  }, [carregarDados]);

  function getParticipacao(desafioId: number) {
    return participacoes.find((participacao) => participacao.desafio?.id === desafioId);
  }

  const desafiosAtivos = participacoes.filter((item) => item.status !== 'CONCLUIDO').length;

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

          <Text style={styles.title}>Desafios</Text>

          <TouchableOpacity onPress={() => setModalAberto(true)} style={[styles.headerSide, { alignItems: 'flex-end' }]}>
            <Ionicons name="information-circle-outline" size={30} color="#0B7A43" />
          </TouchableOpacity>
        </View>

        <View style={styles.summaryCard}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>{desafios.length}</Text>
            <Text style={styles.summaryLabel}>Disponíveis</Text>
          </View>

          <View style={styles.summaryDivider} />

          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>{desafiosAtivos}</Text>
            <Text style={styles.summaryLabel}>Em andamento</Text>
          </View>
        </View>

        {carregando ? (
          <View style={styles.centerState}>
            <ActivityIndicator color="#0B7A43" size="large" />
          </View>
        ) : null}

        {!carregando && erro ? (
          <View style={styles.feedbackCard}>
            <Text style={styles.feedbackText}>{erro}</Text>
            <TouchableOpacity onPress={() => void carregarDados()} style={styles.historyButton}>
              <Text style={styles.historyText}>Tentar novamente</Text>
            </TouchableOpacity>
          </View>
        ) : null}

        {!carregando && !erro && desafios.length === 0 ? (
          <View style={styles.feedbackCard}>
            <Text style={styles.feedbackText}>Nenhum desafio disponível no momento.</Text>
          </View>
        ) : null}

        {!carregando && !erro ? (
          <View style={styles.cardsWrapper}>
            {desafios.map((desafio) => {
              const participacao = getParticipacao(desafio.id);
              const dias = calcularDiasConcluidos(participacao);
              const largura = desafio.duracaoDias > 0 ? (dias / desafio.duracaoDias) * 100 : 0;

              return (
                <TouchableOpacity
                  key={desafio.id}
                  activeOpacity={0.92}
                  onPress={() => router.push((`/desafio-detalhe?id=${desafio.id}`) as never)}
                  style={styles.card}
                >
                  <View style={styles.cardTopRow}>
                    <Text style={styles.cardTitle}>{desafio.titulo}</Text>
                    {participacao ? (
                      <View style={[styles.statusBadge, participacao.status === 'CONCLUIDO' ? styles.statusDone : styles.statusProgress]}>
                        <Text style={styles.statusText}>
                          {participacao.status === 'CONCLUIDO' ? 'Concluido' : 'Ativo'}
                        </Text>
                      </View>
                    ) : null}
                  </View>

                  <Text style={styles.pointsInfo}>{desafio.pontos} pontos</Text>

                  <View style={styles.progressRow}>
                    <View style={styles.progressTrack}>
                      <View style={[styles.progressFill, { width: `${Math.max(0, Math.min(100, largura))}%` }]} />
                    </View>
                    <Text style={styles.progressLabel}>
                      {dias}/{desafio.duracaoDias}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        ) : null}

        {!carregando && !erro ? (
          <TouchableOpacity onPress={() => router.push('/historico-desafios')} style={styles.historyButton}>
            <Text style={styles.historyText}>Histórico de Desafios</Text>
          </TouchableOpacity>
        ) : null}
      </ScrollView>

      <Modal transparent animationType="fade" visible={modalAberto} onRequestClose={() => setModalAberto(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Como funcionam os desafios?</Text>
            <Text style={styles.modalItem}>• Você deve cumprir o desafio durante os dias estipulados.</Text>
            <Text style={styles.modalItem}>• Cada dia precisa ser registrado com uma comprovação em foto.</Text>
            <Text style={styles.modalItem}>• Quando todos os dias forem completados, o desafio pode ser concluído.</Text>
            <Text style={styles.modalItem}>• Ao concluir, você recebe pontos no aplicativo.</Text>

            <TouchableOpacity onPress={() => setModalAberto(false)} style={styles.modalClose}>
              <Text style={styles.modalCloseText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ImageBackground>
  );
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
    marginBottom: 20,
  },
  headerSide: {
    width: 40,
  },
  title: {
    color: '#0B7A43',
    fontSize: 28,
    fontWeight: '800' as const,
  },
  summaryCard: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
    backgroundColor: 'rgba(244,235,214,0.92)',
    borderRadius: 24,
    paddingVertical: 18,
    paddingHorizontal: 16,
    marginBottom: 22,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center' as const,
  },
  summaryValue: {
    color: '#0B7A43',
    fontSize: 30,
    fontWeight: '800' as const,
  },
  summaryLabel: {
    color: '#35506B',
    fontSize: 14,
    marginTop: 4,
  },
  summaryDivider: {
    width: 1,
    height: 44,
    backgroundColor: 'rgba(53,80,107,0.2)',
  },
  centerState: {
    flex: 1,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    marginTop: 80,
  },
  cardsWrapper: {
    gap: 16,
  },
  card: {
    backgroundColor: '#0B7A43',
    borderRadius: 22,
    padding: 18,
    shadowColor: '#0B7A43',
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  cardTopRow: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'flex-start' as const,
    gap: 10,
    marginBottom: 16,
  },
  cardTitle: {
    flex: 1,
    color: '#F7F3DF',
    fontSize: 18,
    fontWeight: '600' as const,
    lineHeight: 24,
  },
  statusBadge: {
    borderRadius: 999,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  statusDone: {
    backgroundColor: '#A3E635',
  },
  statusProgress: {
    backgroundColor: '#14532D',
  },
  statusText: {
    color: '#F7F3DF',
    fontSize: 12,
    fontWeight: '700' as const,
  },
  progressRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 10,
  },
  progressTrack: {
    flex: 1,
    height: 10,
    borderRadius: 999,
    backgroundColor: '#14532D',
    overflow: 'hidden' as const,
  },
  progressFill: {
    height: '100%' as const,
    borderRadius: 999,
    backgroundColor: '#A3E635',
  },
  progressLabel: {
    color: '#F7F3DF',
    fontWeight: '700' as const,
    minWidth: 34,
    textAlign: 'right' as const,
  },
  pointsInfo: {
    color: '#DCE8C7',
    fontSize: 14,
    fontWeight: '700' as const,
    marginBottom: 12,
  },
  historyButton: {
    marginTop: 40,
    alignSelf: 'center' as const,
    backgroundColor: '#0B7A43',
    borderRadius: 30,
    paddingVertical: 16,
    paddingHorizontal: 34,
    minWidth: 270,
    alignItems: 'center' as const,
  },
  historyText: {
    color: '#F7F3DF',
    fontSize: 16,
    fontWeight: '600' as const,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    padding: 24,
  },
  modalCard: {
    width: '100%' as const,
    backgroundColor: '#F4EBD6',
    borderRadius: 26,
    padding: 28,
  },
  modalTitle: {
    color: '#0B7A43',
    fontSize: 22,
    fontWeight: '800' as const,
    marginBottom: 18,
  },
  modalItem: {
    color: '#2D6A4F',
    fontSize: 16,
    lineHeight: 28,
    marginBottom: 10,
  },
  modalClose: {
    marginTop: 20,
    alignItems: 'center' as const,
  },
  modalCloseText: {
    color: '#0B7A43',
    fontSize: 18,
    fontWeight: '800' as const,
  },
  feedbackCard: {
    backgroundColor: 'rgba(244,235,214,0.92)',
    borderRadius: 22,
    padding: 18,
  },
  feedbackText: {
    color: '#35506B',
    textAlign: 'center' as const,
    fontSize: 16,
    lineHeight: 24,
  },
};
