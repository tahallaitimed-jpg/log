import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { WasteItem, Contract, Contractor } from '../types';
import { HP_DANGER_CODES } from '../data/constants';

// Helper to draw Sonatrach PDF Header
const drawSonatrachHeader = (
  doc: jsPDF, 
  title: string, 
  subtitle: string, 
  author: string, 
  isLandscape = true
) => {
  const pageWidth = isLandscape ? 297 : 210;

  // Top Dark Primary Bar
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, pageWidth, 28, 'F');

  // Orange Accent Line
  doc.setFillColor(255, 107, 0); // Sonatrach Orange
  doc.rect(0, 28, pageWidth, 3, 'F');

  // Title Text
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('SONATRACH — DIVISION HSE', 14, 12);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(203, 213, 225); // slate-300
  doc.text(title.toUpperCase(), 14, 20);

  // Subtitle / Date on Right
  const todayStr = new Date().toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  doc.setFontSize(8);
  doc.text(`Édité le: ${todayStr}`, pageWidth - 14, 12, { align: 'right' });
  doc.text(`Opérateur: ${author || 'Division HSE'}`, pageWidth - 14, 20, { align: 'right' });
};

// Helper to draw Sonatrach PDF Footer
const drawSonatrachFooter = (doc: jsPDF, isLandscape = true) => {
  const pageWidth = isLandscape ? 297 : 210;
  const pageHeight = isLandscape ? 210 : 297;

  const totalPages = (doc as any).internal.getNumberOfPages();

  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);

    // Footer divider line
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.5);
    doc.line(14, pageHeight - 15, pageWidth - 14, pageHeight - 15);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);

    // Left legal notice
    doc.text(
      'SONATRACH GP1Z / Division HSE — Conforme à la Loi n° 01-19 relative à la gestion des déchets',
      14,
      pageHeight - 9
    );

    // Right page number
    doc.text(`Page ${i} sur ${totalPages}`, pageWidth - 14, pageHeight - 9, { align: 'right' });
  }
};

/**
 * EXPORT 1: PDF Registre Complet des Déchets (Moderne & Professionnel)
 */
