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
  ZoomIn,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  User,
  Sprout,
  Leaf,
  PawPrint,
  Compass,
  Microscope,
  Crown,
  Lock,
  LogOut,
  Trophy,
  Star,
} from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { Colors, Shadow, Radius, Spacing } from '../theme';
import ProgressBar from '../components/ProgressBar';
import {
  CURRENT_USER,
  BADGES,
  LEADERBOARD,
} from '../data/mockData';
import type { Badge, LeaderboardEntry } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';
import { getUserStats, toBadge, toLeaderboardEntry } from '../utils/mappers';

const { width } = Dimensions.get('window');

const BADGE_ICONS: Record<string, React.FC<any>> = {
  Sprout,
  Leaf,
  PawPrint,
  Compass,
  Microscope,
  Crown,
};

const RANK_ICON: Record<number, React.FC<any>> = {
  1: Trophy,
  2: Trophy,
  3: Trophy,
};

const RANK_COLOR: Record<number, string> = {
  1: Colors.gold,
  2: Colors.silver,
  3: Colors.bronze,
};

function BadgeTile({ badge, index }: { badge: typeof BADGES[0]; index: number }) {
  const Icon = BADGE_ICONS[badge.iconName] ?? Leaf;
  return (
    <Animated.View
      entering={ZoomIn.delay(index * 16 + 120).duration(90)}
      style={styles.badgeWrap}
    >
      <View
        style={[
          styles.badgeCircle,
          badge.earned ? styles.badgeEarned : styles.badgeLocked,
        ]}
      >
        {badge.earned ? (
          <Icon size={22} color={Colors.primary} strokeWidth={1.75} />
        ) : (
          <Lock size={18} color={Colors.textLight} strokeWidth={1.75} />
        )}
      </View>
      <Text style={[styles.badgeName, !badge.earned && styles.badgeNameLocked]}>
        {badge.name}
      </Text>
    </Animated.View>
  );
}

