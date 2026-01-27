import React, { useState } from 'react';
import { 
  HeroSection, 
  ValuePropSection, 
  DetailsSection, 
  ProofSection, 
  CTASection, 
  PricingSection,
  Footer 
} from './components/Sections';
import { BackgroundEffects, GridPattern } from './components/ui/Effects';
import { Navbar } from './components/ui/Navigation';
import { Dashboard } from './components/Dashboard';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'landing' | 'dashboard'>('landing');

  return (
    <div className="relative min-h-screen bg-background text-white selection:bg-primary/30 font-sans">
      
      {currentView === 'landing' ? (
        <>
          {/* Global Background Effects - Only on Landing */}
          <div className="fixed inset-0 z-0 pointer-events-none">
            <BackgroundEffects />
            <GridPattern />
          </div>

          {/* Navigation */}
          <Navbar onNavigate={setCurrentView} />

          {/* Main Content */}
          <main className="relative z-10 flex flex-col items-center w-full">
            <HeroSection onNavigate={setCurrentView} />
            <ValuePropSection />
            <DetailsSection />
            <PricingSection />
            <ProofSection />
            <CTASection onNavigate={setCurrentView} />
          </main>

          {/* Footer */}
          <Footer />
        </>
      ) : (
        <Dashboard onNavigate={setCurrentView} />
      )}
    </div>
  );
};

export default App;