export const exportWasteItemsToPDF = (
  items: WasteItem[], 
  title = 'REGISTRE GÉNÉRAL DE TRAÇABILITÉ DES DÉCHETS SOLIDES DANGEREUX',
  author = 'Division HSE'
) => {
  const doc = new jsPDF('landscape');
  drawSonatrachHeader(doc, title, 'Direction Sécurité & Environnement', author, true);

  // Summary Metrics Strip Box
  const totalVolumeKg = items.filter(i => i.aspect !== 'Liquide').reduce((acc, curr) => acc + curr.quantite, 0);
  const totalVolumeL = items.filter(i => i.aspect === 'Liquide').reduce((acc, curr) => acc + curr.quantite, 0);
  const highRiskCount = items.filter(i => HP_DANGER_CODES[i.dangerosite]?.isHighRisk).length;

  doc.setFillColor(248, 250, 252); // slate-50
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(14, 35, 269, 16, 3, 3, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);

  doc.text(`Total Enregistrements: ${items.length}`, 22, 45);
  doc.text(`Solides / Pâteux: ${totalVolumeKg.toLocaleString('fr-FR')} kg`, 85, 45);
  doc.text(`Liquides: ${totalVolumeL.toLocaleString('fr-FR')} Litres`, 150, 45);
  
  doc.setTextColor(225, 29, 72); // rose-600
  doc.text(`Haut Risque HP: ${highRiskCount} entrée(s)`, 220, 45);

  // Table Columns & Body Data
  const tableData = items.map(item => {
    const dangerLabel = HP_DANGER_CODES[item.dangerosite]?.label || item.dangerosite;
    const isHighRisk = HP_DANGER_CODES[item.dangerosite]?.isHighRisk;
    return [
      `#${item.id}`,
      item.nom,
      item.type,
      item.aspect,
      item.source,
      `${item.quantite.toLocaleString('fr-FR')} ${item.aspect === 'Liquide' ? 'L' : 'kg'}`,
      `${item.dangerosite} - ${dangerLabel}`,
      item.dateAjout,
      item.createdBy || 'N/A'
    ];
  });

  autoTable(doc, {
    startY: 56,
    head: [['ID', 'Nom du Déchet', 'Type', 'Aspect', 'Source / Provenance', 'Quantité', 'Dangerosité (Code HP)', 'Date', 'Auteur']],
    body: tableData,
    theme: 'grid',
    headStyles: { 
      fillColor: [15, 23, 42], 
      textColor: [255, 255, 255], 
      fontStyle: 'bold',
      fontSize: 8,
      cellPadding: 4
    },
    styles: { 
      fontSize: 7.5, 
      cellPadding: 3,
      textColor: [30, 41, 59],
      valign: 'middle'
    },
    alternateRowStyles: { 
      fillColor: [248, 250, 252] 
    },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 15 },
      1: { fontStyle: 'bold', cellWidth: 40 },
      5: { fontStyle: 'bold', cellWidth: 22 },
      6: { cellWidth: 50 },
      7: { cellWidth: 22 },
      8: { cellWidth: 25 }
    }
  });

  // Visa Signatures Box at bottom of last page
  const finalY = (doc as any).lastAutoTable.finalY || 150;
  if (finalY < 165) {
    doc.setDrawColor(203, 213, 225);
    doc.setFillColor(255, 255, 255);
    
    // Visa 1
    doc.roundedRect(14, finalY + 8, 80, 22, 2, 2, 'D');
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(71, 85, 105);
    doc.text('VISA INSP. ENVIRONNEMENT (HSE)', 18, finalY + 14);
    doc.setFont('helvetica', 'normal');
    doc.text('Date & Signature:', 18, finalY + 24);

    // Visa 2
    doc.roundedRect(108, finalY + 8, 80, 22, 2, 2, 'D');
    doc.setFont('helvetica', 'bold');
    doc.text('VISA CHEF DE DEPARTEMENT HSE', 112, finalY + 14);
    doc.setFont('helvetica', 'normal');
    doc.text('Date & Signature:', 112, finalY + 24);

    // Visa 3
    doc.roundedRect(203, finalY + 8, 80, 22, 2, 2, 'D');
    doc.setFont('helvetica', 'bold');
    doc.text('VISA DIRECTION COMPLEXE GP1Z', 207, finalY + 14);
    doc.setFont('helvetica', 'normal');
    doc.text('Date & Signature:', 207, finalY + 24);
  }

  drawSonatrachFooter(doc, true);
  doc.save(`fiche_registre_ddsd_sonatrach_${new Date().toISOString().slice(0, 10)}.pdf`);
};

/**
 * EXPORT 2: Fiche Individuelle de Traçabilité Déchet (PDF A4 Portrait)
 */
