import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  TextInput,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  withTiming,
  FadeInDown,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Search,
  Compass,
  TreePine,
  Leaf,
  PawPrint,
  Bug,
  Bird,
  Grid,
  X,
} from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { Colors, Shadow, Radius, Spacing } from '../theme';
import { SPECIES_DATA } from '../data/mockData';

const { height } = Dimensions.get('window');

const FILTERS = [
  { key: 'all', label: 'All', icon: Grid },
  { key: 'plant', label: 'Plants', icon: Leaf },
  { key: 'animal', label: 'Animals', icon: PawPrint },
  { key: 'insect', label: 'Insects', icon: Bug },
  { key: 'bird', label: 'Birds', icon: Bird },
] as const;

const CATEGORY_ICON: Record<string, React.FC<any>> = {
  plant: TreePine,
  animal: PawPrint,
  insect: Bug,
  bird: Bird,
  fungi: Leaf,
};

const PIN_COLOR: Record<string, string> = {
  plant: Colors.speciesPlant,
  animal: Colors.speciesAnimal,
  insect: Colors.speciesInsect,
  bird: Colors.speciesBird,
  fungi: Colors.speciesFungi,
};

const MAP_PINS = SPECIES_DATA.filter((s) => s.mapPin).map((s) => ({
  ...s,
  x: s.mapPin!.x,
  y: s.mapPin!.y,
}));

function PinDrop({ species, index, onPress }: { species: typeof MAP_PINS[0]; index: number; onPress: () => void }) {
  const pinY = useSharedValue(-40);
  const pinOpacity = useSharedValue(0);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: pinY.value }],
    opacity: pinOpacity.value,
  }));

  useEffect(() => {
    pinY.value = withDelay(index * 80 + 300, withSpring(0, { damping: 14, stiffness: 200 }));
    pinOpacity.value = withDelay(index * 80 + 300, withTiming(1, { duration: 200 }));
  }, []);

  const PinIcon = CATEGORY_ICON[species.category] ?? Leaf;
  const color = PIN_COLOR[species.category] ?? Colors.primary;

  return (
    <Animated.View
      style={[
        styles.pinWrap,
        { left: species.x, top: species.y },
        animStyle,
      ]}
    >
      <TouchableOpacity
        onPress={onPress}
        style={[styles.pin, { backgroundColor: color }]}
        activeOpacity={0.85}
      >
        <PinIcon size={13} color="#fff" strokeWidth={2} />
      </TouchableOpacity>
      <View style={[styles.pinTail, { backgroundColor: color }]} />
    </Animated.View>
  );
}

