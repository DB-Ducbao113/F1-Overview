import React from 'react';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HomeView } from './components/pages/HomeView';
import { ModelsView } from './components/pages/ModelsView';
import { CompareView } from './components/pages/CompareView';
import { GalleryView } from './components/pages/GalleryView';
import { useCarStore } from './store/useCarStore';

export const App: React.FC = () => {
  const { activeTab } = useCarStore();

  return (
    <div className="min-h-screen bg-studio-100 text-studio-900 flex flex-col font-sans selection:bg-f1red selection:text-white">
      {/* Fixed Site-Wide Navigation */}
      <Navbar />

      {/* F1 High-Speed Transition Pulse Line at Top Bar */}
      <div
        key={activeTab + '-speedbar'}
        className="fixed top-0 left-0 right-0 h-[2.5px] z-[60] pointer-events-none overflow-hidden"
      >
        <div className="w-full h-full bg-gradient-to-r from-transparent via-f1red to-yellow-400 animate-f1-speed-scan" />
      </div>

      {/* Dynamic Main Content with Smooth Page-Enter Animation */}
      <main className="flex-1">
        <div key={activeTab} className="animate-page-enter">
          {activeTab === 'home' && <HomeView />}
          {activeTab === 'models' && <ModelsView />}
          {activeTab === 'compare' && <CompareView />}
          {activeTab === 'gallery' && <GalleryView />}
        </div>
      </main>

      {/* Site Footer */}
      <Footer />
    </div>
  );
};

export default App;
