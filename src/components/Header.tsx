import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SonatrachLogo } from './SonatrachLogo';
import { 
  ShieldAlert, 
  Sun, 
  Moon, 
  User as UserIcon, 
  LogOut, 
  LogIn, 
  Database, 
  AlertTriangle
} from 'lucide-react';

interface HeaderProps {
  onOpenLoginModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenLoginModal }) => {
  const { 
    theme, 
    toggleTheme, 
    currentUser, 
    logout, 
    metrics, 
    setCurrentView,
    exportDatabaseJSON
  } = useApp();

  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-gradient-to-r from-cyan-900 via-sky-900 to-slate-900 text-white shadow-xl border-b border-sky-700/40 backdrop-blur-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Left Brand Identifier */}
          <div 
            onClick={() => setCurrentView('accueil')} 
            className="flex items-center gap-3 cursor-pointer group py-1"
          >
            <SonatrachLogo size="md" subtext="Division HSE" variant="dark" />
          </div>

          {/* Center Action Badges */}
          <div className="hidden md:flex items-center gap-3">
            {metrics.contratsExpirantsCount > 0 && (
              <button
                onClick={() => setCurrentView('contrats')}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-200 text-xs font-semibold transition-all animate-pulse"
                title="Des contrats expirent sous 30 jours"
              >
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>{metrics.contratsExpirantsCount} contrat(s) à renouveler</span>
              </button>
            )}
          </div>

          {/* Right Controls: Backup, Theme, User Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Backup Button */}
            <button
              onClick={exportDatabaseJSON}
              className="p-2 sm:px-3 sm:py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-200 text-xs font-medium flex items-center gap-2 transition-colors"
              title="Sauvegarder la base de données JSON"
            >
              <Database className="w-4 h-4 text-cyan-400" />
              <span className="hidden sm:inline">Sauvegarder</span>
            </button>

            {/* Theme Switcher */}
            <button
              onClick={toggleTheme}
              className="p-2 sm:p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-cyan-300 transition-colors"
              aria-label="Basculer le thème"
              title={theme === 'clair' ? 'Mode Sombre' : 'Mode Clair'}
            >
              {theme === 'clair' ? (
                <Moon className="w-4 h-4 text-sky-300" />
              ) : (
                <Sun className="w-4 h-4 text-amber-300" />
              )}
            </button>

            {/* User Profile / Login dropdown */}
            <div className="relative">
              {currentUser ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-800/90 border border-slate-700 hover:bg-slate-700/80 transition-colors text-left"
                  >
                    <div className="w-7 h-7 rounded-lg bg-cyan-600 text-white flex items-center justify-center font-bold text-xs uppercase shadow-inner">
                      {currentUser.username.substring(0, 2)}
                    </div>
                    <div className="hidden sm:block">
                      <div className="text-xs font-bold text-white leading-tight">
                        {currentUser.username}
                      </div>
                      <div className="text-[10px] font-medium text-cyan-300 capitalize">
                        {currentUser.fonction || (currentUser.role === 'admin' ? 'Administrateur' : 'Utilisateur')}
                      </div>
                    </div>
                  </button>

                  {userMenuOpen && (
                    <div className="absolute right-0 top-12 w-52 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl py-2 z-50 text-xs">
                      <div className="px-4 py-2 border-b border-slate-800">
                        <p className="font-semibold text-white">{currentUser.username}</p>
                        <p className="text-[10px] text-cyan-400 font-bold">{currentUser.fonction || 'Non précisé'}</p>
                        <p className="text-[10px] text-slate-400">Habilitation: {currentUser.role === 'admin' ? 'Administrateur' : 'Standard'}</p>
                      </div>
                      <button
                        onClick={() => {
                          setUserMenuOpen(false);
                          setCurrentView('utilisateurs');
                        }}
                        className="w-full text-left px-4 py-2 text-slate-300 hover:bg-slate-800 flex items-center gap-2"
                      >
                        <UserIcon className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Compte & Sécurité</span>
                      </button>
                      <button
                        onClick={() => {
                          setUserMenuOpen(false);
                          logout();
                        }}
                        className="w-full text-left px-4 py-2 text-rose-400 hover:bg-slate-800 flex items-center gap-2"
                      >
                        <LogOut className="w-3.5 h-3.5 text-rose-400" />
                        <span>Se déconnecter</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={onOpenLoginModal}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs shadow-md transition-all"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Connexion</span>
                </button>
              )}
            </div>

          </div>

        </div>
      </div>
    </header>
  );
};
