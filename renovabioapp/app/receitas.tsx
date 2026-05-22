import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ImageBackground,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { getApiBaseUrl } from '../utils/api';
import {
  formatarDificuldadeReceita,
  formatarReceita,
  getRecipeImage,
  Receita,
} from '../utils/receitas';

export default function Receitas() {
  const apiBaseUrl = useMemo(() => getApiBaseUrl(), []);
  const [receitas, setReceitas] = useState<Receita[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [busca, setBusca] = useState('');

  const carregarReceitas = useCallback(async () => {
    setCarregando(true);
    setErro('');

    try {
      const response = await fetch(`${apiBaseUrl}/receitas`);
      if (!response.ok) {
        setErro('Não foi possível carregar as receitas.');
        return;
      }

      const data = (await response.json()) as Receita[];
      setReceitas(data.map(formatarReceita));
    } catch {
      setErro(`Não foi possível acessar a API em ${apiBaseUrl}.`);
    } finally {
      setCarregando(false);
    }
  }, [apiBaseUrl]);

  useEffect(() => {
    void carregarReceitas();
  }, [carregarReceitas]);

  const receitasFiltradas = receitas.filter((receita) => {
    const termo = busca.trim().toLowerCase();
    if (!termo) {
      return true;
    }

    return (
      receita.titulo?.toLowerCase().includes(termo) ||
      receita.descricao?.toLowerCase().includes(termo) ||
      receita.ingredientes?.toLowerCase().includes(termo)
    );
  });

  return (
    <ImageBackground
      source={require('../assets/images/backgroundoutros.png')}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.headerSide}>
            <Ionicons name="arrow-back" size={28} color="#0B7A43" />
          </TouchableOpacity>

          <Text style={styles.title}>Receitas</Text>

          <View style={styles.headerSide} />
        </View>

        <Text style={styles.subtitle}>
          Aprenda a reaproveitar sobras e resíduos orgânicos do dia a dia, reduzindo o desperdício e contribuindo para o
          meio ambiente.
        </Text>

        <View style={styles.searchBox}>
          <Ionicons name="search-outline" size={18} color="#C8C8B8" />
          <TextInput
            value={busca}
            onChangeText={setBusca}
            placeholder="Digite um ingrediente. Ex: arroz"
            placeholderTextColor="#C8C8B8"
            style={styles.searchInput}
          />
        </View>

        {carregando ? (
          <View style={styles.centerState}>
            <ActivityIndicator color="#0B7A43" size="large" />
          </View>
        ) : null}

        {!carregando && erro ? (
          <View style={styles.feedbackCard}>
            <Text style={styles.feedbackText}>{erro}</Text>
            <TouchableOpacity onPress={() => void carregarReceitas()} style={styles.retryButton}>
              <Text style={styles.retryText}>Tentar novamente</Text>
            </TouchableOpacity>
          </View>
        ) : null}

        {!carregando && !erro && receitasFiltradas.length === 0 ? (
          <View style={styles.feedbackCard}>
            <Text style={styles.feedbackText}>Nenhuma receita encontrada para essa busca.</Text>
          </View>
        ) : null}

        {!carregando && !erro ? (
          <View style={styles.cardsWrapper}>
            {receitasFiltradas.map((receita) => (
              <TouchableOpacity
                key={receita.id}
                activeOpacity={0.92}
                onPress={() => router.push((`/receita-detalhe?id=${receita.id}`) as never)}
                style={styles.card}
              >
                <Image source={getRecipeImage(receita.titulo)} style={styles.cardImage} />

                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle}>{receita.titulo}</Text>

                  <Text style={styles.infoLine}>
                    <Text style={styles.infoLabel}>Tempo de preparo:</Text> {receita.tempoPreparo} minutos
                  </Text>

                  <Text style={styles.infoLine}>
                    <Text style={styles.infoLabel}>Dificuldade:</Text> {formatarDificuldadeReceita(receita.dificuldade)}
                  </Text>

                  <View style={styles.cardFooter}>
                    <Text style={styles.pointsText}>{receita.pontos} pts</Text>

                    <View style={styles.actionButton}>
                      <Text style={styles.actionText}>Ver receita</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
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
    marginBottom: 12,
  },
  headerSide: {
    width: 32,
  },
  title: {
    color: '#0B7A43',
    fontSize: 28,
    fontWeight: '800' as const,
  },
  subtitle: {
    color: '#0B7A43',
    fontSize: 15,
    lineHeight: 21,
    textAlign: 'center' as const,
    marginBottom: 18,
  },
  searchBox: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    backgroundColor: 'rgba(255,248,232,0.95)',
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginBottom: 22,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    color: '#35506B',
    fontSize: 14,
    paddingVertical: 2,
  },
  centerState: {
    marginTop: 90,
    alignItems: 'center' as const,
  },
  cardsWrapper: {
    gap: 14,
  },
  card: {
    flexDirection: 'row' as const,
    backgroundColor: 'rgba(250,245,228,0.96)',
    borderRadius: 22,
    padding: 14,
    gap: 14,
    alignItems: 'center' as const,
  },
  cardImage: {
    width: 88,
    height: 88,
    borderRadius: 18,
    backgroundColor: '#D1D5DB',
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    color: '#0B7A43',
    fontSize: 18,
    fontWeight: '800' as const,
    marginBottom: 8,
  },
  infoLine: {
    color: '#35506B',
    fontSize: 15,
    lineHeight: 21,
  },
  infoLabel: {
    fontWeight: '800' as const,
  },
  cardFooter: {
    marginTop: 10,
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
  },
  pointsText: {
    color: '#2D6A4F',
    fontWeight: '800' as const,
    fontSize: 14,
  },
  actionButton: {
    backgroundColor: '#0B7A43',
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 18,
  },
  actionText: {
    color: '#F7F3DF',
    fontWeight: '700' as const,
    fontSize: 13,
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
