import React from 'react';
import { HelpCircle, Mail, Phone, Flame, FileCheck, ShieldAlert, Award, ChevronRight } from 'lucide-react';
import { SonatrachLogo } from './SonatrachLogo';

export const AideView: React.FC = () => {
  return (
    <div className="space-y-6">
      
      {/* Title Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl">
        <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
          <span className="p-2 bg-sky-500/10 text-sky-500 rounded-xl">
            <HelpCircle className="w-5 h-5" />
          </span>
          <span>Aide, Documentation & Contacts — Division HSE</span>
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Guide d'utilisation et coordonnées techniques du développeur de la plateforme DDSD.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* User Guide */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl space-y-4 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-cyan-500" />
            <span>Guide d'utilisation de l'application</span>
          </h3>

          <div className="space-y-4">
            <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-2">
              <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <ChevronRight className="w-4 h-4 text-cyan-500" />
                <span>1. Enregistrement d'un nouveau déchet (Saisie)</span>
              </h4>
              <p>
                Rendez-vous sur l'onglet <strong className="text-slate-800 dark:text-slate-200">Saisie & Registre</strong>. Cliquez sur <strong>"Nouveau Déchet"</strong>, puis complétez le nom, le type, la provenance (unité), l'aspect physique (Solide, Liquide, Gaz) et le code de dangerosité HP1 à HP13.
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-2">
              <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <ChevronRight className="w-4 h-4 text-cyan-500" />
                <span>2. Exportation des Rapports (Excel & PDF)</span>
              </h4>
              <p>
                Vous pouvez exporter à tout moment l'intégralité du registre filtré en format <strong>Excel (.xlsx)</strong> ou générer un <strong>rapport PDF officiel</strong> imprimable intégrant l'en-tête de Sonatrach.
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-2">
              <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <ChevronRight className="w-4 h-4 text-cyan-500" />
                <span>3. Gestion des Contrats et Alerte Échéance</span>
              </h4>
              <p>
                L'application calcule automatiquement la validité des conventions avec les prestataires. Si un contrat arrive à échéance dans les 30 jours, un bandeau d'avertissement orange clignote pour vous inviter au renouvellement.
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-2">
              <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <ChevronRight className="w-4 h-4 text-cyan-500" />
                <span>4. Sauvegarde de la Base de Données</span>
              </h4>
              <p>
                Utilisez le bouton <strong>"Sauvegarder"</strong> dans la barre supérieure pour exporter une copie intégrale de sécurité en format JSON.
              </p>
            </div>
          </div>
        </div>

        {/* Developer Contact Card */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-cyan-950 border border-slate-800 rounded-3xl p-6 shadow-xl text-white space-y-6">
          <div className="flex items-center gap-3">
            <SonatrachLogo size="lg" subtext="Division HSE" variant="dark" />
          </div>

          <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 space-y-3 text-xs">
            <div className="flex items-center gap-2 text-cyan-400 font-bold uppercase tracking-wider text-[10px]">
              <Award className="w-4 h-4" />
              <span>Conception & Développement</span>
            </div>

            <p className="font-bold text-sm text-white">
              TAHALLAITI Mohamed
            </p>
            <p className="text-slate-300 text-[11px]">
              Ingénieur d'Application & Système de Gestion DDSD
            </p>

            <div className="pt-2 border-t border-slate-800 space-y-2 text-slate-300">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-orange-400 shrink-0" />
                <a href="mailto:TAHALLAITI.MED@GMAIL.COM" className="hover:text-cyan-300 underline font-mono text-[11px]">
                  TAHALLAITI.MED@GMAIL.COM
                </a>
              </div>

              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-mono text-[11px]">07 99 49 24 00</span>
              </div>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 leading-relaxed border-t border-slate-800 pt-4">
            Application de Gestion des Déchets Solides Dangereux (DDSD) v1.0.0 — Conforme aux exigences HSE et aux normes environnementales algériennes.
          </div>
        </div>

      </div>

    </div>
  );
};
