import AsyncStorage from '@react-native-async-storage/async-storage';
import { MessageType } from '@/types/chat';
import { TaskType } from '@/types/tasks';

const MESSAGES_KEY = '@finance_buddy_messages';
const TASKS_KEY = '@finance_buddy_tasks';

export async function saveMessages(messages: MessageType[]): Promise<void> {
  try {
    // Convert Date objects to ISO strings for storage
    const messagesToStore = messages.map(msg => ({
      ...msg,
      timestamp: msg.timestamp.toISOString()
    }));
    await AsyncStorage.setItem(MESSAGES_KEY, JSON.stringify(messagesToStore));
  } catch (error) {
    console.error('Error saving messages:', error);
  }
}

export async function loadMessages(): Promise<MessageType[]> {
  try {
    const messages = await AsyncStorage.getItem(MESSAGES_KEY);
    if (messages) {
      // Convert ISO strings back to Date objects
      return JSON.parse(messages).map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      }));
    }
    return [];
  } catch (error) {
    console.error('Error loading messages:', error);
    return [];
  }
}

export async function saveTasks(tasks: TaskType[]): Promise<void> {
  try {
    await AsyncStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error('Error saving tasks:', error);
  }
}

export async function loadTasks(): Promise<TaskType[]> {
  try {
    const tasks = await AsyncStorage.getItem(TASKS_KEY);
    if (tasks) {
      return JSON.parse(tasks);
    }
    return [];
  } catch (error) {
    console.error('Error loading tasks:', error);
    return [];
  }
}