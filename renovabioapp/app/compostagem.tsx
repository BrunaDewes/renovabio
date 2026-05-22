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
          Transforme restos orgânicos em adubo natural e reduza o lixo da sua casa. Com poucos cuidados, é possível
          evitar mau cheiro, diminuir resíduos enviados ao aterro e ainda produzir um composto rico para plantas e
          hortas.
        </Text>

        <View style={styles.heroCard}>
          <Ionicons name="leaf" size={34} color="#F7F3DF" />
          <View style={{ flex: 1 }}>
            <Text style={styles.heroTitle}>A regra mais importante</Text>
            <Text style={styles.heroText}>Misture resíduos úmidos com materiais secos.</Text>
          </View>
        </View>

        <SectionCard
          titulo="Isso ajuda a evitar"
          itens={[
            'Restos úmidos: frutas, verduras, borra de café',
            'Materiais secos: folhas secas, serragem, papelão picado',
            'Cheiro forte, excesso de umidade e mosquitos',
          ]}
          icon="checkmark-circle"
        />

        <SectionCard
          titulo="Passo a passo"
          itens={[
            'Escolha um balde, caixa ou composteira com tampa',
            'Faça pequenos furos para entrada de ar',
            'Coloque uma camada de folhas secas ou serragem no fundo',
            'Adicione os resíduos orgânicos em pedaços pequenos',
            'Cubra sempre com material seco',
            'Misture o conteúdo de vez em quando para ventilar',
            'Evite excesso de água',
            'Mantenha em local protegido do sol forte e da chuva',
          ]}
        />

        <SectionCard
          titulo="Pode colocar"
          itens={[
            'Cascas de frutas, legumes e verduras',
            'Borra de café e filtro de papel',
            'Cascas de ovo trituradas',
            'Folhas secas e restos de poda',
            'Saquinhos de chá sem plástico',
            'Papel toalha ou guardanapo sem gordura (em pouca quantidade)',
          ]}
        />

        <SectionCard
          titulo="Evite colocar"
          itens={[
            'Carnes, peixes e ossos',
            'Leite, queijo e alimentos gordurosos',
            'Óleo, gordura e molhos',
            'Fezes de animais domésticos',
            'Alimentos muito salgados ou temperados',
            'Plástico, metal, vidro e recicláveis',
          ]}
        />

        <ProblemCard />

        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Quando o adubo está pronto?</Text>
          <ChecklistItem texto="Escuro" />
          <ChecklistItem texto="Com cheiro de terra" />
          <ChecklistItem texto="Solto e úmido" />
          <ChecklistItem texto="Sem identificar os restos originais" />
          <Text style={styles.summaryText}>Ele pode ser usado em vasos, hortas e jardins.</Text>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

function SectionCard({
  titulo,
  itens,
  icon,
}: {
  titulo: string;
  itens: string[];
  icon?: keyof typeof Ionicons.glyphMap;
}) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{titulo}</Text>

      {itens.map((item) => (
        <View key={item} style={styles.itemRow}>
          {icon ? (
            <Ionicons name={icon} size={18} color="#0B7A43" style={styles.iconBullet} />
          ) : (
            <View style={styles.dot} />
          )}
          <Text style={styles.itemText}>{item}</Text>
        </View>
      ))}
    </View>
  );
}

function ChecklistItem({ texto }: { texto: string }) {
  return (
    <View style={styles.itemRow}>
      <Ionicons name="checkmark-circle" size={18} color="#0B7A43" style={styles.iconBullet} />
      <Text style={styles.itemText}>{texto}</Text>
    </View>
  );
}

function ProblemCard() {
  const problemas = [
    {
      titulo: 'Mau cheiro',
      descricao: 'Adicione folhas secas, serragem ou papel picado.',
    },
    {
      titulo: 'Muito molhado',
      descricao: 'Misture mais material seco e revolva a compostagem.',
    },
    {
      titulo: 'Muito seco',
      descricao: 'Borrife um pouco de água.',
    },
    {
      titulo: 'Mosquitos',
      descricao: 'Cubra os restos orgânicos com material seco.',
    },
    {
      titulo: 'Decomposição lenta',
      descricao: 'Corte os resíduos em pedaços menores e misture melhor.',
    },
  ];

  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Problemas comuns</Text>

      {problemas.map((problema) => (
        <View key={problema.titulo} style={styles.problemBlock}>
          <Text style={styles.problemTitle}>{problema.titulo}</Text>
          <Text style={styles.problemText}>{problema.descricao}</Text>
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
  iconBullet: {
    marginTop: 2,
    marginRight: 10,
  },
  itemText: {
    flex: 1,
    color: '#374151',
    fontSize: 15,
    lineHeight: 22,
  },
  problemBlock: {
    marginBottom: 12,
  },
  problemTitle: {
    color: '#2A463A',
    fontSize: 15,
    fontWeight: '800' as const,
    marginBottom: 4,
  },
  problemText: {
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
    marginBottom: 10,
  },
  summaryText: {
    color: '#2A463A',
    fontSize: 15,
    lineHeight: 23,
    marginTop: 8,
  },
};
