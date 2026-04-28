import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  withTiming,
  FadeInDown,
  FadeInRight,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  TreePine,
  Leaf,
  PawPrint,
  Bug,
  Bird,
  Camera,
  Share2,
  MapPin,
  Map,
} from 'lucide-react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';

import { Colors, Shadow, Radius, Spacing } from '../theme';
import StatusBadge from '../components/StatusBadge';
import { SPECIES_DATA } from '../data/mockData';
import type { Species } from '../data/mockData';
import type { RootStackParamList } from '../types/navigation';
import { api } from '../utils/api';
import { toSpecies } from '../utils/mappers';

type RouteType = RouteProp<RootStackParamList, 'SpeciesDetail'>;

const { width } = Dimensions.get('window');
const IMAGE_H = 220;

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

const COMMUNITY_SIGHTINGS = Array.from({ length: 8 }, (_, i) => i);

export default function SpeciesDetailScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<RouteType>();

  const [species, setSpecies] = useState<Species>(
    SPECIES_DATA.find((s) => s.id === route.params.speciesId) ?? SPECIES_DATA[0],
  );
  const Icon = CATEGORY_ICON[species.category] ?? Leaf;
  const iconColor = CATEGORY_COLOR[species.category] ?? Colors.primary;

  const imgY = useSharedValue(20);
  const imgOpacity = useSharedValue(0);

  const imgStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: imgY.value }],
    opacity: imgOpacity.value,
  }));

  useEffect(() => {
    imgY.value = withSpring(0, { damping: 28, stiffness: 480, mass: 0.6 });
    imgOpacity.value = withTiming(1, { duration: 120 });
  }, []);

  useEffect(() => {
    api.species.get(route.params.speciesId)
      .then((row) => setSpecies(toSpecies(row)))
      .catch(() => undefined);
  }, [route.params.speciesId]);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar style="dark" backgroundColor="transparent" translucent />
      {/* Header */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <ArrowLeft size={20} color={Colors.text} strokeWidth={2} />
        </TouchableOpacity>
        <Text style={styles.topTitle} numberOfLines={1}>Species Detail</Text>
        <TouchableOpacity style={styles.shareBtn}>
          <Share2 size={18} color={Colors.text} strokeWidth={1.75} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* Image */}
        <Animated.View style={[styles.imageWrap, imgStyle]}>
          <View style={[styles.imageBg, { backgroundColor: iconColor + '18' }]}>
            <Icon size={90} color={iconColor} strokeWidth={1.25} />
          </View>
        </Animated.View>

        {/* Species name + status */}
        <Animated.View entering={FadeInDown.delay(40).duration(100)} style={styles.nameSection}>
          <View style={styles.nameRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.speciesName}>{species.commonName}</Text>
              <Text style={styles.sciName}>{species.scientificName}</Text>
            </View>
            <StatusBadge status={species.status} />
          </View>
        </Animated.View>

        {/* Facts grid */}
        <Animated.View entering={FadeInDown.delay(70).duration(100)} style={styles.factsGrid}>
          {species.facts.map(({ label, value }, i) => (
            <View key={label} style={styles.factCard}>
              <Text style={styles.factLabel}>{label}</Text>
              <Text style={styles.factValue}>{value}</Text>
            </View>
          ))}
        </Animated.View>

        {/* Description */}
        <Animated.View entering={FadeInDown.delay(100).duration(100)} style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.descText}>{species.description}</Text>
        </Animated.View>

        {/* Habitat */}
        <Animated.View entering={FadeInDown.delay(120).duration(100)} style={styles.section}>
          <Text style={styles.sectionTitle}>Habitat</Text>
          <View style={styles.habitatBox}>
            <MapPin size={16} color={Colors.textMuted} strokeWidth={1.75} />
            <Text style={styles.habitatText}>{species.habitat}</Text>
          </View>
        </Animated.View>

        {/* Distribution map placeholder */}
        <Animated.View entering={FadeInDown.delay(140).duration(100)} style={styles.section}>
          <Text style={styles.sectionTitle}>Habitat Range</Text>
          <View style={styles.mapPlaceholder}>
            <Map size={28} color={Colors.textLight} strokeWidth={1.5} />
            <Text style={styles.mapPlaceholderText}>Distribution Map</Text>
          </View>
        </Animated.View>

        {/* Community Sightings */}
        <Animated.View entering={FadeInDown.delay(160).duration(100)} style={styles.section}>
          <Text style={styles.sectionTitle}>
            Community Sightings ({species.sightings})
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.sightingsRow}>
            {COMMUNITY_SIGHTINGS.map((_, i) => (
              <Animated.View
                key={i}
                entering={FadeInRight.delay(170 + i * 14).duration(90)}
                style={styles.sightingThumb}
              >
                <View style={[styles.sightingImgBg, { backgroundColor: iconColor + '15' }]}>
                  <Icon size={22} color={iconColor} strokeWidth={1.75} />
                </View>
              </Animated.View>
            ))}
            <View style={styles.sightingMore}>
              <Text style={styles.sightingMoreText}>+{species.sightings - 8}</Text>
            </View>
          </ScrollView>
        </Animated.View>

        {/* CTA */}
        <Animated.View entering={FadeInDown.delay(190).duration(100)} style={styles.ctaWrap}>
          <TouchableOpacity
            style={styles.ctaBtn}
            activeOpacity={0.85}
            onPress={() => navigation.navigate('Capture')}
          >
            <Camera size={18} color="#fff" strokeWidth={2} />
            <Text style={styles.ctaBtnText}>I spotted this species!</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },

  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
    gap: 10,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background,
  },
  topTitle: { flex: 1, fontSize: 16, fontWeight: '600', color: Colors.text },
  shareBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background,
  },

  content: { paddingBottom: 48 },

  imageWrap: { height: IMAGE_H },
  imageBg: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  nameSection: {
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  nameRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  speciesName: { fontSize: 24, fontWeight: '700', color: Colors.text },
  sciName: { fontSize: 13, color: Colors.textMuted, fontStyle: 'italic', marginTop: 2 },

  factsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    padding: Spacing.md,
    paddingBottom: 0,
  },
  factCard: {
    width: (width - Spacing.md * 2 - 8) / 2,
    backgroundColor: Colors.sectionBg,
    borderRadius: Radius.sm,
    padding: 12,
    gap: 2,
  },
  factLabel: { fontSize: 10, color: Colors.textMuted, fontWeight: '500' },
  factValue: { fontSize: 14, fontWeight: '700', color: Colors.text },

  section: { paddingHorizontal: Spacing.md, paddingTop: 20 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: Colors.text, marginBottom: 10 },
  descText: { fontSize: 13, color: Colors.textSecondary, lineHeight: 21 },

  habitatBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.sectionBg,
    borderRadius: Radius.md,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  habitatText: { fontSize: 13, color: Colors.textSecondary, flex: 1 },

  mapPlaceholder: {
    height: 110,
    backgroundColor: Colors.background,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  mapPlaceholderText: { fontSize: 12, color: Colors.textLight },

  sightingsRow: { gap: 8 },
  sightingThumb: {
    width: 72,
    height: 72,
    borderRadius: Radius.sm,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  sightingImgBg: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  sightingMore: {
    width: 72,
    height: 72,
    borderRadius: Radius.sm,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sightingMoreText: { fontSize: 14, fontWeight: '600', color: Colors.textMuted },

  ctaWrap: { paddingHorizontal: Spacing.md, paddingTop: 24 },
  ctaBtn: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.full,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    ...Shadow.primary,
  },
  ctaBtnText: { color: '#fff', fontSize: 15, fontWeight: '600' },
});
