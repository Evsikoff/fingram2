import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';

const PET_APPEARANCES = [
  { id: 'cat', name: 'Котик', emoji: '🐱' },
  { id: 'dog', name: 'Песик', emoji: '🐶' },
  { id: 'rabbit', name: 'Кролик', emoji: '🐰' },
];

export function PetCreation() {
  const navigate = useNavigate();
  const createPet = useAppStore(state => state.createPet);

  const [name, setName] = useState('');
  const [appearance, setAppearance] = useState(PET_APPEARANCES[0].id);
  const [error, setError] = useState('');

  const handleCreate = () => {
    if (!name.trim()) {
      setError('Пожалуйста, введи имя для питомца');
      return;
    }

    createPet(name.trim(), appearance);
    navigate('/');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-full p-6 text-center">
      <div className="bg-white p-8 rounded-2xl shadow-md max-w-sm w-full flex flex-col items-center">
        <h2 className="text-2xl font-bold mb-6 text-primary">Создай питомца</h2>

        <div className="w-full mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2 text-left">
            Выбери питомца
          </label>
          <div className="flex justify-around gap-2">
            {PET_APPEARANCES.map((pet) => (
              <button
                key={pet.id}
                onClick={() => setAppearance(pet.id)}
                className={`flex flex-col items-center p-3 rounded-xl border-2 transition-all ${
                  appearance === pet.id
                    ? 'border-primary bg-blue-50 scale-105'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <span className="text-4xl mb-1">{pet.emoji}</span>
                <span className="text-sm font-medium text-gray-700">{pet.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="w-full mb-8">
          <label className="block text-gray-700 text-sm font-bold mb-2 text-left" htmlFor="petName">
            Имя питомца
          </label>
          <input
            id="petName"
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setError('');
            }}
            placeholder="Например: Барсик"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-black"
            maxLength={15}
          />
          {error && <p className="text-danger text-sm mt-1 text-left">{error}</p>}
        </div>

        <button
          onClick={handleCreate}
          className="w-full bg-secondary hover:bg-emerald-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
        >
          Готово!
        </button>
      </div>
    </div>
  );
}
