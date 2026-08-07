import { CodeDangerosite, DangerInfo, LawRegulation, WasteItem, Contractor, Contract, UserPermissions, User } from '../types';

export const FONCTIONS_USER = [
  'Directeur',
  'Chef Département',
  'Chef Service',
  'Ingénieur',
  'Superviseur',
  'Superintendant',
  'Contremaître',
  'Technicien'
];

export const DEFAULT_PERMISSIONS_BY_FONCTION: Record<string, UserPermissions> = {
  'Directeur': {
    canAccessDashboard: true,
    canAccessSaisieDechets: true,
    canEditDechets: true,
    canAccessPrestataires: true,
    canAccessContrats: true,
    canAccessLois: true,
    canExportData: true,
    canManageUsers: true,
  },
  'Chef Département': {
    canAccessDashboard: true,
    canAccessSaisieDechets: true,
    canEditDechets: true,
    canAccessPrestataires: true,
    canAccessContrats: true,
    canAccessLois: true,
    canExportData: true,
    canManageUsers: true,
  },
  'Chef Service': {
    canAccessDashboard: true,
    canAccessSaisieDechets: true,
    canEditDechets: true,
    canAccessPrestataires: true,
    canAccessContrats: true,
    canAccessLois: true,
    canExportData: true,
    canManageUsers: false,
  },
  'Ingénieur': {
    canAccessDashboard: true,
    canAccessSaisieDechets: true,
    canEditDechets: true,
    canAccessPrestataires: true,
    canAccessContrats: true,
    canAccessLois: true,
    canExportData: true,
    canManageUsers: false,
  },
  'Superviseur': {
    canAccessDashboard: true,
    canAccessSaisieDechets: true,
    canEditDechets: true,
    canAccessPrestataires: true,
    canAccessContrats: false,
    canAccessLois: true,
    canExportData: true,
    canManageUsers: false,
  },
  'Superintendant': {
    canAccessDashboard: true,
    canAccessSaisieDechets: true,
    canEditDechets: true,
    canAccessPrestataires: true,
    canAccessContrats: true,
    canAccessLois: true,
    canExportData: true,
    canManageUsers: false,
  },
  'Contremaître': {
    canAccessDashboard: true,
    canAccessSaisieDechets: true,
    canEditDechets: false,
    canAccessPrestataires: false,
    canAccessContrats: false,
    canAccessLois: true,
    canExportData: false,
    canManageUsers: false,
  },
  'Technicien': {
    canAccessDashboard: false,
    canAccessSaisieDechets: true,
    canEditDechets: false,
    canAccessPrestataires: false,
    canAccessContrats: false,
    canAccessLois: true,
    canExportData: false,
    canManageUsers: false,
  },
};

export const getPermissionsForUser = (user: User | null): UserPermissions => {
  if (!user) {
    return {
      canAccessDashboard: false,
      canAccessSaisieDechets: false,
      canEditDechets: false,
      canAccessPrestataires: false,
      canAccessContrats: false,
      canAccessLois: false,
      canExportData: false,
      canManageUsers: false,
    };
  }

  // If explicit permissions stored on user
  if (user.permissions) {
    return user.permissions;
  }

  // Admin role override
  if (user.role === 'admin') {
    return {
      canAccessDashboard: true,
      canAccessSaisieDechets: true,
      canEditDechets: true,
      canAccessPrestataires: true,
      canAccessContrats: true,
      canAccessLois: true,
      canExportData: true,
      canManageUsers: true,
    };
  }

  // Default preset by fonction
  if (user.fonction && DEFAULT_PERMISSIONS_BY_FONCTION[user.fonction]) {
    return DEFAULT_PERMISSIONS_BY_FONCTION[user.fonction];
  }

  // Default standard fallback
  return {
    canAccessDashboard: true,
    canAccessSaisieDechets: true,
    canEditDechets: false,
    canAccessPrestataires: false,
    canAccessContrats: false,
    canAccessLois: true,
    canExportData: false,
    canManageUsers: false,
  };
};

