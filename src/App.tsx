import React, { useState } from 'react';
import { ExecutiveHeader } from './components/ExecutiveHeader';
import { ExecutiveSummarySection } from './components/ExecutiveSummarySection';
import { KeyMetricsTrendsSection } from './components/KeyMetricsTrendsSection';
import { OperationalRisksSection } from './components/OperationalRisksSection';
import { StrategicRecommendationsSection } from './components/StrategicRecommendationsSection';
import { DataExplorerSection } from './components/DataExplorerSection';
import { InteractiveSimulatorModal } from './components/InteractiveSimulatorModal';
import { UploadDataModal } from './components/UploadDataModal';
import { PrintReportView } from './components/PrintReportView';
import { FilterState, Region, ProcessedAuditData } from './types';
import { getDefaultAuditData } from './utils/dataEngine';
import { 
  Building2, 
  CheckCircle, 
  FileText, 
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  FileSpreadsheet,
  RefreshCw,
  Sparkles
} from 'lucide-react';

export default function App() {
  const [auditData, setAuditData] = useState<ProcessedAuditData>(() => getDefaultAuditData());
  const [activeTab, setActiveTab] = useState<string>('summary');
  const [isSimulatorOpen, setIsSimulatorOpen] = useState<boolean>(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);
  const [isPrintViewOpen, setIsPrintViewOpen] = useState<boolean>(false);
  const [uploadSuccessMessage, setUploadSuccessMessage] = useState<string | null>(null);

  const [filters, setFilters] = useState<FilterState>({
    region: 'ALL',
    department: 'ALL',
    riskLevel: 'ALL',
    date: 'ALL',
    searchTerm: ''
  });

  const handleFilterRegion = (region: Region) => {
    setFilters(prev => ({ ...prev, region }));
    setActiveTab('explorer');
  };

  const handleResetFilters = () => {
    setFilters({
      region: 'ALL',
      department: 'ALL',
      riskLevel: 'ALL',
      date: 'ALL',
      searchTerm: ''
    });
  };

  const handleDataLoaded = (newData: ProcessedAuditData) => {
    setAuditData(newData);
    // Reset filters to avoid empty filter views on new dataset
    handleResetFilters();
    setUploadSuccessMessage(`Successfully audited "${newData.datasetInfo.fileName}" with ${newData.records.length} records!`);
    setTimeout(() => setUploadSuccessMessage(null), 6000);
  };

  const handleResetToDefault = () => {
    const defaultData = getDefaultAuditData();
    setAuditData(defaultData);
    handleResetFilters();
    setUploadSuccessMessage('Restored standard Rightuu benchmark dataset.');
    setTimeout(() => setUploadSuccessMessage(null), 5000);
  };

  const handleExportCSV = () => {
    const headers = [
      'Date',
      'Department',
      'Region',
      'Monthly_Spend_USD',
      'Monthly_Revenue_USD',
      'Net_Profit_USD',
      'Profit_Margin_Pct',
      'Customer_Satisfaction_Score',
      'Churn_Rate_Pct',
      'Risk_Level'
    ];

    const rows = auditData.records.map(r => [
      r.date,
      r.department,
      r.region,
      r.monthlySpendUSD,
      r.monthlyRevenueUSD,
      r.netProfitUSD,
      r.profitMarginPct,
      r.customerSatisfactionScore,
      r.churnRatePct,
      r.riskLevel
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `rightuu_audit_${auditData.datasetInfo.fileName.replace(/\.[^/.]+$/, '')}_export.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrintReport = () => {
    setIsPrintViewOpen(true);
  };

  if (isPrintViewOpen) {
    return <PrintReportView data={auditData} onClose={() => setIsPrintViewOpen(false)} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-['Plus_Jakarta_Sans'] antialiased flex flex-col selection:bg-blue-100 selection:text-blue-900">
      
      {/* Dynamic Upload Notification Toast */}
      {uploadSuccessMessage && (
        <div className="bg-emerald-600 text-white px-4 py-2.5 text-xs font-semibold flex items-center justify-between shadow-md transition-all">
          <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-3">
            <span className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-200" />
              {uploadSuccessMessage}
            </span>
            <button 
              onClick={() => setUploadSuccessMessage(null)}
              className="text-emerald-100 hover:text-white text-xs underline cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Top Fixed Header with Quick KPIs, Global Filters & File Upload */}
      <ExecutiveHeader
        data={auditData}
        filters={filters}
        setFilters={setFilters}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenSimulator={() => setIsSimulatorOpen(true)}
        onOpenUploadModal={() => setIsUploadModalOpen(true)}
        onOpenUpload={() => setIsUploadModalOpen(true)}
        onExportCSV={handleExportCSV}
        onPrintReport={handlePrintReport}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        
        {/* Render Tab Content */}
        {activeTab === 'summary' && (
          <ExecutiveSummarySection 
            data={auditData}
            onSelectTab={setActiveTab}
            onFilterRegion={handleFilterRegion}
            onOpenUploadModal={() => setIsUploadModalOpen(true)}
          />
        )}

        {activeTab === 'metrics' && (
          <KeyMetricsTrendsSection 
            data={auditData}
          />
        )}

        {activeTab === 'risks' && (
          <OperationalRisksSection 
            data={auditData}
          />
        )}

        {activeTab === 'recommendations' && (
          <StrategicRecommendationsSection 
            data={auditData}
            onOpenSimulatorModal={() => setIsSimulatorOpen(true)}
          />
        )}

        {activeTab === 'explorer' && (
          <DataExplorerSection 
            data={auditData}
            filters={filters}
            onFilterChange={setFilters}
            onResetFilters={handleResetFilters}
            onOpenUploadModal={() => setIsUploadModalOpen(true)}
          />
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-blue-700" />
            <span className="font-bold text-slate-800">Rightuu Audit Platform</span>
            <span className="text-slate-400">• Active Dataset: <strong className="text-slate-600">{auditData.datasetInfo.fileName}</strong> ({auditData.records.length} records)</span>
          </div>
          <div className="flex items-center gap-4 flex-wrap">
            <button 
              onClick={() => setIsUploadModalOpen(true)}
              className="text-blue-700 hover:text-blue-800 font-bold transition-colors cursor-pointer flex items-center gap-1"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              Upload Excel / CSV
            </button>
            <button 
              onClick={handleResetToDefault}
              className="text-slate-600 hover:text-slate-900 font-medium transition-colors cursor-pointer flex items-center gap-1"
              title="Reset to default benchmark dataset"
            >
              <RefreshCw className="w-3 h-3" />
              Reset Benchmark
            </button>
            <button 
              onClick={() => setIsSimulatorOpen(true)}
              className="text-slate-600 hover:text-blue-700 font-medium transition-colors cursor-pointer"
            >
              Scenario Simulator
            </button>
            <button 
              onClick={handleExportCSV}
              className="text-slate-600 hover:text-blue-700 font-medium transition-colors cursor-pointer"
            >
              Download CSV
            </button>
            <button 
              onClick={handlePrintReport}
              className="text-slate-600 hover:text-blue-700 font-medium transition-colors cursor-pointer"
            >
              Printable PDF
            </button>
          </div>
        </div>
      </footer>

      {/* Upload Data Modal */}
      <UploadDataModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onDataLoaded={handleDataLoaded}
        currentData={auditData}
        currentFileName={auditData.datasetInfo.fileName}
      />

      {/* Interactive Scenario Sandbox Modal */}
      <InteractiveSimulatorModal
        isOpen={isSimulatorOpen}
        onClose={() => setIsSimulatorOpen(false)}
        data={auditData}
      />

    </div>
  );
}
