import AsyncStorage from '@react-native-async-storage/async-storage';
import { FinancialProfile } from '@/types/profile';

const PROFILE_KEY = '@finance_buddy_profile';

export async function saveProfile(profile: FinancialProfile): Promise<void> {
  try {
    await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  } catch (error) {
    console.error('Error saving profile:', error);
  }
}

export async function loadProfile(): Promise<FinancialProfile> {
  try {
    const profile = await AsyncStorage.getItem(PROFILE_KEY);
    return profile ? JSON.parse(profile) : {};
  } catch (error) {
    console.error('Error loading profile:', error);
    return {};
  }
}

export async function updateProfile(updates: Partial<FinancialProfile>): Promise<void> {
  try {
    const currentProfile = await loadProfile();
    const updatedProfile = { ...currentProfile, ...updates };
    await saveProfile(updatedProfile);
  } catch (error) {
    console.error('Error updating profile:', error);
  }
}