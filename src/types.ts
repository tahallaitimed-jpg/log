export type Role = 'admin' | 'user';

export type FonctionUser = 
  | 'Directeur'
  | 'Chef Département'
  | 'Chef Service'
  | 'Ingénieur'
  | 'Superviseur'
  | 'Superintendant'
  | 'Contremaître'
  | 'Technicien'
  | string;

export interface UserPermissions {
  canAccessDashboard: boolean;
  canAccessSaisieDechets: boolean;
  canEditDechets: boolean;
  canAccessPrestataires: boolean;
  canAccessContrats: boolean;
  canAccessLois: boolean;
  canExportData: boolean;
  canManageUsers: boolean;
}

export interface User {
  id: string;
  username: string;
  password?: string;
  role: Role;
  roleId: number; // 1: Admin, 2: Standard
  fonction?: FonctionUser;
  permissions?: UserPermissions;
  createdAt: string;
}

export type AspectPhysique = 'Solide' | 'Liquide' | 'Gaz';

export type TypeDechet = 
  | 'Chimique' 
  | 'Biologique' 
  | 'Radioactif' 
  | 'Électronique' 
  | 'Médical' 
  | 'Industriel' 
  | 'Construction' 
  | 'Ménager'
  | 'Autre';

export type CodeDangerosite = 'H1' | 'H2' | 'H3' | 'H4' | 'H5' | 'H6' | 'H7' | 'H8' | 'H9' | 'H10' | 'H11' | 'H12' | 'H13';

export interface DangerInfo {
  code: CodeDangerosite;
  label: string;
  description: string;
  isHighRisk: boolean;
}

export interface WasteItem {
  id: number;
  nom: string;
  type: TypeDechet | string;
  aspect: AspectPhysique;
  source: string;
  quantite: number; // in kg or liters
  dangerosite: CodeDangerosite;
  dateAjout: string;
  description: string;
  createdBy: string;
  createdAt?: string;
  updatedAt?: string;
}

export type TypePrestation = 
  | 'Collecte' 
  | 'Transport' 
  | 'Traitement' 
  | 'Élimination' 
  | 'Recyclage' 
  | 'Autre';

export interface Contractor {
  id: number;
  identifiant: string;
  nom: string;
  code: string;
  telephone: string;
  email: string;
  typePrestataire: TypePrestation;
  specialite: string;
  notes: string;
  rating: number; // 1 to 10
  createdAt?: string;
  updatedAt?: string;
}

export type ContractStatus = 'Actif' | 'À renouveler' | 'Expiré';

export interface Contract {
  id: number;
  prestataireId: number;
  typeContrat: TypePrestation;
  dateDebut: string;
  dateFin: string;
  montant: number; // in DZD
  notes: string;
  fichierPath?: string;
  fichierDataUrl?: string;
  fichierSize?: string;
  status?: ContractStatus;
  createdAt?: string;
}

export interface LawRegulation {
  id: string;
  title: string;
  category: 'Textes fondamentaux' | 'Décrets d\'application' | 'Conventions internationales';
  reference: string;
  date: string;
  description: string;
  keyArticles?: string[];
  linkUrl?: string;
}

export interface FilterOptions {
  type?: string;
  dangerosite?: string;
  aspect?: string;
  period?: 'all' | '7days' | '30days' | '90days' | 'year';
  searchTerm?: string;
  startDate?: string;
  endDate?: string;
}

export interface KPIMetrics {
  totalDechets: number;
  totalVolume: number;
  dechetsDangereuxCount: number;
  totalPrestataires: number;
  capaciteUtiliseePct: number;
  contratsExpirantsCount: number;
}
