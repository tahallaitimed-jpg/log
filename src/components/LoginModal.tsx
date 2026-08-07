import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { LogIn, X, Lock, User as UserIcon } from 'lucide-react';
import { SonatrachLogo } from './SonatrachLogo';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const { login } = useApp();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(username, password)) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5 text-white">
        
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <SonatrachLogo size="sm" subtext="Division HSE" variant="dark" />
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-300 mb-1">
              Nom d'utilisateur *
            </label>
            <div className="relative">
              <UserIcon className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-300 mb-1">
              Mot de passe *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-orange-500 hover:bg-orange-400 text-slate-950 font-bold shadow-lg shadow-orange-500/20 transition-all flex items-center justify-center gap-2"
          >
            <LogIn className="w-4 h-4" />
            <span>Se Connecter</span>
          </button>
        </form>

        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-[10px] text-slate-400 space-y-1">
          <p className="font-bold text-slate-300">Identifiants par défaut pour test:</p>
          <p>• Admin: <code>admin</code> (accès complet)</p>
          <p>• Ingénieur: <code>tahallaiti</code> (accès complet)</p>
          <p>• Opérateur: <code>operator1</code> (saisie standard)</p>
        </div>

      </div>
    </div>
  );
};
