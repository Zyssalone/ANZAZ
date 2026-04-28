import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  FlatList,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  FadeInDown,
  ZoomIn,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Grid,
  List,
  Clock,
  TreePine,
  Leaf,
  PawPrint,
  Bug,
  Bird,
  MapPin,
} from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { Colors, Shadow, Radius, Spacing } from '../theme';
import { SPECIES_DATA, CURRENT_USER } from '../data/mockData';
import StatusBadge from '../components/StatusBadge';

const { width } = Dimensions.get('window');
const GRID_ITEM = (width - Spacing.md * 2 - 8) / 3;

const VIEWS = [
  { key: 'grid', label: 'Grid', icon: Grid },
  { key: 'list', label: 'List', icon: List },
  { key: 'timeline', label: 'Timeline', icon: Clock },
] as const;

const CATEGORY_FILTERS = [
  { key: 'all', label: `All (${CURRENT_USER.speciesCount})` },
  { key: 'plant', label: 'Plants (22)' },
  { key: 'animal', label: 'Animals (15)' },
  { key: 'insect', label: 'Insects (10)' },
] as const;

const CATEGORY_ICON: Record<string, React.FC<any>> = {
  plant: TreePine,
  animal: PawPrint,
  insect: Bug,
  bird: Bird,
  fungi: Leaf,
};

const CATEGORY_COLOR: Record<string, string> = {
  plant: Colors.speciesPlant,
  animal: Colors.speciesAnimal,
  insect: Colors.speciesInsect,
  bird: Colors.speciesBird,
  fungi: Colors.speciesFungi,
};

