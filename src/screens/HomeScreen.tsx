import React, { useEffect, useRef } from 'react';
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
  withTiming,
  withDelay,
  withRepeat,
  withSequence,
  FadeInDown,
  FadeInRight,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Bell,
  Camera,
  TreePine,
  Leaf,
  PawPrint,
  Bug,
  Bird,
  Trophy,
  Globe,
  ShieldAlert,
  Flower,
} from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';

import { Colors, Shadow, Radius, Spacing } from '../theme';
import ProgressBar from '../components/ProgressBar';
import { CURRENT_USER, SPECIES_DATA, CHALLENGES } from '../data/mockData';

const { width } = Dimensions.get('window');

const CATEGORY_ICON: Record<string, React.FC<any>> = {
  plant: TreePine,
  animal: PawPrint,
  insect: Bug,
  bird: Bird,
  fungi: Leaf,
};

const CHALLENGE_ICON: Record<string, React.FC<any>> = {
  Trophy,
  Globe,
  ShieldAlert,
};

export default function HomeScreen() {
  const navigation = useNavigation<any>();

  const headerOpacity = useSharedValue(0);
  const headerY = useSharedValue(-20);
  const pulseScale = useSharedValue(1);
  const pulseOpacity = useSharedValue(0.6);

  const headerStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
    transform: [{ translateY: headerY.value }],
  }));

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
    opacity: pulseOpacity.value,
  }));

  useEffect(() => {
    headerOpacity.value = withTiming(1, { duration: 500 });
    headerY.value = withSpring(0, { damping: 16 });

    pulseScale.value = withRepeat(
      withSequence(
        withTiming(1.4, { duration: 900 }),
        withTiming(1, { duration: 900 }),
      ),
      -1,
    );
    pulseOpacity.value = withRepeat(
      withSequence(
        withTiming(0.25, { duration: 900 }),
        withTiming(0.6, { duration: 900 }),
      ),
      -1,
    );
  }, []);

  const recentSpecies = SPECIES_DATA.slice(0, 6);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar style="light" backgroundColor="transparent" translucent />
      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Header */}
        <Animated.View style={[styles.header, headerStyle]}>
          <View>
            <Text style={styles.greeting}>Hello, {CURRENT_USER.name.split(' ')[0]}!</Text>
            <Text style={styles.subGreeting}>What will you discover today?</Text>
          </View>
          <TouchableOpacity style={styles.bellBtn}>
            <Bell size={20} color="#fff" strokeWidth={1.75} />
          </TouchableOpacity>
        </Animated.View>

        {/* Stats Row */}
        <Animated.View entering={FadeInDown.delay(200).springify()} style={styles.statsRow}>
          {[
            { value: CURRENT_USER.speciesCount.toString(), label: 'Species' },
            { value: CURRENT_USER.points.toLocaleString(), label: 'Points' },
            { value: `#${CURRENT_USER.rank}`, label: 'Rank' },
          ].map((s) => (
            <View key={s.label} style={styles.statItem}>
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </Animated.View>

        {/* Capture CTA */}
        <Animated.View
          entering={FadeInDown.delay(300).springify()}
          style={styles.captureSection}
        >
          <TouchableOpacity
            style={styles.captureWrap}
            onPress={() => navigation.navigate('Capture')}
            activeOpacity={0.85}
          >
            <Animated.View style={[styles.captureRing, pulseStyle]} />
            <View style={[styles.captureBtn, Shadow.primary]}>
              <Camera size={36} color="#fff" strokeWidth={2} />
            </View>
          </TouchableOpacity>
          <Text style={styles.captureHint}>Tap to Capture</Text>
        </Animated.View>

        {/* Recent Discoveries */}
        <Animated.View entering={FadeInDown.delay(350).springify()}>
          <Text style={styles.sectionTitle}>Recent Discoveries Nearby</Text>
        </Animated.View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.cardsScroll}
        >
          {recentSpecies.map((sp, i) => {
            const Icon = CATEGORY_ICON[sp.category] ?? Leaf;
            return (
              <Animated.View
                key={sp.id}
                entering={FadeInRight.delay(400 + i * 60).springify()}
              >
                <TouchableOpacity
                  style={[styles.card, Shadow.sm]}
                  activeOpacity={0.8}
                  onPress={() => navigation.navigate('SpeciesDetail', { speciesId: sp.id })}
                >
                  <View style={[styles.cardIcon, { backgroundColor: sp.iconColor + '18' }]}>
                    <Icon size={32} color={sp.iconColor} strokeWidth={1.75} />
                  </View>
                  <Text style={styles.cardName} numberOfLines={1}>{sp.commonName}</Text>
                  <Text style={styles.cardDist}>{sp.distance} away</Text>
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </ScrollView>

        {/* Challenges */}
        <Animated.View entering={FadeInDown.delay(500).springify()}>
          <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Active Challenges</Text>
          {CHALLENGES.map((ch, i) => {
            const Icon = CHALLENGE_ICON[ch.iconName] ?? Trophy;
            return (
              <Animated.View
                key={ch.id}
                entering={FadeInDown.delay(560 + i * 80).springify()}
                style={[styles.challengeCard, Shadow.sm, { backgroundColor: ch.bgColor }]}
              >
                <View style={styles.challengeTop}>
                  <Icon size={16} color={ch.iconColor} strokeWidth={2} />
                  <Text style={styles.challengeText}>{ch.title}</Text>
                </View>
                <View style={styles.challengeBottom}>
                  <ProgressBar
                    progress={ch.progress / ch.total}
                    delay={600 + i * 80}
                  />
                  <Text style={styles.challengeProgress}>
                    {ch.progress}/{ch.total}
                  </Text>
                </View>
              </Animated.View>
            );
          })}
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.primary },
  scroll: { flex: 1, backgroundColor: Colors.background },
  content: { paddingBottom: 32 },

  header: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.md,
    paddingTop: 8,
    paddingBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  greeting: { fontSize: 22, fontWeight: '700', color: '#fff' },
  subGreeting: { fontSize: 13, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
  bellBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: Colors.sectionBg,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  statItem: { alignItems: 'center' },
  statValue: { fontSize: 24, fontWeight: '700', color: Colors.primary },
  statLabel: { fontSize: 11, color: Colors.textMuted, marginTop: 2 },

  captureSection: { alignItems: 'center', paddingVertical: 28 },
  captureWrap: { width: 100, height: 100, alignItems: 'center', justifyContent: 'center' },
  captureRing: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.primary,
  },
  captureBtn: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureHint: { fontSize: 12, color: Colors.textMuted, marginTop: 10 },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
    paddingHorizontal: Spacing.md,
    marginBottom: 12,
  },

  cardsScroll: { paddingHorizontal: Spacing.md, gap: 10 },
  card: {
    width: 120,
    backgroundColor: Colors.cardBg,
    borderRadius: Radius.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  cardIcon: {
    height: 78,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardName: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text,
    paddingHorizontal: 8,
    paddingTop: 8,
  },
  cardDist: {
    fontSize: 10,
    color: Colors.textMuted,
    paddingHorizontal: 8,
    paddingBottom: 10,
    marginTop: 2,
  },

  challengeCard: {
    marginHorizontal: Spacing.md,
    marginBottom: 10,
    borderRadius: Radius.md,
    padding: 14,
    gap: 10,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  challengeTop: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  challengeText: { fontSize: 13, color: Colors.text, flex: 1 },
  challengeBottom: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  challengeProgress: { fontSize: 12, color: Colors.textMuted, width: 30, textAlign: 'right' },
});
