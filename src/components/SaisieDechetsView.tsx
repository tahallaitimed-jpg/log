import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { WasteItem, CodeDangerosite, AspectPhysique, TypeDechet } from '../types';
import { HP_DANGER_CODES, getPermissionsForUser } from '../data/constants';
import { 
  exportWasteItemsToPDF, 
  exportWasteItemsToExcel, 
  exportWasteItemFichePDF 
} from '../utils/exportUtils';
import { 
  Plus, 
  Search, 
  FileSpreadsheet, 
  FileText, 
  Printer, 
  Edit, 
  Trash2, 
  AlertCircle, 
  X, 
  CheckCircle2, 
  Filter,
  ShieldAlert,
  Calendar,
  Layers,
  Droplet,
  Download
} from 'lucide-react';

export const SaisieDechetsView: React.FC = () => {
  const { 
    wasteItems, 
    addWasteItem, 
    updateWasteItem, 
    deleteWasteItem, 
    currentUser,
    addToast
  } = useApp();

  // Search & Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterDanger, setFilterDanger] = useState<string>('all');
  const [filterAspect, setFilterAspect] = useState<string>('all');

  // Form Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<WasteItem | null>(null);

  // Form Fields
  const [nom, setNom] = useState('');
  const [type, setType] = useState<TypeDechet>('Industriel');
  const [customType, setCustomType] = useState('');
  const [aspect, setAspect] = useState<AspectPhysique>('Solide');
  const [source, setSource] = useState('');
  const [quantite, setQuantite] = useState('');
  const [dangerosite, setDangerosite] = useState<CodeDangerosite>('H3');
  const [dateAjout, setDateAjout] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');

  // Delete Confirm Modal
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Open Add Modal
  const handleOpenAddModal = () => {
    setEditingItem(null);
    setNom('');
    setType('Industriel');
    setCustomType('');
    setAspect('Solide');
    setSource('');
    setQuantite('');
    setDangerosite('H3');
    setDateAjout(new Date().toISOString().split('T')[0]);
    setDescription('');
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (item: WasteItem) => {
    setEditingItem(item);
    setNom(item.nom);
    if (['Chimique', 'Biologique', 'Radioactif', 'Électronique', 'Médical', 'Industriel', 'Construction', 'Ménager'].includes(item.type)) {
      setType(item.type as TypeDechet);
      setCustomType('');
    } else {
      setType('Autre');
      setCustomType(item.type);
    }
    setAspect(item.aspect);
    setSource(item.source);
    setQuantite(item.quantite.toString());
    setDangerosite(item.dangerosite);
    setDateAjout(item.dateAjout);
    setDescription(item.description);
    setIsModalOpen(true);
  };

  // Submit Form
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!nom.trim() || !source.trim() || !quantite.trim()) {
      addToast('Veuillez remplir tous les champs obligatoires (*)', 'error');
      return;
    }

    const qNum = parseInt(quantite, 10);
    if (isNaN(qNum) || qNum <= 0) {
      addToast('La quantité doit être un nombre positif supérieur à zéro', 'error');
      return;
    }

    const finalType = type === 'Autre' && customType.trim() ? customType.trim() : type;

    if (editingItem) {
      updateWasteItem(editingItem.id, {
        nom: nom.trim(),
        type: finalType,
        aspect,
        source: source.trim(),
        quantite: qNum,
        dangerosite,
        dateAjout,
        description: description.trim()
      });
    } else {
      addWasteItem({
        nom: nom.trim(),
        type: finalType,
        aspect,
        source: source.trim(),
        quantite: qNum,
        dangerosite,
        dateAjout,
        description: description.trim(),
        createdBy: currentUser ? currentUser.username : 'Opérateur'
      });
    }

    setIsModalOpen(false);
  };

  // Filter Logic
  const filteredItems = wasteItems.filter(item => {
    const matchesSearch = 
      item.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.dangerosite.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.type.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = filterType === 'all' || item.type === filterType;
    const matchesDanger = filterDanger === 'all' || item.dangerosite === filterDanger;
    const matchesAspect = filterAspect === 'all' || item.aspect === filterAspect;

    return matchesSearch && matchesType && matchesDanger && matchesAspect;
  });

  // Export to Excel using XLSX
  const exportToExcel = () => {
    if (filteredItems.length === 0) {
      addToast('Aucune donnée à exporter', 'warning');
      return;
    }
    exportWasteItemsToExcel(filteredItems, 'registre_ddsd_sonatrach_gp1z');
    addToast('Fichier Excel structuré et mis en page téléchargé !', 'success');
  };

  const userPerms = getPermissionsForUser(currentUser);
  const canEdit = userPerms.canEditDechets || currentUser?.role === 'admin';
  const canExport = userPerms.canExportData || currentUser?.role === 'admin';

  // Export to PDF using jsPDF + autoTable
  const exportToPDF = () => {
    if (filteredItems.length === 0) {
      addToast('Aucune donnée à exporter', 'warning');
      return;
    }
    exportWasteItemsToPDF(
      filteredItems, 
      'REGISTRE OFFICIEL DE TRAÇABILITÉ DES DÉCHETS SOLIDES DANGEREUX',
      currentUser?.username || 'Division HSE'
    );
    addToast('Document PDF officiel Sonatrach généré avec succès !', 'success');
  };

  // Print view trigger
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      
      {/* Title & Action Buttons Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <span className="p-2 bg-orange-500/10 text-orange-500 rounded-xl">
              <Droplet className="w-5 h-5" />
            </span>
            <span>Registre & Saisie des Déchets Dangereux</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Gestion du répertoire des déchets spéciaux et dangereux — SONATRACH Division HSE
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleOpenAddModal}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-900/20 flex items-center gap-2 transition-all transform hover:scale-105"
          >
            <Plus className="w-4 h-4" />
            <span>Nouveau Déchet</span>
          </button>

          <button
            onClick={exportToExcel}
            className="px-3.5 py-2.5 rounded-xl bg-emerald-900/20 hover:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 font-semibold text-xs flex items-center gap-2 transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
            <span>Excel</span>
          </button>

          <button
            onClick={exportToPDF}
            className="px-3.5 py-2.5 rounded-xl bg-sky-900/20 hover:bg-sky-900/40 text-sky-700 dark:text-sky-300 border border-sky-500/30 font-semibold text-xs flex items-center gap-2 transition-colors"
          >
            <FileText className="w-4 h-4 text-sky-500" />
            <span>PDF</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs flex items-center gap-2 transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimer</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Controls Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-md grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        
        {/* Text Search */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher par nom, source, code HP..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500 outline-none"
          />
        </div>

        {/* Filter Type */}
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500 outline-none"
        >
          <option value="all">Tous les types de déchets</option>
          <option value="Chimique">Chimique</option>
          <option value="Industriel">Industriel</option>
          <option value="Biologique">Biologique</option>
          <option value="Radioactif">Radioactif</option>
          <option value="Électronique">Électronique</option>
          <option value="Médical">Médical</option>
          <option value="Construction">Construction</option>
          <option value="Ménager">Ménager</option>
        </select>

        {/* Filter Danger Code */}
        <select
          value={filterDanger}
          onChange={(e) => setFilterDanger(e.target.value)}
          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500 outline-none"
        >
          <option value="all">Tous les codes HP (Danger)</option>
          {Object.keys(HP_DANGER_CODES).map(hp => (
            <option key={hp} value={hp}>
              {hp} - {HP_DANGER_CODES[hp as CodeDangerosite].label}
            </option>
          ))}
        </select>

        {/* Filter Aspect */}
        <select
          value={filterAspect}
          onChange={(e) => setFilterAspect(e.target.value)}
          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500 outline-none"
        >
          <option value="all">Tous les états physiques</option>
          <option value="Solide">Solide</option>
          <option value="Liquide">Liquide</option>
          <option value="Gaz">Gaz</option>
        </select>

      </div>

      {/* Main Waste Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-800 text-white uppercase text-[11px] font-bold tracking-wider">
                <th className="py-3.5 px-4">ID</th>
                <th className="py-3.5 px-4">Nom du déchet</th>
                <th className="py-3.5 px-4">Type</th>
                <th className="py-3.5 px-4">Aspect</th>
                <th className="py-3.5 px-4">Provenance / Unité</th>
                <th className="py-3.5 px-4 text-right">Quantité</th>
                <th className="py-3.5 px-4">Dangerosité (HP)</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    <AlertCircle className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                    <p className="font-semibold text-sm">Aucun déchet trouvé dans le registre</p>
                    <p className="text-xs mt-1">Ajustez vos filtres de recherche ou ajoutez un nouvel enregistrement.</p>
                  </td>
                </tr>
              ) : (
                filteredItems.map(item => {
                  const dangerObj = HP_DANGER_CODES[item.dangerosite];
                  const isHighHazard = dangerObj?.isHighRisk;
                  const isHighQty = item.quantite > 1000;

                  return (
                    <tr 
                      key={item.id}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <td className="py-3 px-4 font-mono font-bold text-slate-500 dark:text-slate-400">
                        #{item.id}
                      </td>

                      <td className="py-3 px-4 font-bold text-slate-900 dark:text-white max-w-xs">
                        <div>{item.nom}</div>
                        {item.description && (
                          <div className="text-[10px] font-normal text-slate-400 truncate mt-0.5">
                            {item.description}
                          </div>
                        )}
                      </td>

                      <td className="py-3 px-4 text-slate-700 dark:text-slate-300">
                        {item.type}
                      </td>

                      <td className="py-3 px-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          item.aspect === 'Liquide' 
                            ? 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20' 
                            : item.aspect === 'Solide' 
                            ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                            : 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20'
                        }`}>
                          {item.aspect}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-slate-600 dark:text-slate-300 max-w-xs truncate">
                        {item.source}
                      </td>

                      <td className="py-3 px-4 text-right font-bold text-slate-900 dark:text-white">
                        <span className={isHighQty ? 'text-amber-600 dark:text-amber-400 font-extrabold' : ''}>
                          {item.quantite.toLocaleString()}
                        </span>
                        <span className="text-[10px] text-slate-400 ml-1 font-normal">
                          {item.aspect === 'Liquide' ? 'L' : 'kg'}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          <span className={`px-2 py-0.5 rounded-md font-black text-[11px] ${
                            isHighHazard 
                              ? 'bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30' 
                              : 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                          }`}>
                            {item.dangerosite}
                          </span>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 truncate max-w-[120px]">
                            {dangerObj?.label}
                          </span>
                        </div>
                      </td>

                      <td className="py-3 px-4 text-slate-500 dark:text-slate-400 font-mono text-[11px]">
                        {item.dateAjout}
                      </td>

                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          {canExport && (
                            <button
                              onClick={() => {
                                exportWasteItemFichePDF(item, currentUser?.username || 'Division HSE');
                                addToast(`Fiche de traçabilité PDF générée pour #${item.id}`, 'success');
                              }}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                              title="Télécharger la Fiche de Traçabilité Individuelle (PDF)"
                            >
                              <FileText className="w-4 h-4" />
                            </button>
                          )}

                          {canEdit && (
                            <>
                              <button
                                onClick={() => handleOpenEditModal(item)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                title="Modifier"
                              >
                                <Edit className="w-4 h-4" />
                              </button>

                              <button
                                onClick={() => setDeletingId(item.id)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                title="Supprimer"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          )}

                          {!canEdit && !canExport && (
                            <span 
                              className="text-[10px] text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded"
                              title="Consultation uniquement"
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

        {/* Footer Summary Bar */}
        <div className="bg-slate-50 dark:bg-slate-800/50 p-4 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium">
          <div>
            Affichage de <span className="font-bold text-slate-900 dark:text-white">{filteredItems.length}</span> déchet(s) sur <span className="font-bold">{wasteItems.length}</span>
          </div>
          <div>
            Volume filtré total: <span className="font-bold text-cyan-600 dark:text-cyan-400">{filteredItems.reduce((acc, x) => acc + x.quantite, 0).toLocaleString()} kg/L</span>
          </div>
        </div>
      </div>

      {/* Modal Add / Edit Waste Item */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-orange-500" />
                <span>{editingItem ? `Modifier Déchet #${editingItem.id}` : 'Nouveau Déchet - Saisie Division HSE'}</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Nom du déchet */}
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Nom du déchet *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="ex: Boues d'hydrocarbures"
                    value={nom}
                    onChange={(e) => setNom(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>

                {/* Type */}
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Type de déchet *
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as TypeDechet)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    <option value="Industriel">Industriel</option>
                    <option value="Chimique">Chimique</option>
                    <option value="Biologique">Biologique</option>
                    <option value="Radioactif">Radioactif</option>
                    <option value="Électronique">Électronique</option>
                    <option value="Médical">Médical</option>
                    <option value="Construction">Construction</option>
                    <option value="Ménager">Ménager</option>
                    <option value="Autre">Autre (préciser)...</option>
                  </select>
                  {type === 'Autre' && (
                    <input
                      type="text"
                      placeholder="Précisez le type..."
                      value={customType}
                      onChange={(e) => setCustomType(e.target.value)}
                      className="w-full mt-2 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                    />
                  )}
                </div>

                {/* Aspect Physique */}
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Aspect physique *
                  </label>
                  <select
                    value={aspect}
                    onChange={(e) => setAspect(e.target.value as AspectPhysique)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    <option value="Solide">Solide</option>
                    <option value="Liquide">Liquide</option>
                    <option value="Gaz">Gaz</option>
                  </select>
                </div>

                {/* Source / Provenance */}
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Source / Unité de provenance *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="ex: Unité 100 Distillation"
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>

                {/* Quantité */}
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Quantité ({aspect === 'Liquide' ? 'Litres' : 'Kg'}) *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="ex: 2500"
                    value={quantite}
                    onChange={(e) => setQuantite(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>

                {/* Dangerosité Code HP */}
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Dangerosité (Code HP) *
                  </label>
                  <select
                    value={dangerosite}
                    onChange={(e) => setDangerosite(e.target.value as CodeDangerosite)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    {Object.keys(HP_DANGER_CODES).map(hp => (
                      <option key={hp} value={hp}>
                        {hp} - {HP_DANGER_CODES[hp as CodeDangerosite].label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Date d'ajout */}
                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Date de génération / ajout *
                  </label>
                  <input
                    type="date"
                    required
                    value={dateAjout}
                    onChange={(e) => setDateAjout(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>

                {/* Description */}
                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Description & Remarques
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Détails du conditionnement (fûts, conteneurs), caractéristiques physiques..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>

              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-900/20 transition-all"
                >
                  {editingItem ? 'Enregistrer les modifications' : 'Ajouter au Registre'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* Modal Delete Confirmation */}
      {deletingId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-500">
              <div className="p-3 bg-rose-500/10 rounded-2xl">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Confirmation de suppression
              </h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Êtes-vous sûr de vouloir supprimer définitivement le déchet <span className="font-bold text-slate-900 dark:text-white">#{deletingId}</span> du registre ? Cette action est irréversible.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeletingId(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-semibold text-xs"
              >
                Annuler
              </button>
              <button
                onClick={() => {
                  deleteWasteItem(deletingId);
                  setDeletingId(null);
                }}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md shadow-rose-900/20"
              >
                Oui, Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
