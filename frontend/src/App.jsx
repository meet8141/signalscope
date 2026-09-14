import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { LandingPage } from './pages/LandingPage';
import { CheckPage } from './pages/CheckPage';
import { TeamPage } from './pages/TeamPage';
import { ArchitecturePage } from './pages/ArchitecturePage';
import { ResearchPage } from './pages/ResearchPage';
import { PerformancePage } from './pages/PerformancePage';
import { DatasetPage } from './pages/DatasetPage';
import { DeveloperPage } from './pages/DeveloperPage';
import { FAQPage } from './pages/FAQPage';
import { LoginPage } from './pages/LoginPage';
import { Footer } from './components/Footer';
import { CustomCursor } from './components/CustomCursor';
import { api } from './api/client';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  useEffect(() => {
    // Ping backend immediately on load
    api.checkHealth().catch(() => {});

    // Set up a 45-second interval to keep the Render backend awake
    const interval = setInterval(() => {
      api.checkHealth().catch(() => {});
    }, 45000);

    return () => clearInterval(interval);
  }, []);

  return (
    <AuthProvider>
      <BrowserRouter>
        <CustomCursor />
        <div className="min-h-screen bg-stone-black text-off-white selection:bg-acid-lime selection:text-stone-black overflow-x-hidden flex flex-col">
          <Navbar />
          
          <main className="flex-grow flex flex-col">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/check" element={<CheckPage />} />
              <Route path="/team" element={<TeamPage />} />
              <Route path="/architecture" element={<ArchitecturePage />} />
              <Route path="/research" element={<ResearchPage />} />
              <Route path="/performance" element={<PerformancePage />} />
              <Route path="/dataset" element={<DatasetPage />} />
              <Route path="/developer" element={<DeveloperPage />} />
              <Route path="/faq" element={<FAQPage />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