export const exportWasteItemFichePDF = (item: WasteItem, author = 'Division HSE') => {
  const doc = new jsPDF('portrait'); // A4 Portrait
  
  // Header
  drawSonatrachHeader(doc, 'FICHE INDIVIDUELLE DE TRAÇABILITÉ DE DÉCHET DANGEREUX', 'Division HSE', author, false);

  // Fiche Title Box
  doc.setFillColor(241, 245, 249); // slate-100
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(14, 36, 182, 18, 3, 3, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text(`FICHE N° DDSD-2026-00${item.id}`, 20, 44);

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text(`Date de génération: ${item.dateAjout} | Statut: Conforme & Traçable`, 20, 50);

  // Section 1: Identification
  let currentY = 62;
  
  autoTable(doc, {
    startY: currentY,
    head: [['SECTION 1: IDENTIFICATION & CARACTÉRISTIQUES DU DÉCHET', '']],
    body: [
      ['Désignation du Déchet', item.nom],
      ['Type de Déchet', item.type],
      ['Aspect Physique', item.aspect],
      ['Atelier / Source Provenance', item.source],
      ['Quantité Enregistrée', `${item.quantite.toLocaleString('fr-FR')} ${item.aspect === 'Liquide' ? 'Litres' : 'Kilogrammes (kg)'}`]
    ],
    theme: 'plain',
    headStyles: { fillColor: [15, 23, 42], textColor: 255, fontStyle: 'bold', fontSize: 8.5 },
    bodyStyles: { fontSize: 8.5, cellPadding: 3 },
    columnStyles: { 0: { fontStyle: 'bold', cellWidth: 70, textColor: [51, 65, 85] } }
  });

  currentY = (doc as any).lastAutoTable.finalY + 8;

  // Section 2: Dangerosité & HP Codes
  const dangerInfo = HP_DANGER_CODES[item.dangerosite];
  autoTable(doc, {
    startY: currentY,
    head: [['SECTION 2: CLASSIFICATION DE DANGEROSITÉ & RISQUES (LOI 01-19)', '']],
    body: [
      ['Code Dangerosité (HP)', `${item.dangerosite} - ${dangerInfo?.label || 'Inconnu'}`],
      ['Niveau de Risque', dangerInfo?.isHighRisk ? 'HAUT RISQUE / RISQUE MAJEUR' : 'RISQUE STANDARD / CONTRÔLÉ'],
      ['Description & Précautions', item.description || 'Procéder au stockage dans des fûts ou bacs étanches conformément aux consignes HSE.']
    ],
    theme: 'plain',
    headStyles: { fillColor: dangerInfo?.isHighRisk ? [225, 29, 72] : [15, 23, 42], textColor: 255, fontStyle: 'bold', fontSize: 8.5 },
    bodyStyles: { fontSize: 8.5, cellPadding: 3 },
    columnStyles: { 0: { fontStyle: 'bold', cellWidth: 70, textColor: [51, 65, 85] } }
  });

  currentY = (doc as any).lastAutoTable.finalY + 8;

  // Section 3: Suivi & Traçabilité
  autoTable(doc, {
    startY: currentY,
    head: [['SECTION 3: HISTORIQUE & PROTOCOLE D\'ÉVACUATION', '']],
    body: [
      ['Opérateur de Saisie', item.createdBy || author],
      ['Date d\'Inclusion au Registre', item.dateAjout],
      ['Destinataire Vise', 'Prestataire Agréé par le Ministère de l\'Environnement'],
      ['Mode d\'Élimination Prévu', item.aspect === 'Liquide' ? 'Traitement physico-chimique / Incinération' : 'Confinement / Recyclage spécifique']
    ],
    theme: 'plain',
    headStyles: { fillColor: [15, 23, 42], textColor: 255, fontStyle: 'bold', fontSize: 8.5 },
    bodyStyles: { fontSize: 8.5, cellPadding: 3 },
    columnStyles: { 0: { fontStyle: 'bold', cellWidth: 70, textColor: [51, 65, 85] } }
  });

  currentY = (doc as any).lastAutoTable.finalY + 12;

  // Signature Block
  doc.setDrawColor(203, 213, 225);
  
  // Box 1
  doc.roundedRect(14, currentY, 86, 32, 2, 2, 'D');
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('VISA ÉMETTEUR (ATELIER HSE)', 18, currentY + 7);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text('Nom:', 18, currentY + 15);
  doc.text('Signature & Cachet:', 18, currentY + 24);

  // Box 2
  doc.roundedRect(110, currentY, 86, 32, 2, 2, 'D');
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(8);
  doc.text('VISA RECEPTIONNAIRE / PRESTATAIRE', 114, currentY + 7);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text('Entreprise Agréée:', 114, currentY + 15);
  doc.text('Signature & Date:', 114, currentY + 24);

  drawSonatrachFooter(doc, false);
  doc.save(`fiche_dechet_ddsd_${item.id}_${new Date().toISOString().slice(0, 10)}.pdf`);
};

/**
 * EXPORT 3: PDF Contrats & Conventions
 */
export const exportContractsToPDF = (
  contracts: Contract[], 
  contractors: Contractor[], 
  author = 'Division HSE'
) => {
  const doc = new jsPDF('landscape');
  drawSonatrachHeader(doc, 'RÉPERTOIRE OFFICIEL DES CONTRATS & CONVENTIONS HSE', 'Direction Juridique & Environnement', author, true);

  const totalMontant = contracts.reduce((sum, c) => sum + (c.montant || 0), 0);

  // KPI Strip
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(14, 35, 269, 16, 3, 3, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text(`Total Contrats: ${contracts.length}`, 22, 45);
  doc.text(`Montant Cumulé: ${totalMontant.toLocaleString('fr-DZ')} DZD`, 90, 45);

  const activeCount = contracts.filter(c => c.status === 'Actif').length;
  doc.setTextColor(16, 185, 129); // emerald-600
  doc.text(`Contrats Actifs: ${activeCount}`, 200, 45);

  const tableData = contracts.map(c => {
    const contractor = contractors.find(ctr => ctr.id === c.prestataireId);
    return [
      `#CONTRAT-${c.id}`,
      contractor?.nom || 'Prestataire inconnu',
      c.typeContrat,
      c.dateDebut,
      c.dateFin,
      `${c.montant.toLocaleString('fr-DZ')} DZD`,
      c.status || 'Actif',
      c.fichierPath || 'N/A'
    ];
  });

  autoTable(doc, {
    startY: 56,
    head: [['ID', 'Prestataire / Entreprise', 'Type Prestation', 'Date Début', 'Date Échéance', 'Montant (DZD)', 'Statut', 'Pièce Jointe']],
    body: tableData,
    theme: 'grid',
    headStyles: { fillColor: [15, 23, 42], textColor: 255, fontStyle: 'bold', fontSize: 8 },
    styles: { fontSize: 7.5, cellPadding: 3.5, textColor: [30, 41, 59] },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 25 },
      1: { fontStyle: 'bold', cellWidth: 55 },
      5: { fontStyle: 'bold', cellWidth: 35 }
    }
  });

  drawSonatrachFooter(doc, true);
  doc.save(`fiche_contrats_conventions_sonatrach_${new Date().toISOString().slice(0, 10)}.pdf`);
};

