import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  ImageBackground,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { useAuth } from '../context/auth-context';
import { getApiBaseUrl, getAuthHeaders } from '../utils/api';
import {
  formatarDificuldadeReceita,
  formatarListaTexto,
  formatarModoPreparoEmPassos,
  formatarReceita,
  getRecipeImage,
  Receita,
} from '../utils/receitas';

export default function ReceitaDetalhe() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { updateUser, user } = useAuth();
  const apiBaseUrl = useMemo(() => getApiBaseUrl(), []);
  const [receita, setReceita] = useState<Receita | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [testando, setTestando] = useState(false);
  const [erro, setErro] = useState('');

  const carregarReceita = useCallback(async () => {
    if (!id) {
      setErro('Receita não encontrada.');
      setCarregando(false);
      return;
    }

    setCarregando(true);
    setErro('');

    try {
      const response = await fetch(`${apiBaseUrl}/receitas/${id}`);
      if (!response.ok) {
        setErro('Não foi possível carregar a receita.');
        return;
      }

      const data = (await response.json()) as Receita;
      setReceita(formatarReceita(data));
    } catch {
      setErro(`Não foi possível acessar a API em ${apiBaseUrl}.`);
    } finally {
      setCarregando(false);
    }
  }, [apiBaseUrl, id]);

  useEffect(() => {
    void carregarReceita();
  }, [carregarReceita]);

  async function testarReceita() {
    if (!receita || !user?.id) {
      return;
    }

    setTestando(true);
    try {
      const response = await fetch(`${apiBaseUrl}/receitas/${receita.id}/testar?usuarioId=${user.id}`, {
        method: 'POST',
        headers: getAuthHeaders(user.token),
      });

      if (!response.ok) {
        Alert.alert('Receitas', 'Não foi possível registrar essa receita.');
        return;
      }

      await updateUser({ pontuacao: (user?.pontuacao ?? 0) + (receita.pontos ?? 0) });
      Alert.alert('Receitas', 'Receita testada com sucesso. Seus pontos foram atualizados.');
    } catch {
      Alert.alert('Receitas', `Não foi possível acessar a API em ${apiBaseUrl}.`);
    } finally {
      setTestando(false);
    }
  }

  const ingredientes = receita ? formatarListaTexto(receita.ingredientes) : [];
  const passosPreparo = receita ? formatarModoPreparoEmPassos(receita.modoPreparo) : [];

  return (
    <ImageBackground
      source={require('../assets/images/backgroundoutros.png')}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={28} color="#0B7A43" />
        </TouchableOpacity>

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

        {!carregando && !erro && receita ? (
          <>
            <Image source={getRecipeImage(receita.titulo)} style={styles.heroImage} />

            <Text style={styles.title}>{receita.titulo}</Text>

            <View style={styles.summaryCard}>
              <ResumoItem titulo="Tempo de preparo" valor={`${receita.tempoPreparo} min`} />
              <ResumoItem titulo="Dificuldade" valor={formatarDificuldadeReceita(receita.dificuldade)} />
              <ResumoItem titulo="Pontuação" valor={`${receita.pontos} pontos`} destaque="#0B7A43" />
            </View>

            <View style={styles.block}>
              <Text style={styles.sectionTitle}>Descrição</Text>
              <Text style={styles.text}>{receita.descricao}</Text>
            </View>

            <View style={styles.block}>
              <Text style={styles.sectionTitle}>Ingredientes</Text>
              {ingredientes.length === 0 ? (
                <Text style={styles.text}>{receita.ingredientes}</Text>
              ) : (
                ingredientes.map((item, index) => (
                  <View key={`${item}-${index}`} style={styles.rowItem}>
                    <View style={styles.dot} />
                    <Text style={styles.listText}>{item}</Text>
                  </View>
                ))
              )}
            </View>

            <View style={styles.block}>
              <Text style={styles.sectionTitle}>Modo de preparo</Text>
              {passosPreparo.length === 0 ? (
                <Text style={styles.text}>{receita.modoPreparo}</Text>
              ) : (
                passosPreparo.map((passo, index) => (
                  <View key={`${passo}-${index}`} style={styles.stepRow}>
                    <View style={styles.stepBadge}>
                      <Text style={styles.stepBadgeText}>{index + 1}</Text>
                    </View>
                    <Text style={styles.stepText}>{passo}</Text>
                  </View>
                ))
              )}
            </View>

            <TouchableOpacity onPress={() => void testarReceita()} style={styles.primaryButton} disabled={testando}>
              {testando ? (
                <ActivityIndicator color="#F7F3DF" />
              ) : (
                <Text style={styles.primaryButtonText}>Testar receita</Text>
              )}
            </TouchableOpacity>
          </>
        ) : null}
      </ScrollView>
    </ImageBackground>
  );
}

