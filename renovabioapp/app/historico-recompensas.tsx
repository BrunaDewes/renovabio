import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, ImageBackground, ScrollView, Text, TouchableOpacity, View } from 'react-native';

import { useAuth } from '../context/auth-context';
import { getApiBaseUrl, getAuthHeaders } from '../utils/api';

type TrocaRecompensaHistorico = {
  id: number;
  recompensaDescricao?: string;
  parceiroNome?: string;
  pontosUtilizados?: number;
  codigoVoucher?: string;
  status?: string;
  dataTroca?: string;
};

export default function HistoricoRecompensas() {
  const { user } = useAuth();
  const apiBaseUrl = useMemo(() => getApiBaseUrl(), []);
  const [trocas, setTrocas] = useState<TrocaRecompensaHistorico[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  const carregarHistorico = useCallback(async () => {
    if (!user?.id) {
      setErro('Usuario não autenticado.');
      setCarregando(false);
      return;
    }

    setCarregando(true);
    setErro('');

    try {
      const response = await fetch(`${apiBaseUrl}/recompensas/usuario/${user.id}/trocas`, {
        headers: getAuthHeaders(user.token),
      });
      if (!response.ok) {
        setErro('Não foi possível carregar o histórico de vouchers.');
        return;
      }

      const data = (await response.json()) as TrocaRecompensaHistorico[];
      setTrocas(data);
    } catch {
      setErro(`Não foi possível acessar a API em ${apiBaseUrl}.`);
    } finally {
      setCarregando(false);
    }
  }, [apiBaseUrl, user?.id, user?.token]);

  useEffect(() => {
    void carregarHistorico();
  }, [carregarHistorico]);

  const pontosUsados = trocas.reduce((total, troca) => total + (troca.pontosUtilizados ?? 0), 0);

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

          <Text style={styles.title}>Histórico de Vouchers</Text>

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
            <TouchableOpacity onPress={() => void carregarHistorico()} style={styles.retryButton}>
              <Text style={styles.retryText}>Tentar novamente</Text>
            </TouchableOpacity>
          </View>
        ) : null}

        {!carregando && !erro ? (
          <>
            <View style={styles.summaryCard}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryValue}>{trocas.length}</Text>
                <Text style={styles.summaryLabel}>Vouchers gerados</Text>
              </View>

              <View style={styles.summaryDivider} />

              <View style={styles.summaryItem}>
                <Text style={styles.summaryValue}>{pontosUsados}</Text>
                <Text style={styles.summaryLabel}>Pontos trocados</Text>
              </View>
            </View>

            {trocas.length === 0 ? (
              <View style={styles.messageCard}>
                <Text style={styles.messageText}>Você ainda não resgatou nenhuma recompensa.</Text>
              </View>
            ) : (
              <View style={styles.listWrapper}>
                {trocas.map((troca) => (
                  <View key={troca.id} style={styles.voucherCard}>
                    <View style={styles.voucherHeader}>
                      <Text style={styles.rewardTitle}>{troca.recompensaDescricao || 'Recompensa'}</Text>
                      <Text style={styles.statusBadge}>{formatarStatus(troca.status)}</Text>
                    </View>

                    <Text style={styles.partnerText}>{troca.parceiroNome || 'Parceiro não informado'}</Text>

                    <View style={styles.voucherBox}>
                      <Text style={styles.voucherLabel}>Codigo do voucher</Text>
                      <Text style={styles.voucherCode}>{troca.codigoVoucher || 'Código não informado'}</Text>
                    </View>

                    <View style={styles.infoRow}>
                      <Text style={styles.infoText}>{troca.pontosUtilizados ?? 0} pontos utilizados</Text>
                      <Text style={styles.infoText}>{formatarData(troca.dataTroca)}</Text>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </>
        ) : null}
      </ScrollView>
    </ImageBackground>
  );
}

function formatarStatus(status?: string) {
  if (status === 'RESGATADO') {
    return 'Resgatado';
  }

  if (status === 'CANCELADO') {
    return 'Cancelado';
  }

  return 'Gerado';
}

function formatarData(data?: string) {
  if (!data) {
    return 'Data não informada';
  }

  const date = new Date(data);
  if (Number.isNaN(date.getTime())) {
    return 'Data não informada';
  }

  return date.toLocaleDateString('pt-BR');
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
    flex: 1,
    color: '#0B7A43',
    fontSize: 25,
    fontWeight: '800' as const,
    textAlign: 'center' as const,
  },
  centerState: {
    marginTop: 80,
    alignItems: 'center' as const,
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
  voucherCard: {
    backgroundColor: 'rgba(250,245,228,0.96)',
    borderRadius: 24,
    padding: 18,
  },
  voucherHeader: {
    gap: 10,
    marginBottom: 8,
  },
  rewardTitle: {
    color: '#0B7A43',
    fontSize: 20,
    fontWeight: '800' as const,
    lineHeight: 26,
  },
  statusBadge: {
    alignSelf: 'flex-start' as const,
    backgroundColor: '#DCE8C7',
    borderRadius: 999,
    color: '#14532D',
    fontSize: 13,
    fontWeight: '800' as const,
    overflow: 'hidden' as const,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  partnerText: {
    color: '#35506B',
    fontSize: 15,
    marginBottom: 14,
  },
  voucherBox: {
    backgroundColor: '#0B7A43',
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
  },
  voucherLabel: {
    color: '#DCE8C7',
    fontSize: 13,
    fontWeight: '700' as const,
    marginBottom: 4,
  },
  voucherCode: {
    color: '#F7F3DF',
    fontSize: 26,
    fontWeight: '800' as const,
    letterSpacing: 2,
  },
  infoRow: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    gap: 12,
  },
  infoText: {
    flex: 1,
    color: '#35506B',
    fontSize: 14,
    fontWeight: '700' as const,
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
