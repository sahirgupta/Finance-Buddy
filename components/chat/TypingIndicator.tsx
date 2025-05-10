import { View, StyleSheet, useColorScheme } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withDelay,
  Easing,
  cancelAnimation,
} from 'react-native-reanimated';
import { useEffect } from 'react';

export function TypingIndicator() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const opacity1 = useSharedValue(0.3);
  const opacity2 = useSharedValue(0.3);
  const opacity3 = useSharedValue(0.3);

  const animatedStyle1 = useAnimatedStyle(() => {
    return {
      opacity: opacity1.value,
    };
  });

  const animatedStyle2 = useAnimatedStyle(() => {
    return {
      opacity: opacity2.value,
    };
  });

  const animatedStyle3 = useAnimatedStyle(() => {
    return {
      opacity: opacity3.value,
    };
  });

  useEffect(() => {
    opacity1.value = withRepeat(
      withTiming(1, { duration: 500, easing: Easing.ease }),
      -1,
      true
    );
    
    opacity2.value = withDelay(
      200,
      withRepeat(
        withTiming(1, { duration: 500, easing: Easing.ease }),
        -1,
        true
      )
    );
    
    opacity3.value = withDelay(
      400,
      withRepeat(
        withTiming(1, { duration: 500, easing: Easing.ease }),
        -1,
        true
      )
    );

    return () => {
      cancelAnimation(opacity1);
      cancelAnimation(opacity2);
      cancelAnimation(opacity3);
    };
  }, []);

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.bubble,
          isDark ? styles.bubbleDark : styles.bubbleLight,
        ]}
      >
        <View style={styles.dotsContainer}>
          <Animated.View
            style={[
              styles.dot,
              isDark ? styles.dotDark : styles.dotLight,
              animatedStyle1,
            ]}
          />
          <Animated.View
            style={[
              styles.dot,
              isDark ? styles.dotDark : styles.dotLight,
              animatedStyle2,
            ]}
          />
          <Animated.View
            style={[
              styles.dot,
              isDark ? styles.dotDark : styles.dotLight,
              animatedStyle3,
            ]}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  bubble: {
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomLeftRadius: 4,
    minWidth: 60,
  },
  bubbleLight: {
    backgroundColor: '#E5E5EA',
  },
  bubbleDark: {
    backgroundColor: '#1C1C1E',
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 2,
  },
  dotLight: {
    backgroundColor: '#8E8E93',
  },
  dotDark: {
    backgroundColor: '#8E8E93',
  },
});