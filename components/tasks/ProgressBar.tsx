import { View, StyleSheet, useColorScheme } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withTiming,
  useSharedValue,
  Easing,
} from 'react-native-reanimated';
import { useEffect } from 'react';

interface ProgressBarProps {
  progress: number;
}

export function ProgressBar({ progress }: ProgressBarProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const width = useSharedValue(0);

  useEffect(() => {
    width.value = withTiming(progress, {
      duration: 800,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    });
  }, [progress]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: `${Math.min(width.value, 100)}%`,
    };
  });

  const getProgressColor = (value: number) => {
    if (value === 100) return '#30D158'; // Green when complete
    if (value >= 60) return '#5E5CE6'; // Purple for good progress
    if (value >= 30) return '#0A84FF'; // Blue for some progress
    return '#FF9F0A'; // Orange for little progress
  };

  return (
    <View style={[styles.container, isDark ? styles.containerDark : styles.containerLight]}>
      <Animated.View
        style={[
          styles.progress,
          animatedStyle,
          { backgroundColor: getProgressColor(progress) },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    width: '100%',
  },
  containerLight: {
    backgroundColor: '#E5E5EA',
  },
  containerDark: {
    backgroundColor: '#2C2C2E',
  },
  progress: {
    height: '100%',
    borderRadius: 4,
  },
});