import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { 
  BusinessRecord, 
  DepartmentSummary, 
  RegionSummary, 
  TimePeriodSummary, 
  TotalMetrics, 
  OperationalRisk, 
  StrategicRecommendation, 
  ProcessedAuditData, 
  DatasetInfo,
  RiskLevel
} from '../types';
import { RAW_CSV_DATA } from '../data/businessData';

// Helper: Normalize header keys for resilient column detection
function normalizeKey(key: string): string {
  return key.toLowerCase().replace(/[^a-z0-9]/g, '');
}

// Helper: Parse number from strings like "$120,000", "5.2%", " 180000 "
function parseNumeric(val: any, fallback: number = 0): number {
  if (val === null || val === undefined || val === '') return fallback;
  if (typeof val === 'number') return isNaN(val) ? fallback : val;
  const cleaned = String(val).replace(/[\$,%]/g, '').trim();
  const num = parseFloat(cleaned);
  return isNaN(num) ? fallback : num;
}

// Helper: Format Excel date number or string date
function parseDateString(val: any): string {
  if (!val) return new Date().toISOString().split('T')[0];
  
  // Check if Excel serial date number
  if (typeof val === 'number' && val > 20000 && val < 60000) {
    const jsDate = new Date(Math.round((val - 25569) * 86400 * 1000));
    return jsDate.toISOString().split('T')[0];
  }

  const str = String(val).trim();
  // If already YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(str)) return str;

  // Attempt Date.parse
  const parsed = new Date(str);
  if (!isNaN(parsed.getTime())) {
    return parsed.toISOString().split('T')[0];
  }

  return str;
}