export const HP_DANGER_CODES: Record<CodeDangerosite, DangerInfo> = {
  H1: { code: 'H1', label: 'Explosif', description: 'Matières et préparations susceptibles d\'exploser sous l\'effet de la flamme.', isHighRisk: false },
  H2: { code: 'H2', label: 'Comburant', description: 'Matières présentant des réactions fortement exothermiques au contact d\'autres matières.', isHighRisk: false },
  H3: { code: 'H3', label: 'Facilement Inflammable', description: 'Liquides ayant un point d\'éclair inférieur à 21°C ou substances inflammables.', isHighRisk: true },
  H4: { code: 'H4', label: 'Irritant', description: 'Substances non corrosives pouvant causer une réaction inflammatoire.', isHighRisk: true },
  H5: { code: 'H5', label: 'Nocif', description: 'Substances pouvant présenter des risques de gravité limitée par inhalation/ingestion.', isHighRisk: true },
  H6: { code: 'H6', label: 'Toxique', description: 'Substances entraînant des risques graves, aigus ou chroniques, voire la mort.', isHighRisk: true },
  H7: { code: 'H7', label: 'Cancérogène', description: 'Substances pouvant produire le cancer ou en augmenter l\'incidence.', isHighRisk: true },
  H8: { code: 'H8', label: 'Corrosif', description: 'Substances pouvant détruire des tissus vivants au contact.', isHighRisk: true },
  H9: { code: 'H9', label: 'Infectieux', description: 'Matières contenant des micro-organismes viables ou leurs toxines.', isHighRisk: false },
  H10: { code: 'H10', label: 'Toxique vis-à-vis de la reproduction', description: 'Substances produisant des effets néfastes non héréditaires.', isHighRisk: true },
  H11: { code: 'H11', label: 'Mutagène', description: 'Substances pouvant produire des défauts génétiques héréditaires.', isHighRisk: false },
  H12: { code: 'H12', label: 'Dégage un gaz toxique', description: 'Substances dégageant des gaz toxiques au contact de l\'eau, d\'un air ou d\'un acide.', isHighRisk: false },
  H13: { code: 'H13', label: 'Sensibilisant / Écotoxique', description: 'Substances présentant des risques immédiats ou différés pour l\'environnement.', isHighRisk: false },
};

