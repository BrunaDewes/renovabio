import { router } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ImageBackground,
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';

import { PasswordInput } from '../components/password-input';
import { getApiBaseUrl } from '../utils/api';

type Cidade = {
  id: number;
  nome: string;
  estado: string;
};

type CadastroResponse = {
  id: number;
  nome: string;
  email: string;
  pontuacao: number;
};

export default function Cadastro() {
  const apiBaseUrl = useMemo(() => getApiBaseUrl(), []);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [cidades, setCidades] = useState<Cidade[]>([]);
  const [cidadeSelecionada, setCidadeSelecionada] = useState<Cidade | null>(null);
  const [carregandoCidades, setCarregandoCidades] = useState(true);
  const [carregandoCadastro, setCarregandoCadastro] = useState(false);
  const [erro, setErro] = useState('');
  const [modalAberto, setModalAberto] = useState(false);

  const carregarCidades = useCallback(async () => {
    setCarregandoCidades(true);
    setErro('');

    try {
      const response = await fetch(`${apiBaseUrl}/cidades`);
      const bodyText = await response.text();
      const data = bodyText ? (JSON.parse(bodyText) as Cidade[] | { message?: string }) : [];

      if (!response.ok) {
        const mensagem = !Array.isArray(data) && data.message ? data.message : 'Nao foi possivel carregar as cidades.';
        setErro(mensagem);
        setCidades([]);
        setCidadeSelecionada(null);
        return;
      }

      const lista = Array.isArray(data) ? data : [];
      setCidades(lista);

      if (lista.length === 0) {
        setErro('Nenhuma cidade foi encontrada na API.');
        setCidadeSelecionada(null);
        return;
      }

      setCidadeSelecionada((atual) => atual ?? lista[0]);
    } catch {
      setErro(`Nao foi possivel acessar a API em ${apiBaseUrl}.`);
      setCidades([]);
      setCidadeSelecionada(null);
    } finally {
      setCarregandoCidades(false);
    }
  }, [apiBaseUrl]);

  useEffect(() => {
    void carregarCidades();
  }, [carregarCidades]);

  async function cadastrar() {
    if (!nome.trim() || !email.trim() || !senha.trim()) {
      setErro('Preencha nome, email e senha.');
      return;
    }

    if (!cidadeSelecionada) {
      setErro('Selecione uma cidade.');
      return;
    }

    setCarregandoCadastro(true);
    setErro('');

    try {
      const response = await fetch(`${apiBaseUrl}/usuarios`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nome: nome.trim(),
          email: email.trim(),
          senha,
          cidadeId: cidadeSelecionada.id,
        }),
      });

      const bodyText = await response.text();
      const data = bodyText ? (JSON.parse(bodyText) as CadastroResponse | { message?: string }) : null;

      if (!response.ok) {
        const mensagem = data && 'message' in data && data.message ? data.message : 'Nao foi possivel concluir o cadastro.';
        setErro(mensagem);
        return;
      }

      Alert.alert('Cadastro concluido', 'Sua conta foi criada. Agora faca login.');
      router.replace((`/login?email=${encodeURIComponent(email.trim())}`) as never);
    } catch {
      Alert.alert('Conexao', `Nao foi possivel acessar a API em ${apiBaseUrl}.`);
    } finally {
      setCarregandoCadastro(false);
    }
  }

  return (
    <ImageBackground
      source={require('../assets/images/backgroundcadastro.png')}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <SafeAreaView style={{ flex: 1, justifyContent: 'flex-end', paddingBottom: 70, padding: 24 }}>
        <View style={{ width: '100%', alignItems: 'center', gap: 14 }}>
          <Text style={{ fontSize: 44, fontWeight: '800', color: '#f8f4d9' }}>Criar conta</Text>

          <TextInput
            placeholder="Nome"
            placeholderTextColor="#f8f4d9"
            value={nome}
            onChangeText={setNome}
            style={inputStyle}
          />

          <TextInput
            placeholder="Email"
            placeholderTextColor="#f8f4d9"
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            style={inputStyle}
          />

          <PasswordInput
            placeholder="Senha"
            placeholderTextColor="#f8f4d9"
            value={senha}
            onChangeText={setSenha}
            borderColor="#94c61f"
            textColor="#f8f4d9"
            iconColor="#f8f4d9"
          />

          <Pressable
            onPress={() => setModalAberto(true)}
            style={[inputStyle, { justifyContent: 'center' }]}
            disabled={carregandoCidades}
          >
            <Text style={{ color: '#f8f4d9' }}>
              {carregandoCidades
                ? 'Carregando cidades...'
                : cidadeSelecionada
                  ? `${cidadeSelecionada.nome} - ${cidadeSelecionada.estado}`
                  : 'Selecione uma cidade'}
            </Text>
          </Pressable>

          {erro ? <Text style={{ color: '#FCA5A5', fontWeight: '600', textAlign: 'center' }}>{erro}</Text> : null}

          {!carregandoCidades && cidades.length === 0 ? (
            <Pressable onPress={() => void carregarCidades()} style={botaoSecundario}>
              <Text style={{ color: '#1B4332', fontWeight: '600' }}>Tentar carregar cidades novamente</Text>
            </Pressable>
          ) : null}

          <Pressable onPress={cadastrar} style={botaoPrimario} disabled={carregandoCadastro || carregandoCidades}>
            {carregandoCadastro ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={{ color: '#f8f4d9', fontWeight: '700' }}>Cadastrar</Text>
            )}
          </Pressable>

          <Pressable onPress={() => router.replace('/login')} style={botaoSecundario}>
            <Text style={{ color: '#1B4332', fontWeight: '600' }}>Voltar para o login</Text>
          </Pressable>
        </View>
      </SafeAreaView>

      <Modal transparent animationType="slide" visible={modalAberto} onRequestClose={() => setModalAberto(false)}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.6)',
            justifyContent: 'flex-end',
          }}
        >
          <View
            style={{
              maxHeight: '60%',
              backgroundColor: '#f8f4d9',
              borderTopLeftRadius: 28,
              borderTopRightRadius: 28,
              padding: 20,
              gap: 12,
            }}
          >
            <Text style={{ fontSize: 20, fontWeight: '700', color: '#1B4332' }}>Selecione sua cidade</Text>

            <ScrollView>
              {cidades.map((cidade) => (
                <Pressable
                  key={cidade.id}
                  onPress={() => {
                    setCidadeSelecionada(cidade);
                    setModalAberto(false);
                  }}
                  style={{
                    paddingVertical: 14,
                    borderBottomWidth: 1,
                    borderBottomColor: '#D1D5DB',
                  }}
                >
                  <Text style={{ color: '#1B4332', fontWeight: '600' }}>
                    {cidade.nome} - {cidade.estado}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>

            <Pressable onPress={() => setModalAberto(false)} style={botaoCancelarModal}>
              <Text style={{ color: '#f8f4d9', fontWeight: '700' }}>Fechar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </ImageBackground>
  );
}

const inputStyle = {
  width: '100%' as const,
  borderWidth: 1.5,
  borderColor: '#94c61f',
  borderRadius: 20,
  paddingVertical: 14,
  paddingHorizontal: 16,
  color: '#f8f4d9',
};

const botaoPrimario = {
  width: '100%' as const,
  backgroundColor: '#94c61f',
  borderRadius: 20,
  paddingVertical: 16,
  alignItems: 'center' as const,
  marginTop: 8,
};

const botaoSecundario = {
  width: '100%' as const,
  backgroundColor: '#f8f4d9',
  borderRadius: 20,
  paddingVertical: 14,
  alignItems: 'center' as const,
};

const botaoCancelarModal = {
  backgroundColor: '#1B4332',
  borderRadius: 18,
  paddingVertical: 14,
  alignItems: 'center' as const,
};
