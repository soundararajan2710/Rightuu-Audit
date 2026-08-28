import React from 'react';
import { 
  Building2, 
  CheckCircle2, 
  DollarSign, 
  ShieldAlert, 
  Award, 
  Layers, 
  Globe, 
  Calendar,
  BarChart3
} from 'lucide-react';
import { ProcessedAuditData } from '../types';

interface PrintReportViewProps {
  onClose: () => void;
  data: ProcessedAuditData;
}

export const PrintReportView: React.FC<PrintReportViewProps> = ({ onClose, data }) => {
  const { totalMetrics, regionalSummaries, departmentSummaries, timePeriodSummaries, operationalRisks, strategicRecommendations, datasetInfo } = data;

  return (
    <div className="bg-slate-50 text-slate-900 min-h-screen p-6 sm:p-10 font-['Plus_Jakarta_Sans'] print:bg-white print:text-black">
      
      {/* Print Controls Ribbon (Hidden on physical print) */}
      <div className="max-w-4xl mx-auto mb-8 flex items-center justify-between bg-white border border-slate-200 p-4 rounded-xl shadow-xs print:hidden">
        <div>
          <span className="text-xs font-bold uppercase text-blue-700">Formal Rightuu Audit Executive Briefing Document</span>
          <h2 className="text-base font-bold text-slate-900">Print / Export-Ready View ({datasetInfo.fileName})</h2>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => window.print()}
            className="px-4 py-2 text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 rounded-lg shadow-xs cursor-pointer"
          >
            Open System Print / Save PDF
          </button>
          <button
            onClick={onClose}
            className="px-3 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 border border-slate-200 rounded-lg cursor-pointer"
          >
            Back to Interactive App
          </button>
        </div>
      </div>

      {/* Main Document Content */}
      <div className="max-w-4xl mx-auto space-y-8 bg-white p-8 sm:p-10 rounded-2xl border border-slate-200 shadow-xs print:border-none print:p-0">
        
        {/* Document Header */}
        <div className="border-b border-slate-200 pb-6">
          <div className="flex items-center justify-between text-xs text-slate-500 uppercase tracking-widest font-bold mb-2">
            <span>CONFIDENTIAL // RIGHTUU AUDIT BRIEFING</span>
            <span>DATA SOURCE: {datasetInfo.fileName.toUpperCase()}</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Executive Business Briefing & Performance Audit
          </h1>
          <p className="text-sm text-slate-600 mt-2 leading-relaxed font-medium">
            Multi-regional audit of financial performance, department unit economics, risk exposure, and strategic growth priorities.
          </p>
        </div>

        {/* Section 1: Executive Summary */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900 border-b border-slate-200 pb-2 flex items-center gap-2">
            <span className="text-blue-700">1.</span> Executive Summary & Total Ledger Metrics
          </h2>
          <div className="text-sm text-slate-700 space-y-3 leading-relaxed">
            <p>
              Across the evaluated periods in this audit, the enterprise realized <strong className="text-slate-900">${(totalMetrics.totalRevenue / 1000000).toFixed(2)}M in Total Revenue</strong> on <strong className="text-slate-900">${(totalMetrics.totalSpend / 1000000).toFixed(2)}M in Total Spend</strong>, generating an aggregate Net Operating Profit of <strong className="text-emerald-700">+{totalMetrics.netProfit >= 0 ? '$' : '-$'}{(Math.abs(totalMetrics.netProfit) / 1000).toFixed(0)}k ({totalMetrics.profitMarginPct}% Net Margin)</strong> with an average Customer Satisfaction (CSAT) rating of <strong className="text-slate-900">{totalMetrics.avgCSAT.toFixed(2)} / 10</strong>.
            </p>
          </div>

          <div className="grid grid-cols-4 gap-3 pt-2 text-center text-xs font-mono">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div className="text-slate-500 text-[10px] font-sans font-bold">TOTAL REVENUE</div>
              <div className="text-base font-extrabold text-emerald-700 mt-0.5">${(totalMetrics.totalRevenue / 1000).toFixed(0)}k</div>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div className="text-slate-500 text-[10px] font-sans font-bold">TOTAL SPEND</div>
              <div className="text-base font-extrabold text-slate-900 mt-0.5">${(totalMetrics.totalSpend / 1000).toFixed(0)}k</div>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div className="text-slate-500 text-[10px] font-sans font-bold">NET PROFIT</div>
              <div className={`text-base font-extrabold mt-0.5 ${totalMetrics.netProfit >= 0 ? 'text-blue-700' : 'text-rose-700'}`}>
                {totalMetrics.netProfit >= 0 ? '+' : '-'}${(Math.abs(totalMetrics.netProfit) / 1000).toFixed(0)}k
              </div>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div className="text-slate-500 text-[10px] font-sans font-bold">AVG CSAT</div>
              <div className="text-base font-extrabold text-amber-700 mt-0.5">{totalMetrics.avgCSAT.toFixed(2)} / 10</div>
            </div>
          </div>
        </section>

        {/* Section 2: Key Metrics & Trends */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900 border-b border-slate-200 pb-2 flex items-center gap-2">
            <span className="text-blue-700">2.</span> Key Metrics & Longitudinal Trends
          </h2>
          
          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase">
                  <th className="py-2.5 px-3">Period</th>
                  <th className="py-2.5 px-3">Spend</th>
                  <th className="py-2.5 px-3">Revenue</th>
                  <th className="py-2.5 px-3">Net Profit</th>
                  <th className="py-2.5 px-3">Margin</th>
                  <th className="py-2.5 px-3">CSAT</th>
                  <th className="py-2.5 px-3">Churn</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono text-slate-700">
                {timePeriodSummaries.map(p => (
                  <tr key={p.date}>
                    <td className="py-2.5 px-3 font-sans font-semibold text-slate-900">{p.formattedDate}</td>
                    <td className="py-2.5 px-3 text-slate-800">${p.totalSpend.toLocaleString()}</td>
                    <td className="py-2.5 px-3 font-bold text-emerald-700">${p.totalRevenue.toLocaleString()}</td>
                    <td className={`py-2.5 px-3 font-bold ${p.netProfit >= 0 ? 'text-blue-700' : 'text-rose-700'}`}>
                      {p.netProfit >= 0 ? `+$${p.netProfit.toLocaleString()}` : `-$${Math.abs(p.netProfit).toLocaleString()}`}
                    </td>
                    <td className="py-2.5 px-3 font-semibold">{p.profitMarginPct}%</td>
                    <td className="py-2.5 px-3 text-amber-700 font-bold">{p.avgCSAT.toFixed(2)}</td>
                    <td className="py-2.5 px-3 text-slate-700">{p.avgChurnPct.toFixed(2)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 3: Operational Risks & Anomalies */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900 border-b border-slate-200 pb-2 flex items-center gap-2">
            <span className="text-blue-700">3.</span> Operational Risks & Anomalies
          </h2>
          
          <div className="space-y-3">
            {operationalRisks.map(r => (
              <div key={r.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <strong className="text-sm font-bold text-slate-900">{r.title}</strong>
                  <span className={`px-2 py-0.5 rounded font-bold uppercase text-[10px] ${
                    r.severity === 'High' ? 'bg-rose-100 text-rose-800 border border-rose-200' : 'bg-amber-100 text-amber-800 border border-amber-200'
                  }`}>
                    {r.severity} Severity
                  </span>
                </div>
                <p className="text-slate-700 leading-relaxed font-medium">{r.description}</p>
                <div className="text-slate-600 pt-1 font-medium">
                  <strong className="text-slate-900">Root Cause:</strong> {r.rootCause}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 4: Top Strategic Recommendations */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900 border-b border-slate-200 pb-2 flex items-center gap-2">
            <span className="text-blue-700">4.</span> Top Strategic Recommendations
          </h2>

          <div className="space-y-4">
            {strategicRecommendations.map(rec => (
              <div key={rec.id} className="p-4.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900">
                    #{rec.number}. {rec.title}
                  </h3>
                  <span className="text-emerald-700 font-mono font-bold">
                    {rec.expectedFinancialImpact}
                  </span>
                </div>
                <p className="text-slate-700 font-medium leading-relaxed">{rec.summary}</p>
                <ul className="list-disc list-inside text-slate-600 space-y-1 pl-1 font-medium">
                  {rec.actionPlan.map((action, i) => (
                    <li key={i}>{action}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
};
