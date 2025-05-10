export interface FinancialProfile {
  // Core Personal & Financial Profile
  age?: number;
  income?: number;
  employmentStatus?: 'student' | 'full-time' | 'part-time' | 'unemployed' | 'retired';
  location?: string;
  maritalStatus?: 'single' | 'married' | 'divorced' | 'widowed';
  dependents?: number;

  // Financial Snapshot
  assets?: {
    checkingSavings?: number;
    investments?: number;
    realEstate?: number;
    retirementAccounts?: number;
  };
  
  liabilities?: {
    creditCardDebt?: number;
    studentLoans?: number;
    mortgage?: number;
    carLoans?: number;
    otherLoans?: number;
  };
  
  monthlyExpenses?: {
    housing?: number;
    food?: number;
    transportation?: number;
    insurance?: number;
    entertainment?: number;
    other?: number;
  };
  
  creditScoreRange?: string;

  // Financial Goals & Preferences
  shortTermGoals?: string[];
  longTermGoals?: string[];
  riskTolerance?: 'conservative' | 'moderate' | 'aggressive';
  investmentPreferences?: string[];
  planningHorizon?: string;

  // Behavioral & Advisory Needs
  communicationStyle?: 'detailed' | 'concise';
  interestTopics?: string[];
  knowledgeLevel?: 'beginner' | 'intermediate' | 'advanced';
}