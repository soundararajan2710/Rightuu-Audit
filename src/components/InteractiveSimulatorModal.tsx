import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  RefreshCw, 
  TrendingUp, 
  DollarSign, 
  Award, 
  Sliders,
  CheckCircle2
} from 'lucide-react';
import { ProcessedAuditData } from '../types';
import { TOTAL_METRICS, REGIONAL_SUMMARIES, DEPARTMENT_SUMMARIES } from '../data/businessData';
import confetti from 'canvas-confetti';

interface InteractiveSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  data?: ProcessedAuditData;
}

export const InteractiveSimulatorModal: React.FC<InteractiveSimulatorModalProps> = ({
  isOpen,
  onClose,
  data
}) => {
  const [apacTurnaround, setApacTurnaround] = useState<number>(40);
  const [salesExpansion, setSalesExpansion] = useState<number>(25);
  const [rdOptimization, setRdOptimization] = useState<number>(12);

  if (!isOpen) return null;

  const totalMetrics = data?.totalMetrics || TOTAL_METRICS;
  const baseRevenue = totalMetrics.totalRevenue;
  const baseSpend = totalMetrics.totalSpend;
  const baseProfit = totalMetrics.netProfit;

  // Find lowest margin region
  const regions = data?.regions || ['North America', 'Europe', 'Asia Pacific'];
  const regionalSummaries = data?.regionalSummaries || REGIONAL_SUMMARIES;
  const sortedRegionsByProfit = [...regions].sort((a, b) => (regionalSummaries[a]?.netProfit || 0) - (regionalSummaries[b]?.netProfit || 0));
  const focusRegion = sortedRegionsByProfit[0] || 'Lowest Margin Theater';

  const apacRev = regionalSummaries[focusRegion]?.totalRevenue || (baseRevenue * 0.2);
  const apacLift = (apacRev * (apacTurnaround / 100)) * 0.5;
  const salesLift = (baseRevenue * 0.8) * (salesExpansion / 100) * 0.75;
  const simulatedRevenue = baseRevenue + apacLift + salesLift;

  const departments = data?.departments || ['Engineering', 'Sales', 'Marketing', 'Customer Support', 'Product & Ops'];
  const departmentSummaries = data?.departmentSummaries || DEPARTMENT_SUMMARIES;
  const costCenterDepts = departments.filter(d => (departmentSummaries[d]?.totalRevenue || 0) === 0);
  const rdTotalSpend = costCenterDepts.reduce((acc, d) => acc + (departmentSummaries[d]?.totalSpend || 0), 0) || (baseSpend * 0.4);

  const rdSavings = rdTotalSpend * (rdOptimization / 100);
  const incrementalSalesSpend = salesLift * 0.28;
  const simulatedSpend = Math.max(0, baseSpend - rdSavings + incrementalSalesSpend);

  const simulatedProfit = simulatedRevenue - simulatedSpend;
  const simulatedMargin = simulatedRevenue > 0 ? ((simulatedProfit / simulatedRevenue) * 100).toFixed(1) : '0';
  const deltaProfit = simulatedProfit - baseProfit;

  const handleApply = () => {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 }
    });
  };

  const handleReset = () => {
    setApacTurnaround(0);
    setSalesExpansion(0);
    setRdOptimization(0);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl space-y-6 relative overflow-hidden">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-4 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-700" />
              <span className="text-xs font-bold uppercase tracking-wider text-blue-700">
                What-If Scenario Sandbox
              </span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mt-1 font-['Plus_Jakarta_Sans']">
              Executive Strategic Impact Simulator
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sliders */}
        <div className="space-y-4 relative z-10">
          
          <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <label htmlFor="modal-apac-slider" className="font-bold text-slate-900 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-600" /> {focusRegion} Churn Reduction & GTM Pivot
              </label>
              <span className="font-mono font-bold text-rose-700 text-sm">+{apacTurnaround}%</span>
            </div>
            <input
              id="modal-apac-slider"
              type="range"
              min="0"
              max="60"
              step="5"
              value={apacTurnaround}
              onChange={(e) => setApacTurnaround(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-rose-600"
            />
          </div>

          <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <label htmlFor="modal-sales-slider" className="font-bold text-slate-900 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" /> High-ROI Commercial & Sales Scaling
              </label>
              <span className="font-mono font-bold text-emerald-700 text-sm">+{salesExpansion}%</span>
            </div>
            <input
              id="modal-sales-slider"
              type="range"
              min="0"
              max="40"
              step="5"
              value={salesExpansion}
              onChange={(e) => setSalesExpansion(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />
          </div>

          <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <label htmlFor="modal-rd-slider" className="font-bold text-slate-900 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600" /> Fixed Overhead & Support Efficiency
              </label>
              <span className="font-mono font-bold text-blue-700 text-sm">{rdOptimization}%</span>
            </div>
            <input
              id="modal-rd-slider"
              type="range"
              min="0"
              max="25"
              step="5"
              value={rdOptimization}
              onChange={(e) => setRdOptimization(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

        </div>

        {/* Real-time Pro-Forma Outcome */}
        <div className="bg-slate-50 border border-blue-200 rounded-xl p-4.5 space-y-3 relative z-10">
          <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-200">
            <span className="font-bold text-slate-700 uppercase tracking-wider">Projected P&L Impact</span>
            <span className="font-mono font-bold text-emerald-700">+${(deltaProfit / 1000).toFixed(0)}k Profit Lift</span>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-[11px] text-slate-500 font-semibold">Total Revenue</span>
              <p className="text-base font-extrabold text-emerald-700 font-mono mt-0.5">${(simulatedRevenue / 1000000).toFixed(2)}M</p>
            </div>
            <div className="bg-white p-3 rounded-xl border border-blue-200 shadow-xs">
              <span className="text-[11px] text-slate-500 font-semibold">Net Profit</span>
              <p className="text-base font-extrabold text-blue-700 font-mono mt-0.5">+${(simulatedProfit / 1000000).toFixed(2)}M</p>
            </div>
            <div className="bg-white p-3 rounded-xl border border-blue-200 shadow-xs">
              <span className="text-[11px] text-slate-500 font-semibold">Net Margin</span>
              <p className="text-base font-extrabold text-blue-800 font-mono mt-0.5">{simulatedMargin}%</p>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-200 relative z-10">
          <button
            onClick={handleReset}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 border border-slate-200 rounded-lg transition-colors inline-flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Reset Baselines
          </button>
          
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 border border-slate-200 rounded-lg cursor-pointer"
            >
              Done
            </button>
            <button
              onClick={handleApply}
              className="px-4 py-2 text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 rounded-lg shadow-xs transition-all cursor-pointer"
            >
              Run Simulation
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