export const ALGERIAN_LAWS: LawRegulation[] = [
  {
    id: 'law-01-19',
    title: 'Loi n° 01-19 du 12 décembre 2001',
    category: 'Textes fondamentaux',
    reference: 'Joradp n° 77 du 15 décembre 2001',
    date: '2001-12-12',
    description: 'Relative à la gestion, au contrôle et à l\'élimination des déchets. Elle définit les principes de base pour une gestion intégrée des déchets, de leur génération jusqu\'à leur élimination écologique.',
    keyArticles: [
      'Art. 2: Définition des déchets spéciaux et dangereux.',
      'Art. 15: Interdiction d\'enfouissement direct des déchets dangereux sans prétraitement.',
      'Art. 25: Obligation de traçabilité et bordereau de suivi (BSD).'
    ]
  },
  {
    id: 'law-03-10',
    title: 'Loi n° 03-10 du 19 juillet 2003',
    category: 'Textes fondamentaux',
    reference: 'Joradp n° 43 du 20 juillet 2003',
    date: '2003-07-19',
    description: 'Relative à la protection de l\'environnement et au développement durable. Consacre les principes de précaution, de pollueur-payeur et de développement écologique rationnel dans l\'industrie.',
    keyArticles: [
      'Art. 4: Principe de précaution et d\'action préventive.',
      'Art. 34: Obligation d\'étude d\'impact sur l\'environnement (EIE) pour installations classées.'
    ]
  },
  {
    id: 'law-04-20',
    title: 'Loi n° 04-20 du 25 décembre 2004',
    category: 'Textes fondamentaux',
    reference: 'Joradp n° 84 du 29 décembre 2004',
    date: '2004-12-25',
    description: 'Relative à la prévention des risques majeurs et à la gestion des catastrophes dans le cadre du développement durable. Définit les responsabilités des industriels dans les sites industriels Sonatrach Division HSE.',
    keyArticles: [
      'Art. 12: Plan Interne d\'Intervention (PII) et Plan d\'Opération Interne (POI).',
      'Art. 18: Audit de sécurité industrielle et maîtrise du risque chimique.'
    ]
  },
  {
    id: 'decret-03-477',
    title: 'Décret exécutif N° 03-477 du 9 décembre 2003',
    category: 'Décrets d\'application',
    reference: 'Joradp n° 78 du 10 décembre 2003',
    date: '2003-12-09',
    description: 'Fixant les modalités et procédures d\'élaboration, de publication et de révision du Plan National de Gestion des Déchets Spéciaux (PANGDS).',
    keyArticles: [
      'Modalités de déclaration annuelle des volumes générés.',
      'Schéma d\'élimination agréé par le Ministère de l\'Environnement.'
    ]
  },
  {
    id: 'decret-03-478',
    title: 'Décret exécutif N° 03-478 du 9 décembre 2003',
    category: 'Décrets d\'application',
    reference: 'Joradp n° 78 du 10 décembre 2003',
    date: '2003-12-09',
    description: 'Définissant les modalités de gestion des déchets d\'activités de soins (DASRI / DAS).',
    keyArticles: [
      'Collecte séparative et conteneurs jaunes homologués.',
      'Incinération à haute température ou banalisation.'
    ]
  },
  {
    id: 'decret-06-104',
    title: 'Décret exécutif N° 06-104 du 28 février 2006',
    category: 'Décrets d\'application',
    reference: 'Joradp n° 13 du 1er mars 2006',
    date: '2006-02-28',
    description: 'Fixant la nomenclature officielle des déchets, y compris la liste des déchets spéciaux dangereux (DDSD) et leur codification HP.',
    keyArticles: [
      'Classification officielle des résidus d\'hydrocarbures, catalyseurs, solvants.',
      'Critères d\'attribution des seuils de dangerosité.'
    ]
  },
  {
    id: 'decret-06-138',
    title: 'Décret exécutif N° 06-138 du 15 avril 2006',
    category: 'Décrets d\'application',
    reference: 'Joradp n° 24 du 16 avril 2006',
    date: '2006-04-15',
    description: 'Réglementant les émissions atmosphériques de gaz, fumées, vapeurs et particules émanant des installations industrielles.',
    keyArticles: [
      'Normes de rejets pour les brûleurs et torchères.',
      'Surveillance continue des COV (Composés Organiques Volatils).'
    ]
  },
  {
    id: 'decret-06-141',
    title: 'Décret exécutif N° 06-141 du 19 avril 2006',
    category: 'Décrets d\'application',
    reference: 'Joradp n° 26 du 20 avril 2006',
    date: '2006-04-19',
    description: 'Définissant les valeurs limites des rejets d\'effluents liquides industriels.',
    keyArticles: [
      'Concentration maximale en Hydrocarbures Totaux (HCT) < 10 mg/L.',
      'Interdiction de rejet direct dans le milieu marin ou réseau public.'
    ]
  },
  {
    id: 'conv-basel',
    title: 'Convention de Bâle (1992)',
    category: 'Conventions internationales',
    reference: 'Ratification Décret Présidentiel n° 98-285',
    date: '1992-05-05',
    description: 'Contrôle des mouvements transfrontières de déchets dangereux et de leur élimination.',
    keyArticles: [
      'Réduction à la source de la production de déchets dangereux.',
      'Interdiction d\'exportation vers les pays dépourvus de capacités de traitement.'
    ]
  },
  {
    id: 'conv-stockholm',
    title: 'Convention de Stockholm (2001)',
    category: 'Conventions internationales',
    reference: 'Ratification Décret n° 06-210',
    date: '2001-05-22',
    description: 'Relative aux Polluants Organiques Persistants (POP) dont les pyralènes / PCB et dioxines.',
    keyArticles: [
      'Élimination progressive des huiles à PCB (Pyralène).',
      'Inventaire et décontamination des transformateurs électriques.'
    ]
  },
  {
    id: 'conv-rotterdam',
    title: 'Convention de Rotterdam (2004)',
    category: 'Conventions internationales',
    reference: 'Ratification Décret n° 06-211',
    date: '2004-02-24',
    description: 'Procédure de consentement préalable en connaissance de cause applicable à certains produits chimiques et pesticides dangereux.',
    keyArticles: [
      'Système d\'information sur le commerce international des produits dangereux.'
    ]
  }
];

