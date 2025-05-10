import { useCallback, useEffect, useRef, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform,
  TouchableOpacity,
  ActivityIndicator,
  useColorScheme
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChatMessage } from '@/components/chat/ChatMessage';
import { ChatInput } from '@/components/chat/ChatInput';
import { TypingIndicator } from '@/components/chat/TypingIndicator';
import { getBotResponse } from '@/services/chatService';
import { saveMessages, loadMessages } from '@/services/storageService';
import { MessageType } from '@/types/chat';

export default function ChatScreen() {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const scrollViewRef = useRef<ScrollView>(null);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  useEffect(() => {
    async function loadStoredMessages() {
      const storedMessages = await loadMessages();
      if (storedMessages.length === 0) {
        // Set initial welcome message if no stored messages
        const initialMessage: MessageType = {
          id: '1',
          text: "Hello! I'm your financial buddy. I can help with investments, debt management, budgeting, organization and much more. How can I help you today?",
          sender: 'bot',
          timestamp: new Date(),
        };
        setMessages([initialMessage]);
        await saveMessages([initialMessage]);
      } else {
        setMessages(storedMessages);
      }
      setIsLoading(false);
    }
    loadStoredMessages();
  }, []);

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;
    
    const userMessage: MessageType = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date(),
    };
    
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    await saveMessages(updatedMessages);
    
    setIsTyping(true);
    
    try {
      const botResponse = await getBotResponse(messages, text);
      
      setTimeout(async () => {
        setIsTyping(false);
        
        const botMessage: MessageType = {
          id: (Date.now() + 1).toString(),
          text: botResponse,
          sender: 'bot',
          timestamp: new Date(),
        };
        
        const newMessages = [...updatedMessages, botMessage];
        setMessages(newMessages);
        await saveMessages(newMessages);
      }, 1500);
      
    } catch (error) {
      console.error('Error getting bot response:', error);
      setIsTyping(false);
      
      const errorMessage: MessageType = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, I couldn't process your request. Please try again.",
        sender: 'bot',
        timestamp: new Date(),
        isError: true,
      };
      
      const newMessages = [...updatedMessages, errorMessage];
      setMessages(newMessages);
      await saveMessages(newMessages);
    }
  };
  
  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages, isTyping]);

  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, isDark ? styles.darkContainer : styles.lightContainer]}>
        <ActivityIndicator size="large" color="#0A84FF" />
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, isDark ? styles.darkContainer : styles.lightContainer]}
    edges={['bottom']} // ✅ Avoid top padding
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardAvoidingView}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
      >
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={[styles.messagesContent, { paddingBottom: Platform.OS === 'android' ? 100 : 8 }]}
          showsVerticalScrollIndicator={false}
        >
          {messages.map(message => (
            <ChatMessage key={message.id} message={message} />
          ))}
          
          {isTyping && <TypingIndicator />}
        </ScrollView>

        <ChatInput onSendMessage={handleSendMessage} />
      </KeyboardAvoidingView>
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
  keyboardAvoidingView: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
    padding: 16,
  },
  messagesContent: {
    paddingBottom: 8,
  },
});