export default function MapScreen() {
  const navigation = useNavigation<any>();
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedSpecies, setSelectedSpecies] = useState<typeof MAP_PINS[0] | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const cardY = useSharedValue(120);
  const cardOpacity = useSharedValue(0);

  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: cardY.value }],
    opacity: cardOpacity.value,
  }));

  const showCard = (sp: typeof MAP_PINS[0]) => {
    setSelectedSpecies(sp);
    cardY.value = withSpring(0, { damping: 18 });
    cardOpacity.value = withTiming(1, { duration: 250 });
  };

  const hideCard = () => {
    cardY.value = withSpring(120, { damping: 18 });
    cardOpacity.value = withTiming(0, { duration: 200 });
    setTimeout(() => setSelectedSpecies(null), 250);
  };

  const visiblePins = MAP_PINS.filter(
    (p) => activeFilter === 'all' || p.category === activeFilter,
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar style="dark" backgroundColor="transparent" translucent />
      <View style={styles.root}>
        {/* Map Background */}
        <View style={styles.mapBg}>
          {/* Terrain layers */}
          <View style={[styles.terrain, { left: 0, top: 60, width: 180, height: 200, backgroundColor: '#c8e6c0', borderRadius: 80, opacity: 0.6 }]} />
          <View style={[styles.terrain, { right: 20, top: 120, width: 140, height: 160, backgroundColor: '#b2dfdb', borderRadius: 70, opacity: 0.5 }]} />
          <View style={[styles.terrain, { left: 60, bottom: 100, width: 220, height: 140, backgroundColor: '#dcedc8', borderRadius: 60, opacity: 0.7 }]} />
          <View style={[styles.terrain, { right: 30, bottom: 180, width: 100, height: 80, backgroundColor: '#b3e5fc', borderRadius: 40, opacity: 0.4 }]} />
          {/* River */}
          <View style={[styles.river, { top: height * 0.38 }]} />

          {/* Pins */}
          {visiblePins.map((sp, i) => (
            <PinDrop
              key={sp.id}
              species={sp}
              index={i}
              onPress={() => showCard(sp)}
            />
          ))}

          {/* Compass */}
          <TouchableOpacity style={styles.compass}>
            <Compass size={22} color={Colors.primary} strokeWidth={2} />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <Animated.View
          entering={FadeInDown.delay(100).springify()}
          style={styles.searchWrap}
        >
          <View style={[styles.searchBar, Shadow.md]}>
            <Search size={16} color={Colors.textMuted} strokeWidth={1.75} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search species or location..."
              placeholderTextColor={Colors.textLight}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          {/* Filters */}
          <View style={styles.filterRow}>
            {FILTERS.map(({ key, label, icon: Icon }) => (
              <TouchableOpacity
                key={key}
                style={[
                  styles.filterChip,
                  { ...Shadow.sm },
                  activeFilter === key && styles.filterChipActive,
                ]}
                onPress={() => setActiveFilter(key)}
                activeOpacity={0.8}
              >
                <Icon
                  size={11}
                  color={activeFilter === key ? '#fff' : Colors.textSecondary}
                  strokeWidth={2}
                />
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
          </View>
        </Animated.View>

        {/* Selected species card */}
        {selectedSpecies && (
          <Animated.View style={[styles.selCard, cardStyle, Shadow.lg]}>
            <TouchableOpacity
              style={styles.selCardInner}
              activeOpacity={0.85}
              onPress={() =>
                navigation.navigate('SpeciesDetail', { speciesId: selectedSpecies.id })
              }
            >
              <View
                style={[
                  styles.selIcon,
                  { backgroundColor: selectedSpecies.iconColor + '20' },
                ]}
              >
                {React.createElement(CATEGORY_ICON[selectedSpecies.category] ?? Leaf, {
                  size: 26,
                  color: selectedSpecies.iconColor,
                  strokeWidth: 1.75,
                })}
              </View>
              <View style={styles.selInfo}>
                <Text style={styles.selName}>{selectedSpecies.commonName}</Text>
                <Text style={styles.selSub}>
                  {selectedSpecies.sightings} sightings &bull; Tap for details
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.selClose} onPress={hideCard}>
              <X size={16} color={Colors.textMuted} strokeWidth={2} />
            </TouchableOpacity>
          </Animated.View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#d4e8d0' },
  root: { flex: 1 },

  mapBg: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#d4e8d0',
    overflow: 'hidden',
  },
  terrain: { position: 'absolute' },
  river: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 24,
    backgroundColor: '#90caf9',
    opacity: 0.5,
    transform: [{ rotate: '-3deg' }],
  },

  pinWrap: { position: 'absolute', alignItems: 'center' },
  pin: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
    ...Shadow.md,
  },
  pinTail: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: -2,
    opacity: 0.6,
  },

  compass: {
    position: 'absolute',
    bottom: 140,
    right: 16,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadow.md,
  },

  searchWrap: {
    position: 'absolute',
    top: 8,
    left: Spacing.md,
    right: Spacing.md,
    gap: 8,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(255,255,255,0.96)',
    borderRadius: Radius.md,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  searchInput: { flex: 1, fontSize: 14, color: Colors.text },
  filterRow: { flexDirection: 'row', gap: 6 },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radius.full,
    backgroundColor: 'rgba(255,255,255,0.92)',
  },
  filterChipActive: { backgroundColor: Colors.primary },
  filterText: { fontSize: 11, fontWeight: '500', color: Colors.textSecondary },
  filterTextActive: { color: '#fff' },

  selCard: {
    position: 'absolute',
    bottom: 16,
    left: Spacing.md,
    right: Spacing.md,
    backgroundColor: '#fff',
    borderRadius: Radius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 10,
  },
  selCardInner: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 12 },
  selIcon: {
    width: 48,
    height: 48,
    borderRadius: Radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selInfo: { flex: 1 },
  selName: { fontSize: 14, fontWeight: '600', color: Colors.text },
  selSub: { fontSize: 11, color: Colors.textMuted, marginTop: 2 },
  selClose: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
