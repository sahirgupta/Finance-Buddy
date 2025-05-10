import { View, Text, StyleSheet, useColorScheme } from 'react-native';
import { MessageType } from '@/types/chat';
import { formatMessageTime } from '@/utils/formatters';

interface ChatMessageProps {
  message: MessageType;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const isUserMessage = message.sender === 'user';
  
  return (
    <View
      style={[
        styles.container,
        isUserMessage ? styles.userMessageContainer : styles.botMessageContainer,
      ]}
    >
      <View
        style={[
          styles.bubble,
          isUserMessage
            ? [styles.userBubble, isDark ? styles.userBubbleDark : styles.userBubbleLight]
            : [styles.botBubble, isDark ? styles.botBubbleDark : styles.botBubbleLight],
          message.isError && styles.errorBubble,
        ]}
      >
        <Text
          style={[
            styles.messageText,
            isUserMessage
              ? styles.userMessageText
              : [styles.botMessageText, isDark ? styles.botMessageTextDark : styles.botMessageTextLight],
            message.isError && styles.errorText,
          ]}
        >
          {message.text}
        </Text>
      </View>
      <Text
        style={[
          styles.timestamp,
          isDark ? styles.timestampDark : styles.timestampLight,
        ]}
      >
        {formatMessageTime(message.timestamp)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    maxWidth: '80%',
  },
  userMessageContainer: {
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
  },
  botMessageContainer: {
    alignSelf: 'flex-start',
    alignItems: 'flex-start',
  },
  bubble: {
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginBottom: 4,
  },
  userBubble: {
    borderBottomRightRadius: 4,
  },
  userBubbleLight: {
    backgroundColor: '#0A84FF',
  },
  userBubbleDark: {
    backgroundColor: '#0A84FF',
  },
  botBubble: {
    borderBottomLeftRadius: 4,
  },
  botBubbleLight: {
    backgroundColor: '#E5E5EA',
  },
  botBubbleDark: {
    backgroundColor: '#1C1C1E',
  },
  errorBubble: {
    backgroundColor: '#FF453A',
  },
  messageText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    lineHeight: 22,
  },
  userMessageText: {
    color: '#FFFFFF',
  },
  botMessageText: {
    
  },
  botMessageTextLight: {
    color: '#000000',
  },
  botMessageTextDark: {
    color: '#FFFFFF',
  },
  errorText: {
    color: '#FFFFFF',
  },
  timestamp: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
  },
  timestampLight: {
    color: '#8E8E93',
  },
  timestampDark: {
    color: '#8E8E93',
  },
});