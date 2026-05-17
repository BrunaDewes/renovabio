import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { ImageBackground, ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function Compostagem() {
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

        <Text style={styles.title}>Compostagem caseira</Text>
        <Text style={styles.subtitle}>
          Transforme restos orgânicos em adubo natural, reduza o lixo da casa e ajude o solo a ficar mais saudável.
        </Text>

        <View style={styles.heroCard}>
          <Ionicons name="leaf" size={34} color="#F7F3DF" />
          <View style={{ flex: 1 }}>
            <Text style={styles.heroTitle}>A regra principal</Text>
            <Text style={styles.heroText}>
              Alterne camadas de resíduos umidos com materiais secos. Isso evita mau cheiro e ajuda a compostagem a
              acontecer do jeito certo.
            </Text>
          </View>
        </View>

        <SectionCard
          titulo="Passo a passo"
          itens={[
            'Separe um balde, composteira ou caixa com tampa e furos pequenos',
            'Coloque uma camada de folhas secas, serragem ou papelao picado no fundo',
            'Adicione cascas e restos orgânicos em pedacos pequenos',
            'Cubra sempre com material seco para evitar cheiro e mosquitos',
            'Misture de vez em quando para entrar ar e acelerar o processo',
          ]}
        />

        <SectionCard
          titulo="Pode colocar"
          itens={[
            'Cascas de frutas, legumes e verduras',
            'Borra de cafe e filtro de papel',
            'Cascas de ovo trituradas',
            'Folhas secas, flores e pequenos restos de poda',
            'Guardanapo sem gordura em pouca quantidade',
          ]}
        />

        <SectionCard
          titulo="Evite colocar"
          itens={[
            'Carnes, ossos e peixe',
            'Leite, queijo e alimentos muito gordurosos',
            'Fezes de animais domesticos',
            'Oleos, molhos e comida com muito sal',
            'Plastico, vidro, metal ou qualquer material reciclavel',
          ]}
        />

        <SectionCard
          titulo="Se der problema"
          itens={[
            'Cheiro ruim: coloque mais folhas secas ou serragem',
            'Muito seco: borrife um pouco de agua',
            'Mosquitos: cubra melhor os restos com material seco',
            'Demora demais: corte os residuos em pedacos menores',
          ]}
        />

        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Quando o adubo fica pronto?</Text>
          <Text style={styles.summaryText}>
            Em geral, o composto fica escuro, com cheiro de terra e sem identificar os restos originais. Esse adubo pode
            ser usado em vasos, hortas e jardins.
          </Text>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

function SectionCard({ titulo, itens }: { titulo: string; itens: string[] }) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{titulo}</Text>

      {itens.map((item) => (
        <View key={item} style={styles.itemRow}>
          <View style={styles.dot} />
          <Text style={styles.itemText}>{item}</Text>
        </View>
      ))}
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
    marginBottom: 22,
  },
  title: {
    color: '#0B7A43',
    fontSize: 30,
    fontWeight: '800' as const,
    marginBottom: 10,
  },
  subtitle: {
    color: '#0B7A43',
    fontSize: 16,
    lineHeight: 23,
    marginBottom: 20,
  },
  heroCard: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 14,
    backgroundColor: '#0B7A43',
    borderRadius: 26,
    padding: 18,
    marginBottom: 16,
  },
  heroTitle: {
    color: '#F7F3DF',
    fontSize: 18,
    fontWeight: '800' as const,
    marginBottom: 4,
  },
  heroText: {
    color: '#F7F3DF',
    fontSize: 15,
    lineHeight: 22,
  },
  card: {
    backgroundColor: 'rgba(244,235,214,0.95)',
    borderRadius: 24,
    padding: 18,
    marginBottom: 16,
  },
  cardTitle: {
    color: '#0B7A43',
    fontSize: 19,
    fontWeight: '800' as const,
    marginBottom: 12,
  },
  itemRow: {
    flexDirection: 'row' as const,
    alignItems: 'flex-start' as const,
    marginBottom: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 999,
    backgroundColor: '#0B7A43',
    marginTop: 7,
    marginRight: 10,
  },
  itemText: {
    flex: 1,
    color: '#374151',
    fontSize: 15,
    lineHeight: 22,
  },
  summaryCard: {
    backgroundColor: 'rgba(220,232,199,0.95)',
    borderRadius: 24,
    padding: 18,
  },
  summaryTitle: {
    color: '#0B7A43',
    fontSize: 18,
    fontWeight: '800' as const,
    marginBottom: 8,
  },
  summaryText: {
    color: '#2A463A',
    fontSize: 15,
    lineHeight: 23,
  },
};
