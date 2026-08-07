import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ALGERIAN_LAWS } from '../data/constants';
import { 
  Scale, 
  Search, 
  BookOpen, 
  FileCheck2, 
  Globe, 
  Copy, 
  Check, 
  ExternalLink 
} from 'lucide-react';

export const LoisArticlesView: React.FC = () => {
  const { addToast } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredLaws = ALGERIAN_LAWS.filter(law => {
    const matchesSearch = 
      law.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      law.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      law.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (law.keyArticles && law.keyArticles.some(a => a.toLowerCase().includes(searchTerm.toLowerCase())));

    const matchesCat = selectedCategory === 'all' || law.category === selectedCategory;

    return matchesSearch && matchesCat;
  });

  const handleCopyLaw = (title: string, ref: string, id: string) => {
    navigator.clipboard.writeText(`${title} (${ref})`);
    setCopiedId(id);
    addToast('Référence juridique copiée dans le presse-papier !', 'success');
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Title Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl">
        <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
          <span className="p-2 bg-sky-500/10 text-sky-500 rounded-xl">
            <Scale className="w-5 h-5" />
          </span>
          <span>Cadre Juridique & Réglementations Algériennes</span>
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Lois, Décrets d'application et Conventions Internationales ratifiées par l'Algérie pour la gestion des déchets dangereux.
        </p>
      </div>

      {/* Search & Category Filter Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-md flex flex-col sm:flex-row items-center gap-3">
        
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher une loi, décret, article (ex: 01-19, PCB, BSD, Bâle)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full sm:w-64 px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-sky-500"
        >
          <option value="all">Toutes les catégories</option>
          <option value="Textes fondamentaux">Textes fondamentaux (Lois)</option>
          <option value="Décrets d'application">Décrets d'application</option>
          <option value="Conventions internationales">Conventions internationales</option>
        </select>

      </div>

      {/* Laws List Cards */}
      <div className="space-y-4">
        {filteredLaws.map(law => {
          let categoryBadge = 'bg-sky-500/10 text-sky-600 border-sky-500/20';
          let categoryIcon = <BookOpen className="w-4 h-4" />;

          if (law.category === 'Décrets d\'application') {
            categoryBadge = 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
            categoryIcon = <FileCheck2 className="w-4 h-4" />;
          } else if (law.category === 'Conventions internationales') {
            categoryBadge = 'bg-purple-500/10 text-purple-600 border-purple-500/20';
            categoryIcon = <Globe className="w-4 h-4" />;
          }

          return (
            <div 
              key={law.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-lg space-y-3 hover:border-sky-500/40 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border flex items-center gap-1.5 ${categoryBadge}`}>
                    {categoryIcon}
                    <span>{law.category}</span>
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">
                    {law.reference}
                  </span>
                </div>

                <button
                  onClick={() => handleCopyLaw(law.title, law.reference, law.id)}
                  className="px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300 text-xs font-semibold flex items-center gap-1.5 self-start sm:self-auto"
                >
                  {copiedId === law.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedId === law.id ? 'Copié' : 'Copier Référence'}</span>
                </button>
              </div>

              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  {law.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                  {law.description}
                </p>
              </div>

              {law.keyArticles && law.keyArticles.length > 0 && (
                <div className="bg-slate-50 dark:bg-slate-800/50 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-1 text-xs">
                  <p className="font-bold text-slate-800 dark:text-slate-200 text-[11px] uppercase tracking-wider">
                    Articles Clés & Obligations Industrialisées:
                  </p>
                  <ul className="list-disc pl-5 space-y-0.5 text-slate-600 dark:text-slate-300">
                    {law.keyArticles.map((art, idx) => (
                      <li key={idx}>{art}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
};
