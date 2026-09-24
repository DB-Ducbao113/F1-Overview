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

      {/* Dynamic Main Content Based on Active Tab */}
      <main className="flex-1">
        {activeTab === 'home' && <HomeView />}
        {activeTab === 'models' && <ModelsView />}
        {activeTab === 'compare' && <CompareView />}
        {activeTab === 'gallery' && <GalleryView />}
      </main>

      {/* Site Footer */}
      <Footer />
    </div>
  );
};

export default App;
