import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { ToastContainer } from './components/ToastContainer';
import { AccueilView } from './components/AccueilView';
import { SaisieDechetsView } from './components/SaisieDechetsView';
import { DashboardView } from './components/DashboardView';
import { PrestatairesView } from './components/PrestatairesView';
import { ContratsView } from './components/ContratsView';
import { LoisArticlesView } from './components/LoisArticlesView';
import { UtilisateursView } from './components/UtilisateursView';
import { AideView } from './components/AideView';
import { LoginModal } from './components/LoginModal';
import { LoginGate } from './components/LoginGate';

const AppContent: React.FC = () => {
  const { currentView, currentUser } = useApp();
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  // If user is not logged in, enforce authentication via LoginGate screen
  if (!currentUser) {
    return (
      <>
        <LoginGate />
        <ToastContainer />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200">
      
      {/* Top Header */}
      <Header 
        onOpenLoginModal={() => setLoginModalOpen(true)}
      />

      {/* View Switcher Navigation Bar */}
      <Navigation />

      {/* Main View Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {currentView === 'accueil' && (
          <AccueilView 
            onOpenLoginModal={() => setLoginModalOpen(true)}
          />
        )}
        {currentView === 'dechets' && <SaisieDechetsView />}
        {currentView === 'dashboard' && <DashboardView />}
        {currentView === 'prestataires' && <PrestatairesView />}
        {currentView === 'contrats' && <ContratsView />}
        {currentView === 'lois' && <LoisArticlesView />}
        {currentView === 'utilisateurs' && <UtilisateursView />}
        {currentView === 'aide' && <AideView />}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 text-xs py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-bold text-slate-200">
              SONATRACH division HSE — Plateforme de Gestion des Déchets Solides Dangereux
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Conformité HSE & Réglementation Environnementale (Lois 01-19 & 03-10)
            </p>
          </div>

          <div className="text-right text-[11px] text-slate-500">
            <p>© 2026 Tous droits réservés — SONATRACH division HSE</p>
            <p className="mt-0.5">Développeur: <span className="text-slate-300 font-semibold">TAHALLAITI Mohamed</span></p>
          </div>
        </div>
      </footer>

      {/* Toast Alerts Container */}
      <ToastContainer />

      {/* Login Modal */}
      <LoginModal 
        isOpen={loginModalOpen} 
        onClose={() => setLoginModalOpen(false)} 
      />

    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
