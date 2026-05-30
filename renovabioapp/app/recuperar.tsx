import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ImageBackground,
  Pressable,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { PasswordInput } from '../components/password-input';
import { getApiBaseUrl } from '../utils/api';

export default function Recuperar() {
  const apiBaseUrl = useMemo(() => getApiBaseUrl(), []);
  const [email, setEmail] = useState('');
  const [codigo, setCodigo] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmacaoSenha, setConfirmacaoSenha] = useState('');
  const [codigoEnviado, setCodigoEnviado] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');

  async function enviarCodigo() {
    if (!email.trim()) {
      setErro('Informe seu email.');
      return;
    }

    setCarregando(true);
    setErro('');

    try {
      const response = await fetchComTimeout(`${apiBaseUrl}/usuarios/recuperar-senha/codigo`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
        }),
      });

      if (!response.ok) {
        setErro(await extrairMensagemErro(response, 'Não foi possível enviar o código.'));
        return;
      }

      setCodigoEnviado(true);
      Alert.alert('Código enviado', 'Se o email estiver cadastrado, enviaremos um código de recuperação.');
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        setErro('O envio demorou demais. Verifique a configuracao de email da API e tente novamente.');
        return;
      }
      Alert.alert('Conexão', `Não foi possível acessar a API em ${apiBaseUrl}.`);
    } finally {
      setCarregando(false);
    }
  }

  async function confirmarNovaSenha() {
    if (!email.trim() || !codigo.trim() || !novaSenha.trim() || !confirmacaoSenha.trim()) {
      setErro('Preencha todos os campos.');
      return;
    }

    if (novaSenha !== confirmacaoSenha) {
      setErro('As senhas não coincidem.');
      return;
    }

    if (novaSenha.trim().length < 4) {
      setErro('A nova senha precisa ter pelo menos 4 caracteres.');
      return;
    }

    setCarregando(true);
    setErro('');

    try {
      const response = await fetchComTimeout(`${apiBaseUrl}/usuarios/recuperar-senha/confirmar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          codigo: codigo.trim(),
          novaSenha: novaSenha.trim(),
        }),
      });

      if (!response.ok) {
        setErro(await extrairMensagemErro(response, 'Não foi possível atualizar a senha.'));
        return;
      }

      Alert.alert('Senha atualizada', 'Sua senha foi alterada. Faça login com a nova senha.', [
        { text: 'Ir para login', onPress: () => router.replace('/login') },
      ]);
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        setErro('A solicitacao demorou demais. Tente novamente em instantes.');
        return;
      }
      Alert.alert('Conexão', `Não foi possível acessar a API em ${apiBaseUrl}.`);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <ImageBackground
      source={require('../assets/images/backgroundrecuperar.png')}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.safeArea}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={28} color="#F8F4D9" />
        </TouchableOpacity>

        <View style={styles.card}>
          <Text style={styles.title}>Recuperar senha</Text>
          <Text style={styles.subtitle}>
            {codigoEnviado
              ? 'Digite o código recebido por email e defina uma nova senha.'
              : 'Informe seu email cadastrado para receber um código de recuperação.'}
          </Text>

          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
            placeholderTextColor="#F8F4D9"
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!codigoEnviado}
            style={[styles.input, codigoEnviado ? styles.disabledInput : null]}
          />

          {codigoEnviado ? (
            <>
              <TextInput
                value={codigo}
                onChangeText={setCodigo}
                placeholder="Código de 6 dígitos"
                placeholderTextColor="#F8F4D9"
                keyboardType="number-pad"
                maxLength={6}
                style={styles.input}
              />

              <PasswordInput
                placeholder="Nova senha"
                placeholderTextColor="#F8F4D9"
                value={novaSenha}
                onChangeText={setNovaSenha}
                borderColor="#94C61F"
                textColor="#F8F4D9"
                iconColor="#F8F4D9"
              />

              <PasswordInput
                placeholder="Confirmar nova senha"
                placeholderTextColor="#F8F4D9"
                value={confirmacaoSenha}
                onChangeText={setConfirmacaoSenha}
                borderColor="#94C61F"
                textColor="#F8F4D9"
                iconColor="#F8F4D9"
              />
            </>
          ) : null}

          {erro ? <Text style={styles.errorText}>{erro}</Text> : null}

          <Pressable
            onPress={() => void (codigoEnviado ? confirmarNovaSenha() : enviarCodigo())}
            disabled={carregando}
            style={styles.primaryButton}
          >
            {carregando ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.primaryButtonText}>{codigoEnviado ? 'Atualizar senha' : 'Enviar código'}</Text>
            )}
          </Pressable>

          {codigoEnviado ? (
            <Pressable onPress={() => void enviarCodigo()} disabled={carregando}>
              <Text style={styles.loginText}>Reenviar código</Text>
            </Pressable>
          ) : null}

          <Pressable onPress={() => router.replace('/login')}>
            <Text style={styles.loginText}>Voltar para o login</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

async function fetchComTimeout(url: string, options: RequestInit, timeoutMs = 20000) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
}

async function extrairMensagemErro(response: Response, fallback = 'Não foi possível concluir a solicitação.') {
  try {
    const bodyText = await response.text();
    if (!bodyText) {
      return fallback;
    }

    const data = JSON.parse(bodyText) as { message?: string; detail?: string; error?: string };
    return data.message || data.detail || data.error || fallback;
  } catch {
    return fallback;
  }
}

const styles = {
  safeArea: {
    flex: 1,
    padding: 24,
    justifyContent: 'center' as const,
  },
  backButton: {
    position: 'absolute' as const,
    top: 52,
    left: 24,
    zIndex: 2,
  },
  card: {
    width: '100%' as const,
    gap: 14,
  },
  title: {
    color: '#F8F4D9',
    fontSize: 38,
    fontWeight: '800' as const,
    textAlign: 'center' as const,
  },
  subtitle: {
    color: '#F8F4D9',
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center' as const,
    marginBottom: 10,
  },
  input: {
    width: '100%' as const,
    borderWidth: 1.5,
    borderColor: '#94C61F',
    borderRadius: 20,
    paddingVertical: 14,
    paddingHorizontal: 16,
    color: '#F8F4D9',
  },
  disabledInput: {
    opacity: 0.7,
  },
  errorText: {
    color: '#FCA5A5',
    fontWeight: '700' as const,
    textAlign: 'center' as const,
  },
  primaryButton: {
    width: '100%' as const,
    backgroundColor: '#94C61F',
    borderRadius: 20,
    paddingVertical: 16,
    alignItems: 'center' as const,
    marginTop: 4,
  },
  primaryButtonText: {
    color: '#F8F4D9',
    fontWeight: '800' as const,
    fontSize: 16,
  },
  loginText: {
    color: '#F8F4D9',
    fontSize: 16,
    textAlign: 'center' as const,
    marginTop: 6,
  },
};
