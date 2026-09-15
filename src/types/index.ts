export interface Pet {
  name: string;
  appearance: string; // id or URL
  mood: number; // 0-100
  hunger: number; // 0-100
  stage: number; // e.g. 1, 2, 3
}

export interface FinancialGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
}

export interface BudgetPlan {
  mandatory: number;
  nonMandatory: number;
  savings: number;
}

export interface Transaction {
  id: string;
  amount: number;
  type: 'income' | 'expense' | 'savings_deposit' | 'savings_withdrawal';
  category: 'mandatory' | 'non_mandatory' | 'savings' | 'task' | 'other';
  description: string;
  period: number;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  reward: number;
}

export interface GameState {
  isFirstLaunch: boolean;
  pet: Pet | null;
  balance: number;
  savings: number;
  goals: FinancialGoal[];
  currentGoalId: string | null;
  currentPeriod: number;
  budgetPlan: BudgetPlan | null;
  transactions: Transaction[];
  tasks: Task[];

  // Actions
  setFirstLaunch: (isFirst: boolean) => void;
  createPet: (name: string, appearance: string) => void;
  addBalance: (amount: number, source: string) => void;
  spendBalance: (amount: number, category: Transaction['category'], description: string, affectMood?: number, affectHunger?: number) => boolean;
  depositSavings: (amount: number) => boolean;
  withdrawSavings: (amount: number) => boolean;
  setBudgetPlan: (plan: BudgetPlan) => void;
  completeTask: (taskId: string) => void;
  nextPeriod: () => void;
  resetProgress: () => void;
  setCurrentGoal: (goalId: string | null) => void;
}
