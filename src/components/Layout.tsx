import type { ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const isMainScreen = location.pathname === '/' || location.pathname === '/onboarding' || location.pathname === '/pet-creation';

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center w-full">
      <div className="w-full max-w-[480px] bg-white min-h-screen shadow-xl relative overflow-hidden flex flex-col">
        {/* Header for non-main screens */}
        {!isMainScreen && (
          <header className="bg-primary text-white p-4 flex items-center shadow-md z-10">
            <button
              onClick={() => navigate(-1)}
              className="mr-3 p-1 rounded-full hover:bg-white/20 transition-colors"
            >
              <ArrowLeft size={24} />
            </button>
            <h1 className="text-xl font-bold">
              {location.pathname === '/budget' ? 'План бюджета' :
               location.pathname === '/tasks' ? 'Задания' :
               location.pathname === '/shop' ? 'Магазин' :
               location.pathname === '/savings' ? 'Копилка' :
               location.pathname === '/adult' ? 'Родителям' : 'Питомец Финни'}
            </h1>
          </header>
        )}

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-gray-50 flex flex-col relative">
          {children}
        </main>
      </div>
    </div>
  );
}
