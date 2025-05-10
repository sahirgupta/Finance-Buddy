import OpenAI from 'openai';
import { MessageType } from '@/types/chat';
import { loadProfile, updateProfile } from './profileService';
import { FinancialProfile } from '@/types/profile';

const SYSTEM_PROMPT = `You are a knowledgeable and friendly financial advisor. Your goal is to provide clear, actionable advice that helps people improve their financial situation. Always be:
- Professional but approachable
- Clear and specific in your recommendations
- Focused on practical, achievable steps
- Encouraging and supportive
- Honest about financial risks and tradeoffs

Additionally, you should:
1. Analyze the user's messages to identify relevant financial information
2. IMPORTANT: You must respond in JSON format with the following structure:
   {
     "response": "Your regular response to the user's question",
     "profile_updates": {
       // Only include fields that were mentioned or can be reasonably inferred
       // Available fields to update (all are optional):
       // Core Personal & Financial Profile
       "age"?: number,
       "income"?: number,
       "employmentStatus"?: "student" | "full-time" | "part-time" | "unemployed" | "retired",
       "location"?: string,
       "maritalStatus"?: "single" | "married" | "divorced" | "widowed",
       "dependents"?: number,

       // Financial Snapshot
       "assets"?: {
         "checkingSavings"?: number,
         "investments"?: number,
         "realEstate"?: number,
         "retirementAccounts"?: number
       },
       "liabilities"?: {
         "creditCardDebt"?: number,
         "studentLoans"?: number,
         "mortgage"?: number,
         "carLoans"?: number,
         "otherLoans"?: number
       },
       "monthlyExpenses"?: {
         "housing"?: number,
         "food"?: number,
         "transportation"?: number,
         "insurance"?: number,
         "entertainment"?: number,
         "other"?: number
       },
       "creditScoreRange"?: string,

       // Financial Goals & Preferences
       "shortTermGoals"?: string[],
       "longTermGoals"?: string[],
       "riskTolerance"?: "conservative" | "moderate" | "aggressive",
       "investmentPreferences"?: string[],
       "planningHorizon"?: string,

       // Behavioral & Advisory Needs
       "communicationStyle"?: "detailed" | "concise",
       "interestTopics"?: string[],
       "knowledgeLevel"?: "beginner" | "intermediate" | "advanced"
     }
   }

The profile_updates should never be shown to the user, only use it to update their profile internally.`;

let openai: OpenAI | null = null;

const initializeOpenAI = () => {
  const apiKey = process.env.EXPO_PUBLIC_OPENAI_API_KEY;
  if (!apiKey) {
    return null;
  }
  
  return new OpenAI({
    apiKey,
    dangerouslyAllowBrowser: true
  });
};

const getRecentMessages = (messages: MessageType[]): MessageType[] => {
  const sortedMessages = [...messages].sort((a, b) => 
    a.timestamp.getTime() - b.timestamp.getTime()
  );
  return sortedMessages.slice(-10);
};

export async function getBotResponse(messages: MessageType[], newMessage: string): Promise<string> {
  if (!openai) {
    openai = initializeOpenAI();
    if (!openai) {
      return "I apologize, but the service is currently unavailable. Please try again later.";
    }
  }

  try {
    const recentMessages = getRecentMessages(messages);
    const userProfile = await loadProfile();
    
    const conversationHistory = recentMessages.map(msg => ({
      role: msg.sender === 'user' ? 'user' as const : 'assistant' as const,
      content: msg.text
    }));

    console.log('OpenAI Request Messages:', JSON.stringify([
      { 
        role: "system" as const, 
        content: SYSTEM_PROMPT 
      },
      {
        role: "system" as const,
        content: `Current user profile: ${JSON.stringify(userProfile, null, 2)}`
      },
      ...conversationHistory,
      { role: "user" as const, content: newMessage }
    ], null, 2));

    const response = await openai.chat.completions.create({
      model: "gpt-4.1",
      messages: [
        { 
          role: "system" as const, 
          content: SYSTEM_PROMPT 
        },
        {
          role: "system" as const,
          content: `Current user profile: ${JSON.stringify(userProfile, null, 2)}`
        },
        ...conversationHistory,
        { role: "user" as const, content: newMessage }
      ],
      temperature: 0.7,
      max_tokens: 1000,
      response_format: { type: "json_object" }
    });

    const responseContent = response.choices[0]?.message?.content;
    if (!responseContent) {
      return "I apologize, but I couldn't generate a response. Please try again.";
    }
    console.log('OpenAI Response:', responseContent);

    try {
      const parsedResponse = JSON.parse(responseContent);
      
      // Update profile with any new information
      if (parsedResponse.profile_updates) {
        await updateProfile(parsedResponse.profile_updates);
      }

      return parsedResponse.response;
    } catch (parseError) {
      console.error('Error parsing OpenAI response:', parseError);
      return responseContent; // Fallback to raw response if parsing fails
    }

  } catch (error) {
    console.error('OpenAI API Error:', error);
    return "I apologize, but I encountered an error. Please try again later.";
  }
}
