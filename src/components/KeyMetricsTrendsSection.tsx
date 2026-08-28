import React, { useState } from 'react';
import { 
  ResponsiveContainer, 
  ComposedChart, 
  Line, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  PieChart as RechartsPieChart, 
  Pie, 
  Cell,
  ScatterChart,
  Scatter,
  ZAxis
} from 'recharts';
import { 
  TrendingUp, 
  DollarSign, 
  Activity, 
  PieChart, 
  Target, 
  AlertCircle,
  Calendar,
  Layers,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { ProcessedAuditData } from '../types';

interface KeyMetricsTrendsSectionProps {
  data: ProcessedAuditData;
}

export const KeyMetricsTrendsSection: React.FC<KeyMetricsTrendsSectionProps> = ({ data }) => {
  const [activeMetricTab, setActiveMetricTab] = useState<'financial' | 'departmental' | 'csat_churn' | 'regional'>('financial');

  const { timePeriodSummaries, departmentSummaries, regionalSummaries, records, regions, departments } = data;

  // Colors
  const COLORS = {
    revenue: '#059669', // Emerald
    spend: '#64748b',   // Slate
    profit: '#2563eb',  // Blue
    churn: '#e11d48',   // Rose
    csat: '#d97706',    // Amber
    palette: ['#2563eb', '#059669', '#0891b2', '#d97706', '#7c3aed', '#db2777', '#4b5563', '#10b981']
  };

  // Prepare Financial Trend Data
  const financialTrendData = timePeriodSummaries.map(item => ({
    name: item.formattedDate,
    period: item.date,
    region: item.region,
    revenue: item.totalRevenue,
    spend: item.totalSpend,
    profit: item.netProfit,
    marginPct: item.profitMarginPct,
    csat: item.avgCSAT,
    churn: item.avgChurnPct
  }));

  // Department Spend vs Revenue comparison data
  const departmentComparisonData = departments
    .map(d => departmentSummaries[d])
    .filter(Boolean)
    .map(dept => ({
      name: dept.department,
      spend: dept.totalSpend,
      revenue: dept.totalRevenue,
      roi: dept.roiMultiple,
      csat: dept.avgCSAT,
      churn: dept.avgChurnPct,
      highRisks: dept.highRiskCount
    }));

  // Department spend breakdown for donut
  const departmentSpendDonutData = departments
    .map(d => departmentSummaries[d])
    .filter(Boolean)
    .map(dept => ({
      name: dept.department,
      value: dept.totalSpend,
      share: dept.spendSharePct
    }));

  // Regional breakdown data
  const regionalData = regions
    .map(r => regionalSummaries[r])
    .filter(Boolean)
    .map(reg => ({
      name: reg.region,
      revenue: reg.totalRevenue,
      spend: reg.totalSpend,
      profit: reg.netProfit,
      margin: reg.profitMarginPct,
      csat: reg.avgCSAT,
      churn: reg.avgChurnPct
    }));

  // Scatter data: CSAT vs Churn
  const scatterData = records.map(r => ({
    x: r.customerSatisfactionScore,
    y: r.churnRatePct,
    z: r.monthlySpendUSD,
    department: r.department,
    region: r.region,
    date: r.date,
    risk: r.riskLevel
  }));

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Section Header with View Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-700">Section 2</span>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight font-['Plus_Jakarta_Sans']">
            Key Metrics & Longitudinal Trends
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Visual analytics across financial cycles, department allocations, satisfaction corridors, and regional variance
          </p>
        </div>

        {/* View Switcher Pills */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-semibold">
          {[
            { id: 'financial', label: 'Financial Trajectory', icon: TrendingUp },
            { id: 'departmental', label: 'Department Unit Economics', icon: Layers },
            { id: 'regional', label: 'Regional Comparisons', icon: Activity },
            { id: 'csat_churn', label: 'CSAT vs Churn Matrix', icon: Target },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveMetricTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeMetricTab === tab.id
                    ? 'bg-white text-slate-900 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span className="hidden md:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* VIEW 1: Financial Trajectory */}
      {activeMetricTab === 'financial' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Revenue vs. Spend vs. Net Operating Margin Trajectory
                </h3>
                <p className="text-xs text-slate-500">Longitudinal evaluation across all documented accounting periods in the active dataset</p>
              </div>
              <div className="flex items-center gap-4 text-xs font-medium">
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-emerald-600 inline-block" /> Revenue</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-slate-500 inline-block" /> Spend</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-blue-600 inline-block" /> Net Profit</span>
              </div>
            </div>

            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={financialTrendData} margin={{ top: 10, right: 20, bottom: 20, left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis 
                    dataKey="period" 
                    tick={{ fontSize: 11, fill: '#64748b' }} 
                    axisLine={{ stroke: '#cbd5e1' }}
                  />
                  <YAxis 
                    yAxisId="left"
                    tick={{ fontSize: 11, fill: '#64748b' }}
                    tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                    axisLine={{ stroke: '#cbd5e1' }}
                  />
                  <YAxis 
                    yAxisId="right" 
                    orientation="right" 
                    tick={{ fontSize: 11, fill: '#2563eb' }}
                    tickFormatter={(v) => `${v}%`}
                    axisLine={false}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                    formatter={(val: any, name: any) => {
                      if (name === 'Operating Margin %') return [`${val}%`, name];
                      return [`$${Number(val).toLocaleString()}`, name];
                    }}
                  />
                  <Bar yAxisId="left" dataKey="revenue" fill={COLORS.revenue} name="Gross Revenue" radius={[4, 4, 0, 0]} maxBarSize={32} />
                  <Bar yAxisId="left" dataKey="spend" fill={COLORS.spend} name="Total Spend" radius={[4, 4, 0, 0]} maxBarSize={32} />
                  <Line yAxisId="left" type="monotone" dataKey="profit" stroke={COLORS.profit} strokeWidth={3} dot={{ r: 4, fill: COLORS.profit }} name="Net Profit" />
                  <Line yAxisId="right" type="monotone" dataKey="marginPct" stroke="#7c3aed" strokeWidth={2} strokeDasharray="4 4" dot={{ r: 3 }} name="Operating Margin %" />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: Department Unit Economics */}
      {activeMetricTab === 'departmental' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Department Spend vs. Direct Revenue Contribution
            </h3>
            <p className="text-xs text-slate-500 mb-6">Comparison of capital allocation and direct top-line yield</p>
            
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={departmentComparisonData} margin={{ top: 10, right: 20, bottom: 20, left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#64748b' }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                    formatter={(val: any) => [`$${Number(val).toLocaleString()}`, 'Amount']}
                  />
                  <Bar dataKey="spend" fill={COLORS.spend} name="Total Spend" radius={[4, 4, 0, 0]} maxBarSize={36} />
                  <Bar dataKey="revenue" fill={COLORS.revenue} name="Direct Revenue" radius={[4, 4, 0, 0]} maxBarSize={36} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 mb-1">
                Spend Share by Department
              </h3>
              <p className="text-xs text-slate-500 mb-4">Organizational budget distribution</p>
              
              <div className="h-52 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={departmentSpendDonutData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={75}
                      paddingAngle={3}
                    >
                      {departmentSpendDonutData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS.palette[index % COLORS.palette.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(val: any) => [`$${Number(val).toLocaleString()}`, 'Spend']}
                    />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="space-y-1.5 text-xs pt-4 border-t border-slate-100">
              {departmentSpendDonutData.map((d, i) => (
                <div key={d.name} className="flex justify-between items-center text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: COLORS.palette[i % COLORS.palette.length] }} />
                    <span>{d.name}</span>
                  </div>
                  <strong className="font-mono text-slate-900">{d.share}%</strong>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: Regional Comparisons */}
      {activeMetricTab === 'regional' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
          <h3 className="text-base font-bold text-slate-900 mb-1">
            Regional Revenue vs. Spend vs. Profitability Breakdown
          </h3>
          <p className="text-xs text-slate-500 mb-6">Comparison across all {regions.length} geographic theaters</p>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={regionalData} margin={{ top: 10, right: 20, bottom: 20, left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                  formatter={(val: any) => [`$${Number(val).toLocaleString()}`, '']}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar dataKey="revenue" fill={COLORS.revenue} name="Gross Revenue" radius={[4, 4, 0, 0]} maxBarSize={40} />
                <Bar dataKey="spend" fill={COLORS.spend} name="Total Spend" radius={[4, 4, 0, 0]} maxBarSize={40} />
                <Bar dataKey="profit" fill={COLORS.profit} name="Net Operating Profit" radius={[4, 4, 0, 0]} maxBarSize={40} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* VIEW 4: CSAT vs Churn Matrix */}
      {activeMetricTab === 'csat_churn' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Customer Satisfaction (CSAT) vs. Churn Rate Correlation
              </h3>
              <p className="text-xs text-slate-500">Scatter correlation across {records.length} individual ledger cohorts</p>
            </div>
            <div className="text-xs text-slate-500">
              <span className="font-semibold text-rose-700">Upper-Left quadrant:</span> High Churn / Low CSAT
            </div>
          </div>

          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis 
                  type="number" 
                  dataKey="x" 
                  name="CSAT Score" 
                  domain={[6, 10]} 
                  tick={{ fontSize: 11 }}
                  label={{ value: 'Customer Satisfaction Score (CSAT / 10)', position: 'insideBottom', offset: -10, fontSize: 12, fill: '#64748b' }}
                />
                <YAxis 
                  type="number" 
                  dataKey="y" 
                  name="Churn Rate %" 
                  domain={[0, 10]} 
                  tick={{ fontSize: 11 }}
                  label={{ value: 'Customer Churn Rate (%)', angle: -90, position: 'insideLeft', fontSize: 12, fill: '#64748b' }}
                />
                <Tooltip 
                  cursor={{ strokeDasharray: '3 3' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-white p-3 border border-slate-200 rounded-lg shadow-md text-xs space-y-1">
                          <strong className="block text-slate-900 font-bold">{data.department} ({data.region})</strong>
                          <span className="text-slate-500 block">Date: {data.date}</span>
                          <span className="text-amber-800 block">CSAT: {data.x} / 10</span>
                          <span className="text-rose-700 block">Churn: {data.y}%</span>
                          <span className="text-slate-700 block font-mono">Monthly Spend: ${data.z.toLocaleString()}</span>
                          <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold ${data.risk === 'High' ? 'bg-rose-100 text-rose-800' : data.risk === 'Medium' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}`}>
                            {data.risk} Risk
                          </span>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Scatter name="Ledger Cohorts" data={scatterData} fill="#2563eb">
                  {scatterData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.risk === 'High' ? '#e11d48' : entry.risk === 'Medium' ? '#d97706' : '#059669'} 
                    />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

    </div>
  );
};
