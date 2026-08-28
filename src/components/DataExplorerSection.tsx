import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Download, 
  ArrowUpDown, 
  ArrowUp, 
  ArrowDown, 
  Filter, 
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Flame,
  FileSpreadsheet,
  Layers,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { ProcessedAuditData, BusinessRecord, FilterState, Region, Department, RiskLevel } from '../types';

interface DataExplorerSectionProps {
  data: ProcessedAuditData;
  filters: FilterState;
  onFilterChange: (newFilters: FilterState) => void;
  onResetFilters: () => void;
  onOpenUploadModal?: () => void;
}

type SortField = keyof BusinessRecord;
type SortOrder = 'asc' | 'desc';

export const DataExplorerSection: React.FC<DataExplorerSectionProps> = ({
  data,
  filters,
  onFilterChange,
  onResetFilters,
  onOpenUploadModal
}) => {
  const { records, regions, departments, datasetInfo } = data;

  const [sortField, setSortField] = useState<SortField>('date');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 15;

  // Filter records based on active filters
  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      // Search term
      if (filters.searchTerm) {
        const term = filters.searchTerm.toLowerCase();
        const matchesSearch = 
          r.department.toLowerCase().includes(term) ||
          r.region.toLowerCase().includes(term) ||
          r.date.toLowerCase().includes(term) ||
          r.riskLevel.toLowerCase().includes(term);
        if (!matchesSearch) return false;
      }

      // Region filter
      if (filters.region !== 'ALL' && r.region !== filters.region) {
        return false;
      }

      // Department filter
      if (filters.department !== 'ALL' && r.department !== filters.department) {
        return false;
      }

      // Risk level filter
      if (filters.riskLevel !== 'ALL' && r.riskLevel !== filters.riskLevel) {
        return false;
      }

      return true;
    });
  }, [records, filters]);

  // Sort records
  const sortedRecords = useMemo(() => {
    return [...filteredRecords].sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      if (typeof aVal === 'string') {
        return sortOrder === 'asc' 
          ? (aVal as string).localeCompare(bVal as string)
          : (bVal as string).localeCompare(aVal as string);
      }

      return sortOrder === 'asc' 
        ? (aVal as number) - (bVal as number)
        : (bVal as number) - (aVal as number);
    });
  }, [filteredRecords, sortField, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(sortedRecords.length / itemsPerPage) || 1;
  const paginatedRecords = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedRecords.slice(start, start + itemsPerPage);
  }, [sortedRecords, currentPage, itemsPerPage]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
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

    const rows = sortedRecords.map(r => [
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
    link.setAttribute('download', `rightuu_audit_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />;
    return sortOrder === 'asc' 
      ? <ArrowUp className="w-3.5 h-3.5 text-blue-700 font-bold" />
      : <ArrowDown className="w-3.5 h-3.5 text-blue-700 font-bold" />;
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header & Meta */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-700">Rightuu Ledger Explorer</span>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight font-['Plus_Jakarta_Sans']">
            Raw Audit Ledger & Cohort Explorer
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Displaying {filteredRecords.length} matching rows of {records.length} total entries from <strong className="text-slate-700">{datasetInfo.fileName}</strong>
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {onOpenUploadModal && (
            <button
              id="upload-data-secondary-btn"
              onClick={onOpenUploadModal}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-blue-700" />
              <span>Load Another File</span>
            </button>
          )}
          <button
            id="export-csv-btn"
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          
          {/* Search Box */}
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              id="ledger-search-input"
              type="text"
              placeholder="Search department, region, date, or risk..."
              value={filters.searchTerm}
              onChange={(e) => onFilterChange({ ...filters, searchTerm: e.target.value })}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-300/80 rounded-lg text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all font-medium"
            />
          </div>

          {/* Quick Filter Dropdowns */}
          <div className="flex items-center gap-2 flex-wrap text-xs">
            <select
              id="explorer-region-select"
              value={filters.region}
              onChange={(e) => onFilterChange({ ...filters, region: e.target.value })}
              className="bg-slate-50 border border-slate-300/80 rounded-lg px-2.5 py-2 text-slate-800 font-semibold focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Regions ({regions.length})</option>
              {regions.map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>

            <select
              id="explorer-dept-select"
              value={filters.department}
              onChange={(e) => onFilterChange({ ...filters, department: e.target.value })}
              className="bg-slate-50 border border-slate-300/80 rounded-lg px-2.5 py-2 text-slate-800 font-semibold focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Departments ({departments.length})</option>
              {departments.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>

            <select
              id="explorer-risk-select"
              value={filters.riskLevel}
              onChange={(e) => onFilterChange({ ...filters, riskLevel: e.target.value })}
              className="bg-slate-50 border border-slate-300/80 rounded-lg px-2.5 py-2 text-slate-800 font-semibold focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Risk Levels</option>
              <option value="High">High Risk</option>
              <option value="Medium">Medium Risk</option>
              <option value="Low">Low Risk</option>
            </select>

            {(filters.region !== 'ALL' || filters.department !== 'ALL' || filters.riskLevel !== 'ALL' || filters.searchTerm !== '') && (
              <button
                id="explorer-reset-btn"
                onClick={onResetFilters}
                className="p-2 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                title="Reset filters"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

        </div>
      </div>

      {/* Ledger Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider select-none">
                <th onClick={() => handleSort('date')} className="py-3 px-3.5 cursor-pointer hover:bg-slate-100 transition-colors">
                  <div className="flex items-center gap-1">
                    <span>Date</span>
                    {getSortIcon('date')}
                  </div>
                </th>
                <th onClick={() => handleSort('department')} className="py-3 px-3.5 cursor-pointer hover:bg-slate-100 transition-colors">
                  <div className="flex items-center gap-1">
                    <span>Department</span>
                    {getSortIcon('department')}
                  </div>
                </th>
                <th onClick={() => handleSort('region')} className="py-3 px-3.5 cursor-pointer hover:bg-slate-100 transition-colors">
                  <div className="flex items-center gap-1">
                    <span>Region</span>
                    {getSortIcon('region')}
                  </div>
                </th>
                <th onClick={() => handleSort('monthlySpendUSD')} className="py-3 px-3.5 cursor-pointer hover:bg-slate-100 transition-colors">
                  <div className="flex items-center gap-1">
                    <span>Spend (USD)</span>
                    {getSortIcon('monthlySpendUSD')}
                  </div>
                </th>
                <th onClick={() => handleSort('monthlyRevenueUSD')} className="py-3 px-3.5 cursor-pointer hover:bg-slate-100 transition-colors">
                  <div className="flex items-center gap-1">
                    <span>Revenue (USD)</span>
                    {getSortIcon('monthlyRevenueUSD')}
                  </div>
                </th>
                <th onClick={() => handleSort('netProfitUSD')} className="py-3 px-3.5 cursor-pointer hover:bg-slate-100 transition-colors">
                  <div className="flex items-center gap-1">
                    <span>Net Profit</span>
                    {getSortIcon('netProfitUSD')}
                  </div>
                </th>
                <th onClick={() => handleSort('customerSatisfactionScore')} className="py-3 px-3.5 cursor-pointer hover:bg-slate-100 transition-colors">
                  <div className="flex items-center gap-1">
                    <span>CSAT</span>
                    {getSortIcon('customerSatisfactionScore')}
                  </div>
                </th>
                <th onClick={() => handleSort('churnRatePct')} className="py-3 px-3.5 cursor-pointer hover:bg-slate-100 transition-colors">
                  <div className="flex items-center gap-1">
                    <span>Churn %</span>
                    {getSortIcon('churnRatePct')}
                  </div>
                </th>
                <th onClick={() => handleSort('riskLevel')} className="py-3 px-3.5 cursor-pointer hover:bg-slate-100 transition-colors">
                  <div className="flex items-center gap-1">
                    <span>Risk Level</span>
                    {getSortIcon('riskLevel')}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {paginatedRecords.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-10 text-slate-400">
                    No matching records found for the active filter selection.
                  </td>
                </tr>
              ) : (
                paginatedRecords.map((r) => {
                  const isProfit = r.netProfitUSD >= 0;
                  const isCostCenter = r.monthlyRevenueUSD === 0;

                  return (
                    <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-3.5 font-mono text-slate-900 font-semibold">{r.date}</td>
                      <td className="py-3 px-3.5 font-bold text-slate-900">{r.department}</td>
                      <td className="py-3 px-3.5 text-slate-700">{r.region}</td>
                      <td className="py-3 px-3.5 font-mono text-slate-800">${r.monthlySpendUSD.toLocaleString()}</td>
                      <td className="py-3 px-3.5 font-mono font-bold text-slate-900">
                        {isCostCenter ? <span className="text-slate-400 font-normal">$0</span> : `$${r.monthlyRevenueUSD.toLocaleString()}`}
                      </td>
                      <td className="py-3 px-3.5 font-mono">
                        {isCostCenter ? (
                          <span className="text-slate-500">-${r.monthlySpendUSD.toLocaleString()}</span>
                        ) : isProfit ? (
                          <span className="text-emerald-700 font-bold">+${r.netProfitUSD.toLocaleString()}</span>
                        ) : (
                          <span className="text-rose-700 font-bold">-${Math.abs(r.netProfitUSD).toLocaleString()}</span>
                        )}
                      </td>
                      <td className="py-3 px-3.5 font-mono font-bold text-slate-900">
                        {r.customerSatisfactionScore} <span className="text-slate-400 font-normal">/10</span>
                      </td>
                      <td className="py-3 px-3.5 font-mono">
                        <span className={r.churnRatePct > 5.0 ? 'text-rose-700 font-bold' : r.churnRatePct > 0 ? 'text-slate-800' : 'text-slate-400'}>
                          {r.churnRatePct}%
                        </span>
                      </td>
                      <td className="py-3 px-3.5">
                        {r.riskLevel === 'High' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                            <Flame className="w-3 h-3 text-rose-600" /> High
                          </span>
                        ) : r.riskLevel === 'Medium' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                            <AlertTriangle className="w-3 h-3 text-amber-600" /> Medium
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Low
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="bg-slate-50 px-4 py-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
          <div>
            Showing <strong className="text-slate-900 font-semibold">{Math.min(sortedRecords.length, (currentPage - 1) * itemsPerPage + 1)}</strong> to{' '}
            <strong className="text-slate-900 font-semibold">{Math.min(sortedRecords.length, currentPage * itemsPerPage)}</strong> of{' '}
            <strong className="text-slate-900 font-semibold">{sortedRecords.length}</strong> entries
          </div>

          <div className="flex items-center gap-1.5">
            <button
              id="prev-page-btn"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              className="p-1.5 rounded border border-slate-300/80 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4 text-slate-700" />
            </button>
            <span className="px-2 font-medium">Page {currentPage} of {totalPages}</span>
            <button
              id="next-page-btn"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              className="p-1.5 rounded border border-slate-300/80 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4 text-slate-700" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