/**
 * EXPORT 4: Excel Registre des Déchets (Moderne & Structuré)
 */
export const exportWasteItemsToExcel = (items: WasteItem[], filename = 'registre_ddsd_sonatrach') => {
  const todayStr = new Date().toLocaleDateString('fr-FR');

  // Build Structured Data with Headers
  const worksheetData = [
    ['SONATRACH — DIVISION HSE'],
    ['REGISTRE OFFICIEL DE TRAÇABILITÉ DES DÉCHETS SOLIDES ET DANGEREUX (DDSD)'],
    [`Document généré le: ${todayStr} | Conforme à la Loi n° 01-19`],
    [], // Blank
    ['ID', 'Désignation du Déchet', 'Type de Déchet', 'Aspect Physique', 'Source / Provenance', 'Quantité', 'Unité', 'Code HP', 'Libellé Danger', 'Haut Risque?', 'Date d\'Ajout', 'Description / Remarques', 'Opérateur']
  ];

  items.forEach(item => {
    const dangerLabel = HP_DANGER_CODES[item.dangerosite]?.label || item.dangerosite;
    const isHighRisk = HP_DANGER_CODES[item.dangerosite]?.isHighRisk ? 'OUI (MAJEUR)' : 'NON';
    
    worksheetData.push([
      item.id.toString(),
      item.nom,
      item.type,
      item.aspect,
      item.source,
      item.quantite.toString(),
      item.aspect === 'Liquide' ? 'Litres' : 'Kg',
      item.dangerosite,
      dangerLabel,
      isHighRisk,
      item.dateAjout,
      item.description || '',
      item.createdBy || 'Division HSE'
    ]);
  });

  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

  // Set column widths auto-fit
  worksheet['!cols'] = [
    { wch: 8 },  // ID
    { wch: 30 }, // Nom
    { wch: 18 }, // Type
    { wch: 15 }, // Aspect
    { wch: 25 }, // Source
    { wch: 12 }, // Quantite
    { wch: 10 }, // Unite
    { wch: 10 }, // Code HP
    { wch: 35 }, // Libelle
    { wch: 15 }, // Haut Risque
    { wch: 14 }, // Date
    { wch: 35 }, // Description
    { wch: 18 }  // Operateur
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Registre DDSD');

  XLSX.writeFile(workbook, `${filename}_${new Date().toISOString().slice(0, 10)}.xlsx`);
};

/**
 * EXPORT 5: Excel Contrats & Conventions
 */
export const exportContractsToExcel = (contracts: Contract[], contractors: Contractor[], filename = 'contrats_sonatrach') => {
  const todayStr = new Date().toLocaleDateString('fr-FR');

  const worksheetData = [
    ['SONATRACH — DIVISION HSE'],
    ['RÉPERTOIRE DÉTAILLÉ DES CONTRATS ET CONVENTIONS D\'ÉLIMINATION'],
    [`Document généré le: ${todayStr}`],
    [],
    ['ID Contrat', 'Prestataire / Entreprise', 'Agrément', 'Type de Prestation', 'Date Début', 'Date Fin / Échéance', 'Montant (DZD)', 'Statut', 'Fichier Joint']
  ];

  contracts.forEach(c => {
    const contractor = contractors.find(ctr => ctr.id === c.prestataireId);
    worksheetData.push([
      `#CONTRAT-${c.id}`,
      contractor?.nom || 'Inconnu',
      contractor?.code || 'Non renseigné',
      c.typeContrat,
      c.dateDebut,
      c.dateFin,
      c.montant.toString(),
      c.status || 'Actif',
      c.fichierPath || ''
    ]);
  });

  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

  worksheet['!cols'] = [
    { wch: 15 }, // ID
    { wch: 30 }, // Prestataire
    { wch: 22 }, // Agrement
    { wch: 25 }, // Type
    { wch: 14 }, // Date D
    { wch: 14 }, // Date F
    { wch: 18 }, // Montant
    { wch: 15 }, // Statut
    { wch: 30 }  // Fichier
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Contrats HSE');

  XLSX.writeFile(workbook, `${filename}_${new Date().toISOString().slice(0, 10)}.xlsx`);
};

/**
 * EXPORT 6: PDF Prestataires & Entreprises Agréées
 */
export const exportContractorsToPDF = (
  contractors: Contractor[], 
  author = 'Division HSE'
) => {
  const doc = new jsPDF('landscape');
  drawSonatrachHeader(doc, 'RÉPERTOIRE DES PRESTATAIRES & ENTREPRISES AGRÉÉES', 'Division HSE — Direction Environnement', author, true);

  // KPI Strip
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(14, 35, 269, 16, 3, 3, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text(`Total Prestataires Agréés: ${contractors.length}`, 22, 45);

  const avgRating = (contractors.reduce((s, c) => s + c.rating, 0) / (contractors.length || 1)).toFixed(1);
  doc.text(`Note Moyenne d'Évaluation: ${avgRating} / 10`, 115, 45);

  const tableData = contractors.map(c => [
    c.identifiant,
    c.nom,
    c.code,
    c.telephone,
    c.email,
    c.typePrestataire,
    c.specialite,
    `${c.rating} / 10`
  ]);

  autoTable(doc, {
    startY: 56,
    head: [['Identifiant', 'Nom de l\'Entreprise', 'Code Agrément', 'Téléphone', 'Email', 'Type Prestation', 'Spécialité / Agrément', 'Évaluation']],
    body: tableData,
    theme: 'grid',
    headStyles: { fillColor: [15, 23, 42], textColor: 255, fontStyle: 'bold', fontSize: 8 },
    styles: { fontSize: 7.5, cellPadding: 3.5, textColor: [30, 41, 59] },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 25 },
      1: { fontStyle: 'bold', cellWidth: 50 },
      7: { fontStyle: 'bold', cellWidth: 22 }
    }
  });

  drawSonatrachFooter(doc, true);
  doc.save(`repertoire_prestataires_sonatrach_${new Date().toISOString().slice(0, 10)}.pdf`);
};

/**
 * EXPORT 7: Excel Prestataires
 */
export const exportContractorsToExcel = (contractors: Contractor[], filename = 'prestataires_sonatrach') => {
  const todayStr = new Date().toLocaleDateString('fr-FR');

  const worksheetData = [
    ['SONATRACH — DIVISION HSE'],
    ['RÉPERTOIRE DES ENTREPRISES ET PRESTATAIRES AGRÉÉS POUR LE TRAITEMENT DES DÉCHETS'],
    [`Document généré le: ${todayStr}`],
    [],
    ['Identifiant', 'Nom de l\'Entreprise', 'Code Agrément', 'Téléphone', 'Email Contact', 'Type Prestation', 'Spécialité & Habilitation', 'Note d\'Évaluation (/10)', 'Remarques']
  ];

  contractors.forEach(c => {
    worksheetData.push([
      c.identifiant,
      c.nom,
      c.code,
      c.telephone,
      c.email,
      c.typePrestataire,
      c.specialite,
      c.rating.toString(),
      c.notes || ''
    ]);
  });

  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

  worksheet['!cols'] = [
    { wch: 15 }, // ID
    { wch: 30 }, // Nom
    { wch: 18 }, // Code
    { wch: 18 }, // Tel
    { wch: 25 }, // Email
    { wch: 20 }, // Type
    { wch: 30 }, // Specialite
    { wch: 15 }, // Rating
    { wch: 30 }  // Notes
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Prestataires');

  XLSX.writeFile(workbook, `${filename}_${new Date().toISOString().slice(0, 10)}.xlsx`);
};
