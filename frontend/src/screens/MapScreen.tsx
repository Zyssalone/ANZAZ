import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  ScrollView,
  Platform,
} from 'react-native';
import MapView, { Marker, UrlTile, Region } from 'react-native-maps';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
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
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';

import { Colors, Shadow, Radius, Spacing } from '../theme';
import { api } from '../utils/api';
import { SPECIES_DATA } from '../data/mockData';

// Ifrane city, Morocco — default view
const IFRANE_REGION: Region = {
  latitude: 33.5228,
  longitude: -5.1106,
  latitudeDelta: 0.08,
  longitudeDelta: 0.08,
};

const MAP_TILE_URL = 'https://basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png';

const FILTERS = [
  { key: 'all',    label: 'All',     icon: Grid },
  { key: 'plant',  label: 'Plants',  icon: Leaf },
  { key: 'animal', label: 'Animals', icon: PawPrint },
  { key: 'insect', label: 'Insects', icon: Bug },
  { key: 'bird',   label: 'Birds',   icon: Bird },
] as const;

type FilterKey = typeof FILTERS[number]['key'];

const CATEGORY_ICON: Record<string, React.FC<any>> = {
  plant: TreePine, animal: PawPrint, insect: Bug, bird: Bird, fungi: Leaf,
};

const CATEGORY_COLOR: Record<string, string> = {
  plant:  Colors.speciesPlant,
  animal: Colors.speciesAnimal,
  insect: Colors.speciesInsect,
  bird:   Colors.speciesBird,
  fungi:  Colors.speciesFungi,
};

interface Sighting {
  id: number;
  latitude: number;
  longitude: number;
  location_name: string;
  species_id: number;
  common_name: string;
  scientific_name: string;
  category: string;
  conservation_status: string;
  icon_color: string;
  captured_by: string;
}

function PinMarker({ sighting, onPress }: { sighting: Sighting; onPress: () => void }) {
  const Icon = CATEGORY_ICON[sighting.category] ?? Leaf;
  const color = sighting.icon_color ?? CATEGORY_COLOR[sighting.category] ?? Colors.primary;

  return (
    <Marker
      coordinate={{ latitude: sighting.latitude, longitude: sighting.longitude }}
      onPress={onPress}
      tracksViewChanges={false}
    >
      <View style={[styles.pin, { backgroundColor: color }]}>
        <Icon size={13} color="#fff" strokeWidth={2} />
      </View>
      <View style={[styles.pinTail, { backgroundColor: color }]} />
    </Marker>
  );
}

