import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SonatrachLogo } from './SonatrachLogo';
import { Shield, Lock, User as UserIcon, ArrowRight, Eye, EyeOff, KeyRound, CheckCircle2 } from 'lucide-react';

export const LoginGate: React.FC = () => {
  const { login, allUsers } = useApp();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!username.trim()) {
      setErrorMsg('Veuillez saisir votre nom d\'utilisateur');
      return;
    }

    const success = login(username, password);
    if (!success) {
      setErrorMsg('Nom d\'utilisateur ou mot de passe incorrect');
    }
  };

  const handleQuickSelect = (u: typeof allUsers[0]) => {
    setUsername(u.username);
    setPassword(u.password || '123');
    setErrorMsg('');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between relative overflow-hidden font-sans">
      
      {/* Background Ambient Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Top Header */}
      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <SonatrachLogo size="md" subtext="Division HSE" variant="dark" />
          <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-full">
            <Shield className="w-4 h-4" />
            <span>Portail Sécurisé DDSD</span>
          </div>
        </div>
      </header>

      {/* Main Login Form Box */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 my-8">
        <div className="w-full max-w-md space-y-6">
          
          {/* Main Card */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative space-y-6">
            
            {/* Logo Badge in Form */}
            <div className="text-center space-y-2">
              <div className="inline-flex p-3 rounded-2xl bg-slate-800/80 border border-slate-700/80 shadow-inner mb-2">
                <SonatrachLogo size="lg" showText={false} />
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Authentification Requise
              </h1>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                Connectez-vous pour accéder au registre et à la gestion des déchets solides dangereux (DDSD)
              </p>
            </div>

            {/* Error Message if any */}
            {errorMsg && (
              <div className="bg-rose-500/10 border border-rose-500/30 p-3 rounded-2xl text-xs text-rose-300 font-medium flex items-center gap-2">
                <Shield className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              
              {/* Username Input */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-300">
                  Nom d'utilisateur / Matricule *
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="ex: admin"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 font-medium outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-300">
                  Mot de passe *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 font-medium outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-orange-600 via-amber-600 to-orange-500 hover:from-orange-500 hover:to-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-orange-900/30 flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02]"
              >
                <span>Démarrer la Session</span>
                <ArrowRight className="w-4 h-4" />
              </button>

            </form>

            {/* Quick Select Demo Accounts */}
            <div className="pt-4 border-t border-slate-800 space-y-2">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center">
                Comptes de Démonstration Disponibles
              </div>
              <div className="grid grid-cols-2 gap-2">
                {allUsers.slice(0, 4).map((u) => (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => handleQuickSelect(u)}
                    className={`px-3 py-2 rounded-xl text-left border transition-all ${
                      username.toLowerCase() === u.username.toLowerCase()
                        ? 'bg-orange-500/20 border-orange-500/60 text-white'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                    }`}
                  >
                    <div className="font-bold text-xs truncate flex items-center justify-between">
                      <span>{u.username}</span>
                      {username.toLowerCase() === u.username.toLowerCase() && (
                        <CheckCircle2 className="w-3 h-3 text-orange-400" />
                      )}
                    </div>
                    <div className="text-[9px] text-amber-400 font-medium truncate">
                      {u.fonction || (u.role === 'admin' ? 'Administrateur' : 'Opérateur')}
                    </div>
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Environmental Compliance Footer Note */}
          <div className="text-center text-[11px] text-slate-500 space-y-1">
            <p>SONATRACH Division HSE — Système de Traçabilité Environnementale</p>
            <p className="text-[10px]">Conforme à la Loi n° 01-19 du 12 décembre 2001</p>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/80 px-6 py-3 text-center text-[10px] text-slate-500">
        © 2026 SONATRACH division HSE — TAHALLAITI Mohamed
      </footer>

    </div>
  );
};
