import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Contract, TypePrestation } from '../types';
import { exportContractsToPDF, exportContractsToExcel } from '../utils/exportUtils';
import { 
  FileText, 
  Plus, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Download, 
  Eye, 
  Edit, 
  Trash2, 
  Paperclip, 
  X, 
  Building2,
  Calendar,
  DollarSign,
  FileSpreadsheet
} from 'lucide-react';

export const ContratsView: React.FC = () => {
  const { 
    contracts, 
    contractors, 
    addContract, 
    updateContract, 
    deleteContract,
    selectedContractorForContract,
    setSelectedContractorForContract,
    addToast,
    currentUser
  } = useApp();

  const isAdmin = currentUser?.role === 'admin';

  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterContractor, setFilterContractor] = useState<string>(
    selectedContractorForContract ? selectedContractorForContract.toString() : 'all'
  );

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContract, setEditingContract] = useState<Contract | null>(null);

  // Form Fields
  const [prestataireId, setPrestataireId] = useState<number>(
    selectedContractorForContract || (contractors[0]?.id || 1)
  );
  const [typeContrat, setTypeContrat] = useState<TypePrestation>('Traitement');
  const [dateDebut, setDateDebut] = useState(new Date().toISOString().split('T')[0]);
  const [dateFin, setDateFin] = useState(() => {
    const d = new Date();
    d.setFullYear(d.getFullYear() + 1);
    return d.toISOString().split('T')[0];
  });
  const [montant, setMontant] = useState('');
  const [notes, setNotes] = useState('');
  const [fichierPath, setFichierPath] = useState('');
  const [fichierDataUrl, setFichierDataUrl] = useState('');
  const [fichierSize, setFichierSize] = useState('');

  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  // Attachment Viewer Modal State
  const [viewingFile, setViewingFile] = useState<Contract | null>(null);

  // Delete Confirm
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFichierPath(file.name);
      const sizeStr = file.size > 1024 * 1024 
        ? `${(file.size / (1024 * 1024)).toFixed(2)} MB` 
        : `${(file.size / 1024).toFixed(0)} KB`;
      setFichierSize(sizeStr);

      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setFichierDataUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
      addToast(`Fichier "${file.name}" sélectionné (${sizeStr})`, 'success');
    }
  };

  const handleOpenAddModal = () => {
    setEditingContract(null);
    setPrestataireId(selectedContractorForContract || (contractors[0]?.id || 1));
    setTypeContrat('Traitement');
    setDateDebut(new Date().toISOString().split('T')[0]);
    const d = new Date();
    d.setFullYear(d.getFullYear() + 1);
    setDateFin(d.toISOString().split('T')[0]);
    setMontant('');
    setNotes('');
    setFichierPath('');
    setFichierDataUrl('');
    setFichierSize('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (c: Contract) => {
    setEditingContract(c);
    setPrestataireId(c.prestataireId);
    setTypeContrat(c.typeContrat);
    setDateDebut(c.dateDebut);
    setDateFin(c.dateFin);
    setMontant(c.montant ? c.montant.toString() : '');
    setNotes(c.notes);
    setFichierPath(c.fichierPath || '');
    setFichierDataUrl(c.fichierDataUrl || '');
    setFichierSize(c.fichierSize || '');
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const mNum = parseInt(montant, 10) || 0;
    const finalFileName = fichierPath || 'contrat_convention_sonatrach.pdf';

    if (editingContract) {
      updateContract(editingContract.id, {
        prestataireId,
        typeContrat,
        dateDebut,
        dateFin,
        montant: mNum,
        notes: notes.trim(),
        fichierPath: finalFileName,
        fichierDataUrl,
        fichierSize
      });
    } else {
      addContract({
        prestataireId,
        typeContrat,
        dateDebut,
        dateFin,
        montant: mNum,
        notes: notes.trim(),
        fichierPath: finalFileName,
        fichierDataUrl,
        fichierSize
      });
    }

    setIsModalOpen(false);
  };

  // Filter logic
  const filteredContracts = contracts.filter(c => {
    const matchesStatus = filterStatus === 'all' || c.status === filterStatus;
    const matchesContractor = filterContractor === 'all' || c.prestataireId.toString() === filterContractor;
    return matchesStatus && matchesContractor;
  });

  // Calculate Expiring
  const expiringContracts = contracts.filter(c => c.status === 'À renouveler' || c.status === 'Expiré');

  return (
    <div className="space-y-6">
      
      {/* Title & Action Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <span className="p-2 bg-amber-500/10 text-amber-500 rounded-xl">
              <FileText className="w-5 h-5" />
            </span>
            <span>Gestion des Contrats & Conventions</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Suivi des échéances, montants, clauses contractuelles et documents officiels
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => {
              if (filteredContracts.length === 0) {
                addToast('Aucun contrat à exporter', 'warning');
                return;
              }
              exportContractsToExcel(filteredContracts, contractors);
              addToast('Fichier Excel des contrats exporté !', 'success');
            }}
            className="px-3.5 py-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 font-bold text-xs flex items-center gap-2 transition-colors"
            title="Exporter la liste des contrats en Excel"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Excel</span>
          </button>

          <button
            onClick={() => {
              if (filteredContracts.length === 0) {
                addToast('Aucun contrat à exporter', 'warning');
                return;
              }
              exportContractsToPDF(filteredContracts, contractors, currentUser?.username || 'Division HSE');
              addToast('Document PDF des contrats Sonatrach généré !', 'success');
            }}
            className="px-3.5 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30 font-bold text-xs flex items-center gap-2 transition-colors"
            title="Exporter le Répertoire des Contrats en PDF Officiel"
          >
            <FileText className="w-4 h-4" />
            <span>PDF Officiel</span>
          </button>

          <button
            onClick={handleOpenAddModal}
            className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-xs shadow-md shadow-amber-900/20 flex items-center gap-2 transition-all transform hover:scale-105"
          >
            <Plus className="w-4 h-4" />
            <span>Nouveau Contrat</span>
          </button>
        </div>
      </div>

      {/* Expiring Alert Banner */}
      {expiringContracts.length > 0 && (
        <div className="bg-amber-500/10 border-2 border-amber-500/40 p-4 rounded-2xl flex items-center justify-between gap-4 text-amber-200">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-amber-400 shrink-0 animate-pulse" />
            <div className="text-xs">
              <h4 className="font-bold text-amber-400 text-sm">
                Attention: {expiringContracts.length} contrat(s) requièrent une révision
              </h4>
              <p className="text-amber-200/80 mt-0.5">
                {expiringContracts.map(c => {
                  const p = contractors.find(x => x.id === c.prestataireId);
                  return `${p?.nom || 'Prestataire'} (Échéance: ${c.dateFin})`;
                }).join(' • ')}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Filter Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-md grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">
            Filtrer par Statut du contrat
          </label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
          >
            <option value="all">Tous les statuts ({contracts.length})</option>
            <option value="Actif">Actifs</option>
            <option value="À renouveler">À renouveler (&lt; 30 jours)</option>
            <option value="Expiré">Expirés</option>
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">
            Filtrer par Prestataire
          </label>
          <select
            value={filterContractor}
            onChange={(e) => {
              setFilterContractor(e.target.value);
              setSelectedContractorForContract(e.target.value === 'all' ? null : parseInt(e.target.value, 10));
            }}
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
          >
            <option value="all">Tous les prestataires</option>
            {contractors.map(c => (
              <option key={c.id} value={c.id}>{c.nom} ({c.code})</option>
            ))}
          </select>
        </div>
      </div>

      {/* Contracts Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-800 text-white uppercase text-[11px] font-bold tracking-wider">
                <th className="py-3.5 px-4">ID</th>
                <th className="py-3.5 px-4">Prestataire Agréé</th>
                <th className="py-3.5 px-4">Type de Contrat</th>
                <th className="py-3.5 px-4">Période de Validité</th>
                <th className="py-3.5 px-4 text-right">Montant (DZD)</th>
                <th className="py-3.5 px-4">Statut</th>
                <th className="py-3.5 px-4">Document Fichier</th>
                <th className="py-3.5 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredContracts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-slate-400">
                    Aucun contrat ne correspond aux critères sélectionnés.
                  </td>
                </tr>
              ) : (
                filteredContracts.map(c => {
                  const contractor = contractors.find(p => p.id === c.prestataireId);

                  return (
                    <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-slate-500">
                        #{c.id}
                      </td>

                      <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                        <div>{contractor?.nom || `Prestataire #${c.prestataireId}`}</div>
                        <div className="text-[10px] font-normal text-slate-400">Code: {contractor?.code}</div>
                      </td>

                      <td className="py-3 px-4">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                          {c.typeContrat}
                        </span>
                      </td>

                      <td className="py-3 px-4 font-mono text-[11px] text-slate-600 dark:text-slate-300">
                        {c.dateDebut} &rarr; <span className="font-bold">{c.dateFin}</span>
                      </td>

                      <td className="py-3 px-4 text-right font-bold text-slate-900 dark:text-white">
                        {c.montant ? c.montant.toLocaleString('fr-DZ') : '—'} <span className="text-[10px] text-slate-400 font-normal">DZD</span>
                      </td>

                      <td className="py-3 px-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 w-max ${
                          c.status === 'Actif' 
                            ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30' 
                            : c.status === 'À renouveler' 
                            ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                            : 'bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30'
                        }`}>
                          {c.status === 'Actif' && <CheckCircle2 className="w-3 h-3" />}
                          {c.status === 'À renouveler' && <AlertTriangle className="w-3 h-3" />}
                          {c.status === 'Expiré' && <XCircle className="w-3 h-3" />}
                          <span>{c.status}</span>
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        {c.fichierPath ? (
                          <button
                            onClick={() => setViewingFile(c)}
                            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-[11px] font-medium transition-colors"
                          >
                            <Paperclip className="w-3.5 h-3.5 text-cyan-500" />
                            <span className="truncate max-w-[100px]">{c.fichierPath}</span>
                          </button>
                        ) : (
                          <span className="text-slate-400 italic">Aucun document</span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          {c.fichierPath && (
                            <button
                              onClick={() => setViewingFile(c)}
                              className="p-1.5 text-slate-400 hover:text-cyan-500 rounded-lg"
                              title="Consulter le fichier"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          )}

                          {isAdmin ? (
                            <>
                              <button
                                onClick={() => handleOpenEditModal(c)}
                                className="p-1.5 text-slate-400 hover:text-cyan-500 rounded-lg"
                                title="Modifier (Admin)"
                              >
                                <Edit className="w-4 h-4" />
                              </button>

                              <button
                                onClick={() => setDeletingId(c.id)}
                                className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg"
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
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add / Edit Contract */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-500" />
                <span>{editingContract ? `Modifier Contrat #${editingContract.id}` : 'Créer un Nouveau Contrat'}</span>
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                
                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Sélectionner le Prestataire *
                  </label>
                  <select
                    value={prestataireId}
                    onChange={(e) => setPrestataireId(parseInt(e.target.value, 10))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                  >
                    {contractors.map(p => (
                      <option key={p.id} value={p.id}>{p.nom} ({p.code})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Type de Contrat *
                  </label>
                  <select
                    value={typeContrat}
                    onChange={(e) => setTypeContrat(e.target.value as TypePrestation)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                  >
                    <option value="Traitement">Traitement</option>
                    <option value="Collecte">Collecte</option>
                    <option value="Transport">Transport</option>
                    <option value="Élimination">Élimination</option>
                    <option value="Recyclage">Recyclage</option>
                    <option value="Autre">Autre</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Montant Global (DZD)
                  </label>
                  <input
                    type="number"
                    placeholder="ex: 18500000"
                    value={montant}
                    onChange={(e) => setMontant(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Date de Début *
                  </label>
                  <input
                    type="date"
                    required
                    value={dateDebut}
                    onChange={(e) => setDateDebut(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Date de Fin *
                  </label>
                  <input
                    type="date"
                    required
                    value={dateFin}
                    onChange={(e) => setDateFin(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                  />
                </div>

                {/* Case pour joindre le fichier du contrat */}
                <div className="sm:col-span-2 space-y-1.5">
                  <label className="block font-bold text-slate-700 dark:text-slate-300">
                    Document / Pièce Jointe du Contrat (PDF, Scan, Image) *
                  </label>
                  
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.scan"
                    className="hidden"
                  />

                  {fichierPath ? (
                    <div className="flex items-center justify-between p-3 rounded-2xl bg-amber-500/10 border-2 border-amber-500/40 text-amber-900 dark:text-amber-200">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="p-2 bg-amber-500 rounded-xl text-slate-950 font-bold shrink-0">
                          <Paperclip className="w-4 h-4" />
                        </div>
                        <div className="truncate">
                          <p className="font-bold text-xs truncate">{fichierPath}</p>
                          <p className="text-[10px] text-amber-700 dark:text-amber-300">
                            {fichierSize || 'Fichier joint prêt à être enregistré'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-xs font-semibold"
                        >
                          Changer
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setFichierPath('');
                            setFichierDataUrl('');
                            setFichierSize('');
                          }}
                          className="p-1 hover:text-rose-500"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-amber-500 dark:hover:border-amber-500 rounded-2xl p-5 text-center cursor-pointer bg-slate-50 dark:bg-slate-800/50 hover:bg-amber-500/5 transition-all group"
                    >
                      <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Paperclip className="w-5 h-5" />
                      </div>
                      <p className="font-bold text-xs text-slate-800 dark:text-slate-200">
                        Cliquez pour joindre le fichier du contrat (PDF, DOCX, Image)
                      </p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                        Glissez-déposez la convention scanné ou le contrat signé
                      </p>
                    </div>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Notes & Clauses particulières
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Précisions sur les volumes garantis, pénalités de retard..."
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
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-xs shadow-md"
                >
                  Enregistrer
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* Contract Attachment Preview Modal */}
      {viewingFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-4 text-white">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Paperclip className="w-5 h-5 text-cyan-400" />
                <h3 className="font-bold text-sm">
                  Document Officiel: {viewingFile.fichierPath}
                </h3>
              </div>
              <button onClick={() => setViewingFile(null)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4 text-xs font-sans">
              <div className="text-center text-cyan-400 font-bold text-sm border-b border-slate-800 pb-2">
                SONATRACH DIVISION HSE — DOCUMENT CONVENTIONAL
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                <p><strong>Contrat ID:</strong> #{viewingFile.id}</p>
                <p><strong>Type Prestation:</strong> {viewingFile.typeContrat}</p>
                <p><strong>Période:</strong> {viewingFile.dateDebut} au {viewingFile.dateFin}</p>
                <p><strong>Montant Contractuel:</strong> {viewingFile.montant.toLocaleString('fr-DZ')} DZD</p>
                <p><strong>Fichier Joint:</strong> {viewingFile.fichierPath || 'N/A'}</p>
                <p><strong>Taille:</strong> {viewingFile.fichierSize || 'Standard PDF'}</p>
              </div>

              {/* Image preview if dataUrl is image */}
              {viewingFile.fichierDataUrl && viewingFile.fichierDataUrl.startsWith('data:image') && (
                <div className="mt-3 p-2 bg-slate-900 rounded-xl border border-slate-800 max-h-64 overflow-auto flex justify-center">
                  <img 
                    src={viewingFile.fichierDataUrl} 
                    alt="Aperçu du contrat joint" 
                    className="max-h-60 rounded object-contain" 
                  />
                </div>
              )}

              <p className="text-slate-400 text-[11px] pt-2 border-t border-slate-800 font-mono">
                Clause: {viewingFile.notes || 'Convention enregistrée en conformité avec la loi 01-19 relative aux déchets.'}
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => {
                  if (viewingFile.fichierDataUrl) {
                    const a = document.createElement('a');
                    a.href = viewingFile.fichierDataUrl;
                    a.download = viewingFile.fichierPath || 'contrat_sonatrach.pdf';
                    a.click();
                    addToast(`Téléchargement de ${viewingFile.fichierPath}`, 'success');
                  } else {
                    addToast(`Téléchargement du document ${viewingFile.fichierPath} (Simulation)`, 'success');
                  }
                  setViewingFile(null);
                }}
                className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Télécharger le Fichier Joint</span>
              </button>
              <button
                onClick={() => setViewingFile(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Supprimer le Contrat
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Êtes-vous sûr de vouloir supprimer définitivement ce contrat ?
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
                  deleteContract(deletingId);
                  setDeletingId(null);
                }}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs"
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
