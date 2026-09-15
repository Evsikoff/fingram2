import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);

  const steps = [
    {
      title: 'Добро пожаловать!',
      text: 'В этой игре тебе предстоит ухаживать за своим виртуальным питомцем и научиться управлять деньгами.',
    },
    {
      title: 'Твои решения',
      text: 'Каждый период ты будешь принимать решения: потратить на обязательное (например, еду), на желаемое (игрушки) или отложить в копилку.',
    },
    {
      title: 'Ответственность',
      text: 'Состояние твоего питомца зависит от того, насколько разумно ты тратишь свои средства. Давай начнем и создадим твоего питомца!',
    }
  ];

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      navigate('/pet-creation');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-full p-6 text-center">
      <div className="bg-white p-8 rounded-2xl shadow-md max-w-sm w-full flex flex-col items-center">
        <h2 className="text-2xl font-bold mb-4 text-primary">{steps[step].title}</h2>
        <p className="text-gray-700 mb-8 h-24">{steps[step].text}</p>

        <div className="flex space-x-2 mb-8">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full ${i === step ? 'bg-primary' : 'bg-gray-300'}`}
            />
          ))}
        </div>

        <button
          onClick={handleNext}
          className="w-full bg-primary hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
        >
          {step === steps.length - 1 ? 'Создать питомца' : 'Далее'}
        </button>
      </div>
    </div>
  );
}
