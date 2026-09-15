import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';

export function Budget() {
  const navigate = useNavigate();
  const { balance, budgetPlan, setBudgetPlan } = useAppStore();

  const [mandatory, setMandatory] = useState(budgetPlan?.mandatory.toString() || '0');
  const [nonMandatory, setNonMandatory] = useState(budgetPlan?.nonMandatory.toString() || '0');
  const [savings, setSavings] = useState(budgetPlan?.savings.toString() || '0');

  const [error, setError] = useState('');

  const numMandatory = parseInt(mandatory) || 0;
  const numNonMandatory = parseInt(nonMandatory) || 0;
  const numSavings = parseInt(savings) || 0;

  const totalAllocated = numMandatory + numNonMandatory + numSavings;
  const remaining = balance - totalAllocated;

  useEffect(() => {
    if (totalAllocated > balance) {
      setError('Сумма плана превышает доступный бюджет!');
    } else {
      setError('');
    }
  }, [totalAllocated, balance]);

  const handleSave = () => {
    if (totalAllocated > balance) {
      setError('Нельзя распределить больше, чем есть!');
      return;
    }

    setBudgetPlan({
      mandatory: numMandatory,
      nonMandatory: numNonMandatory,
      savings: numSavings
    });

    navigate(-1);
  };

  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<string>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    // Allow empty string for backspace, but prevent non-numeric
    if (val === '' || /^\d+$/.test(val)) {
      setter(val);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 text-black p-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm mb-6 text-center border border-gray-100">
        <h2 className="text-gray-600 font-medium mb-1">Доступно для плана</h2>
        <div className="text-4xl font-bold text-primary flex items-center justify-center">
          {balance} <span className="text-2xl ml-2">🪙</span>
        </div>
      </div>

      <div className="space-y-4 mb-8 flex-1">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <label className="block text-gray-800 font-semibold mb-2">Обязательные расходы</label>
          <p className="text-sm text-gray-500 mb-3">Например: еда для питомца, лечение</p>
          <div className="flex items-center">
            <input
              type="text"
              inputMode="numeric"
              value={mandatory}
              onChange={handleInputChange(setMandatory)}
              className="w-full text-xl font-bold p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-black"
            />
            <span className="ml-3 text-xl">🪙</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <label className="block text-gray-800 font-semibold mb-2">Желаемые расходы</label>
          <p className="text-sm text-gray-500 mb-3">Например: игрушки, украшения</p>
          <div className="flex items-center">
            <input
              type="text"
              inputMode="numeric"
              value={nonMandatory}
              onChange={handleInputChange(setNonMandatory)}
              className="w-full text-xl font-bold p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-black"
            />
            <span className="ml-3 text-xl">🪙</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <label className="block text-gray-800 font-semibold mb-2">В копилку</label>
          <p className="text-sm text-gray-500 mb-3">Отложить на финансовую цель</p>
          <div className="flex items-center">
            <input
              type="text"
              inputMode="numeric"
              value={savings}
              onChange={handleInputChange(setSavings)}
              className="w-full text-xl font-bold p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-black"
            />
            <span className="ml-3 text-xl">🪙</span>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-t-2xl shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] border-t border-gray-100 sticky bottom-0 -mx-6 -mb-6">
        <div className="flex justify-between items-center mb-4">
          <span className="text-gray-600 font-medium">Остаток нераспределенных:</span>
          <span className={`text-xl font-bold ${remaining < 0 ? 'text-danger' : 'text-primary'}`}>
            {remaining} 🪙
          </span>
        </div>

        {error && <p className="text-danger text-sm mb-3 font-medium text-center">{error}</p>}

        <button
          onClick={handleSave}
          disabled={totalAllocated > balance}
          className={`w-full font-bold py-4 px-6 rounded-xl transition-colors ${
            totalAllocated > balance
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-primary hover:bg-blue-600 text-white shadow-md'
          }`}
        >
          {budgetPlan ? 'Обновить план' : 'Утвердить план'}
        </button>
      </div>
    </div>
  );
}
