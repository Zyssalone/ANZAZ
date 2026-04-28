import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Platform,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  withSpring,
  withDelay,
  Easing,
  FadeIn,
  FadeInUp,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  X,
  Zap,
  MapPin,
  Leaf,
  PawPrint,
  Bug,
  Grid,
  Image,
  RotateCcw,
} from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { Colors, Radius } from '../theme';

const { width, height } = Dimensions.get('window');
const VIEWFINDER = width - 80;

const FILTERS = [
  { icon: Leaf, label: 'Plants', key: 'plant' },
  { icon: PawPrint, label: 'Animals', key: 'animal' },
  { icon: Bug, label: 'Insects', key: 'insect' },
  { icon: Grid, label: 'All', key: 'all' },
] as const;

export default function CaptureScreen() {
  const navigation = useNavigation<any>();
  const [activeFilter, setActiveFilter] = React.useState<string>('all');
  const [isCapturing, setIsCapturing] = React.useState(false);

  const scanY = useSharedValue(-VIEWFINDER / 2);
  const cornerOpacity = useSharedValue(0.6);
  const bottomY = useSharedValue(100);
  const bottomOpacity = useSharedValue(0);
  const btnScale = useSharedValue(1);
  const captureBtnScale = useSharedValue(1);

  const scanStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: scanY.value }],
  }));

  const cornerStyle = useAnimatedStyle(() => ({
    opacity: cornerOpacity.value,
  }));

  const bottomStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: bottomY.value }],
    opacity: bottomOpacity.value,
  }));

  const captureBtnStyle = useAnimatedStyle(() => ({
    transform: [{ scale: captureBtnScale.value }],
  }));

  useEffect(() => {
    scanY.value = withRepeat(
      withSequence(
        withTiming(VIEWFINDER / 2, { duration: 900, easing: Easing.linear }),
        withTiming(-VIEWFINDER / 2, { duration: 900, easing: Easing.linear }),
      ),
      -1,
    );

    cornerOpacity.value = withRepeat(
      withSequence(
        withTiming(0.85, { duration: 260 }),
        withTiming(0.65, { duration: 260 }),
      ),
      -1,
      true,
    );

    bottomY.value = withDelay(60, withSpring(0, { damping: 28, stiffness: 440, mass: 0.65 }));
    bottomOpacity.value = withDelay(60, withTiming(1, { duration: 120 }));
  }, []);

  const handleCapture = () => {
    if (isCapturing) return;
    setIsCapturing(true);
    captureBtnScale.value = withSequence(
      withSpring(0.92, { damping: 24, stiffness: 560, mass: 0.5 }),
      withSpring(1, { damping: 26, stiffness: 620, mass: 0.5 }),
    );
    setTimeout(() => {
      navigation.navigate('Result', { speciesId: '1' });
      setIsCapturing(false);
    }, 600);
  };

  return (
    <View style={styles.root}>
      <StatusBar style="light" backgroundColor="transparent" translucent />
      <SafeAreaView style={styles.safe} edges={['top']}>
        {/* Top Bar */}
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.topBtn} onPress={() => navigation.goBack()}>
            <X size={22} color="#fff" strokeWidth={2} />
          </TouchableOpacity>
          <View style={styles.gpsChip}>
            <MapPin size={13} color="#4ade80" strokeWidth={2} />
            <Text style={styles.gpsText}>GPS Active</Text>
          </View>
          <TouchableOpacity style={styles.topBtn}>
            <Zap size={22} color="#fff" strokeWidth={2} />
          </TouchableOpacity>
        </View>

        {/* Viewfinder */}
        <View style={styles.viewfinderWrap}>
          {/* Fake camera feed */}
          <View style={styles.fakeFeed} />

          {/* Scan frame */}
          <View style={styles.scanFrame}>
            {/* Corners */}
            <Animated.View style={[styles.corners, cornerStyle]}>
              <View style={[styles.corner, styles.cornerTL]} />
              <View style={[styles.corner, styles.cornerTR]} />
              <View style={[styles.corner, styles.cornerBL]} />
              <View style={[styles.corner, styles.cornerBR]} />
            </Animated.View>

            {/* Scan line */}
            <Animated.View style={[styles.scanLine, scanStyle]} />
          </View>
        </View>

        {/* Hint */}
        <Animated.View entering={FadeIn.delay(120).duration(100)} style={styles.hintRow}>
          <Text style={styles.hintText}>Point at a species to identify</Text>
        </Animated.View>

        {/* Bottom Controls */}
        <Animated.View style={[styles.bottomPanel, bottomStyle]}>
          {/* Filters */}
          <Animated.View entering={FadeInUp.delay(80).duration(110)} style={styles.filterRow}>
            {FILTERS.map(({ icon: Icon, label, key }) => (
              <TouchableOpacity
                key={key}
                style={[
                  styles.filterChip,
                  activeFilter === key && styles.filterChipActive,
                ]}
                onPress={() => setActiveFilter(key)}
                activeOpacity={0.8}
              >
                <Icon
                  size={13}
                  color={activeFilter === key ? '#fff' : 'rgba(255,255,255,0.75)'}
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
          </Animated.View>

          {/* Shutter row */}
          <View style={styles.shutterRow}>
            <TouchableOpacity style={styles.sideBtn}>
              <Image size={22} color="#fff" strokeWidth={1.75} />
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={1}
              onPress={handleCapture}
              style={styles.captureOuter}
            >
              <Animated.View style={[styles.captureInner, captureBtnStyle]} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.sideBtn}>
              <RotateCcw size={22} color="#fff" strokeWidth={1.75} />
            </TouchableOpacity>
          </View>
        </Animated.View>
      </SafeAreaView>
    </View>
  );
}