function ResumoItem({
  titulo,
  valor,
  destaque,
}: {
  titulo: string;
  valor: string;
  destaque?: string;
}) {
  return (
    <View style={styles.summaryItem}>
      <Text style={styles.summaryLabel}>{titulo}</Text>
      <Text style={[styles.summaryValue, destaque ? { color: destaque } : null]}>{valor}</Text>
    </View>
  );
}

const styles = {
  container: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 52,
    paddingBottom: 36,
  },
  backButton: {
    alignSelf: 'flex-start' as const,
    marginBottom: 26,
  },
  centerState: {
    marginTop: 100,
    alignItems: 'center' as const,
  },
  title: {
    color: '#0B7A43',
    fontSize: 28,
    fontWeight: '800' as const,
    textAlign: 'center' as const,
    marginBottom: 22,
  },
  heroImage: {
    width: '100%' as const,
    height: 220,
    borderRadius: 28,
    marginBottom: 20,
    backgroundColor: '#D1D5DB',
  },
  summaryCard: {
    backgroundColor: 'rgba(244,235,214,0.95)',
    borderRadius: 24,
    padding: 18,
    gap: 14,
  },
  summaryItem: {
    gap: 4,
  },
  summaryLabel: {
    color: '#35506B',
    fontSize: 14,
    fontWeight: '700' as const,
  },
  summaryValue: {
    color: '#35506B',
    fontSize: 22,
    fontWeight: '800' as const,
  },
  block: {
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 22,
    padding: 18,
    marginTop: 18,
  },
  sectionTitle: {
    color: '#35506B',
    fontSize: 18,
    fontWeight: '800' as const,
    marginBottom: 10,
  },
  text: {
    color: '#35506B',
    fontSize: 16,
    lineHeight: 25,
  },
  rowItem: {
    flexDirection: 'row' as const,
    alignItems: 'flex-start' as const,
    marginBottom: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 999,
    backgroundColor: '#35506B',
    marginTop: 8,
    marginRight: 10,
  },
  listText: {
    flex: 1,
    color: '#35506B',
    fontSize: 16,
    lineHeight: 24,
  },
  stepRow: {
    flexDirection: 'row' as const,
    alignItems: 'flex-start' as const,
    gap: 12,
    marginBottom: 14,
  },
  stepBadge: {
    width: 28,
    height: 28,
    borderRadius: 999,
    backgroundColor: '#0B7A43',
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    marginTop: 2,
  },
  stepBadgeText: {
    color: '#F7F3DF',
    fontWeight: '800' as const,
    fontSize: 14,
  },
  stepText: {
    flex: 1,
    color: '#35506B',
    fontSize: 16,
    lineHeight: 25,
  },
  primaryButton: {
    backgroundColor: '#0B7A43',
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: 'center' as const,
    marginTop: 22,
  },
  primaryButtonText: {
    color: '#F7F3DF',
    fontWeight: '700' as const,
    fontSize: 16,
  },
  messageCard: {
    backgroundColor: 'rgba(244,235,214,0.94)',
    borderRadius: 22,
    padding: 18,
  },
  messageText: {
    color: '#35506B',
    textAlign: 'center' as const,
    fontSize: 16,
    lineHeight: 24,
  },
};
