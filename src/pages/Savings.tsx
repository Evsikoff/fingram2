import { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { PiggyBank, Target, ArrowRight } from 'lucide-react';

export function Savings() {
  const { balance, savings, goals, currentGoalId, setCurrentGoal, depositSavings, withdrawSavings } = useAppStore();
  const [amount, setAmount] = useState('');
  const [action, setAction] = useState<'deposit' | 'withdraw'>('deposit');
  const [error, setError] = useState('');

  const currentGoal = goals.find(g => g.id === currentGoalId);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === '' || /^\d+$/.test(val)) {
      setAmount(val);
      setError('');
    }
  };

  const handleTransaction = () => {
    const numAmount = parseInt(amount);
    if (!numAmount || numAmount <= 0) {
      setError('Введи сумму');
      return;
    }

    if (action === 'deposit') {
      if (numAmount > balance) {
        setError('Недостаточно средств на балансе');
        return;
      }
      depositSavings(numAmount);
    } else {
      if (numAmount > savings) {
        setError('Недостаточно средств в копилке');
        return;
      }
      withdrawSavings(numAmount);
    }

    setAmount('');
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 text-black p-6">

      {/* Balances Summary */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center">
          <span className="text-gray-500 text-sm font-medium mb-1">Кошелек</span>
          <span className="text-2xl font-bold text-primary">{balance} 🪙</span>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center">
          <span className="text-gray-500 text-sm font-medium mb-1">Копилка</span>
          <span className="text-2xl font-bold text-secondary flex items-center">
            <PiggyBank size={18} className="mr-1" />
            {savings} 🪙
          </span>
        </div>
      </div>

      {/* Goal Section */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 mb-6">
        <h3 className="font-bold text-lg mb-4 flex items-center text-gray-800">
          <Target size={20} className="mr-2 text-primary" />
          Финансовая цель
        </h3>

        {!currentGoal ? (
          <div className="space-y-3">
            <p className="text-sm text-gray-600 mb-2">Выбери, на что хочешь накопить:</p>
            {goals.map(goal => (
              <button
                key={goal.id}
                onClick={() => setCurrentGoal(goal.id)}
                className="w-full flex justify-between items-center p-3 rounded-xl border border-gray-200 hover:border-primary hover:bg-blue-50 transition-colors"
              >
                <span className="font-medium text-gray-800">{goal.name}</span>
                <span className="font-bold text-primary">{goal.targetAmount} 🪙</span>
              </button>
            ))}
          </div>
        ) : (
          <div>
            <div className="flex justify-between items-end mb-2">
              <span className="font-bold text-gray-800">{currentGoal.name}</span>
              <span className="text-sm text-gray-500 font-medium">
                {currentGoal.currentAmount} / {currentGoal.targetAmount} 🪙
              </span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-4 mb-4 overflow-hidden border border-gray-200">
              <div
                className="bg-secondary h-4 transition-all duration-1000 ease-out"
                style={{ width: `${Math.min(100, (currentGoal.currentAmount / currentGoal.targetAmount) * 100)}%` }}
              ></div>
            </div>
            {currentGoal.currentAmount >= currentGoal.targetAmount ? (
               <p className="text-secondary font-bold text-center mb-4">Ура! Цель достигнута! 🎉</p>
            ) : (
               <button
                  onClick={() => setCurrentGoal(null)}
                  className="text-primary text-sm font-medium hover:underline block text-center w-full mb-2"
                >
                  Сменить цель
                </button>
            )}

          </div>
        )}
      </div>

      {/* Transaction Area */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex-1 flex flex-col justify-end">
        <h3 className="font-bold text-gray-800 mb-4">Перевод средств</h3>

        <div className="flex bg-gray-100 p-1 rounded-lg mb-6">
          <button
            onClick={() => setAction('deposit')}
            className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${action === 'deposit' ? 'bg-white text-secondary shadow-sm' : 'text-gray-500'}`}
          >
            Пополнить копилку
          </button>
          <button
            onClick={() => setAction('withdraw')}
             className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${action === 'withdraw' ? 'bg-white text-primary shadow-sm' : 'text-gray-500'}`}
          >
            Взять из копилки
          </button>
        </div>

        <div className="flex items-center mb-6">
          <div className="flex-1 text-center font-medium text-gray-600 text-sm">
            {action === 'deposit' ? 'Кошелек' : 'Копилка'}
          </div>
          <ArrowRight className="text-gray-400 mx-2" />
          <div className="flex-1 text-center font-medium text-gray-600 text-sm">
             {action === 'deposit' ? 'Копилка' : 'Кошелек'}
          </div>
        </div>

        <div className="flex items-center mb-2">
          <input
            type="text"
            inputMode="numeric"
            value={amount}
            onChange={handleAmountChange}
            placeholder="Сумма..."
            className="w-full text-xl font-bold p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-black"
          />
          <span className="ml-3 text-xl">🪙</span>
        </div>

        {error && <p className="text-danger text-sm mb-4 text-center font-medium">{error}</p>}
        {!error && <div className="h-5 mb-4"></div>}

        <button
          onClick={handleTransaction}
          className={`w-full font-bold py-4 px-6 rounded-xl transition-colors text-white ${
            action === 'deposit' ? 'bg-secondary hover:bg-emerald-600' : 'bg-primary hover:bg-blue-600'
          }`}
        >
          {action === 'deposit' ? 'Отложить' : 'Снять'}
        </button>
      </div>

    </div>
  );
}
