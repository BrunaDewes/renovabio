import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { router, useLocalSearchParams } from 'expo-router';
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
import { createImageFormData, getApiBaseUrl, getAuthHeaders, toApiFileUrl } from '../utils/api';
import { calcularDiasConcluidos, Desafio, UsuarioDesafio } from '../utils/desafios';

type ComprovacaoDesafio = {
  id: number;
  imagemUrl?: string | null;
  dataEnvio?: string;
};

export default function DesafioDetalhe() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { updateUser, user } = useAuth();
  const apiBaseUrl = useMemo(() => getApiBaseUrl(), []);
  const [desafio, setDesafio] = useState<Desafio | null>(null);
  const [participacao, setParticipacao] = useState<UsuarioDesafio | null>(null);
  const [comprovacoes, setComprovacoes] = useState<ComprovacaoDesafio[]>([]);
  const [arquivoSelecionado, setArquivoSelecionado] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [processando, setProcessando] = useState(false);
  const [erro, setErro] = useState('');

  const carregarComprovacoes = useCallback(async (usuarioDesafioId: number) => {
    const response = await fetch(`${apiBaseUrl}/desafios/comprovacoes/${usuarioDesafioId}`, {
      headers: getAuthHeaders(user?.token),
    });
    if (!response.ok) {
      return [];
    }

    return (await response.json()) as ComprovacaoDesafio[];
  }, [apiBaseUrl, user?.token]);

  const carregarDetalhes = useCallback(async () => {
    if (!user?.id || !id) {
      setErro('Desafio não encontrado.');
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
        setErro('Não foi possível carregar o desafio.');
        return;
      }

      const desafiosData = (await desafiosResponse.json()) as Desafio[];
      const participacoesData = (await participacoesResponse.json()) as UsuarioDesafio[];
      const desafioAtual = desafiosData.find((item) => String(item.id) === String(id)) ?? null;
      const participacaoAtual =
        participacoesData.find((item) => String(item.desafio?.id) === String(id)) ?? null;

      setDesafio(desafioAtual);
      setParticipacao(participacaoAtual);

      if (participacaoAtual?.id) {
        const lista = await carregarComprovacoes(participacaoAtual.id);
        setComprovacoes(lista);
      } else {
        setComprovacoes([]);
      }
    } catch {
      setErro(`Não foi possível acessar a API em ${apiBaseUrl}.`);
    } finally {
      setCarregando(false);
    }
  }, [apiBaseUrl, carregarComprovacoes, id, user?.id, user?.token]);

  useEffect(() => {
    void carregarDetalhes();
  }, [carregarDetalhes]);

  async function participar(desafioId: number): Promise<UsuarioDesafio | null> {
    if (!user?.id) {
      return null;
    }

    const response = await fetch(`${apiBaseUrl}/desafios/${desafioId}/participar?usuarioId=${user.id}`, {
      method: 'POST',
      headers: getAuthHeaders(user.token),
    });

    if (!response.ok) {
      const bodyText = await response.text();
      const data = bodyText ? (JSON.parse(bodyText) as { message?: string }) : null;
      Alert.alert('Desafios', data?.message || 'Não foi possível participar do desafio.');
      return null;
    }

    const novaParticipacao = (await response.json()) as UsuarioDesafio;
    setParticipacao(novaParticipacao);
    setComprovacoes([]);
    Alert.alert('Desafios', 'Você entrou no desafio com sucesso.');
    return novaParticipacao;
  }

  async function escolherArquivo() {
    if (jaRegistrouHoje) {
      Alert.alert('Desafios', 'Voce ja registrou um comprovante hoje. Volte amanha para enviar outro.');
      return;
    }

    const permissao = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissao.granted) {
      Alert.alert('Desafios', 'Permita acesso a galeria para selecionar a foto de comprovação.');
      return;
    }

    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 4],
      quality: 0.8,
    });

    if (resultado.canceled || !resultado.assets[0]?.uri) {
      return;
    }

    setArquivoSelecionado(resultado.assets[0].uri);
  }

  async function registrarComprovante() {
    if (!desafio || !user) {
      return;
    }

    setProcessando(true);
    try {
      let participacaoAtual: UsuarioDesafio | null = participacao ?? null;

      if (!participacaoAtual) {
        participacaoAtual = await participar(desafio.id);
        if (!participacaoAtual) {
          return;
        }
      }

      if (participacaoAtual.status === 'CONCLUIDO') {
        Alert.alert('Desafios', 'Esse desafio já foi concluído.');
        return;
      }

      if (jaRegistrouHoje) {
        Alert.alert('Desafios', 'Voce ja registrou um comprovante hoje. Volte amanha para enviar outro.');
        return;
      }

      if (!arquivoSelecionado) {
        Alert.alert('Desafios', 'Escolha uma foto antes de registrar o comprovante.');
        return;
      }

      const duracao = Math.max(1, participacaoAtual.desafio?.duracaoDias ?? 1);
      const diasAtuais = calcularDiasConcluidos(participacaoAtual);
      const proximoDia = Math.min(duracao, diasAtuais + 1);
      const proximoProgresso = Math.round((proximoDia / duracao) * 100);

      const uploadResponse = await fetch(`${apiBaseUrl}/desafios/comprovacoes?usuarioDesafioId=${participacaoAtual.id}`, {
        method: 'POST',
        headers: getAuthHeaders(user.token),
        body: createImageFormData(arquivoSelecionado),
      });

      if (!uploadResponse.ok) {
        const bodyText = await uploadResponse.text();
        const data = bodyText ? (JSON.parse(bodyText) as { message?: string }) : null;
        if (data?.message) {
          Alert.alert('Desafios', data.message);
          return;
        }
        Alert.alert('Desafios', 'Não foi possível enviar a foto para o servidor.');
        return;
      }

      const progressoResponse = await fetch(
        `${apiBaseUrl}/desafios/progresso?usuarioDesafioId=${participacaoAtual.id}&progresso=${proximoProgresso}`,
        {
          method: 'PUT',
          headers: getAuthHeaders(user.token),
        },
      );

      if (!progressoResponse.ok) {
        Alert.alert('Desafios', 'Não foi possível atualizar o progresso do desafio.');
        return;
      }

      let participacaoAtualizada = (await progressoResponse.json()) as UsuarioDesafio;

      if (proximoProgresso >= 100 && participacaoAtual.status !== 'CONCLUIDO') {
        const concluirResponse = await fetch(
          `${apiBaseUrl}/desafios/concluir?usuarioDesafioId=${participacaoAtual.id}`,
          {
            method: 'PUT',
            headers: getAuthHeaders(user.token),
          },
        );

        if (concluirResponse.ok) {
          participacaoAtualizada = (await concluirResponse.json()) as UsuarioDesafio;
          await updateUser({ pontuacao: (user?.pontuacao ?? 0) + (participacaoAtual.desafio?.pontos ?? 0) });
        }
      }

      setParticipacao(participacaoAtualizada);
      const lista = await carregarComprovacoes(participacaoAtual.id);
      setComprovacoes(lista);
      setArquivoSelecionado(null);

      Alert.alert(
        'Desafios',
        participacaoAtualizada.status === 'CONCLUIDO'
          ? 'Comprovante registrado e desafio concluído.'
          : 'Comprovante do dia registrado com sucesso.',
      );
    } catch {
      Alert.alert('Desafios', `Não foi possível acessar a API em ${apiBaseUrl}.`);
    } finally {
      setProcessando(false);
    }
  }

  const diasConcluidos = desafio && participacao ? calcularDiasConcluidos(participacao) : 0;
  const jaRegistrouHoje = comprovacoes.some((item) => isDataDeHoje(item.dataEnvio));
  const bloqueadoParaComprovante = processando || participacao?.status === 'CONCLUIDO' || jaRegistrouHoje;
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

        {!carregando && !erro && desafio ? (
          <>
            <Text style={styles.title}>{desafio.titulo}</Text>

            <View style={styles.summaryCard}>
              <ResumoItem titulo="Duração esperada" valor={`${desafio.duracaoDias} dias`} />
              <ResumoItem titulo="Comprovações registradas" valor={`${diasConcluidos}/${desafio.duracaoDias}`} />
              <ResumoItem titulo="Pontuação do desafio" valor={`${desafio.pontos} pontos`} destaque="#0B7A43" />
              <ResumoItem
                titulo="Status"
                valor={
                  participacao?.status === 'CONCLUIDO'
                    ? 'Concluído'
                    : participacao
                      ? 'Em andamento'
                      : 'Não iniciado'
                }
                destaque={
                  participacao?.status === 'CONCLUIDO'
                    ? '#0B7A43'
                    : participacao
                      ? '#D97706'
                      : '#35506B'
                }
              />
            </View>

            <View style={styles.block}>
              <Text style={styles.sectionTitle}>Descrição</Text>
              <Text style={styles.description}>{desafio.descricao}</Text>
            </View>

            <View style={styles.block}>
              <Text style={styles.sectionTitle}>Comprovação do dia</Text>
              <Text style={styles.supportText}>
                Escolha uma imagem da galeria para registrar o que você fez hoje no desafio.
              </Text>

              {jaRegistrouHoje ? (
                <Text style={styles.warningText}>Voce ja registrou o comprovante de hoje. Volte amanha para enviar outro.</Text>
              ) : null}

              <TouchableOpacity
                onPress={() => void escolherArquivo()}
                style={[styles.fileButton, jaRegistrouHoje ? styles.disabledButton : null]}
                disabled={jaRegistrouHoje}
              >
                <Ionicons name="image-outline" size={18} color="#F7F3DF" />
                <Text style={styles.fileButtonText}>
                  {arquivoSelecionado ? 'Arquivo selecionado' : 'Escolher arquivo'}
                </Text>
              </TouchableOpacity>

              {!participacao ? (
                <TouchableOpacity onPress={() => void participar(desafio.id)} style={styles.secondaryButton} disabled={processando}>
                  <Text style={styles.secondaryButtonText}>Participar do desafio</Text>
                </TouchableOpacity>
              ) : null}

              <TouchableOpacity
                onPress={() => void registrarComprovante()}
                style={[
                  styles.primaryButton,
                  bloqueadoParaComprovante ? styles.disabledButton : null,
                ]}
                disabled={bloqueadoParaComprovante}
              >
                {processando ? (
                  <ActivityIndicator color="#F7F3DF" />
                ) : (
                  <Text style={styles.primaryButtonText}>Registrar comprovante de hoje</Text>
                )}
              </TouchableOpacity>
            </View>

            <View style={styles.block}>
              <Text style={styles.sectionTitle}>Registros enviados</Text>

              {comprovacoes.length === 0 ? (
                <Text style={styles.historyEmpty}>Nenhum registro enviado ainda.</Text>
              ) : (
                comprovacoes.map((item, index) => (
                  <View key={`${item.id}-${index}`} style={styles.historyRow}>
                    <View style={styles.historyDot} />
                    <Text style={styles.historyItem}>
                      {formatarDataComprovacao(item.dataEnvio)} {toApiFileUrl(item.imagemUrl) ? '- foto enviada' : ''}
                    </Text>
                  </View>
                ))
              )}
            </View>
          </>
        ) : null}
      </ScrollView>
    </ImageBackground>
  );
}