export const INITIAL_WASTE_ITEMS: WasteItem[] = [
  {
    id: 101,
    nom: "Boues de fond de bac d'hydrocarbures",
    type: "Industriel",
    aspect: "Solide",
    source: "Unité 100 - Distillation Atmosphérique Sonatrach HSE",
    quantite: 12500,
    dangerosite: "H3",
    dateAjout: "2026-07-28",
    description: "Sédiments pétroliers lourds extraits lors du nettoyage du bac B-102. Teneur élevée en composés aromatiques.",
    createdBy: "admin"
  },
  {
    id: 102,
    nom: "Solvants halogénés usés (Trichloroéthylène)",
    type: "Chimique",
    aspect: "Liquide",
    source: "Laboratoire Central de Contrôle Qualité",
    quantite: 1850,
    dangerosite: "H6",
    dateAjout: "2026-08-01",
    description: "Liquides de rinçage analytique sous fût hermétique 200L en acier inox.",
    createdBy: "admin"
  },
  {
    id: 103,
    nom: "Catalyseurs usés au Nickel/Molybdène",
    type: "Industriel",
    aspect: "Solide",
    source: "Unité 200 - Hydrotraitement",
    quantite: 8200,
    dangerosite: "H7",
    dateAjout: "2026-07-15",
    description: "Billes céramiques imprégnées de métaux lourds après 4 ans de cycle de reformage.",
    createdBy: "tahallaiti"
  },
  {
    id: 104,
    nom: "Huiles de transformateur contaminées aux PCB (Pyralène)",
    type: "Chimique",
    aspect: "Liquide",
    source: "Sous-station Électrique Principale SS-02",
    quantite: 3400,
    dangerosite: "H13",
    dateAjout: "2026-08-03",
    description: "Vidange préventive du transformateur T-04 en application de la Convention de Stockholm.",
    createdBy: "admin"
  },
  {
    id: 105,
    nom: "Filtres à huile et cartouches filtrantes saturées",
    type: "Industriel",
    aspect: "Solide",
    source: "Atelier Mécanique & Compresseurs",
    quantite: 950,
    dangerosite: "H3",
    dateAjout: "2026-08-02",
    description: "Cartouches de filtration d'huile de graissage de la turbine T-101.",
    createdBy: "technicien1"
  },
  {
    id: 106,
    nom: "Déchets Médicaux infectieux (DASRI)",
    type: "Médical",
    aspect: "Solide",
    source: "Service Médico-Social Sonatrach HSE",
    quantite: 320,
    dangerosite: "H9",
    dateAjout: "2026-08-04",
    description: "Aiguilles, seringues et compresses en boîtes de sécurité jaunes conformes au décret 03-478.",
    createdBy: "infirmier"
  },
  {
    id: 107,
    nom: "Acide chlorhydrique usé de régénération",
    type: "Chimique",
    aspect: "Liquide",
    source: "Unité de Traitement des Eaux (UTE)",
    quantite: 4500,
    dangerosite: "H8",
    dateAjout: "2026-07-20",
    description: "Solution acide résiduelle issue du détartrage des échangeurs thermiques.",
    createdBy: "admin"
  },
  {
    id: 108,
    nom: "Batteries au plomb industrielles hors d'usage",
    type: "Électronique",
    aspect: "Solide",
    source: "Service Électrique & Onduleurs UPS",
    quantite: 1200,
    dangerosite: "H8",
    dateAjout: "2026-07-10",
    description: "Blocs de batteries 12V d'onduleurs de secours décommissionnés.",
    createdBy: "admin"
  }
];