const CORNER_SIZE = 22;
const CORNER_THICK = 3;

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#111' },
  safe: { flex: 1 },

  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 12 : 4,
    paddingBottom: 12,
  },
  topBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gpsChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(255,255,255,0.12)',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: Radius.full,
  },
  gpsText: { color: '#fff', fontSize: 12, fontWeight: '500' },

  viewfinderWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fakeFeed: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#1a1f1a',
  },
  scanFrame: {
    width: VIEWFINDER,
    height: VIEWFINDER * 0.8,
    position: 'relative',
    overflow: 'hidden',
  },
  corners: { ...StyleSheet.absoluteFillObject },
  corner: {
    position: 'absolute',
    width: CORNER_SIZE,
    height: CORNER_SIZE,
    borderColor: Colors.primary,
  },
  cornerTL: {
    top: 0,
    left: 0,
    borderTopWidth: CORNER_THICK,
    borderLeftWidth: CORNER_THICK,
    borderTopLeftRadius: 4,
  },
  cornerTR: {
    top: 0,
    right: 0,
    borderTopWidth: CORNER_THICK,
    borderRightWidth: CORNER_THICK,
    borderTopRightRadius: 4,
  },
  cornerBL: {
    bottom: 0,
    left: 0,
    borderBottomWidth: CORNER_THICK,
    borderLeftWidth: CORNER_THICK,
    borderBottomLeftRadius: 4,
  },
  cornerBR: {
    bottom: 0,
    right: 0,
    borderBottomWidth: CORNER_THICK,
    borderRightWidth: CORNER_THICK,
    borderBottomRightRadius: 4,
  },
  scanLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOpacity: 0.8,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 0 },
    elevation: 4,
  },

  hintRow: { alignItems: 'center', paddingVertical: 12 },
  hintText: { color: 'rgba(255,255,255,0.5)', fontSize: 13 },

  bottomPanel: {
    paddingBottom: Platform.OS === 'ios' ? 36 : 24,
    paddingHorizontal: 20,
    gap: 20,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: Radius.full,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  filterChipActive: { backgroundColor: Colors.primary },
  filterText: { color: 'rgba(255,255,255,0.75)', fontSize: 12, fontWeight: '500' },
  filterTextActive: { color: '#fff' },

  shutterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 40,
  },
  sideBtn: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureOuter: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 3.5,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.primary,
  },
});
