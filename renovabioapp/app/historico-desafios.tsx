import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, ImageBackground, ScrollView, Text, TouchableOpacity, View } from 'react-native';

import { useAuth } from '../context/auth-context';
import { getApiBaseUrl } from '../utils/api';
import { calcularDiasConcluidos, UsuarioDesafio } from '../utils/desafios';

export default function HistoricoDesafios() {
  const { user } = useAuth();
  const apiBaseUrl = useMemo(() => getApiBaseUrl(), []);
  const [participacoes, setParticipacoes] = useState<UsuarioDesafio[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  const carregarHistorico = useCallback(async () => {
    if (!user?.id) {
      setErro('Usuario nao autenticado.');
      setCarregando(false);
      return;
    }

    setCarregando(true);
    setErro('');

    try {
      const response = await fetch(`${apiBaseUrl}/desafios/usuario/${user.id}`);
      if (!response.ok) {
        setErro('Nao foi possivel carregar o historico.');
        return;
      }

      const data = (await response.json()) as UsuarioDesafio[];
      setParticipacoes(data);
    } catch {
      setErro(`Nao foi possivel acessar a API em ${apiBaseUrl}.`);
    } finally {
      setCarregando(false);
    }
  }, [apiBaseUrl, user?.id]);

  useEffect(() => {
    void carregarHistorico();
  }, [carregarHistorico]);

  const concluidos = participacoes.filter((participacao) => participacao.status === 'CONCLUIDO').length;

  return (
    <ImageBackground
      source={require('../assets/images/backgroundoutros.png')}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={28} color="#0B7A43" />
          </TouchableOpacity>

          <Text style={styles.title}>Historico de Desafios</Text>

          <View style={styles.backButton} />
        </View>

        {carregando ? (
          <View style={styles.centerState}>
            <ActivityIndicator color="#0B7A43" size="large" />
          </View>
        ) : null}

        {!carregando && erro ? (
          <View style={styles.messageCard}>
            <Text style={styles.messageText}>{erro}</Text>
          </View>
        ) : null}

        {!carregando && !erro ? (
          <>
            <View style={styles.summaryCard}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryValue}>{participacoes.length}</Text>
                <Text style={styles.summaryLabel}>Desafios iniciados</Text>
              </View>

              <View style={styles.summaryDivider} />

              <View style={styles.summaryItem}>
                <Text style={styles.summaryValue}>{concluidos}</Text>
                <Text style={styles.summaryLabel}>Desafios concluidos</Text>
              </View>
            </View>

            {participacoes.length === 0 ? (
              <View style={styles.messageCard}>
                <Text style={styles.messageText}>Nenhum desafio registrado ainda.</Text>
              </View>
            ) : (
              <View style={styles.listWrapper}>
                {participacoes.map((participacao) => {
                  const dias = calcularDiasConcluidos(participacao);
                  const total = participacao.desafio?.duracaoDias ?? 0;
                  const concluido = participacao.status === 'CONCLUIDO';

                  return (
                    <View key={participacao.id} style={styles.historyCard}>
                      <View style={styles.historyHeader}>
                        <Text style={styles.challengeTitle}>{participacao.desafio?.titulo}</Text>
                        <Text style={[styles.statusBadge, concluido ? styles.statusDone : styles.statusProgress]}>
                          {concluido ? 'Concluido' : 'Em andamento'}
                        </Text>
                      </View>

                      <Text style={styles.historyInfo}>• Progresso registrado: {dias}/{total}</Text>
                    </View>
                  );
                })}
              </View>
            )}
          </>
        ) : null}
      </ScrollView>
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
    marginBottom: 24,
  },
  backButton: {
    width: 32,
    alignItems: 'flex-start' as const,
  },
  title: {
    color: '#0B7A43',
    fontSize: 28,
    fontWeight: '800' as const,
    textAlign: 'center' as const,
  },
  centerState: {
    flex: 1,
    marginTop: 80,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  summaryCard: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
    backgroundColor: 'rgba(244,235,214,0.94)',
    borderRadius: 24,
    paddingVertical: 20,
    paddingHorizontal: 18,
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
    textAlign: 'center' as const,
    marginTop: 4,
  },
  summaryDivider: {
    width: 1,
    height: 44,
    backgroundColor: 'rgba(53,80,107,0.25)',
  },
  listWrapper: {
    gap: 14,
  },
  historyCard: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 22,
    padding: 18,
  },
  historyHeader: {
    marginBottom: 10,
  },
  challengeTitle: {
    color: '#0B7A43',
    fontSize: 19,
    fontWeight: '800' as const,
    marginBottom: 10,
  },
  statusBadge: {
    alignSelf: 'flex-start' as const,
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 12,
    overflow: 'hidden' as const,
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700' as const,
  },
  statusDone: {
    backgroundColor: '#1F7A3D',
  },
  statusProgress: {
    backgroundColor: '#D97706',
  },
  historyInfo: {
    color: '#35506B',
    fontSize: 15,
    lineHeight: 24,
  },
  messageCard: {
    backgroundColor: 'rgba(244,235,214,0.94)',
    borderRadius: 22,
    padding: 18,
  },
  messageText: {
    color: '#35506B',
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center' as const,
  },
};
