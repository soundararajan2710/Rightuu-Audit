import React, { useState } from 'react';
import { 
  ShieldAlert, 
  AlertTriangle, 
  AlertCircle, 
  CheckCircle2, 
  Flame, 
  Activity, 
  Search, 
  TrendingDown, 
  ArrowRight,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { ProcessedAuditData } from '../types';

interface OperationalRisksSectionProps {
  data: ProcessedAuditData;
}

export const OperationalRisksSection: React.FC<OperationalRisksSectionProps> = ({ data }) => {
  const [selectedSeverity, setSelectedSeverity] = useState<string>('ALL');
  const [expandedRiskId, setExpandedRiskId] = useState<string | null>('risk-1');

  const { operationalRisks, records, totalMetrics } = data;

  // Filter high and medium risk records from active dataset
  const highRiskRecords = records.filter(r => r.riskLevel === 'High');
  const mediumRiskRecords = records.filter(r => r.riskLevel === 'Medium');
  const lowRiskRecords = records.filter(r => r.riskLevel === 'Low');

  const filteredRisks = operationalRisks.filter(risk => {
    if (selectedSeverity === 'ALL') return true;
    return risk.severity === selectedSeverity;
  });

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-rose-700">Section 3</span>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight font-['Plus_Jakarta_Sans']">
            Operational Risks & Statistical Anomalies
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Systemic vulnerability identification, abnormal cohort deviations, and operational bottlenecks across active data
          </p>
        </div>

        {/* Severity Filter Pills */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSelectedSeverity('ALL')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              selectedSeverity === 'ALL'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 bg-slate-100'
            }`}
          >
            All Risks ({operationalRisks.length})
          </button>
          <button
            onClick={() => setSelectedSeverity('High')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              selectedSeverity === 'High'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'text-rose-700 hover:bg-rose-50 bg-rose-50/50 border border-rose-200'
            }`}
          >
            High Severity ({operationalRisks.filter(r => r.severity === 'High').length})
          </button>
          <button
            onClick={() => setSelectedSeverity('Medium')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              selectedSeverity === 'Medium'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-amber-800 hover:bg-amber-50 bg-amber-50/50 border border-amber-200'
            }`}
          >
            Medium Severity ({operationalRisks.filter(r => r.severity === 'Medium').length})
          </button>
        </div>
      </div>

      {/* Summary Risk Dashboard Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-rose-50/60 border border-rose-200 rounded-xl p-4.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-800">High Risk Incidents</span>
            <Flame className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-3xl font-extrabold text-rose-900 font-mono mt-2">
            {highRiskRecords.length} Records
          </div>
          <p className="text-xs text-rose-700/90 mt-1 font-medium">
            {highRiskRecords.length > 0 
              ? `${((highRiskRecords.length / records.length) * 100).toFixed(1)}% of total evaluated ledger entries.`
              : 'Zero high risk incidents detected in this dataset.'}
          </p>
        </div>

        <div className="bg-amber-50/60 border border-amber-200 rounded-xl p-4.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-800">Medium Risk Incidents</span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-3xl font-extrabold text-amber-900 font-mono mt-2">
            {mediumRiskRecords.length} Records
          </div>
          <p className="text-xs text-amber-700/90 mt-1 font-medium">
            Moderate churn elevation or margin volatility.
          </p>
        </div>

        <div className="bg-emerald-50/60 border border-emerald-200 rounded-xl p-4.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">Low Risk Baseline</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-900 font-mono mt-2">
            {lowRiskRecords.length} Records
          </div>
          <p className="text-xs text-emerald-700/90 mt-1 font-medium">
            Standard operating baseline and stable performance.
          </p>
        </div>
      </div>

      {/* Deep-Dive Risk Cards */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-rose-600" /> Key Anomaly & Risk Dossiers ({filteredRisks.length})
        </h3>

        {filteredRisks.map((risk) => {
          const isExpanded = expandedRiskId === risk.id;
          const isHigh = risk.severity === 'High';

          return (
            <div 
              key={risk.id}
              className={`rounded-xl border transition-all duration-200 overflow-hidden bg-white ${
                isHigh 
                  ? 'border-rose-200 shadow-xs hover:border-rose-300' 
                  : 'border-slate-200 shadow-xs hover:border-slate-300'
              }`}
            >
              {/* Risk Header / Toggle Bar */}
              <div 
                onClick={() => setExpandedRiskId(isExpanded ? null : risk.id)}
                className="p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 cursor-pointer select-none"
              >
                <div className="flex items-start sm:items-center gap-3">
                  <div className={`p-2 rounded-lg shrink-0 ${
                    isHigh ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {isHigh ? <Flame className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase tracking-wider ${
                        isHigh ? 'bg-rose-100 text-rose-800 border border-rose-200' : 'bg-amber-100 text-amber-800 border border-amber-200'
                      }`}>
                        {risk.severity} Severity
                      </span>
                      <span className="text-xs text-slate-600 font-semibold">
                        {risk.category}
                      </span>
                      <span className="text-xs text-slate-500">• {risk.region}</span>
                    </div>
                    <h4 className="text-base font-bold text-slate-900 mt-1">
                      {risk.title}
                    </h4>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 self-stretch sm:self-center pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  <span className="text-xs font-mono font-bold text-rose-700">
                    {risk.metricsImpacted}
                  </span>
                  <div className="text-slate-400">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </div>
              </div>

              {/* Expanded Detail Panel */}
              {isExpanded && (
                <div className="px-5 pb-5 pt-3 border-t border-slate-100 bg-slate-50/70 space-y-4 text-xs leading-relaxed text-slate-700">
                  <div>
                    <h5 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-1">
                      Detailed Evidence & Analysis:
                    </h5>
                    <p className="text-slate-700 text-sm leading-relaxed">{risk.description}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                      <span className="font-bold text-amber-800 uppercase tracking-wider text-[10px] block mb-1">
                        Identified Root Cause:
                      </span>
                      <p className="text-slate-700 font-medium">{risk.rootCause}</p>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                      <span className="font-bold text-blue-800 uppercase tracking-wider text-[10px] block mb-1">
                        Longitudinal Trajectory:
                      </span>
                      <p className="text-slate-700 font-medium">{risk.trend}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* High-Risk Incident Roster from Dataset */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <h3 className="text-base font-bold text-slate-900 mb-1 flex items-center gap-2">
          <Flame className="w-4 h-4 text-rose-600" /> Specific High-Risk Records Audit ({highRiskRecords.length} Incidents)
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          Direct extraction of all periods flagged as "High" severity in the current dataset
        </p>

        {highRiskRecords.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-xs bg-slate-50 rounded-xl border border-slate-200">
            No high-risk records in the uploaded data.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider">
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-3">Department</th>
                  <th className="py-3 px-3">Region</th>
                  <th className="py-3 px-3">Spend</th>
                  <th className="py-3 px-3">Revenue</th>
                  <th className="py-3 px-3">CSAT</th>
                  <th className="py-3 px-3">Churn %</th>
                  <th className="py-3 px-3">Anomaly Diagnosis</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {highRiskRecords.map((r) => (
                  <tr key={r.id} className="hover:bg-rose-50/50 transition-colors">
                    <td className="py-3 px-3 font-mono text-slate-900 font-semibold">{r.date}</td>
                    <td className="py-3 px-3 font-bold text-slate-900">{r.department}</td>
                    <td className="py-3 px-3 text-slate-700">{r.region}</td>
                    <td className="py-3 px-3 font-mono text-slate-800">${r.monthlySpendUSD.toLocaleString()}</td>
                    <td className="py-3 px-3 font-mono font-bold text-emerald-700">${r.monthlyRevenueUSD.toLocaleString()}</td>
                    <td className="py-3 px-3 font-mono text-rose-700 font-bold">{r.customerSatisfactionScore}</td>
                    <td className="py-3 px-3 font-mono text-rose-700 font-extrabold">{r.churnRatePct}%</td>
                    <td className="py-3 px-3 text-[11px] text-rose-800 font-semibold">
                      {r.churnRatePct > 5.0 
                        ? 'Severe customer attrition / acquisition leakage' 
                        : r.monthlyRevenueUSD === 0 && r.monthlySpendUSD > 100000 
                        ? 'High overhead burn without direct revenue' 
                        : 'Elevated cohort attrition or negative margin'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};
