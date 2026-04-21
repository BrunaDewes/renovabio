import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ImageBackground,
  Pressable,
  ScrollView,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { Avatar } from '../components/avatar';
import { PasswordInput } from '../components/password-input';
import { useAuth } from '../context/auth-context';
import { createImageFormData, getApiBaseUrl, getAuthHeaders, toApiFileUrl } from '../utils/api';

type UsuarioResponse = {
  photoUri?: string | null;
};

export default function Perfil() {
  const { signOut, updateUser, user } = useAuth();
  const apiBaseUrl = useMemo(() => getApiBaseUrl(), []);
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmacaoSenha, setConfirmacaoSenha] = useState('');
  const [notificacoesAtivas, setNotificacoesAtivas] = useState(true);
  const [salvandoSenha, setSalvandoSenha] = useState(false);
  const [salvandoNotificacoes, setSalvandoNotificacoes] = useState(false);
  const [salvandoFoto, setSalvandoFoto] = useState(false);
  const [mensagemSenha, setMensagemSenha] = useState('');

  useEffect(() => {
    async function carregarPreferenciaNotificacoes() {
      if (!user?.id) {
        return;
      }

      const valor = await AsyncStorage.getItem(`renovabio:notificacoes:${user.id}`);
      if (valor !== null) {
        setNotificacoesAtivas(valor === 'true');
      }
    }

    void carregarPreferenciaNotificacoes();
  }, [user?.id]);

  async function sair() {
    await signOut();
    router.replace('/login');
  }

  async function editarFoto() {
    if (!user?.id) {
      return;
    }

    const permissao = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissao.granted) {
      Alert.alert('Permissao', 'Permita o acesso a galeria para selecionar uma foto.');
      return;
    }

    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (resultado.canceled || !resultado.assets[0]?.uri) {
      return;
    }

    setSalvandoFoto(true);
    try {
      const response = await fetch(`${apiBaseUrl}/usuarios/${user?.id}/foto`, {
        method: 'POST',
        headers: getAuthHeaders(user.token),
        body: createImageFormData(resultado.assets[0].uri),
      });

      if (!response.ok) {
        Alert.alert('Perfil', 'Nao foi possivel enviar a foto para o servidor.');
        return;
      }

      const usuarioAtualizado = (await response.json()) as UsuarioResponse;
      await updateUser({ photoUri: toApiFileUrl(usuarioAtualizado.photoUri) });
    } finally {
      setSalvandoFoto(false);
    }
  }

  async function removerFoto() {
    if (!user?.id) {
      return;
    }

    const response = await fetch(`${apiBaseUrl}/usuarios/${user.id}/foto`, {
      method: 'DELETE',
      headers: getAuthHeaders(user.token),
    });

    if (!response.ok) {
      Alert.alert('Perfil', 'Nao foi possivel remover a foto.');
      return;
    }

    await updateUser({ photoUri: null });
  }

  async function salvarSenha() {
    if (!user?.id) {
      return;
    }

    if (!novaSenha.trim() || !confirmacaoSenha.trim()) {
      setMensagemSenha('Preencha os dois campos de senha.');
      return;
    }

    if (novaSenha !== confirmacaoSenha) {
      setMensagemSenha('As senhas nao coincidem.');
      return;
    }

    if (novaSenha.trim().length < 4) {
      setMensagemSenha('A nova senha precisa ter pelo menos 4 caracteres.');
      return;
    }

    setSalvandoSenha(true);
    setMensagemSenha('');

    try {
      const response = await fetch(`${apiBaseUrl}/usuarios/${user.id}/senha`, {
        method: 'PATCH',
        headers: {
          ...getAuthHeaders(user.token),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          novaSenha: novaSenha.trim(),
        }),
      });

      if (!response.ok) {
        const bodyText = await response.text();
        const data = bodyText ? (JSON.parse(bodyText) as { message?: string }) : null;
        setMensagemSenha(data?.message || 'Nao foi possivel atualizar a senha.');
        return;
      }

      setNovaSenha('');
      setConfirmacaoSenha('');
      setMensagemSenha('Senha atualizada com sucesso.');
    } catch {
      setMensagemSenha(`Nao foi possivel acessar a API em ${apiBaseUrl}.`);
    } finally {
      setSalvandoSenha(false);
    }
  }

  async function definirNotificacoes(valor: boolean) {
    if (!user?.id) {
      return;
    }

    setSalvandoNotificacoes(true);
    setNotificacoesAtivas(valor);

    try {
      await AsyncStorage.setItem(`renovabio:notificacoes:${user.id}`, String(valor));
    } finally {
      setSalvandoNotificacoes(false);
    }
  }

  return (
    <ImageBackground
      source={require('../assets/images/backgroundperfil.png')}
      style={{ flex: 1, padding: 24 }}
      resizeMode="cover"
    >
      <View
        style={{
          marginTop: 48,
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: '700' }}>Voltar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            Alert.alert('Sessao', 'Deseja sair da sua conta?', [
              { text: 'Cancelar', style: 'cancel' },
              { text: 'Sair', onPress: () => void sair() },
            ])
          }
        >
          <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: '700' }}>Sair</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ flexGrow: 1, alignItems: 'center', marginTop: 20, paddingBottom: 32 }}>
        <Text style={{ color: '#FFFFFF', fontSize: 24, fontWeight: '700' }}>Perfil</Text>

        <Pressable onPress={() => void editarFoto()} disabled={salvandoFoto}>
          <View style={{ marginTop: 20, opacity: salvandoFoto ? 0.65 : 1 }}>
            <Avatar size={110} photoUri={user?.photoUri} borderColor="#FFFFFF" backgroundColor="rgba(255,255,255,0.18)" />
            {salvandoFoto ? (
              <View
                style={{
                  position: 'absolute',
                  inset: 0,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <ActivityIndicator color="#FFFFFF" />
              </View>
            ) : null}
          </View>
        </Pressable>

        <Pressable onPress={() => void editarFoto()}>
          <Text style={{ color: '#FFFFFF', marginTop: 8 }}>Editar foto</Text>
        </Pressable>

        {user?.photoUri ? (
          <Pressable onPress={() => void removerFoto()}>
            <Text style={{ color: '#D1FAE5', marginTop: 6 }}>Remover foto</Text>
          </Pressable>
        ) : null}

        <Text
          style={{
            color: '#FFFFFF',
            fontSize: 20,
            fontWeight: '700',
            marginTop: 16,
          }}
        >
          {user?.nome ?? 'Usuario'}
        </Text>

        <Text style={{ color: '#D1FAE5', marginTop: 4 }}>{user?.pontuacao ?? 0} pontos</Text>
        <Text style={{ color: '#FFFFFF', marginTop: 4 }}>{user?.email ?? 'Email nao informado'}</Text>

        <Text style={{ color: '#FFFFFF', marginTop: 24 }}>Alterar senha</Text>

        <View style={{ width: '100%', marginTop: 12, gap: 12 }}>
          <PasswordInput
            placeholder="Nova senha"
            placeholderTextColor="#FFFFFF"
            value={novaSenha}
            onChangeText={setNovaSenha}
            borderColor="#84CC16"
            textColor="#FFFFFF"
            iconColor="#FFFFFF"
            containerStyle={campoStyle}
          />

          <PasswordInput
            placeholder="Confirmacao de senha"
            placeholderTextColor="#FFFFFF"
            value={confirmacaoSenha}
            onChangeText={setConfirmacaoSenha}
            borderColor="#84CC16"
            textColor="#FFFFFF"
            iconColor="#FFFFFF"
            containerStyle={campoStyle}
          />
        </View>

        {mensagemSenha ? (
          <Text style={{ color: '#FFFFFF', marginTop: 12, textAlign: 'center' }}>{mensagemSenha}</Text>
        ) : null}

        <TouchableOpacity
          onPress={() => void salvarSenha()}
          disabled={salvandoSenha}
          style={{
            marginTop: 20,
            backgroundColor: '#EDE9D5',
            paddingVertical: 12,
            paddingHorizontal: 32,
            borderRadius: 20,
            minWidth: 160,
            alignItems: 'center',
            opacity: salvandoSenha ? 0.7 : 1,
          }}
        >
          {salvandoSenha ? (
            <ActivityIndicator color="#1B4332" />
          ) : (
            <Text style={{ color: '#1B4332', fontWeight: '700' }}>Confirmar</Text>
          )}
        </TouchableOpacity>

        <Text style={{ color: '#FFFFFF', marginTop: 30 }}>Ativar notificacoes</Text>

        <View
          style={{
            marginTop: 12,
            width: '100%',
            backgroundColor: 'rgba(255,255,255,0.12)',
            borderRadius: 20,
            paddingVertical: 12,
            paddingHorizontal: 16,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Text style={{ color: '#FFFFFF', fontWeight: '700' }}>{notificacoesAtivas ? 'Sim' : 'Nao'}</Text>
          <Switch
            value={notificacoesAtivas}
            onValueChange={(valor) => void definirNotificacoes(valor)}
            disabled={salvandoNotificacoes}
            trackColor={{ false: '#F97316', true: '#84CC16' }}
            thumbColor="#FFFFFF"
          />
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const campoStyle = {
  width: '100%' as const,
};
