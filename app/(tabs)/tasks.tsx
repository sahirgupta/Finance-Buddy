import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  useColorScheme,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TaskItem } from '@/components/tasks/TaskItem';
import { ProgressBar } from '@/components/tasks/ProgressBar';
import { TaskType } from '@/types/tasks';
import { CircleCheck as CheckCircle2 } from 'lucide-react-native';
import { saveTasks, loadTasks } from '@/services/storageService';

const DEFAULT_TASKS: TaskType[] = [
  {
    id: '1',
    title: 'Set aside $5 a week into savings',
    description: 'Small, consistent savings build up over time. Start with just $5 each week.',
    completed: false,
    category: 'Savings'
  },
  {
    id: '2',
    title: 'Pay off your highest interest credit card first',
    description: 'Focus on the card with the highest interest rate to save money long-term.',
    completed: false,
    category: 'Debt'
  },
  {
    id: '3',
    title: 'Review one subscription you can cancel this month',
    description: 'Look through your monthly subscriptions and identify one you can live without.',
    completed: false,
    category: 'Budgeting'
  },
  {
    id: '4',
    title: 'Set up automatic bill payments',
    description: 'Avoid late fees by setting up automatic payments for your recurring bills.',
    completed: false,
    category: 'Organization'
  },
  {
    id: '5',
    title: 'Create a simple monthly budget',
    description: 'Outline your income and expenses to get a clear picture of your finances.',
    completed: false,
    category: 'Budgeting'
  },
];

export default function TasksScreen() {
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  useEffect(() => {
    async function loadStoredTasks() {
      const storedTasks = await loadTasks();
      if (storedTasks.length === 0) {
        setTasks(DEFAULT_TASKS);
        await saveTasks(DEFAULT_TASKS);
      } else {
        setTasks(storedTasks);
      }
      setIsLoading(false);
    }
    loadStoredTasks();
  }, []);

  const completedTasksCount = tasks.filter(task => task.completed).length;
  const completionPercentage = (completedTasksCount / tasks.length) * 100;

  const toggleTaskCompletion = async (id: string) => {
    const updatedTasks = tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
    await saveTasks(updatedTasks);
  };

  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, isDark ? styles.darkContainer : styles.lightContainer]}>
        <ActivityIndicator size="large" color="#0A84FF" />
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, isDark ? styles.darkContainer : styles.lightContainer]}>
      <View style={styles.headerContainer}>
        <Text style={[styles.header, isDark ? styles.darkText : styles.lightText]}>
          Financial Growth Plan
        </Text>
        <Text style={[styles.subheader, isDark ? styles.darkSubtext : styles.lightSubtext]}>
          Complete these tasks to improve your financial health
        </Text>
        
        <View style={styles.progressContainer}>
          <View style={styles.progressTextContainer}>
            <Text style={[styles.progressText, isDark ? styles.darkText : styles.lightText]}>
              {completedTasksCount} of {tasks.length} tasks completed
            </Text>
            <Text style={[styles.progressPercentage, isDark ? styles.darkText : styles.lightText]}>
              {Math.round(completionPercentage)}%
            </Text>
          </View>
          <ProgressBar progress={completionPercentage} />
        </View>
      </View>

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TaskItem
            task={item}
            onToggle={() => toggleTaskCompletion(item.id)}
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
      
      {completedTasksCount === tasks.length && (
        <View style={[styles.congratsContainer, isDark ? styles.darkCongratsContainer : styles.lightCongratsContainer]}>
          <CheckCircle2 size={24} color="#30D158" />
          <Text style={styles.congratsText}>
            Congratulations! You've completed all your financial tasks.
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lightContainer: {
    backgroundColor: '#F2F2F7',
  },
  darkContainer: {
    backgroundColor: '#000000',
  },
  headerContainer: {
    padding: 16,
    marginBottom: 8,
  },
  header: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 24,
    marginBottom: 8,
  },
  lightText: {
    color: '#000000',
  },
  darkText: {
    color: '#FFFFFF',
  },
  subheader: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    marginBottom: 24,
  },
  lightSubtext: {
    color: '#3C3C43',
  },
  darkSubtext: {
    color: '#EBEBF5',
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressTextContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },
  progressPercentage: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
  },
  listContent: {
    padding: 16,
    paddingTop: 0,
  },
  congratsContainer: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  lightCongratsContainer: {
    backgroundColor: '#E3FBE3',
  },
  darkCongratsContainer: {
    backgroundColor: '#0A2F0A',
  },
  congratsText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#30D158',
    marginLeft: 8,
    flex: 1,
  },
});