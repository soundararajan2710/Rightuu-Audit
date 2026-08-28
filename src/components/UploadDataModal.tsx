import React, { useState, useRef } from 'react';
import { 
  Upload, 
  FileSpreadsheet, 
  FileText, 
  Download, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  Sparkles, 
  ArrowRight, 
  RefreshCw,
  Layers,
  Database
} from 'lucide-react';
import { ProcessedAuditData } from '../types';
import { parseCSVData, parseExcelBuffer, getDefaultAuditData, generateSampleExcelBlob } from '../utils/dataEngine';
import { RAW_CSV_DATA } from '../data/businessData';

interface UploadDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDataLoaded: (data: ProcessedAuditData) => void;
  currentData?: ProcessedAuditData;
  currentFileName?: string;
}

export const UploadDataModal: React.FC<UploadDataModalProps> = ({
  isOpen,
  onClose,
  onDataLoaded,
  currentData,
  currentFileName
}) => {
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [previewData, setPreviewData] = useState<ProcessedAuditData | null>(null);
  const [rawTextInput, setRawTextInput] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'upload' | 'paste' | 'templates'>('upload');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFile = async (file: File) => {
    setErrorMessage(null);
    setSuccessMessage(null);

    const fileName = file.name.toLowerCase();
    try {
      if (fileName.endsWith('.csv') || file.type === 'text/csv') {
        const text = await file.text();
        const processed = parseCSVData(text, file.name);
        if (processed.records.length === 0) {
          throw new Error('No valid data records could be extracted from this CSV file. Please ensure columns include Department, Region, Spend, and Revenue.');
        }
        setPreviewData(processed);
        setSuccessMessage(`Successfully parsed ${processed.records.length} records across ${processed.regions.length} regions and ${processed.departments.length} departments.`);
      } else if (fileName.endsWith('.xlsx') || fileName.endsWith('.xls') || file.type.includes('spreadsheet') || file.type.includes('excel')) {
        const arrayBuffer = await file.arrayBuffer();
        const processed = parseExcelBuffer(arrayBuffer, file.name);
        if (processed.records.length === 0) {
          throw new Error('No valid data rows found in the Excel workbook. Check that the first worksheet contains headers like Date, Department, Region, Spend, Revenue.');
        }
        setPreviewData(processed);
        setSuccessMessage(`Successfully parsed ${processed.records.length} records from Excel worksheet.`);
      } else {
        throw new Error('Unsupported file format. Please upload a .csv, .xlsx, or .xls file.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to parse file. Please check formatting.');
      setPreviewData(null);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
    // Clear value so user can select the same file again if desired
    e.target.value = '';
  };

  const handleApplyPreview = () => {
    if (previewData) {
      onDataLoaded(previewData);
      onClose();
    }
  };

  const handleParsePastedText = () => {
    if (!rawTextInput.trim()) {
      setErrorMessage('Please paste valid CSV content into the text area.');
      return;
    }
    try {
      const processed = parseCSVData(rawTextInput, 'Pasted_Audit_Data.csv');
      if (processed.records.length === 0) {
        throw new Error('Could not parse any rows from the pasted text.');
      }
      setPreviewData(processed);
      setSuccessMessage(`Successfully parsed ${processed.records.length} records from pasted text.`);
      setErrorMessage(null);
    } catch (err: any) {
      setErrorMessage(err.message || 'Invalid CSV format.');
      setPreviewData(null);
    }
  };

  const handleDownloadSampleCSV = () => {
    const blob = new Blob([RAW_CSV_DATA], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Rightuu_Audit_Template.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadSampleExcel = () => {
    const blob = generateSampleExcelBlob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Rightuu_Audit_Template.xlsx';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleResetToBaseline = () => {
    const defaultData = getDefaultAuditData();
    onDataLoaded(defaultData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div 
        id="upload-data-modal"
        className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden text-slate-900"
      >
        
        {/* Header */}
        <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-700 flex items-center justify-center text-white shadow-xs">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 font-['Plus_Jakarta_Sans']">
                Import Audit Dataset (Excel or CSV)
              </h3>
              <p className="text-xs text-slate-500">
                Upload your organization's financial & operational data to instantly generate executive briefings
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-2 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex border-b border-slate-200 px-6 bg-white gap-4 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('upload')}
            className={`py-3 border-b-2 flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'upload'
                ? 'border-blue-700 text-blue-700'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Upload className="w-3.5 h-3.5" /> File Upload (.xlsx, .csv)
          </button>
          <button
            onClick={() => setActiveTab('paste')}
            className={`py-3 border-b-2 flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'paste'
                ? 'border-blue-700 text-blue-700'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5" /> Paste CSV Text
          </button>
          <button
            onClick={() => setActiveTab('templates')}
            className={`py-3 border-b-2 flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'templates'
                ? 'border-blue-700 text-blue-700'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Download className="w-3.5 h-3.5" /> Templates & Presets
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* TAB 1: File Upload */}
          {activeTab === 'upload' && (
            <div className="space-y-4">
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                  dragActive 
                    ? 'border-blue-600 bg-blue-50/50 scale-[0.99]' 
                    : 'border-slate-300 hover:border-blue-400 bg-slate-50/40 hover:bg-blue-50/20'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv, .xlsx, .xls, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel, text/csv"
                  onChange={handleInputChange}
                  className="hidden"
                />

                <div className="flex justify-center mb-3">
                  <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-700 shadow-xs">
                    <FileSpreadsheet className="w-7 h-7" />
                  </div>
                </div>

                <h4 className="text-sm font-bold text-slate-900">
                  Drag and drop your Excel or CSV file here
                </h4>
                <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                  Supports Microsoft Excel (<strong className="text-slate-700">.xlsx, .xls</strong>) and Comma-Separated Values (<strong className="text-slate-700">.csv</strong>).
                </p>

                <div className="mt-4">
                  <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-bold shadow-xs transition-colors">
                    <Upload className="w-3.5 h-3.5" /> Browse Computer
                  </span>
                </div>
              </div>

              {/* Supported Columns Guide */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-600">
                <span className="font-bold text-slate-900 block mb-1.5">
                  Expected Column Headers (Auto-Normalized):
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    'Date (YYYY-MM-DD)', 
                    'Department', 
                    'Region', 
                    'Monthly_Spend_USD', 
                    'Monthly_Revenue_USD', 
                    'Customer_Satisfaction_Score', 
                    'Churn_Rate_Pct', 
                    'Risk_Level (Optional)'
                  ].map((col, idx) => (
                    <span key={idx} className="px-2 py-0.5 bg-white border border-slate-200 rounded text-[11px] font-mono text-slate-800">
                      {col}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Paste CSV */}
          {activeTab === 'paste' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Paste Raw CSV or Tab-Delimited Records:
                </label>
                <textarea
                  value={rawTextInput}
                  onChange={(e) => setRawTextInput(e.target.value)}
                  rows={8}
                  placeholder={`Date,Department,Region,Monthly_Spend_USD,Monthly_Revenue_USD,Customer_Satisfaction_Score,Churn_Rate_Pct,Risk_Level\n2025-01-31,Engineering,North America,185000,0,8.2,0.0,Low\n2025-01-31,Sales,North America,120000,450000,7.9,2.1,Medium`}
                  className="w-full text-xs font-mono p-3 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleParsePastedText}
                  className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-bold shadow-xs transition-colors cursor-pointer"
                >
                  Parse Pasted Data
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: Templates & Presets */}
          {activeTab === 'templates' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                <div className="border border-slate-200 rounded-xl p-4.5 bg-white hover:border-blue-300 transition-colors">
                  <div className="flex items-center gap-2 mb-2">
                    <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
                    <h4 className="font-bold text-slate-900 text-sm">Download Blank Excel Template</h4>
                  </div>
                  <p className="text-xs text-slate-500 mb-4">
                    Get an empty or pre-populated .xlsx sheet with formatted headers, ready to fill in with your real numbers.
                  </p>
                  <button
                    onClick={handleDownloadSampleExcel}
                    className="w-full py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-bold transition-colors inline-flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" /> Download .xlsx Template
                  </button>
                </div>

                <div className="border border-slate-200 rounded-xl p-4.5 bg-white hover:border-blue-300 transition-colors">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="w-5 h-5 text-blue-600" />
                    <h4 className="font-bold text-slate-900 text-sm">Download Blank CSV Template</h4>
                  </div>
                  <p className="text-xs text-slate-500 mb-4">
                    Download a standard .csv schema file to import into Google Sheets, Excel, or Python pipelines.
                  </p>
                  <button
                    onClick={handleDownloadSampleCSV}
                    className="w-full py-2 bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 rounded-lg text-xs font-bold transition-colors inline-flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" /> Download .csv Template
                  </button>
                </div>

              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                <div>
                  <h5 className="font-bold text-slate-900 text-xs">Reset to Baseline Sample Dataset</h5>
                  <p className="text-[11px] text-slate-500">Restore the 40-record FY 2025 Multi-Regional benchmark.</p>
                </div>
                <button
                  onClick={handleResetToBaseline}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg transition-colors inline-flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Load Baseline
                </button>
              </div>
            </div>
          )}

          {/* Feedback Messages */}
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold">Error Parsing Dataset:</strong>
                <span>{errorMessage}</span>
              </div>
            </div>
          )}

          {successMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold">Data Ready for Audit:</strong>
                <span>{successMessage}</span>
              </div>
            </div>
          )}

          {/* Preview of Parsed Data */}
          {previewData && (
            <div className="border border-blue-200 rounded-xl p-4 bg-blue-50/30 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-800">
                  Dataset Audit Summary Preview:
                </span>
                <span className="text-xs font-mono font-bold text-slate-900">
                  {previewData.records.length} records parsed
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                  <span className="text-[10px] text-slate-500 block">Total Revenue</span>
                  <span className="font-bold text-emerald-700 font-mono text-sm">
                    ${(previewData.totalMetrics.totalRevenue / 1000000).toFixed(2)}M
                  </span>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                  <span className="text-[10px] text-slate-500 block">Total Spend</span>
                  <span className="font-bold text-slate-900 font-mono text-sm">
                    ${(previewData.totalMetrics.totalSpend / 1000000).toFixed(2)}M
                  </span>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                  <span className="text-[10px] text-slate-500 block">Net Profit</span>
                  <span className={`font-bold font-mono text-sm ${previewData.totalMetrics.netProfit >= 0 ? 'text-blue-700' : 'text-rose-700'}`}>
                    {previewData.totalMetrics.netProfit >= 0 ? '+' : '-'}${Math.abs(previewData.totalMetrics.netProfit / 1000).toFixed(0)}k
                  </span>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                  <span className="text-[10px] text-slate-500 block">Operating Margin</span>
                  <span className="font-bold text-blue-800 font-mono text-sm">
                    {previewData.totalMetrics.profitMarginPct}%
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-slate-600">
                <span>Regions ({previewData.regions.length}): <strong className="text-slate-800">{previewData.regions.join(', ')}</strong></span>
                <span>•</span>
                <span>Depts ({previewData.departments.length}): <strong className="text-slate-800">{previewData.departments.join(', ')}</strong></span>
              </div>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            Current Active: <strong className="text-slate-700">{currentData?.datasetInfo?.fileName || currentFileName || 'Benchmark Dataset'}</strong> ({currentData?.records?.length || '40'} records)
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              id="apply-dataset-btn"
              disabled={!previewData}
              onClick={handleApplyPreview}
              className={`px-5 py-2 text-xs font-bold rounded-lg transition-all inline-flex items-center gap-1.5 shadow-xs cursor-pointer ${
                previewData
                  ? 'bg-blue-700 hover:bg-blue-800 text-white shadow-blue-200'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              Apply to Rightuu Audit <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
