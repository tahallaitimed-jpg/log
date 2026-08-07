import React from 'react';
import { useApp } from '../context/AppContext';
import { getPermissionsForUser } from '../data/constants';
import { 
  Home, 
  Trash2, 
  BarChart3, 
  Users, 
  FileText, 
  Scale, 
  UserCog, 
  HelpCircle 
} from 'lucide-react';

export const Navigation: React.FC = () => {
  const { currentView, setCurrentView, currentUser } = useApp();
  const perms = getPermissionsForUser(currentUser);

  const rawNavItems = [
    { id: 'accueil', label: 'Accueil', icon: Home, allowed: true },
    { id: 'dechets', label: 'Saisie & Registre Déchets', icon: Trash2, allowed: perms.canAccessSaisieDechets },
    { id: 'dashboard', label: 'Tableau de Bord', icon: BarChart3, allowed: perms.canAccessDashboard },
    { id: 'prestataires', label: 'Prestataires', icon: Users, allowed: perms.canAccessPrestataires },
    { id: 'contrats', label: 'Contrats', icon: FileText, allowed: perms.canAccessContrats },
    { id: 'lois', label: 'Lois & Réglementations', icon: Scale, allowed: perms.canAccessLois },
    { id: 'utilisateurs', label: 'Utilisateurs & Droits', icon: UserCog, allowed: perms.canManageUsers || currentUser?.role === 'admin' },
    { id: 'aide', label: 'Aide & Contact', icon: HelpCircle, allowed: true },
  ];

  const navItems = rawNavItems.filter(item => item.allowed);

  return (
    <nav className="bg-slate-900/90 dark:bg-slate-950/90 border-b border-slate-800 backdrop-blur-md sticky top-16 sm:top-20 z-30 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-1 sm:space-x-2 overflow-x-auto py-2 scrollbar-none">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-600 to-sky-600 text-white shadow-md shadow-cyan-900/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