function GridItem({ species, index, onPress }: { species: typeof SPECIES_DATA[0]; index: number; onPress: () => void }) {
  const Icon = CATEGORY_ICON[species.category] ?? Leaf;
  const color = CATEGORY_COLOR[species.category] ?? Colors.primary;
  const isNew = index < 3;

  return (
    <Animated.View entering={ZoomIn.delay(index * 40 + 100).springify()}>
      <TouchableOpacity
        style={[styles.gridItem, { width: GRID_ITEM }]}
        onPress={onPress}
        activeOpacity={0.75}
      >
        <View style={[styles.gridIcon, { backgroundColor: color + '18' }]}>
          <Icon size={28} color={color} strokeWidth={1.75} />
          {isNew && <View style={styles.newDot} />}
        </View>
        <Text style={styles.gridName} numberOfLines={2}>{species.commonName}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

function ListItem({ species, index, onPress }: { species: typeof SPECIES_DATA[0]; index: number; onPress: () => void }) {
  const Icon = CATEGORY_ICON[species.category] ?? Leaf;
  const color = CATEGORY_COLOR[species.category] ?? Colors.primary;

  return (
    <Animated.View entering={FadeInDown.delay(index * 50 + 100).springify()}>
      <TouchableOpacity
        style={[styles.listItem, Shadow.sm]}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <View style={[styles.listIcon, { backgroundColor: color + '18' }]}>
          <Icon size={24} color={color} strokeWidth={1.75} />
        </View>
        <View style={styles.listInfo}>
          <Text style={styles.listName}>{species.commonName}</Text>
          <Text style={styles.listSci}>{species.scientificName}</Text>
          <View style={styles.listMeta}>
            <MapPin size={11} color={Colors.textMuted} strokeWidth={1.75} />
            <Text style={styles.listMetaText}>{species.location}</Text>
            <Text style={styles.listMetaDot}>&bull;</Text>
            <Text style={styles.listMetaText}>{species.capturedAt}</Text>
          </View>
        </View>
        <StatusBadge status={species.status} small />
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function JournalScreen() {
  const navigation = useNavigation<any>();
  const [activeView, setActiveView] = useState<'grid' | 'list' | 'timeline'>('grid');
  const [activeFilter, setActiveFilter] = useState('all');

  const viewIndicatorX = useSharedValue(0);
  const viewIndicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: viewIndicatorX.value }],
  }));

  const switchView = (idx: number, key: typeof activeView) => {
    setActiveView(key);
    viewIndicatorX.value = withSpring(idx * ((width - Spacing.md * 2 - 6) / 3), { damping: 16 });
  };

  const filteredSpecies =
    activeFilter === 'all'
      ? SPECIES_DATA
      : SPECIES_DATA.filter((s) => s.category === activeFilter);

  const handleSpeciesPress = (id: string) =>
    navigation.navigate('SpeciesDetail', { speciesId: id });

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar style="dark" backgroundColor="transparent" translucent />
      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Header */}
        <Animated.View entering={FadeInDown.delay(50).springify()} style={styles.header}>
          <Text style={styles.headerTitle}>My Journal</Text>
          <Text style={styles.headerSub}>{CURRENT_USER.speciesCount} species captured</Text>
        </Animated.View>

        {/* View toggle */}
        <Animated.View
          entering={FadeInDown.delay(120).springify()}
          style={styles.viewToggleWrap}
        >
          <View style={styles.viewToggle}>
            <Animated.View style={[styles.viewIndicator, viewIndicatorStyle]} />
            {VIEWS.map(({ key, label, icon: Icon }, idx) => (
              <TouchableOpacity
                key={key}
                style={styles.viewBtn}
                onPress={() => switchView(idx, key)}
                activeOpacity={0.8}
              >
                <Icon
                  size={14}
                  color={activeView === key ? Colors.text : Colors.textMuted}
                  strokeWidth={activeView === key ? 2 : 1.75}
                />
                <Text
                  style={[
                    styles.viewBtnText,
                    activeView === key && styles.viewBtnTextActive,
                  ]}
                >
                  {label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        {/* Category Filters */}
        <Animated.View entering={FadeInDown.delay(180).springify()}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterRow}
          >
            {CATEGORY_FILTERS.map(({ key, label }) => (
              <TouchableOpacity
                key={key}
                style={[
                  styles.filterChip,
                  activeFilter === key && styles.filterChipActive,
                ]}
                onPress={() => setActiveFilter(key)}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.filterText,
                    activeFilter === key && styles.filterTextActive,
                  ]}
                >
                  {label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>

        {/* Content */}
        {activeView === 'grid' ? (
          <View style={styles.grid}>
            {filteredSpecies.map((sp, i) => (
              <GridItem
                key={sp.id}
                species={sp}
                index={i}
                onPress={() => handleSpeciesPress(sp.id)}
              />
            ))}
          </View>
        ) : (
          <View style={styles.listWrap}>
            {filteredSpecies.map((sp, i) => (
              <ListItem
                key={sp.id}
                species={sp}
                index={i}
                onPress={() => handleSpeciesPress(sp.id)}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  scroll: { flex: 1 },
  content: { paddingBottom: 40 },

  header: {
    paddingHorizontal: Spacing.md,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
    backgroundColor: '#fff',
  },
  headerTitle: { fontSize: 22, fontWeight: '700', color: Colors.text },
  headerSub: { fontSize: 13, color: Colors.textMuted, marginTop: 2 },

  viewToggleWrap: { paddingHorizontal: Spacing.md, paddingVertical: 12, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: Colors.borderLight },
  viewToggle: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    borderRadius: Radius.sm,
    padding: 3,
    position: 'relative',
  },
  viewIndicator: {
    position: 'absolute',
    top: 3,
    left: 3,
    width: (width - Spacing.md * 2 - 6) / 3,
    bottom: 3,
    backgroundColor: '#fff',
    borderRadius: 6,
    ...Shadow.sm,
  },
  viewBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingVertical: 8,
  },
  viewBtnText: { fontSize: 12, color: Colors.textMuted, fontWeight: '500' },
  viewBtnTextActive: { color: Colors.text, fontWeight: '600' },

  filterRow: { paddingHorizontal: Spacing.md, paddingVertical: 10, gap: 8 },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: Radius.full,
    backgroundColor: '#f0f0f0',
  },
  filterChipActive: { backgroundColor: Colors.primary },
  filterText: { fontSize: 11, fontWeight: '500', color: Colors.textSecondary },
  filterTextActive: { color: '#fff' },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: Spacing.md,
    paddingTop: 12,
    gap: 4,
  },
  gridItem: {
    borderRadius: Radius.sm,
    overflow: 'hidden',
    backgroundColor: Colors.cardBg,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    marginBottom: 4,
  },
  gridIcon: {
    height: GRID_ITEM * 0.78,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  newDot: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
  },
  gridName: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.text,
    padding: 6,
    paddingTop: 4,
  },

  listWrap: { paddingHorizontal: Spacing.md, paddingTop: 12, gap: 8 },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#fff',
    borderRadius: Radius.md,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  listIcon: {
    width: 48,
    height: 48,
    borderRadius: Radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  listInfo: { flex: 1, gap: 2 },
  listName: { fontSize: 14, fontWeight: '600', color: Colors.text },
  listSci: { fontSize: 11, color: Colors.textMuted, fontStyle: 'italic' },
  listMeta: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  listMetaText: { fontSize: 10, color: Colors.textMuted },
  listMetaDot: { fontSize: 10, color: Colors.textLight },
});
