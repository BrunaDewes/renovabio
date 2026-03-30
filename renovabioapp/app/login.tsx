import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ImageBackground,
  Pressable,
  SafeAreaView,
  Text,
  TextInput,
  View,
} from 'react-native';

import { useAuth } from '../context/auth-context';
import { PasswordInput } from '../components/password-input';
import { getApiBaseUrl } from '../utils/api';

type LoginResponse = {
  id: number;
  nome: string;
  email: string;
  pontuacao: number;
};

export default function LoginScreen() {
  const { email: emailInicial } = useLocalSearchParams<{ email?: string }>();
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');
  const apiBaseUrl = useMemo(() => getApiBaseUrl(), []);

  useEffect(() => {
    if (typeof emailInicial === 'string' && emailInicial.trim()) {
      setEmail(emailInicial);
    }
  }, [emailInicial]);

  async function entrar() {
    if (!email.trim() || !senha.trim()) {
      setErro('Preencha email e senha.');
      return;
    }

    setCarregando(true);
    setErro('');

    try {
      const response = await fetch(`${apiBaseUrl}/usuarios/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          senha,
        }),
      });

      const bodyText = await response.text();
      const data = bodyText ? (JSON.parse(bodyText) as LoginResponse | { message?: string }) : null;

      if (!response.ok) {
        const mensagem = data && 'message' in data && data.message ? data.message : 'Nao foi possivel fazer login.';
        setErro(mensagem);
        return;
      }

      const usuario = data as LoginResponse;
      await signIn(usuario);
      router.replace('/home');
    } catch {
      Alert.alert('Conexao', `Nao foi possivel acessar a API em ${apiBaseUrl}.`);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <ImageBackground
      source={require('../assets/images/backgroundlogin.png')}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <SafeAreaView style={{ flex: 1, justifyContent: 'flex-end',paddingBottom: 110, alignItems: 'center', padding: 24 }}>
      
      <View style={{ width: '100%', alignItems: 'center', gap: 16 }}>

        {/* Título */}
        <Text style={{ fontSize: 60, fontWeight: '800', color: '#f8f4d9' }}>
          RenovaBio
        </Text>

        {/* INPUT EMAIL */}
        <TextInput
          placeholder="Email"
          placeholderTextColor="#f8f4d9"
          value={email}
          onChangeText={setEmail}
          style={{
            width: '100%',
            borderWidth: 1.5,
            borderColor: '#94c61f',
            borderRadius: 20,
            paddingVertical: 14,
            paddingHorizontal: 16,
            color: '#f8f4d9',
          }}
        />

        {/* INPUT SENHA */}
        <PasswordInput
          placeholder="Senha"
          placeholderTextColor="#f8f4d9"
          value={senha}
          onChangeText={setSenha}
          borderColor="#94c61f"
          textColor="#f8f4d9"
          iconColor="#f8f4d9"
        />

        {/* ERRO */}
        {erro ? (
          <Text style={{ color: '#FCA5A5', fontWeight: '600' }}>
            {erro}
          </Text>
        ) : null}

        {/* BOTÃO LOGIN */}
        <Pressable
          onPress={entrar}
          style={{
            width: '100%',
            backgroundColor: '#94c61f',
            borderRadius: 20,
            paddingVertical: 16,
            alignItems: 'center',
            marginTop: 8,
          }}
        >
          {carregando ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={{ color: '#f8f4d9', fontWeight: '700' }}>
              Login
            </Text>
          )}
        </Pressable>

        {/* CRIAR CONTA */}
        <Pressable
          onPress={() => router.push('/cadastro')}
          style={{
            width: '100%',
            backgroundColor: '#f8f4d9',
            borderRadius: 20,
            paddingVertical: 14,
            alignItems: 'center',
          }}
        >
          <Text style={{ color: '#1B4332', fontWeight: '600' }}>
            Criar uma conta
          </Text>
        </Pressable>

        {/* ESQUECEU SENHA */}
        <Pressable onPress={() => router.push('/recuperar')}>
          <Text style={{ color: '#f8f4d9', fontSize: 16 }}>
            Esqueceu a senha?
          </Text>
        </Pressable>

      </View>
    </SafeAreaView>
  </ImageBackground>
  );
}
