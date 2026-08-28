import React from 'react';
import { 
  TrendingUp, 
  Globe, 
  DollarSign, 
  ShieldAlert, 
  CheckCircle2, 
  ArrowUpRight, 
  Layers,
  Sparkles,
  PieChart,
  BarChart3,
  Building2,
  Upload,
  FileSpreadsheet
} from 'lucide-react';
import { ProcessedAuditData, Region } from '../types';

interface ExecutiveSummarySectionProps {
  data: ProcessedAuditData;
  onSelectTab: (tabId: string) => void;
  onFilterRegion: (region: Region) => void;
  onOpenUploadModal?: () => void;
}

export const ExecutiveSummarySection: React.FC<ExecutiveSummarySectionProps> = ({
  data,
  onSelectTab,
  onFilterRegion,
  onOpenUploadModal
}) => {
  const { totalMetrics, regionalSummaries, departmentSummaries, regions, departments, datasetInfo } = data;

  // Identify top performing region and loss/headwind regions
  const sortedRegionsByProfit = [...regions].sort((a, b) => 
    (regionalSummaries[b]?.netProfit || 0) - (regionalSummaries[a]?.netProfit || 0)
  );
  const topProfitRegion = sortedRegionsByProfit[0];
  const lowestProfitRegion = sortedRegionsByProfit[sortedRegionsByProfit.length - 1];

  // Identify top ROI department
  const sortedDeptsByROI = [...departments].sort((a, b) => 
    (departmentSummaries[b]?.roiMultiple || 0) - (departmentSummaries[a]?.roiMultiple || 0)
  );
  const topROIDept = sortedDeptsByROI[0];

  // Non-revenue cost centers
  const costCenterDepts = departments.filter(d => (departmentSummaries[d]?.totalRevenue || 0) === 0);
  const totalCostCenterSpend = costCenterDepts.reduce((acc, d) => acc + (departmentSummaries[d]?.totalSpend || 0), 0);
  const costCenterSpendShare = totalMetrics.totalSpend > 0 
    ? ((totalCostCenterSpend / totalMetrics.totalSpend) * 100).toFixed(1)
    : '0';

  const formatCurrencyM = (val: number) => `$${(val / 1000000).toFixed(2)}M`;
  const formatCurrencyK = (val: number) => `$${(Math.abs(val) / 1000).toFixed(0)}k`;

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Executive Briefing Lead Card */}
      <div className="relative overflow-hidden rounded-2xl bg-white border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="relative z-10">
          
          <div className="flex items-center justify-between gap-3 mb-3 flex-wrap">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 border border-blue-200 text-blue-800">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" /> Rightuu Audit Executive Briefing
              </span>
              <span className="text-xs text-slate-500 font-medium">
                Source: <strong className="text-slate-700">{datasetInfo.fileName}</strong> ({data.records.length} records evaluated)
              </span>
            </div>
            {onOpenUploadModal && (
              <button
                onClick={onOpenUploadModal}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors cursor-pointer"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                Upload New Excel / CSV
              </button>
            )}
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-['Plus_Jakarta_Sans']">
            Executive Summary: Performance Audit & Unit Economics Analysis
          </h2>

          <div className="mt-4 text-slate-700 text-base sm:text-lg leading-relaxed max-w-4xl space-y-3">
            <p>
              Across the evaluated ledger cycles in this audit, the organization generated{' '}
              <strong className="text-emerald-700 font-bold">{formatCurrencyM(totalMetrics.totalRevenue)} in Total Gross Revenue</strong> against{' '}
              <strong className="text-slate-900 font-bold">{formatCurrencyM(totalMetrics.totalSpend)} in Total Operational Spend</strong>, yielding a net operating profit of{' '}
              <strong className={`font-bold ${totalMetrics.netProfit >= 0 ? 'text-blue-700' : 'text-rose-700'}`}>
                {totalMetrics.netProfit >= 0 ? '+' : '-'}{formatCurrencyK(totalMetrics.netProfit)} ({totalMetrics.profitMarginPct}% Net Margin)
              </strong> and an overall Customer Satisfaction (CSAT) score of{' '}
              <strong className="text-amber-800 font-bold">{totalMetrics.avgCSAT.toFixed(2)} / 10</strong>.
            </p>
            <p className="text-slate-600 text-base">
              Regional analysis indicates{' '}
              {topProfitRegion && regionalSummaries[topProfitRegion] ? (
                <>
                  <strong className="text-slate-900 font-semibold">{topProfitRegion}</strong> served as the primary profit engine, generating{' '}
                  <strong className="text-emerald-700 font-semibold">{formatCurrencyM(regionalSummaries[topProfitRegion].totalRevenue)}</strong> in revenue ({regionalSummaries[topProfitRegion].profitMarginPct}% margin).{' '}
                </>
              ) : null}
              {lowestProfitRegion && lowestProfitRegion !== topProfitRegion && regionalSummaries[lowestProfitRegion] ? (
                regionalSummaries[lowestProfitRegion].netProfit < 0 ? (
                  <>
                    Conversely, <strong className="text-rose-700 font-semibold">{lowestProfitRegion}</strong> registered an operational deficit of{' '}
                    <strong className="text-rose-700 font-bold">-{formatCurrencyK(regionalSummaries[lowestProfitRegion].netProfit)}</strong> with an average churn rate of{' '}
                    <strong className="text-rose-700 font-semibold">{regionalSummaries[lowestProfitRegion].avgChurnPct.toFixed(1)}%</strong>.
                  </>
                ) : (
                  <>
                    Meanwhile, <strong className="text-slate-900 font-semibold">{lowestProfitRegion}</strong> recorded{' '}
                    <strong className="text-slate-900 font-semibold">+{formatCurrencyK(regionalSummaries[lowestProfitRegion].netProfit)}</strong> net return.
                  </>
                )
              ) : null}
            </p>
          </div>

          {/* Core Findings Highlight Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            
            <div className="bg-slate-50 border border-slate-200/90 rounded-xl p-4.5 hover:border-emerald-300 transition-colors shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">1. Commercial Vector</span>
                <DollarSign className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-2xl font-extrabold text-slate-900 font-mono mt-2">
                {topROIDept && departmentSummaries[topROIDept] ? `${departmentSummaries[topROIDept].roiMultiple}x ROI` : 'Commercial Yield'}
              </div>
              <p className="text-xs text-slate-600 mt-1.5 leading-normal">
                {topROIDept && departmentSummaries[topROIDept] ? (
                  <>
                    {topROIDept} delivered <strong className="text-slate-900">{formatCurrencyM(departmentSummaries[topROIDept].totalRevenue)}</strong> revenue on <strong className="text-slate-900">{formatCurrencyK(departmentSummaries[topROIDept].totalSpend)}</strong> spend.
                  </>
                ) : 'High ROI observed in direct commercial acquisition streams.'}
              </p>
            </div>

            <div className="bg-rose-50/50 border border-rose-200/90 rounded-xl p-4.5 hover:border-rose-300 transition-colors shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-rose-800">2. Critical Exposure</span>
                <ShieldAlert className="w-4 h-4 text-rose-600" />
              </div>
              <div className="text-2xl font-extrabold text-rose-700 font-mono mt-2">
                {totalMetrics.riskDistribution.high} High Risks
              </div>
              <p className="text-xs text-slate-600 mt-1.5 leading-normal">
                Identified {totalMetrics.riskDistribution.high} high-severity anomaly records and {totalMetrics.riskDistribution.medium} medium-tier operational alerts across ledger periods.
              </p>
            </div>

            <div className="bg-blue-50/50 border border-blue-200/90 rounded-xl p-4.5 hover:border-blue-300 transition-colors shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-800">3. Fixed Overhead</span>
                <Layers className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-2xl font-extrabold text-blue-800 font-mono mt-2">
                {costCenterSpendShare}% Budget
              </div>
              <p className="text-xs text-slate-600 mt-1.5 leading-normal">
                Cost center expenditure ({costCenterDepts.slice(0, 2).join(', ') || 'Internal Ops'}) totals <strong className="text-slate-900">{formatCurrencyM(totalCostCenterSpend)}</strong> in baseline overhead.
              </p>
            </div>

          </div>

        </div>
      </div>

      {/* Regional Performance Scorecards */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Globe className="w-5 h-5 text-blue-700" /> Regional P&L & Operational Posture ({regions.length} Regions)
            </h3>
            <p className="text-xs text-slate-500">Breakdown of gross revenue, operational cost, net margin, and satisfaction ratings by geographic territory</p>
          </div>
          <button
            id="view-all-metrics-btn"
            onClick={() => onSelectTab('metrics')}
            className="text-xs text-blue-700 hover:text-blue-800 font-semibold inline-flex items-center gap-1 self-start cursor-pointer"
          >
            Explore trend charts <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {regions.map((region) => {
            const summary = regionalSummaries[region];
            if (!summary) return null;

            const isProfitable = summary.netProfit >= 0;
            const borderTopClass = isProfitable ? 'border-t-emerald-600' : 'border-t-rose-600';
            const badgeBgClass = isProfitable ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-rose-50 text-rose-800 border-rose-200';
            const badgeText = isProfitable 
              ? (summary.profitMarginPct > 20 ? 'Tier-1 Profit Engine' : 'Profitable Region') 
              : 'Operating Deficit';

            return (
              <div 
                key={region}
                className={`bg-white border border-slate-200 border-t-4 ${borderTopClass} rounded-xl p-5 hover:border-blue-300 transition-all shadow-xs flex flex-col justify-between`}
              >
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${isProfitable ? 'bg-emerald-600' : 'bg-rose-600'}`} />
                      <h4 className="font-bold text-slate-900 text-base">{region}</h4>
                    </div>
                    <span className={`px-2.5 py-0.5 text-xs font-bold border rounded-full ${badgeBgClass}`}>
                      {badgeText}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 my-4">
                    <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200/60">
                      <span className="text-[11px] text-slate-500 font-medium">Total Revenue</span>
                      <p className="text-lg font-extrabold text-slate-900 font-mono">{formatCurrencyM(summary.totalRevenue)}</p>
                    </div>
                    <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200/60">
                      <span className="text-[11px] text-slate-500 font-medium">Total Spend</span>
                      <p className="text-lg font-extrabold text-slate-900 font-mono">{formatCurrencyM(summary.totalSpend)}</p>
                    </div>
                    <div className={`p-2.5 rounded-lg border ${isProfitable ? 'bg-emerald-50/60 border-emerald-200/60' : 'bg-rose-50/60 border-rose-200/60'}`}>
                      <span className={`text-[11px] font-medium ${isProfitable ? 'text-emerald-800' : 'text-rose-800'}`}>Net Operating Profit</span>
                      <p className={`text-lg font-extrabold font-mono ${isProfitable ? 'text-emerald-800' : 'text-rose-700'}`}>
                        {isProfitable ? '+' : '-'}{formatCurrencyK(summary.netProfit)}
                      </p>
                    </div>
                    <div className={`p-2.5 rounded-lg border ${isProfitable ? 'bg-emerald-50/60 border-emerald-200/60' : 'bg-rose-50/60 border-rose-200/60'}`}>
                      <span className={`text-[11px] font-medium ${isProfitable ? 'text-emerald-800' : 'text-rose-800'}`}>Operating Margin</span>
                      <p className={`text-lg font-extrabold font-mono ${isProfitable ? 'text-emerald-800' : 'text-rose-700'}`}>
                        {summary.profitMarginPct}%
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 pt-3 border-t border-slate-100 text-xs">
                    <div className="flex justify-between text-slate-600">
                      <span>Avg Customer CSAT:</span>
                      <strong className="text-slate-900 font-mono">{summary.avgCSAT.toFixed(2)} / 10</strong>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Customer Churn Rate:</span>
                      <strong className={`font-mono ${summary.avgChurnPct > 3.0 ? 'text-rose-700' : 'text-emerald-700'}`}>
                        {summary.avgChurnPct.toFixed(2)}%
                      </strong>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Risk Profile:</span>
                      <span className="text-slate-800 font-medium">
                        {summary.highRiskCount} High, {summary.mediumRiskCount} Med, {summary.lowRiskCount} Low
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100">
                  <button
                    id={`filter-${region.toLowerCase().replace(/\s+/g, '-')}-btn`}
                    onClick={() => onFilterRegion(region)}
                    className="w-full py-2 text-center text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg transition-colors cursor-pointer"
                  >
                    Drill Down into {region} Ledger
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Department Unit Economics Matrix */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-1">
          <BarChart3 className="w-5 h-5 text-blue-700" /> Department Unit Economics & Spend Allocation ({departments.length} Departments)
        </h3>
        <p className="text-xs text-slate-500 mb-5">
          Detailed assessment of organizational spend share, direct revenue yield, efficiency multiple, and CSAT contribution
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider">
                <th className="py-3 px-3">Department</th>
                <th className="py-3 px-3">Total Spend</th>
                <th className="py-3 px-3">Spend Share</th>
                <th className="py-3 px-3">Direct Revenue</th>
                <th className="py-3 px-3">ROI Multiple</th>
                <th className="py-3 px-3">Avg CSAT</th>
                <th className="py-3 px-3">Avg Churn</th>
                <th className="py-3 px-3">Risk Incidents</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
              {departments.map((deptName, idx) => {
                const dept = departmentSummaries[deptName];
                if (!dept) return null;

                const colorDots = ['bg-emerald-600', 'bg-cyan-600', 'bg-blue-600', 'bg-purple-600', 'bg-amber-600', 'bg-indigo-600'];
                const dotColor = colorDots[idx % colorDots.length];

                return (
                  <tr key={deptName} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-3 font-bold text-slate-900 flex items-center gap-2">
                      <div className={`w-2.5 h-2.5 rounded-full ${dotColor}`} /> {deptName}
                    </td>
                    <td className="py-3.5 px-3 font-mono text-slate-800">
                      ${(dept.totalSpend / 1000).toLocaleString()}k
                    </td>
                    <td className="py-3.5 px-3 font-mono text-slate-500">
                      {dept.spendSharePct}%
                    </td>
                    <td className="py-3.5 px-3 font-mono font-bold text-slate-900">
                      {dept.totalRevenue > 0 ? formatCurrencyM(dept.totalRevenue) : <span className="text-slate-400 font-normal">$0 (Cost Center)</span>}
                    </td>
                    <td className="py-3.5 px-3 font-mono font-bold text-blue-700">
                      {dept.roiMultiple > 0 ? `${dept.roiMultiple}x` : <span className="text-slate-400 font-normal">—</span>}
                    </td>
                    <td className="py-3.5 px-3 font-mono text-slate-800">
                      {dept.avgCSAT.toFixed(2)}
                    </td>
                    <td className="py-3.5 px-3 font-mono text-slate-700">
                      {dept.avgChurnPct > 0 ? `${dept.avgChurnPct.toFixed(2)}%` : <span className="text-slate-400">0.0%</span>}
                    </td>
                    <td className="py-3.5 px-3">
                      {dept.highRiskCount > 0 ? (
                        <span className="px-2 py-0.5 text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200 rounded-md">
                          {dept.highRiskCount} High / {dept.mediumRiskCount} Med
                        </span>
                      ) : dept.mediumRiskCount > 0 ? (
                        <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200 rounded-md">
                          {dept.mediumRiskCount} Med / {dept.lowRiskCount} Low
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-md">
                          {dept.lowRiskCount} Low Risk
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