export default function MapScreen() {
  const navigation = useNavigation<any>();
  const mapRef = useRef<MapView>(null);

  const [sightings, setSightings] = useState<Sighting[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<FilterKey>('all');
  const [selected, setSelected] = useState<Sighting | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const cardY = useSharedValue(120);
  const cardOpacity = useSharedValue(0);

  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: cardY.value }],
    opacity: cardOpacity.value,
  }));

  // Load sightings from API, fall back to mock data on error
  useEffect(() => {
    api.sightings.all()
      .then((data) => setSightings(data.map((s) => ({
        ...s,
        latitude: Number(s.latitude),
        longitude: Number(s.longitude),
      }))))
      .catch(() => {
        // fallback — derive sightings from mock species that have mapPin coords
        const fallback: Sighting[] = SPECIES_DATA.filter((s) => s.mapPin).map((s, i) => ({
          id: i + 1,
          latitude: IFRANE_REGION.latitude + (s.mapPin!.y - 300) * 0.0003,
          longitude: IFRANE_REGION.longitude + (s.mapPin!.x - 190) * 0.0004,
          location_name: s.location ?? 'Ifrane Region',
          species_id: parseInt(s.id),
          common_name: s.commonName,
          scientific_name: s.scientificName,
          category: s.category,
          conservation_status: s.status,
          icon_color: s.iconColor,
          captured_by: 'Zyad S.',
        }));
        setSightings(fallback);
      })
      .finally(() => setLoading(false));
  }, []);

  const showCard = (s: Sighting) => {
    setSelected(s);
    cardY.value = withSpring(0, { damping: 28, stiffness: 460, mass: 0.6 });
    cardOpacity.value = withTiming(1, { duration: 100 });
  };

  const hideCard = () => {
    cardY.value = withSpring(120, { damping: 30, stiffness: 520, mass: 0.55 });
    cardOpacity.value = withTiming(0, { duration: 90 });
    setTimeout(() => setSelected(null), 200);
  };

  const centreOnIfrane = () => {
    mapRef.current?.animateToRegion(IFRANE_REGION, 600);
  };

  const visibleSightings = sightings.filter(
    (s) => (activeFilter === 'all' || s.category === activeFilter) &&
      (!searchQuery || s.common_name.toLowerCase().includes(searchQuery.toLowerCase())),
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar style="dark" backgroundColor="transparent" translucent />

      {/* Map */}
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFillObject}
        initialRegion={IFRANE_REGION}
        mapType={Platform.OS === 'android' ? 'none' : 'standard'}
        showsUserLocation={false}
        showsCompass={false}
        toolbarEnabled={false}
        rotateEnabled={false}
        onPress={() => selected && hideCard()}
      >
        {/* Raster tiles: avoids blank Google tiles inside Expo Go. */}
        <UrlTile
          urlTemplate={MAP_TILE_URL}
          maximumZ={20}
          flipY={false}
          tileSize={256}
        />

        {/* Sighting pins */}
        {visibleSightings.map((s) => (
          <PinMarker key={s.id} sighting={s} onPress={() => showCard(s)} />
        ))}
      </MapView>

      {/* Search + filters overlay */}
      <Animated.View
        entering={FadeInDown.delay(40).duration(110)}
        style={styles.topOverlay}
        pointerEvents="box-none"
      >
        <View style={[styles.searchBar, Shadow.md]}>
          <Search size={16} color={Colors.textMuted} strokeWidth={1.75} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search species..."
            placeholderTextColor={Colors.textLight}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <X size={16} color={Colors.textMuted} strokeWidth={2} />
            </TouchableOpacity>
          )}
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}
          pointerEvents="box-none"
        >
          {FILTERS.map(({ key, label, icon: Icon }) => (
            <TouchableOpacity
              key={key}
              style={[styles.filterChip, Shadow.sm, activeFilter === key && styles.filterChipActive]}
              onPress={() => setActiveFilter(key)}
              activeOpacity={0.8}
            >
              <Icon size={11} color={activeFilter === key ? '#fff' : Colors.textSecondary} strokeWidth={2} />
              <Text style={[styles.filterText, activeFilter === key && styles.filterTextActive]}>
                {label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </Animated.View>

      {/* Loading indicator */}
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator color={Colors.primary} size="large" />
        </View>
      )}

      {/* Compass / re-centre button */}
      <TouchableOpacity style={[styles.compass, Shadow.md]} onPress={centreOnIfrane}>
        <Compass size={22} color={Colors.primary} strokeWidth={2} />
      </TouchableOpacity>

      {/* Selected species card */}
      {selected && (
        <Animated.View style={[styles.selCard, cardStyle, Shadow.lg]}>
          <TouchableOpacity
            style={styles.selCardInner}
            activeOpacity={0.85}
            onPress={() => navigation.navigate('SpeciesDetail', { speciesId: String(selected.species_id) })}
          >
            {(() => {
              const Icon = CATEGORY_ICON[selected.category] ?? Leaf;
              const color = selected.icon_color ?? CATEGORY_COLOR[selected.category] ?? Colors.primary;
              return (
                <View style={[styles.selIcon, { backgroundColor: color + '20' }]}>
                  <Icon size={26} color={color} strokeWidth={1.75} />
                </View>
              );
            })()}
            <View style={styles.selInfo}>
              <Text style={styles.selName}>{selected.common_name}</Text>
              <Text style={styles.selSub}>
                {selected.location_name} &bull; by {selected.captured_by}
              </Text>
              <Text style={styles.selTap}>Tap for details</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.selClose} onPress={hideCard}>
            <X size={16} color={Colors.textMuted} strokeWidth={2} />
          </TouchableOpacity>
        </Animated.View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#d4e8d0' },

  topOverlay: {
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
    backgroundColor: 'rgba(255,255,255,0.97)',
    borderRadius: Radius.md,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  searchInput: { flex: 1, fontSize: 14, color: Colors.text },

  filterRow: { gap: 6 },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radius.full,
    backgroundColor: 'rgba(255,255,255,0.95)',
  },
  filterChipActive: { backgroundColor: Colors.primary },
  filterText: { fontSize: 11, fontWeight: '500', color: Colors.textSecondary },
  filterTextActive: { color: '#fff' },

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
    alignSelf: 'center',
    marginTop: -2,
    opacity: 0.7,
  },

  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.4)',
  },

  compass: {
    position: 'absolute',
    bottom: 120,
    right: Spacing.md,
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  selCard: {
    position: 'absolute',
    bottom: 20,
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
    width: 50,
    height: 50,
    borderRadius: Radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selInfo: { flex: 1, gap: 2 },
  selName: { fontSize: 14, fontWeight: '700', color: Colors.text },
  selSub:  { fontSize: 11, color: Colors.textMuted },
  selTap:  { fontSize: 10, color: Colors.primary, fontWeight: '600', marginTop: 2 },
  selClose: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
