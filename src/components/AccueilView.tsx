import React from 'react';
import { useApp } from '../context/AppContext';
import { SonatrachLogo } from './SonatrachLogo';
import { 
  PlusCircle, 
  Scale, 
  BarChart2, 
  Users, 
  FileCheck2, 
  HelpCircle, 
  Database, 
  ShieldAlert, 
  Flame, 
  AlertTriangle,
  ArrowRight,
  Droplets,
  Building2,
  Lock
} from 'lucide-react';

interface AccueilViewProps {
  onOpenLoginModal: () => void;
}

export const AccueilView: React.FC<AccueilViewProps> = ({ onOpenLoginModal }) => {
  const { 
    setCurrentView, 
    metrics, 
    currentUser, 
    wasteItems, 
    exportDatabaseJSON 
  } = useApp();

  const mainButtons = [
    {
      title: 'Ajouter un déchet',
      subtitle: 'Saisie & suivi du registre',
      icon: PlusCircle,
      action: () => {
        if (!currentUser) onOpenLoginModal();
        else setCurrentView('dechets');
      },
      color: 'from-emerald-600 to-teal-700',
      textColor: 'text-emerald-100',
      badge: `${metrics.totalDechets} enregistrés`
    },
    {
      title: 'Lois et Articles',
      subtitle: 'Cadre juridique algérien (01-19, 03-10...)',
      icon: Scale,
      action: () => setCurrentView('lois'),
      color: 'from-sky-600 to-blue-700',
      textColor: 'text-sky-100',
      badge: '11 textes réglementaires'
    },
    {
      title: 'Tableau de Bord',
      subtitle: 'Statistiques & Graphiques Recharts',
      icon: BarChart2,
      action: () => setCurrentView('dashboard'),
      color: 'from-indigo-600 to-purple-700',
      textColor: 'text-indigo-100',
      badge: 'Visualisations 3D & 2D'
    },
    {
      title: 'Gérer les prestataires',
      subtitle: 'Collecte, transport, traitement',
      icon: Users,
      action: () => setCurrentView('prestataires'),
      color: 'from-cyan-600 to-teal-700',
      textColor: 'text-cyan-100',
      badge: `${metrics.totalPrestataires} agréés`
    },
    {
      title: 'Gérer les contrats',
      subtitle: 'Conventions & dates d\'échéance',
      icon: FileCheck2,
      action: () => setCurrentView('contrats'),
      color: 'from-amber-600 to-orange-700',
      textColor: 'text-amber-100',
      badge: metrics.contratsExpirantsCount > 0 ? `${metrics.contratsExpirantsCount} alerte(s)` : 'Contrats à jour'
    },
    {
      title: 'Gérer les utilisateurs',
      subtitle: 'Habilitations & création de comptes',
      icon: Lock,
      action: () => {
        if (!currentUser) onOpenLoginModal();
        else setCurrentView('utilisateurs');
      },
      color: 'from-slate-700 to-slate-800',
      textColor: 'text-slate-100',
      badge: currentUser?.role === 'admin' ? 'Accès Administrateur' : 'Seul Admin crée les comptes'
    },
    {
      title: 'Sauvegarder BDD',
      subtitle: 'Export JSON complet du registre',
      icon: Database,
      action: exportDatabaseJSON,
      color: 'from-slate-800 to-zinc-900 border border-slate-700',
      textColor: 'text-slate-200',
      badge: 'Sauvegarde immédiate'
    }
  ];

  const recentItems = wasteItems.slice(0, 5);

  return (
    <div className="space-y-8 pb-12">
      
      {/* Sonatrach division HSE Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-cyan-950 via-slate-900 to-slate-950 text-white p-6 sm:p-10 border border-cyan-800/40 shadow-2xl">
        
        {/* Background decorative oil/gas refinery motifs */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
          
          <div className="space-y-4 max-w-2xl text-center lg:text-left">
            
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-bold tracking-wide uppercase">
              <SonatrachLogo size="sm" subtext="Division HSE" variant="dark" />
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
              GESTION DES DÉCHETS SOLIDES DANGEREUX
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Plateforme centrale de suivi, contrôle, traçabilité et conformité réglementaire de tous les déchets industriels, chimiques et toxiques pour <span className="text-cyan-300 font-semibold">SONATRACH division HSE</span>.
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-3">
              <button
                onClick={() => setCurrentView('dechets')}
                className="px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-400 text-slate-950 font-bold text-sm shadow-lg shadow-orange-500/20 transition-all flex items-center gap-2 transform hover:scale-105"
              >
                <span>Consulter le Registre</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setCurrentView('lois')}
                className="px-5 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-200 font-semibold text-sm transition-all"
              >
                Cadre Réglementaire (Lois)
              </button>
            </div>

          </div>

          {/* Quick KPI Cards Strip */}
          <div className="w-full lg:w-auto grid grid-cols-2 gap-3 sm:gap-4 shrink-0">
            <div className="bg-slate-900/90 border border-cyan-500/30 p-4 rounded-2xl shadow-lg backdrop-blur-md">
              <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold">
                <Droplets className="w-4 h-4" />
                <span>Total Déchets</span>
              </div>
              <p className="text-2xl sm:text-3xl font-black text-white mt-1">
                {metrics.totalDechets}
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">
                {(metrics.totalVolume / 1000).toFixed(1)} Tonnes totales
              </p>
            </div>

            <div className="bg-slate-900/90 border border-rose-500/30 p-4 rounded-2xl shadow-lg backdrop-blur-md">
              <div className="flex items-center gap-2 text-rose-400 text-xs font-semibold">
                <ShieldAlert className="w-4 h-4" />
                <span>Risque Élevé</span>
              </div>
              <p className="text-2xl sm:text-3xl font-black text-rose-300 mt-1">
                {metrics.dechetsDangereuxCount}
              </p>
              <p className="text-[10px] text-rose-400/80 mt-0.5">
                Codes H3, H6, H7, H8, H10
              </p>
            </div>

            <div className="bg-slate-900/90 border border-emerald-500/30 p-4 rounded-2xl shadow-lg backdrop-blur-md">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold">
                <Building2 className="w-4 h-4" />
                <span>Prestataires</span>
              </div>
              <p className="text-2xl sm:text-3xl font-black text-emerald-300 mt-1">
                {metrics.totalPrestataires}
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">
                Entreprises agréées
              </p>
            </div>

            <div className="bg-slate-900/90 border border-amber-500/30 p-4 rounded-2xl shadow-lg backdrop-blur-md">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold">
                <BarChart2 className="w-4 h-4" />
                <span>Capacité Stock</span>
              </div>
              <p className="text-2xl sm:text-3xl font-black text-amber-300 mt-1">
                {metrics.capaciteUtiliseePct}%
              </p>
              <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2 overflow-hidden">
                <div 
                  className="bg-amber-400 h-1.5 rounded-full" 
                  style={{ width: `${metrics.capaciteUtiliseePct}%` }}
                ></div>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Contract Alert Warning Banner if any contracts are expiring */}
      {metrics.contratsExpirantsCount > 0 && (
        <div className="bg-gradient-to-r from-amber-950/90 via-amber-900/80 to-amber-950/90 border-2 border-amber-500/60 p-4 rounded-2xl shadow-xl flex items-center justify-between gap-4 text-amber-100">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-500/20 rounded-xl text-amber-400">
              <AlertTriangle className="w-6 h-6 animate-bounce" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">
                Alerte Renouvellement de Contrats !
              </h3>
              <p className="text-xs text-amber-200/90">
                {metrics.contratsExpirantsCount} contrat(s) de prestataires arrivent à échéance dans moins de 30 jours ou sont déjà expirés.
              </p>
            </div>
          </div>
          <button
            onClick={() => setCurrentView('contrats')}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all shrink-0"
          >
            Vérifier les contrats
          </button>
        </div>
      )}

      {/* Main 8 Feature Actions Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span>
            <span>Menu Principal & Modules Fonctionnels</span>
          </h2>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Sélectionnez une fonctionnalité
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {mainButtons.map((btn, index) => {
            const Icon = btn.icon;
            return (
              <button
                key={index}
                onClick={btn.action}
                className={`group relative text-left p-5 rounded-2xl bg-gradient-to-br ${btn.color} shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden flex flex-col justify-between min-h-[160px]`}
              >
                <div className="flex items-start justify-between">
                  <div className="p-3 bg-white/10 rounded-xl backdrop-blur-md">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="px-2.5 py-1 text-[10px] font-bold bg-black/20 text-white/90 rounded-full border border-white/10">
                    {btn.badge}
                  </span>
                </div>

                <div>
                  <h3 className={`text-base font-black ${btn.textColor}`}>
                    {btn.title}
                  </h3>
                  <p className="text-xs text-white/80 mt-1 line-clamp-2">
                    {btn.subtitle}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Recent Waste Register Entries Table Preview */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-cyan-500/10 text-cyan-600 rounded-lg">
              <Droplets className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Dernières Entrées au Registre DDSD
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Enregistrements les plus récents - Division HSE
              </p>
            </div>
          </div>

          <button
            onClick={() => setCurrentView('dechets')}
            className="text-xs font-bold text-cyan-600 hover:text-cyan-500 dark:text-cyan-400 flex items-center gap-1"
          >
            <span>Voir tout</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">
                <th className="py-3 px-3">Nom du déchet</th>
                <th className="py-3 px-3">Type</th>
                <th className="py-3 px-3">Aspect</th>
                <th className="py-3 px-3">Quantité</th>
                <th className="py-3 px-3">Dangerosité</th>
                <th className="py-3 px-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
              {recentItems.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">
                    {item.nom}
                  </td>
                  <td className="py-3 px-3 text-slate-600 dark:text-slate-300">
                    {item.type}
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {item.aspect}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-semibold text-slate-800 dark:text-slate-200">
                    {item.quantite.toLocaleString()} {item.aspect === 'Liquide' ? 'L' : 'kg'}
                  </td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded-md font-bold text-[11px] ${
                      ['H3', 'H4', 'H5', 'H6', 'H7', 'H8', 'H10'].includes(item.dangerosite)
                        ? 'bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30'
                        : 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                    }`}>
                      {item.dangerosite}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-500 dark:text-slate-400">
                    {item.dateAjout}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
