import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { ImageBackground, ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function Descarte() {
  return (
    <ImageBackground
      source={require('../assets/images/backgroundoutros.png')}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <ScrollView contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 52, paddingBottom: 32 }}>
        <TouchableOpacity onPress={() => router.back()} style={{ alignSelf: 'flex-start', marginBottom: 24 }}>
          <Ionicons name="arrow-back" size={28} color="#0B7A43" />
        </TouchableOpacity>

        <Text style={{ color: '#0B7A43', fontSize: 35, fontWeight: '800', marginBottom: 10 }}>
          Como descartar corretamente
        </Text>

        <Text style={{ color: '#0B7A43', fontSize: 15, lineHeight: 22, marginBottom: 22 }}>
          Separar os residuos da forma certa reduz contaminacao, facilita a reciclagem e melhora o aproveitamento do
          lixo organico.
        </Text>

        <InfoCard
          titulo="Pode descartar no organico"
          itens={[
            'Cascas de frutas, legumes e verduras',
            'Restos de arroz, feijao, pao e massas',
            'Borra de cafe e saquinhos de cha',
            'Cascas de ovo',
            'Folhas secas, flores e pequenos restos de poda',
          ]}
        />

        <InfoCard
          titulo="Nao deve ir no organico"
          itens={[
            'Plasticos, vidros, metais e isopor',
            'Papel higienico e fraldas',
            'Oleos, gorduras e liquidos em excesso',
            'Pilhas, baterias e eletronicos',
            'Remedios, seringas e residuos contaminados',
          ]}
        />

        <InfoCard
          titulo="Dicas rapidas"
          itens={[
            'Separe reciclavel, organico e rejeito em recipientes diferentes',
            'Escorra bem os alimentos antes de descartar',
            'Use recipiente com tampa para evitar cheiro forte',
            'Quando possivel, encaminhe o organico para compostagem',
            'Lave reciclaveis sujos para nao contaminar o restante',
          ]}
        />

        <View
          style={{
            backgroundColor: '#0B7A43',
            borderRadius: 24,
            padding: 18,
          }}
        >
          <Text style={{ color: '#F7F3DF', fontSize: 18, fontWeight: '800', marginBottom: 8 }}>Resumo</Text>
          <Text style={{ color: '#F7F3DF', lineHeight: 22 }}>
            O ideal e separar o que pode ser reciclado, manter o lixo organico limpo de contaminantes e evitar misturar
            materiais perigosos com residuos domesticos comuns.
          </Text>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

function InfoCard({ titulo, itens }: { titulo: string; itens: string[] }) {
  return (
    <View
      style={{
        backgroundColor: 'rgba(244,235,214,0.95)',
        borderRadius: 24,
        padding: 18,
        marginBottom: 16,
      }}
    >
      <Text style={{ fontSize: 18, fontWeight: '800', color: '#0B7A43', marginBottom: 12 }}>{titulo}</Text>

      {itens.map((item) => (
        <Text key={item} style={{ color: '#374151', lineHeight: 22, marginBottom: 6 }}>
          • {item}
        </Text>
      ))}
    </View>
  );
}
