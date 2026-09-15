import { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { CheckCircle2, Circle } from 'lucide-react';

export function Tasks() {
  const { tasks, completeTask } = useAppStore();
  const [selectedTask, setSelectedTask] = useState<string | null>(null);

  const handleComplete = (taskId: string) => {
    completeTask(taskId);
    setSelectedTask(null);
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 text-black p-6">
      <p className="text-gray-600 mb-6 text-center">Выполняй задания, чтобы заработать монеты для питомца!</p>

      <div className="space-y-4">
        {tasks.map(task => (
          <div
            key={task.id}
            className={`bg-white rounded-xl shadow-sm border p-4 transition-all ${
              task.completed ? 'border-gray-200 opacity-70' :
              selectedTask === task.id ? 'border-primary ring-1 ring-primary' : 'border-gray-200 hover:border-gray-300 cursor-pointer'
            }`}
            onClick={() => !task.completed && setSelectedTask(selectedTask === task.id ? null : task.id)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className={`font-bold text-lg mb-1 ${task.completed ? 'text-gray-500 line-through' : 'text-gray-800'}`}>
                  {task.title}
                </h3>
                {selectedTask === task.id && !task.completed && (
                  <p className="text-gray-600 text-sm mt-2 mb-4">
                    {task.description}
                  </p>
                )}
              </div>
              <div className="flex flex-col items-end ml-4">
                <span className="font-bold text-primary bg-blue-50 px-3 py-1 rounded-full whitespace-nowrap mb-2">
                  +{task.reward} 🪙
                </span>
                {task.completed ? (
                  <CheckCircle2 className="text-secondary" size={24} />
                ) : (
                  <Circle className="text-gray-300" size={24} />
                )}
              </div>
            </div>

            {selectedTask === task.id && !task.completed && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleComplete(task.id);
                }}
                className="w-full mt-2 bg-secondary hover:bg-emerald-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
              >
                Я выполнил(а)!
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