// Process raw array of objects into structured ProcessedAuditData
export function processRawRecords(
  rawRows: Array<Record<string, any>>, 
  info: DatasetInfo
): ProcessedAuditData {
  if (!rawRows || rawRows.length === 0) {
    return getDefaultAuditData();
  }

  // Find column keys in raw data
  const sample = rawRows[0] || {};
  const keys = Object.keys(sample);

  const findKey = (candidates: string[]): string | undefined => {
    return keys.find(k => {
      const norm = normalizeKey(k);
      return candidates.some(c => norm === normalizeKey(c) || norm.includes(normalizeKey(c)));
    });
  };

  const dateKey = findKey(['date', 'month', 'period', 'quarter', 'time', 'yearmonth']) || 'Date';
  const deptKey = findKey(['department', 'dept', 'function', 'team', 'division', 'unit']) || 'Department';
  const regionKey = findKey(['region', 'territory', 'geo', 'geography', 'location', 'market', 'country']) || 'Region';
  const spendKey = findKey(['monthlyspendusd', 'monthlyspend', 'spend', 'cost', 'expenses', 'budget', 'expenditure']) || 'Monthly_Spend_USD';
  const revKey = findKey(['monthlyrevenueusd', 'monthlyrevenue', 'revenue', 'sales', 'income', 'turnover']) || 'Monthly_Revenue_USD';
  const csatKey = findKey(['customersatisfactionscore', 'csat', 'satisfaction', 'score', 'rating']) || 'Customer_Satisfaction_Score';
  const churnKey = findKey(['churnratepct', 'churnrate', 'churn', 'attrition', 'churnpct']) || 'Churn_Rate_Pct';
  const riskKey = findKey(['risklevel', 'risk', 'severity']) || 'Risk_Level';

  const validRecords: BusinessRecord[] = [];

  rawRows.forEach((row, idx) => {
    const rawDept = String(row[deptKey] || 'General').trim();
    const rawRegion = String(row[regionKey] || 'Global').trim();
    const date = parseDateString(row[dateKey]);
    const spend = parseNumeric(row[spendKey], 0);
    const revenue = parseNumeric(row[revKey], 0);
    const csat = Math.min(10, Math.max(0, parseNumeric(row[csatKey], 8.0)));
    const churn = Math.max(0, parseNumeric(row[churnKey], 0.0));

    // Calculate derived financial unit economics
    const netProfitUSD = revenue - spend;
    const profitMarginPct = revenue > 0 ? (netProfitUSD / revenue) * 100 : 0;
    const roiMultiple = spend > 0 ? revenue / spend : 0;

    // Determine risk level
    let riskLevel: RiskLevel = 'Low';
    const rawRisk = row[riskKey] ? String(row[riskKey]).toLowerCase().trim() : '';
    if (rawRisk.includes('high')) {
      riskLevel = 'High';
    } else if (rawRisk.includes('med')) {
      riskLevel = 'Medium';
    } else if (rawRisk.includes('low')) {
      riskLevel = 'Low';
    } else {
      // Auto-classify based on churn and economics
      if (churn >= 5.0 || (revenue > 0 && profitMarginPct < -10) || (spend > 100000 && revenue === 0 && csat < 7.5)) {
        riskLevel = 'High';
      } else if (churn >= 2.5 || netProfitUSD < 0 || csat < 7.8) {
        riskLevel = 'Medium';
      } else {
        riskLevel = 'Low';
      }
    }

    if (rawDept && rawRegion) {
      validRecords.push({
        id: `rec-${idx + 1}`,
        date,
        department: rawDept,
        region: rawRegion,
        monthlySpendUSD: Math.round(spend),
        monthlyRevenueUSD: Math.round(revenue),
        customerSatisfactionScore: Number(csat.toFixed(2)),
        churnRatePct: Number(churn.toFixed(2)),
        riskLevel,
        netProfitUSD: Math.round(netProfitUSD),
        profitMarginPct: Number(profitMarginPct.toFixed(2)),
        roiMultiple: Number(roiMultiple.toFixed(2))
      });
    }
  });

  if (validRecords.length === 0) {
    return getDefaultAuditData();
  }

  // Aggregate Total Metrics
  const totalRevenue = validRecords.reduce((acc, r) => acc + r.monthlyRevenueUSD, 0);
  const totalSpend = validRecords.reduce((acc, r) => acc + r.monthlySpendUSD, 0);
  const netProfit = totalRevenue - totalSpend;
  const profitMarginPct = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;
  const avgCSAT = validRecords.reduce((acc, r) => acc + r.customerSatisfactionScore, 0) / validRecords.length;
  
  const customerFacingRecords = validRecords.filter(r => r.churnRatePct > 0 || r.monthlyRevenueUSD > 0);
  const avgChurnPctCustomerFacing = customerFacingRecords.length > 0 
    ? customerFacingRecords.reduce((acc, r) => acc + r.churnRatePct, 0) / customerFacingRecords.length 
    : 0;
  const overallAvgChurnPct = validRecords.reduce((acc, r) => acc + r.churnRatePct, 0) / validRecords.length;

  const riskDistribution = {
    high: validRecords.filter(r => r.riskLevel === 'High').length,
    medium: validRecords.filter(r => r.riskLevel === 'Medium').length,
    low: validRecords.filter(r => r.riskLevel === 'Low').length,
  };

  const totalMetrics: TotalMetrics = {
    totalRevenue,
    totalSpend,
    netProfit,
    profitMarginPct: Number(profitMarginPct.toFixed(2)),
    avgCSAT: Number(avgCSAT.toFixed(2)),
    avgChurnPctCustomerFacing: Number(avgChurnPctCustomerFacing.toFixed(2)),
    overallAvgChurnPct: Number(overallAvgChurnPct.toFixed(2)),
    riskDistribution
  };

  // Distinct Regions and Departments
  const regions = Array.from(new Set(validRecords.map(r => r.region)));
  const departments = Array.from(new Set(validRecords.map(r => r.department)));

  // Regional Summaries
  const regionalSummaries: Record<string, RegionSummary> = {};
  regions.forEach(region => {
    const regRecords = validRecords.filter(r => r.region === region);
    const rSpend = regRecords.reduce((acc, r) => acc + r.monthlySpendUSD, 0);
    const rRev = regRecords.reduce((acc, r) => acc + r.monthlyRevenueUSD, 0);
    const rNet = rRev - rSpend;
    const rMargin = rRev > 0 ? (rNet / rRev) * 100 : 0;
    const rCSAT = regRecords.reduce((acc, r) => acc + r.customerSatisfactionScore, 0) / regRecords.length;
    const rChurn = regRecords.reduce((acc, r) => acc + r.churnRatePct, 0) / regRecords.length;

    regionalSummaries[region] = {
      region,
      totalSpend: rSpend,
      totalRevenue: rRev,
      netProfit: rNet,
      profitMarginPct: Number(rMargin.toFixed(2)),
      avgCSAT: Number(rCSAT.toFixed(2)),
      avgChurnPct: Number(rChurn.toFixed(2)),
      highRiskCount: regRecords.filter(r => r.riskLevel === 'High').length,
      mediumRiskCount: regRecords.filter(r => r.riskLevel === 'Medium').length,
      lowRiskCount: regRecords.filter(r => r.riskLevel === 'Low').length,
      recordCount: regRecords.length
    };
  });

  // Department Summaries
  const departmentSummaries: Record<string, DepartmentSummary> = {};
  departments.forEach(dept => {
    const deptRecords = validRecords.filter(r => r.department === dept);
    const dSpend = deptRecords.reduce((acc, r) => acc + r.monthlySpendUSD, 0);
    const dRev = deptRecords.reduce((acc, r) => acc + r.monthlyRevenueUSD, 0);
    const dNet = dRev - dSpend;
    const dMargin = dRev > 0 ? (dNet / dRev) * 100 : 0;
    const dROI = dSpend > 0 ? dRev / dSpend : 0;
    const dCSAT = deptRecords.reduce((acc, r) => acc + r.customerSatisfactionScore, 0) / deptRecords.length;
    const dChurn = deptRecords.reduce((acc, r) => acc + r.churnRatePct, 0) / deptRecords.length;

    departmentSummaries[dept] = {
      department: dept,
      totalSpend: dSpend,
      totalRevenue: dRev,
      netProfit: dNet,
      profitMarginPct: Number(dMargin.toFixed(2)),
      roiMultiple: Number(dROI.toFixed(2)),
      avgCSAT: Number(dCSAT.toFixed(2)),
      avgChurnPct: Number(dChurn.toFixed(2)),
      highRiskCount: deptRecords.filter(r => r.riskLevel === 'High').length,
      mediumRiskCount: deptRecords.filter(r => r.riskLevel === 'Medium').length,
      lowRiskCount: deptRecords.filter(r => r.riskLevel === 'Low').length,
      spendSharePct: totalSpend > 0 ? Number(((dSpend / totalSpend) * 100).toFixed(2)) : 0,
      revenueSharePct: totalRevenue > 0 ? Number(((dRev / totalRevenue) * 100).toFixed(2)) : 0
    };
  });

  // Time Period Summaries (grouped by Date)
  const uniqueDates = Array.from(new Set(validRecords.map(r => r.date))).sort();
  const timePeriodSummaries: TimePeriodSummary[] = uniqueDates.map(dateStr => {
    const periodRecords = validRecords.filter(r => r.date === dateStr);
    const pSpend = periodRecords.reduce((acc, r) => acc + r.monthlySpendUSD, 0);
    const pRev = periodRecords.reduce((acc, r) => acc + r.monthlyRevenueUSD, 0);
    const pNet = pRev - pSpend;
    const pMargin = pRev > 0 ? (pNet / pRev) * 100 : 0;
    const pCSAT = periodRecords.reduce((acc, r) => acc + r.customerSatisfactionScore, 0) / periodRecords.length;
    const pChurn = periodRecords.reduce((acc, r) => acc + r.churnRatePct, 0) / periodRecords.length;
    
    // Dominant region in this period
    const regionCounts: Record<string, number> = {};
    periodRecords.forEach(r => { regionCounts[r.region] = (regionCounts[r.region] || 0) + 1; });
    const dominantRegion = Object.keys(regionCounts).sort((a, b) => regionCounts[b] - regionCounts[a])[0] || 'Multi-Region';

    return {
      date: dateStr,
      formattedDate: `${dateStr} (${dominantRegion})`,
      region: dominantRegion,
      totalSpend: pSpend,
      totalRevenue: pRev,
      netProfit: pNet,
      profitMarginPct: Number(pMargin.toFixed(2)),
      avgCSAT: Number(pCSAT.toFixed(2)),
      avgChurnPct: Number(pChurn.toFixed(2)),
      highRiskCount: periodRecords.filter(r => r.riskLevel === 'High').length
    };
  });

  // Auto-generate Data-Driven Operational Risks
  const operationalRisks: OperationalRisk[] = [];

  // Risk 1: Unprofitable Region / Worst Performing Theater
  const sortedRegionsByProfit = [...regions].sort((a, b) => (regionalSummaries[a]?.netProfit || 0) - (regionalSummaries[b]?.netProfit || 0));
  const worstRegion = sortedRegionsByProfit[0];
  if (worstRegion && regionalSummaries[worstRegion]) {
    const wr = regionalSummaries[worstRegion];
    const isLoss = wr.netProfit < 0;
    operationalRisks.push({
      id: 'risk-1',
      title: isLoss ? `Severe ${worstRegion} Profit Drainage & Market Attrition` : `${worstRegion} Margin Optimization Opportunity`,
      severity: isLoss ? 'High' : 'Medium',
      category: 'Regional Market Health',
      department: 'Regional Operations',
      region: worstRegion,
      metricsImpacted: `Net Profit ${wr.netProfit < 0 ? '-' : '+'}$${Math.abs(wr.netProfit / 1000).toFixed(0)}k, CSAT ${wr.avgCSAT.toFixed(2)}, Churn ${wr.avgChurnPct.toFixed(1)}%`,
      description: `${worstRegion} generated $${(wr.totalRevenue / 1000000).toFixed(2)}M in revenue against $${(wr.totalSpend / 1000000).toFixed(2)}M in spend (${wr.profitMarginPct}% margin), representing a key geographic focus area with ${wr.highRiskCount} high-risk incidents.`,
      rootCause: 'Regional go-to-market friction, misaligned customer onboarding, or localized pricing challenges.',
      trend: isLoss ? 'Active Capital Deficit' : 'Sub-optimal Margin Drag'
    });
  }

  // Risk 2: Highest Churn Department
  const sortedDeptsByChurn = [...departments].sort((a, b) => (departmentSummaries[b]?.avgChurnPct || 0) - (departmentSummaries[a]?.avgChurnPct || 0));
  const highestChurnDept = sortedDeptsByChurn[0];
  if (highestChurnDept && departmentSummaries[highestChurnDept]) {
    const hd = departmentSummaries[highestChurnDept];
    operationalRisks.push({
      id: 'risk-2',
      title: `${highestChurnDept} Cohort Volatility & Retention Friction`,
      severity: hd.avgChurnPct > 3.5 || hd.highRiskCount >= 2 ? 'High' : 'Medium',
      category: 'Customer Retention & Unit Economics',
      department: highestChurnDept,
      region: 'Global',
      metricsImpacted: `Avg Churn ${hd.avgChurnPct.toFixed(2)}%, ${hd.highRiskCount} High Risk Flags`,
      description: `${highestChurnDept} generated $${(hd.totalRevenue / 1000000).toFixed(2)}M in top-line revenue on $${(hd.totalSpend / 1000).toFixed(0)}k spend, but customer cohorts show elevated churn deviations.`,
      rootCause: 'Low-intent customer qualification, aggressive top-of-funnel targeting, or onboarding gap.',
      trend: hd.highRiskCount > 0 ? 'Requires Immediate Playbook Calibration' : 'Moderate Churn Trajectory'
    });
  }

  // Risk 3: Heavy Overhead / Non-Revenue Cost Centers
  const costCenterDepts = departments.filter(d => (departmentSummaries[d]?.totalRevenue || 0) === 0);
  const totalCostCenterSpend = costCenterDepts.reduce((acc, d) => acc + (departmentSummaries[d]?.totalSpend || 0), 0);
  if (costCenterDepts.length > 0) {
    const costShare = totalSpend > 0 ? ((totalCostCenterSpend / totalSpend) * 100).toFixed(1) : '0';
    operationalRisks.push({
      id: 'risk-3',
      title: `Overhead Burden Across ${costCenterDepts.join(', ')}`,
      severity: Number(costShare) > 40 ? 'Medium' : 'Low',
      category: 'Fixed Cost & R&D Structure',
      department: costCenterDepts.join(', '),
      region: 'Enterprise Wide',
      metricsImpacted: `$${(totalCostCenterSpend / 1000000).toFixed(2)}M spend (${costShare}% of total organizational budget)`,
      description: `Supportive infrastructure and operational teams consume $${(totalCostCenterSpend / 1000000).toFixed(2)}M in operational expenditure without direct commercial billing.`,
      rootCause: 'Team expansion, server/cloud infrastructure, and fixed administrative overhead.',
      trend: 'Escalating run-rate requiring value-stream mapping'
    });
  }

  // Risk 4: High CSAT Team with Low Budget
  const highestCSATDept = [...departments].sort((a, b) => (departmentSummaries[b]?.avgCSAT || 0) - (departmentSummaries[a]?.avgCSAT || 0))[0];
  if (highestCSATDept && departmentSummaries[highestCSATDept]) {
    const cs = departmentSummaries[highestCSATDept];
    operationalRisks.push({
      id: 'risk-4',
      title: `${highestCSATDept} Retention Leverage vs. Budget Allocation`,
      severity: 'Low',
      category: 'Resource Allocation Asymmetry',
      department: highestCSATDept,
      region: 'Enterprise Wide',
      metricsImpacted: `CSAT ${cs.avgCSAT.toFixed(2)} / 10, receiving ${cs.spendSharePct}% of budget`,
      description: `${highestCSATDept} delivers premier customer satisfaction scores (${cs.avgCSAT.toFixed(2)} / 10) and low churn (${cs.avgChurnPct.toFixed(2)}%), representing high expansion leverage for the business.`,
      rootCause: 'Historical budgeting as a cost center rather than an account expansion driver.',
      trend: 'Prime opportunity for resource multiplier'
    });
  }

  // Auto-generate Data-Driven Strategic Recommendations
  const bestRegion = [...regions].sort((a, b) => (regionalSummaries[b]?.netProfit || 0) - (regionalSummaries[a]?.netProfit || 0))[0] || 'Primary Market';
  const highestROIDept = [...departments].sort((a, b) => (departmentSummaries[b]?.roiMultiple || 0) - (departmentSummaries[a]?.roiMultiple || 0))[0] || 'Sales';

  const strategicRecommendations: StrategicRecommendation[] = [
    {
      id: 'rec-1',
      number: 1,
      title: `Turnaround & Localize ${worstRegion || 'Deficit Market'} Operational Model`,
      priority: 'Immediate (0-90 Days)',
      targetDepartment: `${worstRegion} Leadership & Commercial Pods`,
      expectedFinancialImpact: `+$${Math.max(150, Math.round(Math.abs(regionalSummaries[worstRegion]?.netProfit || 100000) * 1.5 / 1000))}k Annual Margin Improvement`,
      kpiTarget: `Reduce Churn to < 2.5% | Lift Regional CSAT to > 8.20`,
      summary: `Halt uncalibrated broad spending in ${worstRegion}. Pivot regional focus to high-retention enterprise accounts and localized customer success support.`,
      actionPlan: [
        `Audit marketing and sales acquisition channels in ${worstRegion} to eliminate leaky customer cohorts.`,
        `Reallocate 20% of regional top-of-funnel spend toward technical onboarding and localized account management.`,
        `Establish specialized retention pods modeled after high-performing ${bestRegion} benchmarks.`
      ]
    },
    {
      id: 'rec-2',
      number: 2,
      title: `Aggressively Scale High-ROI Growth Engines in ${bestRegion}`,
      priority: 'Near-Term (30-180 Days)',
      targetDepartment: `${highestROIDept} & Executive Leadership`,
      expectedFinancialImpact: `+$${Math.round(totalRevenue * 0.15 / 1000)}k Additional Top-Line Expansion`,
      kpiTarget: `Maintain ${highestROIDept} ROI > 3.0x | Keep Core Churn < 1.5%`,
      summary: `Double down on proven market strength in ${bestRegion} and high-efficiency revenue drivers like ${highestROIDept} to maximize operating leverage.`,
      actionPlan: [
        `Expand sales capacity and deal packaging across tier-1 regional accounts where conversion velocity is highest.`,
        `Introduce high-tier premium SLAs packaged with dedicated support and retention guarantees.`,
        `Bridge marketing campaigns directly to high-margin accounts to sustain above-benchmark conversion efficiency.`
      ]
    },
    {
      id: 'rec-3',
      number: 3,
      title: 'Implement Value-Stream Accountability & R&D Overhead Monetization',
      priority: 'Medium-Term (60-360 Days)',
      targetDepartment: 'Engineering, Product & Finance',
      expectedFinancialImpact: '10-15% Fixed Overhead Efficiency & Reinvestment',
      kpiTarget: 'Link 70%+ of operational sprint capacity to commercial impact',
      summary: `Align internal fixed expenditures with direct business outcomes, establishing clear telemetry for infrastructure ROI and customer satisfaction impact.`,
      actionPlan: [
        'Establish quarterly unit-cost reviews for cloud, tooling, and operational headcount allocations.',
        'Transition internal technical capabilities into commercial add-ons and self-service features.',
        'Standardize cross-departmental risk reviews to catch operational bottlenecks prior to execution.'
      ]
    }
  ];

  // Convert valid records to CSV string for export
  const rawCSV = Papa.unparse(validRecords.map(r => ({
    Date: r.date,
    Department: r.department,
    Region: r.region,
    Monthly_Spend_USD: r.monthlySpendUSD,
    Monthly_Revenue_USD: r.monthlyRevenueUSD,
    Customer_Satisfaction_Score: r.customerSatisfactionScore,
    Churn_Rate_Pct: r.churnRatePct,
    Risk_Level: r.riskLevel
  })));

  return {
    datasetInfo: {
      ...info,
      recordCount: validRecords.length
    },
    records: validRecords,
    totalMetrics,
    regions,
    departments,
    regionalSummaries,
    departmentSummaries,
    timePeriodSummaries,
    operationalRisks,
    strategicRecommendations,
    rawCSV
  };
}

