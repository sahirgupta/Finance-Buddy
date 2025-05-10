import { StyleSheet, Text, View, TouchableOpacity, useColorScheme } from 'react-native';
import { TaskType } from '@/types/tasks';
import { CircleCheck as CheckCircle, Circle } from 'lucide-react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withSequence,
  Easing
} from 'react-native-reanimated';

interface TaskItemProps {
  task: TaskType;
  onToggle: () => void;
}

export function TaskItem({ task, onToggle }: TaskItemProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const scale = useSharedValue(1);
  
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Savings':
        return '#30D158'; // Green
      case 'Debt':
        return '#FF9F0A'; // Orange
      case 'Budgeting':
        return '#5E5CE6'; // Purple
      case 'Organization':
        return '#0A84FF'; // Blue
      case 'Investment':
        return '#FF375F'; // Red
      default:
        return '#8E8E93'; // Gray
    }
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const handlePress = () => {
    scale.value = withSequence(
      withTiming(0.95, { duration: 100 }),
      withTiming(1.05, { duration: 100 }),
      withTiming(1, { duration: 100 })
    );
    onToggle();
  };

  return (
    <Animated.View style={[animatedStyle]}>
      <TouchableOpacity
        style={[
          styles.container,
          isDark ? styles.containerDark : styles.containerLight,
          task.completed && styles.completedContainer,
        ]}
        onPress={handlePress}
        activeOpacity={0.7}
      >
        <View style={styles.leftContent}>
          {task.completed ? (
            <CheckCircle color="#30D158" size={24} />
          ) : (
            <Circle color={getCategoryColor(task.category)} size={24} />
          )}
        </View>
        <View style={styles.centerContent}>
          <Text
            style={[
              styles.title,
              isDark ? styles.titleDark : styles.titleLight,
              task.completed && styles.completedTitle,
            ]}
          >
            {task.title}
          </Text>
          <Text
            style={[
              styles.description,
              isDark ? styles.descriptionDark : styles.descriptionLight,
              task.completed && styles.completedDescription,
            ]}
          >
            {task.description}
          </Text>
          <View style={styles.categoryContainer}>
            <View
              style={[
                styles.categoryBadge,
                { backgroundColor: getCategoryColor(task.category) + '20' },
              ]}
            >
              <Text
                style={[
                  styles.categoryText,
                  { color: getCategoryColor(task.category) },
                ]}
              >
                {task.category}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: 12,
    marginBottom: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  containerLight: {
    backgroundColor: '#FFFFFF',
  },
  containerDark: {
    backgroundColor: '#1C1C1E',
  },
  completedContainer: {
    opacity: 0.8,
  },
  leftContent: {
    marginRight: 16,
    justifyContent: 'center',
  },
  centerContent: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    marginBottom: 4,
  },
  titleLight: {
    color: '#000000',
  },
  titleDark: {
    color: '#FFFFFF',
  },
  completedTitle: {
    textDecorationLine: 'line-through',
    opacity: 0.7,
  },
  description: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginBottom: 8,
  },
  descriptionLight: {
    color: '#3C3C43',
  },
  descriptionDark: {
    color: '#EBEBF5',
  },
  completedDescription: {
    opacity: 0.7,
  },
  categoryContainer: {
    flexDirection: 'row',
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  categoryText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
});