export const INITIAL_CONTRACTORS: Contractor[] = [
  {
    id: 1,
    identifiant: "PREST-001",
    nom: "SARL EcoClean Algérie",
    code: "ECO-ALG-01",
    telephone: "+213 41 23 45 67",
    email: "contact@ecoclean-algerie.dz",
    typePrestataire: "Traitement",
    specialite: "Incinération haute température & Pompage de boues pétrolières",
    notes: "Prestataire certifié ISO 14001 avec unité de prétraitement agréée à Arzew.",
    rating: 8.5
  },
  {
    id: 2,
    identifiant: "PREST-002",
    nom: "ENTP - Division Environnement",
    code: "ENTP-ENV",
    telephone: "+213 29 74 12 00",
    email: "hse@entp.dz",
    typePrestataire: "Collecte",
    specialite: "Transport hydrocarbures & déchets spéciaux par camions citernes ADR",
    notes: "Agréé par le Ministère de l'Environnement pour le transport inter-wilayas.",
    rating: 9.0
  },
  {
    id: 3,
    identifiant: "PREST-003",
    nom: "Société Nationale de Recyclage (SONAREC)",
    code: "SON-REC-31",
    telephone: "+213 41 55 88 99",
    email: "commercial@sonarec.dz",
    typePrestataire: "Recyclage",
    specialite: "Valorisation des huiles usagées et batteries industrielles au plomb",
    notes: "Capacité de régénération d'huiles de 20 000 tonnes/an.",
    rating: 7.8
  },
  {
    id: 4,
    identifiant: "PREST-004",
    nom: "Etablissement BioIncinération Ouest",
    code: "BIO-INC-ORAN",
    telephone: "+213 41 80 11 22",
    email: "dasri@bioincineration.dz",
    typePrestataire: "Élimination",
    specialite: "Destruction thermique homologuée des déchets d'activités de soins (DASRI)",
    notes: "Fournit les bordereaux de suivi BSD en 48 heures.",
    rating: 9.2
  }
];

export const INITIAL_CONTRACTS: Contract[] = [
  {
    id: 1,
    prestataireId: 1,
    typeContrat: "Traitement",
    dateDebut: "2025-09-01",
    dateFin: "2026-08-31",
    montant: 18500000,
    notes: "Traitement et pyrolyse des boues pétrolières - Sonatrach Division HSE.",
    fichierPath: "contrat_ecoclean_2025_2026.pdf",
    status: "À renouveler"
  },
  {
    id: 2,
    prestataireId: 2,
    typeContrat: "Collecte",
    dateDebut: "2026-01-01",
    dateFin: "2026-12-31",
    montant: 12000000,
    notes: "Collecte et transport routier sécurisé de tous produits chimiques dangereux.",
    fichierPath: "contrat_entp_transport_2026.pdf",
    status: "Actif"
  },
  {
    id: 3,
    prestataireId: 3,
    typeContrat: "Recyclage",
    dateDebut: "2024-06-01",
    dateFin: "2025-05-31",
    montant: 6500000,
    notes: "Régénération des huiles de graissage usées et récupération des condensats.",
    fichierPath: "contrat_sonarec_huiles_2024.pdf",
    status: "Expiré"
  },
  {
    id: 4,
    prestataireId: 4,
    typeContrat: "Élimination",
    dateDebut: "2026-03-15",
    dateFin: "2027-03-14",
    montant: 3200000,
    notes: "Destruction contrôlée des DASRI du centre médical Sonatrach Division HSE.",
    fichierPath: "contrat_bioincineration_dasri.pdf",
    status: "Actif"
  }
];
