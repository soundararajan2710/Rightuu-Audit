import React from 'react';
import { 
  Building2, 
  TrendingUp, 
  DollarSign, 
  Smile, 
  AlertTriangle, 
  Download, 
  Printer, 
  Filter,
  Sparkles,
  RefreshCw,
  Layers,
  Sun,
  BookOpen,
  Moon,
  Upload,
  FileSpreadsheet,
  CheckCircle2
} from 'lucide-react';
import { FilterState, ThemeMode, ProcessedAuditData } from '../types';

interface HeaderProps {
  data: ProcessedAuditData;
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenSimulator: () => void;
  onOpenUpload?: () => void;
  onOpenUploadModal?: () => void;
  onExportCSV: () => void;
  onPrintReport: () => void;
  theme?: ThemeMode;
  setTheme?: (theme: ThemeMode) => void;
}

export const ExecutiveHeader: React.FC<HeaderProps> = ({
  data,
  filters,
  setFilters,
  activeTab,
  setActiveTab,
  onOpenSimulator,
  onOpenUpload,
  onOpenUploadModal,
  onExportCSV,
  onPrintReport,
  theme = 'light',
  setTheme
}) => {
  const { totalMetrics, regions, departments, datasetInfo } = data;

  const handleOpenUploadModal = () => {
    if (onOpenUploadModal) {
      onOpenUploadModal();
    } else if (onOpenUpload) {
      onOpenUpload();
    }
  };

  const resetFilters = () => {
    setFilters({
      region: 'ALL',
      department: 'ALL',
      riskLevel: 'ALL',
      date: 'ALL',
      searchQuery: ''
    });
  };

  const hasActiveFilters = 
    filters.region !== 'ALL' || 
    filters.department !== 'ALL' || 
    filters.riskLevel !== 'ALL' || 
    filters.date !== 'ALL' || 
    filters.searchQuery !== '';

  return (
    <header className="border-b border-slate-200/80 bg-white/95 backdrop-blur-md sticky top-0 z-40 shadow-xs">
      {/* Top Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          
          {/* Brand & Document Metadata */}
          <div className="flex items-start gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-sm border border-slate-800">
              <Building2 className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="px-2.5 py-0.5 text-xs font-extrabold uppercase tracking-wider bg-blue-50 border border-blue-200 text-blue-800 rounded-full">
                  Rightuu Audit
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-semibold bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-full">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  {datasetInfo.fileName} ({data.records.length} records)
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-0.5 font-['Plus_Jakarta_Sans']">
                Executive Business Intelligence & Strategic Audit
              </h1>
            </div>
          </div>

          {/* Quick Action Buttons & Theme Switcher */}
          <div className="flex items-center gap-2.5 flex-wrap self-start lg:self-center">
            
            {/* Theme Selector */}
            <div className="inline-flex items-center p-0.5 bg-slate-100 border border-slate-200 rounded-lg text-xs font-medium text-slate-600">
              <button
                onClick={() => setTheme('light')}
                className={`inline-flex items-center gap-1 px-2 py-1 rounded-md transition-all cursor-pointer ${
                  theme === 'light' ? 'bg-white text-slate-900 font-semibold shadow-xs' : 'hover:text-slate-900'
                }`}
                title="Executive Crisp Light Theme"
              >
                <Sun className="w-3.5 h-3.5 text-amber-500" />
                <span className="hidden sm:inline">Light</span>
              </button>
              <button
                onClick={() => setTheme('editorial')}
                className={`inline-flex items-center gap-1 px-2 py-1 rounded-md transition-all cursor-pointer ${
                  theme === 'editorial' ? 'bg-white text-slate-900 font-semibold shadow-xs' : 'hover:text-slate-900'
                }`}
                title="Warm Editorial Paper Theme"
              >
                <BookOpen className="w-3.5 h-3.5 text-amber-700" />
                <span className="hidden sm:inline">Warm</span>
              </button>
              <button
                onClick={() => setTheme('midnight')}
                className={`inline-flex items-center gap-1 px-2 py-1 rounded-md transition-all cursor-pointer ${
                  theme === 'midnight' ? 'bg-white text-slate-900 font-semibold shadow-xs' : 'hover:text-slate-900'
                }`}
                title="Refined Midnight Theme"
              >
                <Moon className="w-3.5 h-3.5 text-indigo-600" />
                <span className="hidden sm:inline">Dark</span>
              </button>
            </div>

            {/* Upload Excel / CSV Button */}
            <button
              id="header-upload-data-btn"
              onClick={handleOpenUploadModal}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-xs transition-all active:scale-[0.98] cursor-pointer"
              title="Upload your own Excel (.xlsx) or CSV file"
            >
              <Upload className="w-4 h-4 text-emerald-200" />
              <span>Upload Excel / CSV</span>
            </button>

            <button
              id="header-open-simulator-btn"
              onClick={onOpenSimulator}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg shadow-xs transition-all active:scale-[0.98] cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-blue-200" />
              <span>Strategy Sandbox</span>
            </button>

            <button
              id="header-export-csv-btn"
              onClick={onExportCSV}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-300/80 rounded-lg transition-colors cursor-pointer"
              title="Export Current Dataset as CSV"
            >
              <Download className="w-4 h-4 text-slate-600" />
              <span className="hidden sm:inline">Export CSV</span>
            </button>

            <button
              id="header-print-report-btn"
              onClick={onPrintReport}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-300/80 rounded-lg transition-colors cursor-pointer"
              title="Print Rightuu Executive Report"
            >
              <Printer className="w-4 h-4 text-slate-600" />
              <span className="hidden sm:inline">Print Report</span>
            </button>
          </div>
        </div>

        {/* Global KPI Quick Ribbons */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-4 pt-3.5 border-t border-slate-200/80">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
            <div className="text-[11px] text-slate-600 font-medium flex items-center gap-1">
              <DollarSign className="w-3.5 h-3.5 text-emerald-600" /> Total Revenue
            </div>
            <div className="text-xl font-extrabold text-slate-900 font-mono tracking-tight mt-0.5">
              ${(totalMetrics.totalRevenue / 1000000).toFixed(2)}M
            </div>
            <div className="text-[10px] text-emerald-700 font-semibold mt-0.5">Top-line Volume</div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
            <div className="text-[11px] text-slate-600 font-medium flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-slate-600" /> Total Spend
            </div>
            <div className="text-xl font-extrabold text-slate-900 font-mono tracking-tight mt-0.5">
              ${(totalMetrics.totalSpend / 1000000).toFixed(2)}M
            </div>
            <div className="text-[10px] text-slate-500">Across {departments.length} departments</div>
          </div>

          <div className="bg-blue-50/60 border border-blue-200/80 rounded-xl p-3">
            <div className="text-[11px] text-blue-800 font-medium flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-blue-700" /> Net Profit
            </div>
            <div className={`text-xl font-extrabold font-mono tracking-tight mt-0.5 ${totalMetrics.netProfit >= 0 ? 'text-blue-800' : 'text-rose-700'}`}>
              {totalMetrics.netProfit >= 0 ? '+' : '-'}${Math.abs(totalMetrics.netProfit / 1000).toFixed(0)}k
            </div>
            <div className="text-[10px] text-blue-700 font-semibold mt-0.5">{totalMetrics.profitMarginPct}% Net Margin</div>
          </div>

          <div className="bg-amber-50/60 border border-amber-200/80 rounded-xl p-3">
            <div className="text-[11px] text-amber-800 font-medium flex items-center gap-1">
              <Smile className="w-3.5 h-3.5 text-amber-700" /> Avg CSAT Score
            </div>
            <div className="text-xl font-extrabold text-amber-900 font-mono tracking-tight mt-0.5">
              {totalMetrics.avgCSAT.toFixed(2)} <span className="text-xs text-amber-700 font-normal">/ 10</span>
            </div>
            <div className="text-[10px] text-amber-800 font-medium">Customer satisfaction</div>
          </div>

          <div className="bg-rose-50/60 border border-rose-200/80 rounded-xl p-3">
            <div className="text-[11px] text-rose-800 font-medium flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-700" /> Avg Churn Rate
            </div>
            <div className="text-xl font-extrabold text-rose-800 font-mono tracking-tight mt-0.5">
              {totalMetrics.avgChurnPctCustomerFacing.toFixed(1)}%
            </div>
            <div className="text-[10px] text-rose-700 font-medium">Customer-facing avg</div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
            <div className="text-[11px] text-slate-600 font-medium flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-slate-600" /> Risk Flags
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="px-2 py-0.5 text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200 rounded-md">
                {totalMetrics.riskDistribution.high} High
              </span>
              <span className="px-2 py-0.5 text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200 rounded-md">
                {totalMetrics.riskDistribution.medium} Med
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center justify-between gap-4 mt-4 pt-3 border-t border-slate-200/80 overflow-x-auto">
          <nav className="flex space-x-1.5 shrink-0" aria-label="Briefing Sections">
            {[
              { id: 'summary', label: '1. Executive Summary' },
              { id: 'metrics', label: '2. Key Metrics & Trends' },
              { id: 'risks', label: '3. Operational Risks & Anomalies' },
              { id: 'recommendations', label: '4. Strategic Recommendations' },
              { id: 'explorer', label: 'Dataset Explorer' },
            ].map((tab) => (
              <button
                key={tab.id}
                id={`tab-btn-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Global Interactive Filter Bar */}
      <div className="bg-slate-50 border-t border-slate-200/80 px-4 sm:px-6 lg:px-8 py-2.5">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
          
          <div className="flex items-center gap-2 text-slate-600 shrink-0">
            <Filter className="w-3.5 h-3.5 text-blue-700" />
            <span className="font-bold uppercase tracking-wider text-[11px] text-slate-800">Global Ledger Filters:</span>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Region Filter */}
            <div className="flex items-center gap-1.5 bg-white border border-slate-300/80 rounded-md px-2.5 py-1 shadow-xs">
              <span className="text-slate-500 font-medium">Region:</span>
              <select
                id="filter-region-select"
                value={filters.region}
                onChange={(e) => setFilters(prev => ({ ...prev, region: e.target.value }))}
                className="bg-transparent text-slate-800 font-semibold focus:outline-none cursor-pointer"
              >
                <option value="ALL">All Regions ({regions.length})</option>
                {regions.map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            {/* Department Filter */}
            <div className="flex items-center gap-1.5 bg-white border border-slate-300/80 rounded-md px-2.5 py-1 shadow-xs">
              <span className="text-slate-500 font-medium">Department:</span>
              <select
                id="filter-department-select"
                value={filters.department}
                onChange={(e) => setFilters(prev => ({ ...prev, department: e.target.value }))}
                className="bg-transparent text-slate-800 font-semibold focus:outline-none cursor-pointer"
              >
                <option value="ALL">All Departments ({departments.length})</option>
                {departments.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            {/* Risk Level Filter */}
            <div className="flex items-center gap-1.5 bg-white border border-slate-300/80 rounded-md px-2.5 py-1 shadow-xs">
              <span className="text-slate-500 font-medium">Risk Level:</span>
              <select
                id="filter-risk-select"
                value={filters.riskLevel}
                onChange={(e) => setFilters(prev => ({ ...prev, riskLevel: e.target.value }))}
                className="bg-transparent text-slate-800 font-semibold focus:outline-none cursor-pointer"
              >
                <option value="ALL">All Risk Levels</option>
                <option value="High" className="text-rose-700">High Risk ({totalMetrics.riskDistribution.high})</option>
                <option value="Medium" className="text-amber-700">Medium Risk ({totalMetrics.riskDistribution.medium})</option>
                <option value="Low" className="text-emerald-700">Low Risk ({totalMetrics.riskDistribution.low})</option>
              </select>
            </div>

            {hasActiveFilters && (
              <button
                id="reset-filters-btn"
                onClick={resetFilters}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-300 rounded-md transition-colors font-medium shadow-xs cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