export default function ProfileScreen() {
  const navigation = useNavigation<any>();
  const { user, logout, refreshUser } = useAuth();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(LEADERBOARD);
  const [badges, setBadges] = useState<Badge[]>(BADGES);
  const currentUser = user ? getUserStats(user) : CURRENT_USER;

  useEffect(() => {
    refreshUser().catch(() => undefined);
    api.badges.list()
      .then((rows) => setBadges(rows.map(toBadge)))
      .catch(() => setBadges(BADGES));
    api.leaderboard.get()
      .then((rows) => setLeaderboard(rows.map((row) => toLeaderboardEntry(row, user?.id ?? null))))
      .catch(() => setLeaderboard(LEADERBOARD));
  }, [user?.id]);

  const handleLogout = () => {
    logout();
    navigation.reset({ index: 0, routes: [{ name: 'Auth' }] });
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar style="light" backgroundColor="transparent" translucent />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        style={styles.scroll}
      >
        {/* Header Card */}
        <Animated.View entering={FadeInDown.delay(20).duration(100)} style={styles.headerCard}>
          <View style={styles.avatarWrap}>
            <View style={styles.avatar}>
              <User size={32} color="#fff" strokeWidth={2} />
            </View>
          </View>
          <Text style={styles.userName}>{currentUser.name}</Text>
          <Text style={styles.userTitle}>
            {currentUser.title} &bull; Level {currentUser.level}
          </Text>

          <View style={styles.statsRow}>
            {[
              { value: currentUser.speciesCount.toString(), label: 'Species' },
              { value: currentUser.points.toLocaleString(), label: 'Points' },
              { value: currentUser.rank ? `#${currentUser.rank}` : '-', label: 'Rank' },
            ].map((s) => (
              <View key={s.label} style={styles.statItem}>
                <Text style={styles.statValue}>{s.value}</Text>
                <Text style={styles.statLabel}>{s.label}</Text>
              </View>
            ))}
          </View>
        </Animated.View>

        {/* XP Progress */}
        <Animated.View entering={FadeInDown.delay(60).duration(100)} style={styles.xpCard}>
          <View style={styles.xpRow}>
            <Text style={styles.xpLabel}>Level {currentUser.level}</Text>
            <Text style={styles.xpRight}>
              {currentUser.xp} / {currentUser.xpMax} XP to Level {currentUser.level + 1}
            </Text>
          </View>
          <ProgressBar
            progress={currentUser.xp / currentUser.xpMax}
            height={10}
            delay={80}
          />
        </Animated.View>

        {/* Badges */}
        <Animated.View entering={FadeInDown.delay(90).duration(100)} style={styles.section}>
          <Text style={styles.sectionTitle}>Badges</Text>
          <View style={styles.badgeGrid}>
            {badges.map((badge, i) => (
              <BadgeTile key={badge.id} badge={badge} index={i} />
            ))}
          </View>
        </Animated.View>

        {/* Leaderboard */}
        <Animated.View entering={FadeInDown.delay(120).duration(100)} style={styles.section}>
          <Text style={styles.sectionTitle}>Leaderboard</Text>
          <View style={styles.leaderboard}>
            {leaderboard.map((entry, i) => {
              const RankIcon = RANK_ICON[entry.rank] ?? Star;
              const rankColor = RANK_COLOR[entry.rank] ?? Colors.primary;
              return (
                <Animated.View
                  key={entry.id}
                  entering={FadeInDown.delay(140 + i * 18).duration(90)}
                  style={[
                    styles.leaderRow,
                    entry.isCurrentUser && styles.leaderRowActive,
                  ]}
                >
                  <View style={styles.rankWrap}>
                    {entry.rank <= 3 ? (
                      <RankIcon size={18} color={rankColor} strokeWidth={2} />
                    ) : (
                      <Text style={styles.rankText}>{entry.rank}</Text>
                    )}
                  </View>

                  <View style={styles.leaderAvatar}>
                    <Text style={styles.leaderAvatarText}>{entry.avatar}</Text>
                  </View>

                  <Text
                    style={[
                      styles.leaderName,
                      entry.isCurrentUser && styles.leaderNameActive,
                    ]}
                  >
                    {entry.name}{entry.isCurrentUser ? ' (You)' : ''}
                  </Text>

                  <Text style={styles.leaderPoints}>
                    {entry.points.toLocaleString()} pts
                  </Text>
                </Animated.View>
              );
            })}
          </View>
        </Animated.View>

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.85}>
          <LogOut size={17} color="#c0392b" strokeWidth={2} />
          <Text style={styles.logoutText}>Log out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.primary },
  scroll: { flex: 1, backgroundColor: Colors.background },
  content: { paddingBottom: 48 },

  headerCard: {
    backgroundColor: Colors.primary,
    alignItems: 'center',
    paddingTop: 28,
    paddingBottom: 28,
    paddingHorizontal: Spacing.md,
    gap: 6,
  },
  logoutBtn: {
    marginHorizontal: Spacing.md,
    marginTop: 20,
    height: 48,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: '#f0c8c8',
    backgroundColor: '#fff5f5',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  logoutText: { color: '#c0392b', fontSize: 14, fontWeight: '700' },
  avatarWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.5)',
    marginBottom: 4,
  },
  avatar: { width: 60, height: 60, borderRadius: 30, alignItems: 'center', justifyContent: 'center' },
  userName: { fontSize: 20, fontWeight: '700', color: '#fff' },
  userTitle: { fontSize: 12, color: 'rgba(255,255,255,0.75)' },
  statsRow: { flexDirection: 'row', gap: 32, marginTop: 12 },
  statItem: { alignItems: 'center' },
  statValue: { fontSize: 22, fontWeight: '700', color: '#fff' },
  statLabel: { fontSize: 10, color: 'rgba(255,255,255,0.7)', marginTop: 2 },

  xpCard: {
    backgroundColor: '#fff',
    marginHorizontal: Spacing.md,
    marginTop: 16,
    borderRadius: Radius.md,
    padding: 16,
    gap: 10,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...Shadow.sm,
  },
  xpRow: { flexDirection: 'row', justifyContent: 'space-between' },
  xpLabel: { fontSize: 12, fontWeight: '600', color: Colors.text },
  xpRight: { fontSize: 11, color: Colors.textMuted },

  section: { marginTop: 20, paddingHorizontal: Spacing.md },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: Colors.text, marginBottom: 14 },

  badgeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16 },
  badgeWrap: { alignItems: 'center', width: 64, gap: 6 },
  badgeCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeEarned: {
    backgroundColor: Colors.primaryLight,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  badgeLocked: {
    backgroundColor: '#f0f0f0',
    borderWidth: 2,
    borderColor: Colors.borderLight,
    opacity: 0.55,
  },
  badgeName: { fontSize: 9, fontWeight: '600', color: Colors.text, textAlign: 'center' },
  badgeNameLocked: { color: Colors.textMuted },

  leaderboard: { gap: 6 },
  leaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#fff',
    borderRadius: Radius.md,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  leaderRowActive: {
    backgroundColor: Colors.sectionBg,
    borderColor: Colors.primary,
    borderWidth: 1.5,
  },
  rankWrap: { width: 28, alignItems: 'center' },
  rankText: { fontSize: 14, fontWeight: '700', color: Colors.textMuted },
  leaderAvatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  leaderAvatarText: { fontSize: 14, fontWeight: '700', color: Colors.primary },
  leaderName: { flex: 1, fontSize: 13, color: Colors.text },
  leaderNameActive: { fontWeight: '700', color: Colors.primary },
  leaderPoints: { fontSize: 12, fontWeight: '600', color: Colors.primary },
});
