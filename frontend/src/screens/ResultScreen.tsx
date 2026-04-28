import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withDelay,
  withSequence,
  FadeIn,
  FadeInDown,
  ZoomIn,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  TreePine,
  Check,
  Share2,
  Globe,
  Ruler,
  ShieldAlert,
  Leaf,
  MapPin,
  Sparkles,
  X,
} from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import type { StackScreenProps } from '@react-navigation/stack';

import { Colors, Shadow, Radius, Spacing } from '../theme';
import { RESULT_SPECIES } from '../data/mockData';
import type { Species } from '../data/mockData';
import StatusBadge from '../components/StatusBadge';
import type { RootStackParamList } from '../types/navigation';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';
import { toSpecies } from '../utils/mappers';

type Props = StackScreenProps<RootStackParamList, 'Result'>;

const { width } = Dimensions.get('window');
const IMAGE_H = 260;

const CHIPS = [
  { icon: Globe, text: 'Native to Morocco' },
  { icon: Ruler, text: '30–40 m tall' },
  { icon: ShieldAlert, text: 'Endangered' },
  { icon: Leaf, text: 'Conifer' },
];

export default function ResultScreen({ navigation, route }: Props) {
  const { token, refreshUser } = useAuth();
  const [sp, setSp] = useState<Species>(RESULT_SPECIES);

  const imgScale = useSharedValue(1.08);
  const panelY = useSharedValue(200);
  const panelOpacity = useSharedValue(0);
  const badgeScale = useSharedValue(0);
  const toastY = useSharedValue(60);
  const toastOpacity = useSharedValue(0);

  const imgStyle = useAnimatedStyle(() => ({
    transform: [{ scale: imgScale.value }],
  }));

  const panelStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: panelY.value }],
    opacity: panelOpacity.value,
  }));

  const badgeStyle = useAnimatedStyle(() => ({
    transform: [{ scale: badgeScale.value }],
  }));

  const toastStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: toastY.value }],
    opacity: toastOpacity.value,
  }));

  useEffect(() => {
    imgScale.value = withTiming(1, { duration: 140 });
    panelY.value = withSpring(0, { damping: 30, stiffness: 520, mass: 0.6 });
    panelOpacity.value = withTiming(1, { duration: 120 });
    badgeScale.value = withDelay(80, withSpring(1, { damping: 24, stiffness: 560, mass: 0.5 }));

    // Points toast
    toastY.value = withDelay(260, withSpring(0, { damping: 28, stiffness: 520, mass: 0.55 }));
    toastOpacity.value = withDelay(260, withTiming(1, { duration: 100 }));
    toastY.value = withDelay(1500, withSpring(60, { damping: 30, stiffness: 540, mass: 0.55 }));
    toastOpacity.value = withDelay(1500, withTiming(0, { duration: 100 }));
  }, []);

  useEffect(() => {
    api.species.get(route.params?.speciesId ?? RESULT_SPECIES.id)
      .then((row) => setSp(toSpecies(row)))
      .catch(() => undefined);
  }, [route.params?.speciesId]);

  const handleSave = async () => {
    if (token) {
      try {
        await api.sightings.create({
          species_id: Number(sp.id),
          latitude: 33.5228,
          longitude: -5.1106,
          location_name: 'Ifrane National Park',
          notes: 'Captured from ANZAZ mobile app',
        });
        await refreshUser().catch(() => undefined);
      } catch (error) {
        Alert.alert('Save failed', error instanceof Error ? error.message : 'Please try again.');
        return;
      }
    }
    navigation.reset({ index: 0, routes: [{ name: 'Main' }] });
  };

  return (
    <View style={styles.root}>
      <StatusBar style="light" backgroundColor="transparent" translucent />
      {/* Image */}
      <Animated.View style={[styles.imageWrap, imgStyle]}>
        <View style={styles.imagePlaceholder}>
          <TreePine size={80} color="rgba(255,255,255,0.4)" strokeWidth={1.25} />
        </View>
        <TouchableOpacity style={styles.closeBtn} onPress={() => navigation.goBack()}>
          <X size={20} color="#fff" strokeWidth={2.5} />
        </TouchableOpacity>
      </Animated.View>

      {/* Panel */}
      <Animated.View style={[styles.panel, panelStyle]}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.panelContent}>
          {/* Confidence badge */}
          <View style={styles.confidenceRow}>
            <Animated.View style={[styles.matchBadge, badgeStyle]}>
              <Check size={12} color={Colors.primary} strokeWidth={2.5} />
              <Text style={styles.matchText}>95% match</Text>
            </Animated.View>
            <Text style={styles.matchTime}>Identified in 1.2 s</Text>
          </View>

          <Text style={styles.speciesName}>{sp.commonName}</Text>
          <Text style={styles.sciName}>{sp.scientificName}</Text>

          {/* Info chips */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipsRow}
          >
            {CHIPS.map(({ icon: Icon, text }) => (
              <View key={text} style={styles.chip}>
                <Icon size={13} color={Colors.primary} strokeWidth={2} />
                <Text style={styles.chipText}>{text}</Text>
              </View>
            ))}
          </ScrollView>

          {/* About */}
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.bodyText} numberOfLines={4}>
            {sp.description}
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('SpeciesDetail', { speciesId: sp.id })}>
            <Text style={styles.readMore}>Read more &rarr;</Text>
          </TouchableOpacity>

          {/* Location */}
          <Text style={styles.sectionTitle}>Location Captured</Text>
          <View style={styles.locationBox}>
            <MapPin size={16} color={Colors.textMuted} strokeWidth={1.75} />
            <Text style={styles.locationText}>
              {sp.location} &bull; 33.53°N, 5.11°W
            </Text>
          </View>

          {/* Actions */}
          <View style={styles.actionRow}>
            <TouchableOpacity style={[styles.primaryBtn, { flex: 1 }]} onPress={handleSave} activeOpacity={0.85}>
              <Check size={17} color="#fff" strokeWidth={2.5} />
              <Text style={styles.primaryBtnText}>Save to Journal</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.secondaryBtn, { flex: 1 }]} activeOpacity={0.85}>
              <Share2 size={17} color={Colors.primary} strokeWidth={2} />
              <Text style={styles.secondaryBtnText}>Share</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Animated.View>

      {/* Points toast */}
      <Animated.View style={[styles.toast, toastStyle]}>
        <Sparkles size={16} color="#8a7a00" strokeWidth={2} />
        <Text style={styles.toastText}>+50 points earned!</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#1a2a1a' },

  imageWrap: { height: IMAGE_H, overflow: 'hidden' },
  imagePlaceholder: {
    flex: 1,
    backgroundColor: '#2a3d2a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtn: {
    position: 'absolute',
    top: 48,
    left: 16,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  panel: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -20,
  },
  panelContent: { padding: Spacing.md, gap: 10, paddingBottom: 40 },

  confidenceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  matchBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.full,
  },
  matchText: { fontSize: 11, fontWeight: '700', color: Colors.primary },
  matchTime: { fontSize: 11, color: Colors.textMuted },

  speciesName: { fontSize: 26, fontWeight: '700', color: Colors.text },
  sciName: { fontSize: 13, color: Colors.textMuted, fontStyle: 'italic', marginTop: -4 },

  chipsRow: { gap: 8, paddingVertical: 4 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.sectionBg,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: Radius.sm,
  },
  chipText: { fontSize: 12, color: Colors.text },

  sectionTitle: { fontSize: 14, fontWeight: '700', color: Colors.text, marginTop: 4 },
  bodyText: { fontSize: 13, color: Colors.textSecondary, lineHeight: 20 },
  readMore: { fontSize: 13, color: Colors.primary, fontWeight: '600', marginTop: 4 },

  locationBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.sectionBg,
    borderRadius: Radius.md,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  locationText: { fontSize: 13, color: Colors.textSecondary, flex: 1 },

  actionRow: { flexDirection: 'row', gap: 10, marginTop: 4 },
  primaryBtn: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.full,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  primaryBtnText: { color: '#fff', fontSize: 14, fontWeight: '600' },
  secondaryBtn: {
    borderWidth: 2,
    borderColor: Colors.primary,
    borderRadius: Radius.full,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  secondaryBtnText: { color: Colors.primary, fontSize: 14, fontWeight: '600' },

  toast: {
    position: 'absolute',
    bottom: 32,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#fffde0',
    borderWidth: 1,
    borderColor: '#e6d96c',
    borderRadius: Radius.full,
    paddingHorizontal: 20,
    paddingVertical: 10,
    ...Shadow.md,
  },
  toastText: { fontSize: 14, color: '#8a7a00', fontWeight: '600' },
});
