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
          Separar os resíduos corretamente ajuda a reduzir a poluição, melhora a reciclagem e evita que materiais
          reaproveitáveis acabem em aterros sanitários.
        </Text>

        <InfoCard
          titulo="Pode ir no orgânico"
          itens={[
            'Cascas de frutas, legumes e verduras',
            'Restos de arroz, feijão, pão e massas',
            'Borra de café e saquinhos de chá',
            'Cascas de ovo',
            'Folhas secas e restos de poda',
          ]}
        />

        <InfoCard
          titulo="Não deve ir no orgânico"
          itens={[
            'Plásticos, vidros, metais e isopor',
            'Papel higiênico e fraldas',
            'Óleo e gordura em excesso',
            'Pilhas, baterias e eletrônicos',
            'Medicamentos e materiais contaminados',
          ]}
        />

        <InfoCard
          titulo="Dicas rápidas"
          itens={[
            'Separe reciclável, orgânico e rejeito',
            'Escorra alimentos antes de descartar',
            'Use recipiente com tampa',
            'Lave recicláveis sujos',
            'Sempre que possível, faça compostagem',
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
            Separar corretamente os resíduos reduz a contaminação, melhora o reaproveitamento dos materiais e ajuda o
            meio ambiente.
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
        <View
          key={item}
          style={{
            flexDirection: 'row',
            alignItems: 'flex-start',
            marginBottom: 8,
          }}
        >
          <View
            style={{
              width: 8,
              height: 8,
              borderRadius: 999,
              backgroundColor: '#0B7A43',
              marginTop: 7,
              marginRight: 10,
            }}
          />
          <Text style={{ flex: 1, color: '#374151', lineHeight: 22 }}>{item}</Text>
        </View>
      ))}
    </View>
  );
}
