export interface TaskType {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  category: 'Savings' | 'Debt' | 'Budgeting' | 'Organization' | 'Investment';
}