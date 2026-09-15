import { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { ShoppingBag, Utensils, Heart } from 'lucide-react';

interface ShopItem {
  id: string;
  name: string;
  price: number;
  category: 'mandatory' | 'non_mandatory';
  emoji: string;
  affectMood: number;
  affectHunger: number;
  description: string;
}

const SHOP_ITEMS: ShopItem[] = [
  { id: 'food1', name: 'Обычный корм', price: 20, category: 'mandatory', emoji: '🥫', affectMood: 5, affectHunger: 30, description: 'Базовая еда. Обязательный расход.' },
  { id: 'food2', name: 'Вкусняшка', price: 15, category: 'non_mandatory', emoji: '🍖', affectMood: 20, affectHunger: 10, description: 'Поднимет настроение!' },
  { id: 'toy1', name: 'Мячик', price: 30, category: 'non_mandatory', emoji: '🎾', affectMood: 30, affectHunger: -5, description: 'Питомец будет счастлив играть.' },
  { id: 'meds', name: 'Витамины', price: 40, category: 'mandatory', emoji: '💊', affectMood: 0, affectHunger: 0, description: 'Нужны для здоровья. Обязательный расход.' },
];

export function Shop() {
  const { balance, spendBalance } = useAppStore();
  const [selectedItem, setSelectedItem] = useState<ShopItem | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleBuy = (item: ShopItem) => {
    if (balance < item.price) {
      setError('Не хватает монет!');
      setSuccess('');
      return;
    }

    // Additional check based on budget plan could be added here
    // For this prototype, we just rely on total balance

    const success = spendBalance(
      item.price,
      item.category,
      `Покупка: ${item.name}`,
      item.affectMood,
      item.affectHunger
    );

    if (success) {
      setSuccess(`Ты купил(а) ${item.name}!`);
      setError('');
      setSelectedItem(null);

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } else {
      setError('Ошибка при покупке');
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 text-black p-6">
      <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <span className="font-bold text-gray-700">Твой баланс:</span>
        <span className="font-bold text-xl text-primary">{balance} 🪙</span>
      </div>

      {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-center text-sm font-medium">{error}</div>}
      {success && <div className="bg-green-50 text-green-600 p-3 rounded-lg mb-4 text-center text-sm font-medium">{success}</div>}

      <div className="grid grid-cols-2 gap-4">
        {SHOP_ITEMS.map((item) => (
          <div
            key={item.id}
            onClick={() => {
              setSelectedItem(item);
              setError('');
              setSuccess('');
            }}
            className={`bg-white rounded-xl shadow-sm border p-4 flex flex-col items-center cursor-pointer transition-all ${
              selectedItem?.id === item.id ? 'border-primary ring-2 ring-primary/20' : 'border-gray-200 hover:border-primary/50'
            }`}
          >
            <span className="text-4xl mb-2">{item.emoji}</span>
            <span className="font-bold text-sm text-center mb-1 h-10 flex items-center">{item.name}</span>
            <span className="text-primary font-bold">{item.price} 🪙</span>
          </div>
        ))}
      </div>

      {/* Purchase Modal / Details Area */}
      {selectedItem && (
        <div className="mt-6 bg-white p-5 rounded-2xl shadow-lg border border-gray-100 animate-in fade-in slide-in-from-bottom-4">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="font-bold text-lg flex items-center">
                <span className="text-2xl mr-2">{selectedItem.emoji}</span> {selectedItem.name}
              </h3>
              <span className={`text-xs px-2 py-1 rounded-full mt-2 inline-block font-medium ${
                selectedItem.category === 'mandatory' ? 'bg-orange-100 text-orange-700' : 'bg-purple-100 text-purple-700'
              }`}>
                {selectedItem.category === 'mandatory' ? 'Обязательный расход' : 'Желаемый расход'}
              </span>
            </div>
            <span className="font-bold text-xl text-primary">{selectedItem.price} 🪙</span>
          </div>

          <p className="text-gray-600 text-sm mb-4">{selectedItem.description}</p>

          <div className="flex space-x-4 mb-6 text-sm font-medium">
            {selectedItem.affectHunger !== 0 && (
              <div className="flex items-center text-orange-500">
                <Utensils size={16} className="mr-1" />
                {selectedItem.affectHunger > 0 ? '+' : ''}{selectedItem.affectHunger} Сытость
              </div>
            )}
            {selectedItem.affectMood !== 0 && (
              <div className="flex items-center text-red-500">
                <Heart size={16} className="mr-1" />
                {selectedItem.affectMood > 0 ? '+' : ''}{selectedItem.affectMood} Настроение
              </div>
            )}
          </div>

          <div className="flex space-x-3">
            <button
              onClick={() => setSelectedItem(null)}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 px-4 rounded-xl transition-colors"
            >
              Отмена
            </button>
            <button
              onClick={() => handleBuy(selectedItem)}
              disabled={balance < selectedItem.price}
              className={`flex-1 font-bold py-3 px-4 rounded-xl transition-colors flex items-center justify-center ${
                balance < selectedItem.price
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-primary hover:bg-blue-600 text-white'
              }`}
            >
              <ShoppingBag size={18} className="mr-2" />
              Купить
            </button>
          </div>
          {balance < selectedItem.price && (
            <p className="text-danger text-xs text-center mt-2">Не хватает {selectedItem.price - balance} 🪙</p>
          )}
        </div>
      )}
    </div>
  );
}
