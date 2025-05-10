import { useState } from 'react';
//import { useSafeAreaInsets } from 'react-native-safe-area-context'; 
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
  Platform,
  Keyboard,
  KeyboardAvoidingView,
} from 'react-native';
import { Send } from 'lucide-react-native';
import Animated, { useAnimatedStyle, withTiming, useSharedValue } from 'react-native-reanimated';
import { red } from 'react-native-reanimated/lib/typescript/Colors';

interface ChatInputProps {
  onSendMessage: (text: string) => void;
}

export function ChatInput({ onSendMessage }: ChatInputProps) {
  const [text, setText] = useState('');
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const scale = useSharedValue(1);
  //const insets = useSafeAreaInsets(); 

  const handleSend = () => {
    if (text.trim()) {
      const messageToSend = text;
      setText(''); // Clear text immediately
      onSendMessage(messageToSend);
      Keyboard.dismiss();
    }
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const handlePressIn = () => {
    scale.value = withTiming(0.95, { duration: 100 });
  };

  const handlePressOut = () => {
    scale.value = withTiming(1, { duration: 100 });
  };

  return (
    <View style={[styles.container, isDark ? styles.containerDark : styles.containerLight]}>
      <TextInput
        style={[
          styles.input,
          isDark ? styles.inputDark : styles.inputLight,
          Platform.OS === 'web' && styles.inputWeb,
        ]}
        placeholder="Ask your financial question..."
        placeholderTextColor={isDark ? '#8E8E93' : '#8E8E93'}
        value={text}
        onChangeText={setText}
        multiline
        maxLength={500}
        returnKeyType="default"
        blurOnSubmit={false}
      />
      <Animated.View style={animatedStyle}>
        <TouchableOpacity
          style={[
            styles.sendButton,
            !text.trim() && styles.sendButtonDisabled,
          ]}
          onPress={handleSend}
          disabled={!text.trim()}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
        >
          <Send
            size={20}
            color={!text.trim() ? '#8E8E93' : '#FFFFFF'}
          />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
  },
  containerLight: {
    backgroundColor: '#FFFFFF',
    borderTopColor: '#E5E5EA',
  },
  containerDark: {
    backgroundColor: '#1C1C1E',
    borderTopColor: '#38383A',
  },
  input: {
    flex: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    paddingTop: 10,
    fontSize: 16,
    maxHeight: 120,
    fontFamily: 'Inter-Regular',
  },
  inputLight: {
    backgroundColor: '#E5E5EA',
    color: '#000000',
  },
  inputDark: {
    backgroundColor: '#2C2C2E',
    color: '#FFFFFF',
  },
  inputWeb: {
    outlineStyle: 'none',
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#0A84FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  sendButtonDisabled: {
    backgroundColor: '#E5E5EA',
  },
});