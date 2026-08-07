import React, { createContext, useContext, useState, useEffect } from 'react';
import { WasteItem, Contractor, Contract, User, UserPermissions, FilterOptions, KPIMetrics } from '../types';
import { INITIAL_WASTE_ITEMS, INITIAL_CONTRACTORS, INITIAL_CONTRACTS } from '../data/constants';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
}

interface AppContextType {
  // Navigation & View
  currentView: string;
  setCurrentView: (view: string) => void;
  
  // Theme
  theme: 'clair' | 'sombre';
  toggleTheme: () => void;
  
  // User Authentication
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  allUsers: User[];
  addUser: (username: string, password: string, role: 'admin' | 'user', fonction?: string, permissions?: UserPermissions) => boolean;
  deleteUser: (id: string) => boolean;
  changeUserPassword: (userId: string, newPass: string) => boolean;
  updateUserPermissions: (userId: string, permissions: UserPermissions) => boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  
  // Data lists
  wasteItems: WasteItem[];
  addWasteItem: (item: Omit<WasteItem, 'id' | 'createdAt'>) => void;
  updateWasteItem: (id: number, item: Partial<WasteItem>) => void;
  deleteWasteItem: (id: number) => void;
  
  contractors: Contractor[];
  addContractor: (contractor: Omit<Contractor, 'id'>) => void;
  updateContractor: (id: number, contractor: Partial<Contractor>) => void;
  deleteContractor: (id: number) => void;
  
  contracts: Contract[];
  addContract: (contract: Omit<Contract, 'id'>) => void;
  updateContract: (id: number, contract: Partial<Contract>) => void;
  deleteContract: (id: number) => void;
  
  // Toast notifications
  toasts: ToastMessage[];
  addToast: (message: string, type?: ToastMessage['type']) => void;
  removeToast: (id: string) => void;
  
  // Backup / Restore
  exportDatabaseJSON: () => void;
  importDatabaseJSON: (jsonString: string) => boolean;
  
  // Metrics calculation
  metrics: KPIMetrics;
  
  // Modals state helper
  selectedContractorForContract: number | null;
  setSelectedContractorForContract: (id: number | null) => void;
}

