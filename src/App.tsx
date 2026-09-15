import { useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useAppStore } from './store/useAppStore';
import { Layout } from './components/Layout';

import { Onboarding } from './pages/Onboarding';
import { PetCreation } from './pages/PetCreation';
import { Main } from './pages/Main';

import { Budget } from './pages/Budget';

import { Tasks } from './pages/Tasks';
import { Shop } from './pages/Shop';
import { Savings } from './pages/Savings';
import { AdultSection } from './pages/AdultSection';

function App() {
  const { isFirstLaunch, pet } = useAppStore();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isFirstLaunch && location.pathname !== '/onboarding' && location.pathname !== '/pet-creation') {
      navigate('/onboarding');
    } else if (!isFirstLaunch && !pet && location.pathname !== '/pet-creation') {
      navigate('/pet-creation');
    }
  }, [isFirstLaunch, pet, navigate, location.pathname]);

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/pet-creation" element={<PetCreation />} />
        <Route path="/budget" element={<Budget />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/savings" element={<Savings />} />
        <Route path="/adult" element={<AdultSection />} />
      </Routes>
    </Layout>
  );
}

export default App;
