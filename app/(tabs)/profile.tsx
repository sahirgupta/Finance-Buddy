import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  useColorScheme,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { loadProfile, saveProfile } from '@/services/profileService';
import { FinancialProfile } from '@/types/profile';
import { Pencil, Check, X } from 'lucide-react-native';

export default function ProfileScreen() {
  const [profile, setProfile] = useState<FinancialProfile>({});
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  useEffect(() => {
    loadUserProfile();
  }, []);

  async function loadUserProfile() {
    const userProfile = await loadProfile();
    setProfile(userProfile);
    setIsLoading(false);
  }

  const formatCurrency = (amount?: number) => {
    if (amount === undefined) return 'Not specified';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const startEditing = (field: string, value: any) => {
    setEditingField(field);
    setEditValue(value?.toString() || '');
  };

  const cancelEditing = () => {
    setEditingField(null);
    setEditValue('');
  };

  const saveEdit = async (field: string) => {
    const fieldPath = field.split('.');
    const newProfile = { ...profile };
    let current: any = newProfile;
    
    // Navigate to the nested object
    for (let i = 0; i < fieldPath.length - 1; i++) {
      if (!current[fieldPath[i]]) {
        current[fieldPath[i]] = {};
      }
      current = current[fieldPath[i]];
    }
    
    // Set the value
    const lastField = fieldPath[fieldPath.length - 1];
    if (field.includes('monthly') || field.includes('assets') || field.includes('liabilities')) {
      current[lastField] = parseFloat(editValue) || 0;
    } else if (field === 'age') {
      current[lastField] = parseInt(editValue) || 0;
    } else {
      current[lastField] = editValue;
    }

    await saveProfile(newProfile);
    setProfile(newProfile);
    setEditingField(null);
  };

  const renderEditableField = (label: string, field: string, value: any) => {
    const isEditing = editingField === field;

    return (
      <View style={styles.fieldContainer}>
        <Text style={[styles.label, isDark ? styles.textDark : styles.textLight]}>
          {label}
        </Text>
        <View style={styles.valueContainer}>
          {isEditing ? (
            <View style={styles.editContainer}>
              <TextInput
                style={[
                  styles.input,
                  isDark ? styles.inputDark : styles.inputLight,
                  Platform.OS === 'web' && styles.inputWeb,
                ]}
                value={editValue}
                onChangeText={setEditValue}
                autoFocus
              />
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => saveEdit(field)}
              >
                <Check size={20} color="#30D158" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.editButton}
                onPress={cancelEditing}
              >
                <X size={20} color="#FF453A" />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.valueWrapper}>
              <Text style={[styles.value, isDark ? styles.textDark : styles.textLight]}>
                {field.includes('monthly') || field.includes('assets') || field.includes('liabilities')
                  ? formatCurrency(value)
                  : value || 'Not specified'}
              </Text>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => startEditing(field, value)}
              >
                <Pencil size={16} color={isDark ? '#0A84FF' : '#0A84FF'} />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    );
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
      <ScrollView style={styles.scrollView}>
        <View style={[styles.section, isDark ? styles.sectionDark : styles.sectionLight]}>
          <Text style={[styles.sectionTitle, isDark ? styles.textDark : styles.textLight]}>
            Personal Information
          </Text>
          {renderEditableField('Age', 'age', profile.age)}
          {renderEditableField('Employment Status', 'employmentStatus', profile.employmentStatus)}
          {renderEditableField('Location', 'location', profile.location)}
          {renderEditableField('Marital Status', 'maritalStatus', profile.maritalStatus)}
          {renderEditableField('Dependents', 'dependents', profile.dependents)}
        </View>

        <View style={[styles.section, isDark ? styles.sectionDark : styles.sectionLight]}>
          <Text style={[styles.sectionTitle, isDark ? styles.textDark : styles.textLight]}>
            Income & Expenses
          </Text>
          {renderEditableField('Annual Income', 'income', profile.income)}
          {renderEditableField('Monthly Housing', 'monthlyExpenses.housing', profile.monthlyExpenses?.housing)}
          {renderEditableField('Monthly Food', 'monthlyExpenses.food', profile.monthlyExpenses?.food)}
          {renderEditableField('Monthly Transportation', 'monthlyExpenses.transportation', profile.monthlyExpenses?.transportation)}
          {renderEditableField('Monthly Insurance', 'monthlyExpenses.insurance', profile.monthlyExpenses?.insurance)}
          {renderEditableField('Monthly Entertainment', 'monthlyExpenses.entertainment', profile.monthlyExpenses?.entertainment)}
          {renderEditableField('Monthly Other Expenses', 'monthlyExpenses.other', profile.monthlyExpenses?.other)}
        </View>

        <View style={[styles.section, isDark ? styles.sectionDark : styles.sectionLight]}>
          <Text style={[styles.sectionTitle, isDark ? styles.textDark : styles.textLight]}>
            Assets
          </Text>
          {renderEditableField('Checking & Savings', 'assets.checkingSavings', profile.assets?.checkingSavings)}
          {renderEditableField('Investments', 'assets.investments', profile.assets?.investments)}
          {renderEditableField('Real Estate', 'assets.realEstate', profile.assets?.realEstate)}
          {renderEditableField('Retirement Accounts', 'assets.retirementAccounts', profile.assets?.retirementAccounts)}
        </View>

        <View style={[styles.section, isDark ? styles.sectionDark : styles.sectionLight]}>
          <Text style={[styles.sectionTitle, isDark ? styles.textDark : styles.textLight]}>
            Liabilities
          </Text>
          {renderEditableField('Credit Card Debt', 'liabilities.creditCardDebt', profile.liabilities?.creditCardDebt)}
          {renderEditableField('Student Loans', 'liabilities.studentLoans', profile.liabilities?.studentLoans)}
          {renderEditableField('Mortgage', 'liabilities.mortgage', profile.liabilities?.mortgage)}
          {renderEditableField('Car Loans', 'liabilities.carLoans', profile.liabilities?.carLoans)}
          {renderEditableField('Other Loans', 'liabilities.otherLoans', profile.liabilities?.otherLoans)}
          {renderEditableField('Credit Score Range', 'creditScoreRange', profile.creditScoreRange)}
        </View>

        <View style={[styles.section, isDark ? styles.sectionDark : styles.sectionLight]}>
          <Text style={[styles.sectionTitle, isDark ? styles.textDark : styles.textLight]}>
            Financial Goals
          </Text>
          {renderEditableField('Short Term Goals', 'shortTermGoals', profile.shortTermGoals?.join(', '))}
          {renderEditableField('Long Term Goals', 'longTermGoals', profile.longTermGoals?.join(', '))}
          {renderEditableField('Risk Tolerance', 'riskTolerance', profile.riskTolerance)}
          {renderEditableField('Investment Preferences', 'investmentPreferences', profile.investmentPreferences?.join(', '))}
          {renderEditableField('Planning Horizon', 'planningHorizon', profile.planningHorizon)}
        </View>

        <View style={[styles.section, isDark ? styles.sectionDark : styles.sectionLight]}>
          <Text style={[styles.sectionTitle, isDark ? styles.textDark : styles.textLight]}>
            Preferences
          </Text>
          {renderEditableField('Communication Style', 'communicationStyle', profile.communicationStyle)}
          {renderEditableField('Interest Topics', 'interestTopics', profile.interestTopics?.join(', '))}
          {renderEditableField('Knowledge Level', 'knowledgeLevel', profile.knowledgeLevel)}
        </View>
      </ScrollView>
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
  darkContainer: {
    backgroundColor: '#000000',
  },
  lightContainer: {
    backgroundColor: '#F2F2F7',
  },
  scrollView: {
    padding: 16,
  },
  section: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionLight: {
    backgroundColor: '#FFFFFF',
  },
  sectionDark: {
    backgroundColor: '#1C1C1E',
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 12,
  },
  fieldContainer: {
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    marginBottom: 4,
    opacity: 0.8,
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  valueWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  value: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  editContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 40,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  inputLight: {
    backgroundColor: '#F2F2F7',
    color: '#000000',
  },
  inputDark: {
    backgroundColor: '#2C2C2E',
    color: '#FFFFFF',
  },
  inputWeb: {
    outlineStyle: 'none',
  },
  editButton: {
    padding: 8,
    marginLeft: 8,
  },
  textLight: {
    color: '#000000',
  },
  textDark: {
    color: '#FFFFFF',
  },
});