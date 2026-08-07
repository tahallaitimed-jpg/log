import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Contractor, TypePrestation } from '../types';
import * as XLSX from 'xlsx';
import { exportContractorsToPDF, exportContractorsToExcel } from '../utils/exportUtils';
import { 
  Users, 
  Plus, 
  Search, 
  Star, 
  Phone, 
  Mail, 
  FileCheck, 
  Edit, 
  Trash2, 
  FileSpreadsheet, 
  FileText,
  X, 
  Building2, 
  AlertCircle 
} from 'lucide-react';

export const PrestatairesView: React.FC = () => {
  const { 
    contractors, 
    addContractor, 
    updateContractor, 
    deleteContractor, 
    contracts,
    setSelectedContractorForContract,
    setCurrentView,
    addToast,
    currentUser
  } = useApp();

  const isAdmin = currentUser?.role === 'admin';

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContractor, setEditingContractor] = useState<Contractor | null>(null);

  // Form Fields
  const [identifiant, setIdentifiant] = useState('');
  const [nom, setNom] = useState('');
  const [code, setCode] = useState('');
  const [telephone, setTelephone] = useState('');
  const [email, setEmail] = useState('');
  const [typePrestataire, setTypePrestataire] = useState<TypePrestation>('Collecte');
  const [specialite, setSpecialite] = useState('');
  const [rating, setRating] = useState('8.5');
  const [notes, setNotes] = useState('');

  // Delete Confirm
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleOpenAddModal = () => {
    setEditingContractor(null);
    setIdentifiant(`PREST-00${contractors.length + 1}`);
    setNom('');
    setCode('');
    setTelephone('');
    setEmail('');
    setTypePrestataire('Collecte');
    setSpecialite('');
    setRating('8.0');
    setNotes('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (c: Contractor) => {
    setEditingContractor(c);
    setIdentifiant(c.identifiant);
    setNom(c.nom);
    setCode(c.code);
    setTelephone(c.telephone);
    setEmail(c.email);
    setTypePrestataire(c.typePrestataire);
    setSpecialite(c.specialite);
    setRating(c.rating.toString());
    setNotes(c.notes);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!nom.trim() || !telephone.trim() || !code.trim()) {
      addToast('Nom, Code et Téléphone sont obligatoires', 'error');
      return;
    }

    const rNum = parseFloat(rating) || 8.0;

    if (editingContractor) {
      updateContractor(editingContractor.id, {
        identifiant,
        nom: nom.trim(),
        code: code.trim(),
        telephone: telephone.trim(),
        email: email.trim(),
        typePrestataire,
        specialite: specialite.trim(),
        rating: rNum,
        notes: notes.trim()
      });
    } else {
      addContractor({
        identifiant,
        nom: nom.trim(),
        code: code.trim(),
        telephone: telephone.trim(),
        email: email.trim(),
        typePrestataire,
        specialite: specialite.trim(),
        rating: rNum,
        notes: notes.trim()
      });
    }

    setIsModalOpen(false);
  };

  // Filtered Contractors
  const filteredContractors = contractors.filter(c => {
    const matchesSearch = 
      c.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.specialite.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.identifiant.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = filterType === 'all' || c.typePrestataire === filterType;

    return matchesSearch && matchesType;
  });

  // Export Excel & PDF
  const exportExcel = () => {
    if (filteredContractors.length === 0) {
      addToast('Aucune donnée à exporter', 'warning');
      return;
    }
    exportContractorsToExcel(filteredContractors, 'repertoire_prestataires_sonatrach_gp1z');
    addToast('Liste des prestataires exportée en Excel !', 'success');
  };

  const exportPDF = () => {
    if (filteredContractors.length === 0) {
      addToast('Aucune donnée à exporter', 'warning');
      return;
    }
    exportContractorsToPDF(filteredContractors, currentUser?.username || 'Division HSE');
    addToast('Répertoire PDF des prestataires Sonatrach généré !', 'success');
  };

  const handleManageContracts = (contractorId: number) => {
    setSelectedContractorForContract(contractorId);
    setCurrentView('contrats');
  };

  return (
    <div className="space-y-6">
      
      {/* Title & Action Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <span className="p-2 bg-teal-500/10 text-teal-500 rounded-xl">
              <Building2 className="w-5 h-5" />
            </span>
            <span>Répertoire des Prestataires Agréés</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Entreprises partenaires agréées pour le ramassage, transport et élimination des déchets dangereux
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={exportExcel}
            className="px-3.5 py-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 font-bold text-xs flex items-center gap-2 transition-colors"
            title="Exporter en Excel"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Excel</span>
          </button>

          <button
            onClick={exportPDF}
            className="px-3.5 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30 font-bold text-xs flex items-center gap-2 transition-colors"
            title="Exporter en PDF Officiel"
          >
            <FileText className="w-4 h-4" />
            <span>PDF Officiel</span>
          </button>

          <button
            onClick={handleOpenAddModal}
            className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-md shadow-teal-900/20 flex items-center gap-2 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Nouveau Prestataire</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-md flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher par nom, code, spécialité..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="w-full sm:w-64 px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-teal-500"
        >
          <option value="all">Tous les types de prestations</option>
          <option value="Collecte">Collecte</option>
          <option value="Transport">Transport</option>
          <option value="Traitement">Traitement</option>
          <option value="Élimination">Élimination</option>
          <option value="Recyclage">Recyclage</option>
          <option value="Autre">Autre</option>
        </select>
      </div>

      {/* Contractors Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredContractors.map(c => {
          const hasActiveContract = contracts.some(cnt => cnt.prestataireId === c.id && cnt.status === 'Actif');
          const isHighRated = c.rating >= 8.5;

          return (
            <div 
              key={c.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between hover:border-teal-500/50 transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 font-mono text-[10px] font-bold text-slate-500">
                      {c.identifiant} ({c.code})
                    </span>
                    <h3 className="text-base font-black text-slate-900 dark:text-white mt-1">
                      {c.nom}
                    </h3>
                  </div>

                  <div className="flex items-center gap-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 px-2.5 py-1 rounded-xl text-xs font-bold border border-amber-500/20">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{c.rating}/10</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="px-2.5 py-1 rounded-full font-bold bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20">
                    {c.typePrestataire}
                  </span>

                  <span className={`px-2.5 py-1 rounded-full font-bold ${
                    hasActiveContract 
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' 
                      : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                  }`}>
                    {hasActiveContract ? 'Contrat Actif' : 'Aucun contrat actif'}
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                  <strong className="text-slate-900 dark:text-white">Spécialité:</strong> {c.specialite}
                </p>

                <div className="space-y-1 text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{c.telephone}</span>
                  </div>
                  {c.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      <span>{c.email}</span>
                    </div>
                  )}
                </div>

                {c.notes && (
                  <p className="text-[11px] text-slate-400 italic bg-slate-50 dark:bg-slate-800/40 p-2.5 rounded-xl">
                    "{c.notes}"
                  </p>
                )}
              </div>

              {/* Card Footer Actions */}
              <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <button
                  onClick={() => handleManageContracts(c.id)}
                  className="px-3 py-1.5 rounded-xl bg-cyan-600/10 hover:bg-cyan-600/20 text-cyan-600 dark:text-cyan-400 font-bold text-xs flex items-center gap-1.5 transition-colors"
                >
                  <FileCheck className="w-3.5 h-3.5" />
                  <span>Gérer Contrats</span>
                </button>

                <div className="flex items-center gap-1">
                  {isAdmin ? (
                    <>
                      <button
                        onClick={() => handleOpenEditModal(c)}
                        className="p-2 rounded-lg text-slate-400 hover:text-cyan-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        title="Modifier (Admin)"
                      >
                        <Edit className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => setDeletingId(c.id)}
                        className="p-2 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        title="Supprimer (Admin)"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <span 
                      className="text-[10px] text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded"
                      title="Seul l'administrateur peut modifier ou supprimer"
                    >
                      Lecture seule
                    </span>
                  )}
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* Modal Add / Edit Contractor */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Building2 className="w-5 h-5 text-teal-500" />
                <span>{editingContractor ? 'Modifier Prestataire' : 'Nouveau Prestataire Agréé'}</span>
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Identifiant Unique
                  </label>
                  <input
                    type="text"
                    required
                    value={identifiant}
                    onChange={(e) => setIdentifiant(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Nom de l'entreprise *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="ex: SARL EcoClean Algérie"
                    value={nom}
                    onChange={(e) => setNom(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Code Prestataire *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="ex: ECO-ALG-01"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Type de Prestation *
                  </label>
                  <select
                    value={typePrestataire}
                    onChange={(e) => setTypePrestataire(e.target.value as TypePrestation)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                  >
                    <option value="Collecte">Collecte</option>
                    <option value="Transport">Transport</option>
                    <option value="Traitement">Traitement</option>
                    <option value="Élimination">Élimination</option>
                    <option value="Recyclage">Recyclage</option>
                    <option value="Autre">Autre</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Téléphone *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="+213 41 XX XX XX"
                    value={telephone}
                    onChange={(e) => setTelephone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Adresse Email
                  </label>
                  <input
                    type="email"
                    placeholder="contact@societe.dz"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Spécialité & Équipements
                  </label>
                  <input
                    type="text"
                    placeholder="ex: Pompage de boues pétrolières, Camions citernes ADR"
                    value={specialite}
                    onChange={(e) => setSpecialite(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Note d'évaluation (/10)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="10"
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Notes complémentaires
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Certifications ISO, numéros d'agréments ministériels..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                  />
                </div>

              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-md"
                >
                  Enregistrer
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* Modal Delete Confirm */}
      {deletingId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-500">
              <AlertCircle className="w-6 h-6" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Supprimer le Prestataire
              </h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Êtes-vous sûr de vouloir supprimer ce prestataire ? Tous les contrats associés seront également impactés.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeletingId(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs"
              >
                Annuler
              </button>
              <button
                onClick={() => {
                  deleteContractor(deletingId);
                  setDeletingId(null);
                }}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
