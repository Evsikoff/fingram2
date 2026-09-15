import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { GameState, BudgetPlan } from '../types';

const INITIAL_BALANCE = 100;

export const useAppStore = create<GameState>()(
  persist(
    (set, get) => ({
      isFirstLaunch: true,
      pet: null,
      balance: INITIAL_BALANCE,
      savings: 0,
      goals: [
        { id: '1', name: 'Велосипед', targetAmount: 500, currentAmount: 0 },
        { id: '2', name: 'Настольная игра', targetAmount: 200, currentAmount: 0 },
        { id: '3', name: 'Новый телефон', targetAmount: 1000, currentAmount: 0 },
      ],
      currentGoalId: null,
      currentPeriod: 1,
      budgetPlan: null,
      transactions: [],
      tasks: [
        { id: 't1', title: 'Помочь по дому', description: 'Сделать уборку в комнате.', completed: false, reward: 20 },
        { id: 't2', title: 'Сделать уроки', description: 'Выполнить домашнее задание вовремя.', completed: false, reward: 15 },
        { id: 't3', title: 'Прочитать книгу', description: 'Прочитать 10 страниц книги.', completed: false, reward: 10 },
      ],

      setFirstLaunch: (isFirst) => set({ isFirstLaunch: isFirst }),

      createPet: (name, appearance) => set({
        pet: {
          name,
          appearance,
          mood: 100,
          hunger: 100,
          stage: 1,
        },
        isFirstLaunch: false,
      }),

      addBalance: (amount, source) => set((state) => ({
        balance: state.balance + amount,
        transactions: [
          ...state.transactions,
          {
            id: Date.now().toString(),
            amount,
            type: 'income',
            category: 'other',
            description: source,
            period: state.currentPeriod,
          }
        ]
      })),

      spendBalance: (amount, category, description, affectMood = 0, affectHunger = 0) => {
        const state = get();
        if (state.balance < amount) return false;

        set((state) => {
          let newMood = state.pet ? Math.min(100, Math.max(0, state.pet.mood + affectMood)) : 100;
          let newHunger = state.pet ? Math.min(100, Math.max(0, state.pet.hunger + affectHunger)) : 100;

          return {
            balance: state.balance - amount,
            pet: state.pet ? { ...state.pet, mood: newMood, hunger: newHunger } : null,
            transactions: [
              ...state.transactions,
              {
                id: Date.now().toString(),
                amount: -amount,
                type: 'expense',
                category,
                description,
                period: state.currentPeriod,
              }
            ]
          };
        });
        return true;
      },

      setCurrentGoal: (goalId) => set({ currentGoalId: goalId }),

      depositSavings: (amount) => {
        const state = get();
        if (state.balance < amount) return false;

        set((state) => {
          const newGoals = state.goals.map(g =>
            g.id === state.currentGoalId ? { ...g, currentAmount: g.currentAmount + amount } : g
          );

          return {
            balance: state.balance - amount,
            savings: state.savings + amount,
            goals: newGoals,
            transactions: [
              ...state.transactions,
              {
                id: Date.now().toString(),
                amount: -amount, // From balance perspective
                type: 'savings_deposit',
                category: 'savings',
                description: 'Отложено в копилку',
                period: state.currentPeriod,
              }
            ]
          };
        });
        return true;
      },

      withdrawSavings: (amount) => {
        const state = get();
        if (state.savings < amount) return false;

        set((state) => {
           const newGoals = state.goals.map(g =>
            g.id === state.currentGoalId ? { ...g, currentAmount: Math.max(0, g.currentAmount - amount) } : g
          );

          return {
            balance: state.balance + amount,
            savings: state.savings - amount,
            goals: newGoals,
             transactions: [
              ...state.transactions,
              {
                id: Date.now().toString(),
                amount,
                type: 'savings_withdrawal',
                category: 'savings',
                description: 'Взято из копилки',
                period: state.currentPeriod,
              }
            ]
          };
        });
        return true;
      },

      setBudgetPlan: (plan: BudgetPlan) => set({ budgetPlan: plan }),

      completeTask: (taskId) => {
        const state = get();
        const task = state.tasks.find(t => t.id === taskId);
        if (!task || task.completed) return;

        set((state) => ({
          tasks: state.tasks.map(t => t.id === taskId ? { ...t, completed: true } : t),
        }));

        get().addBalance(task.reward, `Задание: ${task.title}`);
      },

      nextPeriod: () => set((state) => {
        // Simple progression logic
        let newStage = state.pet?.stage || 1;

        // Example: Stage up every 3 periods if mood and hunger are good
        if (state.currentPeriod % 3 === 0 && (state.pet?.mood || 0) > 50 && (state.pet?.hunger || 0) > 50) {
           newStage = Math.min(3, newStage + 1);
        }

        return {
          currentPeriod: state.currentPeriod + 1,
          budgetPlan: null, // Reset plan for next period
          pet: state.pet ? {
            ...state.pet,
            stage: newStage,
            // Hunger and mood decrease slightly every period
            hunger: Math.max(0, state.pet.hunger - 20),
            mood: Math.max(0, state.pet.mood - 10),
          } : null,
          // Reset task completion status for the next period, or load new tasks
          tasks: state.tasks.map(t => ({...t, completed: false}))
        };
      }),

      resetProgress: () => set({
        isFirstLaunch: true,
        pet: null,
        balance: INITIAL_BALANCE,
        savings: 0,
        currentGoalId: null,
        currentPeriod: 1,
        budgetPlan: null,
        transactions: [],
        goals: [
          { id: '1', name: 'Велосипед', targetAmount: 500, currentAmount: 0 },
          { id: '2', name: 'Настольная игра', targetAmount: 200, currentAmount: 0 },
          { id: '3', name: 'Новый телефон', targetAmount: 1000, currentAmount: 0 },
        ],
        tasks: [
          { id: 't1', title: 'Помочь по дому', description: 'Сделать уборку в комнате.', completed: false, reward: 20 },
          { id: 't2', title: 'Сделать уроки', description: 'Выполнить домашнее задание вовремя.', completed: false, reward: 15 },
          { id: 't3', title: 'Прочитать книгу', description: 'Прочитать 10 страниц книги.', completed: false, reward: 10 },
        ],
      }),
    }),
    {
      name: 'finny-storage', // name of item in the storage (must be unique)
    }
  )
);