const defaultUsers: User[] = [
  { id: 'u1', username: 'admin', password: 'admin', role: 'admin', roleId: 1, fonction: 'Directeur', createdAt: '2025-01-01' },
  { id: 'u2', username: 'tahallaiti', password: '123', role: 'admin', roleId: 1, fonction: 'Chef Département', createdAt: '2025-01-02' },
  { id: 'u3', username: 'operator1', password: '123', role: 'user', roleId: 2, fonction: 'Ingénieur', createdAt: '2025-02-10' },
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<string>('accueil');
  const [theme, setTheme] = useState<'clair' | 'sombre'>(() => {
    const saved = localStorage.getItem('ddsd_theme');
    return (saved === 'sombre' || saved === 'clair') ? saved : 'clair';
  });
  
  // Active User session (null by default so user must log in on fresh session)
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('ddsd_active_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [allUsers, setAllUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('ddsd_users');
    return saved ? JSON.parse(saved) : defaultUsers;
  });

  // Waste Data
  const [wasteItems, setWasteItems] = useState<WasteItem[]>(() => {
    const saved = localStorage.getItem('ddsd_waste');
    return saved ? JSON.parse(saved) : INITIAL_WASTE_ITEMS;
  });

  // Contractors Data
  const [contractors, setContractors] = useState<Contractor[]>(() => {
    const saved = localStorage.getItem('ddsd_contractors');
    return saved ? JSON.parse(saved) : INITIAL_CONTRACTORS;
  });

  // Contracts Data
  const [contracts, setContracts] = useState<Contract[]>(() => {
    const saved = localStorage.getItem('ddsd_contracts');
    return saved ? JSON.parse(saved) : INITIAL_CONTRACTS;
  });

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [selectedContractorForContract, setSelectedContractorForContract] = useState<number | null>(null);

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('ddsd_waste', JSON.stringify(wasteItems));
  }, [wasteItems]);

  useEffect(() => {
    localStorage.setItem('ddsd_contractors', JSON.stringify(contractors));
  }, [contractors]);

  useEffect(() => {
    localStorage.setItem('ddsd_contracts', JSON.stringify(contracts));
  }, [contracts]);

  useEffect(() => {
    localStorage.setItem('ddsd_users', JSON.stringify(allUsers));
  }, [allUsers]);

  // Apply Theme class on root element and body
  useEffect(() => {
    localStorage.setItem('ddsd_theme', theme);
    if (theme === 'sombre') {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
  }, [theme]);

  // Persist current active user session
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('ddsd_active_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('ddsd_active_user');
    }
  }, [currentUser]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'clair' ? 'sombre' : 'clair'));
  };

  const addToast = (message: string, type: ToastMessage['type'] = 'info') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Auth operations
  const login = (username: string, pass: string): boolean => {
    const cleanName = username.trim().toLowerCase();
    const found = allUsers.find(u => u.username.toLowerCase() === cleanName);
    
    if (found) {
      if (found.password && found.password !== pass) {
        addToast('Mot de passe incorrect pour cet utilisateur', 'error');
        return false;
      }
      setCurrentUser(found);
      localStorage.setItem('ddsd_active_user', JSON.stringify(found));
      addToast(`Bienvenue, ${found.username} !`, 'success');
      return true;
    }

    addToast('Utilisateur non trouvé. Seul l\'administrateur peut créer des comptes.', 'error');
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('ddsd_active_user');
    addToast('Déconnexion effectuée', 'info');
  };

  const addUser = (username: string, password: string, role: 'admin' | 'user', fonction?: string, permissions?: UserPermissions): boolean => {
    if (currentUser?.role !== 'admin') {
      addToast('Seul l\'administrateur est autorisé à créer des utilisateurs', 'error');
      return false;
    }
    if (allUsers.some(u => u.username.toLowerCase() === username.toLowerCase())) {
      addToast('Cet utilisateur existe déjà', 'error');
      return false;
    }
    const newUser: User = {
      id: 'u_' + Date.now(),
      username,
      password: password.trim() || '123456',
      role,
      roleId: role === 'admin' ? 1 : 2,
      fonction: fonction || 'Technicien',
      permissions,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setAllUsers(prev => [...prev, newUser]);
    addToast(`Utilisateur ${username} (${newUser.fonction}) ajouté avec succès avec ses droits personnalisés`, 'success');
    return true;
  };

  const updateUserPermissions = (userId: string, permissions: UserPermissions): boolean => {
    if (currentUser?.role !== 'admin') {
      addToast('Seul l\'administrateur est autorisé à modifier les droits des utilisateurs', 'error');
      return false;
    }
    setAllUsers(prev => prev.map(u => u.id === userId ? { ...u, permissions } : u));
    if (currentUser && currentUser.id === userId) {
      setCurrentUser(prev => prev ? { ...prev, permissions } : null);
    }
    addToast('Droits d\'accès mis à jour avec succès', 'success');
    return true;
  };

  const changeUserPassword = (userId: string, newPass: string): boolean => {
    setAllUsers(prev => prev.map(u => u.id === userId ? { ...u, password: newPass } : u));
    if (currentUser && currentUser.id === userId) {
      setCurrentUser(prev => prev ? { ...prev, password: newPass } : null);
    }
    addToast('Mot de passe mis à jour avec succès', 'success');
    return true;
  };

  const deleteUser = (id: string): boolean => {
    if (currentUser?.role !== 'admin') {
      addToast('Seul l\'administrateur est autorisé à supprimer des utilisateurs', 'error');
      return false;
    }
    const userToDelete = allUsers.find(u => u.id === id);
    if (userToDelete?.username === 'admin') {
      addToast('Impossible de supprimer le compte administrateur principal', 'error');
      return false;
    }
    setAllUsers(prev => prev.filter(u => u.id !== id));
    addToast('Utilisateur supprimé', 'info');
    return true;
  };

  // Waste CRUD
  const addWasteItem = (item: Omit<WasteItem, 'id' | 'createdAt'>) => {
    const newId = wasteItems.length > 0 ? Math.max(...wasteItems.map(w => w.id)) + 1 : 101;
    const newItem: WasteItem = {
      ...item,
      id: newId,
      createdAt: new Date().toISOString(),
      createdBy: currentUser ? currentUser.username : 'Système'
    };
    setWasteItems(prev => [newItem, ...prev]);
    addToast(`Déchet "${newItem.nom}" ajouté avec succès (ID: ${newItem.id})`, 'success');
  };

  const updateWasteItem = (id: number, partial: Partial<WasteItem>) => {
    if (currentUser?.role !== 'admin') {
      addToast('Seul l\'administrateur est autorisé à modifier les enregistrements', 'error');
      return;
    }
    setWasteItems(prev => prev.map(w => (w.id === id ? { ...w, ...partial, updatedAt: new Date().toISOString() } : w)));
    addToast(`Déchet #${id} mis à jour`, 'success');
  };

  const deleteWasteItem = (id: number) => {
    if (currentUser?.role !== 'admin') {
      addToast('Seul l\'administrateur est autorisé à supprimer les enregistrements', 'error');
      return;
    }
    const item = wasteItems.find(w => w.id === id);
    setWasteItems(prev => prev.filter(w => w.id !== id));
    addToast(`Déchet "${item?.nom || id}" supprimé`, 'warning');
  };

  // Contractor CRUD
  const addContractor = (c: Omit<Contractor, 'id'>) => {
    const newId = contractors.length > 0 ? Math.max(...contractors.map(x => x.id)) + 1 : 1;
    const newC: Contractor = { ...c, id: newId, createdAt: new Date().toISOString() };
    setContractors(prev => [...prev, newC]);
    addToast(`Prestataire "${newC.nom}" enregistré`, 'success');
  };

  const updateContractor = (id: number, partial: Partial<Contractor>) => {
    if (currentUser?.role !== 'admin') {
      addToast('Seul l\'administrateur est autorisé à modifier un prestataire', 'error');
      return;
    }
    setContractors(prev => prev.map(c => (c.id === id ? { ...c, ...partial, updatedAt: new Date().toISOString() } : c)));
    addToast(`Prestataire mis à jour`, 'success');
  };

  const deleteContractor = (id: number) => {
    if (currentUser?.role !== 'admin') {
      addToast('Seul l\'administrateur est autorisé à supprimer un prestataire', 'error');
      return;
    }
    setContractors(prev => prev.filter(c => c.id !== id));
    addToast(`Prestataire supprimé`, 'info');
  };

  // Contract CRUD
  const addContract = (c: Omit<Contract, 'id'>) => {
    const newId = contracts.length > 0 ? Math.max(...contracts.map(x => x.id)) + 1 : 1;
    
    // Auto status evaluation
    const today = new Date();
    const end = new Date(c.dateFin);
    const diffDays = Math.ceil((end.getTime() - today.getTime()) / (1000 * 3600 * 24));
    
    let status: Contract['status'] = 'Actif';
    if (diffDays < 0) status = 'Expiré';
    else if (diffDays <= 30) status = 'À renouveler';

    const newContract: Contract = {
      ...c,
      id: newId,
      status,
      createdAt: new Date().toISOString()
    };
    setContracts(prev => [...prev, newContract]);
    addToast(`Nouveau contrat créé pour le prestataire #${c.prestataireId}`, 'success');
  };

  const updateContract = (id: number, partial: Partial<Contract>) => {
    if (currentUser?.role !== 'admin') {
      addToast('Seul l\'administrateur est autorisé à modifier un contrat', 'error');
      return;
    }
    setContracts(prev => prev.map(c => {
      if (c.id === id) {
        const updated = { ...c, ...partial };
        if (partial.dateFin) {
          const today = new Date();
          const end = new Date(partial.dateFin);
          const diffDays = Math.ceil((end.getTime() - today.getTime()) / (1000 * 3600 * 24));
          if (diffDays < 0) updated.status = 'Expiré';
          else if (diffDays <= 30) updated.status = 'À renouveler';
          else updated.status = 'Actif';
        }
        return updated;
      }
      return c;
    }));
    addToast(`Contrat #${id} mis à jour`, 'success');
  };

  const deleteContract = (id: number) => {
    if (currentUser?.role !== 'admin') {
      addToast('Seul l\'administrateur est autorisé à supprimer un contrat', 'error');
      return;
    }
    setContracts(prev => prev.filter(c => c.id !== id));
    addToast(`Contrat #${id} supprimé`, 'info');
  };

  // Export / Import Database JSON
  const exportDatabaseJSON = () => {
    const data = {
      wasteItems,
      contractors,
      contracts,
      users: allUsers,
      exportedAt: new Date().toISOString(),
      app: 'SONATRACH Division HSE - Gestion DDSD'
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup_ddsd_gp1z_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    addToast('Sauvegarde de la base de données exportée !', 'success');
  };

  const importDatabaseJSON = (jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.wasteItems && Array.isArray(parsed.wasteItems)) {
        setWasteItems(parsed.wasteItems);
      }
      if (parsed.contractors && Array.isArray(parsed.contractors)) {
        setContractors(parsed.contractors);
      }
      if (parsed.contracts && Array.isArray(parsed.contracts)) {
        setContracts(parsed.contracts);
      }
      if (parsed.users && Array.isArray(parsed.users)) {
        setAllUsers(parsed.users);
      }
      addToast('Base de données restaurée avec succès !', 'success');
      return true;
    } catch {
      addToast('Format de fichier JSON invalide', 'error');
      return false;
    }
  };

  // KPI Calculations
  const highRiskCodes = ['H3', 'H4', 'H5', 'H6', 'H7', 'H8', 'H10'];
  const totalDechets = wasteItems.length;
  const totalVolume = wasteItems.reduce((acc, curr) => acc + (Number(curr.quantite) || 0), 0);
  const dechetsDangereuxCount = wasteItems.filter(w => highRiskCodes.includes(w.dangerosite)).length;
  const totalPrestataires = contractors.length;

  const totalLiquides = wasteItems.filter(w => w.aspect === 'Liquide').reduce((sum, w) => sum + w.quantite, 0);
  const totalSolides = wasteItems.filter(w => w.aspect === 'Solide').reduce((sum, w) => sum + w.quantite, 0);
  
  // Storage capacities (e.g. 80 000 L for liquids, 50 000 kg for solids)
  const liquidCapPct = (totalLiquides / 80000) * 100;
  const solidCapPct = (totalSolides / 50000) * 100;
  const capaciteUtiliseePct = Math.min(100, Math.round(Math.max(liquidCapPct, solidCapPct)));

  const today = new Date();
  const contratsExpirantsCount = contracts.filter(c => {
    const end = new Date(c.dateFin);
    const diffDays = Math.ceil((end.getTime() - today.getTime()) / (1000 * 3600 * 24));
    return diffDays <= 30;
  }).length;

  const metrics: KPIMetrics = {
    totalDechets,
    totalVolume,
    dechetsDangereuxCount,
    totalPrestataires,
    capaciteUtiliseePct,
    contratsExpirantsCount
  };

  return (
    <AppContext.Provider
      value={{
        currentView,
        setCurrentView,
        theme,
        toggleTheme,
        currentUser,
        setCurrentUser,
        allUsers,
        addUser,
        deleteUser,
        changeUserPassword,
        updateUserPermissions,
        login,
        logout,
        wasteItems,
        addWasteItem,
        updateWasteItem,
        deleteWasteItem,
        contractors,
        addContractor,
        updateContractor,
        deleteContractor,
        contracts,
        addContract,
        updateContract,
        deleteContract,
        toasts,
        addToast,
        removeToast,
        exportDatabaseJSON,
        importDatabaseJSON,
        metrics,
        selectedContractorForContract,
        setSelectedContractorForContract
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
