import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import {
  Wallet,
  PiggyBank,
  ShoppingCart,
  ClipboardList,
  Settings,
  Heart,
  Utensils
} from 'lucide-react';

export function Main() {
  const navigate = useNavigate();
  const { pet, balance, savings, currentPeriod } = useAppStore();

  if (!pet) return null;

  // Simple emoji mapping based on pet type and stage/mood
  const getPetEmoji = () => {
    const baseEmojis: Record<string, string[]> = {
      cat: ['🐱', '🐈', '😻'],
      dog: ['🐶', '🐕', '🦮'],
      rabbit: ['🐰', '🐇', '🐰✨'],
    };

    const emojiSet = baseEmojis[pet.appearance] || baseEmojis.cat;
    // Show different emoji based on stage or mood
    if (pet.mood < 30) return '😿'; // Generic sad emoji for now

    // Stage 1 -> index 0, Stage 2 -> index 1, etc.
    const stageIndex = Math.min(pet.stage - 1, emojiSet.length - 1);
    return emojiSet[stageIndex];
  };

  return (
    <div className="flex flex-col h-full bg-blue-50 text-black">
      {/* Top Bar */}
      <div className="flex justify-between items-center p-4 bg-white shadow-sm">
        <div className="flex items-center space-x-4">
          <div className="flex items-center text-primary font-bold">
            <Wallet size={20} className="mr-1" />
            <span>{balance} 🪙</span>
          </div>
          <div className="flex items-center text-secondary font-bold">
            <PiggyBank size={20} className="mr-1" />
            <span>{savings} 🪙</span>
          </div>
        </div>
        <button
          onClick={() => navigate('/adult')}
          className="text-gray-400 hover:text-gray-600 p-2"
        >
          <Settings size={24} />
        </button>
      </div>

      {/* Pet Area */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 relative">
        <div className="absolute top-4 right-4 bg-white/80 px-3 py-1 rounded-full text-sm font-medium shadow-sm">
          Период {currentPeriod}
        </div>

        {/* Pet Name & Stage */}
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">{pet.name}</h2>
          <p className="text-sm text-gray-500 font-medium mt-1">Уровень {pet.stage}</p>
        </div>

        {/* The Pet */}
        <div className="text-9xl mb-8 animate-bounce-slow">
          {getPetEmoji()}
        </div>

        {/* Stats Bars */}
        <div className="w-full max-w-xs space-y-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
          <div className="space-y-1">
            <div className="flex justify-between text-sm font-medium">
              <span className="flex items-center text-gray-700"><Heart size={16} className="mr-1 text-red-500" /> Настроение</span>
              <span className="text-gray-500">{pet.mood}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="h-2.5 rounded-full transition-all duration-500" style={{ width: `${pet.mood}%`, backgroundColor: pet.mood > 70 ? '#10b981' : pet.mood > 30 ? '#f59e0b' : '#ef4444' }}></div>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-sm font-medium">
              <span className="flex items-center text-gray-700"><Utensils size={16} className="mr-1 text-orange-500" /> Сытость</span>
              <span className="text-gray-500">{pet.hunger}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="h-2.5 rounded-full transition-all duration-500" style={{ width: `${pet.hunger}%`, backgroundColor: pet.hunger > 70 ? '#10b981' : pet.hunger > 30 ? '#f59e0b' : '#ef4444' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Grid */}
      <div className="bg-white rounded-t-3xl shadow-lg p-6 pb-8">
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => navigate('/budget')}
            className="flex flex-col items-center justify-center p-4 bg-blue-50 hover:bg-blue-100 rounded-2xl transition-colors border border-blue-100"
          >
            <div className="bg-blue-500 text-white p-3 rounded-full mb-2 shadow-sm">
              <Wallet size={24} />
            </div>
            <span className="font-semibold text-gray-800">Бюджет</span>
          </button>

          <button
            onClick={() => navigate('/tasks')}
            className="flex flex-col items-center justify-center p-4 bg-purple-50 hover:bg-purple-100 rounded-2xl transition-colors border border-purple-100"
          >
            <div className="bg-purple-500 text-white p-3 rounded-full mb-2 shadow-sm">
              <ClipboardList size={24} />
            </div>
            <span className="font-semibold text-gray-800">Задания</span>
          </button>

          <button
            onClick={() => navigate('/shop')}
            className="flex flex-col items-center justify-center p-4 bg-orange-50 hover:bg-orange-100 rounded-2xl transition-colors border border-orange-100"
          >
            <div className="bg-orange-500 text-white p-3 rounded-full mb-2 shadow-sm">
              <ShoppingCart size={24} />
            </div>
            <span className="font-semibold text-gray-800">Магазин</span>
          </button>

          <button
            onClick={() => navigate('/savings')}
            className="flex flex-col items-center justify-center p-4 bg-emerald-50 hover:bg-emerald-100 rounded-2xl transition-colors border border-emerald-100"
          >
            <div className="bg-emerald-500 text-white p-3 rounded-full mb-2 shadow-sm">
              <PiggyBank size={24} />
            </div>
            <span className="font-semibold text-gray-800">Копилка</span>
          </button>
        </div>
      </div>
    </div>
  );
}
