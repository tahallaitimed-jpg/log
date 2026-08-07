import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { FONCTIONS_USER, DEFAULT_PERMISSIONS_BY_FONCTION, getPermissionsForUser } from '../data/constants';
import { UserPermissions, User } from '../types';
import { UserCog, Plus, Trash2, KeyRound, Shield, Eye, EyeOff, Briefcase, CheckSquare, Settings2, Lock, X } from 'lucide-react';

export const UtilisateursView: React.FC = () => {
  const { allUsers, addUser, deleteUser, changeUserPassword, updateUserPermissions, currentUser, addToast } = useApp();

  const isAdmin = currentUser?.role === 'admin';

  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [newRole, setNewRole] = useState<'admin' | 'user'>('user');
  const [newFonction, setNewFonction] = useState<string>('Ingénieur');
  const [newPermissions, setNewPermissions] = useState<UserPermissions>(
    DEFAULT_PERMISSIONS_BY_FONCTION['Ingénieur']
  );

  // Modal to edit permissions for existing user
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editingPermissions, setEditingPermissions] = useState<UserPermissions | null>(null);

  // Change Password State
  const [changePassOpen, setChangePassOpen] = useState(false);
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');

  const handleFonctionChange = (selectedFonction: string) => {
    setNewFonction(selectedFonction);
    if (DEFAULT_PERMISSIONS_BY_FONCTION[selectedFonction]) {
      setNewPermissions({ ...DEFAULT_PERMISSIONS_BY_FONCTION[selectedFonction] });
    }
  };

  const handlePermissionToggle = (key: keyof UserPermissions) => {
    setNewPermissions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleEditingPermissionToggle = (key: keyof UserPermissions) => {
    if (!editingPermissions) return;
    setEditingPermissions(prev => prev ? ({ ...prev, [key]: !prev[key] }) : null);
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) {
      addToast('Seul l\'administrateur peut créer des utilisateurs', 'error');
      return;
    }
    if (!newUsername.trim()) {
      addToast('Entrez un nom d\'utilisateur valide', 'error');
      return;
    }
    if (!newPassword.trim()) {
      addToast('Entrez un mot de passe valide pour l\'utilisateur', 'error');
      return;
    }
    const success = addUser(newUsername.trim(), newPassword.trim(), newRole, newFonction, newPermissions);
    if (success) {
      setNewUsername('');
      setNewPassword('');
    }
  };

  const handleOpenEditPermissions = (user: User) => {
    setEditingUser(user);
    setEditingPermissions(getPermissionsForUser(user));
  };

  const handleSavePermissions = () => {
    if (!editingUser || !editingPermissions) return;
    updateUserPermissions(editingUser.id, editingPermissions);
    setEditingUser(null);
    setEditingPermissions(null);
  };

  const handleChangePassSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    if (currentUser.password && currentPass !== currentUser.password) {
      addToast('Le mot de passe actuel est incorrect', 'error');
      return;
    }
    if (!newPass || newPass !== confirmPass) {
      addToast('Les nouveaux mots de passe ne correspondent pas', 'error');
      return;
    }
    changeUserPassword(currentUser.id, newPass);
    setChangePassOpen(false);
    setCurrentPass('');
    setNewPass('');
    setConfirmPass('');
  };

  return (
    <div className="space-y-6">
      
      {/* Title Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <span className="p-2 bg-indigo-500/10 text-indigo-500 rounded-xl">
              <UserCog className="w-5 h-5" />
            </span>
            <span>Gestion des Utilisateurs & Habilitations</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Gestion des comptes d'accès au registre DDSD pour SONATRACH Division HSE
          </p>
        </div>

        <button
          onClick={() => setChangePassOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-2 shadow-md transition-colors"
        >
          <KeyRound className="w-4 h-4 text-amber-400" />
          <span>Modifier mon mot de passe</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Form Add User */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
            <Plus className="w-4 h-4 text-emerald-500" />
            <span>Créer un Utilisateur</span>
          </h3>

          {isAdmin ? (
            <form onSubmit={handleAddUser} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Nom d'utilisateur *
                </label>
                <input
                  type="text"
                  required
                  placeholder="ex: operateur_hse"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Mot de passe *
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    required
                    placeholder="Saisissez un mot de passe"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full pl-3 pr-10 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-cyan-500" />
                  <span>Fonction / Poste Organigramme *</span>
                </label>
                <select
                  value={newFonction}
                  onChange={(e) => handleFonctionChange(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {FONCTIONS_USER.map((f) => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
                <p className="text-[10px] text-slate-400 mt-1">
                  Les droits d'accès ci-dessous sont ajustés automatiquement selon le poste sélectionné.
                </p>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Rôle Système *
                </label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as 'admin' | 'user')}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="user">Utilisateur Standard (Droits personnalisés)</option>
                  <option value="admin">Administrateur Système (Accès total)</option>
                </select>
              </div>

              {/* Granular Permissions Section */}
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-2">
                <label className="block font-bold text-slate-800 dark:text-slate-200 text-xs flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-cyan-500">
                    <CheckSquare className="w-3.5 h-3.5" />
                    <span>Droits & Points d'Accès de l'Utilisateur</span>
                  </span>
                  <span className="text-[10px] text-slate-400 font-normal">Cochez/Décochez</span>
                </label>

                <div className="bg-slate-50 dark:bg-slate-950/60 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
                  {[
                    { key: 'canAccessSaisieDechets', label: 'Saisie & Registre Déchets', desc: 'Enregistrement des bordereaux' },
                    { key: 'canAccessDashboard', label: 'Tableau de Bord / KPIs', desc: 'Graphiques & indicateurs' },
                    { key: 'canEditDechets', label: 'Modification / Suppression Déchets', desc: 'Mise à jour des fiches' },
                    { key: 'canAccessPrestataires', label: 'Répertoire Prestataires', desc: 'Consultation entreprises' },
                    { key: 'canAccessContrats', label: 'Contrats & Conventions', desc: 'Suivi des agréments' },
                    { key: 'canAccessLois', label: 'Textes de Loi & Réglementation', desc: 'Textes HSE' },
                    { key: 'canExportData', label: 'Export PDF Officiel & Excel', desc: 'Rapports imprimables' },
                    { key: 'canManageUsers', label: 'Gestion des Utilisateurs', desc: 'Attribution de droits' },
                  ].map(p => (
                    <label key={p.key} className="flex items-start gap-2.5 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/60 cursor-pointer transition-colors">
                      <input
                        type="checkbox"
                        checked={!!newPermissions[p.key as keyof UserPermissions]}
                        onChange={() => handlePermissionToggle(p.key as keyof UserPermissions)}
                        className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500 w-3.5 h-3.5"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-[11px] text-slate-800 dark:text-slate-200 leading-none">
                          {p.label}
                        </p>
                        <p className="text-[9px] text-slate-500 dark:text-slate-400 mt-0.5">
                          {p.desc}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-md shadow-emerald-900/20 transition-all flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Créer le Compte avec ses Droits</span>
              </button>
            </form>
          ) : (
            <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-2xl text-amber-200 text-xs space-y-2">
              <div className="flex items-center gap-2 font-bold text-amber-400 text-sm">
                <Shield className="w-4 h-4" />
                <span>Accès Restreint</span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                Seul l'administrateur du système est habilité à créer de nouveaux comptes utilisateurs, à modifier des enregistrements ou à supprimer des données.
              </p>
              <div className="text-[10px] text-amber-400/80 font-mono pt-1">
                Connectez-vous en tant qu'administrateur pour accéder à cette fonction.
              </div>
            </div>
          )}
        </div>

        {/* Users Table */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
            <Shield className="w-4 h-4 text-cyan-500" />
            <span>Liste des Utilisateurs Enregistrés</span>
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 uppercase text-[10px] font-bold">
                  <th className="py-2.5 px-3">Utilisateur</th>
                  <th className="py-2.5 px-3">Fonction / Poste</th>
                  <th className="py-2.5 px-3">Droits & Points d'Accès</th>
                  <th className="py-2.5 px-3">Date Création</th>
                  <th className="py-2.5 px-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {allUsers.map(user => {
                  const uPerms = getPermissionsForUser(user);
                  const activeCount = Object.values(uPerms).filter(Boolean).length;
                  return (
                    <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-md bg-cyan-600 text-white flex items-center justify-center font-bold text-[10px] uppercase">
                            {user.username.substring(0, 2)}
                          </div>
                          <span className="truncate max-w-[100px] sm:max-w-none">{user.username}</span>
                          {currentUser?.username === user.username && (
                            <span className="text-[10px] bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 px-1.5 py-0.5 rounded font-bold">
                              Vous
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3 px-3">
                        <span className="px-2 py-1 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-300 font-bold text-[11px] border border-cyan-500/20 inline-flex items-center gap-1">
                          <Briefcase className="w-3 h-3 text-cyan-500" />
                          <span>{user.fonction || 'Non défini'}</span>
                        </span>
                      </td>

                      <td className="py-3 px-3">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-1.5">
                            <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                              user.role === 'admin'
                                ? 'bg-purple-500/20 text-purple-600 dark:text-purple-400 border border-purple-500/30'
                                : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                            }`}>
                              {activeCount} / 8 Droits Actifs
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-3 text-slate-500 dark:text-slate-400 font-mono text-[11px]">
                        {user.createdAt}
                      </td>

                      <td className="py-3 px-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          {isAdmin && (
                            <button
                              onClick={() => handleOpenEditPermissions(user)}
                              className="p-1.5 text-slate-400 hover:text-cyan-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                              title="Modifier les Droits & Points d'Accès"
                            >
                              <Settings2 className="w-4 h-4" />
                            </button>
                          )}

                          <button
                            onClick={() => deleteUser(user.id)}
                            disabled={!isAdmin || user.username === 'admin'}
                            className="p-1.5 text-slate-400 hover:text-rose-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            title={
                              !isAdmin 
                                ? 'Seul l\'administrateur peut supprimer un utilisateur' 
                                : user.username === 'admin' 
                                ? 'Impossible de supprimer l\'administrateur principal' 
                                : 'Supprimer l\'utilisateur'
                            }
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Change Password Modal */}
      {changePassOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-amber-500" />
              <span>Changer le Mot de Passe</span>
            </h3>

            <form onSubmit={handleChangePassSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Mot de passe actuel
                </label>
                <input
                  type="password"
                  required
                  value={currentPass}
                  onChange={(e) => setCurrentPass(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Nouveau mot de passe
                </label>
                <input
                  type="password"
                  required
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Confirmer le nouveau mot de passe
                </label>
                <input
                  type="password"
                  required
                  value={confirmPass}
                  onChange={(e) => setConfirmPass(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setChangePassOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-xs"
                >
                  Mettre à jour
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Permissions Modal */}
      {editingUser && editingPermissions && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Settings2 className="w-5 h-5 text-cyan-500" />
                <span>Ajuster les Droits : {editingUser.username}</span>
              </h3>
              <button
                onClick={() => setEditingUser(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs space-y-3">
              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50">
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">{editingUser.username}</p>
                  <p className="text-[10px] text-cyan-500 font-semibold">{editingUser.fonction || 'Poste non précisé'}</p>
                </div>
                <span className="px-2 py-1 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 text-[10px] font-bold">
                  {editingUser.role === 'admin' ? 'Administrateur' : 'Standard'}
                </span>
              </div>

              <label className="block font-bold text-slate-800 dark:text-slate-200 text-xs">
                Cochez ou décochez les points d'accès autorisés pour cet utilisateur :
              </label>

              <div className="bg-slate-50 dark:bg-slate-950/60 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2 max-h-60 overflow-y-auto">
                {[
                  { key: 'canAccessSaisieDechets', label: 'Saisie & Registre Déchets DDSD', desc: 'Saisie et consultation des bordereaux' },
                  { key: 'canAccessDashboard', label: 'Tableau de Bord / KPIs', desc: 'Accès aux statistiques & graphiques' },
                  { key: 'canEditDechets', label: 'Modification / Suppression Déchets', desc: 'Droits de modification et suppression' },
                  { key: 'canAccessPrestataires', label: 'Répertoire des Prestataires', desc: 'Consultation des entreprises agréées' },
                  { key: 'canAccessContrats', label: 'Gestion des Contrats & Conventions', desc: 'Accès aux contrats d\'enlèvement' },
                  { key: 'canAccessLois', label: 'Textes de Loi & Réglementation', desc: 'Consultation du cadre juridique' },
                  { key: 'canExportData', label: 'Export PDF Officiel & Excel', desc: 'Téléchargement des registres officiels' },
                  { key: 'canManageUsers', label: 'Gestion des Utilisateurs & Droits', desc: 'Administration des accès au système' },
                ].map(p => (
                  <label key={p.key} className="flex items-start gap-2.5 p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/60 cursor-pointer transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700">
                    <input
                      type="checkbox"
                      checked={!!editingPermissions[p.key as keyof UserPermissions]}
                      onChange={() => handleEditingPermissionToggle(p.key as keyof UserPermissions)}
                      className="mt-0.5 rounded text-cyan-600 focus:ring-cyan-500 w-4 h-4"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-[11px] text-slate-900 dark:text-slate-100">
                        {p.label}
                      </p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">
                        {p.desc}
                      </p>
                    </div>
                  </label>
                ))}
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs"
                >
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={handleSavePermissions}
                  className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-md shadow-cyan-900/20"
                >
                  Enregistrer les Droits
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
