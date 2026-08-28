import React, { useState } from 'react';
import { 
  Target, 
  Sparkles, 
  ArrowUpRight, 
  CheckCircle, 
  TrendingUp, 
  DollarSign, 
  Sliders, 
  RefreshCw,
  Award,
  Layers,
  ChevronRight
} from 'lucide-react';
import { ProcessedAuditData } from '../types';
import confetti from 'canvas-confetti';

interface StrategicRecommendationsSectionProps {
  data: ProcessedAuditData;
  onOpenSimulatorModal?: () => void;
}

export const StrategicRecommendationsSection: React.FC<StrategicRecommendationsSectionProps> = ({ data }) => {
  const { strategicRecommendations, totalMetrics, regionalSummaries, departmentSummaries, regions, departments } = data;

  // Interactive Scenario Simulator State
  const [apacTurnaround, setApacTurnaround] = useState<number>(35); // % turnaround / retention lift
  const [salesExpansion, setSalesExpansion] = useState<number>(20); // % growth
  const [rdEfficiency, setRdEfficiency] = useState<number>(10); // % cost optimization

  // Base metrics from current dataset
  const baseRevenue = totalMetrics.totalRevenue;
  const baseSpend = totalMetrics.totalSpend;
  const baseProfit = totalMetrics.netProfit;

  // Find lowest margin region & highest ROI dept
  const sortedRegionsByProfit = [...regions].sort((a, b) => (regionalSummaries[a]?.netProfit || 0) - (regionalSummaries[b]?.netProfit || 0));
  const focusRegion = sortedRegionsByProfit[0] || 'Lowest Margin Theater';

  const sortedDeptsByROI = [...departments].sort((a, b) => (departmentSummaries[b]?.roiMultiple || 0) - (departmentSummaries[a]?.roiMultiple || 0));
  const topGrowthDept = sortedDeptsByROI[0] || 'Core Growth Vector';

  // Cost center departments
  const costCenterDepts = departments.filter(d => (departmentSummaries[d]?.totalRevenue || 0) === 0);
  const totalCostCenterSpend = costCenterDepts.reduce((acc, d) => acc + (departmentSummaries[d]?.totalSpend || 0), 0);

  // Calculate simulated values
  const targetRegionRev = regionalSummaries[focusRegion]?.totalRevenue || (baseRevenue * 0.2);
  const simulatedTurnaroundLift = (targetRegionRev * (apacTurnaround / 100)) * 0.45;
  
  const simulatedSalesLift = (baseRevenue * 0.75) * (salesExpansion / 100) * 0.6;
  const totalSimulatedRevenue = baseRevenue + simulatedTurnaroundLift + simulatedSalesLift;

  // R&D / Overhead efficiency savings
  const simulatedSavings = (totalCostCenterSpend > 0 ? totalCostCenterSpend : baseSpend * 0.4) * (rdEfficiency / 100);
  
  // Incremental costs to achieve sales lift
  const incrementalSalesSpend = simulatedSalesLift * 0.25;
  const totalSimulatedSpend = Math.max(0, baseSpend - simulatedSavings + incrementalSalesSpend);

  const totalSimulatedProfit = totalSimulatedRevenue - totalSimulatedSpend;
  const simulatedMargin = totalSimulatedRevenue > 0 ? ((totalSimulatedProfit / totalSimulatedRevenue) * 100).toFixed(1) : '0';
  const profitDelta = totalSimulatedProfit - baseProfit;

  const handleApplyStrategy = () => {
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.7 }
    });
  };

  const handleResetSliders = () => {
    setApacTurnaround(0);
    setSalesExpansion(0);
    setRdEfficiency(0);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Section 4</span>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight font-['Plus_Jakarta_Sans']">
            Top Strategic Recommendations & Value Playbook
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Data-driven roadmap to eliminate regional deficits, maximize core commercial vectors, and optimize overhead
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-bold">
            <Award className="w-3.5 h-3.5 text-emerald-700" /> Rightuu Executive Playbook
          </span>
        </div>
      </div>

      {/* The 3 Core Strategic Pillars */}
      <div className="grid grid-cols-1 gap-6">
        {strategicRecommendations.map((rec) => (
          <div 
            key={rec.id}
            className="bg-white border border-slate-200 hover:border-slate-300 rounded-2xl p-6 shadow-xs transition-all relative overflow-hidden"
          >
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
              
              {/* Pillar Number Badge & Title */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-700 flex items-center justify-center font-extrabold text-white text-xl font-mono shrink-0 shadow-sm">
                  #{rec.number}
                </div>
                <div>
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-800 border border-blue-200 rounded">
                      {rec.priority}
                    </span>
                    <span className="text-xs text-slate-600 font-semibold">
                      Target: {rec.targetDepartment}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mt-1.5 font-['Plus_Jakarta_Sans']">
                    {rec.title}
                  </h3>
                  <p className="text-slate-700 text-sm mt-2 leading-relaxed">
                    {rec.summary}
                  </p>
                </div>
              </div>

              {/* Financial & KPI Impact Callout */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4.5 shrink-0 lg:w-80 space-y-2">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block">
                    Projected Financial Yield:
                  </span>
                  <p className="text-sm font-bold text-slate-900 font-mono mt-0.5">
                    {rec.expectedFinancialImpact}
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-200/80">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-800 block">
                    Target KPI Benchmark:
                  </span>
                  <p className="text-xs text-slate-700 mt-0.5 font-semibold">
                    {rec.kpiTarget}
                  </p>
                </div>
              </div>

            </div>

            {/* Tactical Implementation Action Steps */}
            <div className="mt-6 pt-5 border-t border-slate-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-blue-700" /> Tactical Execution Milestones:
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {rec.actionPlan.map((step, idx) => (
                  <div key={idx} className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-700 flex items-start gap-2.5 font-medium">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        ))}
      </div>

      {/* Interactive Scenario Impact Simulator */}
      <div className="bg-white border border-blue-200 rounded-2xl p-6 sm:p-8 shadow-xs relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-800 border border-blue-200 rounded">
                Interactive Strategic Sandbox
              </span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mt-1 flex items-center gap-2">
              <Sliders className="w-5 h-5 text-blue-700" /> Executive Strategic Impact & Margin Simulator
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Simulate the compounded P&L outcome of executing strategic initiatives on the active dataset
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="reset-simulator-btn"
              onClick={handleResetSliders}
              className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 border border-slate-200 rounded-lg transition-colors inline-flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Reset Baseline
            </button>
            <button
              id="apply-strategy-btn"
              onClick={handleApplyStrategy}
              className="px-4 py-1.5 text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 rounded-lg shadow-xs transition-all cursor-pointer"
            >
              Apply Scenario
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Controls / Sliders */}
          <div className="lg:col-span-6 space-y-5">
            
            {/* Slider 1 */}
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-2">
              <div className="flex justify-between items-center text-xs">
                <label htmlFor="apac-turnaround-slider" className="font-bold text-slate-900 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-600" /> Lever 1: {focusRegion} Churn Recovery & GTM Lift
                </label>
                <span className="font-mono font-bold text-rose-700 text-sm">+{apacTurnaround}%</span>
              </div>
              <input
                id="apac-turnaround-slider"
                type="range"
                min="0"
                max="60"
                step="5"
                value={apacTurnaround}
                onChange={(e) => setApacTurnaround(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-rose-600"
              />
              <p className="text-[11px] text-slate-500 font-medium">
                Pivots {focusRegion} from margin drag toward break-even and sustainable retention.
              </p>
            </div>

            {/* Slider 2 */}
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-2">
              <div className="flex justify-between items-center text-xs">
                <label htmlFor="sales-expansion-slider" className="font-bold text-slate-900 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" /> Lever 2: {topGrowthDept} Core Expansion
                </label>
                <span className="font-mono font-bold text-emerald-700 text-sm">+{salesExpansion}%</span>
              </div>
              <input
                id="sales-expansion-slider"
                type="range"
                min="0"
                max="40"
                step="5"
                value={salesExpansion}
                onChange={(e) => setSalesExpansion(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
              <p className="text-[11px] text-slate-500 font-medium">
                Scales high-margin capacity across proven commercial acquisition vectors.
              </p>
            </div>

            {/* Slider 3 */}
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-2">
              <div className="flex justify-between items-center text-xs">
                <label htmlFor="rd-efficiency-slider" className="font-bold text-slate-900 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600" /> Lever 3: Fixed Overhead & Ops Efficiency
                </label>
                <span className="font-mono font-bold text-blue-700 text-sm">{rdEfficiency}%</span>
              </div>
              <input
                id="rd-efficiency-slider"
                type="range"
                min="0"
                max="25"
                step="5"
                value={rdEfficiency}
                onChange={(e) => setRdEfficiency(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <p className="text-[11px] text-slate-500 font-medium">
                Improves sprint ROI on the fixed operational and supportive budget baseline.
              </p>
            </div>

          </div>

          {/* Real-Time Outcome Panel */}
          <div className="lg:col-span-6 bg-slate-50 border border-blue-200 rounded-xl p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Simulated Pro-Forma Trajectory
              </span>
              <span className="text-xs font-mono font-bold text-emerald-700">
                +${(profitDelta / 1000).toFixed(0)}k Profit Delta
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
                <span className="text-[11px] text-slate-500 font-semibold">Simulated Revenue</span>
                <p className="text-xl font-extrabold text-emerald-700 font-mono mt-1">
                  ${(totalSimulatedRevenue / 1000000).toFixed(2)}M
                </p>
                <span className="text-[10px] text-emerald-800 font-bold">
                  +${((totalSimulatedRevenue - baseRevenue) / 1000).toFixed(0)}k vs Baseline
                </span>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
                <span className="text-[11px] text-slate-500 font-semibold">Simulated Spend</span>
                <p className="text-xl font-extrabold text-slate-900 font-mono mt-1">
                  ${(totalSimulatedSpend / 1000000).toFixed(2)}M
                </p>
                <span className="text-[10px] text-slate-600 font-medium">
                  {simulatedSavings > 0 ? `-$${(simulatedSavings / 1000).toFixed(0)}k overhead savings` : 'Baseline spend'}
                </span>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-blue-200 shadow-xs">
                <span className="text-[11px] text-slate-500 font-semibold">Simulated Net Profit</span>
                <p className="text-2xl font-extrabold text-blue-700 font-mono mt-1">
                  ${(totalSimulatedProfit / 1000000).toFixed(2)}M
                </p>
                <span className="text-[10px] text-blue-800 font-bold">
                  from ${ (baseProfit / 1000000).toFixed(2) }M baseline
                </span>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-blue-200 shadow-xs">
                <span className="text-[11px] text-slate-500 font-semibold">Simulated Margin</span>
                <p className="text-2xl font-extrabold text-blue-800 font-mono mt-1">
                  {simulatedMargin}%
                </p>
                <span className="text-[10px] text-emerald-700 font-bold">
                  +{ (Number(simulatedMargin) - totalMetrics.profitMarginPct).toFixed(1) }% Expansion
                </span>
              </div>
            </div>

            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-900 flex items-start gap-2 font-medium">
              <Sparkles className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
              <span>
                Simultaneous execution of recommended strategic levers expands enterprise valuation multiple while eliminating downside customer churn.
              </span>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};
