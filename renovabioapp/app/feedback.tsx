import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ImageBackground,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { useAuth } from '../context/auth-context';
import { getApiBaseUrl } from '../utils/api';

export default function Feedback() {
  const { user } = useAuth();
  const apiBaseUrl = useMemo(() => getApiBaseUrl(), []);
  const [mensagem, setMensagem] = useState('');
  const [enviando, setEnviando] = useState(false);

  async function enviarFeedback() {
    if (!mensagem.trim()) {
      Alert.alert('Erro', 'Digite uma mensagem.');
      return;
    }

    if (!user?.id) {
      Alert.alert('Erro', 'Usuario nao autenticado.');
      return;
    }

    setEnviando(true);

    try {
      const params = new URLSearchParams({
        usuarioId: String(user.id),
        mensagem: mensagem.trim(),
      });

      const response = await fetch(`${apiBaseUrl}/feedbacks?${params.toString()}`, {
        method: 'POST',
      });

      if (!response.ok) {
        Alert.alert('Erro', 'Nao foi possivel enviar o feedback.');
        return;
      }

      Alert.alert('Sucesso', 'Feedback enviado com sucesso.');
      setMensagem('');
    } catch {
      Alert.alert('Erro', `Nao foi possivel acessar a API em ${apiBaseUrl}.`);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <ImageBackground
      source={require('../assets/images/backgroundoutros.png')}
      style={{ flex: 1, padding: 20 }}
      resizeMode="cover"
    >
      <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 50, alignSelf: 'flex-start' }}>
        <Text style={{ color: '#1B5E20', fontSize: 16, fontWeight: '700' }}>Voltar</Text>
      </TouchableOpacity>

      <Text
        style={{
          fontSize: 22,
          fontWeight: 'bold',
          textAlign: 'center',
          marginTop: 18,
          color: '#1B5E20',
        }}
      >
        Feedback
      </Text>

      <Text
        style={{
          textAlign: 'center',
          marginVertical: 20,
          color: '#1B5E20',
        }}
      >
        Deixe aqui suas criticas, elogios e sugestoes
      </Text>

      <View
        style={{
          backgroundColor: '#EEE9D6',
          borderRadius: 20,
          padding: 15,
          minHeight: 200,
        }}
      >
        <TextInput
          multiline
          value={mensagem}
          onChangeText={setMensagem}
          placeholder="Digite aqui..."
          placeholderTextColor="#6B7280"
          style={{
            flex: 1,
            color: '#1B4332',
            minHeight: 170,
            textAlignVertical: 'top',
          }}
        />
      </View>

      <TouchableOpacity
        onPress={() => void enviarFeedback()}
        disabled={enviando}
        style={{
          backgroundColor: '#1B5E20',
          padding: 15,
          borderRadius: 20,
          marginTop: 30,
          alignItems: 'center',
          opacity: enviando ? 0.7 : 1,
        }}
      >
        {enviando ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={{ color: 'white', fontWeight: 'bold' }}>Enviar</Text>
        )}
      </TouchableOpacity>
    </ImageBackground>
  );
}
