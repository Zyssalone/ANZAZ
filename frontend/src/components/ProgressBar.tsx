import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { Colors } from '../theme';

interface Props {
  progress: number;
  height?: number;
  color?: string;
  bgColor?: string;
  delay?: number;
}

export default function ProgressBar({
  progress,
  height = 8,
  color = Colors.primary,
  bgColor = Colors.borderLight,
  delay = 300,
}: Props) {
  const width = useSharedValue(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      width.value = withTiming(Math.min(Math.max(progress, 0), 1), {
        duration: 220,
        easing: Easing.out(Easing.cubic),
      });
    }, delay);
    return () => clearTimeout(timer);
  }, [progress]);

  const animStyle = useAnimatedStyle(() => ({
    width: `${width.value * 100}%`,
  }));

  return (
    <View style={[styles.track, { height, backgroundColor: bgColor, borderRadius: height / 2 }]}>
      <Animated.View style={[styles.fill, { height, backgroundColor: color, borderRadius: height / 2 }, animStyle]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: { overflow: 'hidden', width: '100%' },
  fill: {},
});
