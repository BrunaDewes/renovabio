import { router } from 'expo-router';
import { Alert, ImageBackground, Text, TouchableOpacity, View } from 'react-native';

import { Avatar } from '../components/avatar';
import { useAuth } from '../context/auth-context';

export default function Home() {
  const { signOut, user } = useAuth();
  const nomeUsuario = user?.nome?.trim() || 'Usuario';
  const pontosUsuario = String(user?.pontuacao ?? 0);

  async function sair() {
    await signOut();
    router.replace('/login');
  }

  return (
    <ImageBackground
      source={require('../assets/images/background.png')}
      style={{ flex: 1, padding: 20 }}
      resizeMode="cover"
    >
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 40,
        }}
      >
        <TouchableOpacity
          onPress={() =>
            Alert.alert('Sessao', 'Deseja sair da sua conta?', [
              { text: 'Cancelar', style: 'cancel' },
              { text: 'Sair', onPress: () => void sair() },
            ])
          }
        >
          <Text style={{ fontSize: 16, fontWeight: '700' }}>Sair</Text>
        </TouchableOpacity>

        <Text style={{ fontWeight: 'bold' }}>Ola, {nomeUsuario}!</Text>

        <TouchableOpacity onPress={() => router.push('/perfil')}>
          <Avatar size={40} photoUri={user?.photoUri} borderColor="#FFFFFF" backgroundColor="#DCE8C7" iconColor="#1B4332" />
        </TouchableOpacity>
      </View>

      <View
        style={{
          backgroundColor: '#8BC34A',
          padding: 20,
          borderRadius: 30,
          marginTop: 30,
          alignItems: 'center',
        }}
      >
        <Text style={{ color: 'white' }}>Seus pontos</Text>
        <Text style={{ color: 'white', fontSize: 32, fontWeight: 'bold' }}>{pontosUsuario}</Text>
      </View>

      <View style={{ marginTop: 30, gap: 15 }}>
        <Botao texto="Desafios" onPress={() => router.push('/desafios')} />
        <Botao texto="Trocar Pontos" onPress={() => router.push('/recompensas')} />
        <Botao texto="Receitas" onPress={() => router.push('/receitas')} />
        <Botao texto="Como fazer compostagem caseira" onPress={() => router.push('/compostagem')} />
        <Botao texto="Como descartar residuos corretamente" onPress={() => router.push('/descarte')} />
      </View>

      <TouchableOpacity
        onPress={() => router.push('/feedback')}
        style={{
          backgroundColor: '#AEEA00',
          padding: 15,
          borderRadius: 20,
          marginTop: 30,
          alignItems: 'center',
        }}
      >
        <Text style={{ fontWeight: 'bold' }}>Feedback</Text>
      </TouchableOpacity>
    </ImageBackground>
  );
}

function Botao({ texto, onPress }: { texto: string; onPress: () => void }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        backgroundColor: '#1B5E20',
        padding: 15,
        borderRadius: 20,
        alignItems: 'center',
      }}
    >
      <Text style={{ color: 'white' }}>{texto}</Text>
    </TouchableOpacity>
  );
}