// Parse CSV text string
export function parseCSVData(csvText: string, fileName: string = 'uploaded_data.csv'): ProcessedAuditData {
  const parsed = Papa.parse<Record<string, any>>(csvText, {
    header: true,
    skipEmptyLines: true,
    dynamicTyping: false
  });

  return processRawRecords(parsed.data, {
    fileName,
    fileType: 'csv',
    uploadedAt: new Date().toLocaleTimeString(),
    recordCount: parsed.data.length,
    isCustom: true
  });
}

// Parse Excel binary buffer (XLSX / XLS)
export function parseExcelBuffer(buffer: ArrayBuffer, fileName: string = 'uploaded_data.xlsx'): ProcessedAuditData {
  const workbook = XLSX.read(buffer, { type: 'array' });
  const firstSheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[firstSheetName];
  const rawJson = XLSX.utils.sheet_to_json<Record<string, any>>(worksheet, { defval: '' });

  return processRawRecords(rawJson, {
    fileName,
    fileType: fileName.endsWith('.xls') ? 'xls' : 'xlsx',
    uploadedAt: new Date().toLocaleTimeString(),
    recordCount: rawJson.length,
    isCustom: true
  });
}

// Default initial dataset
export function getDefaultAuditData(): ProcessedAuditData {
  const parsed = Papa.parse<Record<string, any>>(RAW_CSV_DATA, {
    header: true,
    skipEmptyLines: true
  });

  return processRawRecords(parsed.data, {
    fileName: 'FY2025_Rightuu_Audit_Master.csv',
    fileType: 'sample',
    uploadedAt: 'Default Baseline',
    recordCount: parsed.data.length,
    isCustom: false
  });
}

// Generate a downloadable sample Excel workbook template
export function generateSampleExcelBlob(): Blob {
  const parsed = Papa.parse<Record<string, any>>(RAW_CSV_DATA, {
    header: true,
    skipEmptyLines: true
  });
  const ws = XLSX.utils.json_to_sheet(parsed.data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Audit_Records');
  const wbOut = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  return new Blob([wbOut], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
}
