import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { Trash2, FastForward, Info } from 'lucide-react';

export function AdultSection() {
  const navigate = useNavigate();
  const { currentPeriod, nextPeriod, resetProgress } = useAppStore();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [mathProblem, setMathProblem] = useState({ a: 0, b: 0, answer: 0 });
  const [userAnswer, setUserAnswer] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    generateProblem();
  }, []);

  const generateProblem = () => {
    const a = Math.floor(Math.random() * 8) + 5; // 5-12
    const b = Math.floor(Math.random() * 8) + 5; // 5-12
    setMathProblem({ a, b, answer: a * b });
    setUserAnswer('');
    setError('');
  };

  const handleAuth = () => {
    if (parseInt(userAnswer) === mathProblem.answer) {
      setIsAuthenticated(true);
    } else {
      setError('Неверно. Попробуйте еще раз.');
      generateProblem();
    }
  };

  const handleNextPeriod = () => {
    if (confirm('Перейти к следующему периоду? Это обновит состояние питомца и сбросит задания.')) {
      nextPeriod();
      navigate('/');
    }
  };

  const handleReset = () => {
    if (confirm('ВНИМАНИЕ! Это полностью удалит текущий прогресс и питомца. Продолжить?')) {
      resetProgress();
      navigate('/');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 bg-gray-50 text-black">
        <div className="bg-white p-8 rounded-2xl shadow-md max-w-sm w-full text-center">
          <h2 className="text-xl font-bold mb-2">Раздел для родителей</h2>
          <p className="text-gray-600 mb-6 text-sm">Чтобы войти, решите пример:</p>

          <div className="text-3xl font-bold text-gray-800 mb-6">
            {mathProblem.a} × {mathProblem.b} = ?
          </div>

          <input
            type="text"
            inputMode="numeric"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            className="w-full text-center text-xl font-bold p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary mb-4 text-black"
            placeholder="Ответ"
          />

          {error && <p className="text-danger text-sm mb-4">{error}</p>}

          <button
            onClick={handleAuth}
            className="w-full bg-primary hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            Войти
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-50 text-black p-6 space-y-6">

      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200">
        <h3 className="font-bold text-lg mb-2 flex items-center text-gray-800">
          <Info size={20} className="mr-2 text-primary" />
          Информация
        </h3>
        <p className="text-gray-600 text-sm mb-4">
          Это приложение предназначено для развития базовых финансовых навыков у детей 7-11 лет: планирования бюджета, различия обязательных и желаемых расходов, и накопления.
        </p>
        <div className="bg-blue-50 p-3 rounded-lg text-sm text-blue-800">
          <span className="font-bold">Текущий игровой период:</span> {currentPeriod}
        </div>
      </div>

      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200">
        <h3 className="font-bold text-lg mb-4 text-gray-800">Управление режимом</h3>

        <button
          onClick={handleNextPeriod}
          className="w-full mb-4 flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-4 px-6 rounded-xl transition-colors"
        >
          <FastForward size={20} className="mr-2 text-primary" />
          Сымитировать конец периода
        </button>
        <p className="text-xs text-gray-500 text-center mb-6">
          Используйте для демонстрации или если ребенок готов перейти к следующему этапу.
        </p>

        <button
          onClick={handleReset}
          className="w-full flex items-center justify-center bg-red-50 hover:bg-red-100 text-danger font-bold py-4 px-6 rounded-xl transition-colors border border-red-200"
        >
          <Trash2 size={20} className="mr-2" />
          Сбросить весь прогресс
        </button>
        <p className="text-xs text-gray-500 text-center mt-2">
          Удалит питомца и вернет баланс к начальному.
        </p>
      </div>

    </div>
  );
}
