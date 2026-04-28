import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withDelay,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { Leaf } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import { Colors } from '../theme';
import type { StackScreenProps } from '@react-navigation/stack';
import type { RootStackParamList } from '../types/navigation';

type Props = StackScreenProps<RootStackParamList, 'Splash'>;

const { width } = Dimensions.get('window');

export default function SplashScreen({ navigation }: Props) {
  const logoScale = useSharedValue(0.3);
  const logoOpacity = useSharedValue(0);
  const titleOpacity = useSharedValue(0);
  const titleY = useSharedValue(20);
  const subtitleOpacity = useSharedValue(0);
  const ringScale = useSharedValue(1);
  const ringOpacity = useSharedValue(0);

  const logoStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }],
    opacity: logoOpacity.value,
  }));

  const titleStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ translateY: titleY.value }],
  }));

  const subtitleStyle = useAnimatedStyle(() => ({
    opacity: subtitleOpacity.value,
  }));

  const ringStyle = useAnimatedStyle(() => ({
    transform: [{ scale: ringScale.value }],
    opacity: ringOpacity.value,
  }));

  useEffect(() => {
    logoOpacity.value = withTiming(1, { duration: 500 });
    logoScale.value = withSpring(1, { damping: 14, stiffness: 120 });

    ringOpacity.value = withDelay(
      400,
      withSequence(
        withTiming(0.4, { duration: 600 }),
        withTiming(0, { duration: 600 }),
      ),
    );
    ringScale.value = withDelay(
      400,
      withTiming(1.6, { duration: 1200, easing: Easing.out(Easing.cubic) }),
    );

    titleOpacity.value = withDelay(500, withTiming(1, { duration: 500 }));
    titleY.value = withDelay(500, withSpring(0, { damping: 16 }));
    subtitleOpacity.value = withDelay(800, withTiming(1, { duration: 500 }));

    const timer = setTimeout(() => {
      navigation.replace('Auth');
    }, 2600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="light" backgroundColor="transparent" translucent />
      <View style={styles.center}>
        <View>
          <Animated.View style={[styles.ring, ringStyle]} />
          <Animated.View style={[styles.logoCircle, logoStyle]}>
            <Leaf size={52} color="#fff" strokeWidth={1.75} />
          </Animated.View>
        </View>

        <Animated.Text style={[styles.title, titleStyle]}>ANZAZ</Animated.Text>
        <Animated.Text style={[styles.subtitle, subtitleStyle]}>
          Discover. Capture. Protect Biodiversity.
        </Animated.Text>
      </View>

      <Animated.Text style={[styles.footer, subtitleStyle]}>
        Morocco Biodiversity Initiative
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: {
    alignItems: 'center',
    gap: 16,
  },
  ring: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.5)',
    top: -10,
    left: -10,
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  title: {
    fontSize: 48,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 4,
    marginTop: 8,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.75)',
    letterSpacing: 0.5,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  footer: {
    position: 'absolute',
    bottom: 48,
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)',
    letterSpacing: 1,
  },
});
