import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { HP_DANGER_CODES } from '../data/constants';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  LineChart, 
  Line, 
  CartesianGrid, 
  Legend 
} from 'recharts';
import { 
  BarChart3, 
  PieChart as PieIcon, 
  TrendingUp, 
  ShieldAlert, 
  Layers, 
  Calendar, 
  RefreshCw, 
  Download,
  Filter,
  CheckCircle2,
  Droplets
} from 'lucide-react';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#d0ed57'];

export const DashboardView: React.FC = () => {
  const { wasteItems, metrics, addToast } = useApp();

  // Filters
  const [selectedType, setSelectedType] = useState('all');
  const [selectedDanger, setSelectedDanger] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState('all');

  // Filter Data Logic
  const filteredData = wasteItems.filter(item => {
    const matchesType = selectedType === 'all' || item.type === selectedType;
    const matchesDanger = selectedDanger === 'all' || item.dangerosite === selectedDanger;

    let matchesPeriod = true;
    if (selectedPeriod !== 'all') {
      const itemDate = new Date(item.dateAjout);
      const now = new Date();
      const diffDays = (now.getTime() - itemDate.getTime()) / (1000 * 3600 * 24);

      if (selectedPeriod === '7days') matchesPeriod = diffDays <= 7;
      else if (selectedPeriod === '30days') matchesPeriod = diffDays <= 30;
      else if (selectedPeriod === '90days') matchesPeriod = diffDays <= 90;
      else if (selectedPeriod === 'year') matchesPeriod = itemDate.getFullYear() === now.getFullYear();
    }

    return matchesType && matchesDanger && matchesPeriod;
  });

  // 1. Chart Data: Types Breakdown (Donut/Pie)
  const typeMap: Record<string, number> = {};
  filteredData.forEach(item => {
    typeMap[item.type] = (typeMap[item.type] || 0) + 1;
  });
  const typeChartData = Object.keys(typeMap).map(key => ({
    name: key,
    value: typeMap[key]
  }));

  // 2. Chart Data: Danger HP Codes (Bar)
  const dangerMap: Record<string, number> = {};
  filteredData.forEach(item => {
    dangerMap[item.dangerosite] = (dangerMap[item.dangerosite] || 0) + 1;
  });
  const dangerChartData = Object.keys(dangerMap).sort().map(code => ({
    code,
    count: dangerMap[code],
    label: HP_DANGER_CODES[code as keyof typeof HP_DANGER_CODES]?.label || code,
    isHighRisk: HP_DANGER_CODES[code as keyof typeof HP_DANGER_CODES]?.isHighRisk || false
  }));

  // 3. Chart Data: Timeline Trend
  const dateMap: Record<string, number> = {};
  filteredData.forEach(item => {
    dateMap[item.dateAjout] = (dateMap[item.dateAjout] || 0) + item.quantite;
  });
  const timelineChartData = Object.keys(dateMap).sort().map(date => ({
    date,
    volume: dateMap[date]
  }));

  // 4. Chart Data: Physical Aspect Breakdown
  const aspectMap: Record<string, number> = {};
  filteredData.forEach(item => {
    aspectMap[item.aspect] = (aspectMap[item.aspect] || 0) + item.quantite;
  });
  const aspectChartData = Object.keys(aspectMap).map(key => ({
    aspect: key,
    volume: aspectMap[key]
  }));

  return (
    <div className="space-y-6">
      
      {/* Title & Filter Controls Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <span className="p-2 bg-indigo-500/10 text-indigo-500 rounded-xl">
                <BarChart3 className="w-5 h-5" />
              </span>
              <span>Tableau de Bord Analytics & Statistiques</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Visualisation graphique de la distribution et des volumes de déchets pour la Division HSE
            </p>
          </div>

          <button
            onClick={() => addToast('Graphiques actualisés avec les dernières données', 'info')}
            className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs flex items-center gap-2 transition-colors"
          >
            <RefreshCw className="w-4 h-4 text-cyan-500" />
            <span>Actualiser</span>
          </button>
        </div>

        {/* Filter Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div>
            <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">
              Filtrer par Type
            </label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">Tous les types ({wasteItems.length})</option>
              {Array.from(new Set(wasteItems.map(w => w.type))).map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">
              Filtrer par Dangerosité
            </label>
            <select
              value={selectedDanger}
              onChange={(e) => setSelectedDanger(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">Tous les codes HP</option>
              {Object.keys(HP_DANGER_CODES).map(code => (
                <option key={code} value={code}>
                  {code} - {HP_DANGER_CODES[code as keyof typeof HP_DANGER_CODES].label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">
              Période Temporelle
            </label>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">Toutes les dates enregistrées</option>
              <option value="7days">7 derniers jours</option>
              <option value="30days">30 derniers jours</option>
              <option value="90days">90 derniers jours</option>
              <option value="year">Année en cours</option>
            </select>
          </div>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-gradient-to-br from-sky-600 to-blue-700 text-white p-5 rounded-3xl shadow-xl space-y-2">
          <div className="flex items-center justify-between text-sky-100">
            <span className="text-xs font-bold uppercase tracking-wider">Total Enregistrements</span>
            <Droplets className="w-5 h-5 text-sky-200" />
          </div>
          <p className="text-3xl font-black">{filteredData.length}</p>
          <p className="text-[11px] text-sky-100/80">
            Sur {wasteItems.length} enregistrements totaux
          </p>
        </div>

        <div className="bg-gradient-to-br from-rose-600 to-red-700 text-white p-5 rounded-3xl shadow-xl space-y-2">
          <div className="flex items-center justify-between text-rose-100">
            <span className="text-xs font-bold uppercase tracking-wider">Déchets Risque Élevé</span>
            <ShieldAlert className="w-5 h-5 text-rose-200" />
          </div>
          <p className="text-3xl font-black">
            {filteredData.filter(x => ['H3', 'H4', 'H5', 'H6', 'H7', 'H8', 'H10'].includes(x.dangerosite)).length}
          </p>
          <p className="text-[11px] text-rose-100/80">
            Codes H3, H6, H7, H8, H10
          </p>
        </div>

        <div className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white p-5 rounded-3xl shadow-xl space-y-2">
          <div className="flex items-center justify-between text-emerald-100">
            <span className="text-xs font-bold uppercase tracking-wider">Volume Filtré Total</span>
            <TrendingUp className="w-5 h-5 text-emerald-200" />
          </div>
          <p className="text-3xl font-black">
            {filteredData.reduce((acc, x) => acc + x.quantite, 0).toLocaleString()}
          </p>
          <p className="text-[11px] text-emerald-100/80">
            Litres & Kilogrammes cumulés
          </p>
        </div>

        <div className="bg-gradient-to-br from-amber-600 to-orange-700 text-white p-5 rounded-3xl shadow-xl space-y-2">
          <div className="flex items-center justify-between text-amber-100">
            <span className="text-xs font-bold uppercase tracking-wider">Taux de Stock Utilisé</span>
            <Layers className="w-5 h-5 text-amber-200" />
          </div>
          <p className="text-3xl font-black">{metrics.capaciteUtiliseePct}%</p>
          <p className="text-[11px] text-amber-100/80">
            Seuil max réceptacle liquide/solide
          </p>
        </div>

      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 1: Donut Chart - Types Breakdown */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-cyan-500" />
              <span>Répartition par Type de Déchet</span>
            </h3>
            <span className="text-xs text-slate-400">Total: {typeChartData.length} types</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={typeChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                >
                  {typeChartData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Bar Chart - Danger Codes (HP) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-500" />
              <span>Répartition par Code Dangerosité (HP)</span>
            </h3>
            <span className="text-xs text-slate-400">Classification Réglementaire</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dangerChartData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="code" stroke="#888888" fontSize={11} />
                <YAxis stroke="#888888" fontSize={11} />
                <Tooltip 
                  formatter={(value: any, name: any, props: any) => [
                    `${value} enregistrement(s)`, 
                    props.payload.label
                  ]} 
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {dangerChartData.map((entry, index) => (
                    <Cell 
                      key={`bar-${index}`} 
                      fill={entry.isHighRisk ? '#f43f5e' : '#10b981'} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Line Chart - Timeline Trend */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              <span>Évolution Temporelle du Volume Généré (Kg / Litres)</span>
            </h3>
            <span className="text-xs text-slate-400">Courbe de production</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timelineChartData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="date" stroke="#888888" fontSize={11} />
                <YAxis stroke="#888888" fontSize={11} />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="volume" 
                  stroke="#0284c7" 
                  strokeWidth={3} 
                  dot={{ r: 5, fill: '#0284c7' }} 
                  activeDot={{ r: 8 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Detailed Text Statistical Summary */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-cyan-500" />
          <span>Synthèse Statistiques Détaillées - Division HSE</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 dark:text-white text-sm">
              • Répartition par Type Principal:
            </h4>
            <ul className="list-disc pl-5 space-y-1">
              {typeChartData.map(t => (
                <li key={t.name}>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{t.name}:</span> {t.value} déchet(s) ({((t.value / (filteredData.length || 1)) * 100).toFixed(1)}%)
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 dark:text-white text-sm">
              • Répartition par État Physique:
            </h4>
            <ul className="list-disc pl-5 space-y-1">
              {aspectChartData.map(a => (
                <li key={a.aspect}>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{a.aspect}:</span> {a.volume.toLocaleString()} {a.aspect === 'Liquide' ? 'Litres' : 'Kg'} cumulés
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

    </div>
  );
};