function formatarDataComprovacao(data?: string) {
  if (!data) {
    return 'Data não informada';
  }

  const date = new Date(data);
  if (Number.isNaN(date.getTime())) {
    return 'Data não informada';
  }

  return date.toLocaleDateString('pt-BR');
}

function isDataDeHoje(data?: string) {
  if (!data) {
    return false;
  }

  const date = new Date(data);
  const hoje = new Date();
  return (
    date.getFullYear() === hoje.getFullYear()
    && date.getMonth() === hoje.getMonth()
    && date.getDate() === hoje.getDate()
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
    flex: 1,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    marginTop: 100,
  },
  title: {
    color: '#0B7A43',
    fontSize: 28,
    fontWeight: '800' as const,
    textAlign: 'center' as const,
    marginBottom: 22,
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
    backgroundColor: 'rgba(255,255,255,0.9)',
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
  description: {
    color: '#35506B',
    fontSize: 16,
    lineHeight: 25,
  },
  supportText: {
    color: '#4B5563',
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 14,
  },
  warningText: {
    color: '#D97706',
    fontSize: 14,
    fontWeight: '700' as const,
    lineHeight: 22,
    marginBottom: 14,
  },
  fileButton: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    alignSelf: 'flex-start' as const,
    gap: 8,
    backgroundColor: '#E07228',
    borderRadius: 20,
    paddingVertical: 11,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  fileButtonText: {
    color: '#F7F3DF',
    fontWeight: '700' as const,
  },
  primaryButton: {
    backgroundColor: '#0B7A43',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center' as const,
    marginTop: 8,
  },
  disabledButton: {
    opacity: 0.55,
  },
  primaryButtonText: {
    color: '#F7F3DF',
    fontWeight: '700' as const,
    fontSize: 16,
  },
  secondaryButton: {
    backgroundColor: '#DCE8C7',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center' as const,
  },
  secondaryButtonText: {
    color: '#0B7A43',
    fontWeight: '700' as const,
    fontSize: 16,
  },
  historyEmpty: {
    color: '#6B7280',
    fontSize: 15,
    lineHeight: 24,
  },
  historyRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    marginBottom: 10,
  },
  historyDot: {
    width: 8,
    height: 8,
    borderRadius: 999,
    backgroundColor: '#35506B',
    marginRight: 10,
  },
  historyItem: {
    color: '#35506B',
    fontSize: 16,
  },
  messageCard: {
    backgroundColor: 'rgba(244,235,214,0.94)',
    borderRadius: 22,
    padding: 18,
  },
  messageText: {
    color: '#7F1D1D',
    textAlign: 'center' as const,
    fontSize: 16,
    lineHeight: 24,
  },
};
